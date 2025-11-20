import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_URL } from '../config/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const baseUrl = API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, profRes, sessionsRes, contentRes] = await Promise.all([
        axios.get(`${baseUrl}/users`),
        axios.get(`${baseUrl}/professors`),
        axios.get(`${baseUrl}/sessions`),
        axios.get(`${baseUrl}/content`),
      ]);
      setUsers(usersRes.data);
      setProfessors(profRes.data);
      setSessions(sessionsRes.data);
      setContent(contentRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateProfessorStatus = async (profId, nextStatus) => {
    try {
      const statusPayload =
        nextStatus === 'approved'
          ? { status: 'approved', applicationStatus: 'approved' }
          : { status: 'pending', applicationStatus: 'documents-required' };

      await axios.patch(`${baseUrl}/professors/${profId}`, statusPayload);

      const linkedUser = users.find((u) => u.id === profId);
      if (linkedUser) {
        await axios.patch(`${baseUrl}/users/${linkedUser.id}`, {
          applicationStatus: statusPayload.applicationStatus,
        });
      }
      fetchData();
    } catch (error) {
      console.error('Error updating professor status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${baseUrl}/users/${userId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const stats = {
    totalUsers: users.length,
    totalClients: users.filter((u) => u.userType === 'client').length,
    totalProfessors: users.filter((u) => u.userType === 'professor').length,
    pendingProfessors: professors.filter((p) => p.applicationStatus && p.applicationStatus !== 'approved').length,
    totalSessions: sessions.length,
    completedSessions: sessions.filter((s) => s.status === 'completed').length,
    totalContent: content.length,
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
          Admin Dashboard
        </h1>

        <div className="flex space-x-2 mb-6 border-b">
          {['overview', 'users', 'professors', 'sessions', 'content'].map(
            (tab) => (
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
            )
          )}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-calm-blue">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Clients
                </h3>
                <p className="text-3xl font-bold text-calm-green">
                  {stats.totalClients}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Therapists
                </h3>
                <p className="text-3xl font-bold text-calm-lavender">
                  {stats.totalProfessors}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  Total Sessions
                </h3>
                <p className="text-3xl font-bold text-calm-blue">
                  {stats.totalSessions}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-calm-blue mb-4">
                Pending Approvals
              </h2>
              {stats.pendingProfessors > 0 ? (
                <p className="text-lg">
                  {stats.pendingProfessors} professor(s) waiting for approval
                </p>
              ) : (
                <p className="text-gray-600">No pending approvals</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-calm-blue mb-4">
                Recent Sessions
              </h2>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">
                        Session #{session.id} - {session.sessionType}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.date} at {session.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-calm-blue">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded ${
                            u.userType === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.userType === 'professor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {u.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'professors' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-calm-blue">
                Professor Management
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {professors.map((prof) => (
                <div
                  key={prof.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold text-lg text-calm-blue">
                      {prof.name}
                    </h3>
                    <p className="text-sm text-gray-600">{prof.qualifications}</p>
                    <p className="text-sm text-gray-600">
                      Experience: {prof.experience}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Specializations:{' '}
                      {prof.specialization.join(', ')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm ${
                          prof.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : prof.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Status: {prof.status}
                      </span>
                      <span className="inline-block px-3 py-1 rounded text-sm bg-blue-50 text-blue-700">
                        Application: {prof.applicationStatus || 'N/A'}
                      </span>
                    </div>
                    {(prof.education || prof.documents) && (
                      <details className="mt-3 bg-gray-50 rounded-lg p-3">
                        <summary className="cursor-pointer text-sm text-calm-blue font-semibold">
                          View submitted documents
                        </summary>
                        <div className="mt-2 space-y-1 text-sm text-gray-700">
                          {prof.education && (
                            <>
                              <p>10th: {prof.education.tenthScore || 'N/A'}</p>
                              <p>12th: {prof.education.twelfthScore || 'N/A'}</p>
                              <p>Graduation: {prof.education.graduation || 'N/A'}</p>
                              {prof.education.postGraduation && <p>Post Grad: {prof.education.postGraduation}</p>}
                            </>
                          )}
                          {prof.documents && (
                            <>
                              <p>Aadhaar: {prof.documents.aadhaarNumber || 'N/A'}</p>
                              <p>PAN: {prof.documents.panNumber || 'N/A'}</p>
                              <p>Voter ID: {prof.documents.voterId || 'N/A'}</p>
                              <p>Experience Proof: {prof.documents.experienceCertificate || 'N/A'}</p>
                            </>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                  {prof.applicationStatus && prof.applicationStatus !== 'approved' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateProfessorStatus(prof.id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateProfessorStatus(prof.id, 'pending')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Needs edits
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">All checks completed.</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-calm-blue">All Sessions</h2>
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
                      Client ID: {session.clientId} | Professor ID:{' '}
                      {session.professorId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      session.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : session.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-calm-blue">
                Content Management
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {content.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg text-calm-blue">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-calm-green/20 rounded text-sm">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


