import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const MoodTracker = () => {
  const { user } = useAuth();
  const [moodLogs, setMoodLogs] = useState([]);
  const [formData, setFormData] = useState({
    mood: 5,
    notes: '',
    stress: 5,
    sleep: 5,
    exercise: false,
    social: false,
    work: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const fetchMoodLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients/${user.id}`);
      setMoodLogs(response.data.moodLogs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mood logs:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const clientRes = await axios.get(`${API_URL}/clients/${user.id}`);
      const client = clientRes.data;
      const today = new Date().toISOString().split('T')[0];

      const newLog = {
        date: today,
        mood: parseInt(formData.mood),
        notes: formData.notes,
        stress: parseInt(formData.stress),
        sleep: parseInt(formData.sleep),
        activities: {
          exercise: formData.exercise,
          social: formData.social,
          work: formData.work,
        },
      };

      const existingLogIndex = client.moodLogs.findIndex(
        (log) => log.date === today
      );

      let updatedLogs;
      if (existingLogIndex >= 0) {
        updatedLogs = [...client.moodLogs];
        updatedLogs[existingLogIndex] = newLog;
      } else {
        updatedLogs = [...client.moodLogs, newLog];
      }

      await axios.patch(`${API_URL}/clients/${user.id}`, {
        moodLogs: updatedLogs,
      });

      alert('Wellbeing check saved successfully!');
      setFormData({
        mood: 5,
        notes: '',
        stress: 5,
        sleep: 5,
        exercise: false,
        social: false,
        work: false,
      });
      fetchMoodLogs();
    } catch (error) {
      console.error('Error saving mood log:', error);
      alert('Failed to save. Please try again.');
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

  const recentLogs = moodLogs.slice(-7).reverse();
  const avgMood =
    recentLogs.length > 0
      ? (
          recentLogs.reduce((sum, log) => sum + (log.mood || 0), 0) /
          recentLogs.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Daily Wellbeing Check
        </h1>
        <p className="text-gray-600 mb-6">
          Track your mood and wellbeing to better understand your mental health
          journey
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Today's Check-in
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today? (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.mood}
                    onChange={(e) =>
                      setFormData({ ...formData, mood: e.target.value })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <span className="text-lg font-bold text-calm-blue w-8 text-center">
                    {formData.mood}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stress}
                    onChange={(e) =>
                      setFormData({ ...formData, stress: e.target.value })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <span className="text-lg font-bold text-calm-lavender w-8 text-center">
                    {formData.stress}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleep}
                    onChange={(e) =>
                      setFormData({ ...formData, sleep: e.target.value })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">10</span>
                  <span className="text-lg font-bold text-calm-green w-8 text-center">
                    {formData.sleep}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activities Today
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.exercise}
                      onChange={(e) =>
                        setFormData({ ...formData, exercise: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Exercise</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.social}
                      onChange={(e) =>
                        setFormData({ ...formData, social: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Social Activity</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.work}
                      onChange={(e) =>
                        setFormData({ ...formData, work: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Work/Study</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-blue"
                  rows="3"
                  placeholder="How was your day? Any thoughts or feelings you'd like to note?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-calm-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Wellbeing Check'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Your Progress
            </h2>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">7-Day Average Mood</p>
              <p className="text-4xl font-bold text-calm-green">{avgMood}/10</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Recent Logs
              </h3>
              <div className="space-y-2">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-bold text-calm-blue">
                          {log.mood || 'N/A'}/10
                        </p>
                      </div>
                      {log.notes && (
                        <p className="text-xs text-gray-600 mt-1">{log.notes}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No mood logs yet. Start tracking today!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-calm-blue to-calm-green rounded-lg shadow-lg p-6 text-white text-center">
          <p className="text-lg">
            Regular tracking helps you understand patterns and progress in your
            mental health journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;


