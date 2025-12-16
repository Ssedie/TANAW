// src/pages/Documents.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Documents() {
  const { auth } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Budget creation state
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [budgetFiscalYear, setBudgetFiscalYear] = useState(new Date().getFullYear().toString());
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetDescription, setBudgetDescription] = useState("");
  const [budgetSubmitting, setBudgetSubmitting] = useState(false);
  const [budgetsByDoc, setBudgetsByDoc] = useState({});
  const [allowPastYears, setAllowPastYears] = useState(false);

  const fetchDocuments = async () => {
    if (!auth?.token) return;
    try {
      const res = await axios.get(`${API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDocuments(res.data);
      
      // Fetch budgets for each document
      res.data.forEach(doc => {
        if (doc.documentType === "Project Plan") {
          axios.get(`${API_URL}/api/documents/${doc.documentId}/budgets`, {
            headers: { Authorization: `Bearer ${auth.token}` },
          })
          .then(budgetRes => {
            setBudgetsByDoc(prev => ({ ...prev, [doc.documentId]: budgetRes.data }));
          })
          .catch(console.error);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [auth]);

  // Handle document upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !type) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully!");
      setTitle("");
      setType("General");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle budget creation
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    
    // Validate fiscal year
    const year = parseInt(budgetFiscalYear);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year)) {
      alert("Please enter a valid fiscal year");
      return;
    }
    
    // Only check for past years if the checkbox is not enabled
    if (!allowPastYears && year < currentYear) {
      alert(`Fiscal year cannot be before the current year (${currentYear}). Check "Allow past years" if you need to enter historical data.`);
      return;
    }
    
    if (year > currentYear + 10) {
      alert("Fiscal year cannot be more than 10 years in the future");
      return;
    }
    
    if (!selectedDocId || !budgetFiscalYear || !budgetAmount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setBudgetSubmitting(true);
      const response = await axios.post(
        `${API_URL}/api/documents/budget`,
        {
          documentId: selectedDocId,
          fiscalYear: budgetFiscalYear,
          totalBudget: budgetAmount,
          description: budgetDescription,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      alert("Budget created successfully!");
      setBudgetAmount("");
      setBudgetDescription("");
      setBudgetFiscalYear(new Date().getFullYear().toString());
      setSelectedDocId(null);

      // Refresh budgets
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Failed to create budget");
    } finally {
      setBudgetSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-[#4B3A2F] mb-6">Documents</h1>

      {/* Admin-only Upload Form */}
      {auth?.role === "ADMIN" && (
        <>
          <div className="bg-white shadow rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                  <option value="General">General</option>
                  <option value="Project Plan">Project Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mt-1 block w-full"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#4B3A2F] text-white rounded hover:bg-[#3a2c24]"
              >
                {loading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>

          {/* Budget Creation Form */}
          <div className="bg-white shadow rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Budget for Project Plan</h2>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Project Plan</label>
                <select
                  value={selectedDocId || ""}
                  onChange={(e) => setSelectedDocId(e.target.value ? parseInt(e.target.value) : null)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                >
                  <option value="">Choose a project plan...</option>
                  {documents
                    .filter(doc => doc.documentType === "Project Plan")
                    .map(doc => (
                      <option key={doc.documentId} value={doc.documentId}>
                        {doc.documentTitle}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fiscal Year</label>
                <input
                  type="number"
                  value={budgetFiscalYear}
                  onChange={(e) => setBudgetFiscalYear(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  placeholder="e.g., 2025"
                  min={allowPastYears ? "2000" : new Date().getFullYear()}
                  max={new Date().getFullYear() + 10}
                  step="1"
                  required
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="allowPastYears"
                    checked={allowPastYears}
                    onChange={(e) => setAllowPastYears(e.target.checked)}
                    className="h-4 w-4 text-[#FF6404] focus:ring-[#FF6404] border-gray-300 rounded"
                  />
                  <label htmlFor="allowPastYears" className="ml-2 text-sm text-gray-600">
                    Allow past years (for historical data entry)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Budget Amount</label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  placeholder="e.g., 5000000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  rows="3"
                  placeholder="Enter budget description..."
                />
              </div>

              <button
                type="submit"
                disabled={budgetSubmitting}
                className="px-4 py-2 bg-[#FF6404] text-white rounded hover:bg-[#e55a00]"
              >
                {budgetSubmitting ? "Creating..." : "Create Budget"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Document List */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.documentId} className="p-4 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-lg">{doc.documentTitle}</div>
                    <div className="text-sm text-gray-500">{doc.documentType}</div>
                  </div>
                  <a
                    href={`${API_URL}/api/documents/${doc.documentId}/download`}
                    className="px-3 py-1 bg-[#4B3A2F] text-white rounded text-sm hover:bg-[#3a2c24]"
                  >
                    Download
                  </a>
                </div>

                {/* Show budgets for this document if it's a Project Plan */}
                {doc.documentType === "Project Plan" && budgetsByDoc[doc.documentId] && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="font-semibold text-sm mb-2">Budgets:</p>
                    {budgetsByDoc[doc.documentId].length === 0 ? (
                      <p className="text-sm text-gray-600">No budgets created yet</p>
                    ) : (
                      <ul className="space-y-1">
                        {budgetsByDoc[doc.documentId].map((budget, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            <span className="font-medium">FY {budget.fiscalYear}:</span> ₱{(budget.totalBudget || 0).toLocaleString()}
                            {budget.description && <p className="text-xs text-gray-600">{budget.description}</p>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Documents;