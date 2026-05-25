import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Plus, Save } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";

const sectionNames = ["Hero", "Highlights", "Stats", "Timeline", "Speakers", "Prizes", "FAQ", "Contact"];

const initialContent = {
  hero: {
    title: "Medinnovate",
    subtitle: "International Healthcare Innovation Hackathon",
    description: "Build practical healthcare solutions with global mentors, clinical insight, and cross-border teams.",
    primaryButton: "Register Now",
    secondaryButton: "Submit Idea",
    backgroundImage: "",
  },
  highlights: ["Global mentors", "Clinical review", "Premium pitch stage"],
  stats: [
    { value: "20+", label: "Placeholder countries" },
    { value: "5", label: "Regional collaboration tracks" },
    { value: "Africa+", label: "Focused partnership network" },
  ],
  timeline: ["Registration", "Idea Submission", "Screening", "Mentorship", "Final Pitch"],
  speakers: ["Dr. Amina Okoro", "Prof. Rohan Mehta", "Dr. Elena Park"],
  prizes: ["Cash prizes", "Certificates", "Networking", "Exposure"],
  faq: ["Is it online?", "Team or solo?", "Certificate provided?"],
  contact: {
    email: "support@medinnovate.global",
    whatsapp: "+91 00000 00000",
    instagram: "@medinnovate.global",
  },
};

function Field({ label, value, onChange, tall }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-600">
      {label}
      {tall ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="admin-field min-h-28 rounded-[22px]" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="admin-field" />
      )}
    </label>
  );
}

function ListEditor({ items, onChange, label }) {
  const update = (index, value) => onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const add = () => onChange([...items, "New item"]);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-slate-600">{label}</p>
        <button type="button" onClick={add} className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-[#6250aa] shadow-sm">
          <Plus className="mr-1 inline" size={14} />
          Add
        </button>
      </div>
      {items.map((item, index) => (
        <input key={`${label}-${index}`} value={item} onChange={(event) => update(index, event.target.value)} className="admin-field" />
      ))}
    </div>
  );
}

function StatsEditor({ stats, onChange }) {
  const update = (index, key, value) => onChange(stats.map((stat, statIndex) => (statIndex === index ? { ...stat, [key]: value } : stat)));
  return (
    <div className="grid gap-3">
      <p className="text-sm font-black text-slate-600">Stats</p>
      {stats.map((stat, index) => (
        <div key={index} className="grid gap-3 rounded-[24px] bg-white/70 p-3 md:grid-cols-2">
          <input value={stat.value} onChange={(event) => update(index, "value", event.target.value)} className="admin-field" />
          <input value={stat.label} onChange={(event) => update(index, "label", event.target.value)} className="admin-field" />
        </div>
      ))}
    </div>
  );
}

function HomepagePreview({ content }) {
  return (
    <aside className="admin-card sticky top-28 rounded-[32px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
          <h3 className="mt-1 text-xl font-black text-[#514aa3]">Homepage</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Instant</span>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-[#09051A] text-white shadow-2xl">
        <section className="relative p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.28),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.22),transparent_30%)]" />
          <div className="relative">
            <p className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">Global Participation</p>
            <h2 className="admin-heading mt-5 text-4xl font-black leading-tight text-white">{content.hero.title}</h2>
            <p className="mt-3 text-sm font-bold text-fuchsia-100">{content.hero.subtitle}</p>
            <p className="mt-3 text-sm leading-6 text-violet-100/75">{content.hero.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-gradient-to-r from-fuchsia-300 to-cyan-300 px-4 py-2 text-xs font-black text-[#12091F]">{content.hero.primaryButton}</span>
              <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-black text-white">{content.hero.secondaryButton}</span>
            </div>
          </div>
        </section>
        <section className="grid gap-2 bg-white p-4 text-[#514aa3]">
          <div className="grid grid-cols-3 gap-2">
            {content.highlights.map((item) => <div key={item} className="rounded-2xl bg-violet-50 p-3 text-xs font-black">{item}</div>)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {content.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[#f7f3ff] p-3">
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-400">Timeline</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {content.timeline.map((step) => <span key={step} className="rounded-full bg-white px-3 py-1 text-xs font-bold">{step}</span>)}
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

function HomepageCmsEditor() {
  const [activeSection, setActiveSection] = useState("Hero");
  const [content, setContent] = useState(initialContent);

  const sectionEditor = useMemo(() => {
    if (activeSection === "Hero") {
      return (
        <div className="grid gap-4">
          <Field label="Title" value={content.hero.title} onChange={(value) => setContent({ ...content, hero: { ...content.hero, title: value } })} />
          <Field label="Subtitle" value={content.hero.subtitle} onChange={(value) => setContent({ ...content, hero: { ...content.hero, subtitle: value } })} />
          <Field label="Description" value={content.hero.description} tall onChange={(value) => setContent({ ...content, hero: { ...content.hero, description: value } })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary button" value={content.hero.primaryButton} onChange={(value) => setContent({ ...content, hero: { ...content.hero, primaryButton: value } })} />
            <Field label="Secondary button" value={content.hero.secondaryButton} onChange={(value) => setContent({ ...content, hero: { ...content.hero, secondaryButton: value } })} />
          </div>
          <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-6 text-center">
            <ImagePlus className="mx-auto text-violet-500" size={30} />
            <p className="mt-3 text-sm font-black text-[#514aa3]">Background image</p>
            <Field label="Image URL" value={content.hero.backgroundImage} onChange={(value) => setContent({ ...content, hero: { ...content.hero, backgroundImage: value } })} />
          </div>
        </div>
      );
    }

    if (activeSection === "Stats") {
      return <StatsEditor stats={content.stats} onChange={(stats) => setContent({ ...content, stats })} />;
    }

    if (activeSection === "Contact") {
      return (
        <div className="grid gap-4">
          <Field label="Email" value={content.contact.email} onChange={(value) => setContent({ ...content, contact: { ...content.contact, email: value } })} />
          <Field label="WhatsApp" value={content.contact.whatsapp} onChange={(value) => setContent({ ...content, contact: { ...content.contact, whatsapp: value } })} />
          <Field label="Instagram" value={content.contact.instagram} onChange={(value) => setContent({ ...content, contact: { ...content.contact, instagram: value } })} />
        </div>
      );
    }

    const key = activeSection.toLowerCase();
    return <ListEditor label={activeSection} items={content[key]} onChange={(items) => setContent({ ...content, [key]: items })} />;
  }, [activeSection, content]);

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Homepage CMS"
        description="Edit MedInnovate homepage sections with instant mock preview. No API or backend state is used here yet."
        actions={<button className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-xl shadow-violet-200"><Save className="mr-2 inline" size={17} />Mock save</button>}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="admin-card rounded-[32px] p-6">
          <Tabs tabs={sectionNames} active={activeSection} onChange={setActiveSection} />
          <div className="mt-6">{sectionEditor}</div>
        </motion.section>
        <HomepagePreview content={content} />
      </div>
    </>
  );
}

export default HomepageCmsEditor;
