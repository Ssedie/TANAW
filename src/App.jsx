import { useState } from "react";
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }
  return(<>
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarToggle}/>
      <div className="flex-1 flex-col">
        <Header onSidebarToggle={toggleSidebar}/>
        <main className="bg-slate-200">
        Main ng tanaw
        </main>
      </div>
      
    </div>
    
    
    
    </>
  )
}

export default App