import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ClientDashboard from './pages/ClientDashboard';
import TherapistListing from './pages/TherapistListing';
import SessionBooking from './pages/SessionBooking';
import MoodTracker from './pages/MoodTracker';
import ContentPage from './pages/ContentPage';
import Gamification from './pages/Gamification';
import Profile from './pages/Profile';
import Support from './pages/Support';
import PrivateRoute from './components/PrivateRoute';
import TherapistOnboarding from './pages/TherapistOnboarding';
import SessionFeedback from './pages/SessionFeedback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/professor/dashboard"
            element={
              <PrivateRoute>
                <ProfessorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/professor/onboarding"
            element={
              <PrivateRoute>
                <TherapistOnboarding />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/dashboard"
            element={
              <PrivateRoute>
                <ClientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/therapists"
            element={
              <PrivateRoute>
                <TherapistListing />
              </PrivateRoute>
            }
          />
          <Route
            path="/book-session/:professorId"
            element={
              <PrivateRoute>
                <SessionBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/mood-tracker"
            element={
              <PrivateRoute>
                <MoodTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <SessionFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/content"
            element={
              <PrivateRoute>
                <ContentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/gamification"
            element={
              <PrivateRoute>
                <Gamification />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


