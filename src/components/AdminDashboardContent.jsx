import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const AdminDashboardContent = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        setError(err.response?.data || "Failed to fetch users");
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
        { params: { role: newRole }, headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, role: newRole } : user))
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert(err.response?.data || "Failed to update role");
    }
  };

  const handlePasswordReset = async (userId) => {
    const newPassword = prompt("Enter new password for this user:");
    if (!newPassword) return;

    try {
      await axios.put(
        `http://localhost:8000/api/admin/password/${userId}`,
        null,
        { params: { newPassword }, headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert("Password updated successfully");
    } catch (err) {
      console.error("Error updating password:", err);
      alert(err.response?.data || "Failed to update password");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-[#5C7D92]">Admin Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-[#5C7D92] to-[#D87300] text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.userId}
                className="bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-3 px-4">{user.userId}</td>
                <td className="py-3 px-4">{user.fname} {user.mname} {user.lname}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                    className="rounded-lg p-1 text-black font-medium"
                  >
                    <option value="CITIZEN">CITIZEN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="py-3 px-4">{user.accountStatus}</td>
                <td className="py-3 px-4">{user.phoneNumber || "-"}</td>
                <td className="py-3 px-4">
                  {user.street}, {user.barangay}, {user.city}, {user.province}, {user.region}, {user.country}, {user.zipCode || "-"}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handlePasswordReset(user.userId)}
                    className="bg-[#5C7D92] hover:bg-[#4e6b7d] text-white px-3 py-1 rounded-lg transition-colors duration-200"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
