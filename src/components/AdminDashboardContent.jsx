import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Trash2, RotateCcw, Eye, CheckCircle, XCircle, X } from "lucide-react";

const AdminDashboardContent = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [statusChangeUserId, setStatusChangeUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!auth?.token) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/users", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [auth]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/role/${userId}`,
        null,
        { 
          params: { role: newRole }, 
          headers: { Authorization: `Bearer ${auth.token}` } 
        }
      );
      setUsers(prev =>
        prev.map(user => (user.userId === userId ? { ...user, role: newRole } : user))
      );
      showToast("Role updated successfully", "success");
    } catch (err) {
      console.error("Error updating role:", err);
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handlePasswordReset = async (userId) => {
    const newPassword = prompt("Enter new password for this user:");
    if (!newPassword) return;

    try {
      await axios.put(
        `http://localhost:8000/api/admin/password/${userId}`,
        null,
        { 
          params: { newPassword }, 
          headers: { Authorization: `Bearer ${auth.token}` } 
        }
      );
      showToast("Password updated successfully", "success");
    } catch (err) {
      console.error("Error updating password:", err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/status/${userId}`,
        null,
        { 
          params: { accountStatus: newStatus }, 
          headers: { Authorization: `Bearer ${auth.token}` } 
        }
      );
      setUsers(prev =>
        prev.map(user => (user.userId === userId ? { ...user, accountStatus: newStatus } : user))
      );
      showToast(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, "success");
      setStatusChangeUserId(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(prev => prev.filter(user => user.userId !== deleteUserId));
      showToast("User deleted successfully", "success");
      setDeleteUserId(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => setSelectedUser(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const getUserAvatar = (user) => {
    if (user.picturePath) return `http://localhost:8000/${user.picturePath}?t=${Date.now()}`;
    return `${(user.fname?.[0] || "T").toUpperCase()}${(user.lname?.[0] || "W").toUpperCase()}`;
  };

  if (loading) return <div className="p-6 text-gray-600">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#5C7D92]">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage all users and their accounts</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center text-gray-600 py-10 bg-white rounded-lg">No users found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-[#5C7D92] to-[#FF6404] text-white sticky top-0">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">ID</th>
                <th className="py-4 px-6 text-left font-semibold">Name</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-left font-semibold">Role</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
                <th className="py-4 px-6 text-left font-semibold">Phone</th>
                <th className="py-4 px-6 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.userId}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150 border-b border-gray-200 ${user.accountStatus !== 'ACTIVE' ? 'opacity-70' : ''}`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700 ">{user.userId}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {user.fname} {user.mname} {user.lname}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#FF6404] font-medium">{user.email}</td>
                  <td className="py-4 px-6">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                      disabled={user.accountStatus !== 'ACTIVE'}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6404] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <option value="CITIZEN">CITIZEN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${
                      user.accountStatus === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.accountStatus === 'ACTIVE' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {user.accountStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{user.phoneNumber || "-"}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 flex-wrap">
                      {user.accountStatus === 'ACTIVE' && (
                        <button
                          onClick={() => handlePasswordReset(user.userId)}
                          className="bg-[#5C7D92] hover:bg-[#4e6b7d] text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleView(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatusChangeUserId(user.userId)}
                        className={`text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium ${
                          user.accountStatus === 'ACTIVE'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        title={user.accountStatus === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.accountStatus === 'ACTIVE' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteUserId(user.userId)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#5C7D92] via-[#6b8fa3] to-[#FF6404] p-8 text-white">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full p-2 transition duration-200"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  {selectedUser.picturePath ? (
                    <img
                      src={getUserAvatar(selectedUser)}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-white/30 to-white/10 border-4 border-white shadow-xl">
                      {getUserAvatar(selectedUser)}
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    selectedUser.accountStatus === 'ACTIVE' 
                      ? 'bg-green-400' 
                      : 'bg-red-400'
                  } text-white`}>
                    {selectedUser.accountStatus === 'ACTIVE' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">{selectedUser.fname} {selectedUser.lname}</h2>
                  <p className="text-white/90 text-sm mb-3">ID: {selectedUser.userId}</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                    selectedUser.role === 'ADMIN' 
                      ? 'bg-purple-300 text-purple-900' 
                      : 'bg-blue-300 text-blue-900'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[65vh] overflow-y-auto p-8">
              {selectedUser.accountStatus !== 'ACTIVE' && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Account Inactive</p>
                    <p className="text-sm text-red-700 mt-1">This user account is currently inactive and cannot access the system.</p>
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#5C7D92] mb-4">Personal Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">First Name</label>
                    <p className="text-gray-900 font-medium">{selectedUser.fname || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">Middle Name</label>
                    <p className="text-gray-900 font-medium">{selectedUser.mname || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">Last Name</label>
                    <p className="text-gray-900 font-medium">{selectedUser.lname || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl col-span-3">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">Birth Date</label>
                    <p className="text-gray-900 font-medium">{selectedUser.birthDate || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#5C7D92] mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">Email</label>
                    <p className="text-[#FF6404] font-medium break-all">{selectedUser.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider block mb-2">Phone</label>
                    <p className="text-gray-900 font-medium">{selectedUser.phoneNumber || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#5C7D92] mb-4">Address</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-sm font-medium">
                    {selectedUser.street && `${selectedUser.street}`}
                    {selectedUser.barangay && `, ${selectedUser.barangay}`}
                    {selectedUser.city && `, ${selectedUser.city}`}
                    {selectedUser.province && `, ${selectedUser.province}`}
                    {selectedUser.region && `, ${selectedUser.region}`}
                    {selectedUser.country && `, ${selectedUser.country}`}
                    {selectedUser.zipCode && ` ${selectedUser.zipCode}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-40 px-6 py-4 rounded-lg text-white font-medium shadow-lg animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className={`${users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE' ? 'bg-yellow-100' : 'bg-green-100'} p-4 rounded-full`}>
                {users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE' ? (
                  <XCircle className="w-8 h-8 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE' 
                ? 'Deactivate User?' 
                : 'Activate User?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE'
                ? 'The user will lose access to the system. They can be reactivated later.'
                : 'The user will regain access to the system.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStatusChangeUserId(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const user = users.find(u => u.userId === statusChangeUserId);
                  const newStatus = user?.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                  handleStatusChange(statusChangeUserId, newStatus);
                }}
                className={`px-6 py-2 text-white font-medium rounded-lg transition duration-200 ${
                  users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {users.find(u => u.userId === statusChangeUserId)?.accountStatus === 'ACTIVE' 
                  ? 'Deactivate' 
                  : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardContent;