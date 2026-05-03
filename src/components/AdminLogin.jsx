import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Failed to connect to the backend server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md transition-all hover:shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
          Admin Portal
        </h2>
        {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-center text-sm font-medium">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">User ID</label>
            <input
              type="text" required value={adminId} onChange={(e) => setAdminId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all shadow-sm"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="w-full py-2.5 px-4 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold text-white transition-all shadow-sm hover:shadow-md">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;