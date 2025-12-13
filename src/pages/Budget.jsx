// src/pages/Budget.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import Card from "../components/Card";
import SkeletonLoader from "../components/SkeletonLoader";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Budget() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [overview, setOverview] = useState(null);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    axios.get(`${API_URL}/api/dashboard/overview`, { headers })
      .then(res => setOverview(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  // Fetch activities per project
  useEffect(() => {
    if (!auth?.token || projects.length === 0) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    projects.forEach(proj => {
      axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers })
        .then(res => setActivitiesMap(prev => ({ ...prev, [proj.projectId]: res.data })))
        .catch(console.error);
    });
  }, [projects, auth]);

  const projectSpentMap = {};
  projects.forEach(p => {
    const acts = activitiesMap[p.projectId] || [];
    projectSpentMap[p.projectId] = acts.reduce((sum, a) => sum + Number(a.expenses || 0), 0);
  });

  const budgetByStatus = projects.reduce((acc, p) => {
  const status = p.projectStatus || "UNKNOWN";
  acc[status] = (acc[status] || 0) + (p.allocatedBudget || 0);
  return acc;
}, {});


  const chartData = Object.entries(budgetByStatus).map(([status, amount]) => ({ projectStatus: status, allocatedBudget: amount }));

  const totalSpent = Object.values(projectSpentMap).reduce((sum, val) => sum + val, 0);
  const totalBudget = overview?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Budget Overview</h1>

      {/* Chart */}
      <Card className="mb-8 h-72">
        <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Budget by Status</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="projectStatus" />
              <YAxis />
              <Tooltip formatter={value => `₱${value.toLocaleString()}`} />
              <Bar dataKey="allocatedBudget" fill="#6B8E23" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : loading ? <SkeletonLoader className="h-full" /> : <p>No project data</p>}
      </Card>
    </div>
  );
}
