import {Link, useLocation} from "react-router-dom";
const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const menuItems = [
    { icon: "📊",label: "Dashboard", link: "/" },
    { icon: "💰",label: "Budget", link: "/budget" },
    { icon: "📦",label: "Projects", link: "/projects" },
    { icon: "🗞",label: "Documents", link: "/documents" },
    { icon: "ℹ",label: "About", link: "/about" },
    { icon: "👤",label: "Officials", link: "/officials" },
    { icon: "⚙",label: "Settings", link: "/settings" }
  ];

  return(
    <div className={`overflow-hidden bg-secondary text-white transition-all duration-300 ${
    isOpen ? 'w-64' : 'w-0'}`} >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Tanaw</h2>
        </div >
      
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center px-6 py-1 transition-colors mx-2 my-2 rounded-lg ${location.pathname === item.link ? 'bg-gray-100 bg-opacity-25 border-l-4 border-accent' : 'hover:bg-gray-800'}`}
            >
              <span className="text-xl m-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

    </div>
  )
};

export default Sidebar;