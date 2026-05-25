import { motion } from "framer-motion";
import { X } from "lucide-react";

function Drawer({ open = true, title = "Editor drawer", children, onClose, side = "right" }) {
  if (!open) return null;

  const fromRight = side === "right";

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
      <motion.aside
        initial={{ x: fromRight ? "100%" : "-100%" }}
        animate={{ x: 0 }}
        className={`absolute top-0 h-full w-full max-w-xl bg-[#fbfaff] p-6 shadow-2xl ${fromRight ? "right-0" : "left-0"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#514aa3]">{title}</h3>
          <button onClick={onClose} className="admin-icon-button" aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-4">{children || <p className="text-sm leading-6 text-slate-500">Drawer placeholder content for focused CMS editing workflows.</p>}</div>
      </motion.aside>
    </div>
  );
}

export default Drawer;
