import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const STEPS = [
  { number: 1, label: "Basic Info", icon: "✦" },
  { number: 2, label: "Team Details", icon: "⬡" },
  { number: 3, label: "Members", icon: "◈" },
  { number: 4, label: "Background", icon: "◉" },
  { number: 5, label: "Payment", icon: "⬢" },
];

const inputClass =
  "w-full bg-white border border-slate-300 rounded-md px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm shadow-sm";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

// Custom select using div so we can style it fully
function CustomSelect({ label, name, value, onChange, required = true, options }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col relative">
      <label className={labelClass}>
        {label} {required && <span className="text-red-400/70">*</span>}
      </label>
      <div
        className={`w-full bg-white border rounded-md px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-all shadow-sm ${
          open ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-300"
        } ${value ? "text-slate-900" : "text-slate-400"}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{value || "Select an option"}</span>
        <span className={`transition-transform duration-200 text-slate-400 ${open ? "rotate-180" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md overflow-hidden z-50 shadow-md">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange({ target: { name, value: opt } }); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 hover:text-slate-900 ${
                value === opt ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600"
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
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold border transition-colors ${
              currentStep === step.number
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : currentStep > step.number
                ? "border-slate-300 bg-slate-100 text-slate-600"
                : "border-slate-200 bg-white text-slate-400"
            }`}>
              {currentStep > step.number ? "✓" : step.icon}
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider hidden sm:block transition-colors ${
              currentStep === step.number ? "text-blue-600" : currentStep > step.number ? "text-slate-600" : "text-slate-400"
            }`}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 sm:w-12 h-px mb-5 transition-colors ${
              currentStep > step.number ? "bg-slate-300" : "bg-slate-200"
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
      const response = await fetch(`${API_BASE_URL}/api/register-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Response:", response.status, data);
      if (response.ok) { 
        setSubmitted(true); 
        setTimeout(() => {
          window.location.href = "https://chat.whatsapp.com/D2mQmGTXMEuHfZxsILfI0c";
        }, 2000);
      }
      else { setError(data.error || "Registration failed. Please try again."); }
    } catch (err) {
      console.error(err);
      setError("Network error — failed to connect to the backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{
        backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-4xl mx-auto mb-6 text-green-600 shadow-sm">✓</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete</h1>
          <p className="text-slate-600 mb-2">Team <span className="text-slate-900 font-semibold">"{form.teamName}"</span> has been registered.</p>
          <p className="text-slate-500 text-sm mb-6">
            Pending payment verification. We'll reach out to <span className="text-slate-700 font-medium">{form.email}</span> shortly.
          </p>
          <p className="text-slate-600 font-medium mb-6 animate-pulse">Redirecting you to our WhatsApp group...</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.href = "https://chat.whatsapp.com/D2mQmGTXMEuHfZxsILfI0c"}
              className="px-6 py-2.5 rounded-md bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] transition-colors shadow-sm">
              Join WhatsApp Group Manually
            </button>
            <button onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-md bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 relative overflow-hidden" style={{
      backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
      backgroundSize: "60px 60px"
    }}>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <button onClick={() => navigate("/")}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-6 flex items-center gap-2 mx-auto">
            ← Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Team Registration
          </h1>
          <p className="text-slate-600 text-sm">Please provide accurate details for all members.</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm relative">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">Basic Contact Info</h2>
              </div>
              <div className="space-y-5">
                <Field label="Your Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set} />
              </div>
              <p className="text-xs text-slate-500 mt-6">This email will be used for primary communication regarding the hackathon.</p>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">Team & Leader Details</h2>
              </div>
              <div className="space-y-5">
                <Field label="Team Name" name="teamName" placeholder="e.g. BioHackers United" value={form.teamName} onChange={set} />
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">— Team Leader</p>
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
                <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Member 1", fields: { name: "m1Name", email: "m1Email", college: "m1College", phone: "m1Phone" } },
                  { label: "Member 2", fields: { name: "m2Name", email: "m2Email", college: "m2College", phone: "m2Phone" } },
                ].map(({ label, numColor, borderColor, fields }, idx) => (
                  <div key={label} className={`p-6 rounded-xl bg-slate-50 border border-slate-200`}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold">{idx + 1}</span>
                      <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{label}</span>
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
                <h2 className="text-xl font-semibold text-slate-900">Academic Background</h2>
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
                  <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                    ⚠️ Medinnovate is open only to undergraduate medical students. Please verify eligibility before proceeding.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 5: Payment ── */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
              </div>

              {/* Fee box */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Registration Fee</p>
                <div className="flex items-baseline justify-center gap-3 mb-1">
                  <span className="text-2xl text-slate-400 line-through">$10</span>
                  <span className="text-4xl font-bold text-slate-900">$5</span>
                  <span className="text-slate-500 text-sm">/ participant</span>
                </div>
                <p className="text-slate-700 font-semibold mt-2">Total: $15 per team <span className="text-slate-400 line-through text-sm ml-1 font-normal">$30</span></p>
                <p className="text-slate-500 text-xs mt-1">≈ ₹429 per participant · ₹1,287 per team</p>
                <div className="mt-3 inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Early Bird Discount
                </div>
              </div>

              {/* Region picker */}
              <p className={labelClass}>Select your region to pay <span className="text-red-500">*</span></p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentRegion("india")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    paymentRegion === "india"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="text-2xl mb-2">🇮🇳</div>
                  <div className="text-sm font-semibold text-slate-900">India</div>
                  <div className="text-xs text-slate-500 mt-1">Pay via UPI</div>
                </button>
                <button
                  onClick={() => setPaymentRegion("nigeria")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    paymentRegion === "nigeria"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="text-2xl mb-2">🇳🇬</div>
                  <div className="text-sm font-semibold text-slate-900">Nigeria</div>
                  <div className="text-xs text-slate-500 mt-1">Pay via Paystack</div>
                </button>
              </div>

              {/* India payment */}
              {paymentRegion === "india" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Scan to Pay</p>
                    <div className="w-40 h-40 rounded-lg bg-white border border-slate-200 mx-auto flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={`${import.meta.env.BASE_URL}qr.png`}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                        onError={e => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML = '<p class="text-slate-400 text-xs p-4">Place your QR image at<br/><code>/public/qr.png</code></p>';
                        }}
                      />
                    </div>
                    <p className="text-slate-500 text-sm">Or pay manually to:</p>
                    <p className="text-slate-800 font-mono font-semibold text-sm mt-1">giriksubudhi-1@okhdfcbank</p>
                    <p className="text-slate-500 text-xs mt-3">After payment, enter your UTR number below</p>
                  </div>
                  <div>
                    <label className={labelClass}>UTR / Transaction ID <span className="text-red-500">*</span></label>
                    <input
                      type="text" placeholder="12-digit UTR number"
                      value={utr} onChange={e => setUtr(e.target.value)}
                      className={inputClass}
                    />
                    <p className="text-xs text-slate-500 mt-2">Find your UTR in your bank app after completing the UPI payment.</p>
                  </div>
                </div>
              )}

              {/* Nigeria payment */}
              {paymentRegion === "nigeria" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Pay via Paystack</p>
                    <div className="w-40 h-40 rounded-lg bg-white border border-slate-200 mx-auto flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={`${import.meta.env.BASE_URL}paystack-qr.png`}
                        alt="Paystack QR Code"
                        className="w-full h-full object-contain"
                        onError={e => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML = '<p class="text-slate-400 text-xs p-4">Place your QR image at<br/><code>/public/paystack-qr.png</code></p>';
                        }}
                      />
                    </div>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-4">
                      Secure your spot by completing the payment. Click the button below to proceed to the payment page.
                    </p>
                    <a
                      href="https://paystack.com/buy/medinnovate-20-dhnwdw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Pay Now
                    </a>
                    <p className="text-slate-500 text-xs mt-4">After payment, enter your Transaction ID below</p>
                  </div>
                  <div>
                    <label className={labelClass}>Transaction ID <span className="text-red-500">*</span></label>
                    <input
                      type="text" placeholder="Enter your Paystack reference"
                      value={utr} onChange={e => setUtr(e.target.value)}
                      className={inputClass}
                    />
                    <p className="text-xs text-slate-500 mt-2">Find your Transaction ID in your payment receipt after completing the transaction.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <span className="shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button onClick={back}
                className="px-6 py-2.5 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition text-sm font-medium shadow-sm">
                ← Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button onClick={next}
                className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="px-6 py-2.5 rounded-md bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Submitting..." : "Complete Registration ✓"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          By registering, you confirm all team members are undergraduate medical students. ·{" "}
          <a href="mailto:medinnovate2026@gmail.com" className="hover:text-blue-600 transition hover:underline">medinnovate2026@gmail.com</a>
        </p>
      </div>
    </div>
  );
}