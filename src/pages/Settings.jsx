import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { API_URL } from "../config/constants";

const Settings = () => {
    const { auth } = useAuth() || {};
    const token = auth?.token || "";
    const authRole = auth?.role || "CITIZEN";

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
        accountStatus: ""
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    async function fetchUserProfile() {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/user/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch profile");

            const data = await response.json();
            console.log("Fetched user data:", data);
            setUserData({
                userId: data.userId || "",
                email: data.email || "",
                fName: data.fName || "",
                mName: data.mName || "",
                lName: data.lName || "",
                street: data.street || "",
                barangay: data.barangay || "",
                city: data.city || "",
                province: data.province || "",
                region: data.region || "",
                country: data.country || "",
                zipCode: userData.zipCode ? parseInt(userData.zipCode) : null,
                phoneNumber: data.phoneNumber || "",
                birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString() : null,
                role: data.role || "CITIZEN",
                accountStatus: data.accountStatus || "Active"
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fName: userData.fName,
                    mName: userData.mName,
                    lName: userData.lName,
                    street: userData.street,
                    barangay: userData.barangay,
                    city: userData.city,
                    province: userData.province,
                    region: userData.region,
                    country: userData.country,
                    zipCode: userData.zipCode ? parseInt(userData.zipCode) : null,
                    phoneNumber: userData.phoneNumber,
                    birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString() : null
                })
            });

            if (!response.ok) throw new Error("Failed to update profile");

            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
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

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-600 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
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
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    name="mName"
                                    value={userData.mName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lName"
                                    value={userData.lName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={userData.birthDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Info */}
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
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                                <input
                                    type="text"
                                    name="barangay"
                                    value={userData.barangay}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={userData.province}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={userData.region}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={userData.zipCode}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <input
                                    type="text"
                                    value={userData.accountStatus}
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
