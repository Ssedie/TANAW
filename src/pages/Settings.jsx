import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const Settings = () => {
  const { auth, setAuth } = useAuth() || {};
  const token = auth?.token || "";

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    fName: "",
    mName: "",
    lName: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    country: "",
    zipCode: "",
    phoneNumber: "",
    birthDate: "",
    role: "",
    accountStatus: "",
    picture: null,
    picturePreview: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();

      setUserData({
        ...userData,
        ...data,
        fName: data.fName || data.fname || "",
        mName: data.mName || data.mname || "",
        lName: data.lName || data.lname || "",
        birthDate: data.birthDate
          ? new Date(data.birthDate).toISOString().split("T")[0]
          : "",
        picturePreview: data.picturePath
          ? `${API_URL}/${data.picturePath}?t=${Date.now()}`
          : `${(data.fName?.[0] || "T")}${(data.lName?.[0] || "W")}`,
          picture:null,
      });
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  }

  // ==================== VALIDATION ====================
  const validateProfile = () => {
    const newErrors = {};
    if (!userData.fName.trim()) newErrors.fName = "First name is required";
    if (!userData.lName.trim()) newErrors.lName = "Last name is required";
    if (!userData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!userData.city.trim()) newErrors.city = "City is required";
    if (!userData.province.trim()) newErrors.province = "Province is required";
    if (!userData.country.trim()) newErrors.country = "Country is required";
    if (userData.email && !/^\S+@\S+\.\S+$/.test(userData.email))
      newErrors.email = "Email is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = "Enter current password";
    if (!passwordData.newPassword) newErrors.newPassword = "Enter new password";
    if (passwordData.newPassword && passwordData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData((prev) => ({
        ...prev,
        picture: file,
        picturePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSavingProfile(true);
    setErrors({});
    setSuccess("");

    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (!["picturePreview", "picture"].includes(key)) formData.append(key, userData[key]);
      });
      if (userData.picture) formData.append("picture", userData.picture);

      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update profile");
      }

      const updatedData = await response.json();

      setUserData((prev) => ({
        ...prev,
        ...updatedData,
        picture: null,
        picturePreview: updatedData.picturePath
          ? `${API_URL}/${updatedData.picturePath}?t=${Date.now()}`
          : prev.picturePreview,
      }));

      if (setAuth) {
        const profileImage = updatedData.picturePath
          ? `${API_URL}/${updatedData.picturePath}?t=${Date.now()}`
          : auth?.profileImage || "/default-user.png";

        setAuth((prev) => ({
          ...prev,
          fName: updatedData.fName || prev.fName,
          lName: updatedData.lName || prev.lName,
          profileImage,
        }));

        localStorage.setItem("fName", updatedData.fName || auth?.fName);
        localStorage.setItem("lName", updatedData.lName || auth?.lName);
        localStorage.setItem("profileImage", profileImage);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const typingTimeoutRef = useRef(null);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (name === "currentPassword") {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        verifyCurrentPassword(value);
      }, 500);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setSavingPassword(true);
    setPasswordErrors({});
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/user/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setPasswordErrors({ general: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const verifyCurrentPassword = async (password) => {
    if (!password) return setIsCurrentPasswordValid(false);
    try {
      const response = await fetch(`${API_URL}/api/user/check-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: password }),
      });
      const data = await response.json();

      if (data.locked) {
        setIsCurrentPasswordValid(false);
        setIsLocked(true);
        setErrors({ general: data.message || "Too many attempts. Please try again later." });
      } else {
        setIsCurrentPasswordValid(data.valid);
        setIsLocked(false);
        if (!data.valid) {
          setErrors({ general: "Current password is incorrect." });
        } else {
          setErrors({});
        }
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Failed to verify current password." });
      setIsCurrentPasswordValid(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#5C7D92] mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and security settings</p>
        </div>

        {/* Alerts */}
        {errors.general && <Alert type="error" message={errors.general} />}
        {passwordErrors.general && <Alert type="error" message={passwordErrors.general} />}
        {success && <Alert type="success" message={success} />}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-6">Profile Information</h2>
          <ProfileForm
            userData={userData}
            errors={errors}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleProfileSubmit}
            saving={savingProfile}
          />
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-6">Security Settings</h2>
          <PasswordForm
            passwordData={passwordData}
            errors={passwordErrors}
            onChange={handlePasswordChange}
            onSubmit={handlePasswordSubmit}
            saving={savingPassword}
            isCurrentPasswordValid={isCurrentPasswordValid}
            isLocked={isLocked}
          />
        </div>
      </div>
    </div>
  );
};

// ==================== UI COMPONENTS ====================
const Alert = ({ type, message }) => (
  <div
    className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 ${type === "error"
        ? "bg-red-50 border-red-500 text-red-700"
        : "bg-green-50 border-green-500 text-green-700"
      }`}
  >
    {type === "error" ? (
      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
    ) : (
      <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
    )}
    <span>{message}</span>
  </div>
);

const LoaderComponent = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <Loader className="w-12 h-12 text-[#FF6404] animate-spin mb-4 mx-auto" />
      <p className="text-gray-600 font-medium">Loading profile...</p>
    </div>
  </div>
);

const ProfileForm = ({ userData, errors, onChange, onFileChange, onSubmit, saving }) => (
  <form onSubmit={onSubmit}>
    {/* Profile Picture */}
    <div className="mb-8 flex flex-col items-center">
      <div className="relative mb-4">
        {userData.picturePreview ? (
          <img
            src={userData.picturePreview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#FF6404]"
          />
        ) : (
          <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br from-[#5C7D92] to-[#FF6404] border-4 border-[#FF6404]">
            {`${userData.fName[0] || "R"}${userData.lName[0] || "J"}`}
          </div>
        )}
        <label
          htmlFor="upload"
          className="absolute bottom-0 right-0 bg-[#FF6404] hover:bg-[#e55a00] text-white text-xs px-3 py-2 rounded-full cursor-pointer transition-colors shadow-lg"
        >
          Edit
        </label>
        <input
          id="upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </div>

    {/* Account Information */}
    <FieldGroup title="Account Information">
      <Field label="User ID" value={userData.userId} disabled />
      <Field label="Email" value={userData.email} disabled />
    </FieldGroup>

    {/* Personal Information */}
    <FieldGroup title="Personal Information">
      <Field label="First Name" name="fName" value={userData.fName} onChange={onChange} error={errors.fName} />
      <Field label="Middle Name" name="mName" value={userData.mName} onChange={onChange} />
      <Field label="Last Name" name="lName" value={userData.lName} onChange={onChange} error={errors.lName} />
      <Field label="Phone Number" name="phoneNumber" value={userData.phoneNumber} onChange={onChange} error={errors.phoneNumber} />
      <Field label="Birth Date" name="birthDate" type="date" value={userData.birthDate} onChange={onChange} />
    </FieldGroup>

    {/* Address */}
    <FieldGroup title="Address">
      <Field label="Street" name="street" value={userData.street} onChange={onChange} />
      <Field label="Barangay" name="barangay" value={userData.barangay} onChange={onChange} />
      <Field label="City" name="city" value={userData.city} onChange={onChange} error={errors.city} />
      <Field label="Province" name="province" value={userData.province} onChange={onChange} error={errors.province} />
      <Field label="Region" name="region" value={userData.region} onChange={onChange} />
      <Field label="Country" name="country" value={userData.country} onChange={onChange} error={errors.country} />
      <Field label="Zip Code" name="zipCode" value={userData.zipCode} onChange={onChange} />
    </FieldGroup>

    {/* Account Status */}
    <FieldGroup title="Account Status">
      <Field label="Role" value={userData.role} disabled />
      <Field label="Status" value={userData.accountStatus} disabled />
    </FieldGroup>

    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={saving}
        className="px-8 py-2.5 bg-[#FF6404] hover:bg-[#e55a00] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </form>
);

const PasswordForm = ({
  passwordData,
  errors,
  onChange,
  onSubmit,
  saving,
  isCurrentPasswordValid,
  isLocked
}) => (
  <div>
    <p className="text-gray-600 text-sm mb-6">
      Please enter your current password first before setting a new password.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Field
        label="Current Password"
        name="currentPassword"
        type="password"
        value={passwordData.currentPassword}
        onChange={onChange}
        error={errors.currentPassword}
      />

      {isCurrentPasswordValid && !isLocked && (
        <>
          <Field
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={onChange}
            error={errors.newPassword}
          />
          <Field
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
          />
        </>
      )}
    </div>

    {isCurrentPasswordValid && !isLocked && (
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg mt-4"
        >
          {saving ? "Saving..." : "Change Password"}
        </button>
      </div>
    )}
  </div>
);

const Field = ({ label, name, value, onChange, type = "text", disabled, error }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6404] transition-colors ${disabled
          ? "bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed"
          : error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-[#FF6404]"
        }`}
    />
    {error && <p className="text-red-600 text-sm mt-1.5">{error}</p>}
  </div>
);

const FieldGroup = ({ title, children }) => (
  <div className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="grid gap-6 md:grid-cols-2">{children}</div>
  </div>
);

export default Settings;