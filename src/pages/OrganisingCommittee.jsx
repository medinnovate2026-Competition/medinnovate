import { useState } from "react";
import { Link } from "react-router-dom";

import abhishekKashyap from "../OC/abhishekkashyap.jpeg";
import amritPundir from "../OC/Amrit Pundir .jpeg";
import awogbemiDamilola from "../OC/Awogbemi Damilola.jpeg";
import blessedOlaomo from "../OC/Blessed Olaomo.jpeg";
import collinsIkpeKennedy from "../OC/Collins-Ikpe Kennedy.jpeg";
import eltonMahulu from "../OC/Elton M Mahulu.jpeg";
import girikSubudhi from "../OC/girik.jpeg";
import hadiShaikh from "../OC/HadiShaikh.jpg";
import hardikMurari from "../OC/HardikMurari.jpeg";
import laksh from "../OC/laksh.jpeg";
import manasviMukherjee from "../OC/Manasvi Mukherjee.jpeg";
import ogunkaFavour from "../OC/Ogunka Favour .jpeg";
import okaforChioma from "../OC/Okafor Chioma Rosemary.png.jpg";
import oluwasolaVictor from "../OC/Oluwasola Victor.JPEG";
import sofiyullahSalaudeen from "../OC/Sofiyullah Salaudeen .jpeg";
import sushmitMorey from "../OC/sushmit.jpg";
import toluwaseOgundipe from "../OC/Toluwase O. Ogundipe.jpeg";
import wahidaAli from "../OC/Wahida Ali.jpeg";
import Footer from "../components/Footer";

const committeeSections = [
  {
    title: "Presidents",
    description: "Strategic leadership guiding Medinnovate's vision, partnerships, and execution.",
    members: [
      { name: "Abhishek Kashyap", role: "GAIMS President", email: "president@gaims.org", photo: abhishekKashyap },
      { name: "Oluwasola Victor", role: "CEO of BlueOzone", email: "blueozonehealth@gmail.com", photo: oluwasolaVictor },
    ],
  },
  {
    title: "Secretaries",
    description: "The secretariat coordinating cross-organization planning and operational readiness.",
    members: [
      { name: "Girik Subudhi", role: "Organising Secretary GAIMS", phone: "+918169011833", email: "giriksubudhi@gmail.com", photo: girikSubudhi },
      { name: "Sofiyullah Salaudeen", role: "Organising Secretary NiMSA", phone: "+2347038939481", email: "sofiyullahopeyemi@gmail.com", photo: sofiyullahSalaudeen },
      { name: "Elton M Mahulu", role: "Organising Secretary FAMSA", phone: "+255628049726", email: "mahuluelton007@gmail.com", photo: eltonMahulu },
      { name: "Ogunka Favour", role: "Organising Secretary BlueOzone Health", phone: "+2348052747225", email: "ogunkafavour@gmail.com", photo: ogunkaFavour },
    ],
  },
  {
    title: "IT Cell",
    description: "Technology support for the digital systems, registration flow, and event operations.",
    members: [
      { name: "Sushmit Morey", role: "IT Cell Lead", phone: "+917262842562", email: "itd@gaims.org", photo: sushmitMorey },
      { name: "Laksh", role: "IT Cell Member", phone: "+917988025670", email: "Laksh0360@gmail.com", photo: laksh },
      { name: "Hardik Murari", role: "IT Cell Member", phone: "+918057596073", email: "hardik.murari.md@gmail.com", photo: hardikMurari },
    ],
  },
  {
    title: "Organising Committee",
    description: "Core team members supporting coordination, communication, outreach, and delivery.",
    members: [
      { name: "Collins-Ikpe Kennedy", role: "Organising Committee Member", phone: "+2349054268369", email: "kennedycollinsikpe@gmail.com", photo: collinsIkpeKennedy },
      { name: "Wahida Ali", role: "Organising Committee Member", phone: "+255718961697", email: "wahaly04@gmail.com", photo: wahidaAli },
      { name: "Awogbemi Damilola", role: "Organising Committee Member", phone: "+2348148799692", email: "damiloawo@gmail.com", photo: awogbemiDamilola },
      { name: "Okafor Chioma Rosemary", role: "Organising Committee Member", phone: "+2349022354168", email: "bscrvo@gmail.com", photo: okaforChioma },
      { name: "Toluwase O. Ogundipe", role: "Organising Committee Member", phone: "+2348068674210", email: "itstoluwase@gmail.com", photo: toluwaseOgundipe },
      { name: "Blessed Olaomo", role: "Organising Committee Member", phone: "+2348169123249", email: "blessedolaomo@gmail.com", photo: blessedOlaomo },
      { name: "Amrit Pundir", role: "Organising Committee Member", phone: "+918630458367", email: "amritpun1317@gmail.com", photo: amritPundir },
      { name: "Manasvi Mukherjee", role: "Organising Committee Member", phone: "+917041689200", email: "manasvimukherjee02@gmail.com", photo: manasviMukherjee },
      { name: "Hadi Shaikh", role: "Organising Committee Member", phone: "+919870033700", email: "hadishaikh2310@gmail.com", photo: hadiShaikh },
    ],
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Avatar({ member }) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = member.photo && !hasImageError;

  if (shouldShowImage) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        onError={() => setHasImageError(true)}
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-slate-200 sm:h-28 sm:w-28"
      />
    );
  }

  return (
    <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-blue-50 text-xl font-black text-blue-700 shadow-md ring-1 ring-slate-200 sm:h-28 sm:w-28">
      {getInitials(member.name)}
    </div>
  );
}

function ContactLinks({ member }) {
  if (!member.phone && !member.email) {
    return null;
  }

  return (
    <div className="relative mt-5 grid w-full gap-2 border-t border-slate-100 pt-4 text-left">
      {member.phone && (
        <a
          href={`tel:${member.phone.replace(/\s+/g, "")}`}
          className="group/contact flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
          title={member.phone}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blue-700 text-white shadow-sm transition group-hover/contact:bg-blue-800">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.46.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2Z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Call</span>
            <span className="block truncate">{member.phone}</span>
          </span>
        </a>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="group/contact flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-blue-700 hover:shadow-md"
          title={member.email}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-sm">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.4 4.25-6.54 4.9a1.75 1.75 0 0 1-2.12 0L4.4 8.25A1 1 0 1 1 5.6 6.65L12 11.45l6.4-4.8a1 1 0 1 1 1.2 1.6Z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Email</span>
            <span className="block truncate">{member.email}</span>
          </span>
        </a>
      )}
    </div>
  );
}

function MemberCard({ member }) {
  return (
    <article className="group relative flex min-h-64 flex-col items-center justify-start overflow-hidden rounded-xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-cyan-400 to-indigo-500 opacity-80" />
      <div className="absolute inset-x-8 top-0 h-24 rounded-b-full bg-blue-50/80 blur-2xl transition group-hover:bg-cyan-50" />
      <div className="relative">
        <Avatar member={member} />
      </div>
      <h3 className="relative mt-5 text-xl font-bold leading-snug tracking-tight text-slate-900">
        {member.name}
      </h3>
      <p className="relative mt-3 max-w-48 text-sm font-medium leading-6 text-slate-600">
        {member.role}
      </p>
      <ContactLinks member={member} />
    </article>
  );
}

function SectionHeader({ subtitle, title, description }) {
  return (
    <div className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700">
        {subtitle}
      </p>
      <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}

function CommitteeSection({ section }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader subtitle="Committee" title={section.title} description={section.description} />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {section.members.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LightNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full border-b"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="MedInnovate Logo"
            className="h-9 w-9 object-contain drop-shadow-md"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">Medinnovate</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
          <Link to="/#about" className="font-medium transition hover:text-blue-700">About</Link>
          <Link to="/#why" className="font-medium transition hover:text-blue-700">Why Attend</Link>
          <Link to="/#features" className="font-medium transition hover:text-blue-700">Who Can Join</Link>
          <Link to="/#speakers" className="font-medium transition hover:text-blue-700">Judges</Link>
          <Link to="/organising-committee" className="font-medium text-blue-700 transition">Organising Committee</Link>
          <Link
            to="/register"
            className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

function OrganisingCommittee() {
  const gridStyle = {
    backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900 antialiased selection:bg-blue-200 selection:text-slate-900" style={gridStyle}>
      <div className="relative z-10">
        <LightNavbar />
        <main>
          <section className="relative overflow-hidden border-t border-slate-200 bg-slate-50 px-4 pb-24 pt-32 shadow-sm sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
            <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="relative mx-auto max-w-7xl text-center">
              <div className="mx-auto max-w-4xl">
                <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>Medinnovate 2026</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  Organising Committee
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  The people coordinating Medinnovate across leadership, secretariat, technology, and operations.
                </p>
              </div>
            </div>
          </section>

          {committeeSections.map((section) => (
            <CommitteeSection key={section.title} section={section} />
          ))}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default OrganisingCommittee;
