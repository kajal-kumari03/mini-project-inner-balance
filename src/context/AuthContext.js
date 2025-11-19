import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:3001';

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

  useEffect(() => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Don't store password
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (name, email, password, userType, additionalData = {}) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      const newId = Math.max(...users.map((u) => u.id), 0) + 1;
      const newUser = {
        id: newId,
        name,
        email,
        password,
        userType,
        ...additionalData,
      };

      await axios.post(`${API_URL}/users`, newUser);

      // Create corresponding profile
      if (userType === 'professor') {
        const profId = Math.max(...(await axios.get(`${API_URL}/professors`)).data.map((p) => p.id), 0) + 1;
        await axios.post(`${API_URL}/professors`, {
          id: profId,
          name,
          qualifications: additionalData.qualifications || '',
          experience: additionalData.experience || '',
          specialization: additionalData.specialization || [],
          availability: {},
          reviews: [],
          status: 'pending',
        });
      } else if (userType === 'client') {
        const clientId = Math.max(...(await axios.get(`${API_URL}/clients`)).data.map((c) => c.id), 0) + 1;
        await axios.post(`${API_URL}/clients`, {
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
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


