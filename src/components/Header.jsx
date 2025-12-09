import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  console.log("AUTH CONTENT:", auth);

  const user = auth?.user || auth; // supports nested or flat

  const userId = user?.userId;   // <--- now safe
  const fName = user?.fName || "";
  const lName = user?.lName || "";
  const profileImage = user?.profileImage || null;

  const userInitials = `${fName[0] || "R"}${lName[0] || "J"}`;

  // Handle profile click
  const handleProfileClick = () => {
    navigate("/settings");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center px-6 py-4">

        {/* Sidebar toggle */}
        {!isSidebarOpen && (
          <button onClick={onSidebarToggle} className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              viewBox="0 -960 960 960"
              fill="#000000"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
        )}

        {/* HEADER CONTENT — right side */}
        <div className="flex items-center space-x-4 ml-auto">

          {/* Search */}
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 -960 960 960"
              fill="#6b7280"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              7
            </span>
          </button>

          {/* Profile */}
          <div
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500 cursor-pointer hover:shadow-lg transition"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
