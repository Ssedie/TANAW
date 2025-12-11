import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Budget() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.token) return;

    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    // Fetch projects
    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));

    // Fetch dashboard totals (true budget only)
    axios.get(`${API_URL}/api/dashboard/overview`, { headers })
      .then(res => setOverview(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [auth]);

  // Function to fetch activities for a project
  const [activitiesMap, setActivitiesMap] = useState({}); // projectId -> activities[]
  useEffect(() => {
    if (!auth?.token) return;

    const headers = { Authorization: `Bearer ${auth.token}` };
    projects.forEach(proj => {
      axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers })
        .then(res => {
          setActivitiesMap(prev => ({ ...prev, [proj.projectId]: res.data }));
        })
        .catch(err => console.error(err));
    });
  }, [projects, auth]);

  // Calculate spent for each project
  const projectSpentMap = {};
  projects.forEach(proj => {
    const acts = activitiesMap[proj.projectId] || [];
    projectSpentMap[proj.projectId] = acts.reduce((sum, a) => sum + Number(a.expenses || 0), 0);
  });

  // Group budget by status
  const budgetByStatus = projects.reduce((acc, p) => {
    const status = p.projectStatus || "UNKNOWN";
    if (!acc[status]) acc[status] = 0;
    acc[status] += Number((p.allocatedBudget || "0").replace(/[^0-9.]/g, ""));
    return acc;
  }, {});

  const chartData = Object.entries(budgetByStatus).map(([status, amount]) => ({
    projectStatus: status,
    allocatedBudget: amount,
  }));

  // Total spent from all activities
  const totalSpent = Object.values(projectSpentMap).reduce((sum, val) => sum + val, 0);
  const totalBudget = overview?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">
        Budget Overview
      </h1>

      {/* Summary Section */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Budget Summary</h2>

        <p className="text-lg"><strong>Total Budget:</strong> ₱{totalBudget.toLocaleString()}</p>
        <p className="text-lg"><strong>Total Spent:</strong> ₱{totalSpent.toLocaleString()}</p>
        <p className="text-lg"><strong>Remaining:</strong> ₱{remaining.toLocaleString()}</p>
      </div>

      {/* Budget by Status Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Budget by Project Status</h2>

        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="projectStatus" />
                <YAxis />
                <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                <Bar dataKey="allocatedBudget" fill="#6B8E23" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : loading ? (
            <p>Loading chart...</p>
          ) : (
            <p>No project budget data available</p>
          )}
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          projects.map((proj) => {
            const allocated = Number((proj.allocatedBudget || "0").replace(/[^0-9.]/g, ""));
            const spent = projectSpentMap[proj.projectId] || 0;

            return (
              <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold">{proj.projectName}</h3>
                <p>{proj.description}</p>
                <p><strong>Allocated:</strong> ₱{allocated.toLocaleString()}</p>
                <p><strong>Spent:</strong> ₱{spent.toLocaleString()}</p>
                <p><strong>Status:</strong> {proj.projectStatus}</p>
                <p><strong>Feedback:</strong> {proj.feedback}</p>
              </div>
            );
          })
        ) : (
          <p>No projects yet</p>
        )}
      </div>
    </div>
  );
}

export default Budget;
