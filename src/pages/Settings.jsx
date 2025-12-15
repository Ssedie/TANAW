import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";
import { CheckCircle, AlertCircle, Loader, Camera, Trash2 } from "lucide-react";

const getDefaultAvatar = (fName, lName) => {
  return `${(fName?.[0] || "T").toUpperCase()}${(lName?.[0] || "W").toUpperCase()}`;
};

const Settings = () => {
  const { auth, setAuth } = useAuth() || {};
  const token = auth?.token || "";
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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
    if (auth?.userId) {
      if (auth.userId === 100001) {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    }
    fetchUserProfile();
  }, [auth?.userId]);

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
          : `${(data.fName?.[0] || "T").toUpperCase()}${(data.lName?.[0] || "W").toUpperCase()}`,
          picture: null,
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
    let updatedValue = value;
    
    // Capitalize first letter for name fields
    if (["fName", "mName", "lName"].includes(name) && value.length > 0) {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setUserData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          picture: file,
          picturePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setUserData((prev) => ({
      ...prev,
      picture: null,
      picturePreview: getDefaultAvatar(prev.fName, prev.lName),
    }));

    if (setAuth) {
      setAuth((prev) => ({
        ...prev,
        profileImage: "",
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
          fName: updatedData.fName ?? updatedData.fname ?? prev.fName,
          lName: updatedData.lName ?? updatedData.lname ?? prev.lName,
          profileImage,
        }));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#FF6404] animate-spin mb-4 mx-auto" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#5C7D92] mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and security settings</p>
        </div>

        {/* Superadmin Notice */}
        {isSuperAdmin && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-900 font-semibold">⚠️ Superadmin Account</p>
              <p className="text-amber-800 text-sm mt-1">Superadmin account settings cannot be edited for security reasons.</p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {errors.general && <Alert type="error" message={errors.general} />}
        {passwordErrors.general && <Alert type="error" message={passwordErrors.general} />}
        {success && <Alert type="success" message={success} />}

        {/* Profile Section */}
        <fieldset disabled={isSuperAdmin}>
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#5C7D92] mb-6">Profile Information</h2>
            <ProfileForm
              userData={userData}
              errors={errors}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleProfileSubmit}
              saving={savingProfile}
              onRemovePicture={handleRemovePicture}
              disabled={isSuperAdmin}
            />
          </div>
        </fieldset>

        {/* Password Section */}
        <fieldset disabled={isSuperAdmin}>
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
              disabled={isSuperAdmin}
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
};

// ==================== UI COMPONENTS ====================
const Alert = ({ type, message }) => (
  <div
    className={`mb-6 p-4 rounded-lg border-l-4 flex items-start gap-3 ${
      type === "error"
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

const ProfileForm = ({ userData, errors, onChange, onFileChange, onSubmit, saving, onRemovePicture, disabled }) => (
  <div onSubmit={onSubmit}>
    {/* Profile Picture */}
    <div className="mb-8 flex flex-col items-center">
      <div className={`relative inline-block group ${disabled ? 'pointer-events-none' : ''}`}>
        {userData.picturePreview?.startsWith("data:") || userData.picturePreview?.startsWith("http") ? (
          <img
            src={userData.picturePreview}
            alt="Profile"
            className={`w-40 h-40 rounded-full object-cover border-4 border-[#FF6404] bg-gradient-to-br from-[#5C7D92] to-[#FF6404] shadow-lg ${disabled ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className={`w-40 h-40 rounded-full flex items-center justify-center text-7xl font-bold text-white bg-gradient-to-br from-[#5C7D92] to-[#FF6404] border-4 border-[#FF6404] shadow-lg ${disabled ? 'opacity-40 grayscale' : ''}`}>
            {disabled ? 'SA' : (userData.picturePreview || getDefaultAvatar(userData.fName, userData.lName))}
          </div>
        )}

        {/* Overlay on Hover */}
        {!disabled && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            {/* Edit Button */}
            <label
              htmlFor="upload"
              className="bg-[#FF6404] hover:bg-[#e55a00] text-white p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Camera size={20} />
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={onRemovePicture}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Account Information */}
    <FieldGroup title="Account Information">
      <Field label="User ID" value={userData.userId} disabled />
      <Field label="Email" value={userData.email} disabled />
    </FieldGroup>

    {/* Personal Information */}
    <FieldGroup title="Personal Information">
      <Field label="First Name" name="fName" value={userData.fName} onChange={onChange} error={errors.fName} disabled={disabled} />
      <Field label="Middle Name" name="mName" value={userData.mName} onChange={onChange} disabled={disabled} />
      <Field label="Last Name" name="lName" value={userData.lName} onChange={onChange} error={errors.lName} disabled={disabled} />
      <Field label="Phone Number" name="phoneNumber" value={userData.phoneNumber} onChange={onChange} error={errors.phoneNumber} disabled={disabled} />
      <Field label="Birth Date" name="birthDate" type="date" value={userData.birthDate} onChange={onChange} disabled={disabled} />
    </FieldGroup>

    {/* Address */}
    <FieldGroup title="Address">
      <Field label="Street" name="street" value={userData.street} onChange={onChange} disabled={disabled} />
      <Field label="Barangay" name="barangay" value={userData.barangay} disabled={true} />
      <Field label="City" name="city" value={userData.city} disabled={true} />
      <Field label="Province" name="province" value={userData.province} disabled={true} />
      <Field label="Region" name="region" value={userData.region} disabled={true} />
      <Field label="Country" name="country" value={userData.country} disabled={true} />
      <Field label="Zip Code" name="zipCode" value={userData.zipCode} disabled={true} />
    </FieldGroup>

    {/* Account Status */}
    <FieldGroup title="Account Status">
      <Field label="Role" value={userData.role} disabled />
      <Field label="Status" value={userData.accountStatus} disabled />
    </FieldGroup>

    <div className="flex justify-end pt-4">
      <button
        onClick={onSubmit}
        disabled={saving || disabled}
        className={`px-8 py-2.5 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
          disabled 
            ? 'bg-gray-400 cursor-not-allowed opacity-50' 
            : 'bg-[#FF6404] hover:bg-[#e55a00] disabled:opacity-50'
        }`}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
);

const PasswordForm = ({
  passwordData,
  errors,
  onChange,
  onSubmit,
  saving,
  isCurrentPasswordValid,
  isLocked,
  disabled,
}) => (
  <div>
    <p className="text-gray-600 text-sm mb-6">
      Please enter your current password first before setting a new password.
    </p>

    <FieldGroup title="Change Password">
      <Field
        label="Current Password"
        name="currentPassword"
        type="password"
        value={passwordData.currentPassword}
        onChange={onChange}
        error={errors.currentPassword}
        disabled={disabled}
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
            disabled={disabled}
          />
          <Field
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
            disabled={disabled}
          />
        </>
      )}
    </FieldGroup>

    {isCurrentPasswordValid && !isLocked && (
      <div className="flex justify-end pt-4">
        <button
          onClick={onSubmit}
          disabled={saving || disabled}
          className={`px-8 py-2.5 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
          }`}
        >
          {saving ? "Saving..." : "Change Password"}
        </button>
      </div>
    )}
  </div>
);

const Field = ({ label, name, value, onChange, type = "text", disabled, error }) => (
  <div>
    <label className={`block text-sm font-semibold mb-2 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors ${
        disabled
          ? "bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed opacity-50"
          : error
            ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-[#FF6404]"
            : "border-gray-300 focus:border-[#FF6404] focus:ring-2 focus:ring-[#FF6404]"
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