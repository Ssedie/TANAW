// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function Dashboard() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Fetch projects and activities ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    axios.get(`${API_URL}/api/dashboard/total-budget`, { headers }
      ).then(res => setTotalBudget(res.data.totalBudget))
      .catch(console.error);

    axios.get(`${API_URL}/api/activities/recent`, { headers })
      .then(res => setActivities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  // --- Budget Calculations ---
  const totalSpent = projects.reduce((sum, p) => {
    const spent = (p.activities || []).reduce((aSum, a) => aSum + Number(a.expenses || 0), 0);
    return sum + spent;
  }, 0);
  const totalAvailable = totalBudget - totalSpent;

  // --- Active Projects ---
  const activeProjects = projects.filter(p => p.projectStatus === "ONGOING");

  // --- Budget Distribution (by type) ---
  const budgetDistribution = [];
  const typeMap = {};
  projects.forEach(p => {
    const type = p.projectType || "General";
    if (!typeMap[type]) typeMap[type] = 0;
    typeMap[type] += Number(p.allocatedBudget || 0);
  });
  for (const type in typeMap) {
    budgetDistribution.push({ type, amount: typeMap[type] });
  }

  const colors = ["#FF6404", "#4B3A2F", "#FFA500", "#8B4513", "#00BFFF"];

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-[#4B3A2F]">Dashboard</h1>

      {/* --- Budget Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Budget</h2>
          <p className="text-2xl font-bold">₱{Number(totalBudget).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Spent</h2>
          <p className="text-2xl font-bold">₱{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Available</h2>
          <p className="text-2xl font-bold">₱{totalAvailable.toLocaleString()}</p>
        </div>
      </div>

      {/* --- Project Status Table --- */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Project Name</th>
              <th className="p-2">Allocated Budget</th>
              <th className="p-2">Spent</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => {
              const spent = (p.activities || []).reduce((sum, a) => sum + Number(a.expenses || 0), 0);
              const progress = ((spent / (p.allocatedBudget || 1)) * 100).toFixed(1);
              return (
                <tr key={p.projectId} className="border-b">
                  <td className="p-2">{p.projectName}</td>
                  <td className="p-2">₱{Number(p.allocatedBudget).toLocaleString()}</td>
                  <td className="p-2">₱{spent.toLocaleString()}</td>
                  <td className="p-2">{progress}%</td>
                  <td className="p-2">{p.projectStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Budget Distribution --- */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Budget Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount">
              {budgetDistribution.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Recent Activities --- */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <p>No recent activities.</p>
        ) : (
          <ul className="space-y-2">
            {activities.map(a => (
              <li key={a.activityId} className="border-b p-2">
                <p className="font-semibold">{a.activityName}</p>
                <p className="text-sm">{a.description}</p>
                <p className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()} - ₱{a.expenses}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Active Projects --- */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
        <p className="text-xl font-bold">{activeProjects.length}</p>
      </div>
    </div>
  );
}

export default Dashboard;
