import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import { useState } from "react"; 

const App = () =>{
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  function toggleSidebar(){
    setSidebarVisible(!isSidebarVisible)
  }

  return (<>
    <div className="flex h-screen bg-gray-100">
      <Sidebar isVisible = {isSidebarVisible}/>
        <div className="flex-1 flex flex-col">
          <Header onSidebarToggle = {toggleSidebar}/>
          <main className="flex-1 bg-slate-200">
            <h1><i>Ang Galing Talaga ng Computer</i></h1>
            <Routes>
              <Route path= "/" element={<Home/>}/>
              <Route path= "/about" element={<About/>}/>
              <Route path= "/services" element={<Services/>}/>
              <Route path= "/contacts" element={<Contacts/>}/>
            </Routes>
          </main>
        </div>
    </div>
    </>
  )
}

export default App