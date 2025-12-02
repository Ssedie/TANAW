import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const { auth } = useAuth(); // get token from context

  // States
  const [userStats, setUserStats] = useState([]);
  const [projectFeedbackCounts, setProjectFeedbackCounts] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectFeedbacks, setSelectedProjectFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8B5E3C", "#C4A484", "#6B8E23", "#D2B48C"]; // earthy palette

  useEffect(() => {
    if (!auth?.token) return;

    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    // Fetch users and project feedback counts
    Promise.all([
      axios.get(`${API_URL}/api/dashboard/users-by-status`, { headers }),
      axios.get(`${API_URL}/api/dashboard/project-feedback`, { headers })
    ])
      .then(([usersRes, projectFeedbackRes]) => {
        setUserStats(usersRes.data);
        setProjectFeedbackCounts(projectFeedbackRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [auth]);

  // Fetch feedbacks for a specific project
  const fetchFeedbacksByProject = async (projectId) => {
    if (!auth?.token) return;
    try {
      const headers = { Authorization: `Bearer ${auth.token}` };
      const response = await axios.get(`${API_URL}/api/dashboard/feedbacks/${projectId}`, { headers });
      setSelectedProjectFeedbacks(response.data);
      setSelectedProjectId(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-[#FAF7F1] min-h-screen">

      {/* Title */}
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Dashboard Overview</h1>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Users by Status Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Active Users</h2>
          <div className="h-64 flex items-center justify-center">
            {userStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={userStats}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {userStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : loading ? (
              <p>Loading chart...</p>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        {/* Project Feedback Counts */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Project Feedback</h2>
          {projectFeedbackCounts.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {projectFeedbackCounts.map((p, i) => (
                <li key={i} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                  <span>{p.projectName}</span>
                  <span className="font-semibold">{p.feedbackCount}</span>
                  <button
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchFeedbacksByProject(p.projectId)}
                  >
                    View Feedback
                  </button>
                </li>
              ))}
            </ul>
          ) : loading ? (
            <p>Loading projects...</p>
          ) : (
            <p>No project feedbacks available</p>
          )}
        </div>

        {/* Placeholder for future chart or stats */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Other Stats</h2>
          <p className="text-gray-600">You can add more charts or stats here.</p>
        </div>

      </div>

      {/* Detailed Feedbacks for selected project */}
      {selectedProjectId && (
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2 text-[#4B3A2F]">
            Feedbacks for Project ID: {selectedProjectId}
          </h3>
          {selectedProjectFeedbacks.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedProjectFeedbacks.map((f, i) => (
                <li key={i} className="p-2 border rounded">
                  <p><strong>{f.userName || "Anonymous"}:</strong> {f.comment}</p>
                  {f.replies && f.replies.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {f.replies.map((r, ri) => (
                        <li key={ri} className="text-sm text-gray-600">↳ {r.comment}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No feedbacks for this project.</p>
          )}
        </div>
      )}

    </div>
  );
}

export default Dashboard;
