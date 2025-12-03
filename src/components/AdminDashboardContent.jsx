import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

export default function AdminDashboardContent() {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!auth?.token) return;

        axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error("Error fetching users", err);
            });
    }, [auth]);

    const promoteToAdmin = async (userId) => {
        try {
            await axios.put(`${API_URL}/api/admin/role/${userId}?role=ADMIN`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });

            alert("User promoted to admin!");
            window.location.reload();

        } catch (err) {
            alert("You are not authorized.");
        }
    };

    const resetPassword = async (userId) => {
        const newPassword = prompt("Enter new password:");

        if (!newPassword) return;

        try {
            await axios.put(`${API_URL}/api/admin/password/${userId}?newPassword=${newPassword}`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });

            alert("Password updated!");
        } catch (err) {
            alert("Not authorized");
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Registered Users</h2>

            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.userId}>
                            <td>{u.userId}</td>
                            <td>{u.fName} {u.lName}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>

                            <td>
                                {/* Only SUPER ADMIN can see this */}
                                {auth.userId === 100001 && (
                                    <button
                                        onClick={() => promoteToAdmin(u.userId)}
                                        className="bg-green-600 text-white px-2 py-1 rounded"
                                    >
                                        Promote to Admin
                                    </button>
                                )}
                                <button
                                    onClick={() => resetPassword(u.userId)}
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Reset Password
                                </button>

                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
