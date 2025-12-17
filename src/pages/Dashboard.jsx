import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import Pagination, { usePagination } from "../components/Pagination";

function Dashboard() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [availableFiscalYears, setAvailableFiscalYears] = useState([]);
  const [overview, setOverview] = useState(null);
  const [budgetDistribution, setBudgetDistribution] = useState([]);
  const [spendingByType, setSpendingByType] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const headers = { Authorization: `Bearer ${auth?.token}` };

  // Fetch current FY and available FYs on mount
  useEffect(() => {
    if (!auth?.token) return;

    axios.get(`${API_URL}/api/dashboard/fiscal-year/current`, { headers })
      .then(res => {
        const year = res.data.currentFiscalYear;
        setCurrentFiscalYear(year);
        setSelectedFiscalYear(year);
      })
      .catch(console.error);

    axios.get(`${API_URL}/api/dashboard/fiscal-years/available`, { headers })
      .then(res => setAvailableFiscalYears(res.data))
      .catch(console.error);
  }, [auth]);

  // Fetch all data when fiscal year changes
  useEffect(() => {
    if (!auth?.token || !selectedFiscalYear) return;
    
    fetchDashboardData();
  }, [auth, selectedFiscalYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch overview
      const overviewRes = await axios.get(`${API_URL}/api/dashboard/overview`, {
        headers,
        params: { fiscalYear: selectedFiscalYear }
      });
      setOverview(overviewRes.data);

      // Fetch projects for fiscal year
      const projectsRes = await axios.get(`${API_URL}/api/projects`, {
        headers,
        params: { fiscalYear: selectedFiscalYear }
      });
      setProjects(projectsRes.data);

      // Fetch activities for fiscal year
      const activitiesRes = await axios.get(`${API_URL}/api/dashboard/activities`, {
        headers,
        params: { fiscalYear: selectedFiscalYear }
      });
      setActivities(activitiesRes.data);

      // Fetch budget distribution by PROJECT TYPE for fiscal year
      const distributionRes = await axios.get(`${API_URL}/api/dashboard/budget-distribution`, {
        headers,
        params: { fiscalYear: selectedFiscalYear }
      });
      setBudgetDistribution(distributionRes.data);

      // Fetch spending by project type
      const spendingRes = await axios.get(`${API_URL}/api/dashboard/budget-distribution-detailed`, {
        headers,
        params: { fiscalYear: selectedFiscalYear }
      });
      setSpendingByType(spendingRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = overview?.totalBudget || 0;
  const totalSpent = overview?.totalSpent || 0;
  const totalAvailable = totalBudget - totalSpent;
  const activeProjects = overview?.activeProjects || 0;

  // Colors for different project types
  const projectTypeColors = {
    "INFRASTRUCTURE": "#FF6404",
    "HEALTH & SANITATION": "#4B3A2F",
    "EDUCATION": "#FFA500",
    "AGRICULTURAL": "#6B8E23",
    "SECURITY": "#8B4513",
    "VAWCII": "#9370DB",
    "GENERAL": "#00BFFF"
  };

  const getColorForType = (type) => {
    return projectTypeColors[type] || "#808080";
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Budget (FY {selectedFiscalYear})</h2>
          <p className="text-2xl font-bold">₱{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Spent</h2>
          <p className="text-2xl font-bold text-[#FF6404]">₱{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Available</h2>
          <p className={`text-2xl font-bold ${totalAvailable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₱{totalAvailable.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget Distribution by Project Type */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Budget Distribution by Project Type (FY {selectedFiscalYear})</h2>
        {budgetDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="projectType" />
              <YAxis />
              <Tooltip formatter={value => `₱${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="totalBudget" name="Allocated Budget"
                label={({ x, y, width, value }) => {
                  const percentage = ((value / totalBudget) * 100).toFixed(1);
                  return (
                    <text x={x + width / 2} y={y - 5} fill="#333" textAnchor="middle" fontSize="12">
                      {percentage}%
                    </text>
                  );
                }}
              >
                {budgetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorForType(entry.projectType)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <p className="text-gray-500 text-center">No budget distribution data for FY {selectedFiscalYear}</p>
        )}
      </div>

      {/* Spending by Project Type */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Spending Analysis by Project Type (FY {selectedFiscalYear})</h2>
        {spendingByType.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingByType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="projectType" />
              <YAxis />
              <Tooltip formatter={value => `₱${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="totalAllocated" name="Allocated" fill="#4B3A2F" />
              <Bar dataKey="totalSpent" name="Spent" fill="#FF6404" />
              <Bar dataKey="remaining" name="Remaining" fill="#6B8E23" />
            </BarChart>
          </ResponsiveContainer>
        ) : loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <p className="text-gray-500 text-center">No spending data for FY {selectedFiscalYear}</p>
        )}
      </div>

      {/* Spending Summary Table by Type */}
      {spendingByType.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Budget Utilization by Type</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Project Type</th>
                  <th className="p-2">Allocated</th>
                  <th className="p-2">Spent</th>
                  <th className="p-2">Remaining</th>
                  <th className="p-2">Utilization %</th>
                </tr>
              </thead>
              <tbody>
                {spendingByType.map((type, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold" style={{ color: getColorForType(type.projectType) }}>
                      {type.projectType}
                    </td>
                    <td className="p-2">₱{Number(type.totalAllocated).toLocaleString()}</td>
                    <td className="p-2 text-[#FF6404] font-semibold">₱{Number(type.totalSpent).toLocaleString()}</td>
                    <td className={`p-2 font-semibold ${type.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{Number(type.remaining).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FF6404] h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(type.utilizationPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{Number(type.utilizationPercentage).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Status Table */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Project Name</th>
                <th className="p-2">Type</th>
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
                    <td className="p-2">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                        backgroundColor: getColorForType(p.projectType) + '20', 
                        color: getColorForType(p.projectType) 
                      }}>
                        {p.projectType || "GENERAL"}
                      </span>
                    </td>
                    <td className="p-2">₱{Number(p.allocatedBudget || 0).toLocaleString()}</td>
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
        {projects.length === 0 && !loading && (
          <p className="text-gray-500 text-center py-4">No projects available for FY {selectedFiscalYear}</p>
        )}
        {loading && (
          <p className="text-gray-500 text-center py-4">Loading...</p>
        )}
        <Pagination
          currentPage={projectsPage}
          totalPages={projectsTotalPages}
          onPageChange={goToProjectsPage}
          itemsPerPage={7}
          totalItems={totalProjects}
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities (FY {selectedFiscalYear})</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activities for FY {selectedFiscalYear}</p>
        ) : (
          <>
            <ul className="space-y-2">
              {currentActivities.map(a => (
                <li key={a.activityId} className="border-b p-2 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{a.activityName}</p>
                      <p className="text-sm text-gray-600">{a.description}</p>
                      <p className="text-xs text-gray-500">
                        Project: {a.projectName} 
                        {a.projectType && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ 
                            backgroundColor: getColorForType(a.projectType) + '20', 
                            color: getColorForType(a.projectType) 
                          }}>
                            {a.projectType}
                          </span>
                        )}
                        {' | '} {new Date(a.date).toLocaleDateString()}
                      </p>
                    </div>
                    {a.expenses && (
                      <span className="text-sm font-semibold text-[#FF6404]">
                        ₱{Number(a.expenses).toLocaleString()}
                      </span>
                    )}
                  </div>
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

      {/* Active Projects Count */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Active Projects (FY {selectedFiscalYear})</h2>
        <p className="text-4xl font-bold text-[#4B3A2F]">{activeProjects}</p>
      </div>
    </div>
  );
}

export default Dashboard;