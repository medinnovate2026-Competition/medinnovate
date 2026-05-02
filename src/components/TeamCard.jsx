import React, { useState } from 'react';

const TeamCard = ({ team, onVerify, onUpdateAbstract, onToggleShortlist }) => {
  const leader = team.members && team.members.length > 0 ? team.members[0] : null;
  const members = team.members || [];
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [abstractUrl, setAbstractUrl] = useState(team.abstract_url || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className={`rounded-2xl p-5 border transition-all hover:-translate-y-1 hover:shadow-md ${team.shortlisted ? 'bg-purple-50/80 border-purple-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
      {/* Header section (always visible) */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h2 className="text-lg font-black text-slate-900">{team.team_name}</h2>
            {team.shortlisted && (
              <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
                Phase 2
              </span>
            )}
            {!team.shortlisted && team.payment_status === 'verified' && (
              <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
                Verified
              </span>
            )}
            {team.payment_status !== 'verified' && (
               <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
                 Pending
               </span>
            )}
          </div>
          {leader ? (
            <div className="text-xs text-slate-500 flex items-center">
              <span className="text-blue-700 bg-blue-50 border border-blue-200 font-bold rounded px-1.5 py-0.5 mr-2">LEADER</span>
              <span className="font-semibold text-slate-700 truncate max-w-[150px] sm:max-w-[200px]" title={leader.name}>{leader.name}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">No leader data.</div>
          )}
        </div>
      </div>

      {/* Action Buttons for Collapsed View */}
      {!isExpanded && (
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setIsExpanded(true)} 
            className="flex-1 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors border border-slate-200"
          >
            Expand
          </button>
          <button 
            onClick={() => onToggleShortlist && onToggleShortlist(team.id || team.team_name, !team.shortlisted)} 
            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${team.shortlisted ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700' : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'}`}
          >
            {team.shortlisted ? '★ Shortlisted' : 'Shortlist'}
          </button>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs text-slate-500">
              <span className="block mb-1 font-semibold uppercase tracking-wider">Leader Email</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-800">{leader?.email}</span>
                {leader?.email && (
                  <button onClick={() => copyToClipboard(leader.email)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Copy Email">
                    {copiedEmail === leader.email ? <span className="text-emerald-600 font-bold">✓</span> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">UTR / Ref</div>
              <div className="text-xs font-mono font-semibold text-slate-700 mb-2 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block">{team.transaction_ref || team.utr || "N/A"}</div>
              {team.payment_status !== 'verified' && (
                <button onClick={() => onVerify && onVerify(team.id || team.team_name)} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-all shadow-sm">Verify Payment</button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-2 py-1.5 font-bold">Name</th>
                  <th className="px-2 py-1.5 font-bold">College</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member, idx) => (
                  <tr key={idx} className="hover:bg-white transition-colors">
                    <td className="px-2 py-2 font-medium text-slate-800">{member.name}</td>
                    <td className="px-2 py-2 text-slate-600">{member.college}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1.5">Abstract Submission Link</label>
            <div className="flex gap-2">
              <input 
                type="url" 
                value={abstractUrl} 
                onChange={e => setAbstractUrl(e.target.value)} 
                placeholder="https://docs.google.com/..."
                className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
              <button onClick={() => onUpdateAbstract && onUpdateAbstract(team.id || team.team_name, abstractUrl)} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors text-[10px] font-bold border border-purple-200">
                Save
              </button>
            </div>
            {team.abstract_url && (
              <a href={team.abstract_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800 text-xs font-semibold underline decoration-blue-300 underline-offset-4 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Open Submitted Abstract
              </a>
            )}
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsExpanded(false)} 
              className="flex-1 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors border border-slate-200"
            >
              Collapse
            </button>
            <button 
              onClick={() => onToggleShortlist && onToggleShortlist(team.id || team.team_name, !team.shortlisted)} 
              className={`flex-[2] py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${team.shortlisted ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700' : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'}`}
            >
              {team.shortlisted ? '★ Shortlisted for Phase 2' : 'Mark as Shortlisted'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;