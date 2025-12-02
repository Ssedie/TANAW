import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Budget() {
  const { auth } = useAuth();   // get the token from context
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8B5E3C", "#C4A484", "#6B8E23", "#D2B48C"]; // earthy palette

  useEffect(() => {
    if (!auth?.token) return;  // ensure token exists

    const headers = {
      Authorization: `Bearer ${auth.token}`,
    };

    setLoading(true);

    Promise.all([
      axios.get(`${API_URL}/api/dashboard/budget-summary`, { headers })
    ])
      .then(([budgetRes]) => {
        setBudgetSummary(budgetRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, [auth]);

  return (
    <div className="p-8 bg-[#FAF7F1] min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#4B3A2F] mb-6">Budget Overview</h1>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Budget Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4B3A2F]">Budget Summary</h2>
          <div className="space-y-3">
            {budgetSummary.length > 0 ? (
              budgetSummary.map((b, i) => (
                <div key={i} className="p-3 bg-[#F3E9D2] rounded-lg shadow-sm">
                  <p className="font-semibold text-[#4B3A2F]">{b.documentTitle}</p>
                  <p className="text-sm text-gray-700">
                    Approved: ₱{b.totalApproved.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Expenses: ₱{b.totalExpenses.toLocaleString()}
                  </p>
                </div>
              ))
            ) : loading ? (
              <p>Loading budget summary...</p>
            ) : (
              <p>No budget data available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Budget;
