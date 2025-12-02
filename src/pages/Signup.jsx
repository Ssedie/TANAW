import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthProvider";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fName: "",
    mName: "",
    lName: "",
    phoneNumber: "",
    birthDate: "",
    street: "",
    barangay:"",
    city: "",
    province: "",
    region: "",
    country: "",
    zipCode: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: "CITIZEN",

          // NEW PROFILE FIELDS
          fName: form.fName,
          mName: form.mName,
          lName: form.lName,
          phoneNumber: form.phoneNumber,
          birthDate: form.birthDate,
          street: form.street,
          barangay: form.barangay,
          city: form.city,
          province: form.province,
          region: form.region,
          country: form.country,
          zipCode: form.zipCode ? parseInt(form.zipCode) : 0
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      const data = await response.json();

      login({
        token: data.token,
        userId: data.userId,
        role: data.role
      });

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
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center h-auto py-12 bg-gray-100">
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

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="your.email@example.com"
            required
          />
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="fName"
              value={form.fName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Middle Name</label>
            <input
              type="text"
              name="mName"
              value={form.mName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lName"
              value={form.lName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        {/* Phone + Birthdate */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Barangay</label>
          <input
            type="text"
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Province</label>
            <input
              type="text"
              name="province"
              value={form.province}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Region</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
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

        {/* Login link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </form>

      {/* Success modal */}
      {showModal && generatedUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Account Created!
            </h2>
            <p className="text-sm text-gray-600 mb-2">Your User ID</p>
            <div className="text-3xl font-bold text-blue-600 mb-3">
              {generatedUserId}
            </div>
            <p className="text-xs text-gray-500 mb-4">
              ⚠️ Save or screenshot your User ID.
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
