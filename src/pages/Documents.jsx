import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";
import Pagination, { usePagination } from "../components/Pagination";
import { AlertCircle } from "lucide-react";

function Documents() {
  const { auth } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Budget creation state
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [budgetFiscalYear, setBudgetFiscalYear] = useState(new Date().getFullYear().toString());
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetDescription, setBudgetDescription] = useState("");
  const [budgetSubmitting, setBudgetSubmitting] = useState(false);
  const [budgetsByDoc, setBudgetsByDoc] = useState({});
  const [allowPastYears, setAllowPastYears] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [budgetSuccess, setBudgetSuccess] = useState("");

  // Pagination
  const {
    currentPage: docsPage,
    totalPages: docsTotalPages,
    currentItems: currentDocuments,
    goToPage: goToDocsPage,
    totalItems: totalDocs
  } = usePagination(documents, 7);

  useEffect(() => {
    if (auth?.userId) {
      if (auth.userId === 100001) {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    }
  }, [auth?.userId]);

  useEffect(() => {
    fetchDocuments();
  }, [auth]);

  const fetchDocuments = async () => {
    if (!auth?.token) return;
    try {
      const res = await axios.get(`${API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDocuments(res.data);
      
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

  // Clear success messages after 5 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  useEffect(() => {
    if (budgetSuccess) {
      const timer = setTimeout(() => setBudgetSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [budgetSuccess]);

  // Validate upload form
  const validateUpload = () => {
    setUploadError("");
    
    if (!title.trim()) {
      setUploadError("Title is required");
      return false;
    }
    
    if (!type) {
      setUploadError("Document type is required");
      return false;
    }
    
    if (!file) {
      setUploadError("Please select a file to upload");
      return false;
    }
    
    return true;
  };

  // Validate budget form
  const validateBudget = () => {
    setBudgetError("");
    
    if (!selectedDocId) {
      setBudgetError("Please select a project plan");
      return false;
    }
    
    const year = parseInt(budgetFiscalYear);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year)) {
      setBudgetError("Please enter a valid fiscal year");
      return false;
    }
    
    if (!allowPastYears && year < currentYear) {
      setBudgetError(`Fiscal year cannot be before the current year (${currentYear}). Check "Allow past years" if you need to enter historical data.`);
      return false;
    }
    
    if (year > currentYear + 10) {
      setBudgetError("Fiscal year cannot be more than 10 years in the future");
      return false;
    }
    
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      setBudgetError("Please enter a valid budget amount greater than 0");
      return false;
    }
    
    return true;
  };

  // Handle document upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!validateUpload()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadError("");
      await axios.post(`${API_URL}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess("Document uploaded successfully!");
      setTitle("");
      setType("General");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle budget creation
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    
    if (!validateBudget()) return;

    try {
      setBudgetSubmitting(true);
      setBudgetError("");
      await axios.post(
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

      setBudgetSuccess("Budget created successfully!");
      setBudgetAmount("");
      setBudgetDescription("");
      setBudgetFiscalYear(new Date().getFullYear().toString());
      setSelectedDocId(null);

      fetchDocuments();
    } catch (err) {
      console.error(err);
      setBudgetError(err.response?.data?.message || "Failed to create budget. Please try again.");
    } finally {
      setBudgetSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-[#4B3A2F] mb-6">Documents</h1>

      {/* Superadmin Notice */}
      {isSuperAdmin && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-semibold">⚠️ Superadmin Account</p>
            <p className="text-amber-800 text-sm mt-1">Document upload and budget creation are disabled for security reasons.</p>
          </div>
        </div>
      )}

      {/* Admin-only Upload Form (disabled for SUPERADMIN) */}
      {auth?.role === "ADMIN" && !isSuperAdmin && (
        <>
          <fieldset disabled={false}>
            <div className="bg-white shadow rounded p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              
              {uploadError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {uploadError}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                  {uploadSuccess}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    placeholder="Enter document title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    File <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mt-1 block w-full"
                  />
                  {file && <p className="mt-1 text-sm text-gray-600">Selected: {file.name}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#4B3A2F] text-white rounded hover:bg-[#3a2c24] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Uploading..." : "Upload Document"}
                </button>
              </form>
            </div>
          </fieldset>

          {/* Budget Creation Form */}
          <fieldset disabled={false}>
            <div className="bg-white shadow rounded p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Create Budget for Project Plan</h2>
              
              {budgetError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {budgetError}
                </div>
              )}
              
              {budgetSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                  {budgetSuccess}
                </div>
              )}

              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Project Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDocId || ""}
                    onChange={(e) => setSelectedDocId(e.target.value ? parseInt(e.target.value) : null)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Fiscal Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={budgetFiscalYear}
                    onChange={(e) => setBudgetFiscalYear(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    placeholder="e.g., 2025"
                    min={allowPastYears ? "2000" : new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    step="1"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Total Budget Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    placeholder="e.g., 5000000"
                    min="0"
                    step="0.01"
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
                  className="px-4 py-2 bg-[#FF6404] text-white rounded hover:bg-[#e55a00] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {budgetSubmitting ? "Creating..." : "Create Budget"}
                </button>
              </form>
            </div>
          </fieldset>
        </>
      )}

      {/* Document List with Pagination */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentDocuments.map((doc) => (
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
            <Pagination
              currentPage={docsPage}
              totalPages={docsTotalPages}
              onPageChange={goToDocsPage}
              itemsPerPage={7}
              totalItems={totalDocs}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Documents;