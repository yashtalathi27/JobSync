import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating user authentication
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          JobSync
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/jobs" className="hover:underline">Find Jobs</Link>
          <Link to="/org/admin/addproject" className="hover:underline">Add Project</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:text-gray-300"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/settings">Settings</Link>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-200">
                Login
              </Link>
              <Link to="/signup" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-200">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 text-white text-center py-4">
          <Link to="/" className="block py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className="block py-2" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
          <Link to="/post-job" className="block py-2" onClick={() => setMenuOpen(false)}>Post a Job</Link>
          <Link to="/about" className="block py-2" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block py-2" onClick={() => setMenuOpen(false)}>Contact</Link>
          
          {/* Mobile Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block py-2 font-semibold text-blue-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block py-2 font-semibold text-blue-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/settings" className="block py-2" onClick={() => setMenuOpen(false)}>Settings</Link>
              <button className="block py-2 w-full text-left px-6 hover:text-red-500" onClick={() => setIsLoggedIn(false)}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
