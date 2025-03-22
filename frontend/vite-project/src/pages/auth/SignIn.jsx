import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { googleAuth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Auth({ type }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  async function handleAuthForm(event) {
    event.preventDefault();
    const res = await axios.post("http://localhost:5000/api/freelancer/register", {
      email: user.email,
      password  : user.password,
    });
    console.log(res);
    
    navigate('/signup/type');
  }

  async function handleGoogleAuth() {
    try {
      const data = await googleAuth();
  
      const accessToken = data.user.accessToken;
      const res = await axios.post("http://localhost:5000/api/freelancer/google-auth", {
        accessToken,
      });
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      // dispatch(googleSlice(res.data.user));
      // dispatch(login(res.data.user))
      console.log(res);
      
      if (res) {
        // toast.success(res.data.message);
        navigate("/signup/type"); 
      } else {
        //toast.error(res.data?.message);
        navigate("/signin"); 
      }
    } catch (error) {
      // Log and display an error if something goes wrong.
      console.error("Error during Google Authentication:", error.response?.data || error.message);
      //toast.error("An error occurred during authentication. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 m-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleAuthForm}>
        {type === "signup" && (
          <input
            type="text"
            className="w-full bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your Name"
            onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
          />
        )}
        <input
          type="email"
          className="w-full bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your Email"
          onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          className="w-full bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your Password"
          onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>

      <p className="text-gray-500 mt-4">or</p>

      <button
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg mt-4 transition"
      >
        <FaGoogle size={20} className="text-red-500" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default Auth;
