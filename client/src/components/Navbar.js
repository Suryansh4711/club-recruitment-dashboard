import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isAdmin = location.pathname.includes('/admin');

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Club Recruitment</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Apply Now
                </Link>
                <Link
                  to="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
                >
                  Admin Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/applications"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin/applications' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Applications
                </Link>
                <Link
                  to="/admin/statistics"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin/statistics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Statistics
                </Link>
                <Link
                  to="/admin/interviews"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin/interviews' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Interviews
                </Link>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ← Back to Apply
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
