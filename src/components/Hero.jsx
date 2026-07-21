import { motion } from "framer-motion"
import { resolveAssetUrl } from "../config"
import { defaultHomepageContent, normalizeHomepageContent } from "../data/homepageContent"

const currentPhase = 'PHASE 1'

function Hero({ content }) {
  const homepage = normalizeHomepageContent(content)
  const highlights = homepage.stats_json.length > 0 ? homepage.stats_json : defaultHomepageContent.stats_json
  const resultsHref = `${import.meta.env.BASE_URL}round-1-results`

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden bg-[#fbf9ff] px-4 pt-28 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(236,72,153,0.14),transparent_26%),radial-gradient(circle_at_78%_22%,rgba(124,58,237,0.14),transparent_28%),radial-gradient(circle_at_48%_78%,rgba(79,70,229,0.1),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          className="min-w-0 text-center lg:text-left"
        >
          <div className="mb-7 inline-flex max-w-full items-center gap-3 rounded-full border border-violet-200 bg-white/75 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-700 shadow-[0_12px_34px_rgba(124,58,237,0.12)] backdrop-blur sm:px-5 sm:text-xs sm:tracking-[0.24em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899] shadow-[0_0_16px_rgba(236,72,153,0.9)]" />
            <span>Global Participation</span>
          </div>

          <h1 className="max-w-full bg-gradient-to-r from-[#111827] via-[#7C3AED] to-[#EC4899] bg-clip-text text-5xl font-black leading-[0.92] tracking-tight text-transparent sm:text-8xl lg:text-[5rem] xl:text-[5.75rem] 2xl:text-[6.25rem]">
            {homepage.hero_title}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-xl font-semibold tracking-wide text-[#7C3AED] sm:max-w-none sm:text-2xl lg:mx-0">
            {homepage.hero_subtitle}
          </p>
          <p className="mx-auto mt-5 max-w-md text-base leading-8 text-slate-600 sm:max-w-2xl sm:text-lg lg:mx-0">
            {homepage.hero_description}
          </p>
          <p className="mx-auto mt-5 max-w-md rounded-3xl border border-violet-100 bg-white/82 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#7C3AED] shadow-[0_14px_34px_rgba(124,58,237,0.08)] backdrop-blur sm:max-w-2xl lg:mx-0">
            Registrations are closed for Phase 1.
          </p>

          <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-4 sm:max-w-none sm:flex-row lg:mx-0 lg:justify-start">
            <a href={resultsHref} className="w-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(168,85,247,0.28)] transition hover:-translate-y-1 sm:w-auto">
              View Results
            </a>
            <div className="w-full rounded-full border border-violet-100 bg-white/85 px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-[#7C3AED] shadow-sm backdrop-blur sm:w-auto">
              {homepage.secondary_cta_label || `Current Phase: ${currentPhase}`}
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-sm gap-3 text-sm text-slate-600 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center lg:mx-0 lg:justify-start">
            <span className="rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-center shadow-sm">Date: 18th July</span>
            <span className="rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-center shadow-sm">Mode: Online / Hybrid</span>
          </div>

          <div className="mx-auto mt-10 grid max-w-sm gap-3 sm:max-w-none sm:grid-cols-3 lg:mx-0">
            {highlights.map((item, index) => (
              <motion.div
                key={`${item.value || item}-${item.label || index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.28 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-violet-100 bg-white/75 px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-[0_12px_34px_rgba(124,58,237,0.08)] backdrop-blur"
              >
                {item.value && item.label ? `${item.value} ${item.label}` : item.label || item.value || item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
          className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_40px_120px_rgba(124,58,237,0.16)] backdrop-blur xl:max-w-md 2xl:max-w-lg"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white via-white/80 to-fuchsia-50" />
          <div className="absolute inset-8 rounded-full border border-violet-200" />
          <div className="absolute inset-16 rounded-full border border-fuchsia-200" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#EC4899]/20 via-[#A855F7]/18 to-[#4F46E5]/16 blur-3xl" />
          <div className="absolute inset-6 grid place-items-center rounded-[1.75rem] border border-violet-100 bg-white/92 p-8 shadow-[0_24px_70px_rgba(124,58,237,0.18)] sm:inset-8 sm:p-10">
            <img
              src={resolveAssetUrl(homepage.hero_media_url) || `${import.meta.env.BASE_URL}logo.png`}
              alt="MedInnovate Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="absolute left-[14%] top-[18%] rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold text-[#7C3AED] shadow-[0_14px_36px_rgba(124,58,237,0.14)]">
            AI Care
          </div>
          <div className="absolute right-[10%] top-[35%] rounded-full border border-fuchsia-200 bg-white px-4 py-2 text-xs font-bold text-[#EC4899] shadow-[0_14px_36px_rgba(236,72,153,0.14)]">
            Public Health
          </div>
          <div className="absolute bottom-[12%] left-[20%] rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-[#4F46E5] shadow-[0_14px_36px_rgba(79,70,229,0.14)]">
            MedTech
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero
