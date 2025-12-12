import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

const Settings = () => {
  const { auth, setAuth } = useAuth() || {};
  const token = auth?.token || "";

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile on load
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
        userId: data.userId || "",
        email: data.email || "",
        fName: data.fName || data.fname || "",
        mName: data.mName || data.mname || "",
        lName: data.lName || data.lname || "",
        street: data.street || "",
        barangay: data.barangay || "",
        city: data.city || "",
        province: data.province || "",
        region: data.region || "",
        country: data.country || "",
        zipCode: data.zipCode || "",
        phoneNumber: data.phoneNumber || "",
        birthDate: data.birthDate
          ? new Date(data.birthDate).toISOString().split("T")[0]
          : "",
        role: data.role || "",
        accountStatus: data.accountStatus || "",
        picture: null,
        picturePreview: data.picturePath
          ? `${API_URL}/${data.picturePath}?t=${Date.now()}`
          : `${(data.fName?.[0] || "T")}${(data.lName?.[0] || "W")}`,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle profile input changes
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

  // Handle profile update submission
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSavingProfile(true);

    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (key !== "picturePreview" && key !== "picture") {
          formData.append(key, userData[key]);
        }
      });
      if (userData.picture) formData.append("picture", userData.picture);

      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update profile: ${text}`);
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

      // Update global auth
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
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordData.currentPassword) {
      setError("Please enter your current password first.");
      return;
    }
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(`${API_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        // Extract error message from server
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message); // Shows "Current password is incorrect" if server responds that
    } finally {
      setSavingPassword(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-600 rounded">{success}</div>
        )}

        {/* Profile Update Form */}
        <form onSubmit={handleProfileSubmit}>
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
              onChange={handleFileChange}
              className="hidden"
            />
          </div>



          {/* Account Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  type="text"
                  value={userData.userId}
                  disabled
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="fName"
                  value={userData.fName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  name="mName"
                  value={userData.mName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lName"
                  value={userData.lName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={userData.birthDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={userData.street}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                <input
                  type="text"
                  name="barangay"
                  value={userData.barangay}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <input
                    type="text"
                    name="province"
                    value={userData.province}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={userData.region}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={userData.country}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={userData.zipCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={userData.role}
                  disabled
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input
                  type="text"
                  value={userData.accountStatus}
                  disabled
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end mb-6">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {savingProfile ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>

        {/* Password Change Form */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                placeholder="Enter current password"
              />
            </div>

            {/* Show new password fields only if current password is entered */}
            {passwordData.currentPassword && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded"
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
          </div>

          {passwordData.currentPassword && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={savingPassword}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
              >
                {savingPassword ? "Saving..." : "Change Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;