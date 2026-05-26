import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, RefreshCw, Save, UploadCloud } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";
import { defaultCommunitySection, normalizeCommunitySection } from "../../data/communitySection";

const COMMUNITY_KEY = "medinnovate_community_section_cms";

function Field({ label, value, onChange, tall, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-600">
      {label}
      {tall ? (
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-field min-h-32 rounded-[22px]" />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-field" />
      )}
    </label>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read selected image."));
    reader.readAsDataURL(file);
  });
}

function CommunityPreview({ section }) {
  const content = normalizeCommunitySection(section);

  return (
    <aside className="admin-card sticky top-28 rounded-[32px] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
      <h3 className="mt-1 text-xl font-black text-[#514aa3]">Community CTA</h3>
      <div className="mt-5 overflow-hidden rounded-[28px] bg-[#f8fff9] p-5 text-center shadow-2xl">
        <div className="overflow-hidden rounded-[24px] border border-emerald-100 bg-white p-2 shadow-lg">
          {content.image_url ? (
            <img src={resolveAssetUrl(content.image_url)} alt="" className="aspect-[16/10] w-full rounded-[18px] object-cover" />
          ) : (
            <div className="grid aspect-[16/10] place-items-center rounded-[18px] bg-emerald-50 text-sm font-black text-emerald-700">
              Upload community image
            </div>
          )}
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Community</p>
        <h4 className="mt-2 text-2xl font-black uppercase text-[#111827]">{content.title}</h4>
        <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-500">{content.description}</p>
        <div className="mt-5 rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#7C3AED] px-4 py-3 text-xs font-black uppercase tracking-wide text-white">
          Join the Community for Updates & More
        </div>
        <p className="mt-4 text-xs font-black text-[#7C3AED]">{content.scroll_text}</p>
      </div>
    </aside>
  );
}

function CommunitySectionCmsPage() {
  const [section, setSection] = useState(defaultCommunitySection);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const update = (key, value) => setSection((current) => ({ ...current, [key]: value }));

  const loadSection = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/community-section");
      setSection(normalizeCommunitySection(data.section));
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setSection(normalizeCommunitySection(readLocalCms(COMMUNITY_KEY, defaultCommunitySection)));
        setUsingFallback(true);
        setMessage("Using local Community Section draft because the production API route is unavailable.");
      } else {
        setSection(defaultCommunitySection);
        setError(loadError.message || "Unable to load community section.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    if (usingFallback) {
      writeLocalCms(COMMUNITY_KEY, section);
      setMessage("Community section draft saved locally.");
      setSaving(false);
      return;
    }

    try {
      const data = await cmsFetchJson("/api/admin/community-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      setSection(normalizeCommunitySection(data.section));
      setMessage("Community section saved.");
    } catch (saveError) {
      if (isCmsApiUnavailable(saveError)) {
        writeLocalCms(COMMUNITY_KEY, section);
        setUsingFallback(true);
        setMessage("Community section draft saved locally.");
      } else {
        setError(saveError.message || "Unable to save community section.");
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const fileDataUrl = await fileToDataUrl(file);
      const data = await cmsFetchJson("/api/admin/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileDataUrl,
          originalName: file.name,
          folder: "community",
          alt_text: "MedInnovate WhatsApp community preview",
        }),
      });
      update("image_url", data.url || data.item?.url || "");
      setMessage("Image uploaded. Save the section to publish it.");
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Community Section"
        description="Edit the public WhatsApp community CTA that appears above registration."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSection} className="admin-button admin-button-secondary" disabled={loading}>
              <RefreshCw size={17} />
              Refresh
            </button>
            <button type="button" onClick={saveSection} className="admin-button" disabled={saving || loading}>
              <Save size={17} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      />

      {message && <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">{message}</div>}
      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Community Section CMS is using a local browser draft because the production CMS API route is unavailable.</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="admin-card rounded-[32px] p-6">
          {loading ? (
            <div className="rounded-[28px] bg-violet-50 px-5 py-12 text-center text-sm font-bold text-slate-500">Loading community section...</div>
          ) : (
            <div className="grid gap-5">
              <div className="rounded-[28px] border border-violet-100 bg-white/70 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black text-[#514aa3]">Community image</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Upload the WhatsApp community image or mockup used on the homepage.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">
                    <UploadCloud size={17} />
                    {uploading ? "Uploading..." : "Upload image"}
                    <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="hidden" />
                  </label>
                </div>
                {section.image_url && (
                  <img src={resolveAssetUrl(section.image_url)} alt="Community section preview" className="mt-4 aspect-[16/8] w-full rounded-[24px] object-cover" />
                )}
              </div>

              <Field label="Title" value={section.title} onChange={(value) => update("title", value)} />
              <Field label="Description" value={section.description} onChange={(value) => update("description", value)} tall />
              <Field label="WhatsApp invite link" value={section.whatsapp_link} onChange={(value) => update("whatsapp_link", value)} placeholder="https://chat.whatsapp.com/..." />
              <Field label="Scroll text" value={section.scroll_text} onChange={(value) => update("scroll_text", value)} />

              <button
                type="button"
                onClick={() => update("visible", !section.visible)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  section.visible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {section.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                {section.visible ? "Visible on homepage" : "Hidden from homepage"}
              </button>
            </div>
          )}
        </motion.section>

        <CommunityPreview section={section} />
      </div>
    </>
  );
}

export default CommunitySectionCmsPage;
