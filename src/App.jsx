import { useState } from "react";
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Officials from "./pages/Officials";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }
  return(<>
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarToggle}/>
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={toggleSidebar}/>
        <main className="flex-1 bg-slate-200">
          <Routes>
            <Route path="/"  element={<Dashboard/>}/>
            <Route path="/about"  element={<About/>}/>
            <Route path="/officials"  element={<Officials/>}/>
            <Route path="/settings"  element={<Settings/>}/>
          </Routes>
        </main>
      </div>
      
    </div>
    
    
    
    </>
  )
}

export default App