import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import {
  Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function Projects() {
  const { auth } = useAuth();   // get the token from context
  const [projectStats, setProjectStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8B5E3C", "#C4A484", "#6B8E23", "#D2B48C"]; // earthy palette

  useEffect(() => {
    if (!auth?.token) return;  // ensure token exists

    const headers = {
      Authorization: `Bearer ${auth.token}`,
    };

    setLoading(true);

    Promise.all([
      axios.get(`${API_URL}/api/dashboard/projects-by-status`, { headers })
    ])
      .then(([projectsRes]) => {
        setProjectStats(projectsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, [auth]);

  return (
    <div className="p-8 bg-[#FAF7F1] min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Dashboard Overview</h1>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Projects by Status */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Projects by Status</h2>
          <div className="h-64 flex items-center justify-center">
            {projectStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={projectStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="projectStatus" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6B8E23" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : loading ? (
              <p>Loading chart...</p>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Projects;
