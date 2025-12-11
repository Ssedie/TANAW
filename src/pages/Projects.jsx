import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Projects() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Project Form State ---
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [projectStatus, setProjectStatus] = useState("ONGOING");
  const [feedback, setFeedback] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Activities State ---
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activityName: "",
    description: "",
    date: "",
    status: "ONGOING",
    expenses: 0,
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  // --- File Preview ---
  function handleFileChange(e) {
    const file = e.target.files[0];
    setDocumentFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setDocumentPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setDocumentPreview(null);
    }
  }

  // --- Add Project ---
  async function handleAddProject(e) {
    e.preventDefault();
    if (!projectName || !description || !allocatedBudget) return;

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("allocatedBudget", allocatedBudget);
    formData.append("projectStatus", projectStatus);
    formData.append("feedback", feedback);
    if (documentFile) formData.append("document", documentFile);
    formData.append("userId", Number(auth.userId));

    try {
      setSubmitting(true);
      const headers = {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      };
      const res = await axios.post(`${API_URL}/api/projects`, formData, { headers });
      setProjects([...projects, res.data]);

      setProjectName("");
      setDescription("");
      setAllocatedBudget("");
      setProjectStatus("ONGOING");
      setFeedback("");
      setDocumentFile(null);
      setDocumentPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  // --- Open Modal & fetch activities ---
  const openActivityModal = async (proj) => {
    setSelectedProject(proj);
    setIsModalOpen(true);
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    try {
      const res = await axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers });
      setActivities(res.data);
    } catch (err) {
      console.error(err);
      setActivities([]);
    }
    setNewActivity({ activityName: "", description: "", date: "", status: "ONGOING", expenses: 0 });
  };

  // --- Add / Update Activity ---
  const handleAddOrUpdateActivity = async () => {
    if (!newActivity.activityName || !newActivity.date || !selectedProject?.projectId) return;

    const dto = { ...newActivity, projectId: selectedProject.projectId };
    const headers = { Authorization: `Bearer ${auth.token}` };

    try {
      let res;
      if (newActivity.activityId) {
        res = await axios.put(`${API_URL}/api/activities/${newActivity.activityId}`, dto, { headers });
        setActivities(activities.map(a => a.activityId === newActivity.activityId ? res.data : a));
      } else {
        res = await axios.post(`${API_URL}/api/activities`, dto, { headers });
        setActivities([...activities, res.data]);
      }
      setNewActivity({ activityName: "", description: "", date: "", status: "ONGOING", expenses: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Edit activity button ---
  const handleEditActivity = (activity) => {
    setNewActivity(activity);
  };

  // --- Close modal ---
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setActivities([]);
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Projects Dashboard</h1>

      {/* Add Project Form */}
      {auth.role === "ADMIN" && (
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} className="p-3 border rounded" />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-3 border rounded" />
            <input type="text" placeholder="Allocated Budget" value={allocatedBudget} onChange={e => setAllocatedBudget(e.target.value)} className="p-3 border rounded" />
            <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="p-3 border rounded">
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <input type="text" placeholder="Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} className="p-3 border rounded" />

            <label className="block mb-1 font-semibold">Upload Document</label>
            <input type="file" onChange={handleFileChange} className="p-3 border rounded w-full" />
            {documentPreview && <img src={documentPreview} alt="Preview" className="max-h-40 rounded border mt-2" />}

            <button type="submit" disabled={submitting} className="bg-[#FF6404] text-white p-3 rounded font-semibold hover:bg-[#e55a00]">
              {submitting ? "Adding..." : "Add Project"}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          projects.map(proj => (
            <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold">{proj.projectName}</h3>
              <p>{proj.description}</p>
              <p><strong>Budget:</strong> {proj.allocatedBudget}</p>
              <p><strong>Status:</strong> {proj.projectStatus}</p>
              <p><strong>Feedback:</strong> {proj.feedback}</p>
              {proj.documentId && (
                <a href={`${API_URL}/api/documents/${proj.documentId}/download`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Download Document
                </a>
              )}
              <button
                onClick={() => openActivityModal(proj)}
                className="mt-2 px-4 py-2 bg-[#FF6404] text-white rounded"
              >
                View / Update Activities
              </button>
            </div>
          ))
        ) : (
          <p>No projects yet</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">{selectedProject.projectName} - Activities</h2>

            {/* Activities List */}
            <div className="max-h-64 overflow-y-auto mb-4">
              {activities.length > 0 ? activities.map(a => (
                <div key={a.activityId} className="flex justify-between border-b py-1">
                  <span>{a.activityName} - {a.date} - {a.status} - ${a.expenses}</span>
                  <button
                    onClick={() => handleEditActivity(a)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                </div>
              )) : <p>No activities yet</p>}
            </div>

            {/* Activity Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                placeholder="Activity Name"
                value={newActivity.activityName}
                onChange={e => setNewActivity({ ...newActivity, activityName: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={newActivity.date}
                onChange={e => setNewActivity({ ...newActivity, date: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                placeholder="Description"
                value={newActivity.description}
                onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Expense"
                value={newActivity.expenses}
                onChange={e => setNewActivity({ ...newActivity, expenses: e.target.value })}
                className="p-2 border rounded"
              />
              <select
                value={newActivity.status}
                onChange={e => setNewActivity({ ...newActivity, status: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <button
              onClick={handleAddOrUpdateActivity}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              {newActivity.activityId ? "Update Activity" : "Add Activity"}
            </button>

            <p className="mt-2 font-semibold">
              Total Spent: ${activities.reduce((sum, a) => sum + Number(a.expenses || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
