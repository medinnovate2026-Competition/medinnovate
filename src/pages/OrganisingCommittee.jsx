import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
import { API_BASE_URL, resolveAssetUrl } from "../config";

export const committeeSectionMeta = {
  President: "Strategic leadership guiding Medinnovate's vision, partnerships, and execution.",
  "Organising Secretary": "The secretariat coordinating cross-organization planning and operational readiness.",
  "IT Cell": "Technology support for the digital systems, registration flow, and event operations.",
  "Organising Committee": "Core team members supporting coordination, communication, outreach, and delivery.",
};

export const committeeSectionOptions = Object.keys(committeeSectionMeta);

export const committeeSections = [
  {
    title: "President",
    description: committeeSectionMeta.President,
    members: [
      { name: "Abhishek Kashyap", role: "GAIMS President", email: "president@gaims.org", photo: abhishekKashyap },
      { name: "Oluwasola Victor", role: "CEO of BlueOzone", email: "blueozonehealth@gmail.com", photo: oluwasolaVictor },
    ],
  },
  {
    title: "Organising Secretary",
    description: committeeSectionMeta["Organising Secretary"],
    members: [
      { name: "Girik Subudhi", role: "Organising Secretary GAIMS", phone: "+918169011833", email: "giriksubudhi@gmail.com", photo: girikSubudhi },
      { name: "Sofiyullah Salaudeen", role: "Organising Secretary NiMSA", phone: "+2347038939481", email: "sofiyullahopeyemi@gmail.com", photo: sofiyullahSalaudeen },
      { name: "Elton M Mahulu", role: "Organising Secretary FAMSA", phone: "+255628049726", email: "mahuluelton007@gmail.com", photo: eltonMahulu },
      { name: "Ogunka Favour", role: "Organising Secretary BlueOzone Health", phone: "+2348052747225", email: "ogunkafavour@gmail.com", photo: ogunkaFavour },
    ],
  },
  {
    title: "IT Cell",
    description: committeeSectionMeta["IT Cell"],
    members: [
      { name: "Sushmit Morey", role: "IT Cell Lead", phone: "+917262842562", email: "itd@gaims.org", photo: sushmitMorey },
      { name: "Laksh", role: "IT Cell Member", phone: "+917988025670", email: "Laksh0360@gmail.com", photo: laksh },
      { name: "Hardik Murari", role: "IT Cell Member", phone: "+918057596073", email: "hardik.murari.md@gmail.com", photo: hardikMurari },
    ],
  },
  {
    title: "Organising Committee",
    description: committeeSectionMeta["Organising Committee"],
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

export function committeeMemberId(sectionTitle, member) {
  return `${sectionTitle}-${member.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function flattenCommitteeSections(sections = committeeSections) {
  return sections.flatMap((section, sectionIndex) =>
    section.members.map((member, memberIndex) => ({
      ...member,
      id: member.id || committeeMemberId(section.title, member),
      section: member.section || section.title,
      order: member.order ?? sectionIndex * 100 + memberIndex,
    })),
  );
}

export function groupCommitteeMembers(members) {
  const titles = [
    ...committeeSectionOptions,
    ...members.map((member) => member.section).filter((section) => section && !committeeSectionOptions.includes(section)),
  ];

  return [...new Set(titles)].map((title) => ({
    title,
    description: committeeSectionMeta[title] || "The Medinnovate team members supporting this section.",
    members: members
      .filter((member) => member.section === title)
      .sort((first, second) => Number(first.display_order ?? first.order ?? 0) - Number(second.display_order ?? second.order ?? 0)),
  }));
}

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
  const photoUrl = member.photo_url || member.photo;
  const shouldShowImage = photoUrl && !hasImageError;

  if (shouldShowImage) {
    return (
      <img
        src={resolveAssetUrl(photoUrl)}
        alt={member.name}
        loading="lazy"
        onError={() => setHasImageError(true)}
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100 sm:h-28 sm:w-28"
      />
    );
  }

  return (
    <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-violet-50 text-xl font-black text-[#7C3AED] shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100 sm:h-28 sm:w-28">
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
          className="group/contact flex min-w-0 items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-violet-50 hover:text-[#7C3AED] hover:shadow-md"
          title={member.phone}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-sm">
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
          className="group/contact flex min-w-0 items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-violet-50 hover:text-[#7C3AED] hover:shadow-md"
          title={member.email}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-sm">
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
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex min-h-64 flex-col items-center justify-start overflow-hidden rounded-[28px] border border-violet-100 bg-white/90 p-7 text-center shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:border-fuchsia-200 hover:shadow-[0_28px_80px_rgba(236,72,153,0.16)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] opacity-90" />
      <div className="absolute inset-x-8 top-0 h-24 rounded-b-full bg-violet-50/80 blur-2xl transition group-hover:bg-fuchsia-50" />
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
    </motion.article>
  );
}

function SectionHeader({ subtitle, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative z-10 mx-auto mb-16 max-w-3xl text-center"
    >
      <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">
        {subtitle}
      </p>
      <h2 className="mb-5 text-3xl font-black tracking-tight text-[#111827] md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-slate-600">
        {description}
      </p>
    </motion.div>
  );
}

function CommitteeSection({ section }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute left-8 top-8 h-56 w-56 rounded-full bg-[#EC4899]/8 blur-3xl" />
      <div className="absolute bottom-8 right-8 h-60 w-60 rounded-full bg-[#7C3AED]/8 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <SectionHeader subtitle="Committee" title={section.title} description={section.description} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4"
        >
          {section.members.map((member) => (
            <motion.div
              key={member.name}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function LightNavbar() {
  const mainPageHref = (hash) => `${import.meta.env.BASE_URL}${hash}`;

  return (
    <nav
      className="fixed left-0 top-0 z-50 w-full border-b"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(255,255,255,0.72)",
        borderColor: "rgba(124,58,237,0.12)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="MedInnovate Logo"
            className="h-9 w-9 object-contain drop-shadow-md"
          />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-lg font-black tracking-tight text-transparent">Medinnovate</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
          <a href={mainPageHref("#about")} className="font-semibold transition hover:text-[#A855F7]">About</a>
          <a href={mainPageHref("#prizes")} className="font-semibold transition hover:text-[#A855F7]">Why Attend</a>
          <a href={mainPageHref("#participants")} className="font-semibold transition hover:text-[#A855F7]">Who Can Join</a>
          <a href={mainPageHref("#speakers")} className="font-semibold transition hover:text-[#A855F7]">Judges</a>
          <Link to="/organising-committee" className="font-semibold text-[#7C3AED] transition">Organising Committee</Link>
          <Link
            to="/registration"
            className="rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-5 py-2 font-black text-white shadow-[0_14px_34px_rgba(168,85,247,0.25)] transition hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

function OrganisingCommittee() {
  const [sections, setSections] = useState(() => groupCommitteeMembers(flattenCommitteeSections()));

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/organising-committee`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Committee unavailable")))
      .then((data) => {
        const items = data.items || [];
        if (active) setSections(groupCommitteeMembers(items.length ? items : flattenCommitteeSections()));
      })
      .catch(() => {
        if (active) setSections(groupCommitteeMembers(flattenCommitteeSections()));
      });

    return () => {
      active = false;
    };
  }, []);

  const gridStyle = {
    backgroundImage: "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#fbf9ff] font-sans text-slate-900 antialiased selection:bg-fuchsia-200 selection:text-slate-900" style={gridStyle}>
      <div className="relative z-10">
        <LightNavbar />
        <main>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative overflow-hidden border-t border-violet-100 bg-[#fbf9ff] px-4 pb-24 pt-32 shadow-sm sm:px-6 lg:px-8"
          >
            <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.05) 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
            <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-[#EC4899]/12 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#7C3AED]/12 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
              className="relative mx-auto max-w-7xl text-center"
            >
              <div className="mx-auto max-w-4xl">
                <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-violet-200 bg-white/75 px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-slate-700 shadow-[0_12px_34px_rgba(124,58,237,0.12)] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899] shadow-[0_0_16px_rgba(236,72,153,0.9)]" />
                  <span>Medinnovate 2026</span>
                </div>
                <h1 className="bg-gradient-to-r from-[#111827] via-[#7C3AED] to-[#EC4899] bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                  Organising Committee
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  The people coordinating Medinnovate across leadership, secretariat, technology, and operations.
                </p>
              </div>
            </motion.div>
          </motion.section>

          {sections.map((section) => (
            <CommitteeSection key={section.title} section={section} />
          ))}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default OrganisingCommittee;
