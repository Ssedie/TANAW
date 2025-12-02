import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: "CITIZEN",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to register");
      }

      const data = await response.json();

      // Auto-login using AuthContext
      login({
        token: data.token,
        userId: data.userId,
        role: data.role,
      });

      // Show User ID modal
      setGeneratedUserId(data.userId);
      setShowModal(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    navigate("/"); // redirect to dashboard
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

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="your.email@example.com"
            required
          />
        </div>

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

      {/* Modal for showing User ID */}
      {showModal && generatedUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Account Created!</h2>
            <p className="text-sm text-gray-600 mb-2">Your User ID</p>
            <div className="text-3xl font-bold text-blue-600 mb-3">{generatedUserId}</div>
            <p className="text-xs text-gray-500 mb-4">
              ⚠️ Please save or screenshot your User ID. You'll need it to log in.
            </p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
