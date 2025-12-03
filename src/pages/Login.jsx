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
        throw new Error(errData.message || "Invalid User ID or password");
      }


      const data = await response.json();


      login({
        token: data.token,
        role: data.role,
        userId: data.userId,
      });


      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="h-screen w-full flex">
      {/* RIGHT SIDE — GRADIENT + IMAGE */}
      <div
        className="hidden md:flex w-1/2 relative rounded-tr-[300px] rounded-br-[300px] shadow-2xl
                  bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/taboc.jpg')" }}
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
            {/* User ID */}
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


            {/* Password */}
            <div className="col-span-2">
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 border rounded-lg focus:ring-2 ${
                  passwordError
                    ? "border-red-500 ring-red-400"
                    : "border-gray-300 ring-blue-400"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 mt-1 text-sm">{passwordError}</p>
              )}
            </div>
          </div>


          <button
            type="submit"
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