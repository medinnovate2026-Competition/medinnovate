import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCard from './TeamCard';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('kanban');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin/login');

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/admin/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [navigate]);

  const handleVerify = async (teamIdentifier) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/admin/verify/${encodeURIComponent(teamIdentifier)}`, {
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

  const handleUpdateAbstract = async (teamIdentifier, url) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Optimistic update
      setTeams(prev => prev.map(t => (t.id === teamIdentifier || t.team_name === teamIdentifier) ? { ...t, abstract_url: url } : t));
      
      const response = await fetch(`${apiUrl}/admin/abstract/${encodeURIComponent(teamIdentifier)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ abstract_url: url })
      });
      
      if (!response.ok) alert('Failed to update abstract URL');
    } catch (err) {
      console.error(err);
      alert('Network error while saving abstract');
    }
  };

  const handleToggleShortlist = async (teamIdentifier, status) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Optimistic update
      setTeams(prev => prev.map(t => (t.id === teamIdentifier || t.team_name === teamIdentifier) ? { ...t, shortlisted: status } : t));
      
      const response = await fetch(`${apiUrl}/admin/shortlist/${encodeURIComponent(teamIdentifier)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shortlisted: status })
      });

      if (!response.ok) alert('Failed to update shortlist status');
    } catch (err) {
      console.error(err);
      alert('Network error while updating shortlist status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen bg-slate-50 text-blue-600 flex justify-center items-center text-xl font-bold tracking-widest uppercase">Initializing...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 text-red-500 flex justify-center items-center font-semibold">{error}</div>;

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          team.transaction_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          team.members?.[0]?.email?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = filterStatus === 'all' || team.payment_status === filterStatus || (filterStatus === 'pending' && team.payment_status !== 'verified');
    return matchesSearch && matchesStatus;
  });

  const pendingTeams = filteredTeams.filter(t => t.payment_status !== 'verified');
  const verifiedTeams = filteredTeams.filter(t => t.payment_status === 'verified');
  const shortlistedTeams = filteredTeams.filter(t => t.shortlisted);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 relative overflow-hidden">
      {/* Ambient soft background orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <button onClick={handleLogout} className="py-2 px-6 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-sm font-medium">Logout</button>
        </div>
        
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('kanban')} 
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-all border ${activeTab === 'kanban' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            Kanban Board
          </button>
          <button 
            onClick={() => setActiveTab('shortlisted')} 
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-all border ${activeTab === 'shortlisted' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            Phase 2: Shortlisted
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by Team Name, Leader Email, or UTR..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 transition-all appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Show: All Teams</option>
              <option value="verified">Show: Verified</option>
              <option value="pending">Show: Pending</option>
            </select>
          </div>
        </div>

        {activeTab === 'kanban' && (
          <div className="flex flex-nowrap gap-6 overflow-x-auto pb-8 items-start custom-scrollbar">
            <div className="w-full sm:w-[450px] flex-shrink-0 bg-slate-100/70 border border-slate-200 rounded-[2rem] p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest">Pending Payment</h2>
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{pendingTeams.length}</span>
              </div>
              {pendingTeams.map((team, index) => <TeamCard key={index} team={team} onVerify={handleVerify} onUpdateAbstract={handleUpdateAbstract} onToggleShortlist={handleToggleShortlist} />)}
              {pendingTeams.length === 0 && <p className="text-slate-500 text-center py-10">No pending teams.</p>}
            </div>

            <div className="w-full sm:w-[450px] flex-shrink-0 bg-blue-50/50 border border-blue-100 rounded-[2rem] p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-lg font-bold text-blue-700 uppercase tracking-widest">Verified / Phase 1</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{verifiedTeams.length}</span>
              </div>
              {verifiedTeams.map((team, index) => <TeamCard key={index} team={team} onVerify={handleVerify} onUpdateAbstract={handleUpdateAbstract} onToggleShortlist={handleToggleShortlist} />)}
              {verifiedTeams.length === 0 && <p className="text-slate-500 text-center py-10">No verified teams.</p>}
            </div>
          </div>
        )}

        {activeTab === 'shortlisted' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedTeams.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-slate-900">No teams shortlisted yet.</h3>
                <p className="text-slate-500 mt-2">Review verified teams in the Kanban board and mark them as shortlisted to see them here.</p>
              </div>
            ) : (
              shortlistedTeams.map((team, index) => <TeamCard key={index} team={team} onVerify={handleVerify} onUpdateAbstract={handleUpdateAbstract} onToggleShortlist={handleToggleShortlist} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;