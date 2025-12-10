// src/pages/Dashboard.jsx
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
  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [projectFeedbackCounts, setProjectFeedbackCounts] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectFeedbacks, setSelectedProjectFeedbacks] = useState([]);
  const [budgetDistribution, setBudgetDistribution] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8B5E3C", "#C4A484", "#6B8E23", "#D2B48C", "#A67B5B", "#7D5A50"];

  useEffect(() => {
    if (!auth?.token) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${auth.token}` };

    Promise.all([
      axios.get(`${API_URL}/api/dashboard/overview`, { headers }),
      axios.get(`${API_URL}/api/dashboard/budget-distribution`, { headers }),
      axios.get(`${API_URL}/api/dashboard/project-status`, { headers }),
      axios.get(`${API_URL}/api/dashboard/activities`, { headers }),
      axios.get(`${API_URL}/api/dashboard/project-feedback`, { headers }),
      axios.get(`${API_URL}/api/dashboard/users-by-status`, { headers })
    ])
      .then(([overviewRes, distRes, projRes, actRes, fbRes, usersRes]) => {
        // Overview
        setOverview(overviewRes.data);

        // Budget distribution (optional, per project or sector)
        setBudgetDistribution(distRes.data.map(b => ({
          sector: b.documentType || "Unknown",
          amount: Number(b.approvedBudget || 0)
        })));

        // Project status
        setProjectStatus(projRes.data.map(p => ({
          ...p,
          allocatedBudget: Number(p.allocatedBudget || 0),
          spentBudget: Number(p.spentBudget || 0),
          progress: Number(p.progress || 0)
        })));

        // Activities
        setActivities(actRes.data
          .map(a => ({ ...a }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
        );

        // Feedback summary
        setProjectFeedbackCounts(fbRes.data);

        // User stats
        setUserStats(usersRes.data || []);
      })
      .catch(err => console.error("Dashboard fetch error:", err))
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
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Dashboard Overview</h1>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm text-gray-500">Total Budget</h3>
          <p className="text-2xl font-bold mt-2">
            ₱{overview ? Number(overview.totalBudget || 0).toLocaleString() : "0"}
          </p>
          <div className="mt-1 text-xs text-gray-500">
            Spent: ₱{overview ? Number(overview.totalSpent || 0).toLocaleString() : "0"}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Remaining: ₱{overview ? Number(overview.totalBudget - overview.totalSpent || 0).toLocaleString() : "0"}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm text-gray-500">Active Projects</h3>
          <p className="text-2xl font-bold mt-2">{overview ? overview.activeProjects : 0}</p>
          <div className="mt-2 text-xs text-gray-500">
            On-time: {overview?.onTimeProjects ?? 0} · Delayed: {overview?.delayedProjects ?? 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm text-gray-500">User Stats</h3>
          <p className="text-2xl font-bold mt-2">{userStats.reduce((acc, u) => acc + (u.count || 0), 0)}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Left column: Budget distribution chart */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Budget Distribution</h2>
          <div className="h-64">
            {budgetDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetDistribution} dataKey="amount" nameKey="sector" innerRadius={40} outerRadius={80} paddingAngle={4}>
                    {budgetDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : loading ? <p>Loading...</p> : <p>No distribution data</p>}
          </div>
        </div>

        {/* Middle column: Project status table */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Project Status</h2>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-gray-500">
                  <th className="p-2">Project</th>
                  <th className="p-2">Budget</th>
                  <th className="p-2">Spent</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {projectStatus.length > 0 ? projectStatus.map((p, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="p-2">{p.projectName}</td>
                    <td className="p-2">₱{Number(p.allocatedBudget || 0).toLocaleString()}</td>
                    <td className="p-2">₱{Number(p.spentBudget || 0).toLocaleString()}</td>
                    <td className="p-2">{p.progress.toFixed(2)}%</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "-"}</td>
                  </tr>
                )) : loading ? <tr><td colSpan="6" className="p-4">Loading...</td></tr> : <tr><td colSpan="6" className="p-4">No projects</td></tr>}
              </tbody>
            </table>
          </div>
        </div>{/* Middle column: project status table */}
        <div className="col-span-1 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Project Status</h2>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-gray-500">
                  <th className="p-2">Project</th>
                  <th className="p-2">Allocated</th>
                  <th className="p-2">Spent</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {projectStatus.length > 0 ? projectStatus.map((p, i) => {
                  // Compute progress relative to total budget
                  const allocated = Number(p.allocatedBudget || 0);
                  const spent = Number(p.spentBudget || 0);
                  const progressPercentage = overview?.totalBudget
                    ? Math.min(100, (spent / overview.totalBudget) * 100)
                    : allocated > 0
                      ? Math.min(100, (spent / allocated) * 100)
                      : 0;

                  return (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="p-2">{p.projectName}</td>
                      <td className="p-2">₱{allocated.toLocaleString()}</td>
                      <td className="p-2">₱{spent.toLocaleString()}</td>
                      <td className="p-2">{progressPercentage.toFixed(2)}%</td>
                      <td className="p-2">{p.status}</td>
                      <td className="p-2">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "-"}</td>
                    </tr>
                  );
                }) : loading ? <tr><td colSpan="6" className="p-4">Loading...</td></tr> : <tr><td colSpan="6" className="p-4">No projects</td></tr>}
              </tbody>
            </table>
          </div>
        </div>


        {/* Right column: Activities & Feedback */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Recent Activities</h2>
            <ul className="space-y-3 max-h-64 overflow-auto">
              {activities.length > 0 ? activities.map((a, i) => (
                <li key={i} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <div className="font-semibold">{a.activityName}</div>
                    <div className="text-xs text-gray-400">{a.date}</div>
                  </div>
                  <div className="text-sm text-gray-600">{a.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.projectName ? `Project: ${a.projectName}` : ""}</div>
                </li>
              )) : loading ? <p>Loading...</p> : <p>No activities</p>}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Project Feedbacks</h2>
            {projectFeedbackCounts.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-auto">
                {projectFeedbackCounts.map((p, i) => (
                  <li key={i} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <div>
                      <div className="font-medium">{p.projectName}</div>
                      <div className="text-xs text-gray-500">{p.feedbackCount} feedbacks</div>
                    </div>
                    <button
                      className="px-2 py-1 bg-[#4B3A2F] text-white rounded"
                      onClick={() => fetchFeedbacksByProject(p.projectId)}
                    >View</button>
                  </li>
                ))}
              </ul>
            ) : loading ? <p>Loading...</p> : <p>No feedback summary</p>}
          </div>
        </div>
      </div>

      {/* Feedback details */}
      {selectedProjectId && (
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mb-2 text-[#4B3A2F]">Feedbacks for Project</h3>
            <button onClick={() => { setSelectedProjectId(null); setSelectedProjectFeedbacks([]); }} className="text-sm text-gray-500">Close</button>
          </div>

          {selectedProjectFeedbacks.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedProjectFeedbacks.map((f, i) => (
                <li key={i} className="p-2 border rounded">
                  <p className="text-sm"><strong>{f.user?.fName ? `${f.user.fName} ${f.user.lName ?? ""}` : "Anonymous"}:</strong> {f.content}</p>
                  <p className="text-xs text-gray-400">{new Date(f.uploadDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No feedbacks for this project.</p>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
