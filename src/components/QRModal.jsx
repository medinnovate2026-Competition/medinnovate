import React from "react";
import { resolveAssetUrl } from "../config";

export default function QRModal({
  onClose,
  qrImage = "payments/qr10.png",
  finalAmount = 10,
  couponApplied = false,
}) {
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [qrImage]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full border border-slate-200 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Scan & Pay</h2>
        <p className="text-slate-500 font-medium text-sm mb-6">
          Pay exactly ${finalAmount} via any UPI app
        </p>

        <div
          className={`bg-white border border-slate-200 shadow-sm p-4 rounded-xl inline-flex h-56 w-56 items-center justify-center mb-6 transition-all duration-300 ${
            couponApplied ? "scale-105 border-green-300 shadow-green-100" : ""
          }`}
        >
          {imageFailed ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-semibold text-slate-500">
              Static QR image missing. Upload or place this QR file on the server.
            </div>
          ) : (
            <img
              src={resolveAssetUrl(qrImage)}
              alt="Payment QR Code"
              className="w-48 h-48 object-contain transition-opacity duration-300"
              onError={() => setImageFailed(true)}
            />
          )}
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
