import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const SessionFeedback = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [form, setForm] = useState({
    sessionId: '',
    rating: 5,
    moodBefore: 5,
    moodAfter: 7,
    headline: '',
    comments: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsResponse = await axios.get(`${API_URL || 'http://localhost:3001'}/sessions?clientId=${user.id}`);
        setSessions(sessionsResponse.data);
        const feedbackResponse = await axios.get(`${API_URL || 'http://localhost:3001'}/feedback?clientId=${user.id}`);
        setFeedbackList(feedbackResponse.data);
      } catch (error) {
        console.error('Failed to load feedback data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const completedSessions = useMemo(
    () => sessions.filter((session) => session.status === 'completed' || session.status === 'confirmed'),
    [sessions]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.sessionId) {
      alert('Please choose a session to review');
      return;
    }
    setSubmitting(true);
    try {
      const selectedSession = sessions.find((session) => session.id === Number(form.sessionId));
      const payload = {
        sessionId: Number(form.sessionId),
        clientId: user.id,
        professorId: selectedSession?.professorId,
        rating: Number(form.rating),
        moodBefore: Number(form.moodBefore),
        moodAfter: Number(form.moodAfter),
        headline: form.headline,
        comments: form.comments,
        submittedAt: new Date().toISOString(),
      };
      await axios.post(`${API_URL || 'http://localhost:3001'}/feedback`, payload);
      const feedbackResponse = await axios.get(`${API_URL || 'http://localhost:3001'}/feedback?clientId=${user.id}`);
      setFeedbackList(feedbackResponse.data);
      setForm({
        sessionId: '',
        rating: 5,
        moodBefore: 5,
        moodAfter: 7,
        headline: '',
        comments: '',
      });
      alert('Thanks for sharing your reflections! Your therapist will review them soon.');
    } catch (error) {
      console.error('Failed to submit feedback', error);
      alert('We could not submit your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user.userType !== 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <Navbar />
        <div className="text-calm-blue text-lg font-semibold">
          Session reflections are reserved for client accounts.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <div className="text-calm-blue text-xl font-semibold">Loading feedback space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-green/10 via-warm-beige to-soft-pink/30">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">Session reflections</p>
              <h1 className="text-3xl font-bold text-calm-blue mt-1">Share feedback with your therapist</h1>
              <p className="text-gray-600 mt-1">
                Honest feedback helps us personalise future sessions, rituals, and resources for you.
              </p>
            </div>
            <div className="bg-calm-blue/10 px-4 py-3 rounded-xl text-calm-blue font-semibold">
              Completed sessions: {completedSessions.length}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose a session</label>
              <select
                name="sessionId"
                value={form.sessionId}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                required
              >
                <option value="">Select a session to review</option>
                {completedSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    #{session.id} with Therapist #{session.professorId} on {session.date} at {session.time}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session rating</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">You selected: {form.rating} / 5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood before session</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  name="moodBefore"
                  value={form.moodBefore}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{form.moodBefore}/10</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood after session</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  name="moodAfter"
                  value={form.moodAfter}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{form.moodAfter}/10</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">One-line headline</label>
                <input
                  type="text"
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                  placeholder="e.g. Finally slept 7 hours after months!"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapy takeaway (optional)</label>
                <input
                  type="text"
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                  placeholder="One moment, question, or idea that stayed with you."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500">
                Our team shares a summary with your therapist and admin team. They may suggest exercises based on this.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="bg-calm-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {submitting ? 'Sending love...' : 'Submit feedback'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">Your story so far</p>
              <h2 className="text-2xl font-bold text-calm-blue">Playback journal</h2>
            </div>
            <span className="text-sm text-gray-500">
              {feedbackList.length === 0 ? 'No reflections yet' : `${feedbackList.length} reflection(s) logged`}
            </span>
          </div>

          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-calm-blue/40 p-6 text-center text-gray-500">
                Start by sharing feedback for your most recent session. Your therapist will appreciate it!
              </div>
            ) : (
              feedbackList
                .slice()
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .map((feedback) => (
                  <div key={feedback.id} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-calm-blue">{feedback.headline}</h3>
                      <span className="text-sm text-gray-500">
                        Session #{feedback.sessionId} · {new Date(feedback.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                      <span>Rating: {feedback.rating}/5</span>
                      <span>Mood: {feedback.moodBefore} → {feedback.moodAfter}</span>
                    </div>
                    {feedback.comments && (
                      <p className="text-gray-700 mt-2">{feedback.comments}</p>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFeedback;

