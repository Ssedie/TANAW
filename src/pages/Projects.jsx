// src/pages/Projects.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AlertCircle } from "lucide-react";

function Projects() {
  const { auth } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // --- Form Validation Errors ---
const [errors, setErrors] = useState({});
// --- Activity Validation Errors ---
const [activityErrors, setActivityErrors] = useState({});



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
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Activities & Feedback ---
  const [activitiesMap, setActivitiesMap] = useState({});
  const [newActivityMap, setNewActivityMap] = useState({});
  // --- Activity Images ---


  const [feedbacksMap, setFeedbacksMap] = useState({});
  const [feedbackInputMap, setFeedbackInputMap] = useState({});
  const [ratingInputMap, setRatingInputMap] = useState({});
  const [expandedFeedback, setExpandedFeedback] = useState({});

  useEffect(() => {
    if (auth?.userId) {
      if (auth.userId === 100001) {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    }
  }, [auth?.userId]);

  // --- Fetch Projects, Budgets & Fiscal Year ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects/fiscal-year/current`, { headers })
      .then(res => {
        setCurrentFiscalYear(res.data.currentFiscalYear);
      })
      .catch(console.error);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    // Fetch all budgets (not filtered by current year in the dropdown)
    axios.get(`${API_URL}/api/dashboard/fiscal-years/available`, { headers })
      .then(res => {
        // For each fiscal year, fetch budgets
        const fetchBudgetsForYear = async () => {
          try {
            const allBudgets = [];
            // Get all documents first
            const docsRes = await axios.get(`${API_URL}/api/documents?type=Project Plan`, { headers });

            // For each document, get its budgets
            for (const doc of docsRes.data) {
              const budgetsRes = await axios.get(`${API_URL}/api/documents/${doc.documentId}/budgets`, { headers });
              allBudgets.push(...budgetsRes.data);
            }

            setBudgets(allBudgets);
          } catch (err) {
            console.error("Error fetching budgets:", err);
          }
        };

        fetchBudgetsForYear();
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

  // --- Fetch Feedbacks ---
  useEffect(() => {
    if (!auth?.token || projects.length === 0) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    const fetchFeedbacks = async () => {
      const map = {};
      for (const proj of projects) {
        try {
          const res = await axios.get(`${API_URL}/api/projects/${proj.projectId}/feedbacks`, { headers });
          map[proj.projectId] = res.data;
        } catch (err) {
          console.error(err);
        }
      }
      setFeedbacksMap(map);
    };

    fetchFeedbacks();
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

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    } else setCoverPreview(null);
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

  // Clear previous errors
  const newErrors = {};

  if (!selectedBudgetId) newErrors.selectedBudgetId = "Budget is required";
  if (!projectName.trim()) newErrors.projectName = "Project name is required";
  if (!description.trim()) newErrors.description = "Description is required";
  if (!allocatedBudget || allocatedBudget <= 0) newErrors.allocatedBudget = "Allocated budget must be greater than 0";
  if (allocatedBudget > availableBudget) newErrors.allocatedBudget = "Allocated budget exceeds available budget";
  if (!projectType) newErrors.projectType = "Project type is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  // Submit Form
  try {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("allocatedBudget", allocatedBudget);
    formData.append("projectType", projectType);
    formData.append("projectStatus", projectStatus);
    formData.append("budgetId", selectedBudgetId);
    if (documentFile) formData.append("document", documentFile);
    if (coverFile) formData.append("coverFile", coverFile);
    formData.append("userId", Number(auth.userId));

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
      setCoverFile(null);
      setCoverPreview(null);
    // Reset form
    setProjectName("");
    setDescription("");
    setAllocatedBudget(0);
    setProjectType("");
    setProjectStatus("ONGOING");
    setDocumentFile(null);
    setDocumentPreview(null);
    setSelectedBudgetId(null);
    setErrors({});

    // Refresh available budget
    const budgetHeaders = { Authorization: `Bearer ${auth.token}` };
    const budgetRes = await axios.get(`${API_URL}/api/projects/budget/${selectedBudgetId}`, { headers: budgetHeaders });
    setAvailableBudget(budgetRes.data.availableBudget);

  } catch (err) {
    console.error(err);
    setErrors({ submit: "Failed to add project. Please try again." });
  } finally {
    setSubmitting(false);
  }
};


  // --- Add Activity ---
const handleAddActivity = async (projectId) => {
  const activity = newActivityMap[projectId];
  const activityImage = activityImageMap[projectId];

  const newErrors = {};

  if (!activity || !activity.activityName?.trim()) {
    newErrors.activityName = "Activity name is required";
  }
  if (!activity?.type) {
    newErrors.type = "Activity type is required";
  }
  if (activity.type === "Expense" && (!activity.expenses || activity.expenses <= 0)) {
    newErrors.expenses = "Amount must be greater than 0";
  }

  setActivityErrors(prev => ({ ...prev, [projectId]: newErrors }));

  if (Object.keys(newErrors).length > 0) return;

  // Submit activity
  try {
    const formData = new FormData();
    formData.append("activityName", activity.activityName);
    formData.append("description", activity.description || "");
    formData.append("date", activity.date || new Date().toISOString().split('T')[0]);
    formData.append("type", activity.type);
    formData.append("projectId", projectId);

    if (activity.type === "Expense") {
      formData.append("expenses", activity.expenses || 0);
    }

    if (activityImage) {
      formData.append("image", activityImage);
    }

    const headers = {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "multipart/form-data"
    };
    const res = await axios.post(`${API_URL}/api/activities`, formData, { headers });

    // Update activities list
    setActivitiesMap(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), res.data]
    }));

    // Reset form
    setNewActivityMap(prev => ({
      ...prev,
      [projectId]: { activityName: "", description: "", date: new Date().toISOString().split('T')[0], expenses: 0, type: "Report" }
    }));
    setActivityImageMap(prev => ({ ...prev, [projectId]: null }));
    setActivityImagePreviewMap(prev => ({ ...prev, [projectId]: null }));
    setActivityErrors(prev => ({ ...prev, [projectId]: {} }));
  } catch (err) {
    console.error(err);
    setActivityErrors(prev => ({ ...prev, [projectId]: { submit: "Failed to add activity. Try again." } }));
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

      // Refresh feedbacks for this project
      const feedbacksRes = await axios.get(`${API_URL}/api/projects/${projectId}/feedbacks`, { headers });
      setFeedbacksMap(prev => ({
        ...prev,
        [projectId]: feedbacksRes.data
      }));

      setFeedbackInputMap(prev => ({ ...prev, [projectId]: "" }));
      setRatingInputMap(prev => ({ ...prev, [projectId]: 0 }));
      alert("Feedback submitted successfully!");
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

  const getProjectCoverImage = (proj) => {
    if (proj.coverPhotoUrl) return `${API_URL}${proj.coverPhotoUrl}`;
    return null;
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
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    adaptiveHeight: true,
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

      {/* Superadmin Notice */}
      {isSuperAdmin && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-semibold">⚠️ Superadmin Account</p>
            <p className="text-amber-800 text-sm mt-1">Project creation and activity management are disabled for security reasons.</p>
          </div>
        </div>
      )}

      {/* Add Project Form */}
      {auth.role === "ADMIN" && !isSuperAdmin && (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 w-full">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Add New Project</h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
<select
  value={selectedBudgetId || ""}
  onChange={e => setSelectedBudgetId(e.target.value ? parseInt(e.target.value) : null)}
  className="p-2 md:p-3 border rounded text-sm md:text-base"
>
  <option value="" disabled>Select a Budget (Fiscal Year)</option>
  {budgets.map(budget => (
    <option key={budget.budgetId} value={budget.budgetId}>
      FY {budget.fiscalYear} - ₱{(budget.totalBudget ?? 0).toLocaleString()}
    </option>
  ))}
</select>
{errors.selectedBudgetId && <p className="text-red-500 text-xs mt-1">{errors.selectedBudgetId}</p>}

<input
  type="text"
  placeholder="Project Name"
  value={projectName}
  onChange={e => setProjectName(e.target.value)}
  className="p-2 md:p-3 border rounded text-sm md:text-base"
/>
{errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}

<textarea
  placeholder="Description"
  value={description}
  onChange={e => setDescription(e.target.value)}
  className="p-2 md:p-3 border rounded text-sm md:text-base"
/>
{errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}

<input
  type="number"
  placeholder="Allocated Budget"
  value={allocatedBudget}
  onChange={handleBudgetChange}
  className="p-2 md:p-3 border rounded text-sm md:text-base"
  max={availableBudget}
/>
{errors.allocatedBudget && <p className="text-red-500 text-xs mt-1">{errors.allocatedBudget}</p>}

<select
  value={projectType || ""}
  onChange={e => setProjectType(e.target.value)}
  className="p-2 md:p-3 border rounded text-sm md:text-base"
>
  <option value="" disabled>Select Project Type</option>
  <option value="INFRASTRUCTURE">Infrastructure</option>
  <option value="HEALTH">Health</option>
  <option value="EDUCATION">Education</option>
  <option value="ENVIRONMENT">Environment</option>
  <option value="GENERAL">General</option>
</select>
{errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}

{errors.submit && <p className="text-red-600 font-semibold mt-2">{errors.submit}</p>}


            <label className="text-xs md:text-sm font-semibold text-gray-600">Upload Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="p-2 border rounded w-full text-xs md:text-sm" required/>
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-2 max-h-48 rounded border" />}


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
      <div className="w-full max-w-4xl mx-auto">
        <style>{`
          .slick-slide {
            padding: 0;
          }
          .slick-slide > div {
            padding: 0 15px;
          }
          .slick-list {
            margin: 0;
            overflow: visible;
          }
          .slick-track {
            display: flex !important;
          }
        `}</style>
        <Slider {...sliderSettings}>
          {projects.map(proj => {
            const activities = activitiesMap[proj.projectId] || [];
            const feedbacks = feedbacksMap[proj.projectId] || [];
            const avgRating = computeAvgRating(proj.projectId);
            const showExpandedFeedback = expandedFeedback[proj.projectId];

            return (
              <div key={proj.projectId} className="px-2">
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow h-full">
                  {/* Project Cover Image */}
                  {getProjectCoverImage(proj.projectId) ? (
                    <div className="relative">
                      <img
                        src={getProjectCoverImage(proj.projectId)}
                        alt={proj.projectName}
                        className="w-full h-44 md:h-56 object-cover"
                      />

                      {/* Optional overlay */}
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                        <h3 className="text-white text-lg md:text-xl font-bold">
                          {proj.projectName}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-44 md:h-56 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      No project image
                    </div>
                  )}
                  <p className="text-sm md:text-base text-gray-700 mb-4">{proj.description}</p>

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
                  {auth.role === "ADMIN" && !isSuperAdmin && (
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
<input
  type="text"
  placeholder="Activity Name"
  value={newActivityMap[proj.projectId]?.activityName || ""}
  onChange={e => setNewActivityMap(prev => ({ 
    ...prev, 
    [proj.projectId]: { ...prev[proj.projectId], activityName: e.target.value } 
  }))}
  className="p-2 border rounded w-full text-xs md:text-sm"
/>
{activityErrors[proj.projectId]?.activityName && (
  <p className="text-red-500 text-xs mt-1">{activityErrors[proj.projectId].activityName}</p>
)}

<select
  value={newActivityMap[proj.projectId]?.type || "Report"}
  onChange={e => setNewActivityMap(prev => ({ 
    ...prev, 
    [proj.projectId]: { ...prev[proj.projectId], type: e.target.value } 
  }))}
  className="p-2 border rounded text-xs md:text-sm"
>
  <option value="Report">Report</option>
  <option value="Expense">Expense</option>
</select>
{activityErrors[proj.projectId]?.type && (
  <p className="text-red-500 text-xs mt-1">{activityErrors[proj.projectId].type}</p>
)}

{newActivityMap[proj.projectId]?.type === "Expense" && (
  <>
    <input
      type="number"
      placeholder="Amount"
      value={newActivityMap[proj.projectId]?.expenses || 0}
      onChange={e => setNewActivityMap(prev => ({
        ...prev,
        [proj.projectId]: { ...prev[proj.projectId], expenses: Number(e.target.value) }
      }))}
      className="p-2 border rounded w-full text-xs md:text-sm"
    />
    {activityErrors[proj.projectId]?.expenses && (
      <p className="text-red-500 text-xs mt-1">{activityErrors[proj.projectId].expenses}</p>
    )}
  </>
)}

{activityErrors[proj.projectId]?.submit && (
  <p className="text-red-600 font-semibold mt-2">{activityErrors[proj.projectId].submit}</p>
)}


                        {activityImagePreviewMap[proj.projectId] && (
                          <img
                            src={activityImagePreviewMap[proj.projectId]}
                            alt="Activity Preview"
                            className="mt-2 max-h-32 rounded border"
                          />
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