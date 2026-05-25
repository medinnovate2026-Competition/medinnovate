import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function PageHeader({ eyebrow = "CMS Workspace", title, description, actions }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-500">
          <span>Admin</span>
          <ChevronRight size={15} />
          <span className="text-violet-700">{eyebrow}</span>
        </div>
        <h1 className="admin-heading text-4xl font-black text-[#514aa3] md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </motion.div>
  );
}

export default PageHeader;
