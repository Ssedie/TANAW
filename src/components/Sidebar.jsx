import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";


const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { auth } = useAuth();  // get auth from context
  const role = auth?.role || "CITIZEN"; // default to "CITIZEN"

  const menuItems = [
    { icon: "🏠", label: "Home", link: "/home" },
    { icon: "📊", label: "Dashboard", link: "/dashboard" },
    { icon: "💰", label: "Budget", link: "/budget" },
    { icon: "📦", label: "Projects", link: "/projects" },
    { icon: "🗞", label: "Documents", link: "/documents" },
    { icon: "ℹ", label: "About", link: "/about" },
    { icon: "⚙", label: "Settings", link: "/settings" },
    ...(role === "ADMIN"
      ? [{ icon: "📊", label: "Admin Dashboard", link: "/adminDashboard" }]
      : [])
  ];

  return (
<div
  className={`fixed top-0 left-0 overflow-hidden bg-secondary text-white transition-all duration-300 z-50
  ${isOpen ? "w-64" : "w-0"} h-screen`}
>



      {isOpen && (
        <button
          onClick={onClose}
          className="absolute top-5 right-3 hover:opacity-80 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
      )}

      <div className="p-4">
        <Link to="/home" className="text-3xl font-bold text-white hover:text-gray-200">
          Tanaw
        </Link>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`flex items-center px-6 py-1 transition-colors mx-2 my-2 rounded-lg ${
              location.pathname === item.link
                ? "bg-gray-100 bg-opacity-25 border-l-4 border-accent"
                : "hover:bg-gray-800"
            }`}
          >
            <span className="text-xl m-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
