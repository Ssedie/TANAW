import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react"; 

const App = () =>{
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  function toggleSidebar(){
    console.log("wow");
    setSidebarVisible(!isSidebarVisible)
  }

  return (<>
    <div className="flex h-screen bg-gray-100">
      <Sidebar isVisible = {isSidebarVisible}/>
        <div>
          <Header onSidebarToggle = {toggleSidebar}/>
          <main>
            <h1><i>Ang Galing Talaga ng Computer</i></h1>
          </main>
        </div>
      <Footer />
    </div>
    </>
  )
}

export default App