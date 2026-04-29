import { useState } from 'react'

const faqs = [
  {
    question: 'Is it online?',
    answer: 'The format is planned as online / hybrid. Final participation details will be shared with registered participants.',
  },
  {
    question: 'Team or solo?',
    answer: 'Both solo participants and teams are allowed. Teams can be multidisciplinary.',
  },
  {
    question: 'Who can join?',
    answer: 'Medical students, public health graduates, engineers, designers, social science professionals, interns, and young professionals can join.',
  },
  {
    question: 'Certificate provided?',
    answer: 'Yes. Participants and finalists will receive certificates based on event participation and completion criteria.',
  },
  {
    question: 'Payment issues?',
    answer: 'Contact support with your transaction reference and registration email so the team can verify your payment.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-6xl">
            Questions before you register.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <article key={item.question} className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] shadow-2xl shadow-purple-950/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-lg font-bold text-white">{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-fuchsia-300/30 text-fuchsia-200">
                    {isOpen ? '-' : '+'}
                  </span>
                </button>
                {isOpen ? (
                  <p className="px-6 pb-6 leading-7 text-slate-300">{item.answer}</p>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
