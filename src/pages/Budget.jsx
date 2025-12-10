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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.token) return;

    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [auth]);

  // Calculate total budget
  const totalBudget = projects.reduce(
    (sum, p) => sum + Number(p.allocatedBudget),
    0
  );

  // Group budget by project status
  const budgetByStatus = projects.reduce((acc, p) => {
    const status = p.projectStatus || "UNKNOWN";
    if (!acc[status]) acc[status] = 0;
    acc[status] += Number(p.allocatedBudget);
    return acc;
  }, {});

  const chartData = Object.entries(budgetByStatus).map(([status, amount]) => ({
    projectStatus: status,
    allocatedBudget: amount,
  }));

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Budget Overview</h1>

      {/* Total Budget */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Total Allocated Budget</h2>
        <p className="text-xl font-bold text-[#6B8E23]">
          ₱{totalBudget.toLocaleString()}
        </p>
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

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          projects.map((proj) => (
            <div key={proj.projectId} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold">{proj.projectName}</h3>
              <p>{proj.description}</p>
              <p><strong>Allocated Budget:</strong> ₱{Number(proj.allocatedBudget).toLocaleString()}</p>
              <p><strong>Status:</strong> {proj.projectStatus}</p>
              <p><strong>Feedback:</strong> {proj.feedback}</p>
            </div>
          ))
        ) : (
          <p>No projects yet</p>
        )}
      </div>
    </div>
  );
}

export default Budget;
