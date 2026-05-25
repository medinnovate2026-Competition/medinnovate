import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";

function StatCard({ title, value, detail, icon: Icon, tone = "lavender" }) {
  const CardIcon = Icon || Activity;
  const tones = {
    lavender: {
      icon: "from-violet-500 to-fuchsia-400",
      card: "from-[#f1edff] to-[#fbfaff]",
    },
    cyan: {
      icon: "from-cyan-400 to-blue-500",
      card: "from-[#edf8ff] to-[#fbfaff]",
    },
    mint: {
      icon: "from-emerald-400 to-teal-500",
      card: "from-[#ecfbf6] to-[#fbfaff]",
    },
    amber: {
      icon: "from-amber-300 to-pink-400",
      card: "from-[#fff3e6] to-[#fbfaff]",
    },
    rose: {
      icon: "from-rose-400 to-fuchsia-500",
      card: "from-[#fff0f5] to-[#fbfaff]",
    },
  };
  const activeTone = tones[tone] || tones.lavender;

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`rounded-[28px] border border-white/80 bg-gradient-to-br ${activeTone.card} p-6 shadow-[0_18px_46px_rgba(91,76,143,0.08)]`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${activeTone.icon} text-white shadow-lg shadow-violet-200/70`}>
          <CardIcon size={24} />
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#5d55b9] shadow-sm">
          <ArrowUpRight size={13} className="mr-1 inline" />
          Live
        </span>
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-[#8f87ad]">{title}</p>
      <h3 className="admin-heading mt-2 text-4xl font-black text-[#3d367c]">{value}</h3>
      <p className="mt-3 text-sm leading-6 text-[#8d86a2]">{detail}</p>
    </motion.article>
  );
}

export default StatCard;
