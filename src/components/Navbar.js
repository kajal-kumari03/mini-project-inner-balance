import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'professor':
        return '/professor/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-calm-blue">
              Inner Balance
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {user.userType === 'client' && (
                  <>
                    <Link
                      to="/therapists"
                      className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Therapists
                    </Link>
                    <Link
                      to="/mood-tracker"
                      className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Mood Tracker
                    </Link>
                    <Link
                      to="/content"
                      className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Resources
                    </Link>
                    <Link
                      to="/gamification"
                      className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Daily Play
                    </Link>
                  </>
                )}
                {user.userType !== 'client' && (
                  <Link
                    to="/gamification"
                    className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Daily Play
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/support"
                  className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-calm-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-calm-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-calm-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Sign Up
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


