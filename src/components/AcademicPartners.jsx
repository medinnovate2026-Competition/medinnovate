import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

function AcademicPartners() {
  const [partners, setPartners] = useState([]);
  const [expandedPartnerId, setExpandedPartnerId] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/academic-partners`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load academic partners.")))
      .then((data) => {
        console.log("GET /api/academic-partners response", data);
        if (active) setPartners(Array.isArray(data.items) ? data.items : []);
      })
      .catch((error) => {
        console.log("GET /api/academic-partners response", { error: error.message });
        if (active) setPartners([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="academic-partners" className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="absolute bottom-12 right-16 h-64 w-64 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mx-auto max-w-7xl text-center"
      >
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Academic Partners</p>
        <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#111827] sm:text-6xl">
          OUR ACADEMIC PARTNERS
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-xl text-slate-600 sm:text-2xl">
          Institutions supporting innovation, education, and academic collaboration.
        </p>

        {partners.length === 0 ? (
          <div className="mx-auto mt-16 max-w-xl rounded-[32px] border border-violet-100 bg-white/85 p-9 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
            <p className="text-lg font-black text-[#111827]">No academic partners added yet</p>
            <p className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-6 py-3 text-sm font-black text-white shadow-[0_18px_44px_rgba(168,85,247,0.25)]">
              Announcing soon
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner, index) => (
              <motion.article
                key={partner.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.2) }}
                className="group flex h-full flex-col rounded-[28px] border border-violet-100 bg-white/90 p-7 text-left shadow-[0_20px_60px_rgba(79,70,229,0.08)] transition hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-[0_28px_80px_rgba(236,72,153,0.16)]"
              >
                <button
                  type="button"
                  aria-expanded={expandedPartnerId === partner.id}
                  onClick={() => setExpandedPartnerId((currentId) => (currentId === partner.id ? null : partner.id))}
                  className="flex w-full flex-col items-center text-center outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                >
                  <span className="grid h-20 w-20 place-items-center rounded-3xl border border-violet-100 bg-white shadow-sm transition group-hover:scale-105">
                    {partner.logo_url ? (
                      <img src={resolveAssetUrl(partner.logo_url)} alt={`${partner.name} logo`} className="h-14 w-14 object-contain" />
                    ) : (
                      <span className="text-2xl font-black text-[#7C3AED]">{partner.name.slice(0, 1)}</span>
                    )}
                  </span>
                  <span className="mt-7 text-lg font-black text-[#111827]">{partner.name}</span>
                </button>
                <AnimatePresence initial={false}>
                  {expandedPartnerId === partner.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-5 text-base leading-7 text-slate-600">{partner.description}</p>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-black text-[#7C3AED] shadow-sm transition hover:border-fuchsia-200 hover:text-[#EC4899]"
                        >
                          Visit website
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default AcademicPartners;
