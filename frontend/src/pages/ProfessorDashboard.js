import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_URL } from '../config/api';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [availability, setAvailability] = useState({});
  const [newMessage, setNewMessage] = useState({ receiverId: '', message: '' });
  const baseUrl = API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (user?.applicationStatus === 'documents-required') {
      navigate('/professor/onboarding', { replace: true });
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [profRes, sessionsRes, messagesRes, feedbackRes] = await Promise.all([
        axios.get(`${baseUrl}/professors/${user.id}`),
        axios.get(`${baseUrl}/sessions?professorId=${user.id}`),
        axios.get(`${baseUrl}/messages?receiverId=${user.id}`),
        axios.get(`${baseUrl}/feedback?professorId=${user.id}`),
      ]);
      setProfile(profRes.data);
      setAvailability(profRes.data.availability || {});
      setSessions(sessionsRes.data);
      setMessages(messagesRes.data);
      setFeedback(feedbackRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateAvailability = async () => {
    try {
      await axios.patch(`${baseUrl}/professors/${user.id}`, {
        availability,
      });
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const acceptSession = async (sessionId) => {
    try {
      await axios.patch(`${baseUrl}/sessions/${sessionId}`, {
        status: 'confirmed',
      });
      fetchData();
    } catch (error) {
      console.error('Error accepting session:', error);
    }
  };

  const rejectSession = async (sessionId) => {
    try {
      await axios.patch(`${baseUrl}/sessions/${sessionId}`, {
        status: 'rejected',
      });
      fetchData();
    } catch (error) {
      console.error('Error rejecting session:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        id: Date.now(),
        senderId: user.id,
        receiverId: parseInt(newMessage.receiverId),
        message: newMessage.message,
        timestamp: new Date().toISOString(),
      };
      await axios.post(`${baseUrl}/messages`, messageData);
      setNewMessage({ receiverId: '', message: '' });
      fetchData();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Professor Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, {user.name}!{' '}
          {profile?.applicationStatus === 'under-review' && (
            <span className="inline-block text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm">
              Application under review — we’ll notify you once the admin approves.
            </span>
          )}
        </p>

        <div className="flex space-x-2 mb-6 border-b">
          {['overview', 'sessions', 'availability', 'messages', 'feedback'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-calm-blue text-calm-blue'
                  : 'text-gray-600 hover:text-calm-blue'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-calm-blue mb-4">
                Your Profile
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Name:</span> {profile?.name}
                </p>
                <p>
                  <span className="font-semibold">Qualifications:</span>{' '}
                  {profile?.qualifications}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{' '}
                  {profile?.experience}
                </p>
                <p>
                  <span className="font-semibold">Specializations:</span>{' '}
                  {profile?.specialization?.join(', ')}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      profile?.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {profile?.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Application:</span>{' '}
                  <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 capitalize">
                    {profile?.applicationStatus || 'documents-required'}
                  </span>
                </p>
                {profile?.education && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-calm-blue">Academics</p>
                      <p>10th: {profile.education.tenthScore || 'N/A'}</p>
                      <p>12th: {profile.education.twelfthScore || 'N/A'}</p>
                      <p>Grad: {profile.education.graduation || 'N/A'}</p>
                      {profile.education.postGraduation && <p>Post Grad: {profile.education.postGraduation}</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-calm-blue">Identity Proof</p>
                      <p>Aadhaar: {profile.documents?.aadhaarNumber || 'N/A'}</p>
                      <p>PAN: {profile.documents?.panNumber || 'N/A'}</p>
                      <p>Voter ID: {profile.documents?.voterId || 'N/A'}</p>
                      {profile.documents?.experienceCertificate && (
                        <p>Experience Proof: {profile.documents.experienceCertificate}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Upcoming Sessions
                </h3>
                <p className="text-3xl font-bold text-calm-blue">
                  {sessions.filter(
                    (s) =>
                      s.status === 'confirmed' &&
                      new Date(s.date) >= new Date()
                  ).length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Pending Requests
                </h3>
                <p className="text-3xl font-bold text-calm-lavender">
                  {sessions.filter((s) => s.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Total Sessions
                </h3>
                <p className="text-3xl font-bold text-calm-green">
                  {sessions.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-calm-blue">Your Sessions</h2>
            </div>
            <div className="p-6 space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      Session #{session.id} - {session.sessionType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {session.date} at {session.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      Client ID: {session.clientId}
                    </p>
                    {session.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        Notes: {session.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : session.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {session.status}
                    </span>
                    {session.status === 'pending' && (
                      <>
                        <button
                          onClick={() => acceptSession(session.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectSession(session.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">
              Manage Availability
            </h2>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 capitalize">{day}</h3>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <label key={time} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            availability[day]?.includes(time) || false
                          }
                          onChange={(e) => {
                            const newAvail = { ...availability };
                            if (!newAvail[day]) newAvail[day] = [];
                            if (e.target.checked) {
                              newAvail[day] = [...newAvail[day], time];
                            } else {
                              newAvail[day] = newAvail[day].filter(
                                (t) => t !== time
                              );
                            }
                            setAvailability(newAvail);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={updateAvailability}
              className="mt-6 bg-calm-blue text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Save Availability
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">Messages</h2>
            <div className="space-y-4 mb-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="text-sm text-gray-600 mb-1">
                    From Client #{msg.senderId}
                  </p>
                  <p className="text-gray-800">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="border-t pt-4">
              <h3 className="font-semibold mb-2">Send Message</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Client ID"
                  value={newMessage.receiverId}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, receiverId: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Your message..."
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="bg-calm-blue text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-calm-blue mb-4">Session Feedback</h2>
            {feedback.length === 0 ? (
              <p className="text-gray-500">No client reflections yet. Encourage clients to share their experience.</p>
            ) : (
              <div className="space-y-4">
                {feedback
                  .slice()
                  .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                  .map((entry) => (
                    <div key={entry.id} className="border rounded-xl p-4 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold text-calm-blue">{entry.headline}</h3>
                        <span className="text-sm text-gray-500">
                          Session #{entry.sessionId} · {new Date(entry.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                        <span>Rating: {entry.rating}/5</span>
                        <span>
                          Mood shift: {entry.moodBefore} → {entry.moodAfter}
                        </span>
                      </div>
                      {entry.comments && <p className="text-gray-700 mt-2">{entry.comments}</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;


