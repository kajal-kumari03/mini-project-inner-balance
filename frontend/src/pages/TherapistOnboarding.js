import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const defaultForm = {
  tenthScore: '',
  twelfthScore: '',
  graduation: '',
  postGraduation: '',
  additionalCertifications: '',
  experienceYears: '',
  aadhaarNumber: '',
  panNumber: '',
  voterId: '',
  experienceCertificate: '',
  bio: '',
  specialityNotes: '',
};

const TherapistOnboarding = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const baseUrl = API_URL || 'https://inner-balance-backend.onrender.com';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${baseUrl}/professors/${user.id}`);
        const prof = response.data;
        if (prof.education || prof.documents) {
          setForm({
            tenthScore: prof.education?.tenthScore || '',
            twelfthScore: prof.education?.twelfthScore || '',
            graduation: prof.education?.graduation || '',
            postGraduation: prof.education?.postGraduation || '',
            additionalCertifications: prof.additionalCertifications || '',
            experienceYears: prof.experienceYears || '',
            aadhaarNumber: prof.documents?.aadhaarNumber || '',
            panNumber: prof.documents?.panNumber || '',
            voterId: prof.documents?.voterId || '',
            experienceCertificate: prof.documents?.experienceCertificate || '',
            bio: prof.bio || '',
            specialityNotes: prof.specialityNotes || '',
          });
        }
        setStatusMessage(prof.applicationStatus || 'documents-required');
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        education: {
          tenthScore: form.tenthScore,
          twelfthScore: form.twelfthScore,
          graduation: form.graduation,
          postGraduation: form.postGraduation,
        },
        additionalCertifications: form.additionalCertifications,
        experienceYears: form.experienceYears,
        documents: {
          aadhaarNumber: form.aadhaarNumber,
          panNumber: form.panNumber,
          voterId: form.voterId,
          experienceCertificate: form.experienceCertificate,
        },
        bio: form.bio,
        specialityNotes: form.specialityNotes,
        applicationStatus: 'under-review',
        status: 'pending',
        profileComplete: true,
      };

      await axios.patch(`${baseUrl}/professors/${user.id}`, payload);
      await axios.patch(`${baseUrl}/users/${user.id}`, {
        applicationStatus: 'under-review',
      });
      await refreshUser(user.id);
      alert('We will inform you when the admin approves your request. Thank you for sharing your documents.');
      navigate('/professor/dashboard');
    } catch (error) {
      console.error('Failed to submit onboarding form', error);
      alert('We could not submit your details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user.userType !== 'professor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <Navbar />
        <div className="text-calm-blue text-lg font-semibold">
          Only therapists can access the onboarding workspace.
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <div className="text-calm-blue text-xl font-semibold">Loading your onboarding form...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue/10 via-warm-beige to-soft-pink/40">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Therapist onboarding</p>
              <h1 className="text-3xl font-bold text-calm-blue mt-2">Share your credentials</h1>
              <p className="text-gray-600 mt-1">
                Help our admin team verify your profile. This takes less than 5 minutes.
              </p>
            </div>
            <div className="bg-soft-pink px-4 py-3 rounded-xl text-calm-blue font-semibold">
              Current status:&nbsp;
              <span className="capitalize">
                {statusMessage?.replace('-', ' ') || 'documents required'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-calm-blue mb-4">Academic journey</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">10th Grade Score (%)</label>
                  <input
                    type="text"
                    name="tenthScore"
                    value={form.tenthScore}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="e.g. 92%"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">12th Grade Score (%)</label>
                  <input
                    type="text"
                    name="twelfthScore"
                    value={form.twelfthScore}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="e.g. 94%"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation</label>
                  <input
                    type="text"
                    name="graduation"
                    value={form.graduation}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="Course & University"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post Graduation (if any)</label>
                  <input
                    type="text"
                    name="postGraduation"
                    value={form.postGraduation}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="Specialization"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Certifications / Workshops
                </label>
                <textarea
                  name="additionalCertifications"
                  value={form.additionalCertifications}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                  placeholder="e.g. Trauma-Informed CBT, Mindfulness for Social Workers"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-calm-blue mb-4">Identity & documents</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="e.g. 7"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="XXXX-XXXX-XXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
                  <input
                    type="text"
                    name="voterId"
                    value={form.voterId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="AB/123/4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Proof URL / Certificate ID
                  </label>
                  <input
                    type="text"
                    name="experienceCertificate"
                    value={form.experienceCertificate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="Link to PDF or certificate reference"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-calm-blue mb-4">Story & specialty</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal bio (shown to clients once approved)
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="Share your therapy philosophy, favourite tools, and what clients can expect."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty notes (exam stress, postpartum, burnout, etc.)
                  </label>
                  <textarea
                    name="specialityNotes"
                    value={form.specialityNotes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-calm-blue"
                    placeholder="Eg. Students facing visa anxiety, new parents with sleep deprivation, LGBTQ+ youth."
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">
                Once you submit, our admin team will double check all details. Expect a response within 24-48 hours.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="bg-calm-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit profile for review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistOnboarding;

