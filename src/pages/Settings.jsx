import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

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
    // clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // set new timeout to call verify after 500ms
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
      // Account is locked due to too many attempts
      setIsCurrentPasswordValid(false);
      setIsLocked(true);
      setErrors({ general: data.message || "Too many attempts. Please try again later." });
    } else {
      setIsCurrentPasswordValid(data.valid);
      setIsLocked(false);
      if (!data.valid) {
        setErrors({ general: "Current password is incorrect." });
      } else {
        setErrors({}); // clear errors if valid
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {errors.general && <Alert type="error" message={errors.general} />}
        {passwordErrors.general && <Alert type="error" message={passwordErrors.general} />}
        {success && <Alert type="success" message={success} />}

        <ProfileForm
          userData={userData}
          errors={errors}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onSubmit={handleProfileSubmit}
          saving={savingProfile}
        />

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
  );
};

// ==================== UI COMPONENTS ====================
const Alert = ({ type, message }) => (
  <div
    className={`mb-4 p-3 rounded border ${
      type === "error"
        ? "bg-red-100 border-red-400 text-red-600"
        : "bg-green-100 border-green-400 text-green-600"
    }`}
  >
    {message}
  </div>
);

const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading profile...</p>
    </div>
  </div>
);

const ProfileForm = ({ userData, errors, onChange, onFileChange, onSubmit, saving }) => (
<form onSubmit= {onSubmit} >
          {/* Profile Picture */}
          <div className="mb-6 flex flex-col items-center relative">
            {userData.picturePreview && userData.picture ? (
              <img
                src={userData.picturePreview}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border"
              />
            ) : (
              <div className="w-40 h-40 rounded-full flex items-center justify-center text-8xl font-bold text-white bg-orange-500 border">
                {`${userData.fName[0] || "R"}${userData.lName[0] || "J"}`}
              </div>
            )}
            <label
              htmlFor="upload"
              className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer"
            >
              Change
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>



    {/* Fields */}
    <FieldGroup title="Account Information">
      <Field label="User ID" value={userData.userId} disabled placeholder="User ID" />
      <Field label="Email" value={userData.email} disabled placeholder="user@example.com" error={errors.email} />
    </FieldGroup>

    <FieldGroup title="Personal Information">
      <Field label="First Name" name="fName" value={userData.fName} onChange={onChange} placeholder="First Name" error={errors.fName} />
      <Field label="Middle Name" name="mName" value={userData.mName} onChange={onChange} placeholder="Middle Name (optional)" />
      <Field label="Last Name" name="lName" value={userData.lName} onChange={onChange} placeholder="Last Name" error={errors.lName} />
      <Field label="Phone Number" name="phoneNumber" value={userData.phoneNumber} onChange={onChange} placeholder="09123456789" error={errors.phoneNumber} />
      <Field label="Birth Date" name="birthDate" type="date" value={userData.birthDate} onChange={onChange} />
    </FieldGroup>

    <FieldGroup title="Address">
      <Field label="Street" name="street" value={userData.street} onChange={onChange} placeholder="Street Address" />
      <Field label="Barangay" name="barangay" value={userData.barangay} onChange={onChange} placeholder="Barangay" />
      <Field label="City" name="city" value={userData.city} onChange={onChange} placeholder="City" error={errors.city} />
      <Field label="Province" name="province" value={userData.province} onChange={onChange} placeholder="Province" error={errors.province} />
      <Field label="Region" name="region" value={userData.region} onChange={onChange} placeholder="Region" />
      <Field label="Country" name="country" value={userData.country} onChange={onChange} placeholder="Country" error={errors.country} />
      <Field label="Zip Code" name="zipCode" value={userData.zipCode} onChange={onChange} placeholder="Zip Code" />
    </FieldGroup>

    <FieldGroup title="Account Status">
      <Field label="Role" value={userData.role} disabled />
      <Field label="Status" value={userData.accountStatus} disabled />
    </FieldGroup>

    <div className="flex justify-end mb-6">
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        {saving ? "Saving..." : "Save Profile Changes"}
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
  <div className="border-t pt-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>

    {/* Info label */}
    <p className="text-sm text-gray-500 mb-2">
      Please enter your current password first before setting a new password.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Field
        label="Current Password"
        name="currentPassword"
        type="password"
        value={passwordData.currentPassword}
        onChange={onChange}
        placeholder="Enter current password"
        error={errors.currentPassword}
      />

      {/* Show new password fields only if current password is valid */}
{isCurrentPasswordValid && !isLocked && (
  <>
    <Field
      label="New Password"
      name="newPassword"
      type="password"
      value={passwordData.newPassword}
      onChange={onChange}
      placeholder="Enter new password"
      error={errors.newPassword}
    />
    <Field
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      value={passwordData.confirmPassword}
      onChange={onChange}
      placeholder="Confirm new password"
      error={errors.confirmPassword}
    />
  </>
)}
    </div>

    {isCurrentPasswordValid && !isLocked && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
        >
          {saving ? "Saving..." : "Change Password"}
        </button>
      </div>
    )}
  </div>
);



const Field = ({ label, name, value, onChange, type = "text", placeholder, disabled, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className={`w-full p-2 border rounded ${disabled ? "bg-gray-100" : ""}`} />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const FieldGroup = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </div>
);

export default Settings;
