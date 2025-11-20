import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_URL } from '../config/api';

const TherapistListing = () => {
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [slotChecks, setSlotChecks] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const baseUrl = API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTherapists(therapists);
    } else {
      setFilteredTherapists(
        therapists.filter((t) =>
          t.specialization.some((s) =>
            s.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
  }, [filter, therapists]);

  const fetchTherapists = async () => {
    try {
      const [profResponse, sessionsResponse] = await Promise.all([
        axios.get(`${baseUrl}/professors`),
        axios.get(`${baseUrl}/sessions`),
      ]);
      const approved = profResponse.data.filter((p) => p.status === 'approved');
      setTherapists(approved);
      setFilteredTherapists(approved);
      setSessions(sessionsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      setLoading(false);
    }
  };

  const issues = [
    'all',
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

  const getSlotStatus = (therapist, date) => {
    if (!date) return [];
    const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySlots = therapist.availability?.[weekday] || [];
    const bookedTimes = sessions
      .filter((session) => session.professorId === therapist.id && session.date === date)
      .map((session) => session.time);
    return daySlots.map((time) => ({
      time,
      isBooked: bookedTimes.includes(time),
    }));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Find Your Therapist
        </h1>
        <p className="text-gray-600 mb-6">
          Connect with licensed professionals who understand your journey
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Filter by Issue:
          </h2>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue) => (
              <button
                key={issue}
                onClick={() => setFilter(issue)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === issue
                    ? 'bg-calm-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-calm-green/20'
                }`}
              >
                {issue.charAt(0).toUpperCase() + issue.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-calm-blue rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {therapist.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-calm-blue">
                  {therapist.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {therapist.qualifications}
                </p>
                <p className="text-sm text-gray-600">
                  Experience: {therapist.experience}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Specializations:
                </h4>
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

              {therapist.reviews && therapist.reviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    ⭐{' '}
                    {(
                      therapist.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      therapist.reviews.length
                    ).toFixed(1)}{' '}
                    ({therapist.reviews.length} reviews)
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-600 block mb-2">
                  Check a date for live availability
                </label>
                <input
                  type="date"
                  value={slotChecks[therapist.id] || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSlotChecks((prev) => ({
                      ...prev,
                      [therapist.id]: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                {slotChecks[therapist.id] && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                    {getSlotStatus(therapist, slotChecks[therapist.id]).length === 0 ? (
                      <p className="text-xs text-gray-500">
                        Therapist is not available on this day. Try another date.
                      </p>
                    ) : (
                      getSlotStatus(therapist, slotChecks[therapist.id]).map((slot) => (
                        <div
                          key={`${therapist.id}-${slot.time}`}
                          className="flex items-center justify-between border rounded-lg px-3 py-2 text-xs"
                        >
                          <span>{slot.time}</span>
                          <span
                            className={`px-2 py-1 rounded ${
                              slot.isBooked
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {slot.isBooked ? 'Booked' : 'Free'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link
                to={`/book-session/${therapist.id}`}
                className="block w-full bg-calm-blue text-white text-center py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Book Session
              </Link>
            </div>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No therapists found for this filter. Try a different option.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistListing;


