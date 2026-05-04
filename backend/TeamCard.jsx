import React, { useState } from 'react';

const TeamCard = ({ team, onVerify }) => {
  const leader = team.members[0];
  const members = team.members;
  const [copiedEmail, setCopiedEmail] = useState(null);

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
      <div className="mb-6 border-b border-slate-200 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">{team.team_name}</h2>
            {team.payment_status === 'verified' && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                Verified
              </span>
            )}
          </div>
          {leader ? (
            <div className="text-sm text-slate-600 flex items-center">
              <span className="text-blue-700 bg-blue-50 text-xs font-semibold border border-blue-200 rounded px-2 py-0.5 mr-3">Leader</span>
              <span className="font-medium text-slate-900">{leader.name}</span> <span className="mx-2 text-slate-300">|</span> {leader.email}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No members registered yet.</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-1">Transaction ID (transaction_ref)</div>
          <div className="text-sm font-mono text-slate-700 mb-2">{team.transaction_ref || "N/A"}</div>
          {team.payment_status !== 'verified' && (
            <button onClick={() => onVerify && onVerify(team.id || team.team_name)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors shadow-sm">Verify Payment</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 rounded-tl-md">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3 rounded-tr-md">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">{member.email}</span>
                    <button onClick={() => copyToClipboard(member.email)} className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors" title="Copy Email">
                      {copiedEmail === member.email ? (
                        <span className="text-emerald-600 text-xs font-bold">Copied!</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{member.phone || 'N/A'}</td>
                <td className="px-4 py-3 text-slate-600">{member.college}</td>
                <td className="px-4 py-3 text-slate-600">{member.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamCard;