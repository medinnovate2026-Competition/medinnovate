import React from "react";

export default function QRModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#09051A] to-[#1a1a2e] p-8 rounded-2xl text-center max-w-sm w-full border border-fuchsia-300/25 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
        
        <h2 className="text-xl font-bold text-white mb-2">Scan & Pay</h2>
        <p className="text-fuchsia-300 text-sm mb-6">Pay exactly ₹429 via any UPI app</p>

        {/* QR Code Image */}
        <div className="bg-white p-4 rounded-xl inline-block mb-6">
          <img src="/qr.png" alt="Payment QR Code" className="w-48 h-48 object-contain" />
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Scan using GPay, PhonePe, Paytm, or any UPI app
        </p>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#12091F] shadow-[0_0_30px_rgba(168,85,247,0.4)] transition hover:-translate-y-1"
          >
            I Have Paid
          </button>
          <button
            onClick={onClose}
            className="text-slate-500 text-sm hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}