import { useEffect, useState } from "react";
import { BadgePercent, ImageUp, RefreshCw, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { resolveAssetUrl } from "../../config";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";

const initialForm = {
  code: "",
  discountPercentage: "",
  finalPrice: "",
  qrImageUrl: "",
  qrImageFile: null,
  active: true,
};

const COUPONS_KEY = "medinnovate_coupons_cms";
const PAYMENT_SETTINGS_KEY = "medinnovate_payment_settings_cms";
const ORIGINAL_PRICE = 10;
const DEFAULT_PAYSTACK_QR_IMAGE = "https://i.postimg.cc/BnMcnsrT/Paystack-QR.jpg";
const DEFAULT_PAYSTACK_PAYMENT_LINK = "https://paystack.com/buy/medinnovate-20-dhnwdw";
const DEFAULT_CASHFREE_QR_IMAGE = "https://i.postimg.cc/Hkj3MqWr/qr1000.jpg";
const defaultPaymentSettings = {
  default_qr_image: "https://i.postimg.cc/Hkj3MqWr/qr1000.jpg",
  upi_enabled: true,
  paystack_enabled: false,
  paystack_qr_url: DEFAULT_PAYSTACK_QR_IMAGE,
  paystack_payment_link: DEFAULT_PAYSTACK_PAYMENT_LINK,
  paystack_instructions: "For African delegates please use Paystack.",
  cashfree_enabled: false,
  cashfree_qr_url: DEFAULT_CASHFREE_QR_IMAGE,
  cashfree_instructions: "Use Cashfree QR, then enter your transaction ID.",
};
const seedCoupons = [
  {
    id: 1,
    code: "MEDIN10",
    discountPercentage: 10,
    savedAmount: 1,
    finalPrice: 9,
    qrImage: "https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg",
    active: true,
  },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function CouponsCmsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(defaultPaymentSettings);
  const [paystackQrFile, setPaystackQrFile] = useState(null);
  const [cashfreeQrFile, setCashfreeQrFile] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/coupons");
      setCoupons(data.coupons || []);
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setCoupons(readLocalCms(COUPONS_KEY, seedCoupons));
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load coupons.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentSettings = async () => {
    try {
      const data = await cmsFetchJson("/api/admin/payment-settings");
      if (data.settings) setPaymentSettings({ ...defaultPaymentSettings, ...data.settings });
    } catch (settingsError) {
      if (isCmsApiUnavailable(settingsError)) {
        setPaymentSettings({ ...defaultPaymentSettings, ...readLocalCms(PAYMENT_SETTINGS_KEY, paymentSettings) });
        setUsingFallback(true);
      } else {
        setError(settingsError.message || "Unable to load payment settings.");
      }
    }
  };

  useEffect(() => {
    loadCoupons();
    loadPaymentSettings();
  }, []);

  const savePaymentSettings = async () => {
    setSavingSettings(true);
    setMessage("");
    setError("");

    let nextPaymentSettings = { ...paymentSettings };

    if (!nextPaymentSettings.upi_enabled && !nextPaymentSettings.paystack_enabled && !nextPaymentSettings.cashfree_enabled) {
      setError("At least one payment method must be enabled.");
      setSavingSettings(false);
      return;
    }

    if (paystackQrFile && !usingFallback) {
      try {
        const formData = new FormData();
        formData.append("file", paystackQrFile);
        formData.append("folder", "payments");
        const upload = await cmsFetchJson("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });
        nextPaymentSettings = { ...nextPaymentSettings, paystack_qr_url: upload.url || upload.path || nextPaymentSettings.paystack_qr_url };
      } catch (uploadError) {
        setError(uploadError.message || "Unable to upload Paystack QR.");
        setSavingSettings(false);
        return;
      }
    }

    if (cashfreeQrFile && !usingFallback) {
      try {
        const formData = new FormData();
        formData.append("file", cashfreeQrFile);
        formData.append("folder", "payments");
        const upload = await cmsFetchJson("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });
        nextPaymentSettings = { ...nextPaymentSettings, cashfree_qr_url: upload.url || upload.path || nextPaymentSettings.cashfree_qr_url };
      } catch (uploadError) {
        setError(uploadError.message || "Unable to upload Cashfree QR.");
        setSavingSettings(false);
        return;
      }
    }

    if (usingFallback) {
      writeLocalCms(PAYMENT_SETTINGS_KEY, nextPaymentSettings);
      setPaymentSettings(nextPaymentSettings);
      setMessage("Payment methods saved locally. Deploy the latest backend to save this to Railway.");
      setSavingSettings(false);
      return;
    }

    try {
      const data = await cmsFetchJson("/api/admin/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultQrImage: nextPaymentSettings.default_qr_image,
          upi_enabled: nextPaymentSettings.upi_enabled,
          paystack_enabled: nextPaymentSettings.paystack_enabled,
          paystack_qr_url: nextPaymentSettings.paystack_qr_url,
          paystack_payment_link: nextPaymentSettings.paystack_payment_link,
          paystack_instructions: nextPaymentSettings.paystack_instructions,
          cashfree_enabled: nextPaymentSettings.cashfree_enabled,
          cashfree_qr_url: nextPaymentSettings.cashfree_qr_url,
          cashfree_instructions: nextPaymentSettings.cashfree_instructions,
        }),
      });

      setPaymentSettings({ ...defaultPaymentSettings, ...data.settings });
      setPaystackQrFile(null);
      setCashfreeQrFile(null);
      setMessage("Payment methods updated.");
    } catch (settingsError) {
      setError(settingsError.message || "Unable to save payment methods.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const qrImageDataUrl = form.qrImageFile ? await readFileAsDataUrl(form.qrImageFile) : "";

      if (usingFallback) {
        const localCoupons = readLocalCms(COUPONS_KEY, seedCoupons);
        const qrImage = form.qrImageUrl || qrImageDataUrl || "https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg";
        const finalPrice = Number(form.finalPrice);
        const nextCoupon = {
          id: Date.now(),
          code: form.code.toUpperCase(),
          discountPercentage: Number(form.discountPercentage),
          savedAmount: Math.max(0, ORIGINAL_PRICE - finalPrice),
          finalPrice,
          qrImage,
          active: form.active,
        };
        const nextCoupons = [...localCoupons.filter((coupon) => coupon.code !== nextCoupon.code), nextCoupon];
        writeLocalCms(COUPONS_KEY, nextCoupons);
        setCoupons(nextCoupons);
        setForm(initialForm);
        setMessage("Coupon saved locally. Deploy the backend to make this persist in Railway.");
        setSaving(false);
        return;
      }

      const data = await cmsFetchJson("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          discountPercentage: Number(form.discountPercentage),
          finalPrice: Number(form.finalPrice),
          qrImageDataUrl,
          qrImageName: form.qrImageFile?.name || "",
          qrImageUrl: form.qrImageUrl,
          active: form.active,
        }),
      });

      setCoupons(data.coupons || []);
      setForm(initialForm);
      setMessage("Coupon saved. This code will now swap the payment QR when applied.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon) => {
    setMessage("");
    setError("");

    if (usingFallback) {
      const nextCoupons = coupons.map((item) => item.id === coupon.id ? { ...item, active: !item.active } : item);
      setCoupons(nextCoupons);
      writeLocalCms(COUPONS_KEY, nextCoupons);
      setMessage(`${coupon.code} ${coupon.active ? "deactivated" : "activated"} locally.`);
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });

      setCoupons(data.coupons || []);
      setMessage(`${coupon.code} ${coupon.active ? "deactivated" : "activated"}.`);
    } catch (toggleError) {
      setError(toggleError.message || "Unable to update coupon.");
    }
  };

  const deleteCoupon = async (coupon) => {
    const confirmed = window.confirm(`Remove coupon ${coupon.code}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingCouponId(coupon.id);
    setMessage("");
    setError("");

    if (usingFallback) {
      const nextCoupons = coupons.filter((item) => item.id !== coupon.id);
      setCoupons(nextCoupons);
      writeLocalCms(COUPONS_KEY, nextCoupons);
      setMessage(`${coupon.code} removed locally.`);
      setDeletingCouponId(null);
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/coupons/${coupon.id}`, {
        method: "DELETE",
      });

      setCoupons(data.coupons || []);
      setMessage(`${coupon.code} removed.`);
    } catch (deleteError) {
      setError(deleteError.message || "Unable to remove coupon.");
    } finally {
      setDeletingCouponId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CMS"
        title="Coupon QR Manager"
        description="Create coupon codes and attach the matching static payment QR. The public registration page swaps to this QR after validation."
        actions={
          <button type="button" onClick={loadCoupons} className="admin-button admin-button-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
        <div className="rounded-[28px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.12)] backdrop-blur">
          <h2 className="text-xl font-black text-slate-950">Payment Methods</h2>
          <p className="mt-1 text-sm text-slate-500">Control whether participants can pay by UPI, Paystack, Cashfree, or a combination.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-black text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(paymentSettings.upi_enabled)}
                onChange={(event) => setPaymentSettings({ ...paymentSettings, upi_enabled: event.target.checked })}
                className="h-4 w-4 accent-[#7C3AED]"
              />
              Enable UPI
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-black text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(paymentSettings.paystack_enabled)}
                onChange={(event) => setPaymentSettings({ ...paymentSettings, paystack_enabled: event.target.checked })}
                className="h-4 w-4 accent-[#7C3AED]"
              />
              Enable Paystack
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-black text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(paymentSettings.cashfree_enabled)}
                onChange={(event) => setPaymentSettings({ ...paymentSettings, cashfree_enabled: event.target.checked })}
                className="h-4 w-4 accent-[#7C3AED]"
              />
              Enable Cashfree
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-fuchsia-50">
              <img src={resolveAssetUrl(paymentSettings.default_qr_image)} alt="UPI payment QR" className="h-full w-full object-cover" />
            </div>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">UPI QR URL</span>
              <input
                value={paymentSettings.default_qr_image || ""}
                onChange={(event) => setPaymentSettings({ ...paymentSettings, default_qr_image: event.target.value })}
                className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
              />
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-fuchsia-50">
              {paymentSettings.paystack_qr_url ? (
                <img src={resolveAssetUrl(paymentSettings.paystack_qr_url)} alt="Paystack QR" className="h-full w-full object-cover" />
              ) : (
                <span className="px-3 text-center text-xs font-black text-slate-400">Paystack QR</span>
              )}
            </div>
            <div className="grid gap-3">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Paystack QR upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setPaystackQrFile(event.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-dashed border-violet-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-violet-700"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Or Paystack QR URL</span>
                <input
                  value={paymentSettings.paystack_qr_url || ""}
                  onChange={(event) => setPaymentSettings({ ...paymentSettings, paystack_qr_url: event.target.value })}
                  className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
                />
              </label>
            </div>
          </div>
          <label className="mt-5 block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Paystack payment link</span>
            <input
              value={paymentSettings.paystack_payment_link || ""}
              onChange={(event) => setPaymentSettings({ ...paymentSettings, paystack_payment_link: event.target.value })}
              placeholder="https://paystack.com/pay/xxxx"
              className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
            />
          </label>
          <label className="mt-5 block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Paystack instructions</span>
            <textarea
              value={paymentSettings.paystack_instructions || ""}
              onChange={(event) => setPaymentSettings({ ...paymentSettings, paystack_instructions: event.target.value })}
              placeholder="For African delegates please use Paystack."
              className="min-h-24 w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
            />
          </label>
          <div className="mt-5 grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-fuchsia-50">
              {paymentSettings.cashfree_qr_url ? (
                <img src={resolveAssetUrl(paymentSettings.cashfree_qr_url)} alt="Cashfree QR" className="h-full w-full object-cover" />
              ) : (
                <span className="px-3 text-center text-xs font-black text-slate-400">Cashfree QR</span>
              )}
            </div>
            <div className="grid gap-3">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Cashfree QR upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setCashfreeQrFile(event.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-dashed border-violet-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-violet-700"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Or Cashfree QR URL</span>
                <input
                  value={paymentSettings.cashfree_qr_url || ""}
                  onChange={(event) => setPaymentSettings({ ...paymentSettings, cashfree_qr_url: event.target.value })}
                  className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
                />
              </label>
            </div>
          </div>
          <label className="mt-5 block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Cashfree instructions</span>
            <textarea
              value={paymentSettings.cashfree_instructions || ""}
              onChange={(event) => setPaymentSettings({ ...paymentSettings, cashfree_instructions: event.target.value })}
              placeholder="Use Cashfree QR, then enter your transaction ID."
              className="min-h-24 w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
            />
          </label>
          <button
            type="button"
            onClick={savePaymentSettings}
            disabled={savingSettings}
            className="mt-5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingSettings ? "Saving..." : "Save Payment Methods"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.12)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white">
              <BadgePercent size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">Add Coupon</h2>
              <p className="text-sm text-slate-500">Final price should match the uploaded QR amount.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Code</span>
              <input
                value={form.code}
                onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
                required
                placeholder="EARLY20"
                className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Discount %</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discountPercentage}
                onChange={(event) => setForm({ ...form, discountPercentage: event.target.value })}
                required
                placeholder="20"
                className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Final Team Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.finalPrice}
                onChange={(event) => setForm({ ...form, finalPrice: event.target.value })}
                required
                placeholder="12"
                className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">QR Image</span>
              <div className="flex min-h-[46px] items-center gap-3 rounded-2xl border border-dashed border-violet-200 bg-white px-4 py-3 text-sm text-slate-500">
                <ImageUp size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setForm({ ...form, qrImageFile: event.target.files?.[0] || null })}
                  className="min-w-0 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-violet-700"
                />
              </div>
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Or QR Image URL</span>
              <input
                value={form.qrImageUrl}
                onChange={(event) => setForm({ ...form, qrImageUrl: event.target.value })}
                placeholder="https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg"
                className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-fuchsia-300"
              />
            </label>
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
              className="h-4 w-4 rounded border-violet-200 accent-[#7C3AED]"
            />
            Active immediately
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Coupon"}
          </button>
        </form>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.12)] backdrop-blur">
          <h2 className="text-xl font-black text-slate-950">Active Coupon Library</h2>
          <p className="mt-1 text-sm text-slate-500">Each code returns its own QR to the public registration form.</p>

          {message && <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{message}</div>}
          {usingFallback && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">Coupons are using a local browser draft because the production CMS API route is not deployed yet.</div>}
          {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm font-bold text-slate-500">Loading coupons...</div>
            ) : coupons.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm font-bold text-slate-500">No coupons yet.</div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="grid gap-4 rounded-3xl border border-violet-100 bg-white p-4 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-fuchsia-50">
                    <img src={resolveAssetUrl(coupon.qrImage)} alt={`${coupon.code} QR`} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-black text-slate-950">{coupon.code}</span>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">{coupon.discountPercentage}% off</span>
                      <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-black text-fuchsia-700">${coupon.finalPrice} final</span>
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-slate-400">{coupon.qrImage}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => toggleCoupon(coupon)}
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
                        coupon.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(coupon)}
                      disabled={deletingCouponId === coupon.id}
                      className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                      {deletingCouponId === coupon.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponsCmsPage;
