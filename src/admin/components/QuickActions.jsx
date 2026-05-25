import { CalendarPlus, FileImage, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { label: "Publish update", icon: Sparkles },
  { label: "Create event", icon: CalendarPlus },
  { label: "Upload media", icon: FileImage },
  { label: "Send reminder", icon: Mail },
];

function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileHover={{ y: -4 }}
          className="admin-soft-border flex items-center gap-3 rounded-[24px] bg-white/65 p-4 text-left shadow-sm transition hover:bg-white"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">
            <action.icon size={20} />
          </span>
          <span className="text-sm font-black">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default QuickActions;
