import { useState, useEffect } from "react";

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
    <div className="w-full max-w-5xl mx-auto text-center relative z-10">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes prize-enter {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); filter: blur(12px); }
          30% { opacity: 1; transform: translateY(0) scale(1); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-prize-enter { animation: prize-enter 2s ease-out forwards; }
      `}} />

      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
          Rewards
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          What you will receive
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Box 1: Cash Prize (Shuffling) */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-10 shadow-sm transition hover:shadow-md flex flex-col items-center justify-center min-h-[250px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
            <span>Grand Prize Pool</span>
          </div>
          
          <div className="h-[80px] w-full flex items-center justify-center overflow-hidden mt-2">
            {/* Key ensures React remounts the element, triggering the enter animation every cycle */}
            <h3 
              key={currentPrize.currency} 
              className="text-2xl md:text-3xl font-bold text-slate-900 animate-prize-enter text-center px-4"
            >
              {currentPrize.amount}
            </h3>
          </div>
          
          <p key={`label-${currentPrize.currency}`} className="mt-2 text-base font-semibold text-slate-500 animate-prize-enter">
            {currentPrize.currency}
          </p>
        </div>

        {/* Box 2: Certificate & Recognition */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-10 shadow-sm transition hover:shadow-md flex flex-col items-center justify-center min-h-[250px]">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-2xl shadow-sm">
            🏆
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">
            Certificate &<br/> Recognition
          </h3>
          <p className="mt-3 text-sm text-slate-600 text-center">
            Global visibility and formal certification for all finalists.
          </p>
        </div>
      </div>
    </div>
  );
}