import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

const partnerSections = [
  { key: "academic", title: "Academic partners" },
  { key: "research", title: "Research partner" },
  { key: "innovation", title: "Innovation partner" },
  { key: "title", title: "Title partner" },
  { key: "knowledge", title: "Knowledge partner" },
  { key: "gergian_regional", title: "Gergian Regional Partner" },
  { key: "outreach", title: "Outreach Partner" },
];

function AcademicPartners() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

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

  if (partners.length === 0) return null;

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
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Partners</p>
        <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#111827] sm:text-6xl">
          OUR PARTNERS
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-xl text-slate-600 sm:text-2xl">
          Organizations supporting innovation, research, education, and academic collaboration.
        </p>

        <div className="mx-auto mt-16 space-y-14">
          {partnerSections.map((section) => {
            const sectionPartners = partners.filter((partner) => (partner.partner_type || "academic") === section.key);
            if (sectionPartners.length === 0) return null;

            return (
              <div key={section.key}>
                <h3 className="text-center text-2xl font-black uppercase tracking-tight text-[#111827] sm:text-3xl">{section.title}</h3>
                <div className="mx-auto mt-7 grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
                  {sectionPartners.map((partner, index) => (
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
                        onClick={() => setSelectedPartner({ ...partner, sectionTitle: section.title })}
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
                    </motion.article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-dialog-title"
            onClick={() => setSelectedPartner(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-[28px] border border-violet-100 bg-white p-7 text-center shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:p-9"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-[#7C3AED] transition hover:bg-fuchsia-50 hover:text-[#EC4899]"
                aria-label="Close partner details"
              >
                <X size={18} />
              </button>
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl border border-violet-100 bg-white shadow-sm">
                {selectedPartner.logo_url ? (
                  <img src={resolveAssetUrl(selectedPartner.logo_url)} alt={`${selectedPartner.name} logo`} className="h-16 w-16 object-contain" />
                ) : (
                  <span className="text-3xl font-black text-[#7C3AED]">{selectedPartner.name.slice(0, 1)}</span>
                )}
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#EC4899]">{selectedPartner.sectionTitle}</p>
              <h3 id="partner-dialog-title" className="mt-3 text-2xl font-black text-[#111827]">{selectedPartner.name}</h3>
              {selectedPartner.description && (
                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">{selectedPartner.description}</p>
              )}
              {selectedPartner.website && (
                <a
                  href={selectedPartner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-violet-100 bg-white px-5 py-3 text-sm font-black text-[#7C3AED] shadow-sm transition hover:border-fuchsia-200 hover:text-[#EC4899]"
                >
                  Visit website
                  <ExternalLink size={15} />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default AcademicPartners;
