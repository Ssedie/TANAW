import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setUserIdError("");
    setPasswordError("");
    setLoading(true);

    let hasError = false;

    if (!/^\d{6}$/.test(userId)) {
      setUserIdError("User ID must be 6 digits");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setPasswordError(errData.message || "Incorrect User ID or password");
        throw new Error(errData.message || "Incorrect User ID or password");
      }

      const data = await response.json();

      login({
        token: data.token,
        role: data.role,
        userId: data.userId,
      });

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex">
      {/* RIGHT SIDE — IMAGE + GRADIENT */}
      <div
        className="hidden md:flex w-1/2 relative rounded-tr-[300px] rounded-br-[300px] shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C7D92]/90 to-[#FF6404]/90 rounded-tr-[300px] rounded-br-[300px]"></div>
        <div className="absolute top-[30%] left-[8%] z-10 max-w-[500px] text-white font-istok">
          <h2 className="text-[64px] font-bold mb-4">Welcome Back!</h2>
          <p className="text-2xl">
            Please sign in to continue promoting transparency in Barangay Taboc.
          </p>
        </div>
      </div>

      {/* LEFT SIDE — LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form
          onSubmit={handleLogin}
          className="bg-white p-12 rounded-2xl w-full max-w-2xl"
        >
          <h2 className="text-[56px] font-bold mb-8 text-[#303D46]">Login</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-600 flex justify-center rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* USER ID */}
            <div className="col-span-2">
              <label className="block mb-1 font-semibold">User ID</label>
              <input
                type="text"
                value={userId}
                placeholder="Enter your 6-digit User ID"
                onChange={(e) => setUserId(e.target.value)}
                className={`w-full p-4 border rounded-lg focus:ring-2 ${
                  userIdError
                    ? "border-red-500 ring-red-400"
                    : "border-gray-300 ring-blue-400"
                }`}
              />
              {userIdError && (
                <p className="text-red-500 mt-1 text-sm">{userIdError}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="col-span-2">
              <label className="block mb-1 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-4 pr-12 border rounded-lg focus:ring-2 ${
                    passwordError
                      ? "border-red-500 ring-red-400"
                      : "border-gray-300 ring-blue-400"
                  }`}
                />

                {/* FORMAL EYE / CLOSED EYE */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    // Open eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // Closed eye (eye with slash)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.121.18-2.195.518-3.216M6.343 6.343a9.957 9.957 0 0111.314 11.314M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 mt-1 text-sm">{passwordError}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            to="/home"
            disabled={loading}
            className="w-full bg-[#FF6404] text-white p-4 rounded-lg font-semibold hover:bg-[#e55a00] transition mb-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-2 flex justify-center w-full">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#D87300] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
