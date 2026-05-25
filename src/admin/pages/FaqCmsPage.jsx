import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";

const emptyFaq = {
  question: "",
  answer: "",
  category: "General",
  status: "Draft",
  order_index: 0,
};

const FAQ_KEY = "medinnovate_faq_cms";
const seedFaqs = [
  { id: 1, question: "Is Medinnovate an online or offline event?", answer: "Medinnovate will follow a hybrid format. Phase 1 will be conducted online, and the Grand Finale will be held offline in India with a virtual presentation option for eligible participants who cannot attend in person.", category: "Format", status: "Published", order_index: 1 },
  { id: 2, question: "Can I participate solo?", answer: "No. Participation requires a team of exactly 5 undergraduate students.", category: "Eligibility", status: "Published", order_index: 2 },
  { id: 3, question: "Who can participate?", answer: "Undergraduate students from Africa and India can participate.", category: "Eligibility", status: "Published", order_index: 3 },
  { id: 4, question: "Can team members be from different colleges or countries?", answer: "Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.", category: "Team", status: "Published", order_index: 4 },
  { id: 5, question: "Is there any registration fee?", answer: "Yes. The registration fee is $3 per participant or $15 per team of 5 members.", category: "Payment", status: "Published", order_index: 5 },
  { id: 6, question: "Will certificates be provided?", answer: "Yes. Certificates will be provided based on participation and completion criteria.", category: "Benefits", status: "Published", order_index: 6 },
  { id: 7, question: "What is the selection process?", answer: "The selection process follows registration, submission, screening, mentorship, and final pitch.", category: "Selection", status: "Published", order_index: 7 },
  { id: 8, question: "What happens if I cannot attend the final round in person?", answer: "A virtual option will be available for participants who cannot attend the final round in person.", category: "Finale", status: "Published", order_index: 8 },
  { id: 9, question: "What kind of ideas can we submit?", answer: "You can submit healthcare innovation ideas that address meaningful real-world healthcare challenges.", category: "Ideas", status: "Published", order_index: 9 },
  { id: 10, question: "How can I contact the team for support?", answer: "You can contact the team through email, Instagram, or WhatsApp.", category: "Support", status: "Published", order_index: 10 },
];

function FaqCmsPage() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(emptyFaq);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const limit = 8;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const loadFaqs = async (next = {}) => {
    const nextPage = next.page || page;
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(limit),
      search: next.search ?? query,
      category: next.category ?? category,
    });

    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson(`/api/admin/faq?${params}`);
      setFaqs(data.items || []);
      setCategories(data.categories || []);
      setTotal(Number(data.total || 0));
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        const nextSearch = next.search ?? query;
        const nextCategory = next.category ?? category;
        const localFaqs = readLocalCms(FAQ_KEY, seedFaqs);
        const filtered = localFaqs
          .filter((faq) => !nextSearch || `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(nextSearch.toLowerCase()))
          .filter((faq) => nextCategory === "All" || faq.category === nextCategory)
          .sort((a, b) => a.order_index - b.order_index);
        setFaqs(filtered.slice((nextPage - 1) * limit, nextPage * limit));
        setCategories([...new Set(localFaqs.map((faq) => faq.category).filter(Boolean))]);
        setTotal(filtered.length);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load FAQs.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [page]);

  const startCreate = () => {
    setEditingId(null);
    setSelected({ ...emptyFaq, order_index: total + 1 });
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setSelected(faq);
  };

  const saveFaq = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (usingFallback) {
      const localFaqs = readLocalCms(FAQ_KEY, seedFaqs);
      const nextItem = { ...selected, id: editingId || Date.now() };
      const nextFaqs = editingId ? localFaqs.map((faq) => faq.id === editingId ? nextItem : faq) : [...localFaqs, nextItem];
      writeLocalCms(FAQ_KEY, nextFaqs);
      setEditingId(nextItem.id);
      setSelected(nextItem);
      setSaving(false);
      loadFaqs();
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/faq${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      setEditingId(data.item.id);
      setSelected(data.item);
      loadFaqs();
    } catch (saveError) {
      setError(saveError.message || "Unable to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    setError("");

    if (usingFallback) {
      const nextFaqs = readLocalCms(FAQ_KEY, seedFaqs).filter((faq) => faq.id !== id);
      writeLocalCms(FAQ_KEY, nextFaqs);
      if (editingId === id) startCreate();
      loadFaqs();
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/faq/${id}`, { method: "DELETE" });
      if (editingId === id) startCreate();
      loadFaqs();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete FAQ.");
    }
  };

  const toggleStatus = async (faq) => {
    const next = { ...faq, status: faq.status === "Published" ? "Draft" : "Published" };
    if (usingFallback) {
      const nextFaqs = readLocalCms(FAQ_KEY, seedFaqs).map((item) => item.id === faq.id ? next : item);
      writeLocalCms(FAQ_KEY, nextFaqs);
      loadFaqs();
      return;
    }
    await cmsFetchJson(`/api/admin/faq/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    loadFaqs();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadFaqs({ page: 1 });
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  return (
    <>
      <PageHeader
        title="FAQ CMS"
        eyebrow="FAQ"
        description="Manage questions, answers, categories, publishing status, order, and public FAQ preview."
        actions={<button type="button" onClick={startCreate} className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white"><Plus className="mr-2 inline" size={17} />Add FAQ</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">FAQ is using a local browser draft because the production CMS API route is not deployed yet.</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <section className="admin-card flex flex-wrap items-center gap-3 rounded-[32px] p-4">
            <form onSubmit={handleSearch} className="relative min-w-64 flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search FAQs..." />
            </form>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
                loadFaqs({ page: 1, category: event.target.value });
              }}
              className="admin-field max-w-52"
            >
              <option>All</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </section>

          <section className="admin-card rounded-[32px] p-6">
            <h3 className="mb-4 text-xl font-black text-[#514aa3]">FAQ records</h3>
            <div className="overflow-hidden rounded-[26px] border border-violet-100 bg-white/70">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Question</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center font-bold text-slate-400">{loading ? "Loading FAQs..." : "No FAQs found."}</td></tr>
                  ) : faqs.map((faq) => (
                    <tr key={faq.id} className={`border-t border-violet-100/70 ${editingId === faq.id ? "bg-violet-50" : ""}`}>
                      <td className="px-5 py-4 font-black text-slate-500">{faq.order_index}</td>
                      <td className="px-5 py-4 font-black text-[#454083]">{faq.question}</td>
                      <td className="px-5 py-4 text-slate-500">{faq.category}</td>
                      <td className="px-5 py-4"><button type="button" onClick={() => toggleStatus(faq)}><StatusBadge status={faq.status} /></button></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(faq)} className="admin-icon-button h-10 w-10" aria-label="Edit FAQ"><Pencil size={16} /></button>
                          <button type="button" onClick={() => deleteFaq(faq.id)} className="admin-icon-button h-10 w-10 text-rose-500" aria-label="Delete FAQ"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button className="admin-icon-button h-10 w-10" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}><ChevronLeft size={17} /></button>
                <button className="admin-icon-button h-10 w-10" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}><ChevronRight size={17} /></button>
              </div>
            </div>
          </section>

          <form onSubmit={saveFaq} className="admin-card rounded-[32px] p-6">
            <h3 className="text-xl font-black text-[#514aa3]">{editingId ? "Edit FAQ" : "Create FAQ"}</h3>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-black text-slate-600">Question<input required value={selected.question} onChange={(event) => update("question", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Answer<textarea required value={selected.answer} onChange={(event) => update("answer", event.target.value)} className="admin-field min-h-28 rounded-[22px]" /></label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-black text-slate-600">Category<input value={selected.category} onChange={(event) => update("category", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Order<input type="number" value={selected.order_index} onChange={(event) => update("order_index", Number(event.target.value))} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Status<select value={selected.status} onChange={(event) => update("status", event.target.value)} className="admin-field"><option>Published</option><option>Draft</option></select></label>
              </div>
              <button disabled={saving} className="w-fit rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white">{saving ? "Saving..." : "Save FAQ"}</button>
            </div>
          </form>
        </main>

        <aside className="admin-card sticky top-28 h-fit rounded-[32px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
          <h3 className="mt-1 text-xl font-black text-[#514aa3]">FAQ accordion</h3>
          <div className="mt-5 grid gap-3">
            {faqs.filter((faq) => faq.status === "Published").slice(0, 6).map((faq) => (
              <div key={faq.id} className="rounded-[22px] bg-white/70 p-4">
                <p className="text-sm font-black text-[#454083]">{faq.question}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export default FaqCmsPage;
