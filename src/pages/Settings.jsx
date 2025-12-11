import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

const Settings = () => {
  const { auth, setAuth } = useAuth() || {};
  const token = auth?.token || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    picturePreview: "/default-user.png",
  });

  // Fetch user profile on component mount
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
        accountStatus: data.accountStatus || data.account_status || "",
        picture: null,
        picturePreview: data.picturePath
          ? `${API_URL}/uploads/${data.picturePath}?t=${Date.now()}`
          : "/default-user.png",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("fName", userData.fName);
      formData.append("mName", userData.mName);
      formData.append("lName", userData.lName);
      formData.append("street", userData.street);
      formData.append("barangay", userData.barangay);
      formData.append("city", userData.city);
      formData.append("province", userData.province);
      formData.append("region", userData.region);
      formData.append("country", userData.country);
      formData.append("zipCode", userData.zipCode);
      formData.append("phoneNumber", userData.phoneNumber);
      formData.append("birthDate", userData.birthDate);

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

      // Update local state
      setUserData((prev) => ({
        ...prev,
        ...updatedData,
        picture: null,
        picturePreview: updatedData.picturePath
          ? `${API_URL}/uploads/${updatedData.picturePath}?t=${Date.now()}`
          : prev.picturePreview,
      }));

      // Update global auth
      if (setAuth) {
        const profileImage = updatedData.picturePath
          ? `${API_URL}/uploads/${updatedData.picturePath}?t=${Date.now()}`
          : auth?.profileImage || null;

        setAuth((prev) => ({
          ...prev,
          fName: updatedData.fName || prev.fName,
          lName: updatedData.lName || prev.lName,
          profileImage,
        }));

        localStorage.setItem("fName", updatedData.fName || auth?.fName);
        localStorage.setItem("lName", updatedData.lName || auth?.lName);
        if (profileImage) localStorage.setItem("profileImage", profileImage);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

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
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-600 rounded">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <img
              src={userData.picturePreview || "/default-user.png"}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover mb-2 border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Account Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input type="text" value={userData.userId} disabled className="w-full p-2 border bg-gray-100 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={userData.email} disabled className="w-full p-2 border bg-gray-100 rounded" />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" name="fName" value={userData.fName} onChange={handleChange} className="w-full p-2 border rounded" placeholder="First Name" />
              <input type="text" name="mName" value={userData.mName} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Middle Name" />
              <input type="text" name="lName" value={userData.lName} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Last Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="tel" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone Number" />
              <input type="date" name="birthDate" value={userData.birthDate} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Birth Date" />
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Address</h2>
            <div className="space-y-4">
              <input type="text" name="street" value={userData.street} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Street" />
              <input type="text" name="barangay" value={userData.barangay} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Barangay" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="city" value={userData.city} onChange={handleChange} className="w-full p-2 border rounded" placeholder="City" />
                <input type="text" name="province" value={userData.province} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Province" />
                <input type="text" name="region" value={userData.region} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Region" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="country" value={userData.country} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Country" />
                <input type="text" name="zipCode" value={userData.zipCode} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Zip Code" />
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={userData.role} disabled className="w-full p-2 border bg-gray-100 rounded" placeholder="Role" />
              <input type="text" value={userData.accountStatus} disabled className="w-full p-2 border bg-gray-100 rounded" placeholder="Status" />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
