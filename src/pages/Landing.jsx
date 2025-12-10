import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full relative">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('src/assets/bg.jpg')",
        }}
      ></div>

      {/* GRADIENT OVERLAY */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-white/80 to-[#5C7D92]/80"
      ></div>
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full p-2 z-20 ">
        <div className="mx-2 p-2 border-b border-black">
            <h1 className="text-2xl font-bold text-black">Tanaw</h1></div>
        
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-20 flex h-full">
        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-start p-16">
          <h2 className="text-7xl font-bold text-gray-900 mb-6">
            Let the Transparency Start Here
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-md">
            Tanaw brings barangay budgets and project updates directly to your community. Real-time transparency, real impact, real accountability.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/about") }
              className="px-6 py-3 bg-white text-[#FF6404] font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#FF6404] text-white font-semibold rounded-lg hover:bg-[#e55a00] transition"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
<div className="w-1/2 h-full flex justify-center items-center mt-0">
  <div className="relative flex justify-center items-center">
    {/* Circle behind */}
    <div className="absolute w-[550px] h-[550px] rounded-full bg-black/60"></div>

    {/* Mascot */}
    <div
      className="w-[700px] h-[700px] bg-cover bg-center relative z-10"
      style={{ backgroundImage: "url('src/assets/mascot.png')" }}
    ></div>
  </div>
</div>


      </div>
    </div>
  );
};

export default LandingPage;
