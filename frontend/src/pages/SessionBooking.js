import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

const SessionBooking = () => {
  const { professorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [existingSessions, setExistingSessions] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    sessionType: 'video',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const baseUrl = API_URL || 'http://localhost:3001';

  // -------------------------------------
  // Fetch therapist + sessions
  // -------------------------------------
  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const [therapistRes, sessionsRes] = await Promise.all([
          axios.get(`${baseUrl}/professors/${professorId}`),
          axios.get(`${baseUrl}/sessions?professorId=${professorId}`),
        ]);

        setTherapist(therapistRes.data);
        setExistingSessions(sessionsRes.data);
      } catch (err) {
        console.error('Error fetching therapist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [professorId, baseUrl]);

  // -------------------------------------
  // Memoized available time slots
  // -------------------------------------
  const filteredTimes = useMemo(() => {
    if (!therapist || !formData.date) return [];

    const weekday = new Date(formData.date)
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    const baseSlots = therapist.availability?.[weekday] || [];

    const bookedTimes = existingSessions
      .filter((session) => session.date === formData.date)
      .map((session) => session.time);

    return baseSlots.filter((slot) => !bookedTimes.includes(slot));
  }, [therapist, existingSessions, formData.date]);

  // -------------------------------------
  // Submit handler
  // -------------------------------------
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
      const sessionsRes = await axios.get(`${baseUrl}/sessions`);
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

      await axios.post(`${baseUrl}/sessions`, newSession);

      alert('Session request submitted! The therapist will review it.');
      navigate('/client/dashboard');
    } catch (error) {
      console.error('Error booking session:', error);
      setError('Failed to book session. Please try again.');
    }

    setSubmitting(false);
  };

  // -------------------------------------
  // LOADING SCREEN
  // -------------------------------------
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

  // -------------------------------------
  // NOT FOUND
  // -------------------------------------
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

  // -------------------------------------
  // MAIN UI
  // -------------------------------------
  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Book a Session
        </h1>

        {/* Therapist Info */}
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

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-calm-blue mb-4">
            Session Details
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Session Type */}
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

            {/* Date */}
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

            {/* Time */}
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
                disabled={!formData.date}
              >
                <option value="">
                  {formData.date ? 'Select a time' : 'Choose a date first'}
                </option>

                {filteredTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              {formData.date && filteredTimes.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No available times on this day. Try another date.
                </p>
              )}

              {formData.date && filteredTimes.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Booked slots:{' '}
                  {existingSessions
                    .filter((s) => s.date === formData.date)
                    .map((s) => s.time)
                    .join(', ') || 'none yet'}
                </p>
              )}
            </div>

            {/* Info Message */}
            <div className="bg-calm-green/10 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Your booking request will be sent to the
                therapist for approval. You'll be notified once they respond.
              </p>
            </div>

            {/* Submit Button */}
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
