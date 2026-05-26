import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { API_BASE_URL } from "../config";
import { FAQ_STORAGE_KEY, defaultFaqs, normalizeFaqList } from "../data/faqs";

function readLocalFaqDraft() {
  try {
    return JSON.parse(localStorage.getItem(FAQ_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

async function fetchFaqsFromCms() {
  const endpoints = ["/api/faq", "/api/admin/faq?limit=100"];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) continue;

      const data = await response.json();
      const publishedFaqs = normalizeFaqList(data.items).filter((item) => item.status === "Published");
      if (publishedFaqs.length) return publishedFaqs;
    } catch {
      // Try the next source.
    }
  }

  const localFaqs = normalizeFaqList(readLocalFaqDraft()).filter((item) => item.status === "Published");
  return localFaqs.length ? localFaqs : defaultFaqs;
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const [faqs, setFaqs] = useState(defaultFaqs)

  useEffect(() => {
    let active = true

    fetchFaqsFromCms().then((items) => {
      if (active) setFaqs(items)
    })

    return () => {
      active = false
    }
  }, [])

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
