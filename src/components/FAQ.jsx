import { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"

const faqs = [
  {
    question: 'Is Medinnovate an online or offline event?',
    answer: 'Medinnovate will follow a hybrid format. Phase 1 will be conducted online, and the Grand Finale will be held offline in India with a virtual presentation option for eligible participants who cannot attend in person.',
  },
  {
    question: 'Can I participate solo?',
    answer: 'No. Participation requires a team of exactly 5 undergraduate students.',
  },
  {
    question: 'Who can participate?',
    answer: 'Undergraduate students from Africa and India can participate.',
  },
  {
    question: 'Can team members be from different colleges or countries?',
    answer: 'Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.',
  },
  {
    question: 'Is there any registration fee?',
    answer: 'Yes. The registration fee is $3 per participant or $15 per team of 5 members.',
  },
  {
    question: 'Will certificates be provided?',
    answer: 'Yes. Certificates will be provided based on participation and completion criteria.',
  },
  {
    question: 'What is the selection process?',
    answer: 'The selection process follows registration, submission, screening, mentorship, and final pitch.',
  },
  {
    question: 'What happens if I cannot attend the final round in person?',
    answer: 'A virtual option will be available for participants who cannot attend the final round in person.',
  },
  {
    question: 'What kind of ideas can we submit?',
    answer: 'You can submit healthcare innovation ideas that address meaningful real-world healthcare challenges.',
  },
  {
    question: 'How can I contact the team for support?',
    answer: 'You can contact the team through email, Instagram, or WhatsApp.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#fbf9ff] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Questions before you register.</h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <motion.article
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.38, ease: "easeOut", delay: Math.min(index * 0.03, 0.18) }}
                className="rounded-3xl border border-violet-100 bg-white/90 shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
              >
                <button type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                  <span className="text-lg font-black text-[#111827]">{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white">
                    {isOpen ? '-' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden px-6 pb-6 leading-7 text-slate-600"
                    >
                      {item.answer}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

export default FAQ
