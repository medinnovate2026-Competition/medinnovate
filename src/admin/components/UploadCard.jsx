import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

function UploadCard({ title = "Upload asset", description = "Drop a file here or browse from your device.", accept = "Images, PDFs, videos" }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="admin-card rounded-[32px] border-dashed p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-violet-100 text-violet-700">
        <UploadCloud size={28} />
      </div>
      <h3 className="mt-5 text-xl font-black text-[#514aa3]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#9b93b4]">{accept}</p>
      <button className="mt-6 rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">
        Choose file
      </button>
    </motion.div>
  );
}

export default UploadCard;
