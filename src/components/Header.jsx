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
  const profileImage = auth?.profileImage; // could be URL or undefined
  const initials = `${fName[0] || "R"}${lName[0] || "J"}`;

  const handleProfileClick = () => navigate("/settings");

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center px-6 py-4">
{!isSidebarOpen && (
          <button onClick={onSidebarToggle} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="#000000">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
        )}

        <div className="flex items-center space-x-4 ml-auto">
          <div
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-orange-500 cursor-pointer hover:shadow-lg transition"
          >
            {profileImage.startsWith("http") ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              profileImage // display initials
            )}
          </div>

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