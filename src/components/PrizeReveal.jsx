import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PRIZES = [
  { amount: "Prize will be revealed soon", currency: "English" },
  { amount: "पुरस्कार जल्द ही घोषित किया जाएगा", currency: "Hindi" },
  { amount: "A o ṣafihan ẹbun naa laipẹ", currency: "Yoruba" },
];

export default function PrizeReveal() {
  const [prizeIndex, setPrizeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrizeIndex((prev) => (prev + 1) % PRIZES.length);
    }, 3500); // Shuffles every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentPrize = PRIZES[prizeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto text-center relative z-10"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes prize-enter {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); filter: blur(12px); }
          30% { opacity: 1; transform: translateY(0) scale(1); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-prize-enter { animation: prize-enter 2s ease-out forwards; }
      `}} />

      <div className="mb-12">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">
          Rewards
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
          What you will receive
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Box 1: Cash Prize (Shuffling) */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-violet-100 bg-white/90 p-10 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:shadow-[0_28px_80px_rgba(236,72,153,0.14)]"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#7C3AED] shadow-sm">
            <span>Grand Prize Pool</span>
          </div>
          
          <div className="h-[80px] w-full flex items-center justify-center overflow-hidden mt-2">
            {/* Key ensures React remounts the element, triggering the enter animation every cycle */}
            <h3 
              key={currentPrize.currency} 
              className="text-2xl md:text-3xl font-black text-[#111827] animate-prize-enter text-center px-4"
            >
              {currentPrize.amount}
            </h3>
          </div>
          
          <p key={`label-${currentPrize.currency}`} className="mt-2 text-base font-semibold text-slate-500 animate-prize-enter">
            {currentPrize.currency}
          </p>
        </motion.div>

        {/* Box 2: Certificate & Recognition */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-violet-100 bg-white/90 p-10 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:shadow-[0_28px_80px_rgba(236,72,153,0.14)]"
        >
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 text-2xl shadow-sm">
            🏆
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#111827] text-center">
            Certificate &<br/> Recognition
          </h3>
          <p className="mt-3 text-sm text-slate-600 text-center">
            Global visibility and formal certification for all finalists.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
