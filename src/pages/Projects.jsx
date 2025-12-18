// src/pages/Projects.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { AlertCircle } from "lucide-react";
import { div } from "framer-motion/client";


function Projects() {
  const { auth } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [projects, setProjects] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [availableBudget, setAvailableBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [availableFiscalYears, setAvailableFiscalYears] = useState([]);

  // Project form
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
  const [errors, setErrors] = useState({});

  // Activities & feedback
  const [activitiesMap, setActivitiesMap] = useState({});
  const [newActivityMap, setNewActivityMap] = useState({});
  const [activityErrors, setActivityErrors] = useState({});
  const [feedbacksMap, setFeedbacksMap] = useState({});
  const [feedbackInputMap, setFeedbackInputMap] = useState({});
  const [ratingInputMap, setRatingInputMap] = useState({});
  const [expandedFeedback, setExpandedFeedback] = useState({});
  const [successMessage, setSuccessMessage] =  useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (auth?.userId) {
      setIsSuperAdmin(auth.userId === 100001);
    }
  }, [auth?.userId]);

  // --- Fetch Fiscal Years ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    axios.get(`${API_URL}/api/projects/fiscal-year/current`, { headers })
      .then(res => {
        const year = res.data.currentFiscalYear;
        setCurrentFiscalYear(year);
        setSelectedFiscalYear(year);
      })
      .catch(console.error);

    axios.get(`${API_URL}/api/dashboard/fiscal-years/available`, { headers })
      .then(res => setAvailableFiscalYears(res.data))
      .catch(console.error);
  }, [auth]);

  // --- Fetch Projects FILTERED BY FISCAL YEAR ---
  useEffect(() => {
    if (!auth?.token || !selectedFiscalYear) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, {
      headers,
      params: { fiscalYear: selectedFiscalYear }
    })
      .then(res => {
        console.log(`Loaded ${res.data.length} projects for FY ${selectedFiscalYear}`);
        setProjects(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth, selectedFiscalYear]);

  // --- Fetch Budgets for Selected Fiscal Year ---
  useEffect(() => {
    if (!auth?.token || !selectedFiscalYear) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    const fetchBudgetsForYear = async () => {
      try {
        const allBudgets = [];
        const docsRes = await axios.get(`${API_URL}/api/documents?type=Project Plan`, { headers });

        for (const doc of docsRes.data) {
          const budgetsRes = await axios.get(`${API_URL}/api/documents/${doc.documentId}/budgets`, { headers });
          const yearBudgets = budgetsRes.data.filter(b => b.fiscalYear === selectedFiscalYear);
          
          // Attach the full document info to each budget
          const budgetsWithDocInfo = yearBudgets.map(budget => ({
            ...budget,
            document: {
              documentId: doc.documentId,
              documentTitle: doc.documentTitle,
              documentType: doc.documentType
            }
          }));
          
          allBudgets.push(...budgetsWithDocInfo);
        }

        console.log(`Found ${allBudgets.length} budgets for FY ${selectedFiscalYear}`);
        setBudgets(allBudgets);
      } catch (err) {
        console.error("Error fetching budgets:", err);
      }
    };

    fetchBudgetsForYear();
  }, [auth, selectedFiscalYear]);

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
      .then(res => {
        console.log("Available budget:", res.data);
        setAvailableBudget(res.data.availableBudget);
      })
      .catch(err => {
        console.error("Error fetching available budget:", err);
        setAvailableBudget(0);
      })
      .finally(() => setBudgetLoading(false));
  }, [selectedBudgetId, auth]);

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

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    if (value > availableBudget) {
      setErrors(prev => ({
        ...prev,
        allocatedBudget: "Allocated budget exceeds available budget."
      }));
      return;
    }
    setAllocatedBudget(value);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!selectedBudgetId) newErrors.selectedBudgetId = "Budget is required";
    if (!projectName.trim()) newErrors.projectName = "Project name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!allocatedBudget || allocatedBudget <= 0) newErrors.allocatedBudget = "Allocated budget must be greater than 0";
    if (allocatedBudget > availableBudget) newErrors.allocatedBudget = "Allocated budget exceeds available budget";
    if (!projectType) newErrors.projectType = "Project type is required";
    if (!coverFile) newErrors.coverFile = "Cover image is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
      if (coverFile) {
        formData.append("coverPhoto", coverFile);
        console.log("Cover file attached:", coverFile.name, coverFile.type, coverFile.size);
      }
      formData.append("userId", Number(auth.userId));

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const headers = { Authorization: `Bearer ${auth.token}`, "Content-Type": "multipart/form-data" };
      const createResponse = await axios.post(`${API_URL}/api/projects`, formData, { headers });

      console.log("Project created response:", createResponse.data);
      console.log("Cover photo URL from response:", createResponse.data.coverPhotoUrl);

      // Refetch projects to get the updated list with cover photos
      const projectsRes = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: { fiscalYear: selectedFiscalYear }
      });
      setProjects(projectsRes.data);

      // Reset form
      setProjectName("");
      setDescription("");
      setAllocatedBudget("");
      setProjectType("");
      setProjectStatus("ONGOING");
      setDocumentFile(null);
      setDocumentPreview(null);
      setCoverFile(null);
      setCoverPreview(null);
      setSelectedBudgetId(null);
      setErrors({});

      // Refetch available budget
      const budgetRes = await axios.get(`${API_URL}/api/projects/budget/${selectedBudgetId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setAvailableBudget(budgetRes.data.availableBudget);

      setSuccessMessage("Project created successfully!");
      setErrorMessage("");

    } catch (err) {
      console.error("Error creating project:", err);
      setErrors({ submit: err.response?.data?.error || "Failed to add project. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddActivity = async (projectId) => {
    const activity = newActivityMap[projectId];

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

      const headers = {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data"
      };
      const res = await axios.post(`${API_URL}/api/activities`, formData, { headers });

      setActivitiesMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), res.data]
      }));

      setNewActivityMap(prev => ({
        ...prev,
        [projectId]: { activityName: "", description: "", date: new Date().toISOString().split('T')[0], expenses: 0, type: "Report" }
      }));
      setActivityErrors(prev => ({ ...prev, [projectId]: {} }));

      setSuccessMessage("Activity added successfully! Budget totals updated.");
      setErrorMessage("");

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Failed to add activity. Try again.";
      setActivityErrors(prev => ({ ...prev, [projectId]: { submit: errorMsg } }));
      setErrorMessage(errorMsg);
      setSuccessMessage("");
    }
  };

  const handleAddFeedback = async (projectId) => {
    const content = feedbackInputMap[projectId] || "";
    const rating = ratingInputMap[projectId] || 0;
    if (!content.trim() || rating <= 0) {
      setErrorMessage("Please provide feedback and a rating");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${auth.token}` };
      await axios.post(`${API_URL}/api/projects/${projectId}/feedbacks`, {
        content,
        rating,
        userId: auth.userId
      }, { headers });

      const feedbacksRes = await axios.get(`${API_URL}/api/projects/${projectId}/feedbacks`, { headers });
      setFeedbacksMap(prev => ({
        ...prev,
        [projectId]: feedbacksRes.data
      }));

      setFeedbackInputMap(prev => ({ ...prev, [projectId]: "" }));
      setRatingInputMap(prev => ({ ...prev, [projectId]: 0 }));
      setSuccessMessage("Feedback submitted successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit feedback");
    }
  };

  const computeAvgRating = (projectId) => {
    const feedbacks = feedbacksMap[projectId] || [];
    if (feedbacks.length === 0) return 0;
    return (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);
  };

  const getProjectCoverImage = (proj) => {
    if (proj.coverPhotoUrl) {
      // Handle both relative and absolute URLs
      const url = proj.coverPhotoUrl.startsWith('http') 
        ? proj.coverPhotoUrl 
        : `${API_URL}${proj.coverPhotoUrl}`;
      console.log("Cover photo URL:", url);
      return url;
    }
    return null;
  };

  useEffect(() => {
    if(!successMessage && !errorMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-[#4B3A2F]">Projects</h1>
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}
        <div className="flex gap-4 items-center">
          {currentFiscalYear && (
            <div className="px-4 py-2 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-xs md:text-sm font-semibold text-blue-900">Current FY: {currentFiscalYear}</p>
            </div>
          )}
          {availableFiscalYears.length > 1 && (
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6404]"
            >
              {availableFiscalYears.map(year => (
                <option key={year} value={year}>
                  Fiscal Year {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {isSuperAdmin && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-semibold">⚠️ Superadmin Account</p>
            <p className="text-amber-800 text-sm mt-1">Project creation and activity management are disabled for security reasons.</p>
          </div>
        </div>
      )}

      {auth.role === "ADMIN" && !isSuperAdmin && (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 w-full">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Add New Project (FY {selectedFiscalYear})</h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
            <select
              value={selectedBudgetId || ""}
              onChange={e => setSelectedBudgetId(e.target.value ? parseInt(e.target.value) : null)}
              className="p-2 md:p-3 border rounded text-sm md:text-base"
            >
              <option value="" disabled>Select a Budget for FY {selectedFiscalYear}</option>
              {budgets.map(budget => (
                <option key={budget.budgetId} value={budget.budgetId}>
                  {budget.document?.documentTitle || 'Untitled'} - ₱{(budget.totalBudget ?? 0).toLocaleString()}
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
              <option value="HEALTH & SANITATION">Health & Sanitation</option>
              <option value="EDUCATION">Education</option>
              <option value="AGRICULTURAL">Agricultural</option>
              <option value="SECURITY">Security</option>
              <option value="VAWCII">VAWCII</option>
              <option value="GENERAL">General</option>
            </select>
            {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}

            <label className="text-xs md:text-sm font-semibold text-gray-600">Upload Cover Image *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleCoverChange} 
              className="p-2 border rounded w-full text-xs md:text-sm" 
              required 
            />
            {errors.coverFile && <p className="text-red-500 text-xs mt-1">{errors.coverFile}</p>}
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-2 max-h-48 rounded border" />}

            {errors.submit && <p className="text-red-600 font-semibold mt-2">{errors.submit}</p>}

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
                <p className="text-xs md:text-sm text-gray-600 mt-1">Updates in real-time from server</p>
              </>
            ) : (
              <p className="text-xs md:text-sm text-gray-600">Select a budget to see available amount</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading projects for FY {selectedFiscalYear}...</p>
      ) : projects.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <p className="text-gray-500 text-lg">No projects found for Fiscal Year {selectedFiscalYear}</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different fiscal year or create a new project.</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            grabCursor={true}
            breakpoints={{
              1024: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
            }}
          >
            {projects.map(proj => {
              const activities = activitiesMap[proj.projectId] || [];
              const feedbacks = feedbacksMap[proj.projectId] || [];
              const avgRating = computeAvgRating(proj.projectId);
              const showExpandedFeedback = expandedFeedback[proj.projectId];

              return (
                <SwiperSlide key={proj.projectId} className="px-2">
                  <div className="bg-white p-4 md:p-6 rounded-2xl shadow h-full w-full">
                    {getProjectCoverImage(proj) ? (
                      <div className="relative rounded-t-xl overflow-hidden">
                        <img
                          src={getProjectCoverImage(proj)}
                          alt={proj.projectName}
                          className="w-full h-full md:h-[600px] object-cover"
                          onError={(e) => {
                            console.error("Failed to load image:", proj.coverPhotoUrl);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full md:h-[600px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">Image failed to load</div>';
                          }}
                        />
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                          <h3 className="text-white text-lg md:text-xl font-bold">
                            {proj.projectName}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full md:h-[600px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-xl">
                        No project image
                      </div>
                    )}
                    <p className="text-sm md:text-base text-gray-700 mb-4 mt-3">{proj.description}</p>

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

                    {(auth.role === "ADMIN" && !isSuperAdmin) || auth.role === "CITIZEN" ? (
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

    {auth.role === "ADMIN" && !isSuperAdmin && (
      <div className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-2">
        <input
          type="text"
          placeholder="Activity Name"
          value={newActivityMap[proj.projectId]?.activityName || ""}
          onChange={e =>
            setNewActivityMap(prev => ({
              ...prev,
              [proj.projectId]: {
                ...prev[proj.projectId],
                activityName: e.target.value,
                type: prev[proj.projectId]?.type || "Report"
              }
            }))
          }
          className="p-2 border rounded w-full text-xs md:text-sm"
        />
        <textarea
          placeholder="Description"
          value={newActivityMap[proj.projectId]?.description || ""}
          onChange={e =>
            setNewActivityMap(prev => ({
              ...prev,
              [proj.projectId]: { ...prev[proj.projectId], description: e.target.value }
            }))
          }
          className="p-2 border rounded w-full text-xs md:text-sm resize-none"
          rows="2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={newActivityMap[proj.projectId]?.date || new Date().toISOString().split('T')[0]}
            onChange={e =>
              setNewActivityMap(prev => ({
                ...prev,
                [proj.projectId]: { ...prev[proj.projectId], date: e.target.value }
              }))
            }
            className="p-2 border rounded text-xs md:text-sm"
          />
          <select
            value={newActivityMap[proj.projectId]?.type || "Report"}
            onChange={e =>
              setNewActivityMap(prev => ({
                ...prev,
                [proj.projectId]: { ...prev[proj.projectId], type: e.target.value }
              }))
            }
            className="p-2 border rounded text-xs md:text-sm"
          >
            <option value="Report">Report</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        {newActivityMap[proj.projectId]?.type === "Expense" && (
          <input
            type="number"
            placeholder="Amount"
            value={newActivityMap[proj.projectId]?.expenses || 0}
            onChange={e =>
              setNewActivityMap(prev => ({
                ...prev,
                [proj.projectId]: { ...prev[proj.projectId], expenses: Number(e.target.value) }
              }))
            }
            className="p-2 border rounded w-full text-xs md:text-sm"
          />
        )}
        {activityErrors[proj.projectId]?.activityName && (
          <p className="text-red-500 text-xs mt-1">{activityErrors[proj.projectId].activityName}</p>
        )}
        {activityErrors[proj.projectId]?.submit && (
          <p className="text-red-600 font-semibold mt-2">{activityErrors[proj.projectId].submit}</p>
        )}
        <button
          onClick={() => handleAddActivity(proj.projectId)}
          className="bg-[#FF6404] text-white px-3 md:px-4 py-2 rounded font-semibold hover:bg-[#e55a00] text-xs md:text-sm w-full"
        >
          Add Activity
        </button>
      </div>
    )}
  </div>
) : null}

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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default Projects;