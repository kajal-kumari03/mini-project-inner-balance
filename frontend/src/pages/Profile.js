import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (user.userType === 'professor') {
        const response = await axios.get(`${API_URL}/professors/${user.id}`);
        setProfile(response.data);
        setFormData({
          qualifications: response.data.qualifications || '',
          experience: response.data.experience || '',
          specialization: response.data.specialization || [],
        });
      } else if (user.userType === 'client') {
        const response = await axios.get(`${API_URL}/clients/${user.id}`);
        setProfile(response.data);
        setFormData({
          age: response.data.age || '',
          issues: response.data.issues || [],
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (user.userType === 'professor') {
        await axios.patch(`${API_URL}/professors/${user.id}`, {
          qualifications: formData.qualifications,
          experience: formData.experience,
          specialization: formData.specialization,
        });
      } else if (user.userType === 'client') {
        await axios.patch(`${API_URL}/clients/${user.id}`, {
          age: formData.age,
          issues: formData.issues,
        });
      }
      alert('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-calm-blue text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-calm-blue">
              {user.name}
            </h2>
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className="bg-calm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <span
                className={`inline-block px-3 py-1 rounded text-sm ${
                  user.userType === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : user.userType === 'professor'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {user.userType}
              </span>
            </div>

            {user.userType === 'professor' && profile && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.qualifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qualifications: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.qualifications || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.experience || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      {[
                        'depression',
                        'anxiety',
                        'stress',
                        'burnout',
                        'trauma',
                        'relationship stress',
                        'loneliness',
                        'postpartum',
                        'self-esteem',
                      ].map((spec) => (
                        <label key={spec} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.specialization.includes(spec)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  specialization: [
                                    ...formData.specialization,
                                    spec,
                                  ],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  specialization: formData.specialization.filter(
                                    (s) => s !== spec
                                  ),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {spec}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.specialization && profile.specialization.length > 0
                        ? profile.specialization.map((spec) => (
                            <span
                              key={spec}
                              className="bg-calm-green/20 text-calm-green px-3 py-1 rounded capitalize"
                            >
                              {spec}
                            </span>
                          ))
                        : 'No specializations'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm ${
                      profile.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {profile.status}
                  </span>
                </div>
              </>
            )}

            {user.userType === 'client' && profile && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.age || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issues/Concerns
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      {[
                        'depression',
                        'anxiety',
                        'stress',
                        'burnout',
                        'trauma',
                        'relationship stress',
                        'loneliness',
                        'postpartum',
                        'self-esteem',
                        'academic pressure',
                        'career pressure',
                      ].map((issue) => (
                        <label key={issue} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.issues.includes(issue)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  issues: [...formData.issues, issue],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  issues: formData.issues.filter(
                                    (i) => i !== issue
                                  ),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {issue}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.issues && profile.issues.length > 0
                        ? profile.issues.map((issue) => (
                            <span
                              key={issue}
                              className="bg-calm-green/20 text-calm-green px-3 py-1 rounded capitalize"
                            >
                              {issue}
                            </span>
                          ))
                        : 'No issues specified'}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


