const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGINAL_PRICE = 15;
const DATA_FILE = path.join(__dirname, "coupons-store.json");
const PAYMENTS_DIR = path.join(__dirname, "public", "payments");

fs.mkdirSync(PAYMENTS_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use("/payments", express.static(PAYMENTS_DIR));

function readCoupons() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeCoupons(coupons) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(coupons, null, 2));
}

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function toPublicQrPath(qrImage) {
  if (!qrImage) return "";
  if (qrImage.startsWith("/payments/")) return qrImage;
  return `/payments/${qrImage}`;
}

function serializeCoupon(coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    discountPercentage: Number(coupon.discountPercentage),
    savedAmount: Number(coupon.savedAmount),
    finalPrice: Number(coupon.finalPrice),
    qrImage: coupon.qrImage,
    active: Boolean(coupon.active),
  };
}

function saveQrUpload({ code, qrImageDataUrl, qrImageName }) {
  if (!qrImageDataUrl) return "";

  const match = String(qrImageDataUrl).match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("QR image upload must be an image file.");
  }

  const extension = path.extname(qrImageName || "").replace(".", "") || match[1].replace("jpeg", "jpg");
  const safeExtension = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const fileName = `${normalizeCode(code).toLowerCase()}-${Date.now()}.${safeExtension}`;
  const filePath = path.join(PAYMENTS_DIR, fileName);

  fs.writeFileSync(filePath, Buffer.from(match[2], "base64"));
  return fileName;
}

app.post("/api/coupons/validate", (req, res) => {
  const code = normalizeCode(req.body.code);
  const coupon = readCoupons().find((item) => item.code === code && item.active);

  if (!coupon) {
    return res.status(404).json({
      valid: false,
      message: "Invalid or expired coupon",
    });
  }

  return res.json({
    valid: true,
    discount: Number(coupon.discountPercentage),
    savedAmount: Number(coupon.savedAmount),
    finalAmount: Number(coupon.finalPrice),
    qrImage: toPublicQrPath(coupon.qrImage),
    message: `Congratulations! You saved $${Number(coupon.savedAmount).toFixed(2)} 🎉`,
  });
});

app.get("/api/admin/coupons", (_req, res) => {
  res.json({ coupons: readCoupons().map(serializeCoupon) });
});

app.post("/api/admin/coupons", (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const discountPercentage = Number(req.body.discountPercentage);
    const finalPrice = Number(req.body.finalPrice);

    if (!code || Number.isNaN(discountPercentage) || Number.isNaN(finalPrice)) {
      return res.status(400).json({ message: "Code, discount %, and final price are required." });
    }

    const qrImage = saveQrUpload({
      code,
      qrImageDataUrl: req.body.qrImageDataUrl,
      qrImageName: req.body.qrImageName,
    });

    if (!qrImage) {
      return res.status(400).json({ message: "Upload a static QR image for this coupon." });
    }

    const coupons = readCoupons();
    const existingIndex = coupons.findIndex((coupon) => coupon.code === code);
    const savedAmount = Math.max(0, ORIGINAL_PRICE - finalPrice);
    const nextCoupon = {
      id: existingIndex >= 0 ? coupons[existingIndex].id : Date.now(),
      code,
      discountPercentage,
      savedAmount,
      finalPrice,
      qrImage,
      active: Boolean(req.body.active),
    };

    if (existingIndex >= 0) {
      coupons[existingIndex] = nextCoupon;
    } else {
      coupons.push(nextCoupon);
    }

    writeCoupons(coupons);

    return res.status(201).json({
      message: "Coupon saved successfully.",
      coupon: serializeCoupon(nextCoupon),
      coupons: coupons.map(serializeCoupon),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to save coupon." });
  }
});

app.patch("/api/admin/coupons/:id", (req, res) => {
  const coupons = readCoupons();
  const couponIndex = coupons.findIndex((coupon) => String(coupon.id) === String(req.params.id));

  if (couponIndex === -1) {
    return res.status(404).json({ message: "Coupon not found." });
  }

  coupons[couponIndex] = {
    ...coupons[couponIndex],
    active: Boolean(req.body.active),
  };

  writeCoupons(coupons);

  return res.json({
    message: "Coupon updated successfully.",
    coupon: serializeCoupon(coupons[couponIndex]),
    coupons: coupons.map(serializeCoupon),
  });
});

app.listen(PORT, () => {
  console.log(`MedInnovate backend running on port ${PORT}`);
});
