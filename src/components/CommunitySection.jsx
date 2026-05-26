import { motion } from "framer-motion";
import { ExternalLink, MessageCircle, UsersRound } from "lucide-react";
import { resolveAssetUrl } from "../config";
import { defaultCommunitySection, normalizeCommunitySection } from "../data/communitySection";

function CommunityImage({ imageUrl, title }) {
  if (imageUrl) {
    return (
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-[0_28px_80px_rgba(16,185,129,0.16)] sm:rounded-[2.25rem] sm:p-4">
        <img
          src={resolveAssetUrl(imageUrl)}
          alt={`${title} community preview`}
          className="aspect-[16/10] w-full rounded-[1.35rem] object-cover sm:rounded-[1.65rem]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-[0_28px_80px_rgba(16,185,129,0.14)] sm:rounded-[2.25rem] sm:p-5">
      <div className="rounded-[1.55rem] bg-gradient-to-br from-[#ecfdf5] via-white to-[#fdf2f8] p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-emerald-200">
            <UsersRound size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Community</p>
            <p className="text-lg font-black text-[#111827]">MedInnovate Updates</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {["Announcements", "Opportunities", "Event discussions"].map((item, index) => (
            <div key={item} className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ${index === 1 ? "ml-7" : ""}`}>
              <span className="h-3 w-3 rounded-full bg-[#25D366]" />
              <span className="text-sm font-black text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunitySection({ section = defaultCommunitySection, loading = false }) {
  const content = normalizeCommunitySection(section);

  if (!content.visible) return null;

  return (
    <motion.section
      id="community"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#f8fff9] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="community-heading"
    >
      <div className="absolute left-8 top-12 h-64 w-64 rounded-full bg-[#25D366]/12 blur-3xl" />
      <div className="absolute bottom-8 right-8 h-72 w-72 rounded-full bg-[#EC4899]/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        {loading ? (
          <div className="mx-auto mb-8 h-64 max-w-3xl animate-pulse rounded-[2rem] bg-white/80 shadow-[0_28px_80px_rgba(16,185,129,0.10)]" />
        ) : (
          <CommunityImage imageUrl={content.image_url} title={content.title} />
        )}

        <p className="mt-10 text-sm font-black uppercase tracking-[0.22em] text-[#16A34A]">Community</p>
        <h2 id="community-heading" className="mt-3 text-4xl font-black uppercase tracking-tight text-[#111827] sm:text-5xl">
          {content.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-lg font-semibold leading-8 text-slate-600">
          {content.description}
        </p>

        <a
          href={content.whatsapp_link || undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!content.whatsapp_link}
          className={`mt-9 inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(34,197,94,0.24)] transition sm:px-9 ${
            content.whatsapp_link
              ? "bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#7C3AED] hover:-translate-y-1"
              : "pointer-events-none bg-slate-300"
          }`}
        >
          <MessageCircle size={19} aria-hidden="true" />
          Join the Community for Updates & More
          <ExternalLink size={17} aria-hidden="true" />
        </a>

        <motion.p
          animate={{ opacity: [0.55, 1, 0.55], y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 text-sm font-black text-[#7C3AED]"
        >
          {content.scroll_text}
        </motion.p>
      </div>
    </motion.section>
  );
}

export default CommunitySection;
