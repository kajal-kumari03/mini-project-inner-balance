import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-calm-green to-calm-lavender">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to Inner Balance
          </h1>
          <p className="text-xl md:text-2xl text-white mb-4">
            Your mental wellness companion
          </p>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            You're not alone. Healing starts here. Your mental health matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-calm-blue px-8 py-3 rounded-lg text-lg font-semibold hover:bg-warm-beige transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/20 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/90 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🧘</div>
            <h3 className="text-xl font-bold text-calm-blue mb-2">
              Expert Guidance
            </h3>
            <p className="text-gray-700">
              Connect with licensed therapists and mental health professionals
              who understand your journey.
            </p>
          </div>
          <div className="bg-white/90 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-calm-blue mb-2">
              Track Your Progress
            </h3>
            <p className="text-gray-700">
              Monitor your mood, complete daily wellbeing checks, and see your
              growth over time.
            </p>
          </div>
          <div className="bg-white/90 rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-calm-blue mb-2">
              Educational Resources
            </h3>
            <p className="text-gray-700">
              Access articles, exercises, and tips for managing anxiety,
              depression, stress, and more.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white/90 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-calm-blue mb-6 text-center">
            We're Here to Help With
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Depression',
              'Anxiety',
              'Stress & Burnout',
              'Career Pressure',
              'Relationship Issues',
              'Loneliness',
              'Academic Pressure',
              'Trauma Recovery',
              'Postpartum Support',
              'Social Media Addiction',
              'Low Self-Esteem',
              'Insomnia',
            ].map((issue) => (
              <div
                key={issue}
                className="bg-calm-green/20 rounded-lg p-4 text-center"
              >
                <p className="text-gray-700 font-medium">{issue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/90 mb-6">
            Take the first step towards better mental health today.
          </p>
          <Link
            to="/register"
            className="bg-white text-calm-blue px-8 py-3 rounded-lg text-lg font-semibold hover:bg-warm-beige transition duration-300 inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;


