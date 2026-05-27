import { useEffect, useMemo, useState } from "react";
import { Globe, Link } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

function getInitials(name) {
  return String(name || "Judge")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getExpertiseTags(expertise) {
  return String(expertise || "")
    .split(/[,;\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function JudgeAvatar({ judge }) {
  const [failed, setFailed] = useState(false);

  if (judge.photo_url && !failed) {
    return (
      <img
        src={resolveAssetUrl(judge.photo_url)}
        alt={judge.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100"
      />
    );
  }

  return (
    <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-violet-50 text-xl font-black text-[#7C3AED] shadow-[0_18px_45px_rgba(124,58,237,0.14)] ring-1 ring-violet-100">
      {getInitials(judge.name)}
    </div>
  );
}

function JudgeCard({ judge }) {
  const tags = getExpertiseTags(judge.expertise);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex h-full flex-col rounded-[28px] border border-violet-100 bg-white/90 p-6 text-left shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
    >
      <div className="flex items-start gap-4">
        <JudgeAvatar judge={judge} />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black leading-tight text-slate-900">{judge.name}</h3>
          <p className="mt-2 text-sm font-bold text-[#7C3AED]">{judge.designation}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{judge.institution}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-fuchsia-400">{judge.judge_type}</p>
        </div>
      </div>
      {judge.speciality && <p className="mt-5 text-sm font-black text-[#514aa3]">{judge.speciality}</p>}
      {judge.bio && <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{judge.bio}</p>}
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-600">{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-5 flex gap-2 text-[#7C3AED]">
        {judge.linkedin_url && <a href={judge.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${judge.name} LinkedIn`}><Link size={18} /></a>}
        {judge.website_url && <a href={judge.website_url} target="_blank" rel="noreferrer" aria-label={`${judge.name} website`}><Globe size={18} /></a>}
      </div>
    </motion.article>
  );
}

function Judges() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/judges`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Judges unavailable")))
      .then((data) => {
        if (active) setJudges(data.items || []);
      })
      .catch(() => {
        if (active) setJudges([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredJudges = useMemo(() => judges.filter((judge) => judge.featured), [judges]);
  const gridJudges = featuredJudges.length ? judges.filter((judge) => !judge.featured) : judges;

  return (
    <motion.section
      id="judges"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Judging Panel</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Judges & Evaluators</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            Faculty, industry, research, sponsor, and external experts evaluating MedInnovate submissions.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">Loading judges...</div>
        ) : judges.length === 0 ? (
          <div className="mt-14 rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">
            Judge profiles are being finalized.
          </div>
        ) : (
          <>
            {featuredJudges.length > 0 && (
              <div className="mt-14 grid gap-5 lg:grid-cols-3">
                {featuredJudges.slice(0, 3).map((judge) => <JudgeCard key={judge.id} judge={judge} />)}
              </div>
            )}
            {gridJudges.length > 0 && (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {gridJudges.map((judge) => <JudgeCard key={judge.id} judge={judge} />)}
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}

export default Judges;
