import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Home, BarChart3, Wallet, Package, FileText, Info, Settings, Shield, X } from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { auth } = useAuth();
  const role = auth?.role || "CITIZEN";

  const menuItems = [
    { icon: Home, label: "Home", link: "/home" },
    { icon: BarChart3, label: "Dashboard", link: "/dashboard" },
    { icon: Wallet, label: "Budget", link: "/budget" },
    { icon: Package, label: "Projects", link: "/projects" },
    { icon: FileText, label: "Documents", link: "/documents" },
    { icon: Info, label: "About", link: "/about" },
    { icon: Settings, label: "Settings", link: "/settings" },
    ...(role === "ADMIN"
      ? [{ icon: Shield, label: "Admin Dashboard", link: "/adminDashboard" }]
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
          className="absolute top-5 right-3 p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <X size={24} fill="#e3e3e3" color="#e3e3e3" />
        </button>
      )}

      {/* Logo + Title */}
      <div className="p-2 flex justify-start items-center border-b border-gray-400">
        <img src={logo} alt="Logo" className="h-20 w-20" />
        <Link to="/home" className="text-3xl font-bold text-white hover:text-gray-200">
          Tanaw
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center px-6 py-1 transition-colors mx-2 my-2 rounded-lg ${
                location.pathname === item.link
                  ? "bg-gray-100 bg-opacity-25 border-l-4 border-accent"
                  : "hover:bg-gray-800"
              }`}
            >
              <Icon size={20} className="m-3 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;