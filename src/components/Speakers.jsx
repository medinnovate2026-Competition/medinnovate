import { motion } from "framer-motion"

function Speakers() {
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
      <div className="relative mx-auto max-w-7xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Experts</p>
        <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Esteemed Judges</h2>
        <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
          Expert profiles and judging panel details are being finalized.
        </p>
      </div>
    </motion.section>
  )
}

export default Speakers
