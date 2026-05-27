import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

const categoryLabels = {
  research: "Research Papers",
  poster: "Poster Presentation",
  innovation: "Innovation Pitch",
  case: "Case Presentation",
  oral: "Oral Presentation",
  other: "Custom Track",
};

function splitLines(value) {
  return String(value || "")
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function TrackCard({ track }) {
  const rules = splitLines(track.rules);
  const eligibility = splitLines(track.eligibility);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex h-full flex-col rounded-[28px] border border-violet-100 bg-white/90 p-6 shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">{categoryLabels[track.category] || track.category}</p>
          <h3 className="mt-3 text-2xl font-black leading-tight text-slate-900">{track.title}</h3>
        </div>
        {track.featured && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">Featured</span>}
      </div>
      {track.short_description && <p className="mt-5 text-sm leading-6 text-slate-600">{track.short_description}</p>}
      {track.full_description && <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500">{track.full_description}</p>}
      <div className="mt-5 grid gap-2 text-sm font-bold text-slate-600">
        {track.submission_deadline && <p>Deadline: {new Date(track.submission_deadline).toLocaleString()}</p>}
        {track.max_participants !== "" && <p>Max participants: {track.max_participants}</p>}
        {track.registration_fee !== "" && <p>Registration fee: ${Number(track.registration_fee).toFixed(2)}</p>}
      </div>
      {track.prizes && (
        <div className="mt-5 rounded-2xl bg-violet-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">Prizes</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{track.prizes}</p>
        </div>
      )}
      {(eligibility.length > 0 || rules.length > 0) && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {eligibility.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Eligibility</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-600">{eligibility.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {rules.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Rules</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-600">{rules.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
        </div>
      )}
      {track.judging_criteria && (
        <p className="mt-5 border-t border-violet-100 pt-4 text-sm leading-6 text-slate-500">{track.judging_criteria}</p>
      )}
    </motion.article>
  );
}

function CompetitionTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/competition`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Competition unavailable")))
      .then((data) => {
        if (active) setTracks(data.items || []);
      })
      .catch(() => {
        if (active) setTracks([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredTracks = useMemo(() => tracks.filter((track) => track.featured), [tracks]);
  const gridTracks = featuredTracks.length ? tracks.filter((track) => !track.featured) : tracks;

  return (
    <motion.section
      id="competition"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Competition</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Tracks & Categories</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            Research papers, poster presentations, innovation pitches, case presentations, and custom competition formats.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 rounded-[28px] bg-white/80 p-8 text-center text-sm font-black text-violet-300">Loading competition tracks...</div>
        ) : tracks.length === 0 ? (
          <div className="mt-14 rounded-[28px] bg-white/80 p-8 text-center text-sm font-black text-violet-300">
            Competition tracks are being finalized.
          </div>
        ) : (
          <>
            {featuredTracks.length > 0 && (
              <div className="mt-14 grid gap-5 lg:grid-cols-2">
                {featuredTracks.map((track) => <TrackCard key={track.id} track={track} />)}
              </div>
            )}
            {gridTracks.length > 0 && (
              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {gridTracks.map((track) => <TrackCard key={track.id} track={track} />)}
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}

export default CompetitionTracks;
