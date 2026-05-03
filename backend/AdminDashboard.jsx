import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCard from './TeamCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://medinnovate-production.up.railway.app';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController(); // ✅ Fix #4: cleanup guard

    const fetchTeams = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin/login');

      try {
        const response = await fetch(`${API_BASE_URL}/admin/teams`, { // ✅ Fix #1 & #2: consistent backticks, closed properly
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('adminToken');
          return navigate('/admin/login');
        }

        const data = await response.json();
        if (response.ok) {
          setTeams(data);
        } else {
          setError(data.error || 'Failed to load teams');
        }
      } catch (err) {
        if (err.name !== 'AbortError') { // ignore cleanup-triggered aborts
          setError('Network error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();

    return () => controller.abort(); // cleanup on unmount
  }, [navigate]);

  const handleVerify = async (teamIdentifier) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify/${encodeURIComponent(teamIdentifier)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTeams((prevTeams) => prevTeams.map(team => (team.id === teamIdentifier || team.team_name === teamIdentifier) ? { ...team, payment_status: 'verified' } : team));
      } else {
        alert('Failed to verify payment');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen bg-[#0B1B2B] text-cyan-400 flex justify-center items-center">Loading Data...</div>;
  if (error) return <div className="min-h-screen bg-[#0B1B2B] text-red-400 flex justify-center items-center">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0B1B2B] text-[#E6F1FF] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Organizer Dashboard</h1>
          <button onClick={handleLogout} className="py-2 px-6 border border-cyan-500/50 hover:bg-cyan-900/30 rounded-md text-cyan-400 transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]">Logout</button>
        </div>
        <div className="space-y-8">
          {teams.length === 0
            ? <p className="text-gray-400 text-center text-lg mt-20">No teams registered yet.</p>
            : teams.map((team) => <TeamCard key={team.team_name} team={team} onVerify={handleVerify} />)} {/* ✅ Fix #3: stable key */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;