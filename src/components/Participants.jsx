import { motion } from "framer-motion"

const requirements = [
  {
    title: 'Team of 5 is mandatory',
    detail: 'Every submission must come from a team of exactly five members.',
  },
  {
    title: 'All members should be undergraduate students',
    detail: 'Each participant in the team must be an undergraduate student.',
  },
  {
    title: 'Theme: Public Health',
    detail: 'Ideas should address a meaningful public health challenge.',
  },
  {
    title: 'Original and feasible idea',
    detail: 'The solution must be your own concept and practical enough to be implemented.',
  },
]

function Participants() {
  return (
    <>
      <motion.section
        id="participants"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Eligibility</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Who Can Join</h2>
          <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
            Participation is limited to undergraduate students from Africa and India.
          </p>

          <div className="mx-auto mt-20 grid max-w-5xl gap-7 md:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="flex gap-6 rounded-3xl border border-violet-100 bg-white/90 p-10 text-left shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 text-xl font-black text-[#7C3AED]">01</div>
              <div>
                <h3 className="text-2xl font-black text-[#111827]">Undergraduate Students</h3>
                <p className="mt-4 text-lg leading-8 text-slate-700">Open to all undergraduate students in Africa and India.</p>
              </div>
            </motion.article>
            <motion.article
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
              whileHover={{ y: -5 }}
              className="flex gap-6 rounded-3xl border border-violet-100 bg-white/90 p-10 text-left shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 text-xl font-black text-[#EC4899]">02</div>
              <div>
                <h3 className="text-2xl font-black text-[#111827]">Students Across Disciplines</h3>
                <p className="mt-4 text-lg leading-8 text-slate-700">Undergraduate students from any discipline can join and submit healthcare innovation ideas.</p>
              </div>
            </motion.article>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto mt-10 max-w-4xl rounded-3xl border border-violet-100 bg-white/90 px-8 py-6 text-lg font-semibold leading-8 text-[#111827] shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
          >
            All undergraduate students from Africa and India are eligible to participate. We encourage interdisciplinary teams that bring together diverse academic backgrounds to foster innovative solutions to healthcare challenges.
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="requirements"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-[#EC4899]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Requirements</p>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">Prerequisites</h2>
            <p className="mt-8 text-xl leading-8 text-slate-600 sm:text-2xl">
              These requirements keep the hackathon focused, fair, and aligned with the public health theme.
            </p>
          </div>

          <div className="mt-20 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {requirements.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-violet-100 bg-white/90 p-10 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:border-fuchsia-200 hover:shadow-[0_28px_80px_rgba(236,72,153,0.14)]"
              >
                <span className="rounded-xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 px-4 py-2 text-sm font-black text-[#7C3AED] shadow-sm">0{index + 1}</span>
                <h3 className="mt-12 text-2xl font-black leading-snug text-[#111827]">{item.title}</h3>
                <p className="mt-6 text-lg leading-9 text-slate-700">{item.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default Participants
