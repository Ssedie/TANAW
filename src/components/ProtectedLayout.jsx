import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ProtectedLayout({ sidebarToggle, toggleSidebar }) {
  return (
    <div className="flex h-screen bg-gradient-to-l from-[#5C7D92] to-white">
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarToggle} onClose={() => toggleSidebar(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={toggleSidebar} isSidebarOpen={sidebarToggle} />
        <main className="flex-1 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
