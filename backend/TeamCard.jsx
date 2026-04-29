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
    <div className="bg-[#122336] rounded-xl p-6 border border-cyan-500/20 shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
      <div className="mb-6 border-b border-gray-700/50 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-cyan-300">{team.team_name}</h2>
            {team.payment_status === 'verified' && (
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                Verified
              </span>
            )}
          </div>
          {leader ? (
            <div className="text-sm text-gray-300 flex items-center">
              <span className="text-purple-400 text-xs font-semibold border border-purple-500/30 rounded px-2 py-0.5 mr-3">Leader</span>
              {leader.name} <span className="mx-2 text-gray-600">|</span> {leader.email}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No members registered yet.</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Transaction ID (transaction_ref)</div>
          <div className="text-sm font-mono text-fuchsia-300 mb-2">{team.transaction_ref || "N/A"}</div>
          {team.payment_status !== 'verified' && (
            <button onClick={() => onVerify && onVerify(team.id || team.team_name)} className="bg-cyan-500 hover:bg-cyan-400 text-[#09051A] text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">Verify Payment</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#0B1B2B] text-cyan-400/80 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-md">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3 rounded-tr-md">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {members.map((member, idx) => (
              <tr key={idx} className="hover:bg-cyan-900/10 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-100">{member.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">{member.email}</span>
                    <button onClick={() => copyToClipboard(member.email)} className="text-cyan-500 hover:text-cyan-300 focus:outline-none transition-colors" title="Copy Email">
                      {copiedEmail === member.email ? (
                        <span className="text-green-400 text-xs font-bold">Copied!</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{member.phone || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-400">{member.college}</td>
                <td className="px-4 py-3 text-gray-400">{member.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamCard;