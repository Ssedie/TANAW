import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('src/assets/bg.jpg')",
        }}
      ></div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/85 to-[#5C7D92]/85"></div>

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-30">
        <div className="p-2 flex items-center">
          <img src="src/assets/logo.png" alt="Logo" className="h-20 w-20 inline-block" />
          <h1 className="text-3xl font-bold text-gray-900 ml-[-2px]">Tanaw</h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-20 flex h-full pt-20">
        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col justify-center items-start p-16 space-y-6">
          <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Let the Transparency Start Here
          </h2>
          <p className="text-lg text-gray-800 max-w-lg leading-relaxed">
            Tanaw brings barangay budgets and project updates directly to your community. Real-time transparency, real impact, real accountability.
          </p>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/about")}
              className="px-6 py-3 bg-white text-[#FF6404] font-semibold rounded-lg hover:bg-gray-100 transition duration-200 shadow-md"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#FF6404] text-white font-semibold rounded-lg hover:bg-[#e55a00] transition duration-200 shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="relative flex justify-center items-center">
            {/* Circle behind */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-black/40 shadow-2xl"></div>

            {/* Mascot */}
            <div
              className="w-[600px] h-[600px] bg-cover bg-center relative z-10"
              style={{ backgroundImage: "url('src/assets/mascot.png')" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;