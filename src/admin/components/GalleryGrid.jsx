import { FileImage } from "lucide-react";
import { motion } from "framer-motion";

const defaultItems = ["Hero visual", "Speaker portrait", "Workshop banner", "Sponsor logo", "Certificate", "Venue photo"];

function GalleryGrid({ items = defaultItems }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.article key={item} whileHover={{ y: -5 }} className="rounded-[26px] border border-white/80 bg-white/70 p-3 shadow-sm">
          <div className="grid aspect-[4/3] place-items-center rounded-[22px] bg-gradient-to-br from-violet-100 via-white to-pink-100 text-violet-600">
            <FileImage size={32} />
          </div>
          <p className="mt-3 truncate text-sm font-black text-[#514aa3]">{item}</p>
          <p className="text-xs font-semibold text-slate-400">Asset {index + 1}</p>
        </motion.article>
      ))}
    </div>
  );
}

export default GalleryGrid;
