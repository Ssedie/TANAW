import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Projects() {
  const { auth } = useAuth(); // get the token & userId from context
  const [projectStats, setProjectStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding new project
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [projectStatus, setProjectStatus] = useState("ONGOING");
  const [feedback, setFeedback] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const COLORS = ["#8B5E3C", "#C4A484", "#6B8E23", "#D2B48C"]; // earthy palette

  useEffect(() => {
    if (!auth?.token) return;

    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    // Fetch projects and stats concurrently
    Promise.all([
      axios.get(`${API_URL}/api/projects`, { headers }),
      axios.get(`${API_URL}/api/dashboard/projects-by-status`, { headers }),
    ])
      .then(([projectsRes, statsRes]) => {
        setProjects(projectsRes.data);
        setProjectStats(statsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [auth]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    setDocumentFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setDocumentPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setDocumentPreview(null); // reset preview if not an image
    }
  }

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
    formData.append("userId", auth.userId); // associate project with logged-in user

    try {
      setSubmitting(true);
      const headers = {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      };
      const res = await axios.post(`${API_URL}/api/projects`, formData, { headers });
      setProjects([...projects, res.data]);

      // Optionally, refresh project stats
      const statsRes = await axios.get(`${API_URL}/api/dashboard/projects-by-status`, { headers });
      setProjectStats(statsRes.data);

      // Reset form
      setProjectName("");
      setDescription("");
      setAllocatedBudget("");
      setProjectStatus("ONGOING");
      setFeedback("");
      setDocumentFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Projects Dashboard</h1>

      {/* Projects by Status Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Projects by Status</h2>
        <div className="h-64 flex items-center justify-center">
          {projectStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={projectStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="projectStatus" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6B8E23" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : loading ? (
            <p>Loading chart...</p>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      {/* Add Project Form */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="p-3 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Allocated Budget"
            value={allocatedBudget}
            onChange={(e) => setAllocatedBudget(e.target.value)}
            className="p-3 border rounded"
          />
          <select
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="p-3 border rounded"
          >
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <input
            type="text"
            placeholder="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="p-3 border rounded"
          />
          <label className="block mb-1 font-semibold">Upload Document</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-3 border rounded w-full"
          />
          {documentPreview && (
            <div className="mt-2">
              <p className="text-sm mb-1">Preview:</p>
              <img
                src={documentPreview}
                alt="Preview"
                className="max-h-40 rounded border"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#FF6404] text-white p-3 rounded font-semibold hover:bg-[#e55a00]"
          >
            {submitting ? "Adding..." : "Add Project"}
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          projects.map((proj) => (
            <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold">{proj.projectName}</h3>
              <p>{proj.description}</p>
              <p><strong>Budget:</strong> {proj.allocatedBudget}</p>
              <p><strong>Status:</strong> {proj.projectStatus}</p>
              <p><strong>Feedback:</strong> {proj.feedback}</p>
              {proj.documentId && (
                <a
                  href={`${API_URL}/api/documents/${proj.documentId}/download`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Document
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No projects yet</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
