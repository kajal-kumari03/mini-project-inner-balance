import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientRes, sessionsRes] = await Promise.all([
        axios.get(`${API_URL}/clients/${user.id}`),
        axios.get(`${API_URL}/sessions?clientId=${user.id}`),
      ]);
      setClient(clientRes.data);
      setMoodLogs(clientRes.data.moodLogs || []);
      setSessions(sessionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
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

  const upcomingSessions = sessions.filter(
    (s) => s.status === 'confirmed' && new Date(s.date) >= new Date()
  );
  const recentMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null;

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 mb-6">
          Your mental health matters. You're not alone in this journey.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Upcoming Sessions
            </h3>
            <p className="text-3xl font-bold text-calm-blue">
              {upcomingSessions.length}
            </p>
            <Link
              to="/therapists"
              className="text-calm-blue text-sm mt-2 inline-block hover:underline"
            >
              Book a session →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Today's Mood
            </h3>
            {recentMood ? (
              <>
                <p className="text-3xl font-bold text-calm-green">
                  {recentMood.mood}/10
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(recentMood.date).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No mood logged yet</p>
            )}
            <Link
              to="/mood-tracker"
              className="text-calm-blue text-sm mt-2 inline-block hover:underline"
            >
              Track mood →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Total Sessions
            </h3>
            <p className="text-3xl font-bold text-calm-lavender">
              {sessions.length}
            </p>
            <Link
              to="/content"
              className="text-calm-blue text-sm mt-2 inline-block hover:underline"
            >
              View resources →
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/therapists"
                className="block bg-calm-blue text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition text-center"
              >
                Find a Therapist
              </Link>
              <Link
                to="/mood-tracker"
                className="block bg-calm-green text-white px-4 py-3 rounded-lg hover:bg-green-600 transition text-center"
              >
                Daily Wellbeing Check
              </Link>
              <Link
                to="/content"
                className="block bg-calm-lavender text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition text-center"
              >
                Mental Health Resources
              </Link>
              <Link
                to="/gamification"
                className="block bg-soft-pink text-calm-blue px-4 py-3 rounded-lg hover:bg-pink-200 transition text-center font-semibold"
              >
                Play a Daily Game
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Upcoming Sessions
            </h2>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <p className="font-medium">
                      {session.sessionType.charAt(0).toUpperCase() +
                        session.sessionType.slice(1)}{' '}
                      Session
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.date} at {session.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No upcoming sessions. Book one now!
              </p>
            )}
          </div>
        </div>

        {client && client.issues && client.issues.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Your Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {client.issues.map((issue) => (
                <span
                  key={issue}
                  className="bg-calm-green/20 text-calm-green px-4 py-2 rounded-lg capitalize"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-calm-blue to-calm-green rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Remember</h2>
          <p className="text-lg">
            Healing starts here. You're taking important steps towards better
            mental health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;


