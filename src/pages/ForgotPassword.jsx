import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/constants";

function ForgotPassword() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};
    
    if (!userId.trim()) {
      errors.userId = "User ID is required";
    } else if (!/^\d{6}$/.test(userId)) {
      errors.userId = "User ID must be 6 digits";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!birthDate) {
      errors.birthDate = "Birth date is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage("");
    setMessageType("");

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/user/forgot-password`, {
        userId: parseInt(userId, 10),
        email: email.trim(),
        birthDate: birthDate,
      });

      setMessage(response.data.message || "Password reset instructions sent to your email");
      setMessageType("success");

      // Navigate to reset password page after a short delay
      setTimeout(() => {
        navigate(`/reset-password?token=${response.data.token}&userId=${userId}`);
      }, 1500);

    } catch (err) {
      console.error("Forgot password error:", err);
      
      // Handle specific error responses
      if (err.response) {
        const errorMsg = err.response.data.message || err.response.data;
        
        // Check for specific error messages and map to fields
        if (typeof errorMsg === 'string') {
          if (errorMsg.toLowerCase().includes('user not found') || 
              errorMsg.toLowerCase().includes('user id')) {
            setFieldErrors({ userId: "User ID not found" });
          } else if (errorMsg.toLowerCase().includes('email')) {
            setFieldErrors({ email: "Email does not match our records" });
          } else if (errorMsg.toLowerCase().includes('birth date')) {
            setFieldErrors({ birthDate: "Birth date does not match our records" });
          } else {
            setMessage(errorMsg);
            setMessageType("error");
          }
        } else {
          setMessage("Unable to process your request. Please check your details.");
          setMessageType("error");
        }
      } else if (err.request) {
        setMessage("Cannot connect to server. Please check your internet connection.");
        setMessageType("error");
      } else {
        setMessage("Something went wrong. Please try again later.");
        setMessageType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#4B3A2F]">Forgot Password</h2>

        {/* General Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* User ID */}
        <label className="block mb-1 font-semibold text-gray-700">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your 6-digit User ID"
          className={`w-full p-3 border rounded-lg mb-1 focus:outline-none focus:ring-2 ${
            fieldErrors.userId 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-[#FF6404]/30"
          }`}
          disabled={loading}
        />
        {fieldErrors.userId && (
          <p className="text-red-500 text-sm mb-3">{fieldErrors.userId}</p>
        )}

        {/* Email */}
        <label className="block mb-1 font-semibold text-gray-700 mt-3">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className={`w-full p-3 border rounded-lg mb-1 focus:outline-none focus:ring-2 ${
            fieldErrors.email 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-[#FF6404]/30"
          }`}
          disabled={loading}
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mb-3">{fieldErrors.email}</p>
        )}

        {/* Birth Date */}
        <label className="block mb-1 font-semibold text-gray-700 mt-3">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`w-full p-3 border rounded-lg mb-1 focus:outline-none focus:ring-2 ${
            fieldErrors.birthDate 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-[#FF6404]/30"
          }`}
          disabled={loading}
        />
        {fieldErrors.birthDate && (
          <p className="text-red-500 text-sm mb-3">{fieldErrors.birthDate}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6404] text-white p-3 rounded-lg font-semibold hover:bg-[#e55a00] disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
        >
          {loading ? "Processing..." : "Proceed to Reset"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-3 text-[#FF6404] font-semibold hover:underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;