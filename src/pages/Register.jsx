import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const STEPS = [
  { number: 1, label: "Basic Info", icon: "✦" },
  { number: 2, label: "Team Details", icon: "⬡" },
  { number: 3, label: "Members", icon: "◈" },
  { number: 4, label: "Background", icon: "◉" },
  { number: 5, label: "Payment", icon: "⬢" },
];

const inputClass =
  "w-full bg-[#0a061c] border border-purple-200/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(0,220,255,0.08)] transition-all duration-300 text-sm";

const labelClass = "block text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-300/80 mb-2";

// Custom select using div so we can style it fully
function CustomSelect({ label, name, value, onChange, required = true, options }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col relative">
      <label className={labelClass}>
        {label} {required && <span className="text-red-400/70">*</span>}
      </label>
      <div
        className={`w-full bg-[#0a061c] border rounded-xl px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-all duration-300 ${
          open ? "border-cyan-400/60 shadow-[0_0_20px_rgba(0,220,255,0.08)]" : "border-purple-200/20"
        } ${value ? "text-white" : "text-gray-600"}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{value || "Select an option"}</span>
        <span className={`transition-transform duration-300 text-gray-500 ${open ? "rotate-180" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e0920] border border-purple-200/20 rounded-xl overflow-hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange({ target: { name, value: opt } }); setOpen(false); }}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-white/5 hover:text-cyan-300 ${
                value === opt ? "text-cyan-300 bg-cyan-400/10" : "text-gray-300"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, value, onChange, required = true, as: As, options }) {
  if (As === "select") {
    return <CustomSelect label={label} name={name} value={value} onChange={onChange} required={required} options={options} />;
  }
  return (
    <div className="flex flex-col">
      <label className={labelClass}>
        {label} {required && <span className="text-red-400/70">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} className={inputClass}
      />
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
              currentStep === step.number
                ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_20px_rgba(0,220,255,0.4)]"
                : currentStep > step.number
                ? "border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-300"
                : "border-white/10 bg-white/5 text-gray-600"
            }`}>
              {currentStep > step.number ? "✓" : step.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
              currentStep === step.number ? "text-cyan-300" : currentStep > step.number ? "text-fuchsia-300/60" : "text-gray-600"
            }`}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 sm:w-12 h-px mb-5 transition-all duration-500 ${
              currentStep > step.number ? "bg-fuchsia-400/40" : "bg-white/10"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [utr, setUtr] = useState("");
  const [paymentRegion, setPaymentRegion] = useState(""); // "india" | "nigeria"

  const [form, setForm] = useState({
    email: "",
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    country: "",
    leaderCollege: "",
    m1Name: "", m1Email: "", m1College: "", m1Phone: "",
    m2Name: "", m2Email: "", m2College: "", m2Phone: "",
    participatedBefore: "",
    enrolledInMedical: "",
  });

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validateStep = () => {
    setError("");
    if (step === 1 && !form.email.trim()) { setError("Email is required."); return false; }
    if (step === 2) {
      if (!form.teamName.trim()) { setError("Team name is required."); return false; }
      if (!form.leaderName.trim()) { setError("Team leader name is required."); return false; }
      if (!form.leaderEmail.trim()) { setError("Team leader email is required."); return false; }
      if (!form.leaderPhone.trim()) { setError("Team leader phone is required."); return false; }
      if (!form.country.trim()) { setError("Country is required."); return false; }
      if (!form.leaderCollege.trim()) { setError("College name is required."); return false; }
    }
    if (step === 3) {
      if (!form.m1Name.trim() || !form.m1Email.trim()) { setError("Member 1 name and email are required."); return false; }
      if (!form.m2Name.trim() || !form.m2Email.trim()) { setError("Member 2 name and email are required."); return false; }
    }
    if (step === 4) {
      if (!form.participatedBefore) { setError("Please answer the ideathon question."); return false; }
      if (!form.enrolledInMedical) { setError("Please answer the medical enrollment question."); return false; }
    }
    if (step === 5) {
      if (!paymentRegion) { setError("Please select your payment region."); return false; }
      if (paymentRegion === "india" && !utr.trim()) { setError("Please enter your UTR / Transaction ID."); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!API_URL) { setError("API URL not configured. Check your .env file (VITE_API_URL)."); return; }

    setIsSubmitting(true);
    setError("");

    const members = [
      { name: form.leaderName, email: form.leaderEmail, college: form.leaderCollege, country: form.country },
      { name: form.m1Name,     email: form.m1Email,     college: form.m1College,     country: form.country },
      { name: form.m2Name,     email: form.m2Email,     college: form.m2College,     country: form.country },
    ];

    const payload = {
      team_name: form.teamName,
      members,
      utr: paymentRegion === "nigeria" ? "NIGERIA-PENDING" : utr.trim(),
    };

    console.log("Submitting:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${API_URL}/register-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Response:", response.status, data);
      if (response.ok) { setSubmitted(true); }
      else { setError(data.error || "Registration failed. Please try again."); }
    } catch (err) {
      console.error(err);
      setError("Network error — make sure your backend is running on port 5000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6" style={{
        backgroundImage: "linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }}>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-400/10 border-2 border-green-400/40 flex items-center justify-center text-5xl mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">✓</div>
          <h1 className="text-4xl font-black text-white mb-4">You're In!</h1>
          <p className="text-slate-400 mb-2">Team <span className="text-white font-bold">"{form.teamName}"</span> has been registered.</p>
          <p className="text-slate-500 text-sm mb-8">
            Pending payment verification. We'll reach out to <span className="text-cyan-400">{form.email}</span> shortly.
          </p>
          <button onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 text-[#12091F] font-black uppercase tracking-wide text-sm hover:-translate-y-1 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4" style={{
      backgroundImage: "linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)",
      backgroundSize: "60px 60px"
    }}>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-cyan-500/10 pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-purple-500/10 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <button onClick={() => navigate("/")}
            className="text-xs text-gray-500 hover:text-cyan-400 transition mb-6 flex items-center gap-2 mx-auto">
            ← Back to Home
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-300 mb-3">MedInnovate 2.0</p>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] mb-3">
            Team Registration
          </h1>
          <p className="text-slate-500 text-sm">Complete all 5 steps to secure your spot</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="rounded-[2rem] border border-purple-200/15 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur p-8 shadow-[0_0_80px_rgba(168,85,247,0.1)]">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-sm">✦</div>
                <h2 className="text-xl font-black text-white">Basic Info</h2>
              </div>
              <div className="space-y-5">
                <Field label="Your Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set} />
              </div>
              <p className="text-xs text-slate-600 mt-6">Used for all registration communications.</p>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-400/20 border border-fuchsia-400/40 flex items-center justify-center text-fuchsia-300 text-sm">⬡</div>
                <h2 className="text-xl font-black text-white">Team Details</h2>
              </div>
              <div className="space-y-5">
                <Field label="Team Name" name="teamName" placeholder="e.g. BioHackers United" value={form.teamName} onChange={set} />
                <div className="border-t border-white/5 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/60 mb-5">— Team Leader</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" name="leaderName" placeholder="Leader's full name" value={form.leaderName} onChange={set} />
                    <Field label="Email" name="leaderEmail" type="email" placeholder="leader@email.com" value={form.leaderEmail} onChange={set} />
                    <Field label="Phone (with country code + WhatsApp)" name="leaderPhone" type="tel" placeholder="+91 9999999999" value={form.leaderPhone} onChange={set} />
                    <Field label="Country" name="country" placeholder="e.g. India" value={form.country} onChange={set} />
                  </div>
                  <div className="mt-4">
                    <Field label="College / University Name" name="leaderCollege" placeholder="Full institution name" value={form.leaderCollege} onChange={set} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-purple-400/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-sm">◈</div>
                <h2 className="text-xl font-black text-white">Team Members</h2>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Member 1", numColor: "cyan",    borderColor: "border-cyan-400/10",    fields: { name: "m1Name", email: "m1Email", college: "m1College", phone: "m1Phone" } },
                  { label: "Member 2", numColor: "fuchsia", borderColor: "border-fuchsia-400/10", fields: { name: "m2Name", email: "m2Email", college: "m2College", phone: "m2Phone" } },
                ].map(({ label, numColor, borderColor, fields }, idx) => (
                  <div key={label} className={`p-6 rounded-2xl bg-white/[0.03] border ${borderColor}`}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-bold">{idx + 1}</span>
                      <span className="text-sm font-bold text-white/60 uppercase tracking-wider">{label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name"                              name={fields.name}    placeholder="Member's full name"   value={form[fields.name]}    onChange={set} />
                      <Field label="Email"                   type="email"   name={fields.email}   placeholder="member@email.com"     value={form[fields.email]}   onChange={set} />
                      <Field label="Institute / College"                    name={fields.college} placeholder="Institution name"      value={form[fields.college]} onChange={set} />
                      <Field label="Phone (with country code + WhatsApp)" type="tel" name={fields.phone} placeholder="+91 9999999999" value={form[fields.phone]} onChange={set} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4 ── */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-sm">◉</div>
                <h2 className="text-xl font-black text-white">Academic Background</h2>
              </div>
              <div className="space-y-6">
                <CustomSelect
                  label="Have you participated in Ideathons before?"
                  name="participatedBefore"
                  value={form.participatedBefore}
                  onChange={set}
                  options={["Yes", "No"]}
                />
                <CustomSelect
                  label="Are all team members currently enrolled in an undergraduate medical (MBBS or equivalent) program?"
                  name="enrolledInMedical"
                  value={form.enrolledInMedical}
                  onChange={set}
                  options={["Yes", "No"]}
                />
                {form.enrolledInMedical === "No" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    ⚠️ MedInnovate 2.0 is open only to undergraduate medical students. Please verify eligibility before proceeding.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 5: Payment ── */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 text-sm">⬢</div>
                <h2 className="text-xl font-black text-white">Payment</h2>
              </div>

              {/* Fee box */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-purple-200/15 text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Registration Fee</p>
                <div className="flex items-baseline justify-center gap-3 mb-1">
                  <span className="text-2xl text-gray-500 line-through">$10</span>
                  <span className="text-5xl font-black text-white">$5</span>
                  <span className="text-gray-400 text-sm">/ participant</span>
                </div>
                <p className="text-cyan-400 font-bold">Total: $15 per team <span className="text-gray-500 line-through text-sm ml-1">$30</span></p>
                <p className="text-slate-500 text-xs mt-1">≈ ₹429 per participant · ₹1,287 per team</p>
                <div className="mt-3 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Early Bird Discount
                </div>
              </div>

              {/* Region picker */}
              <p className={labelClass}>Select your payment region <span className="text-red-400/70">*</span></p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentRegion("india")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                    paymentRegion === "india"
                      ? "border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,220,255,0.15)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-2">🇮🇳</div>
                  <div className="text-sm font-bold text-white">India</div>
                  <div className="text-xs text-slate-500 mt-1">Pay via UPI</div>
                </button>
                <button
                  onClick={() => setPaymentRegion("nigeria")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                    paymentRegion === "nigeria"
                      ? "border-fuchsia-400/70 bg-fuchsia-400/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-2">🇳🇬</div>
                  <div className="text-sm font-bold text-white">Nigeria</div>
                  <div className="text-xs text-slate-500 mt-1">Coming soon</div>
                </button>
              </div>

              {/* India payment */}
              {paymentRegion === "india" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-cyan-400/15 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Scan to Pay</p>
                    {/* QR placeholder — replace src with your actual QR image */}
                    <div className="w-40 h-40 rounded-xl bg-white mx-auto flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src="/qr.png"
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                        onError={e => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML = '<p class="text-gray-400 text-xs p-4">Place your QR image at<br/><code>/public/qr.png</code></p>';
                        }}
                      />
                    </div>
                    <p className="text-slate-400 text-sm">Or pay manually to:</p>
                    <p className="text-cyan-300 font-mono font-bold text-base mt-1">giriksubudhi-1@okhdfcbank</p>
                    <p className="text-slate-600 text-xs mt-3">After payment, enter your UTR number below</p>
                  </div>
                  <div>
                    <label className={labelClass}>UTR / Transaction ID <span className="text-red-400/70">*</span></label>
                    <input
                      type="text" placeholder="12-digit UTR number"
                      value={utr} onChange={e => setUtr(e.target.value)}
                      className={inputClass}
                    />
                    <p className="text-xs text-slate-600 mt-2">Find your UTR in your bank app after completing the UPI payment.</p>
                  </div>
                </div>
              )}

              {/* Nigeria payment */}
              {paymentRegion === "nigeria" && (
                <div className="p-8 rounded-2xl bg-white/[0.03] border border-fuchsia-400/15 text-center">
                  <div className="text-4xl mb-4">🚧</div>
                  <h3 className="text-lg font-black text-white mb-2">Coming Soon</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Payment options for Nigeria are being set up. Please reach out to us directly to complete your registration.
                  </p>
                  <a href="mailto:medinnovate2026@gmail.com"
                    className="inline-block mt-4 px-6 py-2 rounded-full border border-fuchsia-400/30 text-fuchsia-300 text-sm font-bold hover:bg-fuchsia-400/10 transition">
                    Contact Us
                  </a>
                  <p className="text-slate-600 text-xs mt-4">You can still submit your registration — we'll follow up on payment.</p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
              <span className="shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
            {step > 1 ? (
              <button onClick={back}
                className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition text-sm font-medium">
                ← Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button onClick={next}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 text-[#12091F] font-black uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-white font-black uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Submitting..." : "Complete Registration ✓"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          By registering, you confirm all team members are undergraduate medical students. ·{" "}
          <a href="mailto:medinnovate2026@gmail.com" className="hover:text-cyan-400 transition">medinnovate2026@gmail.com</a>
        </p>
      </div>
    </div>
  );
}