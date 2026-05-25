import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

function ConfirmModal({ open = true, title = "Confirm action", description = "This action will update the CMS preview state.", confirmLabel = "Confirm", cancelLabel = "Cancel", onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="admin-card w-full max-w-md rounded-[32px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-violet-100 text-violet-700">
            <CheckCircle2 size={24} />
          </div>
          <button onClick={onClose} className="admin-icon-button h-10 w-10" aria-label="Close modal">
            <X size={17} />
          </button>
        </div>
        <h3 className="mt-5 text-2xl font-black text-[#514aa3]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#6250aa] shadow-sm">{cancelLabel}</button>
          <button onClick={onConfirm} className="rounded-2xl bg-[#5d55b9] px-4 py-2 text-sm font-black text-white shadow-lg shadow-violet-200">{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmModal;
