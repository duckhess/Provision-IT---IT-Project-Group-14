import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex w-screen flex-col items-center justify-center h-screen px-4 space-y-6">
      {/* Title */}
      <h1 className="text-4xl font-semibold mb-4 text-center">Login</h1>

      {/* Username input */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-60 bg-gray-200 rounded-md h-10 px-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 text-center"
      />

      {/* Password input */}
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-60 bg-gray-200 rounded-md h-10 px-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 text-center"
      />

      {/* Options: Show password + Forgot password */}
      <div className="w-60 flex justify-between items-center text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="h-4 w-4"
          />
          <span className="text-gray-600">Show password</span>
        </label>
        <button className="text-gray-500 hover:text-gray-700 hover:underline">
          Forgot password?
        </button>
      </div>

      {/* Login button */}
      <NavLink
        to="/profile"
        className="w-60 bg-gray-200 rounded-md h-10 flex items-center justify-center hover:opacity-70"
      >
        <span className="font-semibold text-xl">Login</span>
      </NavLink>
    </main>
  );
};

export default LoginPage;
