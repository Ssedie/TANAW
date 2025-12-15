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
  const [allocatedBudget, setAllocatedBudget] = useState(0);
  const [projectType, setProjectType] = useState("");
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
  const [expandedFeedback, setExpandedFeedback] = useState({});

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

  useEffect(() => {
    if (!selectedPlanId) {
      setAvailableBudget(0);
      return;
    }

    const plan = plans.find(p => p.documentId === Number(selectedPlanId));
    if (!plan) return;

    const usedBudget = projects
      .filter(p => p.documentId === plan.documentId)
      .reduce((sum, p) => sum + Number(p.allocatedBudget || 0), 0);

    const remaining = plan.totalBudget - usedBudget;
    setAvailableBudget(remaining > 0 ? remaining : 0);
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

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    if (value > availableBudget) {
      alert("Allocated budget exceeds available budget for this project plan!");
      return;
    }
    setAllocatedBudget(value);
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
    formData.append("projectType", projectType);
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
      setProjectType("");
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

      setActivitiesMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data]
      }));

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
    if (!content.trim() || rating <= 0) {
      alert("Please provide feedback and a rating");
      return;
    }

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
      alert("Failed to submit feedback");
    }
  };

  // --- Compute Average Rating ---
  const computeAvgRating = (projectId) => {
    const feedbacks = feedbacksMap[projectId] || [];
    if (feedbacks.length === 0) return 0;
    return (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);
  };

  // --- Star Rating Component ---
  const StarRating = ({ value, onChange, maxStars = 5 }) => (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`text-2xl transition ${i < value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-300`}
        >
          ★
        </button>
      ))}
    </div>
  );

  // --- Carousel Settings ---
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1.3 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

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
                  {plan.documentTitle} - Total Budget: ₱{(plan.totalBudget ?? 0).toLocaleString()}
                </option>
              ))}
            </select>

            <input type="text" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} className="p-3 border rounded" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-3 border rounded" required />
            <select
              value={projectType || ""}
              onChange={e => setProjectType(e.target.value)}
              className="p-3 border rounded"
              required
            >
              <option value="" disabled>Select Project Type</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="HEALTH">Health</option>
              <option value="EDUCATION">Education</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="GENERAL">General</option>
            </select>
            <input type="number" placeholder="Allocated Budget" value={allocatedBudget} onChange={handleBudgetChange} className="p-3 border rounded" max={availableBudget} required />
            <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="p-3 border rounded">
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <label className="block mb-1 font-semibold">Upload Document</label>
            <input type="file" onChange={handleFileChange} className="p-3 border rounded w-full" />
            {documentPreview && <img src={documentPreview} alt="Preview" className="max-h-40 rounded border mt-2" />}

            <button type="submit" disabled={submitting} className="bg-[#FF6404] text-white p-3 rounded font-semibold hover:bg-[#e55a00] disabled:opacity-50">
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
          const feedbacks = feedbacksMap[proj.projectId] || [];
          const showExpandedFeedback = expandedFeedback[proj.projectId];

          return (
            <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow mx-2 min-w-[280px]">
              <h3 className="text-2xl font-bold mb-2 text-[#4B3A2F]">{proj.projectName}</h3>
              <p className="text-gray-700 mb-4">{proj.description}</p>

              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold text-[#4B3A2F]">{proj.projectType || "General"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allocated Budget</p>
                  <p className="text-lg font-semibold text-[#FF6404]">₱{Number(proj.allocatedBudget).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-lg font-semibold ${proj.projectStatus === "COMPLETED" ? "text-green-600" : proj.projectStatus === "CANCELLED" ? "text-red-600" : "text-blue-600"}`}>
                    {proj.projectStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Citizen Rating</p>
                  <p className="text-lg font-semibold">{avgRating} ⭐</p>
                </div>
              </div>

              {/* Citizen Feedback Section */}
              {auth.role === "CITIZEN" && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold mb-4">Community Feedback</h4>

                  {/* Add Feedback Form */}
                  <div className="bg-[#FFF5F0] p-4 rounded-lg mb-6 border border-[#FFE0D6]">
                    <label className="block text-sm font-semibold text-[#4B3A2F] mb-2">Share Your Feedback</label>
                    <textarea
                      value={feedbackInputMap[proj.projectId] || ""}
                      onChange={e => setFeedbackInputMap(prev => ({ ...prev, [proj.projectId]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg p-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6404]"
                      placeholder="Tell us about your experience with this project..."
                      rows="3"
                    />

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-semibold text-[#4B3A2F] mb-2">Rate this project</label>
                        <StarRating
                          value={ratingInputMap[proj.projectId] || 0}
                          onChange={(val) => setRatingInputMap(prev => ({ ...prev, [proj.projectId]: val }))}
                        />
                      </div>
                      <button
                        onClick={() => handleAddFeedback(proj.projectId)}
                        className="px-6 py-2 bg-[#FF6404] text-white rounded-lg font-semibold hover:bg-[#e55a00] h-fit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  {/* Display Feedbacks */}
                  <div>
                    <button
                      onClick={() => setExpandedFeedback(prev => ({ ...prev, [proj.projectId]: !showExpandedFeedback }))}
                      className="text-sm font-semibold text-[#FF6404] hover:text-[#e55a00] mb-3"
                    >
                      {showExpandedFeedback ? "Hide" : "Show"} All Reviews ({feedbacks.length})
                    </button>

                    <div className={`space-y-3 ${showExpandedFeedback ? "max-h-96 overflow-y-auto" : "max-h-48 overflow-y-auto"}`}>
                      {feedbacks.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Be the first to share!</p>
                      ) : (
                        feedbacks.map((f, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold text-[#4B3A2F]">{f.user?.fName || "Anonymous"}</p>
                              <span className="text-yellow-400">{"★".repeat(f.rating)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{f.content}</p>
                          </div>
                        ))
                      )}
                    </div>
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
