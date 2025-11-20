import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const reflectionPrompts = [
  {
    title: 'Gratitude Flash',
    text: 'List two tiny wins from today. Maybe you drank water, or you waved at a neighbour. Celebrate it.',
  },
  {
    title: 'Compassion Card',
    text: 'Imagine your best friend feeling exactly how you feel. What would you tell them right now?',
  },
  {
    title: 'Confidence Recharge',
    text: 'Write one sentence that starts with “I’m proud that I …” and finish it honestly.',
  },
  {
    title: 'Calm Breathing Bingo',
    text: 'Inhale, count four thoughts you can let go of, exhale with a gentle “I’m safe now.”',
  },
  {
    title: 'Lonely Hearts SOS',
    text: 'Send a quick “thinking of you” message to someone. Connection beats isolation every time.',
  },
];

const lightMiniGames = [
  { label: 'Stretch & Smile', description: 'Stand, stretch slowly, and smile for 10 seconds. Science says it boosts mood!' },
  { label: 'Song Shuffler', description: 'Play the happiest song you know and dance like nobody’s on Zoom.' },
  { label: 'Compliment Roulette', description: 'Give yourself or someone else a random compliment. The cheesier the better.' },
  { label: 'Emoji Weather', description: 'Describe your current mood using only three emojis.' },
  { label: 'Kindness Drop', description: 'Leave a sticky note with a positive message where someone can find it.' },
];

const Gamification = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [moodCoins, setMoodCoins] = useState(() => Number(localStorage.getItem('moodCoins')) || 0);
  const [completedIds, setCompletedIds] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('completedGamification') || '{}');
    return stored[todayKey] || [];
  });
  const [promptIndex, setPromptIndex] = useState(0);
  const [miniGameIndex, setMiniGameIndex] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${API_URL}/gamification`);
        setActivities(response.data);
        setSelectedActivity(response.data[0]);
      } catch (error) {
        console.error('Failed to load gamification data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    setPromptIndex(Math.floor(Math.random() * reflectionPrompts.length));
    setMiniGameIndex(Math.floor(Math.random() * lightMiniGames.length));
  }, []);

  const storeCompletion = (newCompleted) => {
    const map = JSON.parse(localStorage.getItem('completedGamification') || '{}');
    map[todayKey] = newCompleted;
    localStorage.setItem('completedGamification', JSON.stringify(map));
  };

  const completeActivity = (id) => {
    if (completedIds.includes(id)) return;
    const updated = [...completedIds, id];
    setCompletedIds(updated);
    storeCompletion(updated);
    const updatedCoins = moodCoins + 5;
    setMoodCoins(updatedCoins);
    localStorage.setItem('moodCoins', updatedCoins);
  };

  const spinPrompt = () => {
    setPromptIndex(Math.floor(Math.random() * reflectionPrompts.length));
  };

  const shuffleMiniGame = () => {
    setMiniGameIndex(Math.floor(Math.random() * lightMiniGames.length));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-calm-blue text-xl">Loading joyful moments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige to-soft-pink">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <p className="uppercase text-sm tracking-widest text-calm-blue font-semibold">Daily Boost</p>
          <h1 className="text-4xl font-bold text-calm-blue mt-2">Playful Healing Hub</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Tiny games. Gentle questions. Real relief. Use these light-weight quests when depression weighs heavy,
            burnout hits hard, or anxiety won’t stay quiet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-semibold text-gray-500">Mood Coins</p>
            <p className="text-4xl font-bold text-calm-blue mt-2">{moodCoins}</p>
            <p className="text-gray-500 text-sm mt-1">Earn 5 coins for every quest you complete.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-semibold text-gray-500">Completed Today</p>
            <p className="text-4xl font-bold text-calm-green mt-2">{completedIds.length}</p>
            <p className="text-gray-500 text-sm mt-1">Check back tomorrow for fresh prompts.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-semibold text-gray-500">Today&apos;s Date</p>
            <p className="text-2xl font-bold text-calm-lavender mt-2">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500">Quick Quests</p>
                <h2 className="text-2xl font-bold text-calm-blue">Pick a challenge</h2>
              </div>
              <select
                onChange={(e) => {
                  const found = activities.find((a) => a.id === Number(e.target.value));
                  setSelectedActivity(found);
                }}
                value={selectedActivity?.id || ''}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-calm-blue"
              >
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedActivity && (
              <div className="bg-gradient-to-r from-calm-blue/10 to-calm-green/10 rounded-2xl p-6">
                <p className="uppercase text-xs font-bold text-gray-500 mb-2">{selectedActivity.category}</p>
                <h3 className="text-2xl font-bold text-calm-blue mb-2">{selectedActivity.title}</h3>
                <p className="text-gray-600 mb-4">{selectedActivity.description}</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                  {selectedActivity.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-calm-green font-semibold">{selectedActivity.reward}</p>
                  <button
                    onClick={() => completeActivity(selectedActivity.id)}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${
                      completedIds.includes(selectedActivity.id)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-calm-blue text-white hover:bg-blue-600'
                    }`}
                  >
                    {completedIds.includes(selectedActivity.id) ? 'Completed' : 'Complete & Earn Coins'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-sm uppercase tracking-widest text-gray-500">Daily Reflection</p>
              <h3 className="text-xl font-bold text-calm-blue mb-3">{reflectionPrompts[promptIndex].title}</h3>
              <p className="text-gray-600 mb-4">{reflectionPrompts[promptIndex].text}</p>
              <button
                onClick={spinPrompt}
                className="w-full bg-calm-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Spin Another Prompt
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-sm uppercase tracking-widest text-gray-500">Mini Game</p>
              <h3 className="text-xl font-bold text-calm-blue mb-2">{lightMiniGames[miniGameIndex].label}</h3>
              <p className="text-gray-600 mb-4">{lightMiniGames[miniGameIndex].description}</p>
              <button
                onClick={shuffleMiniGame}
                className="w-full bg-calm-green text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Shuffle Game
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs tracking-widest text-gray-500">Scenario boosters</p>
              <h2 className="text-2xl font-bold text-calm-blue mt-1">Real-life relief ideas</h2>
              <p className="text-gray-600 mt-2">
                Exam stress, burnout, postpartum blues, relationship storms — pick one that fits your story today.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { title: 'Students under exam pressure', tip: 'Set a 25 minute “focus sprint” timer, then reward yourself with a silly meme.' },
              { title: 'Employees fighting burnout', tip: 'Schedule a fake “meeting” with yourself that is actually a walk outside.' },
              { title: 'New mothers facing postpartum stress', tip: 'Ask for one small favour today. Let someone rock the baby while you shower slowly.' },
              { title: 'People feeling lonely', tip: 'Join a 5-minute chat in our community or send a voice note to a friend saying hello.' },
            ].map(({ title, tip }) => (
              <div key={title} className="bg-calm-green/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-calm-green">{title}</p>
                <p className="text-gray-700 text-sm mt-2">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-calm-blue to-calm-green rounded-2xl p-8 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-2">You&apos;re allowed to rest.</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Healing doesn’t happen from hustle. These playful prompts are reminders that joy, connection, and calming
            breaths count as progress. Keep showing up for yourself — we&apos;re cheering you on.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gamification;

