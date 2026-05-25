import { useEffect, useState } from "react";
import {
  Activity,
  BadgePercent,
  CircleDollarSign,
  CreditCard,
  RefreshCw,
  UsersRound,
  UserRoundCheck,
} from "lucide-react";
import PageHeader from "./components/PageHeader";
import StatCard from "./components/StatCard";
import { cmsFetchJson, isCmsApiUnavailable } from "./utils/cmsApi";

const initialDashboard = {
  registrations_count: 0,
  team_count: 0,
  payment_count: 0,
  revenue: 0,
  coupon_count: 0,
  recent_registrations: [],
  recent_payments: [],
  recent_activity: [],
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
      <div className="overflow-hidden rounded-[26px] border border-violet-100/80 bg-white/70">
        <table className="w-full min-w-[620px] text-left text-sm">
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

function Dashboard() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/dashboard");
      setDashboard({ ...initialDashboard, ...data });
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setDashboard(initialDashboard);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    { title: "Total registrations", value: dashboard.registrations_count, detail: "All submitted registration records.", icon: UserRoundCheck, tone: "lavender" },
    { title: "Teams", value: dashboard.team_count, detail: "Registered teams in the current database.", icon: UsersRound, tone: "cyan" },
    { title: "Payments", value: dashboard.payment_count, detail: "Registrations with transaction references.", icon: CreditCard, tone: "mint" },
    { title: "Revenue", value: formatMoney(dashboard.revenue), detail: "Total recorded registration revenue.", icon: CircleDollarSign, tone: "amber" },
    { title: "Coupons used", value: dashboard.coupon_count, detail: "Registrations submitted with a coupon.", icon: BadgePercent, tone: "rose" },
  ];

  const registrationRows = dashboard.recent_registrations.map((registration) => ({
    id: registration.id,
    cells: [
      `#${registration.team_id}`,
      registration.leader || registration.team_name,
      registration.country || "Not set",
      registration.coupon || "None",
      formatMoney(registration.amount),
      formatDate(registration.date),
    ],
  }));

  const paymentRows = dashboard.recent_payments.map((payment) => ({
    id: payment.id,
    cells: [
      `#${payment.team_id}`,
      payment.leader || payment.team_name,
      formatMoney(payment.amount),
      payment.utr || "Missing",
      formatDate(payment.date),
    ],
  }));

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Command center"
        description="Live operational overview for registrations, teams, payments, revenue, and coupon usage."
        actions={
          <button type="button" onClick={loadDashboard} className="admin-button admin-button-secondary" disabled={loading}>
            <RefreshCw size={16} />
            {loading ? "Refreshing" : "Refresh"}
          </button>
        }
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Dashboard is showing empty local state because the production CMS API route is not deployed yet.</div>}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} value={loading ? "..." : stat.value} />)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <MiniTable
          title="Recent registrations"
          columns={["Team ID", "Leader", "Country", "Coupon", "Amount", "Date"]}
          rows={registrationRows}
          empty={loading ? "Loading registrations..." : "No registrations yet."}
        />
        <section className="admin-card rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-[#514aa3]">Recent activity</h3>
            <Activity className="text-violet-500" size={21} />
          </div>
          <div className="grid gap-3">
            {dashboard.recent_activity.length === 0 ? (
              <div className="rounded-[24px] border border-violet-100 bg-white p-4 text-sm font-bold text-slate-400">
                {loading ? "Loading activity..." : "No activity yet."}
              </div>
            ) : dashboard.recent_activity.map((activity) => (
              <div key={activity.id} className="rounded-[24px] border border-white/80 bg-gradient-to-r from-[#f4f1ff] to-white p-4 shadow-sm">
                <p className="text-sm font-black text-[#454083]">{activity.label}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{formatDate(activity.date)}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mt-6">
        <MiniTable
          title="Recent payments"
          columns={["Team ID", "Leader", "Amount", "Transaction ID", "Date"]}
          rows={paymentRows}
          empty={loading ? "Loading payments..." : "No payments yet."}
        />
      </section>
    </>
  );
}

export default Dashboard;
