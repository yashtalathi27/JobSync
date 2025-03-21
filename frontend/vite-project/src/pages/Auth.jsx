import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { googleAuth } from "../utils/firebase";

function Auth({ type }) {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  async function handleAuthForm(event) {
    event.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/${type}`, user);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(type === "signup" ? "/signin" : "/");
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  }

  async function handleGoogleAuth() {
    try {
      const data = await googleAuth();
    } catch (error) {
      toast.error("An error occurred during authentication.");
    }
  }

  return (
    <div className="w-[20%] flex flex-col items-center gap-5">
      <h1 className="text-3xl">{type === "signin" ? "Sign In" : "Sign Up"}</h1>

      <form className="w-full flex flex-col p-2 items-center gap-5" onSubmit={handleAuthForm}>
        {type === "signup" && (
          <input
            type="text"
            className="w-full bg-gray-400 h-[6vh] text-black p-2 text-l rounded-lg placeholder-gray-600"
            placeholder="Enter your Name"
            onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
          />
        )}
        <input
          type="email"
          className="w-full p-2 bg-gray-400 h-[6vh] text-black text-l rounded-lg placeholder-gray-600"
          placeholder="Enter your Email"
          onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          className="w-full bg-gray-400 h-[6vh] text-black text-l rounded-lg placeholder-gray-600"
          placeholder="Enter your Password"
          onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button className="w-[50%] bg-gray-800 h-[6vh] text-white text-xl rounded-lg">
          {type === "signin" ? "Login" : "Register"}
        </button>
        <p className="font-medium">or</p>
        <div onClick={handleGoogleAuth} className="bg-slate-100 hover:bg-slate-300 w-full flex justify-center cursor-pointer py-2 px-2 rounded-md">
          <p className="text-1xl font-semibold mr-3">Continue with</p>
        </div>
      </form>
      {type === "signin" ? (
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      ) : (
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      )}
    </div>
  );
}

export default Auth;
