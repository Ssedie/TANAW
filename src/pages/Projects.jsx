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
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [availableBudget, setAvailableBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");

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

  // --- Fetch Projects, Budgets & Fiscal Year ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects/fiscal-year/current`, { headers })
      .then(res => setCurrentFiscalYear(res.data.currentFiscalYear))
      .catch(console.error);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    axios.get(`${API_URL}/api/projects/budgets/document`, { headers })
      .then(res => {
        const currentYearBudgets = res.data.filter(b => b.fiscalYear === currentFiscalYear);
        setBudgets(currentYearBudgets);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  // --- Fetch Activities ---
  useEffect(() => {
    if (!auth?.token || projects.length === 0) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

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

  // --- Fetch Available Budget ---
  useEffect(() => {
    if (!selectedBudgetId || !auth?.token) {
      setAvailableBudget(0);
      return;
    }

    const headers = { Authorization: `Bearer ${auth.token}` };
    setBudgetLoading(true);

    axios.get(`${API_URL}/api/projects/budget/${selectedBudgetId}`, { headers })
      .then(res => setAvailableBudget(res.data.availableBudget))
      .catch(err => {
        console.error("Error fetching available budget:", err);
        setAvailableBudget(0);
      })
      .finally(() => setBudgetLoading(false));
  }, [selectedBudgetId, auth]);

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

  // --- Budget Change ---
  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    if (value > availableBudget) {
      alert("Allocated budget exceeds available budget!");
      return;
    }
    setAllocatedBudget(value);
  };

  // --- Add Project ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectName || !description || !allocatedBudget || !selectedBudgetId) {
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
    formData.append("budgetId", selectedBudgetId);
    if (documentFile) formData.append("document", documentFile);
    formData.append("userId", Number(auth.userId));

    try {
      setSubmitting(true);
      const headers = { Authorization: `Bearer ${auth.token}`, "Content-Type": "multipart/form-data" };
      const res = await axios.post(`${API_URL}/api/projects`, formData, { headers });
      setProjects([...projects, res.data]);

      setProjectName("");
      setDescription("");
      setAllocatedBudget("");
      setProjectType("");
      setProjectStatus("ONGOING");
      setDocumentFile(null);
      setDocumentPreview(null);

      const budgetHeaders = { Authorization: `Bearer ${auth.token}` };
      axios.get(`${API_URL}/api/projects/budget/${selectedBudgetId}`, { headers: budgetHeaders })
        .then(res => setAvailableBudget(res.data.availableBudget))
        .catch(console.error);

      alert("Project added successfully!");
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

  // --- Add Feedback ---
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
          className={`text-xl md:text-2xl transition ${i < value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-300`}
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
    slidesToShow: 3.3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-[#4B3A2F]">Projects</h1>
        {currentFiscalYear && (
          <div className="px-4 py-2 bg-blue-100 rounded-lg border border-blue-300">
            <p className="text-xs md:text-sm font-semibold text-blue-900">Fiscal Year: {currentFiscalYear}</p>
          </div>
        )}
      </div>

      {/* Add Project Form */}
      {auth.role === "ADMIN" && (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 max-w-4xl mx-auto w-full">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Add New Project</h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
            <select value={selectedBudgetId || ""} onChange={e => setSelectedBudgetId(e.target.value ? parseInt(e.target.value) : null)} className="p-2 md:p-3 border rounded text-sm md:text-base" required>
              <option value="" disabled>Select a Budget (Fiscal Year)</option>
              {budgets.map(budget => (
                <option key={budget.budgetId} value={budget.budgetId}>
                  FY {budget.fiscalYear} - ₱{(budget.totalBudget ?? 0).toLocaleString()}
                </option>
              ))}
            </select>

            <input type="text" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} className="p-2 md:p-3 border rounded text-sm md:text-base" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-2 md:p-3 border rounded text-sm md:text-base" required />
            <select value={projectType || ""} onChange={e => setProjectType(e.target.value)} className="p-2 md:p-3 border rounded text-sm md:text-base" required>
              <option value="" disabled>Select Project Type</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="HEALTH">Health</option>
              <option value="EDUCATION">Education</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="GENERAL">General</option>
            </select>
            <input type="number" placeholder="Allocated Budget" value={allocatedBudget} onChange={handleBudgetChange} className="p-2 md:p-3 border rounded text-sm md:text-base" max={availableBudget} required />
            <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="p-2 md:p-3 border rounded text-sm md:text-base">
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <label className="block mb-1 font-semibold text-sm md:text-base">Upload Document</label>
            <input type="file" onChange={handleFileChange} className="p-2 md:p-3 border rounded w-full text-sm" />
            {documentPreview && <img src={documentPreview} alt="Preview" className="max-h-32 md:max-h-40 rounded border mt-2" />}

            <button type="submit" disabled={submitting} className="bg-[#FF6404] text-white p-2 md:p-3 rounded font-semibold hover:bg-[#e55a00] disabled:opacity-50 text-sm md:text-base">
              {submitting ? "Adding..." : "Add Project"}
            </button>
          </form>
          <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {selectedBudgetId ? (
              <>
                <p className="font-semibold text-[#4B3A2F] text-sm md:text-base">
                  Available Budget: ₱{availableBudget.toLocaleString()}
                  {budgetLoading && <span className="text-xs md:text-sm text-gray-500 ml-2">(updating...)</span>}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">This updates in real-time from the server</p>
              </>
            ) : (
              <p className="text-xs md:text-sm text-gray-600">Select a budget to see available amount</p>
            )}
          </div>
        </div>
      )}

      {/* Projects Carousel */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
        <style>{`
          .slick-slide {
            display: flex !important;
            justify-content: center;
          }
          .slick-slide > div {
            width: 100%;
          }
        `}</style>
        <Slider {...sliderSettings}>
          {projects.map(proj => {
            const activities = activitiesMap[proj.projectId] || [];
            const feedbacks = feedbacksMap[proj.projectId] || [];
            const avgRating = computeAvgRating(proj.projectId);
            const showExpandedFeedback = expandedFeedback[proj.projectId];

            return (
              <div key={proj.projectId} className="!flex justify-center px-2">
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow flex flex-col w-full max-w-2xl">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#4B3A2F]">{proj.projectName}</h3>
                  <p className="text-sm md:text-base text-gray-700 mb-4 flex-grow">{proj.description}</p>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6 py-3 md:py-4 border-y border-gray-200">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Type</p>
                      <p className="text-sm md:text-lg font-semibold text-[#4B3A2F]">{proj.projectType || "General"}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Allocated Budget</p>
                      <p className="text-sm md:text-lg font-semibold text-[#FF6404]">₱{Number(proj.allocatedBudget).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Status</p>
                      <p className={`text-sm md:text-lg font-semibold ${proj.projectStatus === "COMPLETED" ? "text-green-600" : proj.projectStatus === "CANCELLED" ? "text-red-600" : "text-blue-600"}`}>
                        {proj.projectStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Rating</p>
                      <p className="text-sm md:text-lg font-semibold">{avgRating} ⭐</p>
                    </div>
                  </div>

                  {/* Admin Activities Section */}
                  {auth.role === "ADMIN" && (
                    <div className="mb-4 md:mb-6 border-t pt-4 md:pt-6">
                      <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Activities</h4>
                      <div className="max-h-40 md:max-h-48 overflow-y-auto mb-3 md:mb-4 bg-gray-50 rounded p-3">
                        {activities.length === 0 ? (
                          <p className="text-gray-500 text-xs md:text-sm">No activities yet</p>
                        ) : (
                          activities.map(a => (
                            <div key={a.activityId} className="border-b border-gray-200 py-2 last:border-b-0">
                              <p className="font-semibold text-sm text-[#4B3A2F]">{a.activityName}</p>
                              <p className="text-xs md:text-sm text-gray-600">{a.description}</p>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{a.type}</span>
                                {a.type === "Expense" && <span>₱{Number(a.expenses).toLocaleString()}</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Activity Form */}
                      <div className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-2">
                        <input type="text" placeholder="Activity Name" value={newActivityMap[proj.projectId]?.activityName || ""} onChange={e => setNewActivityMap(prev => ({ ...prev, [proj.projectId]: { ...prev[proj.projectId], activityName: e.target.value, type: prev[proj.projectId]?.type || "Report" } }))} className="p-2 border rounded w-full text-xs md:text-sm" />
                        <textarea placeholder="Description" value={newActivityMap[proj.projectId]?.description || ""} onChange={e => setNewActivityMap(prev => ({ ...prev, [proj.projectId]: { ...prev[proj.projectId], description: e.target.value } }))} className="p-2 border rounded w-full text-xs md:text-sm resize-none" rows="2" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="date" value={newActivityMap[proj.projectId]?.date || new Date().toISOString().split('T')[0]} onChange={e => setNewActivityMap(prev => ({ ...prev, [proj.projectId]: { ...prev[proj.projectId], date: e.target.value } }))} className="p-2 border rounded text-xs md:text-sm" />
                          <select value={newActivityMap[proj.projectId]?.type || "Report"} onChange={e => setNewActivityMap(prev => ({ ...prev, [proj.projectId]: { ...prev[proj.projectId], type: e.target.value } }))} className="p-2 border rounded text-xs md:text-sm">
                            <option value="Report">Report</option>
                            <option value="Expense">Expense</option>
                          </select>
                        </div>
                        {newActivityMap[proj.projectId]?.type === "Expense" && (
                          <input type="number" placeholder="Amount" value={newActivityMap[proj.projectId]?.expenses || 0} onChange={e => setNewActivityMap(prev => ({ ...prev, [proj.projectId]: { ...prev[proj.projectId], expenses: Number(e.target.value) } }))} className="p-2 border rounded w-full text-xs md:text-sm" />
                        )}
                        <button onClick={() => handleAddActivity(proj.projectId)} className="bg-[#FF6404] text-white px-3 md:px-4 py-2 rounded font-semibold hover:bg-[#e55a00] text-xs md:text-sm w-full">
                          Add Activity
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback Section */}
                  <div className="border-t pt-4 md:pt-6">
                    <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Community Feedback</h4>

                    {auth.role === "CITIZEN" && (
                      <div className="bg-[#FFF5F0] p-3 md:p-4 rounded-lg mb-4 md:mb-6 border border-[#FFE0D6]">
                        <label className="block text-xs md:text-sm font-semibold text-[#4B3A2F] mb-2">Share Your Feedback</label>
                        <textarea value={feedbackInputMap[proj.projectId] || ""} onChange={e => setFeedbackInputMap(prev => ({ ...prev, [proj.projectId]: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2 md:p-3 mb-2 md:mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6404] text-xs md:text-sm" placeholder="Tell us about your experience with this project..." rows="3" />

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-[#4B3A2F] mb-2">Rate this project</label>
                            <StarRating value={ratingInputMap[proj.projectId] || 0} onChange={(val) => setRatingInputMap(prev => ({ ...prev, [proj.projectId]: val }))} />
                          </div>
                          <button onClick={() => handleAddFeedback(proj.projectId)} className="px-4 md:px-6 py-2 bg-[#FF6404] text-white rounded-lg font-semibold hover:bg-[#e55a00] w-full md:w-auto text-xs md:text-base">
                            Submit
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <button onClick={() => setExpandedFeedback(prev => ({ ...prev, [proj.projectId]: !prev[proj.projectId] }))} className="text-xs md:text-sm font-semibold text-[#FF6404] hover:text-[#e55a00] mb-2 md:mb-3">
                        {showExpandedFeedback ? "Hide" : "Show"} All Reviews ({feedbacks.length})
                      </button>

                      <div className={`space-y-2 md:space-y-3 ${showExpandedFeedback ? "max-h-96 overflow-y-auto" : "max-h-48 overflow-y-auto"}`}>
                        {feedbacks.length === 0 ? (
                          <p className="text-gray-500 text-xs md:text-sm text-center py-4">No reviews yet.</p>
                        ) : (
                          feedbacks.map((f, i) => (
                            <div key={i} className="bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-xs md:text-sm text-[#4B3A2F]">{f.user?.fName || "Anonymous"}</p>
                                <span className="text-yellow-400 text-sm">{"★".repeat(f.rating)}</span>
                              </div>
                              <p className="text-xs md:text-sm text-gray-700">{f.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

export default Projects;