import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client',
    age: '',
    qualifications: '',
    experience: '',
    specialization: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const specializations = prev.specialization || [];
      if (e.target.checked) {
        return { ...prev, specialization: [...specializations, value] };
      } else {
        return {
          ...prev,
          specialization: specializations.filter((s) => s !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const additionalData =
      formData.userType === 'professor'
        ? {
            qualifications: formData.qualifications,
            experience: formData.experience,
            specialization: formData.specialization,
          }
        : formData.userType === 'client'
        ? { age: formData.age }
        : {};

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.userType,
      additionalData
    );

    setLoading(false);

    if (result.success) {
      const userType = result.user.userType;
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'professor') {
        navigate('/professor/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  const specializations = [
    'depression',
    'anxiety',
    'stress',
    'burnout',
    'trauma',
    'relationship stress',
    'loneliness',
    'postpartum',
    'self-esteem',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-calm-green to-calm-lavender">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-calm-blue mb-6">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join Inner Balance and start your wellness journey
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
              >
                <option value="client">Client/Patient</option>
                <option value="professor">Therapist/Consultant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                placeholder="your@email.com"
              />
            </div>

            {formData.userType === 'client' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                  placeholder="25"
                />
              </div>
            )}

            {formData.userType === 'professor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                    placeholder="Ph.D. in Clinical Psychology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                    placeholder="10 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          value={spec}
                          checked={formData.specialization.includes(spec)}
                          onChange={handleSpecializationChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {spec}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-calm-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-calm-blue font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


