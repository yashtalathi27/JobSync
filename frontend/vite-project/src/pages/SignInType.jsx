import React from "react";
import { useNavigate } from "react-router-dom";

const SignInType = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Sign Up as</h2>
        
        <div className="space-y-4">
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/signup/freelancer")}
          >
            Freelancer
          </button>

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/signup/organization")}
          >
            Organization
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInType;