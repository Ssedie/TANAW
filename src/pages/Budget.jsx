// src/pages/Budget.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import Card from "../components/Card";
import SkeletonLoader from "../components/SkeletonLoader";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

export default function Budget() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [overview, setOverview] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [availableFiscalYears, setAvailableFiscalYears] = useState([]);

  // --- Fetch current fiscal year and available years ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

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

  // --- Fetch projects and budget summary ---
  useEffect(() => {
    if (!auth?.token) return;
    const headers = { Authorization: `Bearer ${auth.token}` };
    setLoading(true);

    axios.get(`${API_URL}/api/projects`, { headers })
      .then(res => setProjects(res.data))
      .catch(console.error);

    // Get budget summary for all years
    axios.get(`${API_URL}/api/dashboard/budget-summary-all-years`, { headers })
      .then(res => setBudgetSummary(res.data))
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

  // --- Fetch activities per project ---
  useEffect(() => {
    if (!auth?.token || projects.length === 0) return;
    const headers = { Authorization: `Bearer ${auth.token}` };

    projects.forEach(proj => {
      axios.get(`${API_URL}/api/activities/project/${proj.projectId}`, { headers })
        .then(res => setActivitiesMap(prev => ({ ...prev, [proj.projectId]: res.data })))
        .catch(console.error);
    });
  }, [projects, auth]);

  // --- Calculate spending per project ---
  const projectSpentMap = {};
  projects.forEach(p => {
    const acts = activitiesMap[p.projectId] || [];
    projectSpentMap[p.projectId] = acts.reduce((sum, a) => sum + Number(a.expenses || 0), 0);
  });

  // --- Budget by status for selected year ---
  const budgetByStatus = projects.reduce((acc, p) => {
    const status = p.projectStatus || "UNKNOWN";
    acc[status] = (acc[status] || 0) + (p.allocatedBudget || 0);
    return acc;
  }, {});

  const chartData = Object.entries(budgetByStatus).map(([status, amount]) => ({
    projectStatus: status,
    allocatedBudget: amount
  }));

  const totalSpent = Object.values(projectSpentMap).reduce((sum, val) => sum + val, 0);
  const totalBudget = overview?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;
  const spendPercentage = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#4B3A2F]">Budget Overview</h1>
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

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <h3 className="text-sm text-gray-600 font-semibold">Total Budget (FY {selectedFiscalYear})</h3>
          <p className="text-2xl font-bold text-[#4B3A2F] mt-2">₱{totalBudget.toLocaleString()}</p>
        </Card>
        <Card className="bg-white">
          <h3 className="text-sm text-gray-600 font-semibold">Total Spent</h3>
          <p className="text-2xl font-bold text-[#FF6404] mt-2">₱{totalSpent.toLocaleString()}</p>
        </Card>
        <Card className="bg-white">
          <h3 className="text-sm text-gray-600 font-semibold">Remaining</h3>
          <p className={`text-2xl font-bold mt-2 ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₱{remaining.toLocaleString()}
          </p>
        </Card>
        <Card className="bg-white">
          <h3 className="text-sm text-gray-600 font-semibold">Spent %</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{spendPercentage}%</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF6404] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(spendPercentage, 100)}%` }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Budget by Status Chart */}
      <Card className="mb-8 h-80">
        <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Budget Allocation by Project Status (FY {selectedFiscalYear})</h2>
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
        ) : loading ? (
          <SkeletonLoader className="h-full" />
        ) : (
          <p className="text-gray-500">No project data</p>
        )}
      </Card>

      {/* Budget Trend across all years */}
      <Card className="mb-8 h-80">
        <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Budget Trend Across Years</h2>
        {budgetSummary.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={budgetSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fiscalYear" />
              <YAxis />
              <Tooltip formatter={value => `₱${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="totalBudget" stroke="#4B3A2F" strokeWidth={2} name="Total Budget" />
              <Line type="monotone" dataKey="totalSpent" stroke="#FF6404" strokeWidth={2} name="Total Spent" />
              <Line type="monotone" dataKey="remaining" stroke="#2ecc71" strokeWidth={2} name="Remaining" />
            </LineChart>
          </ResponsiveContainer>
        ) : loading ? (
          <SkeletonLoader className="h-full" />
        ) : (
          <p className="text-gray-500">No budget data available</p>
        )}
      </Card>

      {/* Detailed Project Budget Breakdown */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Project Budget Breakdown (FY {selectedFiscalYear})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-3 font-semibold text-gray-700">Project Name</th>
                <th className="p-3 font-semibold text-gray-700">Type</th>
                <th className="p-3 font-semibold text-gray-700">Allocated</th>
                <th className="p-3 font-semibold text-gray-700">Spent</th>
                <th className="p-3 font-semibold text-gray-700">Remaining</th>
                <th className="p-3 font-semibold text-gray-700">Progress</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const spent = projectSpentMap[p.projectId] || 0;
                const allocated = Number(p.allocatedBudget || 0);
                const remaining = allocated - spent;
                const progress = ((spent / (allocated || 1)) * 100).toFixed(1);

                return (
                  <tr key={p.projectId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium text-[#4B3A2F]">{p.projectName}</td>
                    <td className="p-3 text-gray-700">{p.projectType}</td>
                    <td className="p-3 text-gray-700">₱{allocated.toLocaleString()}</td>
                    <td className="p-3 text-[#FF6404] font-semibold">₱{spent.toLocaleString()}</td>
                    <td className={`p-3 font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{remaining.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#FF6404] h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{progress}%</span>
                    </td>
                    <td className="p-3">
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
          <p className="text-gray-500 text-center py-4">No projects for this fiscal year</p>
        )}
      </Card>

      {/* Budget Summary for All Years */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Historical Budget Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-3 font-semibold text-gray-700">Fiscal Year</th>
                <th className="p-3 font-semibold text-gray-700">Total Budget</th>
                <th className="p-3 font-semibold text-gray-700">Total Spent</th>
                <th className="p-3 font-semibold text-gray-700">Remaining</th>
                <th className="p-3 font-semibold text-gray-700">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {budgetSummary.map(year => {
                const utilization = year.totalBudget > 0 ? ((year.totalSpent / year.totalBudget) * 100).toFixed(1) : 0;

                return (
                  <tr key={year.fiscalYear} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-[#4B3A2F]">{year.fiscalYear}</td>
                    <td className="p-3 text-gray-700">₱{year.totalBudget.toLocaleString()}</td>
                    <td className="p-3 text-[#FF6404] font-semibold">₱{year.totalSpent.toLocaleString()}</td>
                    <td className={`p-3 font-semibold ${year.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{year.remaining.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#FF6404] h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{utilization}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {budgetSummary.length === 0 && (
          <p className="text-gray-500 text-center py-4">No budget data available</p>
        )}
      </Card>
    </div>
  );
}