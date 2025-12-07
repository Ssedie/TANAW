import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-5xl font-bold mb-6">Welcome to Barangay Taboc</h1>
        <button onClick={() => navigate("/login")}
        className="bg-[#FF6404] px-8 py-4 text-white text-lg rounded-lg hover:bg-[#e55a00] transition"
        >
            Get Started
        </button>
    </div>
  )
}

export default LandingPage