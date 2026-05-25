import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const initialForm = {
  code: "",
  discountPercentage: "",
  finalPrice: "",
  qrImageFile: null,
  active: true,
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCoupons = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/coupons`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load coupons.");
      }

      setCoupons(data.coupons || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      let qrImageDataUrl = "";
      let qrImageName = "";

      if (form.qrImageFile) {
        qrImageDataUrl = await readFileAsDataUrl(form.qrImageFile);
        qrImageName = form.qrImageFile.name;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          discountPercentage: Number(form.discountPercentage),
          finalPrice: Number(form.finalPrice),
          qrImageDataUrl,
          qrImageName,
          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save coupon.");
      }

      setForm(initialForm);
      setMessage("Coupon saved successfully.");
      setCoupons(data.coupons || []);
    } catch (saveError) {
      setError(saveError.message || "Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon) => {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update coupon.");
      }

      setCoupons(data.coupons || []);
      setMessage(`${coupon.code} ${coupon.active ? "deactivated" : "activated"}.`);
    } catch (toggleError) {
      setError(toggleError.message || "Unable to update coupon.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050314] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-200">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight">
            Coupon Management
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-purple-200/15 bg-[#09051A]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Coupon code"
              className="rounded-xl border border-purple-200/15 bg-[#050314] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-400 focus:outline-none"
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="Discount %"
              className="rounded-xl border border-purple-200/15 bg-[#050314] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-400 focus:outline-none"
              value={form.discountPercentage}
              onChange={(event) =>
                setForm({ ...form, discountPercentage: event.target.value })
              }
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Final price"
              className="rounded-xl border border-purple-200/15 bg-[#050314] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-400 focus:outline-none"
              value={form.finalPrice}
              onChange={(event) => setForm({ ...form, finalPrice: event.target.value })}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="rounded-xl border border-purple-200/15 bg-[#050314] px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-fuchsia-200 file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#12091F]"
              onChange={(event) =>
                setForm({ ...form, qrImageFile: event.target.files?.[0] || null })
              }
              required
            />
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
              className="h-4 w-4 rounded border-purple-200/30 bg-[#050314]"
            />
            Active coupon
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-8 py-3 text-sm font-black uppercase tracking-wide text-[#12091F] shadow-[0_0_42px_rgba(168,85,247,0.32)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Coupon"}
          </button>
        </form>

        {message && (
          <div className="mb-5 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-purple-200/15">
          <div className="grid grid-cols-5 gap-3 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>Code</span>
            <span>Discount</span>
            <span>Final</span>
            <span>QR Image</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-sm text-slate-400">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-400">No coupons yet.</div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="grid grid-cols-5 items-center gap-3 border-t border-purple-200/10 px-4 py-4 text-sm text-slate-200"
              >
                <span className="font-bold text-white">{coupon.code}</span>
                <span>{coupon.discountPercentage}%</span>
                <span>${coupon.finalPrice}</span>
                <span className="truncate text-slate-400">{coupon.qrImage}</span>
                <button
                  type="button"
                  onClick={() => toggleCoupon(coupon)}
                  className={`w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                    coupon.active
                      ? "bg-green-400/15 text-green-200"
                      : "bg-slate-500/15 text-slate-300"
                  }`}
                >
                  {coupon.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminCoupons;
