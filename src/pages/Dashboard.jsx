import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Pagination, { usePagination } from "../components/Pagination";

function Dashboard() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [availableFiscalYears, setAvailableFiscalYears] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination hooks
  const {
    currentPage: projectsPage,
    totalPages: projectsTotalPages,
    currentItems: currentProjects,
    goToPage: goToProjectsPage,
    totalItems: totalProjects
  } = usePagination(projects, 7);

  const {
    currentPage: activitiesPage,
    totalPages: activitiesTotalPages,
    currentItems: currentActivities,
    goToPage: goToActivitiesPage,
    totalItems: totalActivities
  } = usePagination(activities, 7);

  // --- Fetch data ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    // Get current fiscal year
    axios.get(`${API_URL}/api/dashboard/fiscal-year/current`, { headers })
      .then(res => {
        const year = res.data.currentFiscalYear;
        setCurrentFiscalYear(year);
        setSelectedFiscalYear(year);
      })
      .catch(console.error);

    // Get available fiscal years
    axios.get(`${API_URL}/api/dashboard/fiscal-years/available`, { headers })
      .then(res => setAvailableFiscalYears(res.data))
      .catch(console.error);

    // Get projects
    axios.get(`${API_URL}/api/projects`, { headers })
      .then(async res => {
        setProjects(res.data);

        // Fetch activities per project
        const allActivities = [];
        for (const proj of res.data) {
          try {
            const actRes = await axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers });
            allActivities.push(...actRes.data);
          } catch (err) {
            console.error(err);
          }
        }

        allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(allActivities);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth]);

  // --- Fetch overview when fiscal year changes ---
  useEffect(() => {
    if (!auth?.token || !selectedFiscalYear) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    axios.get(`${API_URL}/api/dashboard/overview`, {
      params: { fiscalYear: selectedFiscalYear },
      headers
    })
      .then(res => setOverview(res.data))
      .catch(console.error);
  }, [selectedFiscalYear, auth]);

  const totalSpent = projects.reduce((sum, p) => {
    const spent = (p.activities || []).reduce((aSum, a) => aSum + Number(a.expenses || 0), 0);
    return sum + spent;
  }, 0);

  const totalBudget = overview?.totalBudget || 0;
  const totalAvailable = totalBudget - totalSpent;

  const activeProjects = projects.filter(p => p.projectStatus === "ONGOING");

  // Budget distribution
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#4B3A2F]">Dashboard</h1>
        <div className="flex gap-4 items-center">
          {currentFiscalYear && (
            <div className="px-4 py-2 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-sm font-semibold text-blue-900">Current FY: {currentFiscalYear}</p>
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

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Budget (FY {selectedFiscalYear})</h2>
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

      {/* Project Status Table with Pagination */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
        <div className="overflow-x-auto">
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
              {currentProjects.map(p => {
                const spent = (p.activities || []).reduce((sum, a) => sum + Number(a.expenses || 0), 0);
                const progress = ((spent / (p.allocatedBudget || 1)) * 100).toFixed(1);
                return (
                  <tr key={p.projectId} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.projectName}</td>
                    <td className="p-2">₱{Number(p.allocatedBudget).toLocaleString()}</td>
                    <td className="p-2">₱{spent.toLocaleString()}</td>
                    <td className="p-2">{progress}%</td>
                    <td className="p-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.projectStatus === "COMPLETED" ? "bg-green-100 text-green-800" :
                        p.projectStatus === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {p.projectStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {projects.length === 0 && (
          <p className="text-gray-500 text-center py-4">No projects available</p>
        )}
        <Pagination
          currentPage={projectsPage}
          totalPages={projectsTotalPages}
          onPageChange={goToProjectsPage}
          itemsPerPage={7}
          totalItems={totalProjects}
        />
      </div>

      {/* Budget Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Budget Distribution by Type</h2>
        {budgetDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={value => `₱${value.toLocaleString()}`} />
              <Bar dataKey="amount">
                {budgetDistribution.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No project data available</p>
        )}
      </div>

      {/* Recent Activities with Pagination */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <p>No recent activities.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {currentActivities.map(a => (
                <li key={a.activityId} className="border-b p-2 hover:bg-gray-50">
                  <p className="font-semibold">{a.activityName}</p>
                  <p className="text-sm">{a.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleDateString()} 
                    {a.type === "Expense" && ` - ₱${Number(a.expenses || 0).toLocaleString()}`}
                  </p>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={activitiesPage}
              totalPages={activitiesTotalPages}
              onPageChange={goToActivitiesPage}
              itemsPerPage={7}
              totalItems={totalActivities}
            />
          </>
        )}
      </div>

      {/* Active Projects */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
        <p className="text-xl font-bold">{activeProjects.length}</p>
      </div>
    </div>
  );
}

export default Dashboard;