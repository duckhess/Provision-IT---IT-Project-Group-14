import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-[#f7f7f7] py-3 fixed top-0 left-0 z-50">
      <div className="w-full max-w-7xl mx-auto bg-[#f7f7f7] rounded-md flex items-center justify-between gap-4 px-32 py-2">

        {/* Logo (Link) */}
        <Link to="/" aria-label="Home" className="inline-flex items-center ">
          <div className=" w-10 h-10 rounded-full bg-[#e6e6e6] flex items-center justify-center font-bold text-[#263529] cursor-pointer select-none">
            L
          </div>
        </Link>

        {/* Center links */}
        <div className="flex gap-12 justify-center items-center flex-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `no-underline text-[0.95rem] text-[#111827] px-1 transition-colors duration-150 ${
                isActive
                  ? "text-[#0b5cff] font-bold border-b-2 border-[#0b5cff] pb-1"
                  : "hover:opacity-70"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `no-underline text-[0.95rem] text-[#111827] px-1 transition-colors duration-150 ${
                isActive
                  ? "text-[#0b5cff] font-bold border-b-2 border-[#0b5cff] pb-1"
                  : "hover:opacity-70"
              }`
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `no-underline text-[0.95rem] text-[#111827] px-1 transition-colors duration-150 ${
                isActive
                  ? "text-[#0b5cff] font-bold border-b-2 border-[#0b5cff] pb-1"
                  : "hover:opacity-70"
              }`
            }
          >
            Compare
          </NavLink>
        </div>

        {/* Profile on the right */}
        <NavLink
          to="/profile"
          aria-label="Profile"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 no-underline font-semibold ${
              isActive
                ? "bg-[#e6e7e8] text-[#0b5cff] font-bold border-b-2 border-[#0b5cff] pb-1"
                : "bg-[#e6e7e8] text-[#111827] hover:opacity-70"
            }`
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
