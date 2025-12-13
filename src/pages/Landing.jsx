import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* ANIMATED BACKGROUND STYLES */}
      <style>{`
        @keyframes backgroundMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-overlay {
          background: linear-gradient(-45deg, rgba(255,255,255,0.85), rgba(92,125,146,0.85), rgba(255,100,4,0.85), rgba(107,143,163,0.85));
          background-size: 400% 400%;
          animation: backgroundMove 8s ease-in-out infinite;
        }
      `}</style>

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('src/assets/bg.jpg')",
        }}
      ></div>

      {/* ANIMATED GRADIENT OVERLAY */}
      <div className="animated-overlay absolute inset-0 z-10"></div>

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-30">
        <div className="p-4 flex items-center gap-2">
          <img src="src/assets/logo.png" alt="Logo" className="h-16 w-16 rounded-lg" />
          <h1 className="text-3xl font-bold text-gray-900">Tanaw</h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-20 flex h-full pt-20">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-16 space-y-6">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Let the Transparency Start Here
          </h2>
          <p className="text-lg text-gray-800 max-w-lg leading-relaxed">
            Tanaw brings barangay budgets and project updates directly to your community. Real-time transparency, real impact, real accountability.
          </p>

          {/* GET STARTED BUTTON ONLY */}
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-[#FF6404] text-white font-semibold rounded-lg hover:bg-[#e55a00] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT SIDE - MASCOT */}
        <div className="hidden md:flex w-1/2 h-full justify-center items-center">
          <div className="relative flex justify-center items-center">
            {/* Circle behind */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-black/40 shadow-2xl"></div>

            {/* Mascot */}
            <div
              className="w-[600px] h-[600px] bg-contain bg-center bg-no-repeat relative z-10"
              style={{ backgroundImage: "url('src/assets/mascot.png')" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;