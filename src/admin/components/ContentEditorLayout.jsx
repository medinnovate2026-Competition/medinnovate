import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import PreviewPanel from "./PreviewPanel";

function ContentEditorLayout({ title, description, children }) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={<button className="rounded-2xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-xl shadow-violet-200">Save draft</button>}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="admin-card rounded-[32px] p-6">
          <div className="mb-6 flex gap-2">
            {["Content", "Design", "SEO"].map((tab, index) => (
              <button key={tab} className={`rounded-2xl px-4 py-2 text-sm font-black ${index === 0 ? "bg-violet-700 text-white" : "bg-white/70 text-slate-500"}`}>
                {tab}
              </button>
            ))}
          </div>
          {children}
        </motion.section>
        <PreviewPanel title={`${title} preview`} />
      </div>
    </>
  );
}

export default ContentEditorLayout;
