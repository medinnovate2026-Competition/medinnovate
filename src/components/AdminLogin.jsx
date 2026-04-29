import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/admin/login`, {
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
      setError('Network error. Ensure the backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1B2B] text-[#E6F1FF]">
      <div className="bg-[#122336] p-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-cyan-500/30 w-full max-w-md transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-purple-500/50">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Admin Portal
        </h2>
        {error && <p className="text-red-400 mb-4 text-center text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-100">User ID</label>
            <input
              type="text" required value={adminId} onChange={(e) => setAdminId(e.target.value)}
              className="w-full px-4 py-2 bg-[#0B1B2B] border border-gray-600 rounded-md focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-100">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#0B1B2B] border border-gray-600 rounded-md focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="w-full py-2.5 px-4 mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-md font-semibold text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;