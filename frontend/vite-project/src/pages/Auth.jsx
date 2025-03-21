import React, { useState } from "react";

import {googleAuth} from './utils/firebase'
function Auth({ type }) {
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  function handleAuthForm(event) {
    event.preventDefault();
  }

  async function handleGoogleAuth() {
    const data = await googleAuth();
  
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
    </div>
  );
}

export default Auth;
