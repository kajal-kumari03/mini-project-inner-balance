import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const userType = result.user.userType;
      const applicationStatus = result.user.applicationStatus;
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'professor') {
        if (applicationStatus === 'documents-required') {
          navigate('/professor/onboarding');
        } else {
          navigate('/professor/dashboard');
        }
      } else {
        navigate('/client/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-calm-green to-calm-lavender">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-calm-blue mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign in to continue your wellness journey
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-calm-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-calm-blue font-semibold hover:underline">
              Sign up here
            </Link>
          </p>

          <div className="mt-6 p-4 bg-calm-green/10 rounded-lg">
            <p className="text-sm text-gray-700 font-semibold mb-2">Demo Accounts:</p>
            <p className="text-xs text-gray-600">Admin: admin@innerbalance.com / admin123</p>
            <p className="text-xs text-gray-600">Professor: sarah@innerbalance.com / prof123</p>
            <p className="text-xs text-gray-600">Client: john@example.com / client123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


