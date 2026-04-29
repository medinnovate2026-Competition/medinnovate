import { useState, useEffect } from "react";

const PRIZES = [
  { amount: "₦1,000,000", currency: "NGN" },
  { amount: "$729.84", currency: "USD" },
  { amount: "₹69,057.27", currency: "INR" },
];

export default function PrizeReveal() {
  const [prizeIndex, setPrizeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrizeIndex((prev) => (prev + 1) % PRIZES.length);
    }, 2500); // Shuffles every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentPrize = PRIZES[prizeIndex];

  return (
    <div className="w-full max-w-5xl mx-auto text-center relative z-10">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes prize-enter {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-prize-enter { animation: prize-enter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}} />

      <div className="mb-12">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
          Rewards
        </p>
        <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-6xl">
          What you will receive
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Box 1: Cash Prize (Shuffling) */}
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-10 shadow-2xl shadow-purple-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-300/40 flex flex-col items-center justify-center min-h-[250px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-fuchsia-100 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <span>Grand Prize Pool</span>
          </div>
          
          <div className="h-[80px] w-full flex items-center justify-center overflow-hidden mt-2">
            {/* Key ensures React remounts the element, triggering the enter animation every cycle */}
            <h3 
              key={currentPrize.currency} 
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-fuchsia-100 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(168,85,247,0.25)] animate-prize-enter"
            >
              {currentPrize.amount}
            </h3>
          </div>
          
          <p key={`label-${currentPrize.currency}`} className="mt-2 text-lg font-semibold text-slate-400 animate-prize-enter">
            {currentPrize.currency}
          </p>
        </div>

        {/* Box 2: Certificate & Recognition */}
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-10 shadow-2xl shadow-cyan-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 flex flex-col items-center justify-center min-h-[250px]">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-3xl shadow-[0_0_34px_rgba(34,211,238,0.2)]">
            🏆
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white text-center">
            Certificate &<br/> Recognition
          </h3>
          <p className="mt-4 text-sm text-slate-400 text-center">
            Global visibility and formal certification for all finalists.
          </p>
        </div>
      </div>
    </div>
  );
}