import { useEffect, useMemo, useState } from "react";
import { AtSign, Globe, Link } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

function getInitials(name) {
  return String(name || "Speaker")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SpeakerAvatar({ speaker }) {
  const [failed, setFailed] = useState(false);

  if (speaker.photo_url && !failed) {
    return (
      <img
        src={resolveAssetUrl(speaker.photo_url)}
        alt={speaker.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100"
      />
    );
  }

  return (
    <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-violet-50 text-xl font-black text-[#7C3AED] shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100">
      {getInitials(speaker.name)}
    </div>
  );
}

function SpeakerCard({ speaker }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex h-full flex-col rounded-[28px] border border-violet-100 bg-white/90 p-6 text-left shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
    >
      <div className="flex items-start gap-4">
        <SpeakerAvatar speaker={speaker} />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black leading-tight text-slate-900">{speaker.name}</h3>
          <p className="mt-2 text-sm font-bold text-[#7C3AED]">{speaker.designation}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{speaker.institution}</p>
        </div>
      </div>
      {speaker.bio && <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-600">{speaker.bio}</p>}
      {(speaker.session_title || speaker.session_day || speaker.session_time || speaker.venue) && (
        <div className="mt-5 rounded-2xl bg-violet-50/70 p-4">
          {speaker.session_title && <p className="text-sm font-black text-[#514aa3]">{speaker.session_title}</p>}
          {speaker.session_description && <p className="mt-2 text-xs leading-5 text-slate-500">{speaker.session_description}</p>}
          <p className="mt-3 text-xs font-bold text-slate-500">
            {[speaker.session_day, speaker.session_time, speaker.venue].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
      <div className="mt-5 flex gap-2 text-[#7C3AED]">
        {speaker.linkedin_url && <a href={speaker.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${speaker.name} LinkedIn`}><Link size={18} /></a>}
        {speaker.instagram_url && <a href={speaker.instagram_url} target="_blank" rel="noreferrer" aria-label={`${speaker.name} Instagram`}><AtSign size={18} /></a>}
        {speaker.website_url && <a href={speaker.website_url} target="_blank" rel="noreferrer" aria-label={`${speaker.name} website`}><Globe size={18} /></a>}
      </div>
    </motion.article>
  );
}

function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/speakers`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Speakers unavailable")))
      .then((data) => {
        if (active) setSpeakers(data.items || []);
      })
      .catch(() => {
        if (active) setSpeakers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredSpeakers = useMemo(() => speakers.filter((speaker) => speaker.featured), [speakers]);
  const gridSpeakers = featuredSpeakers.length ? speakers.filter((speaker) => !speaker.featured) : speakers;
  const keynoteSpeakers = featuredSpeakers.slice(0, 3);

  return (
    <motion.section
      id="speakers"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#A855F7]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Experts</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Esteemed Speakers</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            Keynotes, sessions, and expert voices shaping the MedInnovate experience.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 rounded-[28px] bg-white/80 p-8 text-center text-sm font-black text-violet-300">Loading speakers...</div>
        ) : speakers.length === 0 ? (
          <div className="mt-14 rounded-[28px] bg-white/80 p-8 text-center text-sm font-black text-violet-300">
            Speaker profiles are being finalized.
          </div>
        ) : (
          <>
            {keynoteSpeakers.length > 0 && (
              <div className="mt-14 grid gap-5 lg:grid-cols-3">
                {keynoteSpeakers.map((speaker) => <SpeakerCard key={speaker.id} speaker={speaker} />)}
              </div>
            )}
            {gridSpeakers.length > 0 && (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {gridSpeakers.map((speaker) => <SpeakerCard key={speaker.id} speaker={speaker} />)}
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}

export default Speakers;
