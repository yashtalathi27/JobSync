import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const freelancerData = localStorage.getItem("freelancerData");
    const orgData = localStorage.getItem("orgDetails");
    
    if (freelancerData) {
      setUserData(JSON.parse(freelancerData));
      setIsLoggedIn(true);
    } else if (orgData) {
      setUserData(JSON.parse(orgData));
      setIsLoggedIn(true);
    }
  }, [location]);

  // Check if current page is home page
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem("freelancerData");
    localStorage.removeItem("orgDetails");
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

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

        {/* Auth Section - Only show on home page */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:text-gray-300"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <FaUserCircle size={24} />
                <span>{userData?.name || 'Profile'}</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to={userData?.id ? `/dashboard/freelancer/${userData.id}` : "/dashboard"}>
                        Dashboard
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/settings">Settings</Link>
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            isHomePage && (
              <>
                <Link to="/login" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-200">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-200">
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 text-white text-center py-4 z-50">
          <Link to="/" className="block py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className="block py-2" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
          <Link to="/post-job" className="block py-2" onClick={() => setMenuOpen(false)}>Post a Job</Link>
          <Link to="/about" className="block py-2" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block py-2" onClick={() => setMenuOpen(false)}>Contact</Link>
          
          {/* Mobile Auth Buttons - Only show on home page */}
          {!isLoggedIn ? (
            isHomePage && (
              <>
                <Link to="/login" className="block py-2 font-semibold text-blue-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="block py-2 font-semibold text-blue-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )
          ) : (
            <>
              <Link 
                to={userData?.id ? `/dashboard/freelancer/${userData.id}` : "/dashboard"} 
                className="block py-2" 
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link to="/settings" className="block py-2" onClick={() => setMenuOpen(false)}>Settings</Link>
              <button 
                className="block py-2 w-full text-left px-6 hover:text-red-500" 
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
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
