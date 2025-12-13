import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setUserIdError("");
    setPasswordError("");
    setGeneralError("");
    setLoading(true);

    let hasError = false;

    // Frontend validation
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
      await login({ userId, password });
      navigate("/home");
    } catch (err) {
      // Backend-driven errors (single source of truth)
      if (err.status === 404) {
        setUserIdError("User ID not found");
      } else if (err.status === 401) {
        setPasswordError("Incorrect password");
      } else {
        setGeneralError(err.message || "Login failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Eye Icon SVG
  const EyeIcon = ({ isOpen, className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isOpen ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className="h-screen w-full flex">
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-30">
        <div className="p-2 flex items-center">
          <img src="src/assets/logo.png" alt="Logo" className="h-20 w-20" />
          <h1 className="text-3xl font-bold text-gray-900 ml-[-2px]">Tanaw</h1>
        </div>
      </header>

      {/* RIGHT SIDE */}
      <div
        className="hidden md:flex w-1/2 relative rounded-tr-[300px] rounded-br-[300px] shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C7D92]/90 to-[#FF6404]/90 rounded-tr-[300px] rounded-br-[300px]" />
        <div className="absolute top-[30%] left-[8%] z-10 max-w-[500px] text-white">
          <h2 className="text-[64px] font-bold mb-4">Welcome Back!</h2>
          <p className="text-2xl">
            Please sign in to continue promoting transparency in Barangay Taboc.
          </p>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form
          onSubmit={handleLogin}
          className="bg-white p-12 rounded-2xl w-full max-w-2xl"
        >
          <h2 className="text-[56px] font-bold mb-8 text-[#303D46]">Login</h2>

          {generalError && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-600 text-center rounded">
              {generalError}
            </div>
          )}

          {/* USER ID */}
          <label className="block mb-1 font-semibold">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your 6-digit User ID"
            className={`w-full p-4 mb-1 border rounded-lg ${
              userIdError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {userIdError && (
            <p className="text-red-500 mb-4 text-sm">{userIdError}</p>
          )}

          {/* PASSWORD */}
          <label className="block mb-1 font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full p-4 pr-12 border rounded-lg ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <EyeIcon isOpen={showPassword} className="h-5 w-5" />
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 mt-1 text-sm">{passwordError}</p>
          )}

          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#D87300] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6404] text-white p-4 rounded-lg font-semibold hover:bg-[#e55a00] disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#D87300] font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;