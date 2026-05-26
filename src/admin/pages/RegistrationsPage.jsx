import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Filter, RefreshCw, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Drawer from "../components/Drawer";
import { cmsFetchJson, isCmsApiUnavailable } from "../utils/cmsApi";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function csvValue(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function StatusPill({ status }) {
  const active = status === "Paid";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
      {status}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-700">{value || "Not available"}</p>
    </div>
  );
}

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const limit = 10;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filteredRegistrations = useMemo(() => {
    if (statusFilter === "all") return registrations;
    return registrations.filter((registration) => registration.payment_status === statusFilter);
  }, [registrations, statusFilter]);

  const loadRegistrations = async (options = {}) => {
    const nextPage = options.page || page;
    const nextSearch = options.search ?? search;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ page: String(nextPage), limit: String(limit), search: nextSearch });
      const data = await cmsFetchJson(`/api/admin/registrations?${params}`);
      setRegistrations(data.registrations || []);
      setTotal(Number(data.total || 0));
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setRegistrations([]);
        setTotal(0);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load registrations.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrationDetails = async (id) => {
    setError("");

    if (usingFallback) return;

    try {
      const data = await cmsFetchJson(`/api/admin/registrations/${id}`);
      setSelected(data.registration);
    } catch (loadError) {
      setError(loadError.message || "Unable to load registration details.");
    }
  };

  const exportCsv = () => {
    const headers = ["Team ID", "Team Name", "Leader", "Leader Email", "Leader Phone", "College", "Discipline", "Year", "Members", "Country", "Referral", "Coupon", "Payment Status", "Amount", "UTR", "Date", "Stage"];
    const rows = filteredRegistrations.map((registration) => [
      registration.team_id,
      registration.team_name,
      registration.leader,
      registration.leader_email,
      registration.leader_phone,
      registration.leader_college,
      registration.leader_discipline,
      registration.leader_year,
      registration.member_count,
      registration.country,
      registration.referral_code || "None",
      registration.coupon || "None",
      registration.payment_status,
      registration.amount,
      registration.utr,
      registration.date,
      registration.stage,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "medinnovate-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadRegistrations();
  }, [page]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadRegistrations({ page: 1, search });
  };

  return (
    <>
      <PageHeader
        eyebrow="Registrations"
        title="Registration management"
        description="Review teams, leader details, payment status, coupon usage, stages, and exportable registration records."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} className="admin-button admin-button-secondary">
              <Download size={16} />
              Export CSV
            </button>
            <button type="button" onClick={loadRegistrations} className="admin-button admin-button-secondary" disabled={loading}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        }
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Registrations are empty because the production CMS API route is not deployed yet.</div>}

      <section className="admin-card rounded-[32px] p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="admin-field w-full pl-11"
              placeholder="Search leader, team, country, referral, coupon, UTR"
            />
          </form>
          <label className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-black text-slate-600">
            <Filter size={16} className="text-violet-500" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent outline-none">
              <option value="all">All payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </label>
        </div>

        <div className="overflow-hidden rounded-[26px] border border-violet-100/80 bg-white/70">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
              <tr>
                {["Team ID", "Leader", "Phone", "College", "Members", "Country", "Referral", "Coupon", "Payment status", "Amount", "Date", "View"].map((head) => (
                  <th key={head} className="px-5 py-4">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-5 py-10 text-center font-bold text-slate-400">
                    {loading ? "Loading registrations..." : "No registrations found."}
                  </td>
                </tr>
              ) : filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="border-t border-violet-100/70">
                  <td className="px-5 py-4 font-black text-[#454083]">#{registration.team_id}</td>
                  <td className="px-5 py-4">
                    <p className="font-black text-slate-700">{registration.leader}</p>
                    <p className="text-xs font-semibold text-slate-400">{registration.leader_email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{registration.leader_phone || "Not set"}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-600">{registration.leader_college || "Not set"}</p>
                    <p className="text-xs font-semibold text-slate-400">{registration.leader_discipline || "Discipline not set"}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{registration.member_count}</td>
                  <td className="px-5 py-4 text-slate-600">{registration.country || "Not set"}</td>
                  <td className="px-5 py-4 text-slate-600">{registration.referral_code || "None"}</td>
                  <td className="px-5 py-4 text-slate-600">{registration.coupon || "None"}</td>
                  <td className="px-5 py-4"><StatusPill status={registration.payment_status} /></td>
                  <td className="px-5 py-4 font-black text-slate-700">{formatMoney(registration.amount)}</td>
                  <td className="px-5 py-4 text-slate-500">{formatDate(registration.date)}</td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => loadRegistrationDetails(registration.id)} className="admin-icon-button h-10 w-10" aria-label="View details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-400">Page {page} of {totalPages} · {total} records</p>
          <div className="flex gap-2">
            <button className="admin-button admin-button-secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>Previous</button>
            <button className="admin-button admin-button-secondary" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        </div>
      </section>

      <Drawer open={Boolean(selected)} title={selected ? `Team #${selected.team_id}` : "Registration"} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Leader" value={selected.leader} />
              <DetailRow label="Leader email" value={selected.leader_email} />
              <DetailRow label="Leader phone" value={selected.leader_phone} />
              <DetailRow label="Country" value={selected.country} />
              <DetailRow label="College" value={selected.leader_college} />
              <DetailRow label="Discipline" value={selected.leader_discipline} />
              <DetailRow label="Year" value={selected.leader_year} />
              <DetailRow label="Gender" value={selected.leader_gender} />
              <DetailRow label="Referral" value={selected.referral_code || "None"} />
              <DetailRow label="Coupon" value={selected.coupon || "None"} />
              <DetailRow label="Payment" value={selected.payment_status} />
              <DetailRow label="Amount" value={formatMoney(selected.amount)} />
              <DetailRow label="Transaction ID" value={selected.utr} />
              <DetailRow label="Stage" value={selected.stage} />
              <DetailRow label="Date" value={formatDate(selected.date)} />
            </div>
            <div className="mt-4 rounded-3xl border border-violet-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[#514aa3]">Members</h4>
              <div className="mt-4 grid gap-3">
                {selected.members.map((member, index) => (
                  <div key={member.id} className="rounded-2xl bg-violet-50/70 p-4">
                    <p className="font-black text-slate-800">Member {index + 1}: {member.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{member.email}</p>
                    {member.phone && <p className="mt-1 text-sm font-semibold text-slate-500">Phone: {member.phone}</p>}
                    <p className="mt-1 text-sm font-semibold text-slate-500">{member.discipline || "Discipline not set"} · {member.study_year || "Year not set"}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{member.college || "College not set"} · {member.country || "Country not set"}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}

export default RegistrationsPage;
