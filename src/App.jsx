import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import About from "./pages/About";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import {Routes, Route} from "react-router-dom";
import { useState } from "react"; 

const App = () =>{
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  function toggleSidebar(){
    setSidebarVisible(!isSidebarVisible)
  }

  return (
  <><Routes>
      <Route path= "/login" element={<Login/>}/>
      <Route path= "/*" element={(
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100">
            <Sidebar isVisible = {isSidebarVisible}/>
              <div className="flex-1 flex flex-col">
                <Header onSidebarToggle = {toggleSidebar}/>
                <main className="flex-1 bg-slate-200">
                  <Routes>
                    <Route path= "/" element={<Home/>}/>
                    <Route path= "/about" element={<About/>}/>
                    <Route path= "/services" element={<Services/>}/>
                    <Route path= "/contacts" element={<Contacts/>}/>
                  </Routes>
                </main>
              </div>
          </div>
        </ProtectedRoute>
      )}/>
    </Routes>
  </>
  )
}

export default App