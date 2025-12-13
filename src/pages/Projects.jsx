// src/pages/Projects.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Projects() {
  const { auth } = useAuth();

  // --- State ---
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [availableBudget, setAvailableBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- New Project Form ---
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [projectStatus, setProjectStatus] = useState("ONGOING");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Activities & Feedback ---
  const [activitiesMap, setActivitiesMap] = useState({});
  const [newActivityMap, setNewActivityMap] = useState({});
  const [feedbacksMap, setFeedbacksMap] = useState({});
  const [feedbackInputMap, setFeedbackInputMap] = useState({});
  const [ratingInputMap, setRatingInputMap] = useState({});

  // --- Fetch Projects & Plans ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    axios.get(`${API_URL}/api/documents?type=Project Plan`, { headers })
      .then(res => setPlans(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => {
    if (!auth?.token || projects.length === 0) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    const fetchActivities = async () => {
      const map = {};
      for (const proj of projects) {
        try {
          const res = await axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers });
          map[proj.projectId] = res.data;
        } catch (err) {
          console.error(err);
        }
      }
      setActivitiesMap(map);
    };

    fetchActivities();
  }, [projects, auth]);

  // --- Update available budget ---
  useEffect(() => {
    if (!selectedPlanId) return;
    const plan = plans.find(p => p.documentId === Number(selectedPlanId));
    if (!plan) return;
    const used = projects
      .filter(p => p.planDocumentId === plan.documentId)
      .reduce((sum, p) => sum + Number(p.allocatedBudget || 0), 0);
    setAvailableBudget(plan.totalBudget - used);
  }, [selectedPlanId, projects, plans]);

  // --- File Preview ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocumentFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setDocumentPreview(reader.result);
      reader.readAsDataURL(file);
    } else setDocumentPreview(null);
  };

  // --- Add Project ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectName || !description || !allocatedBudget || !selectedPlanId) {
      alert("Fill all required fields!");
      return;
    }
    if (Number(allocatedBudget) > availableBudget) {
      alert("Allocated budget exceeds available budget!");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("allocatedBudget", allocatedBudget);
    formData.append("projectStatus", projectStatus);
    formData.append("planDocumentId", selectedPlanId);
    if (documentFile) formData.append("document", documentFile);
    formData.append("userId", Number(auth.userId));

    try {
      setSubmitting(true);
      const headers = { Authorization: `Bearer ${auth.token}`, "Content-Type": "multipart/form-data" };
      const res = await axios.post(`${API_URL}/api/projects`, formData, { headers });
      setProjects([...projects, res.data]);

      // Reset form
      setProjectName("");
      setDescription("");
      setAllocatedBudget("");
      setProjectStatus("ONGOING");
      setDocumentFile(null);
      setDocumentPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Add Activity ---
  const handleAddActivity = async (projectId) => {
    const activity = newActivityMap[projectId];
    if (!activity || !activity.activityName || !activity.type) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${auth.token}` };
      const res = await axios.post(`${API_URL}/api/activities`, {
        activityName: activity.activityName,
        description: activity.description,
        date: activity.date || new Date().toISOString().split('T')[0],
        status: activity.status || "ONGOING",
        expenses: activity.expenses || 0,
        type: activity.type,
        projectId
      }, { headers });

      // Update activities for this project immediately
      setActivitiesMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data]
      }));

      // Reset the form for this project
      setNewActivityMap(prev => ({
        ...prev,
        [projectId]: { activityName: "", description: "", date: new Date().toISOString().split('T')[0], expenses: 0, type: "Report" }
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to add activity");
    }
  };

  // --- Add Citizen Feedback ---
  const handleAddFeedback = async (projectId) => {
    const content = feedbackInputMap[projectId] || "";
    const rating = ratingInputMap[projectId] || 0;
    if (!content || rating <= 0) return;

    try {
      const headers = { Authorization: `Bearer ${auth.token}` };
      const res = await axios.post(`${API_URL}/api/projects/${projectId}/feedbacks`, {
        content,
        rating,
        userId: auth.userId
      }, { headers });

      setFeedbacksMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data]
      }));

      setFeedbackInputMap(prev => ({ ...prev, [projectId]: "" }));
      setRatingInputMap(prev => ({ ...prev, [projectId]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Compute Average Rating ---
  const computeAvgRating = (projectId) => {
    const feedbacks = feedbacksMap[projectId] || [];
    if (feedbacks.length === 0) return 0;
    return (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);
  };

  // --- Carousel Settings ---
  const sliderSettings = { dots: true, infinite: false, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-[#4B3A2F]">Projects</h1>

      {/* Add Project Form */}
      {auth.role === "ADMIN" && (
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
            <select value={selectedPlanId || ""} onChange={e => setSelectedPlanId(e.target.value)} className="p-3 border rounded" required>
              <option value="" disabled>Select a Project Plan</option>
              {plans.map(plan => (
                <option key={plan.documentId} value={plan.documentId}>
                  {plan.documentTitle} - Total Budget: ₱{plan.totalBudget.toLocaleString()}
                </option>
              ))}
            </select>

            <input type="text" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} className="p-3 border rounded" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-3 border rounded" required />
            <input type="number" placeholder="Allocated Budget" value={allocatedBudget} onChange={e => setAllocatedBudget(e.target.value)} className="p-3 border rounded" max={availableBudget} required />
            <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="p-3 border rounded">
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <label className="block mb-1 font-semibold">Upload Document</label>
            <input type="file" onChange={handleFileChange} className="p-3 border rounded w-full" />
            {documentPreview && <img src={documentPreview} alt="Preview" className="max-h-40 rounded border mt-2" />}

            <button type="submit" disabled={submitting} className="bg-[#FF6404] text-white p-3 rounded font-semibold hover:bg-[#e55a00]">
              {submitting ? "Adding..." : "Add Project"}
            </button>
          </form>
          <p className="mt-2 font-semibold">Available Budget: ₱{availableBudget.toLocaleString()}</p>
        </div>
      )}

      {/* Projects Carousel */}
      <Slider {...sliderSettings}>
        {projects.map(proj => {
          const activities = activitiesMap[proj.projectId] || [];
          const avgRating = computeAvgRating(proj.projectId);

          return (
            <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow mx-2">
              <h3 className="text-xl font-semibold">{proj.projectName}</h3>
              <p>{proj.description}</p>
              <p><strong>Allocated Budget:</strong> ₱{proj.allocatedBudget}</p>
              <p><strong>Status:</strong> {proj.projectStatus}</p>
              <p><strong>Spent:</strong> ₱{activities.filter(a => a.type === "Expense").reduce((sum, a) => sum + Number(a.expenses || 0), 0).toLocaleString()}</p>
              <p><strong>Average Rating:</strong> {avgRating} ⭐</p>

              {/* Activities Section */}
              {auth.role === "ADMIN" && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold">Recent Activities</h4>
                  {activities.map(a => (
                    <div key={a.activityId} className="border-b py-1">
                      <p><strong>{a.type}:</strong> {a.activityName}</p>
                      <p>{a.description}</p>
                      {a.type === "Expense" && <p className="text-sm">Amount: ₱{a.expenses.toLocaleString()}</p>}
                    </div>
                  ))}

                  {/* Add Activity */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Activity Name"
                      value={newActivityMap[proj.projectId]?.activityName || ""}
                      onChange={e => setNewActivityMap(prev => ({
                        ...prev,
                        [proj.projectId]: { ...prev[proj.projectId], activityName: e.target.value, type: prev[proj.projectId]?.type || "Report" }
                      }))}
                      className="p-2 border rounded w-full mb-2"
                    />
                    <textarea
                      placeholder="Description"
                      value={newActivityMap[proj.projectId]?.description || ""}
                      onChange={e => setNewActivityMap(prev => ({
                        ...prev,
                        [proj.projectId]: { ...prev[proj.projectId], description: e.target.value }
                      }))}
                      className="p-2 border rounded w-full mb-2"
                    />
                    <input
                      type="date"
                      value={newActivityMap[proj.projectId]?.date || new Date().toISOString().split('T')[0]}
                      onChange={e => setNewActivityMap(prev => ({
                        ...prev,
                        [proj.projectId]: { ...prev[proj.projectId], date: e.target.value }
                      }))}
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <select
                      value={newActivityMap[proj.projectId]?.type || "Report"}
                      onChange={e => setNewActivityMap(prev => ({
                        ...prev,
                        [proj.projectId]: { ...prev[proj.projectId], type: e.target.value }
                      }))}
                      className="p-2 border rounded mb-2"
                    >
                      <option value="Report">Report / Documentation</option>
                      <option value="Expense">Expense</option>
                    </select>
                    {newActivityMap[proj.projectId]?.type === "Expense" && (
                      <input
                        type="number"
                        placeholder="Amount"
                        value={newActivityMap[proj.projectId]?.expenses || 0}
                        onChange={e => setNewActivityMap(prev => ({
                          ...prev,
                          [proj.projectId]: { ...prev[proj.projectId], expenses: Number(e.target.value) }
                        }))}
                        className="p-2 border rounded mb-2 w-full"
                      />
                    )}
                    <button onClick={() => handleAddActivity(proj.projectId)} className="px-3 py-1 bg-[#4B3A2F] text-white rounded">
                      Add Activity
                    </button>
                  </div>
                </div>
              )}

              {/* Citizen Feedback */}
              {auth.role === "CITIZEN" && (
                <div className="mt-4">
                  <h4 className="font-semibold">Leave Feedback & Rating</h4>
                  <textarea
                    value={feedbackInputMap[proj.projectId] || ""}
                    onChange={e => setFeedbackInputMap(prev => ({ ...prev, [proj.projectId]: e.target.value }))}
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Your feedback"
                  />
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={ratingInputMap[proj.projectId] || 0}
                    onChange={e => setRatingInputMap(prev => ({ ...prev, [proj.projectId]: Number(e.target.value) }))}
                    className="border rounded p-2 w-20"
                  />
                  <button onClick={() => handleAddFeedback(proj.projectId)} className="ml-2 px-2 py-1 bg-[#4B3A2F] text-white rounded">Submit</button>

                  <div className="mt-2 max-h-40 overflow-y-auto border-t pt-2">
                    {(feedbacksMap[proj.projectId] || []).map((f, i) => (
                      <div key={i} className="border-b py-1">
                        <p><strong>{f.user?.fName || "Anonymous"}:</strong> {f.content}</p>
                        <p className="text-xs">Rating: {f.rating} ⭐</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Projects;
