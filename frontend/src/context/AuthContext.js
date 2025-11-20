import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const safeApiUrl = API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshUser = async (userId) => {
    try {
      const response = await axios.get(`${safeApiUrl}/users/${userId}`);
      const nextUser = { ...response.data };
      delete nextUser.password;
      persistUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error('Failed to refresh user profile', error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.get(`${safeApiUrl}/users`);
      const users = response.data;
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Don't store password
        persistUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response 
        ? error.response.data?.message || `Server error: ${error.response.status}`
        : error.message || 'Cannot connect to backend server. Please check if the backend is running.';
      return { 
        success: false, 
        error: `Login failed: ${errorMessage}` 
      };
    }
  };

  const register = async (name, email, password, userType, additionalData = {}) => {
    try {
      const response = await axios.get(`${safeApiUrl}/users`);
      const users = response.data;
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      const newId = Math.max(...users.map((u) => u.id), 0) + 1;
      const applicationStatus = userType === 'professor' ? 'documents-required' : 'approved';
      const newUser = {
        id: newId,
        name,
        email,
        password,
        userType,
          applicationStatus,
        ...additionalData,
      };

      await axios.post(`${safeApiUrl}/users`, newUser);

      // Create corresponding profile
      if (userType === 'professor') {
        const profResponse = await axios.get(`${safeApiUrl}/professors`);
        const profId = Math.max(...profResponse.data.map((p) => p.id), 0) + 1;
        await axios.post(`${safeApiUrl}/professors`, {
          id: profId,
          name,
          qualifications: additionalData.qualifications || '',
          experience: additionalData.experience || '',
          specialization: additionalData.specialization || [],
          availability: {},
          reviews: [],
          status: 'pending',
          applicationStatus: 'documents-required',
          profileComplete: false,
          education: {},
          documents: {}
        });
      } else if (userType === 'client') {
        const clientResponse = await axios.get(`${safeApiUrl}/clients`);
        const clientId = Math.max(...clientResponse.data.map((c) => c.id), 0) + 1;
        await axios.post(`${safeApiUrl}/clients`, {
          id: clientId,
          name,
          age: additionalData.age || null,
          issues: additionalData.issues || [],
          moodLogs: [],
          sessionHistory: [],
        });
      }

      const userData = { ...newUser };
      delete userData.password;
      persistUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response 
        ? error.response.data?.message || `Server error: ${error.response.status}`
        : error.message || 'Cannot connect to backend server. Please check if the backend is running.';
      return { 
        success: false, 
        error: `Registration failed: ${errorMessage}` 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


