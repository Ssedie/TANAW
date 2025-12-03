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
    barangay: "",
    city: "",
    province: "",
    region: "",
    country: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ FULL + UPDATED VALIDATION
  function validateFields() {
    const errors = {};

    // Email
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Invalid email format";

    // First Name
    if (!form.fName) errors.fName = "First Name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.fName))
      errors.fName = "First Name must contain only letters";

    // Middle Name (optional)
    if (form.mName && !/^[A-Za-z\s]+$/.test(form.mName))
      errors.mName = "Middle Name must contain only letters";

    // Last Name
    if (!form.lName) errors.lName = "Last Name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.lName))
      errors.lName = "Last Name must contain only letters";

    // Password
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password))
      errors.password = "Password must contain at least 1 uppercase letter";
    else if (!/[0-9]/.test(form.password))
      errors.password = "Password must contain at least 1 number";

    // Confirm Password
    if (!form.confirmPassword)
      errors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    // Phone Number (PH Format)
    if (!form.phoneNumber)
      errors.phoneNumber = "Phone number is required";
    else if (!/^09\d{9}$/.test(form.phoneNumber))
      errors.phoneNumber = "Phone number must be in PH format (09XXXXXXXXX)";

    // Birth Date
    if (!form.birthDate) {
      errors.birthDate = "Birth date is required";
    } else {
      const birth = new Date(form.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();

      if (birth > today)
        errors.birthDate = "Birth date cannot be in the future";
      if (age < 13)
        errors.birthDate = "You must be at least 13 years old to register";
    }

    // Required address fields
    if (!form.street) errors.street = "Street is required";
    if (!form.barangay) errors.barangay = "Barangay is required";
    if (!form.city) errors.city = "City is required";
    if (!form.province) errors.province = "Province is required";
    if (!form.region) errors.region = "Region is required";
    if (!form.country) errors.country = "Country is required";

    // Zip Code
    if (!form.zipCode) errors.zipCode = "Zip Code is required";
    else if (!/^\d{4,5}$/.test(form.zipCode))
      errors.zipCode = "Zip Code must be 4–5 digits";

    return errors;
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
          zipCode: parseInt(form.zipCode),
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
        role: data.role,
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
    <div className="h-screen w-full flex">
      {/* LEFT – FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSignup} className="bg-white p-10 rounded-2xl">
            <h2 className="text-[56px] font-bold mb-6 text-[#303D46]">Sign Up</h2>

            {/* Global Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 flex justify-center rounded">
                {error}
              </div>
            )}

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* EMAIL */}
              <div className="col-span-2">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
              </div>

              {/* FIRST NAME */}
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  name="fName"
                  value={form.fName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.fName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.fName && <p className="text-red-500 text-sm">{fieldErrors.fName}</p>}
              </div>

              {/* MIDDLE NAME */}
              <div>
                <label className="block mb-1 font-medium">Middle Name</label>
                <input
                  type="text"
                  name="mName"
                  value={form.mName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg border-gray-300"
                />
                {fieldErrors.mName && <p className="text-red-500 text-sm">{fieldErrors.mName}</p>}
              </div>

              {/* LAST NAME */}
              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lName"
                  value={form.lName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.lName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.lName && <p className="text-red-500 text-sm">{fieldErrors.lName}</p>}
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.phoneNumber && (
                  <p className="text-red-500 text-sm">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              {/* BIRTH DATE */}
              <div>
                <label className="block mb-1 font-medium">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.birthDate && <p className="text-red-500 text-sm">{fieldErrors.birthDate}</p>}
              </div>

              {/* STREET */}
              <div>
                <label className="block mb-1 font-medium">Street</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.street ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.street && <p className="text-red-500 text-sm">{fieldErrors.street}</p>}
              </div>

              {/* BARANGAY */}
              <div>
                <label className="block mb-1 font-medium">Barangay</label>
                <input
                  type="text"
                  name="barangay"
                  value={form.barangay}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.barangay ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.barangay && <p className="text-red-500 text-sm">{fieldErrors.barangay}</p>}
              </div>

              {/* CITY */}
              <div>
                <label className="block mb-1 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.city && <p className="text-red-500 text-sm">{fieldErrors.city}</p>}
              </div>

              {/* PROVINCE */}
              <div>
                <label className="block mb-1 font-medium">Province</label>
                <input
                  type="text"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.province ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.province && <p className="text-red-500 text-sm">{fieldErrors.province}</p>}
              </div>

              {/* REGION */}
              <div>
                <label className="block mb-1 font-medium">Region</label>
                <input
                  type="text"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.region ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.region && <p className="text-red-500 text-sm">{fieldErrors.region}</p>}
              </div>

              {/* COUNTRY */}
              <div>
                <label className="block mb-1 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.country ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.country && <p className="text-red-500 text-sm">{fieldErrors.country}</p>}
              </div>

              {/* ZIP CODE */}
              <div>
                <label className="block mb-1 font-medium">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.zipCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.zipCode && <p className="text-red-500 text-sm">{fieldErrors.zipCode}</p>}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block mb-1 font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#FF6404] text-white p-3 rounded-lg font-semibold transition hover:bg-[#e55a00]"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <div className="mt-4 flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#D87300] font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="hidden md:flex w-1/2 relative rounded-tl-[300px] rounded-bl-[300px] shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/taboc.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#5C7D92]/90 to-[#FF6404]/90 rounded-tl-[300px] rounded-bl-[300px]"></div>
        <div className="absolute top-[30%] left-[8%] z-10 max-w-[696px] text-white font-istok">
          <h2 className="text-[74px] font-bold mb-4">Welcome to Tanaw!</h2>
          <p className="text-3xl">
            Fill out the form to register and help make Barangay Taboc’s operation more transparent
          </p>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && generatedUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Account Created!</h2>
            <p className="text-sm text-gray-600 mb-2">Your User ID</p>
            <div className="text-3xl font-bold text-blue-600 mb-3">{generatedUserId}</div>
            <p className="text-xs text-gray-500 mb-4">⚠️ Save or screenshot your User ID.</p>
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
