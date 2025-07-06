import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is actually logged in as admin, not just on admin pages
  const isLoggedInAdmin = location.pathname.includes('/admin') && location.pathname !== '/admin/login';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored auth tokens
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminToken');
      // Navigate to login
      navigate('/admin/login');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'backdrop-blur-2xl bg-black/80 shadow-xl shadow-black/30 border-b border-gray-400/30' 
        : 'backdrop-blur-xl bg-black/40 shadow-lg shadow-black/10 border-b border-gray-500/20'
    }`}>
      {/* Animated gradient border */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300 opacity-100' 
          : 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 opacity-70'
      }`}></div>
      
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src="/code_busters_logo.png" 
                alt="CodeBusters Logo" 
                className="w-50 h-16 object-contain transition-all duration-300 group-hover:scale-110"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {!isLoggedInAdmin ? (
              <>
                <Link
                  to="/apply"
                  className={`relative px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    location.pathname === '/apply' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {location.pathname !== '/apply' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-600/10 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <span className="relative z-10">Apply Now</span>
                  {location.pathname !== '/apply' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/80 to-gray-600/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
                <Link
                  to="/admin/login"
                  className="relative px-8 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-slate-700 via-gray-700 to-slate-700 text-white hover:from-slate-600 hover:via-gray-600 hover:to-slate-600 transition-all duration-300 shadow-lg shadow-gray-700/25 hover:shadow-gray-600/40 hover:scale-105 group overflow-hidden"
                >
                  <span className="relative z-10">Admin Login</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    location.pathname === '/admin' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {location.pathname !== '/admin' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-600/10 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/80 to-gray-600/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                  <span className="relative z-10">Dashboard</span>
                </Link>
                <Link
                  to="/admin/interviews"
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    location.pathname === '/admin/interviews' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {location.pathname !== '/admin/interviews' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-600/10 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/80 to-gray-600/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                  <span className="relative z-10">Interviews</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative text-gray-300 hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-600/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-gray-500/30 hover:bg-black/60 transition-all duration-300"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}>
          <div className="pt-4 space-y-3">
            {!isLoggedInAdmin ? (
              <>
                <Link
                  to="/apply"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/apply' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-700 dark:text-gray-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Apply Now
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white shadow-lg shadow-gray-700/25"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/admin' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-700 dark:text-gray-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/interviews"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/admin/interviews' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25' 
                      : 'text-gray-700 dark:text-gray-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Interviews
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white/10 hover:bg-red-500/20 backdrop-blur-sm transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
