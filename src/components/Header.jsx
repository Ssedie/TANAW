import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const fName = auth?.fName || "";
  const lName = auth?.lName || "";
  const profileImage = auth?.profileImage;
  const initials = `${fName[0] || "R"}${lName[0] || "J"}`;

  const handleProfileClick = () => navigate("/settings");

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 p-2">
      <div className="flex items-center justify-between px-6 h-20">
        {!isSidebarOpen && (
          <button 
            onClick={onSidebarToggle} 
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200"
            title="Toggle Sidebar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              width="24px" 
              viewBox="0 -960 960 960" 
              fill="#FF6404"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-6 ml-auto">
          {/* User Info */}
          <div className="text-right hidden md:block">
            <p className="text-gray-800 font-semibold text-sm">{fName} {lName}</p>
            <p className="text-gray-600 text-xs">{auth?.role || "CITIZEN"}</p>
          </div>

          {/* Profile Avatar */}
          <div
            onClick={handleProfileClick}
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#5C7D92] to-[#FF6404] cursor-pointer hover:shadow-lg transition-all duration-200 shadow-md border-2 border-[#FF6404]"
          >
            {profileImage && profileImage.startsWith("http") ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#5C7D92] text-white rounded-lg font-semibold hover:bg-[#4a6578] transition-all duration-200 shadow-md hover:shadow-lg"
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