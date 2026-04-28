import { useState } from "react";

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

const HIGHLIGHT_CARDS = [
  {
    icon: "🔧",
    title: "Hands-on Workshops",
    desc: "Interactive sessions on AI in diagnostics, surgical simulation, biotech innovations, and more.",
    accent: "cyan",
  },
  {
    icon: "🏅",
    title: "Competitions",
    desc: "Showcase your ideas in hackathons, case challenges, and innovation pitch competitions.",
    accent: "purple",
  },
  {
    icon: "🎤",
    title: "Speaker Sessions",
    desc: "Keynotes and panels by global healthcare leaders, researchers, and innovators.",
    accent: "cyan",
  },
  {
    icon: "🤝",
    title: "International Collaboration",
    desc: "Team up with participants worldwide for cross-cultural innovation projects.",
    accent: "purple",
  },
];

const SPEAKERS = [
  { emoji: "👩‍⚕️", name: "Dr. Sarah Chen", role: "AI in Diagnostics", org: "Stanford University", accent: "cyan" },
  { emoji: "👨‍🔬", name: "Prof. James Okafor", role: "Biotech Innovation", org: "Oxford University", accent: "purple" },
  { emoji: "👩‍💻", name: "Dr. Priya Sharma", role: "Digital Health", org: "AIIMS New Delhi", accent: "cyan" },
  { emoji: "👨‍⚕️", name: "Dr. Marcus Weber", role: "Surgical Robotics", org: "Charité Berlin", accent: "purple" },
];

const COLLABORATING_PARTNERS = [
  { name: "GAIMS", initials: "G", fullForm: "Global Association of Indian Medical Students" },
  { name: "FAMSA", initials: "F", fullForm: "Federation of African Medical Students Association" },
  { name: "BlueOzone", initials: "B", fullForm: "Blueozone" },
  { name: "NIMSA", initials: "N", fullForm: "Nigerian Medical Students Association" },
];

const HERO_HEADING_STYLE = {
  background: "linear-gradient(135deg,#fff 0%,#00dcff 50%,#7c3aed 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const SECTION_HEADING_STYLE = {
  display: "inline-block",
  background: "linear-gradient(135deg, #ffffff 0%, #00dcff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.01em",
};

const SOCIAL_LINKS = [
  { label: "Instagram", icon: "📸" },
  { label: "Twitter", icon: "🐦" },
  { label: "LinkedIn", icon: "💼" },
  { label: "Email", icon: "✉️" },
];

// ─────────────────────────────────────────────
// LOGO SVG
// ─────────────────────────────────────────────
function Logo({ size = 28, id = "logo" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke={`url(#${id})`} strokeWidth="2" />
      <path d="M9 14h10M14 9v10" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#00dcff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
function Navbar({ title, isDark, onToggleTheme }) {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 border-b"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: isDark ? "rgba(3,7,18,0.7)" : "rgba(255,255,255,0.7)",
        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo id="nav-logo" />
          <span className="font-bold text-lg tracking-tight">{title}</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
          <a href="#about" className="hover:text-cyan-400 transition">About</a>
          <a href="#why" className="hover:text-cyan-400 transition">Why Attend</a>
          <a href="#features" className="hover:text-cyan-400 transition">Highlights</a>
          <a href="#speakers" className="hover:text-cyan-400 transition">Speakers</a>
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition hover:text-cyan-400"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
            aria-label="Toggle theme"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium mb-8"
          style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.05)", color: "#00dcff", animation: "fade-up 0.8s ease-out both" }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
          <span>Global healthcare innovation hackathon</span>
        </div>

        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-4"
          style={{
            ...HERO_HEADING_STYLE,
            animation: "fade-up 0.8s 0.15s ease-out both",
          }}
        >
          {config.hero_title}
        </h1>

        <p
          className="text-xl sm:text-2xl font-light mb-4 tracking-wide"
          style={{ color: "rgba(103,232,249,0.8)", animation: "fade-up 0.8s 0.3s ease-out both" }}
        >
          {config.hero_tagline}
        </p>
        <p
          className="text-gray-400 max-w-xl mx-auto mb-10"
          style={{ animation: "fade-up 0.8s 0.45s ease-out both" }}
        >
          {config.hero_subtext}
        </p>

        <a
          href="#register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition hover:opacity-90 hover:scale-105"
          style={{ background: "linear-gradient(to right, #06b6d4, #9333ea)", animation: "fade-up 0.8s 0.45s ease-out both" }}
        >
          {config.cta_text} →
        </a>

        <div className="mt-16" style={{ animation: "fade-up 0.8s 0.45s ease-out both" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 mb-5">
            Collaborating Partners
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {COLLABORATING_PARTNERS.map(({ name, initials, fullForm }, index) => (
              <div
                key={name}
                className="partner-glow w-36 rounded-2xl border px-4 py-4 text-center"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(17,24,39,0.7)",
                  backdropFilter: "blur(16px)",
                  animationDelay: `${index * 0.45}s`,
                }}
              >
                <div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-bold"
                  style={{
                    borderColor: "rgba(6,182,212,0.28)",
                    background: "rgba(6,182,212,0.08)",
                    color: "#00dcff",
                  }}
                >
                  {initials}
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
          <h2
            className="text-4xl font-bold mb-6"
            style={SECTION_HEADING_STYLE}
          >
            {config.about_heading}
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">{config.about_text}</p>
          <div
            className="mb-6 rounded-2xl border p-5"
            style={{
              borderColor: "rgba(6,182,212,0.25)",
              background: "rgba(6,182,212,0.06)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#00dcff" }}>
              Phase 1: Online Screening
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">{config.about_phase_text}</p>
          </div>
          <div
            className="mb-6 rounded-2xl border p-5"
            style={{
              borderColor: "rgba(124,58,237,0.25)",
              background: "rgba(124,58,237,0.06)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#a78bfa" }}>
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
function WhyCard({ icon, title, desc, accent }) {
  const isCyan = accent === "cyan";
  return (
    <div
      className="rounded-2xl border p-6 text-center transition-all duration-300 cursor-default"
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        background: "rgba(17,24,39,0.8)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,220,255,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: isCyan ? "rgba(6,182,212,0.1)" : "rgba(124,58,237,0.1)" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function WhySection() {
  return (
    <section id="why" className="relative w-full py-24 px-6" style={{ background: "rgba(17,24,39,0.5)" }}>
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4" style={SECTION_HEADING_STYLE}>
          Why Attend?
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">Four compelling reasons to be part of MedInnovate 2.0</p>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WHY_CARDS.map((card) => <WhyCard key={card.title} {...card} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HIGHLIGHTS
// ─────────────────────────────────────────────
function HighlightCard({ icon, title, desc, accent }) {
  const isCyan = accent === "cyan";
  return (
    <div
      className="rounded-2xl border p-8 flex gap-5 items-start transition-all duration-300 cursor-default"
      style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(17,24,39,0.6)" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,220,255,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div
        className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl"
        style={{ background: isCyan ? "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))" : "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))" }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative w-full py-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4" style={SECTION_HEADING_STYLE}>
          Event Highlights
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">Explore what makes MedInnovate 2.0 an unforgettable experience</p>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {HIGHLIGHT_CARDS.map((card) => <HighlightCard key={card.title} {...card} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SPEAKERS
// ─────────────────────────────────────────────
function SpeakerCard({ emoji, name, role, org, accent }) {
  const isCyan = accent === "cyan";
  return (
    <div
      className="rounded-2xl border p-6 text-center transition-all duration-300 cursor-default"
      style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(17,24,39,0.8)" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,220,255,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div
        className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
        style={{ background: isCyan ? "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.2))" : "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))" }}
      >
        {emoji}
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-xs mt-1" style={{ color: isCyan ? "#00dcff" : "#a78bfa" }}>{role}</p>
      <p className="text-gray-600 text-xs mt-1">{org}</p>
    </div>
  );
}

function SpeakersSection() {
  return (
    <section id="speakers" className="relative w-full py-24 px-6" style={{ background: "rgba(17,24,39,0.5)" }}>
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4" style={SECTION_HEADING_STYLE}>
          Featured Speakers
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">Learn from pioneering voices in healthcare and technology</p>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SPEAKERS.map((s) => <SpeakerCard key={s.name} {...s} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// REGISTER CTA
// ─────────────────────────────────────────────
function RegisterSection({ config }) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleRegister = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <section id="register" className="relative w-full py-24 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05), transparent, rgba(124,58,237,0.05))" }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <div
          className="rounded-3xl border p-12 md:p-16"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(17,24,39,0.8)", backdropFilter: "blur(24px)" }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6"
            style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.05)", color: "#00dcff" }}
          >
            ⚡ Limited Seats Available
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={SECTION_HEADING_STYLE}
          >
            {config.register_heading}
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{config.register_subtext}</p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["Free for students", "Virtual access included", "Certificate provided"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                <span style={{ color: "#00dcff" }}>✔</span> {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleRegister}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-lg transition hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(to right, #06b6d4, #9333ea)" }}
          >
            Register Now →
          </button>

          {toastVisible && (
            <div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}
            >
              ✔ Registration link coming soon!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ footerOrg }) {
  return (
    <footer className="w-full py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#030712" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Logo id="footer-logo" size={22} />
              <span className="font-bold">MedInnovate 2.0</span>
            </div>
            <p className="text-gray-600 text-sm">
              Organized by <span style={{ color: "#00dcff" }}>{footerOrg}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, icon }) => (
              <a
                key={label}
                href="#"
                className="w-10 h-10 rounded-full border flex items-center justify-center transition hover:text-cyan-400"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "#6b7280" }}
                aria-label={label}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)"; e.currentTarget.style.color = "#00dcff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
              </a>
            ))}
          </div>

          <div className="text-center md:text-right text-gray-600 text-xs">
            <p>contact@medinnovate.org</p>
            <p className="mt-1">© 2025 MedInnovate. All rights reserved.</p>
          </div>
        </div>
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
  @keyframes partner-glow {
    0%, 100% { border-color: rgba(255,255,255,0.08); box-shadow: 0 0 0 rgba(0,220,255,0); transform: translateY(0); }
    18% { border-color: rgba(0,220,255,0.65); box-shadow: 0 0 28px rgba(0,220,255,0.28); transform: translateY(-3px); }
    36% { border-color: rgba(255,255,255,0.08); box-shadow: 0 0 0 rgba(0,220,255,0); transform: translateY(0); }
  }
  .partner-glow { animation: partner-glow 4.8s ease-in-out infinite; }
  a { text-decoration: none; color: inherit; }
`;

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("medinnovate-theme") !== "light");
  const [config] = useState(defaultConfig);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("medinnovate-theme", next ? "dark" : "light");
      return next;
    });
  };

  const bg = isDark ? "#030712" : "#fafafa";
  const textColor = isDark ? "#ffffff" : "#1f2937";

  const gridStyle = {
    backgroundImage: `linear-gradient(rgba(0,220,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        className="w-full min-h-full overflow-auto"
        style={{ backgroundColor: bg, color: textColor, scrollBehavior: "smooth", ...gridStyle }}
      >
        <Navbar title={config.hero_title} isDark={isDark} onToggleTheme={toggleTheme} />
        <HeroSection config={config} />
        <AboutSection config={config} />
        <WhySection />
        <FeaturesSection />
        <SpeakersSection />
        <RegisterSection config={config} />
        <Footer footerOrg={config.footer_org} />
      </div>
    </>
  );
}
