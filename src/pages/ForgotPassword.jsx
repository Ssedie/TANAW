import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(""); // success or general messages
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};
    if (!/^\d{6}$/.test(userId)) {
      errors.userId = "User ID must be 6 digits";
    }

    if (!email) {
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

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          email,
          birthDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to process your request. Please check your details and try again.");
        return;
      }

      setMessage("We sent a link to reset your password. Please check your email.");
      setTimeout(() => {
        navigate(`/reset-password?token=${data.token}&userId=${userId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again later.");
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
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

        {/* User ID */}
        <label className="block mb-1 font-semibold">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your 6-digit User ID"
          className={`w-full p-3 border rounded-lg mb-2 focus:outline-none ${
            fieldErrors.userId ? "border-red-500" : "border-gray-300"
          }`}
        />
        {fieldErrors.userId && <p className="text-red-500 text-xs mb-2">{fieldErrors.userId}</p>}

        {/* Email */}
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className={`w-full p-3 border rounded-lg mb-2 focus:outline-none ${
            fieldErrors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {fieldErrors.email && <p className="text-red-500 text-xs mb-2">{fieldErrors.email}</p>}

        {/* Birth Date */}
        <label className="block mb-1 font-semibold">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`w-full p-3 border rounded-lg mb-4 focus:outline-none ${
            fieldErrors.birthDate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {fieldErrors.birthDate && (
          <p className="text-red-500 text-xs mb-2">{fieldErrors.birthDate}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6404] text-white p-3 rounded-lg font-semibold hover:bg-[#e55a00] transition"
        >
          {loading ? "Processing..." : "Proceed to Reset"}
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
