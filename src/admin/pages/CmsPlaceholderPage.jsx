import { motion } from "framer-motion";
import ContentEditorLayout from "../components/ContentEditorLayout";
import MediaGrid from "../components/MediaGrid";
import TableLayout from "../components/TableLayout";

function FieldMock({ label, tall }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-600">
      {label}
      {tall ? (
        <textarea className="admin-field min-h-32 resize-none" placeholder={`${label} placeholder`} />
      ) : (
        <input className="admin-field" placeholder={`${label} placeholder`} />
      )}
    </label>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: item * 0.12 }}
          className="h-14 rounded-2xl bg-violet-100"
        />
      ))}
    </div>
  );
}

function CmsPlaceholderPage({ title, description, variant = "editor" }) {
  if (variant === "media") {
    return (
      <>
        <ContentEditorLayout title={title} description={description}>
          <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-8 text-center">
            <p className="text-lg font-black">Drag media here</p>
            <p className="mt-2 text-sm text-slate-500">Images, videos, PDFs, logos, brochures, and certificates.</p>
          </div>
        </ContentEditorLayout>
        <div className="mt-6">
          <MediaGrid />
        </div>
      </>
    );
  }

  if (variant === "table") {
    return (
      <>
        <ContentEditorLayout title={title} description={description}>
          <div className="grid gap-4 md:grid-cols-2">
            <FieldMock label="Title" />
            <FieldMock label="Status" />
            <FieldMock label="Category" />
            <FieldMock label="Publish date" />
            <div className="md:col-span-2">
              <FieldMock label="Description" tall />
            </div>
          </div>
        </ContentEditorLayout>
        <div className="mt-6">
          <TableLayout title={`${title} table`} />
        </div>
      </>
    );
  }

  return (
    <ContentEditorLayout title={title} description={description}>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldMock label="Headline" />
        <FieldMock label="Slug" />
        <FieldMock label="CTA label" />
        <FieldMock label="CTA URL" />
        <div className="md:col-span-2">
          <FieldMock label="Body content" tall />
        </div>
        <div className="md:col-span-2 rounded-[28px] bg-white/70 p-5">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-violet-500">Loading state</p>
          <LoadingState />
        </div>
      </div>
    </ContentEditorLayout>
  );
}

export default CmsPlaceholderPage;
