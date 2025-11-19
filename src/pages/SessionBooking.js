import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const SessionBooking = () => {
  const { professorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    sessionType: 'video',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTherapist();
  }, []);

  const fetchTherapist = async () => {
    try {
      const response = await axios.get(`${API_URL}/professors/${professorId}`);
      setTherapist(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching therapist:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.date || !formData.time) {
      setError('Please select both date and time');
      setSubmitting(false);
      return;
    }

    try {
      const sessionsRes = await axios.get(`${API_URL}/sessions`);
      const newId = Math.max(...sessionsRes.data.map((s) => s.id), 0) + 1;

      const newSession = {
        id: newId,
        clientId: user.id,
        professorId: parseInt(professorId),
        date: formData.date,
        time: formData.time,
        sessionType: formData.sessionType,
        status: 'pending',
        notes: '',
      };

      await axios.post(`${API_URL}/sessions`, newSession);
      alert('Session booking request submitted! The therapist will review it.');
      navigate('/client/dashboard');
    } catch (error) {
      setError('Failed to book session. Please try again.');
      console.error('Error booking session:', error);
    }
    setSubmitting(false);
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

  if (!therapist) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-calm-blue text-xl">Therapist not found</div>
        </div>
      </div>
    );
  }

  const availableTimes = therapist.availability
    ? Object.values(therapist.availability).flat()
    : [];

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Book a Session
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-calm-blue mb-4">
            Therapist Information
          </h2>
          <p className="font-semibold">{therapist.name}</p>
          <p className="text-sm text-gray-600">{therapist.qualifications}</p>
          <p className="text-sm text-gray-600 mt-2">
            Experience: {therapist.experience}
          </p>
          <div className="mt-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Specializations:
            </p>
            <div className="flex flex-wrap gap-2">
              {therapist.specialization.map((spec) => (
                <span
                  key={spec}
                  className="bg-calm-green/20 text-calm-green px-2 py-1 rounded text-xs capitalize"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-calm-blue mb-4">
            Session Details
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={formData.sessionType}
                onChange={(e) =>
                  setFormData({ ...formData, sessionType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                required
              >
                <option value="video">Video Call</option>
                <option value="audio">Audio Call</option>
                <option value="chat">Chat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <select
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                required
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {availableTimes.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No available times. Please contact the therapist directly.
                </p>
              )}
            </div>

            <div className="bg-calm-green/10 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Your booking request will be sent to the
                therapist for approval. You'll be notified once they respond.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-calm-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Book Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionBooking;


