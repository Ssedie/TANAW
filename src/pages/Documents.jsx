// src/pages/Documents.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Documents() {
  const { auth } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General"); // default type
  const [file, setFile] = useState(null);
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    if (!auth?.token) return;
    try {
      const res = await axios.get(`${API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [auth]);

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
    if (type === "Approved Budget" && totalBudget) {
      formData.append("totalBudget", totalBudget);
    }

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
      setTotalBudget("");
      fetchDocuments(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-[#4B3A2F] mb-6">Documents</h1>

      {/* Upload Form */}
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
              <option value="Approved Budget">Approved Budget</option>
              <option value="Project Plan">Project Plan</option>
            </select>
          </div>

          {type === "Approved Budget" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Budget</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
          )}

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
            className="px-4 py-2 bg-[#4B3A2F] text-white rounded"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* Document List */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.documentId} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{doc.documentTitle}</div>
                  <div className="text-xs text-gray-500">{doc.documentType}</div>
                  <div className="text-xs text-gray-400">{new Date(doc.uploadDate).toLocaleDateString()}</div>
                </div>
                <a
                  href={`${API_URL}/api/documents/${doc.documentId}/download`}
                  className="px-2 py-1 bg-[#4B3A2F] text-white rounded text-sm"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Documents;
