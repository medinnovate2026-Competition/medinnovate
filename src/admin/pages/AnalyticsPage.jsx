import { useEffect, useMemo, useState } from "react";
import { BadgePercent, CircleDollarSign, CreditCard, RefreshCw, ReceiptText, UsersRound } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { cmsFetchJson, isCmsApiUnavailable } from "../utils/cmsApi";

const initialAnalytics = {
  summary: {
    registrations: 0,
    participants: 0,
    verified_payments: 0,
    not_verified_payments: 0,
    coupon_registrations: 0,
    main_qr_registrations: 0,
    verified_revenue: 0,
    submitted_revenue: 0,
    coupon_revenue: 0,
    main_qr_revenue: 0,
  },
  coupon_breakdown: [],
  recent_payments: [],
};

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function MiniTable({ title, columns, rows, empty }) {
  return (
    <section className="admin-card rounded-[32px] p-6">
      <h3 className="mb-5 text-xl font-black text-[#514aa3]">{title}</h3>
      <div className="overflow-x-auto rounded-[26px] border border-violet-100/80 bg-white/70">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
            <tr>{columns.map((column) => <th key={column} className="px-5 py-4">{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center font-bold text-slate-400" colSpan={columns.length}>{empty}</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-violet-100/70">
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`} className="px-5 py-4 text-slate-600 first:font-black first:text-[#454083]">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/analytics");
      setAnalytics({ ...initialAnalytics, ...data, summary: { ...initialAnalytics.summary, ...(data.summary || {}) } });
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setAnalytics(initialAnalytics);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load finance analytics.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const summary = analytics.summary;
  const couponRate = summary.registrations ? Math.round((summary.coupon_registrations / summary.registrations) * 100) : 0;
  const verificationRate = summary.registrations ? Math.round((summary.verified_payments / summary.registrations) * 100) : 0;

  const stats = [
    { title: "Money made", value: formatMoney(summary.verified_revenue), detail: "Only manually verified payments are counted.", icon: CircleDollarSign, tone: "amber" },
    { title: "Submitted amount", value: formatMoney(summary.submitted_revenue), detail: "Total claimed by registrations before verification.", icon: ReceiptText, tone: "lavender" },
    { title: "Verified payments", value: summary.verified_payments, detail: `${verificationRate}% of registrations verified.`, icon: CreditCard, tone: "mint" },
    { title: "Coupons used", value: summary.coupon_registrations, detail: `${couponRate}% of teams registered with a coupon.`, icon: BadgePercent, tone: "rose" },
    { title: "Participants", value: summary.participants, detail: "Total participants from submitted team sizes.", icon: UsersRound, tone: "cyan" },
  ];

  const revenueSplit = [
    { label: "Main QR revenue", value: summary.main_qr_revenue, count: summary.main_qr_registrations },
    { label: "Coupon QR revenue", value: summary.coupon_revenue, count: summary.coupon_registrations },
  ];

  const maxRevenue = Math.max(...revenueSplit.map((item) => Number(item.value || 0)), 1);

  const couponRows = useMemo(() => analytics.coupon_breakdown.map((coupon) => ({
    id: coupon.coupon,
    cells: [
      coupon.coupon,
      coupon.registrations,
      coupon.verified_payments,
      formatMoney(coupon.revenue),
    ],
  })), [analytics.coupon_breakdown]);

  const paymentRows = useMemo(() => analytics.recent_payments.map((payment) => ({
    id: payment.id,
    cells: [
      `#${payment.team_id}`,
      payment.leader || payment.team_name,
      payment.coupon || "No coupon",
      formatMoney(payment.amount),
      payment.utr || "Missing",
      formatDate(payment.date),
    ],
  })), [analytics.recent_payments]);

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Finance analytics"
        description="Track verified revenue, coupon usage, QR performance, payment verification, and recent finance activity."
        actions={
          <button type="button" onClick={loadAnalytics} className="admin-button admin-button-secondary" disabled={loading}>
            <RefreshCw size={16} />
            {loading ? "Refreshing" : "Refresh"}
          </button>
        }
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Analytics are empty because the production API route is not available yet.</div>}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} value={loading ? "..." : stat.value} />)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="admin-card rounded-[32px] p-6">
          <h3 className="text-xl font-black text-[#514aa3]">Revenue by QR</h3>
          <div className="mt-6 grid gap-5">
            {revenueSplit.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-violet-100 bg-white/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-700">{item.label}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{item.count} registrations</p>
                  </div>
                  <p className="text-lg font-black text-[#514aa3]">{formatMoney(item.value)}</p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-violet-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
                    style={{ width: `${Math.max(4, (Number(item.value || 0) / maxRevenue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card rounded-[32px] p-6">
          <h3 className="text-xl font-black text-[#514aa3]">Verification queue</h3>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Verified</p>
              <p className="mt-2 text-4xl font-black text-emerald-800">{summary.verified_payments}</p>
            </div>
            <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">Not verified</p>
              <p className="mt-2 text-4xl font-black text-amber-800">{summary.not_verified_payments}</p>
            </div>
          </div>
        </section>
      </section>

      <section className="mt-6">
        <MiniTable
          title="Coupon performance"
          columns={["Coupon", "Registrations", "Verified", "Revenue"]}
          rows={couponRows}
          empty={loading ? "Loading coupon performance..." : "No coupon data yet."}
        />
      </section>

      <section className="mt-6">
        <MiniTable
          title="Recent verified payments"
          columns={["Team ID", "Leader", "Coupon", "Amount", "Transaction ID", "Date"]}
          rows={paymentRows}
          empty={loading ? "Loading payments..." : "No verified payments yet."}
        />
      </section>
    </>
  );
}

export default AnalyticsPage;
