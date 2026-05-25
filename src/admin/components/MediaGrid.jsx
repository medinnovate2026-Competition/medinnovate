import { FileImage, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

function MediaGrid() {
  return (
    <section className="admin-card rounded-[32px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black">Media Library</h3>
        <button className="rounded-2xl bg-violet-700 px-4 py-2 text-sm font-black text-white">
          <UploadCloud className="mr-2 inline" size={17} />
          Upload
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <motion.div key={item} whileHover={{ y: -5 }} className="rounded-[26px] border border-violet-100 bg-white/72 p-3 shadow-sm">
            <div className="grid aspect-[4/3] place-items-center rounded-[20px] bg-gradient-to-br from-violet-100 via-white to-cyan-100 text-violet-600">
              <FileImage size={34} />
            </div>
            <p className="mt-3 truncate text-sm font-black">conference-asset-{item}.png</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">Image placeholder</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default MediaGrid;
