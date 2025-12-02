import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                // ✔ backend expects this format (username = user_id)
                body: JSON.stringify({
                    username: userId,
                    password: password
                }),
            });

            if (!response.ok) {
                throw new Error("Invalid User ID or password");
            }

            const data = await response.json();
            login(data.token);
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form 
                onSubmit={handleLogin} 
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {/* USER ID */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">User ID</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        pattern="\d{6}"
                        title="User ID must be 6 digits"
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link 
                            to="/signup" 
                            className="text-blue-600 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>

            </form>
        </div>
    );
}

export default Login;
