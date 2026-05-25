import { motion } from "framer-motion"

const benefits = [
  {
    icon: '01',
    title: 'Global Networking',
    detail: 'Connect with undergraduate students, public health thinkers, engineers, designers, and young professionals across countries.',
  },
  {
    icon: '02',
    title: 'Global Stage',
    detail: 'Pitch your healthcare solution to an international audience and receive visibility beyond your local ecosystem.',
  },
  {
    icon: '03',
    title: 'Certification',
    detail: 'Receive recognition for your participation and contribution to a real healthcare innovation challenge.',
  },
  {
    icon: '04',
    title: 'Mentorship',
    detail: 'Refine your problem statement, feasibility, impact model, and final pitch with guidance from mentors and domain experts.',
  },
]

function Prizes() {
  return (
    <motion.section
      id="prizes"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Benefits</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Why Attend?</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            A focused hackathon experience designed to give your idea visibility, expert input, and international credibility.
          </p>
        </div>

        <div className="mt-20 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-violet-100 bg-white/90 p-10 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:border-fuchsia-200 hover:shadow-[0_28px_80px_rgba(236,72,153,0.14)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 text-sm font-black text-[#7C3AED] shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="mt-10 text-2xl font-black text-[#111827]">{benefit.title}</h3>
              <p className="mt-6 text-lg leading-9 text-slate-700">{benefit.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Prizes
