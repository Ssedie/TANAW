import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ProtectedLayout({ sidebarToggle, toggleSidebar }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarToggle} onClose={() => toggleSidebar(false)} />
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={toggleSidebar} isSidebarOpen={sidebarToggle} />
        <main className="flex-1 bg-slate-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
