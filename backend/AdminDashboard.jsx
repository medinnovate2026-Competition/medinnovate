import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCard from './TeamCard';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'https://medinnovate-production.up.railway.app';
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController(); // ✅ Fix #4: cleanup guard

    const fetchTeams = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin/login');

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/teams`, { // ✅ Fix #1 & #2: consistent backticks, closed properly
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
      const response = await fetch(`${API_BASE_URL}/api/admin/verify/${encodeURIComponent(teamIdentifier)}`, {
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

  if (loading) return <div className="min-h-screen bg-slate-50 text-blue-700 font-semibold flex justify-center items-center">Loading Data...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 text-red-600 font-semibold flex justify-center items-center">{error}</div>;

  const uniqueCountries = [...new Set(teams.map(team => team.members?.[0]?.country || 'Unknown'))].sort();
  const filteredTeams = selectedCountry === 'All' 
    ? teams 
    : teams.filter(team => (team.members?.[0]?.country || 'Unknown') === selectedCountry);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Organizer Dashboard</h1>
          <div className="flex items-center gap-4">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="py-2 px-4 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <button onClick={handleLogout} className="py-2 px-6 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-sm transition-colors">Logout</button>
          </div>
        </div>
        <div className="space-y-8">
          {filteredTeams.length === 0
            ? <p className="text-slate-600 text-center text-lg mt-20">No teams registered yet.</p>
            : filteredTeams.map((team) => <TeamCard key={team.team_name} team={team} onVerify={handleVerify} />)} 
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;