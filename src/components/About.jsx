import { motion } from "framer-motion"
import { defaultHomepageContent, normalizeHomepageContent } from "../data/homepageContent"

function About({ content }) {
  const homepage = normalizeHomepageContent(content)
  const phases = homepage.timeline_json.length > 0 ? homepage.timeline_json.slice(0, 2) : defaultHomepageContent.timeline_json.slice(0, 2)

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#fbf9ff] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute right-10 top-24 h-64 w-64 rounded-full bg-[#A855F7]/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Learn More About Medinnovate</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111827] sm:text-4xl">About Medinnovate</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {homepage.about_text}
          </p>

          <div className="mt-7 space-y-4">
            {phases.map((phase, index) => (
              <motion.article
                key={phase.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-violet-100 bg-white/85 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
              >
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#7C3AED]">{phase.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{phase.body || phase.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid h-56 w-56 place-items-center rounded-full border border-violet-200 bg-white/80 shadow-[0_30px_90px_rgba(124,58,237,0.14)] sm:h-72 sm:w-72"
          >
            <div className="grid h-40 w-40 place-items-center rounded-full border border-fuchsia-200 bg-gradient-to-br from-white to-fuchsia-50 sm:h-52 sm:w-52">
              <div className="bg-gradient-to-br from-[#4F46E5] via-[#A855F7] to-[#EC4899] bg-clip-text text-6xl text-transparent sm:text-7xl">🩺</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About
