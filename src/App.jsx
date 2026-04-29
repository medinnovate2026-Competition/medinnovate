import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PrizeReveal from "./components/PrizeReveal";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";


// ─────────────────────────────────────────────
// DATA / CONSTANTS
// ─────────────────────────────────────────────
const defaultConfig = {
  hero_title: "MedInnovate 2.0",
  hero_tagline: "Where Medicine Meets Innovation",
  hero_subtext: "A global platform bringing together future healthcare leaders and innovators",
  cta_text: "Register Now",
  about_heading: "About MedInnovate 2.0",
  about_text:
    "MedInnovate 2.0 is an international healthcare innovation hackathon that brings together students and young professionals from diverse disciplines—medicine, public health, engineering, design, and social sciences—to collaboratively develop feasible, scalable, and impactful solutions to real-world healthcare challenges.",
  about_phase_text:
    "The event will be conducted in two phases. The first phase will be an online screening round, where after registration, all participating teams submit an abstract outlining the identified problem, proposed solution, basic feasibility, and potential impact.",
  about_phase_two_text:
    "The second phase will feature an offline Grand Finale, tentatively scheduled for late May or early June 2026 in India (exact date and venue to be announced). Shortlisted teams will present their final solutions through a PowerPoint presentation before an expert panel of judges. Participants unable to attend in person will have the option to present virtually, ensuring inclusivity and broader participation.",
  register_heading: "Join MedInnovate 2.0",
  register_subtext:
    "Affordable registration with global access. Be part of the movement that's shaping the future of healthcare.",
  footer_org: "GAIMS",
};

const WHY_CARDS = [
  {
    icon: "🌍",
    title: "Global Networking",
    desc: "Connect with medical students, public health thinkers, engineers, designers, and young professionals across countries.",
    accent: "cyan",
  },
  {
    icon: "🎤",
    title: "Global Stage",
    desc: "Pitch your healthcare solution to an international audience and receive visibility beyond your local ecosystem.",
    accent: "purple",
  },
  {
    icon: "🏆",
    title: "Certification",
    desc: "Receive recognition for your participation and contribution to a real healthcare innovation challenge.",
    accent: "cyan",
  },
  {
    icon: "🧑‍🏫",
    title: "Mentorship",
    desc: "Refine your problem statement, feasibility, impact model, and final pitch with guidance from mentors and domain experts.",
    accent: "purple",
  },
];

const JOIN_CARDS = [
  {
    icon: "🩺",
    title: "Undergraduate Medical Students",
    desc: "Students currently pursuing an undergraduate medical degree are eligible to participate.",
    accent: "cyan",
  },
  {
    icon: "⚕️",
    title: "Medical Interns",
    desc: "Interns in the medical field can join and submit healthcare innovation ideas.",
    accent: "purple",
  },
];

const PREREQUISITES = [
  {
    number: "01",
    title: "Team of 3 is mandatory",
    desc: "Every submission must come from a team of exactly three members.",
  },
  {
    number: "02",
    title: "All members should be medicos",
    desc: "Each participant in the team must be from the medical field.",
  },
  {
    number: "03",
    title: "Theme: Public Health",
    desc: "Ideas should address a meaningful public health challenge.",
  },
  {
    number: "04",
    title: "Original and feasible idea",
    desc: "The solution must be your own concept and practical enough to be implemented.",
  },
];

const PRIZE_AMOUNTS = [
  { value: "1,000,000", currency: "Nigerian Naira", suffix: "NGN" },
  { value: "729.84", currency: "US Dollars", suffix: "USD" },
  { value: "69,057.27", currency: "Indian Rupees", suffix: "INR" },
];

const COLLABORATING_PARTNERS = [
  { name: "GAIMS", initials: "G", fullForm: "Global Association of Indian Medical Students", logo: "https://i.postimg.cc/4xG9vbL9/GAIMSLogo.png" },
  { name: "FAMSA", initials: "F", fullForm: "Federation of African Medical Students Association", logo: "https://i.postimg.cc/tCxTMZZM/FAMSA.jpg" },
  { name: "BlueOzone", initials: "B", fullForm: "Blueozone", logo: "https://i.postimg.cc/502y7sLH/Blue-Ozone.png" },
  { name: "NIMSA", initials: "N", fullForm: "Nigerian Medical Students Association", logo: "https://i.postimg.cc/50r4PbxV/NIMSA.png" },
];

const PREMIUM_BOX = "relative overflow-hidden rounded-[2rem] border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] shadow-2xl shadow-purple-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-300/40";

function SectionHeader({ subtitle, title, description, className = "" }) {
  return (
    <div className={`relative max-w-4xl mx-auto text-center mb-16 z-10 ${className}`}>
      {subtitle && <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200 mb-4">{subtitle}</p>}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] mb-6">
        {title}
      </h2>
      {description && <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>}
    </div>
  );
}



// ─────────────────────────────────────────────
// LOGO SVG
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
function Navbar({ title }) {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 border-b"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(3,7,18,0.7)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
         <img
  src="/logo.png"
  alt="MedInnovate Logo"
  className="h-9 w-9 object-contain"
/>
          <span className="font-bold text-lg tracking-tight">{title}</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#9ca3af" }}>
          <a href="#about" className="hover:text-cyan-400 transition">About</a>
          <a href="#why" className="hover:text-cyan-400 transition">Why Attend</a>
          <a href="#features" className="hover:text-cyan-400 transition">Who Can Join</a>
          <a href="#speakers" className="hover:text-cyan-400 transition">Judges</a>
          <a
            href="#register"
            className="px-4 py-2 rounded-full text-white font-medium text-xs transition hover:opacity-90"
            style={{ background: "linear-gradient(to right, #06b6d4, #9333ea)" }}
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function HeroSection({ config }) {
  return (
    <header
      className="relative w-full flex items-center justify-center overflow-hidden pt-20"
      style={{ minHeight: "100vh" }}
    >
      {/* Glow lines */}
      {["15%", "50%", "85%"].map((left) => (
        <div
          key={left}
          className="absolute w-px h-full"
          style={{
            left,
            background: "linear-gradient(180deg, transparent, rgba(0,220,255,0.2), transparent)",
          }}
        />
      ))}

      {/* Scan line */}
      <div
        className="absolute left-0 w-full h-0.5 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,220,255,0.2), transparent)",
          animation: "scan-line 6s linear infinite",
        }}
      />

      {/* Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "rgba(6,182,212,0.1)", animation: "float 4s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "rgba(124,58,237,0.1)", animation: "float 5s ease-in-out 0.5s infinite" }}
      />

      {/* DNA helix */}
      <svg
        className="absolute right-10 top-1/3 opacity-10 hidden lg:block"
        width="80"
        height="200"
        viewBox="0 0 80 200"
        style={{ animation: "float 4s ease-in-out infinite" }}
      >
        <path d="M20 0 Q60 50 20 100 Q60 150 20 200" stroke="#00dcff" fill="none" strokeWidth="2" />
        <path d="M60 0 Q20 50 60 100 Q20 150 60 200" stroke="#7c3aed" fill="none" strokeWidth="2" />
        {[25, 50, 75, 125, 150, 175].map((y) => (
          <line key={y} x1={y % 50 === 25 ? 30 : 25} y1={y} x2={y % 50 === 25 ? 50 : 55} y2={y} stroke="#fff" strokeWidth="1" opacity="0.3" />
        ))}
      </svg>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div
          className="inline-flex items-center gap-3 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-100 shadow-[0_0_34px_rgba(236,72,153,0.2)] mb-8"
          style={{ animation: "fade-up 0.8s ease-out both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_16px_rgba(244,114,182,0.9)]" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
          <span>Global healthcare innovation hackathon</span>
        </div>

        <h1
          className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00dcff] to-white bg-[length:200%_auto] drop-shadow-[0_0_28px_rgba(0,220,255,0.25)] mb-6"
          style={{
            animation: "fade-up 0.8s 0.15s ease-out both, gradient-shift 4s ease-in-out infinite",
          }}
        >
          {config.hero_title}
        </h1>

        <p
          className="text-xl sm:text-2xl font-semibold tracking-wide text-fuchsia-100 mb-4"
          style={{ color: "rgba(103,232,249,0.8)", animation: "fade-up 0.8s 0.3s ease-out both" }}
        >
          {config.hero_tagline}
        </p>
        <p
          className="max-w-2xl mx-auto text-base leading-8 text-violet-100/75 sm:text-lg mb-10"
          style={{ animation: "fade-up 0.8s 0.45s ease-out both" }}
        >
          {config.hero_subtext}
        </p>

        <a
          href="#register"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 text-[#12091F] font-black uppercase tracking-wide shadow-[0_0_42px_rgba(168,85,247,0.42)] transition hover:-translate-y-1 hover:shadow-[0_0_54px_rgba(236,72,153,0.45)]"
          style={{ animation: "fade-up 0.8s 0.45s ease-out both" }}
        >
          {config.cta_text}
        </a>

        <div className="mt-16" style={{ animation: "fade-up 0.8s 0.45s ease-out both" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 mb-5">
            Collaborating Partners
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {COLLABORATING_PARTNERS.map(({ name, initials, fullForm, logo }, index) => (
              <div
                key={name}
                className={`${PREMIUM_BOX} w-36 px-4 py-4 text-center`}
                style={{ animationDelay: `${index * 0.45}s` }}
              >
                <div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-bold overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  style={{
                    borderColor: "rgba(6,182,212,0.28)",
                    background: logo ? "#ffffff" : "rgba(6,182,212,0.08)",
                    color: "#00dcff",
                  }}
                >
                  {logo ? (
                    <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain p-1" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-200">{name}</div>
                <div className="mt-1 text-[11px] leading-4 text-gray-500">{fullForm}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function AboutSection({ config }) {
  return (
    <section id="about" className="relative w-full py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200 mb-4">About MedInnovate</p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] mb-6">
            {config.about_heading}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6 text-lg">{config.about_text}</p>
          <div
            className={`${PREMIUM_BOX} p-6 mb-6`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200 mb-2">
              Phase 1: Online Screening
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">{config.about_phase_text}</p>
          </div>
          <div
            className={`${PREMIUM_BOX} p-6 mb-6`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300 mb-2">
              Phase 2: Offline Grand Finale
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">{config.about_phase_two_text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Innovation", "Collaboration", "Global Exposure", "Technology"].map((tag, i) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs"
                style={{
                  border: `1px solid ${i % 2 === 0 ? "rgba(6,182,212,0.2)" : "rgba(124,58,237,0.2)"}`,
                  background: i % 2 === 0 ? "rgba(6,182,212,0.05)" : "rgba(124,58,237,0.05)",
                  color: i % 2 === 0 ? "#00dcff" : "#a78bfa",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Brain illustration */}
        <div className="relative flex justify-center">
          <div className="relative w-64 h-64" style={{ animation: "float 4s ease-in-out infinite" }}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00dcff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="90" fill="url(#bg1)" stroke="#00dcff" strokeWidth="0.5" opacity="0.5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3" />
              <path d="M80 60 Q60 50 55 70 Q45 85 60 95 Q55 110 65 120 Q70 135 90 130 Q100 140 110 130 Q130 135 135 120 Q145 110 140 95 Q155 85 145 70 Q140 50 120 60 Q110 50 100 55 Q90 50 80 60Z" fill="none" stroke="#00dcff" strokeWidth="1.5" opacity="0.6" />
              <path d="M100 55 L100 130" stroke="#7c3aed" strokeWidth="0.5" opacity="0.4" />
              <path d="M75 80 Q100 90 125 80" fill="none" stroke="#00dcff" strokeWidth="0.5" opacity="0.4" />
              <path d="M70 105 Q100 115 130 105" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.4" />
              <circle cx="80" cy="60" r="3" fill="#00dcff" opacity="0.8" />
              <circle cx="120" cy="60" r="3" fill="#7c3aed" opacity="0.8" />
              <circle cx="60" cy="95" r="2.5" fill="#00dcff" opacity="0.6" />
              <circle cx="140" cy="95" r="2.5" fill="#7c3aed" opacity="0.6" />
              <circle cx="90" cy="130" r="2.5" fill="#00dcff" opacity="0.6" />
              <circle cx="110" cy="130" r="2.5" fill="#7c3aed" opacity="0.6" />
              <circle cx="100" cy="75" r="2" fill="#fff" opacity="0.5" />
              <polyline points="30,165 60,165 70,150 80,180 90,155 100,165 130,165 140,165 150,145 160,185 170,165" fill="none" stroke="#00dcff" strokeWidth="1.5" opacity="0.4" />
            </svg>
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(6,182,212,0.05)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// WHY ATTEND CARD
// ─────────────────────────────────────────────
function WhyCard({ icon, title, desc, accent, index }) {
  return (
    <div className={`${PREMIUM_BOX} p-8 flex flex-col h-full cursor-default`}>
      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400/25 to-purple-400/20 text-2xl font-black text-fuchsia-100 shadow-[0_0_34px_rgba(168,85,247,0.2)]">
          {icon}
        </div>
        <span className="text-xs font-bold tracking-[0.18em] text-fuchsia-200/50">
          0{index + 1}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm leading-7 text-slate-400">{desc}</p>
    </div>
  );
}

function WhySection() {
  return (
    <section id="why" className="relative w-full py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, rgba(0,220,255,0.08), transparent 32%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.1), transparent 30%)" }} />
      <SectionHeader subtitle="Benefits" title="Why Attend?" description="A focused hackathon experience designed to give your idea visibility, expert input, and international credibility." />
      <div className="relative max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WHY_CARDS.map((card, index) => <WhyCard key={card.title} {...card} index={index} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HIGHLIGHTS
// ─────────────────────────────────────────────
function HighlightCard({ icon, title, desc, accent }) {
  return (
    <div className={`${PREMIUM_BOX} p-8 flex gap-5 items-start cursor-default`}>
      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-fuchsia-400/25 to-purple-400/20 text-fuchsia-100 shadow-[0_0_34px_rgba(168,85,247,0.2)]">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative w-full py-24 px-6">
      <SectionHeader subtitle="Eligibility" title="Who Can Join" description="Participation is limited to students pursuing the medical field." />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {JOIN_CARDS.map((card) => <HighlightCard key={card.title} {...card} />)}
      </div>
      <p className="max-w-3xl mx-auto mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-6 py-4 text-center text-sm font-semibold text-cyan-100">
        Only students pursuing the medical field are allowed. No other disciplines are eligible.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────
// SPEAKERS
// ─────────────────────────────────────────────
function PrerequisitesSection() {
  return (
    <section id="prerequisites" className="relative w-full overflow-hidden py-24 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(0,220,255,0.08), transparent 28%), radial-gradient(circle at 85% 80%, rgba(124,58,237,0.1), transparent 30%)",
        }}
      />
      <SectionHeader subtitle="Requirements" title="Prerequisites" description="These requirements keep the hackathon focused, fair, and aligned with the public health theme." />
      <div className="relative max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PREREQUISITES.map(({ number, title, desc }) => (
          <article key={title} className={`${PREMIUM_BOX} p-8 flex flex-col min-h-[260px]`}>
            <div className="relative mb-8 flex items-center justify-between">
              <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-fuchsia-200 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                {number}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-sm leading-7 text-slate-400">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section id="speakers" className="relative w-full py-24 px-6">
      <SectionHeader subtitle="Experts" title="Esteemed Judges" description="Expert profiles and judging panel details are being finalized." />
      <div className={`${PREMIUM_BOX} max-w-3xl mx-auto p-12 text-center`}>
        <p className="text-3xl font-bold text-white mb-4">Speakers will be revealed soon</p>
        <p className="text-sm leading-7 text-slate-400">
          Stay tuned for confirmed mentors and judges.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// REGISTER CTA
// ─────────────────────────────────────────────


function PrizesSection() {
  return (
    <section id="prizes" className="relative w-full overflow-hidden py-24 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(0,220,255,0.1), transparent 30%), radial-gradient(circle at 78% 65%, rgba(124,58,237,0.12), transparent 32%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto z-10">
        <PrizeReveal />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// EVENT FLOW
// ─────────────────────────────────────────────
function EventFlowSection() {
  const steps = [
    {
      title: "Registration",
      desc: "Sign up and form your team of three medical students.",
      icon: "📝"
    },
    {
      title: "Abstract Submission",
      desc: "Team leader receives a link to submit your healthcare innovation abstract.",
      icon: "🔗"
    },
    {
      title: "Review & Selection",
      desc: "Expert panel reviews abstracts to shortlist the most feasible and impactful ideas.",
      icon: "🔍"
    },
    {
      title: "Mentorship & Guidance",
      desc: "Selected teams receive expert guidance to refine their solutions and prepare for their pitch.",
      icon: "🤝"
    },
    {
      title: "Grand Finale",
      desc: "Present your final solution in India (Hybrid format: Offline & Online participation available).",
      icon: "🏆"
    }
  ];

  return (
    <section id="event-flow" className="relative w-full py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.05), transparent 60%)" }} />
      <SectionHeader subtitle="Timeline" title="Event Flow" description="Your journey from registration to the global stage." />

      <div className="max-w-4xl mx-auto relative">
        {/* Connecting Line */}
        <div 
          className="absolute left-[27px] md:left-1/2 top-8 bottom-8 w-1 -translate-x-1/2"
          style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.3) 0%, rgba(124,58,237,0.5) 100%)" }}
        />

        <div className="flex flex-col gap-12 relative z-10">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${isEven ? "md:flex-row-reverse" : ""}`}>
                
                {/* Content */}
                <div className={`flex-1 w-full ${isEven ? "md:text-left" : "md:text-right"} pl-16 md:pl-0`}>
                  <div className={`${PREMIUM_BOX} p-8`}>
                    <span className={`text-xs font-bold tracking-widest uppercase mb-2 block ${index >= 3 ? "text-purple-300" : "text-fuchsia-200"}`}>
                      Step 0{index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="absolute left-0 md:relative md:left-auto flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg bg-slate-900 z-10"
                     style={{ 
                       borderColor: index >= 3 ? "rgba(168,85,247,0.6)" : "rgba(236,72,153,0.6)",
                       boxShadow: index >= 3 ? "0 0 20px rgba(168,85,247,0.3)" : "0 0 20px rgba(236,72,153,0.3)"
                     }}>
                  <span className="text-2xl" role="img" aria-label={step.title}>{step.icon}</span>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
const FAQS = [
  {
    q: "Is MedInnovate 2.0 an online or offline event?",
    a: "MedInnovate 2.0 follows a hybrid format. The initial phases are conducted online, while the Grand Finale will be held offline in India. Participants who cannot attend in person will have the option to present virtually."
  },
  {
    q: "Can I participate solo?",
    a: "No. Participation is strictly team-based.\nEach team must consist of exactly 3 members."
  },
  {
    q: "Who can participate?",
    a: "The event is open to:\n• Medical students\n• Public health graduates\n• Engineering & design students\n• Social science professionals\n• Interns and young professionals\n\nAnyone interested in healthcare innovation is welcome."
  },
  {
    q: "Can team members be from different colleges or countries?",
    a: "Yes. Teams can be formed across different colleges, cities, or even countries.\nIn fact, international and cross-disciplinary collaboration is highly encouraged."
  },
  {
    q: "Is there any registration fee?",
    a: "Yes, the registration fee is $5 (or INR equivalent) per participant."
  },
  {
    q: "Will certificates be provided?",
    a: "Yes, all participants will receive a certificate, with additional recognition for shortlisted and winning teams."
  },
  {
    q: "What is the selection process?",
    a: "The event includes:\n• Registration\n• Idea submission\n• Screening & shortlisting\n• Mentorship (if applicable)\n• Final pitch"
  },
  {
    q: "What happens if I cannot attend the final round in person?",
    a: "Participants who are unable to attend the offline finale will have the option to present virtually, ensuring inclusivity."
  },
  {
    q: "What kind of ideas can we submit?",
    a: "You can submit innovative solutions addressing real-world healthcare challenges, including digital health, public health, medical technology, and accessibility."
  },
  {
    q: "How can I contact the team for support?",
    a: "You can reach out via:\n• Email\n• Instagram\n• WhatsApp"
  }
];

function FAQSection() {
  // Use an array to allow multiple items to be collapsed/expanded independently
  const [openIndices, setOpenIndices] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isAllOpen = openIndices.length === FAQS.length;

  const toggleAll = () => {
    if (isAllOpen) {
      setOpenIndices([]);
    } else {
      setOpenIndices(FAQS.map((_, i) => i));
    }
  };

  return (
    <section id="faq" className="relative w-full py-24 px-6">
      <SectionHeader subtitle="FAQ" title="Frequently Asked Questions" description="Got questions? We've got answers." />
      <div className="text-center mb-10">
        <button
          onClick={toggleAll}
          className="inline-flex items-center justify-center px-6 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105"
          style={{
            borderColor: "rgba(236,72,153,0.3)",
            background: "rgba(236,72,153,0.05)",
            color: "#fbcfe8"
          }}
        >
          {isAllOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div key={index} className={`${PREMIUM_BOX} mb-4 flex flex-col w-full !bg-gradient-to-br !from-white/[0.04] !to-white/[0.01] ${isOpen ? '!border-transparent !overflow-visible' : ''}`}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-all duration-300 group bg-transparent outline-none"
                style={{
                  boxShadow: isOpen ? "0 0 20px rgba(0, 220, 255, 0.3), inset 0 0 10px rgba(0, 220, 255, 0.15)" : "none",
                  border: isOpen ? "1px solid rgba(0, 220, 255, 0.6)" : "1px solid transparent",
                  borderRadius: isOpen ? "2rem 2rem 0 0" : "2rem",
                }}
              >
                <span className="font-medium text-base sm:text-lg text-white flex-1">{faq.q}</span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-transform duration-300 ${isOpen ? "border-[#00dcff] text-[#00dcff]" : "border-fuchsia-300/30 text-fuchsia-200"}`}
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              <div
                className="grid transition-all duration-300 ease-in-out w-full"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div 
                    className="px-6 pb-6 pt-5 transition-all duration-300"
                    style={{
                      boxShadow: isOpen ? "0 0 20px rgba(255, 136, 0, 0.3), inset 0 0 10px rgba(255, 136, 0, 0.15)" : "none",
                      border: isOpen ? "1px solid rgba(255, 136, 0, 0.6)" : "1px solid transparent",
                      borderTop: "none",
                      borderRadius: "0 0 2rem 2rem",
                    }}
                  >
                    <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RegistrationModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    teamName: '',
    teamLeaderName: '',
    teamLeaderEmail: '',
    teamLeaderPhone: '',
    country: '',
    teamLeaderCollege: '',
    m1Name: '',
    m1Email: '',
    m1College: '',
    m1Phone: '',
    m2Name: '',
    m2Email: '',
    m2College: '',
    m2Phone: '',
    participatedBefore: '',
    enrolledInMedical: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration successfully submitted!");
    onClose();
  };

  const renderInput = (label, name, type = "text", required = true) => (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-fuchsia-200 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={formData[name]}
        onChange={handleChange}
        className="w-full bg-white/5 border border-purple-200/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/90 backdrop-blur-md p-4 sm:p-8">
      <div className="relative w-full max-w-3xl bg-[#09051A] border border-purple-200/15 rounded-[2rem] shadow-[0_0_80px_rgba(168,85,247,0.2)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-purple-200/10 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff]">
            Registration - Step {step} of 4
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form id="reg-form" onSubmit={step === 4 ? handleSubmit : handleNext}>
            {step === 1 && (
              <div className="animate-fade-up">
                <h4 className="text-xl font-bold text-white mb-6">Basic Info</h4>
                {renderInput("Email", "email", "email")}
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-up">
                <h4 className="text-xl font-bold text-white mb-6">Team Details</h4>
                {renderInput("Team Name", "teamName")}
                {renderInput("Team Leader Name", "teamLeaderName")}
                {renderInput("Team Leader Email ID", "teamLeaderEmail", "email")}
                {renderInput("Team Leader Phone Number (with country code and active WhatsApp)", "teamLeaderPhone", "tel")}
                {renderInput("Country", "country")}
                {renderInput("Team Leader: College/University Name", "teamLeaderCollege")}
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-up">
                <h4 className="text-xl font-bold text-white mb-6">Team Members Details</h4>
                <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="text-lg font-semibold text-cyan-200 mb-5">Member 1</h5>
                  {renderInput("Full Name", "m1Name")}
                  {renderInput("Email", "m1Email", "email")}
                  {renderInput("Institute/College", "m1College")}
                  {renderInput("Phone Number (with country code and active WhatsApp)", "m1Phone", "tel")}
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="text-lg font-semibold text-cyan-200 mb-5">Member 2</h5>
                  {renderInput("Full Name", "m2Name")}
                  {renderInput("Email", "m2Email", "email")}
                  {renderInput("Institute/College", "m2College")}
                  {renderInput("Phone Number (with country code and active WhatsApp)", "m2Phone", "tel")}
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="animate-fade-up">
                <h4 className="text-xl font-bold text-white mb-6">Academic & Background Info</h4>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-fuchsia-200 mb-2">
                    Have you participated in Ideathons before? <span className="text-red-400">*</span>
                  </label>
                  <select name="participatedBefore" required value={formData.participatedBefore} onChange={handleChange} className="w-full bg-[#0a061c] border border-purple-200/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors">
                    <option value="" disabled>Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-fuchsia-200 mb-2">
                    Are all team members currently enrolled in an undergraduate medical (MBBS or equivalent) program? <span className="text-red-400">*</span>
                  </label>
                  <select name="enrolledInMedical" required value={formData.enrolledInMedical} onChange={handleChange} className="w-full bg-[#0a061c] border border-purple-200/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition-colors">
                    <option value="" disabled>Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-purple-200/10 flex justify-between bg-white/[0.02] rounded-b-[2rem]">
          {step > 1 ? <button type="button" onClick={handleBack} className="px-6 py-2.5 rounded-full border border-purple-200/20 text-white font-medium hover:bg-white/5 transition">Back</button> : <div></div>}
        <button type="submit" form="reg-form" className="px-8 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 text-[#12091F] font-black tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform">{step === 4 ? "Submit" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}

function RegisterSection({ config }) {
  const navigate = useNavigate();
  return (
    <section id="register" className="relative w-full py-24 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05), transparent, rgba(124,58,237,0.05))" }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <div className={`${PREMIUM_BOX} p-12 md:p-16 max-w-4xl mx-auto text-center`}>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200 mb-4">Registration</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            {config.register_heading}
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto text-lg leading-relaxed">{config.register_subtext}</p>

          <div className="mb-8 p-6 rounded-2xl border max-w-sm mx-auto" style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.05)", boxShadow: "0 10px 30px rgba(124,58,237,0.1)" }}>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl text-gray-500 line-through font-medium">$10</span>
                <span className="text-5xl font-extrabold text-white">$5</span>
                <span className="text-gray-400 font-medium">/ participant</span>
              </div>
            <div className="text-lg font-semibold mt-1 flex items-center justify-center gap-2" style={{ color: "#00dcff" }}>
              <span>Total</span>
              <span className="text-sm text-gray-500 line-through">$30</span>
              <span>$15 per team</span>
            </div>
            <div className="mt-2 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Early Bird Discount
              </div>
              <div className="mt-3 text-sm text-gray-200 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                🏆 Opportunity to win a share of <span className="font-bold text-white">$729</span>
              </div>
            </div>
          </div>

          <button
  onClick={() => navigate('/register')}
  className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 text-[#12091F] font-black uppercase tracking-wide shadow-[0_0_42px_rgba(168,85,247,0.42)] transition hover:-translate-y-1 hover:shadow-[0_0_54px_rgba(236,72,153,0.45)]"
>
  Register Now
</button>

          <div className="mt-8 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium"
              style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.05)", color: "#00dcff" }}
            >
              ⚡ Limited Seats Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="w-full py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#030712" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & Organizers */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="MedInnovate Logo" className="h-9 w-9 object-contain" />
            <span className="font-bold text-xl text-white">MedInnovate 2.0</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            A global platform bringing together future healthcare leaders and innovators to solve real-world challenges.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/medinnovate_26?igsh=OW5mbWh5ZmdiaHd3&utm_source=qr" aria-label="Instagram" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="mailto:medinnovate2026@gmail.com" aria-label="Email" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24V3H0zm21.518 2L12 12.72 2.482 5h19.036zM2 19V6.52l10 8.333 10-8.333V19H2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li><a href="#about" className="hover:text-cyan-400 transition-colors">About</a></li>
            <li><a href="#why" className="hover:text-cyan-400 transition-colors">Why Attend</a></li>
            <li><a href="#event-flow" className="hover:text-cyan-400 transition-colors">Event Flow</a></li>
            <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQs</a></li>
            <li><a href="#register" className="hover:text-cyan-400 transition-colors">Register Now</a></li>
          </ul>
        </div>

        {/* Partners */}
        <div className="md:col-span-2">
          <h3 className="text-white font-semibold mb-4">Organizers & Partners</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {COLLABORATING_PARTNERS.map(({ name, fullForm }) => (
              <div key={name} className="flex flex-col">
                <span className="text-white font-medium text-sm">{name}</span>
                <span className="text-gray-500 text-xs mt-1 leading-relaxed">{fullForm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 MedInnovate. All rights reserved.</p>
        <p>medinnovate2026@gmail.com</p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// GLOBAL STYLES (injected once)
// ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; font-family: 'Outfit', sans-serif; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scan-line { 0%{top:-10%} 100%{top:110%} }
  @keyframes float-logo { 0%,100%{transform:translateY(0) scale(1); box-shadow: 0 0 40px rgba(168,85,247,0.2);} 50%{transform:translateY(-10px) scale(1.05); box-shadow: 0 0 80px rgba(0,220,255,0.5);} }
  @keyframes partner-glow {
    0%, 100% { border-color: rgba(255,255,255,0.08); box-shadow: 0 0 0 rgba(0,220,255,0); transform: translateY(0); }
    18% { border-color: rgba(0,220,255,0.65); box-shadow: 0 0 28px rgba(0,220,255,0.28); transform: translateY(-3px); }
    36% { border-color: rgba(255,255,255,0.08); box-shadow: 0 0 0 rgba(0,220,255,0); transform: translateY(0); }
  }
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .partner-glow { animation: partner-glow 4.8s ease-in-out infinite; }
  a { text-decoration: none; color: inherit; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 220, 255, 0.5); }
`;

// ─────────────────────────────────────────────
// INITIAL LOADER
// ─────────────────────────────────────────────
function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Simulates the loading of website assets
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.random() * 15 + 5;
        return next > 100 ? 100 : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Wait half a second after hitting 100% before triggering the fade-out
      const timeout = setTimeout(() => setIsHiding(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  useEffect(() => {
    if (isHiding) {
      // Wait for the CSS transition to finish before unmounting completely
      const timeout = setTimeout(onComplete, 800);
      return () => clearTimeout(timeout);
    }
  }, [isHiding, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHiding ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: "linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      {/* Ambient Background Orbs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[100px] bg-cyan-500/20 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-[100px] bg-purple-500/20 animate-[float_6s_ease-in-out_infinite_1s]" />

      <div className="relative flex flex-col items-center mb-12 z-10">
        <div className="relative grid h-32 w-32 place-items-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden p-5 mb-8 animate-[float-logo_4s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 animate-[spin_4s_linear_infinite]" />
          <img src="/logo.png" alt="MedInnovate Logo" className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00dcff] to-white bg-[length:200%_auto] animate-[gradient-shift_3s_ease-in-out_infinite] tracking-widest uppercase drop-shadow-[0_0_25px_rgba(0,220,255,0.4)]">
          MedInnovate 2.0
        </h1>
        
        <div className="flex items-center gap-3 mt-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-cyan-200/80 tracking-[0.4em] text-xs sm:text-sm uppercase font-bold">
            Loading Health Tech
          </p>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Loading Bar Container */}
      <div className="relative w-72 sm:w-96 h-2 bg-[#09051A] rounded-full overflow-hidden shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)] border border-white/5 z-10">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-white rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,220,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
        {/* Sparkle on the leading edge */}
        <div 
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white blur-[3px] transition-all duration-300 mix-blend-overlay"
          style={{ left: `calc(${progress}% - 4rem)` }}
        />
      </div>
      
      <div className="mt-6 flex items-center gap-3 z-10">
        <div className="text-cyan-200/60 font-mono text-sm tracking-[0.2em] font-medium">
          {Math.floor(progress)}% 
        </div>
        <div className="h-px w-8 bg-white/20" />
        <div className="text-purple-400/50 font-mono text-xs tracking-[0.2em] animate-pulse">
          SYSTEMS ONLINE
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
function LandingPage() {
  const [config] = useState(defaultConfig);
  <RegisterSection config={config} />
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const bg = "#030712";
  const textColor = "#ffffff";

  const gridStyle = {
    backgroundImage: `linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {!isAppLoaded && <InitialLoader onComplete={() => setIsAppLoaded(true)} />}
      <div
        className={`w-full min-h-full overflow-auto transition-opacity duration-1000 ${isAppLoaded ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}
        style={{ backgroundColor: bg, color: textColor, scrollBehavior: "smooth", ...gridStyle }}
      >
        <Navbar title={config.hero_title} />
        <HeroSection config={config} />
        <AboutSection config={config} />
        <WhySection />
        <FeaturesSection />
        <PrerequisitesSection />
        <SpeakersSection />
        <PrizesSection />
        <EventFlowSection />
        <RegisterSection config={config} onOpenRegister={() => setIsRegisterModalOpen(true)} />
        <FAQSection />
        <Footer footerOrg={config.footer_org} />
      </div>
      
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
