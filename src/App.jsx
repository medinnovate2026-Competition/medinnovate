import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PrizeReveal from "./components/PrizeReveal";
import AdminLogin from "../backend/AdminLogin";
import AdminDashboard from "../backend/AdminDashboard";
import ProtectedRoute from "../backend/ProtectedRoute";
import Register from "./pages/Register";


// ─────────────────────────────────────────────
// DATA / CONSTANTS
// ─────────────────────────────────────────────
const defaultConfig = {
  hero_title: "Medinnovate",
  hero_tagline: "Where Medicine Meets Innovation",
  hero_subtext: "A global platform bringing together future healthcare leaders and innovators",
  cta_text: "Register Now",
  about_heading: "About Medinnovate",
  about_text:
    "Medinnovate is an international healthcare innovation hackathon that brings together students and young professionals from diverse disciplines—medicine, public health, engineering, design, and social sciences—to collaboratively develop feasible, scalable, and impactful solutions to real-world healthcare challenges.",
  about_phase_text:
    "The event will be conducted in two phases. The first phase will be an online screening round, where after registration, all participating teams submit an abstract outlining the identified problem, proposed solution, basic feasibility, and potential impact.",
  about_phase_two_text:
    "The second phase will feature an offline Grand Finale, tentatively scheduled for late May or early June 2026 in India (exact date and venue to be announced). Shortlisted teams will present their final solutions through a PowerPoint presentation before an expert panel of judges. Participants unable to attend in person will have the option to present virtually, ensuring inclusivity and broader participation.",
  register_heading: "Join Medinnovate",
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
  { name: "GAIMS", initials: "G", fullForm: "Global Association of Indian Medical Students", logo: "https://i.postimg.cc/4xG9vbL9/GAIMSLogo.png", link: "https://gaims.org/" },
  { name: "FAMSA", initials: "F", fullForm: "Federation of African Medical Students Association", logo: "https://i.postimg.cc/tCxTMZZM/FAMSA.jpg", link: "https://famsanet.org/" },
  { name: "Blue Ozone Health", initials: "B", fullForm: "Blue Ozone Health", logo: "https://i.postimg.cc/502y7sLH/Blue-Ozone.png", link: "https://placeholder-url.com" },
  { name: "NIMSA", initials: "N", fullForm: "Nigerian Medical Students Association", logo: "https://i.postimg.cc/50r4PbxV/NIMSA.png", link: "https://www.nimsa.ng/" },
];

const PREMIUM_BOX = "relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300";

function SectionHeader({ subtitle, title, description, className = "" }) {
  return (
    <div className={`relative max-w-3xl mx-auto text-center mb-16 z-10 ${className}`}>
      {subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 mb-3">{subtitle}</p>}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-5">
        {title}
      </h2>
      {description && <p className="text-slate-600 text-lg leading-relaxed">{description}</p>}
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
        backgroundColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
         <img
  src={`${import.meta.env.BASE_URL}logo.png`}
  alt="MedInnovate Logo"
  className="h-9 w-9 object-contain drop-shadow-md"
/>
          <span className="font-bold text-lg tracking-tight text-slate-900">{title}</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-700">
          <a href="#about" className="hover:text-blue-700 transition font-medium">About</a>
          <a href="#why" className="hover:text-blue-700 transition font-medium">Why Attend</a>
          <a href="#features" className="hover:text-blue-700 transition font-medium">Who Can Join</a>
          <a href="#speakers" className="hover:text-blue-700 transition font-medium">Judges</a>
          <a
            href="#register"
            className="px-5 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors shadow-sm"
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// LOGO SECTION
// ─────────────────────────────────────────────
function LogoSection() {
  return (
    <section id="home" className="sticky top-0 z-0 w-full flex items-center justify-center overflow-hidden bg-transparent" style={{ minHeight: "100vh" }}>
      {/* Glow lines */}
      {["20%", "50%", "80%"].map((left) => (
        <div key={left} className="absolute w-px h-full" style={{ left, background: "linear-gradient(180deg, transparent, rgba(59,130,246,0.15), transparent)" }} />
      ))}
      
      {/* Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(59,130,246,0.15)", animation: "float 6s ease-in-out infinite" }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.15)", animation: "float 7s ease-in-out 0.5s infinite reverse" }} />

      {/* Fancy Logo Presentation */}
      <div className="relative flex items-center justify-center z-10" style={{ animation: "fade-up 1s ease-out both" }}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full blur-[80px] bg-blue-400/30 animate-pulse pointer-events-none" />
        
        {/* Subtle Corporate Rings */}
        <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-slate-200 pointer-events-none" />
        <div className="absolute w-[28rem] h-[28rem] sm:w-[32rem] sm:h-[32rem] rounded-full border border-slate-100 pointer-events-none" />
        <div className="absolute w-[36rem] h-[36rem] sm:w-[42rem] sm:h-[42rem] rounded-full border border-slate-50 pointer-events-none" />
        
        {/* Floating Logo Box */}
        <div className="relative grid h-64 w-64 sm:h-80 sm:w-80 place-items-center rounded-[2.5rem] border border-slate-200 bg-white shadow-xl p-10 sm:p-14 animate-[float-logo_4s_ease-in-out_infinite]">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="MedInnovate Logo" 
            className="relative z-10 h-full w-full object-contain transition-transform duration-500" 
          />
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 z-10" style={{ animation: "fade-up 1s 1s ease-out both" }}>
        <div className="animate-bounce flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function HeroSection({ config }) {
  return (
    <header
      className="relative z-10 w-full flex items-center justify-center overflow-hidden pt-32 pb-24 bg-slate-50 border-t border-slate-200 shadow-sm"
    >
      {/* Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />

      {/* Scan line */}
      <div
        className="absolute left-0 w-full h-0.5 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)",
          animation: "scan-line 6s linear infinite",
        }}
      />

      {/* Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "rgba(59,130,246,0.15)", animation: "float 4s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "rgba(99,102,241,0.15)", animation: "float 5s ease-in-out 0.5s infinite" }}
      />

      {/* DNA helix */}
      <svg
        className="absolute right-10 top-1/3 opacity-20 hidden lg:block"
        width="80"
        height="200"
        viewBox="0 0 80 200"
        style={{ animation: "float 4s ease-in-out infinite" }}
      >
        <path d="M20 0 Q60 50 20 100 Q60 150 20 200" stroke="#3b82f6" fill="none" strokeWidth="2" />
        <path d="M60 0 Q20 50 60 100 Q20 150 60 200" stroke="#6366f1" fill="none" strokeWidth="2" />
        {[25, 50, 75, 125, 150, 175].map((y) => (
          <line key={y} x1={y % 50 === 25 ? 30 : 25} y1={y} x2={y % 50 === 25 ? 50 : 55} y2={y} stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
        ))}
      </svg>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">

        <div
          className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm mb-8"
          style={{ animation: "fade-up 0.8s 0.2s ease-out both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>Global healthcare innovation hackathon</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          style={{
            animation: "fade-up 0.8s 0.4s ease-out both",
          }}
        >
          {config.hero_title}
        </h1>

        <p
          className="text-xl sm:text-2xl font-semibold tracking-tight text-blue-800 mb-4"
          style={{ animation: "fade-up 0.8s 0.6s ease-out both" }}
        >
          {config.hero_tagline}
        </p>
        <p
          className="max-w-2xl mx-auto text-base leading-relaxed text-slate-600 sm:text-lg mb-10"
          style={{ animation: "fade-up 0.8s 0.8s ease-out both" }}
        >
          {config.hero_subtext}
        </p>

        <a
          href="#register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-blue-700 text-white font-semibold shadow-sm transition-colors hover:bg-blue-800"
          style={{ animation: "fade-up 0.8s 1.0s ease-out both" }}
        >
          {config.cta_text}
        </a>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// PARTNERS
// ─────────────────────────────────────────────
function PartnersSection() {
  return (
    <section id="partners" className="relative w-full py-24 px-6 bg-white">
      <SectionHeader subtitle="Partners" title="Collaboration Between" description="Supported by global organizations driving healthcare innovation." />
      <div className="relative max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
        {COLLABORATING_PARTNERS.map(({ name, initials, fullForm, logo, link }) => (
          <a
            key={name}
            href={link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`${PREMIUM_BOX} w-48 px-6 py-6 text-center group cursor-pointer block hover:border-blue-300`}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl font-bold overflow-hidden group-hover:scale-105 transition-transform duration-300"
            >
              {logo ? (
                <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-slate-400">{initials}</span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{name}</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500">{fullForm}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function AboutSection({ config }) {
  return (
    <section id="about" className="relative w-full py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 mb-3">Learn More About Medinnovate</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5">
            {config.about_heading}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-lg">{config.about_text}</p>
          <div
            className={`${PREMIUM_BOX} p-5 mb-4`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
              Phase 1: Online Screening
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">{config.about_phase_text}</p>
          </div>
          <div
            className={`${PREMIUM_BOX} p-5 mb-6`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Phase 2: Offline Grand Finale
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">{config.about_phase_two_text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Innovation", "Collaboration", "Global Exposure", "Technology"].map((tag, i) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md text-xs font-medium border border-slate-200 bg-white text-slate-700 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stethoscope illustration */}
        <div className="relative flex justify-center">
          <div className="relative w-64 h-64" style={{ animation: "float 4s ease-in-out infinite" }}>
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              <defs>
                <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="90" fill="url(#bg1)" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.3" />
              
              <path d="M30 100 L50 100 L60 70 L80 140 L95 85 L110 100 L170 100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              
              <rect x="75" y="35" width="8" height="12" rx="4" fill="#3b82f6" transform="rotate(-15 79 41)" />
              <rect x="117" y="35" width="8" height="12" rx="4" fill="#3b82f6" transform="rotate(15 121 41)" />
              <path d="M79 46 Q65 90 100 110" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
              <path d="M121 46 Q135 90 100 110" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
              <path d="M90 90 L110 90" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 110 L100 145 C100 170 130 170 130 145 L130 135" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              <circle cx="130" cy="125" r="12" fill="rgba(59,130,246,0.2)" stroke="#6366f1" strokeWidth="4" />
              <circle cx="130" cy="125" r="5" fill="#3b82f6" />
            </svg>
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(59,130,246,0.05)" }} />
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
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-xl text-slate-700 shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-400">
          0{index + 1}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

function WhySection() {
  return (
    <section id="why" className="relative w-full py-24 px-6 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.05), transparent 32%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.05), transparent 30%)" }} />
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
      <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative w-full py-24 px-6 bg-slate-50">
      <SectionHeader subtitle="Eligibility" title="Who Can Join" description="Participation is limited to students pursuing the medical field." />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {JOIN_CARDS.map((card) => <HighlightCard key={card.title} {...card} />)}
      </div>
      <p className="max-w-3xl mx-auto mt-8 rounded-lg border border-slate-200 bg-slate-50 px-6 py-4 text-center text-sm font-medium text-slate-700 shadow-sm">
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
    <section id="prerequisites" className="relative w-full overflow-hidden py-24 px-6 bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(59,130,246,0.05), transparent 28%), radial-gradient(circle at 85% 80%, rgba(99,102,241,0.05), transparent 30%)",
        }}
      />
      <SectionHeader subtitle="Requirements" title="Prerequisites" description="These requirements keep the hackathon focused, fair, and aligned with the public health theme." />
      <div className="relative max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PREREQUISITES.map(({ number, title, desc }) => (
          <article key={title} className={`${PREMIUM_BOX} p-8 flex flex-col min-h-[260px]`}>
            <div className="relative mb-8 flex items-center justify-between">
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                {number}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm leading-7 text-slate-600">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section id="speakers" className="relative w-full py-24 px-6 bg-slate-50">
      <SectionHeader subtitle="Experts" title="Esteemed Judges" description="Expert profiles and judging panel details are being finalized." />
      <div className={`${PREMIUM_BOX} max-w-3xl mx-auto p-12 text-center`}>
        <p className="text-2xl font-bold text-slate-900 mb-3">Speakers will be revealed soon</p>
        <p className="text-sm leading-7 text-slate-600">
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
    <section id="prizes" className="relative w-full overflow-hidden py-24 px-6 bg-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(59,130,246,0.05), transparent 30%), radial-gradient(circle at 78% 65%, rgba(99,102,241,0.05), transparent 32%)",
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
    <section id="event-flow" className="relative w-full py-24 px-6 overflow-hidden bg-slate-50">
      <SectionHeader subtitle="Timeline" title="Event Flow" description="Your journey from registration to the global stage." />

      <div className="max-w-4xl mx-auto relative">
        {/* Connecting Line */}
        <div 
          className="absolute left-[27px] md:left-1/2 top-8 bottom-8 w-1 -translate-x-1/2"
          style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.5) 100%)" }}
        />

        <div className="flex flex-col gap-12 relative z-10">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${isEven ? "md:flex-row-reverse" : ""}`}>
                <div className={`flex-1 w-full ${isEven ? "md:text-left" : "md:text-right"} pl-16 md:pl-0`}>
                  <div className={`${PREMIUM_BOX} p-8`}>
                    <span className={`text-xs font-semibold uppercase tracking-wider mb-2 block text-blue-700`}>
                      Step 0{index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <div className="absolute left-0 md:relative md:left-auto flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm bg-slate-100 z-10"
                     style={{ borderColor: "#ffffff" }}>
                  <span className="text-lg" role="img" aria-label={step.title}>{step.icon}</span>
                </div>
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
    q: "Is Medinnovate an online or offline event?",
    a: "Medinnovate follows a hybrid format. The initial phases are conducted online, while the Grand Finale will be held offline in India. Participants who cannot attend in person will have the option to present virtually."
  },
  {
    q: "Can I participate solo?",
    a: "No. Participation is strictly team-based.\nEach team must consist of exactly 3 members."
  },
  {
    q: "Who can participate?",
    a: "Only students currently pursuing medical degree are allowed."
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
    <section id="faq" className="relative w-full py-24 px-6 bg-slate-50">
      <SectionHeader subtitle="FAQ" title="Frequently Asked Questions" description="Got questions? We've got answers." />
      <div className="text-center mb-10">
        <button
          onClick={toggleAll}
          className="inline-flex items-center justify-center px-5 py-2 rounded-md border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
        >
          {isAllOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div key={index} className={`${PREMIUM_BOX} mb-3 flex flex-col w-full ${isOpen ? '!border-slate-300' : ''}`}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-all duration-300 outline-none"
              >
                <span className="font-semibold text-base text-slate-900 flex-1">{faq.q}</span>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-transform duration-300 ${isOpen ? "border-slate-400 text-slate-600 bg-slate-100" : "border-slate-200 text-slate-400"}`}
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
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
                  <div className="px-6 pb-6 pt-2">
                    <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
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
    <section id="register" className="relative w-full py-24 px-6 overflow-hidden bg-white">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.05), transparent, rgba(99,102,241,0.05))" }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <div className={`${PREMIUM_BOX} p-10 md:p-14 max-w-4xl mx-auto text-center border-slate-200`}>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 mb-3">Registration</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5">
            {config.register_heading}
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">{config.register_subtext}</p>

          <div className="mb-8 p-6 rounded-xl border max-w-sm mx-auto bg-slate-50 border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl text-slate-400 line-through font-medium">$10</span>
                <span className="text-5xl font-bold text-slate-900">$5</span>
                <span className="text-slate-500 font-medium">/ participant</span>
              </div>
              <div className="text-base font-semibold mt-1 flex items-center justify-center gap-2 text-slate-700">
                <span>Total</span>
                <span className="text-sm text-slate-400 line-through">$30</span>
                <span>$15 per team</span>
              </div>
              <div className="mt-2 inline-block rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Early Bird Discount
              </div>
              <div className="mt-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm">
                Opportunity to win a share of <span className="font-bold text-slate-900">the prize pool</span>
              </div>
            </div>
          </div>

          <button
  onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-sm transition-colors"
>
  Register Now
</button>

          <div className="mt-8 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-medium bg-slate-50 border-slate-200 text-slate-600"
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
    <footer className="w-full py-16 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & Organizers */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-9 w-9 object-contain filter brightness-0 invert" />
            <span className="font-bold text-xl text-white">Medinnovate</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            A global platform bringing together future healthcare leaders and innovators to solve real-world challenges.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/medinnovate_26?igsh=OW5mbWh5ZmdiaHd3&utm_source=qr" aria-label="Instagram" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="mailto:medinnovate2026@gmail.com" aria-label="Email" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24V3H0zm21.518 2L12 12.72 2.482 5h19.036zM2 19V6.52l10 8.333 10-8.333V19H2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400">
            <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
            <li><a href="#why" className="hover:text-blue-400 transition-colors">Why Attend</a></li>
            <li><a href="#event-flow" className="hover:text-blue-400 transition-colors">Event Flow</a></li>
            <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQs</a></li>
            <li><a href="#register" className="hover:text-blue-400 transition-colors">Register Now</a></li>
          </ul>
        </div>

        {/* Partners */}
        <div className="md:col-span-2">
          <h3 className="text-white font-semibold mb-4">Organizers & Partners</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {COLLABORATING_PARTNERS.map(({ name, fullForm }) => (
              <div key={name} className="flex flex-col">
                <span className="text-white font-medium text-sm">{name}</span>
                <span className="text-slate-500 text-xs mt-1 leading-relaxed">{fullForm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; font-family: 'Inter', sans-serif; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scan-line { 0%{top:-10%} 100%{top:110%} }
  @keyframes float-logo { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  a { text-decoration: none; color: inherit; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.02); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHiding ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      {/* Ambient Background Orbs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[100px] bg-blue-400/20 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-[100px] bg-indigo-400/20 animate-[float_6s_ease-in-out_infinite_1s]" />

      <div className="relative flex flex-col items-center mb-12 z-10">
        <div className="relative grid h-32 w-32 place-items-center rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden p-5 mb-8 animate-[float-logo_4s_ease-in-out_infinite]">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="relative z-10 h-full w-full object-contain" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-wider uppercase">
          Medinnovate
        </h1>
        
        <div className="flex items-center gap-3 mt-4">
          <p className="text-slate-500 tracking-[0.2em] text-xs sm:text-sm uppercase font-semibold">
            Loading Health Tech
          </p>
        </div>
      </div>

      {/* Loading Bar Container */}
      <div className="relative w-72 sm:w-96 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300 z-10">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 via-blue-400 to-blue-200 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Sparkle on the leading edge */}
        <div 
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white blur-[3px] transition-all duration-300 mix-blend-overlay"
          style={{ left: `calc(${progress}% - 4rem)` }}
        />
      </div>
      
      <div className="mt-6 flex items-center gap-3 z-10">
        <div className="text-blue-800 font-mono text-sm tracking-[0.2em] font-bold">
          {Math.floor(progress)}% 
        </div>
        <div className="h-px w-8 bg-blue-200" />
        <div className="text-indigo-600 font-mono text-xs tracking-[0.2em] animate-pulse font-bold">
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
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const bg = "#f8fafc";
  const textColor = "#0f172a";

  const gridStyle = {
    backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
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
        <LogoSection />
        <HeroSection config={config} />
        <PartnersSection />
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
    <Router basename="/medinnovate">
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
