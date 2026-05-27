import { useEffect, useMemo, useState } from "react";
import { AtSign, Globe, Link } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

const tiers = [
  { value: "title", label: "Title Sponsors" },
  { value: "platinum", label: "Platinum Sponsors" },
  { value: "gold", label: "Gold Sponsors" },
  { value: "silver", label: "Silver Sponsors" },
  { value: "bronze", label: "Bronze Sponsors" },
  { value: "community", label: "Community Partners" },
  { value: "exhibitor", label: "Exhibitors" },
  { value: "support", label: "Supporting Organisations" },
];

function SponsorLogo({ sponsor, large = false }) {
  return (
    <div className={`${large ? "h-28 w-28 rounded-[28px]" : "h-20 w-20 rounded-3xl"} grid shrink-0 place-items-center border border-violet-100 bg-white p-3 shadow-sm`}>
      {sponsor.logo_url ? (
        <img src={resolveAssetUrl(sponsor.logo_url)} alt={`${sponsor.name} logo`} className="h-full w-full object-contain" loading="lazy" />
      ) : (
        <span className="text-2xl font-black text-[#7C3AED]">{sponsor.name.slice(0, 1)}</span>
      )}
    </div>
  );
}

function SponsorCard({ sponsor, featured = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`flex h-full flex-col rounded-[28px] border border-violet-100 bg-white/90 p-6 shadow-[0_18px_55px_rgba(124,58,237,0.08)] ${featured ? "lg:flex-row lg:items-center" : ""}`}
    >
      <div className="flex items-start gap-4">
        <SponsorLogo sponsor={sponsor} large={featured} />
        <div className="min-w-0">
          <h3 className="text-xl font-black leading-tight text-slate-900">{sponsor.name}</h3>
          {sponsor.booth_number && <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#EC4899]">Booth {sponsor.booth_number}</p>}
          {sponsor.description && <p className="mt-4 text-sm leading-6 text-slate-600">{sponsor.description}</p>}
        </div>
      </div>
      {sponsor.session_enabled && (sponsor.session_title || sponsor.session_description) && (
        <div className="mt-5 rounded-2xl bg-violet-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">Sponsor Session</p>
          {sponsor.session_title && <p className="mt-2 text-sm font-black text-[#514aa3]">{sponsor.session_title}</p>}
          {sponsor.session_description && <p className="mt-2 text-sm leading-6 text-slate-600">{sponsor.session_description}</p>}
        </div>
      )}
      <div className="mt-5 flex gap-2 text-[#7C3AED]">
        {sponsor.website_url && <a href={sponsor.website_url} target="_blank" rel="noreferrer" aria-label={`${sponsor.name} website`}><Globe size={18} /></a>}
        {sponsor.instagram_url && <a href={sponsor.instagram_url} target="_blank" rel="noreferrer" aria-label={`${sponsor.name} Instagram`}><AtSign size={18} /></a>}
        {sponsor.linkedin_url && <a href={sponsor.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${sponsor.name} LinkedIn`}><Link size={18} /></a>}
      </div>
    </motion.article>
  );
}

function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/sponsors`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Sponsors unavailable")))
      .then((data) => {
        if (active) setSponsors(data.items || []);
      })
      .catch(() => {
        if (active) setSponsors([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredSponsors = useMemo(() => sponsors.filter((sponsor) => sponsor.featured), [sponsors]);

  return (
    <motion.section
      id="sponsors"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Sponsors</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Sponsor Wall</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            Sponsors, exhibitors, partners, and supporting organisations powering the MedInnovate platform.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">Loading sponsors...</div>
        ) : sponsors.length === 0 ? (
          <div className="mt-14 rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">
            Sponsor announcements are coming soon.
          </div>
        ) : (
          <div className="mt-14 space-y-14">
            {featuredSponsors.length > 0 && (
              <section>
                <h3 className="text-center text-2xl font-black text-[#111827]">Featured Sponsors</h3>
                <div className="mt-7 grid gap-5 lg:grid-cols-2">
                  {featuredSponsors.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} featured />)}
                </div>
              </section>
            )}
            {tiers.map((tier) => {
              const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier.value);
              if (tierSponsors.length === 0) return null;

              return (
                <section key={tier.value}>
                  <h3 className="text-center text-2xl font-black text-[#111827]">{tier.label}</h3>
                  <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {tierSponsors.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} />)}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default Sponsors;
