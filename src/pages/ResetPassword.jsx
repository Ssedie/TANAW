import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(""); // success message
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Get token and userId from query params
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!token || !userId) {
      setFieldErrors({ global: "Invalid reset link. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setMessage(
        "Your reset link is valid for 15 minutes. Please reset your password promptly."
      );
    }
  }, [token, userId, navigate]);

  const validateFields = () => {
    const errors = {};
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least 1 uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least 1 number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage("");

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId: parseInt(userId, 10), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors({ global: data.message || "Failed to reset password" });
        return;
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setFieldErrors({ global: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleReset}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>

        {/* Global Error */}
        {fieldErrors.global && (
          <p className="text-red-500 mb-4 text-center">{fieldErrors.global}</p>
        )}

        {/* Success Message */}
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

        <label className="block mb-1 font-semibold">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className={`w-full p-3 border rounded-lg mb-2 focus:outline-none ${
            fieldErrors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {fieldErrors.password && (
          <p className="text-red-500 text-xs mb-2">{fieldErrors.password}</p>
        )}

        <label className="block mb-1 font-semibold">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className={`w-full p-3 border rounded-lg mb-2 focus:outline-none ${
            fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {fieldErrors.confirmPassword && (
          <p className="text-red-500 text-xs mb-2">{fieldErrors.confirmPassword}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6404] text-white p-3 rounded-lg font-semibold hover:bg-[#e55a00] transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
