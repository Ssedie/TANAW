import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/constants";

function Signup() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(userId, 10),
                    password: password
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to register");
            }

            // Automatically log in or redirect to login page
            navigate("/login");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {/* USER ID INPUT */}
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

                {/* PASSWORD INPUT */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        minLength={6}
                    />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Signup;
