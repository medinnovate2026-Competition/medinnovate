import { motion } from "framer-motion"
import { defaultHomepageContent, normalizeHomepageContent } from "../data/homepageContent"

function Timeline({ content }) {
  const homepage = normalizeHomepageContent(content)
  const steps = homepage.timeline_json.length > 0 ? homepage.timeline_json : defaultHomepageContent.timeline_json

  return (
    <motion.section
      id="timeline"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#4F46E5]/10 blur-3xl" />
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Timeline</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Event Flow</h2>
          <p className="mt-5 text-lg text-slate-600">Your journey from registration to the global stage.</p>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-[#7C3AED] via-[#A855F7] to-[#EC4899] md:left-1/2" />
          <div className="space-y-12 md:space-y-10">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`relative ml-12 grid gap-6 pt-7 md:ml-0 md:grid-cols-2 md:pt-0 ${index % 2 === 0 ? '' : 'md:text-right'}`}
              >
                <div className={index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}>
                  <div className="rounded-3xl border border-violet-100 bg-white/90 p-8 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Step {index + 1}</p>
                    <h3 className="mt-3 text-xl font-black text-[#111827]">{step.title}</h3>
                    <p className="mt-4 text-base leading-7 text-slate-600">{step.detail}</p>
                  </div>
                </div>
                <div className="absolute left-0 top-0 z-10 grid h-10 min-w-20 -translate-x-1/2 place-items-center rounded-full border border-violet-100 bg-white px-3 text-xs font-black text-[#EC4899] shadow-sm md:left-1/2 md:top-8 md:h-9 md:min-w-9 md:px-0">
                  <span className="md:hidden">Step {index + 1}</span>
                  <span className="hidden md:inline">{index + 1}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Timeline
