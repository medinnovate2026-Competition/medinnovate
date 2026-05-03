import React from "react";

export default function QRModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full border border-slate-200 shadow-xl">
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">Scan & Pay</h2>
        <p className="text-slate-500 font-medium text-sm mb-6">Pay exactly ₹429 via any UPI app</p>

        {/* QR Code Image */}
        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl inline-block mb-6">
          <img src={`${import.meta.env.BASE_URL}qr.png`} alt="Payment QR Code" className="w-48 h-48 object-contain" />
        </div>

        <p className="text-slate-600 font-medium text-sm mb-6">
          Scan using GPay, PhonePe, Paytm, or any UPI app
        </p>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            I Have Paid
          </button>
          <button
            onClick={onClose}
            className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}