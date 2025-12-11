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
    acc[status] = (acc[status] || 0) + Number((p.allocatedBudget || "0").replace(/[^0-9.]/g, ""));
    return acc;
  }, {});

  const chartData = Object.entries(budgetByStatus).map(([status, amount]) => ({ projectStatus: status, allocatedBudget: amount }));

  const totalSpent = Object.values(projectSpentMap).reduce((sum, val) => sum + val, 0);
  const totalBudget = overview?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Budget Overview</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? Array(3).fill(0).map((_, i) => <SkeletonLoader key={i} className="h-24" />) :
          <>
            <Card>
              <h3 className="text-sm text-gray-500">Total Budget</h3>
              <p className="text-2xl font-bold mt-2">₱{totalBudget.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Spent: ₱{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Remaining: ₱{remaining.toLocaleString()}</p>
            </Card>

            <Card>
              <h3 className="text-sm text-gray-500">Projects</h3>
              <p className="text-2xl font-bold mt-2">{projects.length}</p>
            </Card>

            <Card>
              <h3 className="text-sm text-gray-500">Statuses</h3>
              {Object.keys(budgetByStatus).map(status => (
                <p key={status} className="text-xs">{status}: ₱{budgetByStatus[status].toLocaleString()}</p>
              ))}
            </Card>
          </>
        }
      </div>

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

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? Array(3).fill(0).map((_, i) => <SkeletonLoader key={i} className="h-48" />) :
          projects.map(proj => {
            const allocated = Number((proj.allocatedBudget || "0").replace(/[^0-9.]/g, ""));
            const spent = projectSpentMap[proj.projectId] || 0;
            return (
              <Card key={proj.projectId}>
                <h3 className="text-xl font-semibold">{proj.projectName}</h3>
                <p>{proj.description}</p>
                <p><strong>Allocated:</strong> ₱{allocated.toLocaleString()}</p>
                <p><strong>Spent:</strong> ₱{spent.toLocaleString()}</p>
                <p><strong>Status:</strong> {proj.projectStatus}</p>
                <p><strong>Feedback:</strong> {proj.feedback}</p>
              </Card>
            );
          })
        }
      </div>
    </div>
  );
}
