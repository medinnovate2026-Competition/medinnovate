import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Filter, RefreshCw, Search, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
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
    setDetailsError("");
    setSelected(null);
    setDetailsOpen(true);
    setDetailsLoading(true);

    if (usingFallback) {
      setDetailsLoading(false);
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/registrations/${id}`);
      setSelected(data.registration);
    } catch (loadError) {
      setDetailsError(loadError.message || "Unable to load registration details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelected(null);
    setDetailsError("");
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
        actions={(
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
        )}
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

        <div className="overflow-x-auto rounded-[26px] border border-violet-100/80 bg-white/70">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
              <tr>
                {["Team ID", "Leader", "Phone", "College", "Members", "Country", "Referral", "Coupon", "Payment status", "Amount", "Date"].map((head) => (
                  <th key={head} className="px-5 py-4">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center font-bold text-slate-400">
                    {loading ? "Loading registrations..." : "No registrations found."}
                  </td>
                </tr>
              ) : filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="border-t border-violet-100/70">
                  <td className="px-5 py-4">
                    <p className="font-black text-[#454083]">#{registration.team_id}</p>
                    <button
                      type="button"
                      onClick={() => loadRegistrationDetails(registration.id)}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#5d55b9] shadow-sm transition hover:border-fuchsia-200 hover:text-[#EC4899]"
                      aria-label={`View team ${registration.team_id} details`}
                    >
                      <Eye size={14} />
                      Details
                    </button>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-400">Page {page} of {totalPages} - {total} records</p>
          <div className="flex gap-2">
            <button className="admin-button admin-button-secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>Previous</button>
            <button className="admin-button admin-button-secondary" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        </div>
      </section>

      {detailsOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-violet-100 bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">Registration team</p>
                <h3 className="mt-2 text-2xl font-black text-[#514aa3]">{selected ? selected.team_name : "Loading team details"}</h3>
                {selected && <p className="mt-1 text-sm font-bold text-slate-500">Team ID: {selected.team_id}</p>}
              </div>
              <button type="button" onClick={closeDetails} className="admin-icon-button" aria-label="Close team details">
                <X size={18} />
              </button>
            </div>

            {detailsLoading && (
              <div className="rounded-3xl border border-violet-100 bg-white p-8 text-center text-sm font-black text-violet-300">
                Loading team details...
              </div>
            )}

            {detailsError && (
              <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {detailsError}
              </div>
            )}

            {selected && !detailsLoading && (
              <div className="space-y-5">
                <section className="rounded-3xl border border-violet-100 bg-violet-50/50 p-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[#514aa3]">Transaction details</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <DetailRow label="Transaction ID" value={selected.utr} />
                    <DetailRow label="Payment" value={selected.payment_status} />
                    <DetailRow label="Amount" value={formatMoney(selected.amount)} />
                    <DetailRow label="Coupon" value={selected.coupon || "None"} />
                    <DetailRow label="Referral" value={selected.referral_code || "None"} />
                    <DetailRow label="Created at" value={formatDate(selected.date)} />
                  </div>
                </section>

                <section className="rounded-3xl border border-violet-100 bg-white p-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[#514aa3]">Leader details</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <DetailRow label="Name" value={selected.leader} />
                    <DetailRow label="Email" value={selected.leader_email} />
                    <DetailRow label="Phone" value={selected.leader_phone} />
                    <DetailRow label="College" value={selected.leader_college} />
                    <DetailRow label="Country" value={selected.country} />
                    <DetailRow label="Discipline" value={selected.leader_discipline} />
                  </div>
                </section>

                <section className="rounded-3xl border border-violet-100 bg-white p-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[#514aa3]">Participant details</h4>
                  <div className="mt-4 grid gap-3">
                    {selected.members.length === 0 ? (
                      <div className="rounded-2xl bg-violet-50/70 p-4 text-sm font-bold text-slate-400">No participant details found</div>
                    ) : selected.members.map((member, index) => (
                      <div key={member.id || `${member.email}-${index}`} className="rounded-2xl bg-violet-50/70 p-4">
                        <p className="font-black text-slate-800">Member {index + 1}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-600">Name: {member.name || "Not available"}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600">Email: {member.email || "Not available"}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600">College: {member.college || "Not available"}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600">Country: {member.country || "Not available"}</p>
                        {(member.role || member.is_leader) && (
                          <p className="mt-1 text-sm font-semibold text-slate-600">Role: {member.role || "Leader"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrationsPage;
