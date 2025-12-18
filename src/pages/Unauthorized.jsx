// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 opacity-20 blur-2xl rounded-full"></div>
            <div className="relative bg-white rounded-full p-6 shadow-lg">
              <ShieldAlert className="w-16 h-16 text-red-600" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-8xl font-bold text-red-600 mb-2 tracking-tight">
            403
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Access Restricted
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            This page is only accessible to authorized Crocodile personnel. Your current credentials don't grant access to this content.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6404] text-white rounded-lg font-semibold hover:bg-[#e55a00] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Unauthorized;