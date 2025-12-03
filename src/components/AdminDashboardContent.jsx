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
          headers: { Authorization: `Bearer ${auth.token}` }
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

  const handleInputChange = (userId, field, value) => {
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, [field]: value } : user))
    );
  };

  const handleSaveChanges = async (user) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${user.id}`,
        user,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert("User info updated successfully");
    } catch (err) {
      console.error("Error saving user info:", err);
      alert(err.response?.data || "Failed to save user info");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Super Admin Dashboard</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Middle Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Birth Date</th>
              <th className="border p-2">Street</th>
              <th className="border p-2">Barangay</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Province</th>
              <th className="border p-2">Region</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Zip Code</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.fName}
                    onChange={(e) => handleInputChange(user.id, "fName", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.mName || ""}
                    onChange={(e) => handleInputChange(user.id, "mName", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.lName}
                    onChange={(e) => handleInputChange(user.id, "lName", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleInputChange(user.id, "email", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="CITIZEN">CITIZEN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input
                    type="date"
                    value={user.birthDate || ""}
                    onChange={(e) => handleInputChange(user.id, "birthDate", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.street || ""}
                    onChange={(e) => handleInputChange(user.id, "street", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.barangay || ""}
                    onChange={(e) => handleInputChange(user.id, "barangay", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.city || ""}
                    onChange={(e) => handleInputChange(user.id, "city", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.province || ""}
                    onChange={(e) => handleInputChange(user.id, "province", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.region || ""}
                    onChange={(e) => handleInputChange(user.id, "region", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.country || ""}
                    onChange={(e) => handleInputChange(user.id, "country", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={user.zipCode || ""}
                    onChange={(e) => handleInputChange(user.id, "zipCode", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={user.phoneNumber || ""}
                    onChange={(e) => handleInputChange(user.id, "phoneNumber", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleSaveChanges(user)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handlePasswordReset(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboardContent;
