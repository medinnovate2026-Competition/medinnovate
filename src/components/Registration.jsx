import React, { useState } from "react";
import QRModal from "./QRModal";

const API_URL = import.meta.env.VITE_API_URL;

function Registration() {
  const [showQR, setShowQR] = useState(false);
  const [utr, setUtr] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [members, setMembers] = useState([
    { name: "", email: "", college: "", country: "" },
    { name: "", email: "", college: "", country: "" },
    { name: "", email: "", college: "", country: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!teamName.trim()) {
      setSubmitError("Please enter a team name.");
      return;
    }

    const filledMembers = members.filter((m) => m.name.trim() && m.email.trim());
    if (filledMembers.length === 0) {
      setSubmitError("Please fill in at least one team member's name and email.");
      return;
    }

    if (!utr.trim()) {
      setSubmitError("Please enter your UTR / Transaction ID after payment.");
      return;
    }

    if (!API_URL) {
      setSubmitError("API URL is not configured. Check your .env file (VITE_API_URL).");
      console.error("VITE_API_URL is undefined. Make sure .env has VITE_API_URL=http://localhost:5000 and you restarted Vite.");
      return;
    }

    const payload = {
      team_name: teamName.trim(),
      members: filledMembers,
      utr: utr.trim(),
    };

    console.log("Submitting to:", `${API_URL}/register-upi`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/register-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", response.status, data);

      if (response.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration fetch error:", error);
      setSubmitError("Network error — make sure the backend server is running on port 5000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="registration" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-400/15 via-white/[0.05] to-purple-500/15 p-8 text-center shadow-[0_0_90px_rgba(168,85,247,0.18)] sm:p-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white">
            Registration Successful!
          </h2>
          <p className="mt-4 text-slate-300">
            Your team <span className="text-white font-semibold">"{teamName}"</span> has been registered.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Pending verification from our team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-400/15 via-white/[0.05] to-purple-500/15 p-8 shadow-[0_0_90px_rgba(168,85,247,0.18)] sm:p-12">
        
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Registration & Pricing
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-6xl">
            Join the global innovation sprint.
          </h2>
        </div>

        {/* Pricing */}
        <div className="mx-auto mb-10 max-w-md rounded-3xl border border-purple-200/15 bg-[#09051A]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Registration Fee</p>
          <p className="mt-2 font-display text-6xl font-black text-white">$5</p>
          <p className="mt-2 text-sm text-slate-400">+ INR equivalent (₹429)</p>
        </div>

        <div className="space-y-6">

          {/* Team Name */}
          <div>
            <label className="block text-sm font-semibold text-fuchsia-200 mb-2">Team Name *</label>
            <input
              type="text"
              placeholder="Enter your team name"
              className="w-full px-4 py-3 rounded-xl bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-fuchsia-200">Team Members *</label>
            {members.map((member, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#09051A]/50 border border-purple-200/10">
                <h3 className="text-sm font-medium text-cyan-300 mb-3">Member {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="px-4 py-2 rounded-lg bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                    value={member.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="px-4 py-2 rounded-lg bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                    value={member.email}
                    onChange={(e) => handleChange(index, "email", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="College/Institution"
                    className="px-4 py-2 rounded-lg bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                    value={member.college}
                    onChange={(e) => handleChange(index, "college", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="px-4 py-2 rounded-lg bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                    value={member.country}
                    onChange={(e) => handleChange(index, "country", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Section */}
          <div className="p-6 rounded-xl bg-[#09051A]/50 border border-purple-200/10">
            <h3 className="text-lg font-semibold text-white mb-4">Payment</h3>
            <p className="text-sm text-slate-400 mb-4">
              Pay ₹429 via UPI to complete registration. Click the button below to show the QR code.
            </p>

            <button
              onClick={() => setShowQR(true)}
              className="w-full sm:w-auto inline-flex rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-9 py-3 text-sm font-black uppercase tracking-wide text-[#12091F] shadow-[0_0_42px_rgba(168,85,247,0.42)] transition hover:-translate-y-1"
            >
              Show Payment QR
            </button>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">UTR / Transaction ID *</label>
              <input
                type="text"
                placeholder="Enter UTR number after payment"
                className="w-full px-4 py-3 rounded-xl bg-[#09051A]/80 border border-purple-200/15 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠️ {submitError}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 px-9 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_42px_rgba(34,197,94,0.42)] transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Complete Registration"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Deadline: Announcing soon. Limited slots available for shortlisted mentorship.
          </p>
        </div>

        {showQR && <QRModal onClose={() => setShowQR(false)} />}
      </div>
    </section>
  );
}

export default Registration;