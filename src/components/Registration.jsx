import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { API_BASE_URL, resolveAssetUrl } from "../config";

const DRAFT_KEY = "medinnovate_registration_draft";
const ORIGINAL_PRICE = 10;
const MIN_TEAM_SIZE = 3;
const MAX_TEAM_SIZE = 5;
const REQUIRED_TEAMMATES = MIN_TEAM_SIZE - 1;
const DEFAULT_QR_IMAGE = "https://i.postimg.cc/Hkj3MqWr/qr1000.jpg";
const DEFAULT_PAYSTACK_QR_IMAGE = "https://i.postimg.cc/BnMcnsrT/Paystack-QR.jpg";
const DEFAULT_PAYSTACK_PAYMENT_LINK = "https://paystack.com/buy/medinnovate-20-dhnwdw";
const DEFAULT_CASHFREE_QR_IMAGE = DEFAULT_QR_IMAGE;
const LEGACY_LOCAL_COUPON_QR = "https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg";
const LOCAL_COUPONS = {
  MEDIN10: {
    valid: true,
    discount: 10,
    savedAmount: 1,
    finalAmount: 9,
    qrImage: LEGACY_LOCAL_COUPON_QR,
    message: "Congratulations! You saved $1.00",
  },
};

const defaultPaymentSettings = {
  defaultQrImage: DEFAULT_QR_IMAGE,
  default_qr_image: DEFAULT_QR_IMAGE,
  upi_enabled: true,
  paystack_enabled: false,
  paystack_qr_url: DEFAULT_PAYSTACK_QR_IMAGE,
  paystackQrUrl: DEFAULT_PAYSTACK_QR_IMAGE,
  paystack_payment_link: DEFAULT_PAYSTACK_PAYMENT_LINK,
  paystack_instructions: "For African delegates please use Paystack.",
  cashfree_enabled: false,
  cashfree_qr_url: DEFAULT_CASHFREE_QR_IMAGE,
  cashfreeQrUrl: DEFAULT_CASHFREE_QR_IMAGE,
  cashfree_instructions: "Use Cashfree QR, then enter your transaction ID.",
  razorpay_enabled: false,
  razorpay_payment_link: "",
};

const steps = ["Referral", "Leader", "Team", "Review", "Payment"];

const emptyLeader = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  college: "",
  discipline: "",
  year: "",
  gender: "",
};

const emptyMember = {
  fullName: "",
  email: "",
  country: "",
  college: "",
  discipline: "",
  year: "",
};

function createMembers() {
  return Array.from({ length: 4 }, () => ({ ...emptyMember }));
}

function normalizeMemberSlots(members) {
  if (!Array.isArray(members)) return createMembers();
  return [...members.slice(0, MAX_TEAM_SIZE - 1), ...createMembers()].slice(0, MAX_TEAM_SIZE - 1);
}

function memberHasAnyDetails(member) {
  return Object.values(member || {}).some((value) => String(value || "").trim());
}

function memberIsComplete(member) {
  const normalized = { ...emptyMember, ...(member || {}) };
  return Boolean(
    normalized.fullName.trim() &&
    normalized.email.trim() &&
    normalized.country.trim() &&
    normalized.college.trim() &&
    normalized.discipline.trim() &&
    normalized.year.trim(),
  );
}

function normalizeAppliedCoupon(coupon, couponCode = "") {
  if (!coupon || Number(coupon.finalAmount) > ORIGINAL_PRICE) return null;
  if (couponCode.trim().toUpperCase() === "MEDIN10" && coupon.qrImage === LEGACY_LOCAL_COUPON_QR) return null;
  return coupon;
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function normalizePaymentChannel(channel, method = "upi") {
  if (channel === "wallet") return "cashfree";
  if (channel === "netbanking") return "paystack";
  if (channel) return channel;
  if (method === "paystack") return "card";
  if (method === "cashfree") return "cashfree";
  return "upi";
}

function formatPaymentMethod(method) {
  const labels = {
    paystack: "Paystack",
    cashfree: "Cashfree",
    upi: "UPI",
  };
  return labels[method] || "UPI";
}

function loadDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    return {
      step: Number.isInteger(draft.step) ? Math.min(Math.max(draft.step, 0), 4) : 0,
      referralCode: draft.referralCode || "",
      couponCode: draft.couponCode || "",
      appliedCoupon: normalizeAppliedCoupon(draft.appliedCoupon, draft.couponCode || ""),
      couponError: draft.couponError || "",
      hasCoupon: draft.hasCoupon || "",
      defaultQrImage: draft.defaultQrImage || DEFAULT_QR_IMAGE,
      paymentMethod: draft.paymentMethod || "upi",
      paymentChannel: normalizePaymentChannel(draft.paymentChannel, draft.paymentMethod),
      paymentSettings: { ...defaultPaymentSettings, ...(draft.paymentSettings || {}) },
      leader: { ...emptyLeader, ...(draft.leader || {}) },
      members: normalizeMemberSlots(draft.members),
      utr: draft.utr || "",
      termsAccepted: Boolean(draft.termsAccepted),
    };
  } catch {
    return null;
  }
}

function RegistrationSummary() {
  return (
    <motion.section
      id="registration"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl rounded-[2rem] border border-violet-100 bg-white/90 p-8 text-center shadow-[0_28px_90px_rgba(124,58,237,0.12)] sm:p-12"
      >
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Registration</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Register Now</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Affordable registration with global access. Be part of the movement that's shaping the future of healthcare.
        </p>

        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50/70 p-7 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <CountUpNumber value={10} prefix="$" className="text-5xl font-black text-[#EC4899]" />
            <span className="text-lg font-bold text-[#7C3AED]">per team</span>
          </div>

          <div className="mt-7 rounded-2xl border border-violet-100 bg-white/80 px-4 py-4 text-center text-sm font-bold leading-6 text-[#111827] shadow-sm sm:text-base">
            <span className="rounded-full bg-violet-50 px-4 py-2 text-[#7C3AED]">3 to 5 members included</span>
          </div>
        </div>

        <Link to="/registration" className="mt-10 inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-10 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(168,85,247,0.28)] transition hover:-translate-y-1">
          Submit Idea
        </Link>
      </motion.div>
    </motion.section>
  );
}

function PriceRow({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className={`text-lg font-black ${accent ? "text-[#EC4899]" : "text-[#111827]"}`}>{value}</span>
    </div>
  );
}

function CountUpNumber({ value, prefix = "", suffix = "", className = "" }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${prefix}${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [count, isInView, value]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}

function TextInput({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label} {required ? "*" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#EC4899]"
      />
    </label>
  );
}

function RegistrationForm() {
  const draft = useMemo(loadDraft, []);
  const [step, setStep] = useState(draft?.step || 0);
  const [referralCode, setReferralCode] = useState(draft?.referralCode || "");
  const [couponCode, setCouponCode] = useState(draft?.couponCode || "");
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(draft?.couponError || "");
  const [appliedCoupon, setAppliedCoupon] = useState(draft?.appliedCoupon || null);
  const [hasCoupon, setHasCoupon] = useState(draft?.hasCoupon || "");
  const [defaultQrImage, setDefaultQrImage] = useState(draft?.defaultQrImage || DEFAULT_QR_IMAGE);
  const [paymentSettings, setPaymentSettings] = useState(draft?.paymentSettings || defaultPaymentSettings);
  const [paymentMethod, setPaymentMethod] = useState(draft?.paymentMethod || "upi");
  const [paymentChannel, setPaymentChannel] = useState(normalizePaymentChannel(draft?.paymentChannel, draft?.paymentMethod));
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cashfreeId: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [leader, setLeader] = useState(draft?.leader || emptyLeader);
  const [members, setMembers] = useState(draft?.members || createMembers());
  const [utr, setUtr] = useState(draft?.utr || "");
  const [termsAccepted, setTermsAccepted] = useState(draft?.termsAccepted || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [razorpayMeta, setRazorpayMeta] = useState(null);

  const finalAmount = appliedCoupon?.finalAmount || ORIGINAL_PRICE;
  const savedAmount = appliedCoupon?.savedAmount || 0;
  const upiEnabled = paymentSettings.upi_enabled !== false;
  const paystackEnabled = Boolean(paymentSettings.paystack_enabled);
  const cashfreeEnabled = Boolean(paymentSettings.cashfree_enabled);
  const razorpayEnabled = Boolean(paymentSettings.razorpay_enabled);
  const selarEnabled = Boolean(paymentSettings.selar_enabled);
  const selarPaymentLink = paymentSettings.selar_payment_link || "";
  const hasPaymentMethod = (paymentMethod === "upi" && upiEnabled) || (paymentMethod === "paystack" && paystackEnabled) || (paymentMethod === "cashfree" && cashfreeEnabled) || (paymentMethod === "razorpay" && razorpayEnabled) || (paymentMethod === "selar" && selarEnabled);
  const upiQrImage = appliedCoupon?.qrImage || paymentSettings.defaultQrImage || paymentSettings.default_qr_image || defaultQrImage;
  const paystackQrImage = paymentSettings.paystackQrUrl || paymentSettings.paystack_qr_url || "";
  const cashfreeQrImage = appliedCoupon?.qrImage || paymentSettings.cashfreeQrUrl || paymentSettings.cashfree_qr_url || DEFAULT_CASHFREE_QR_IMAGE;
  const qrImage = paymentMethod === "paystack" ? paystackQrImage : paymentMethod === "cashfree" ? cashfreeQrImage : upiQrImage;
  const couponNeedsValidation = hasCoupon === "yes" && couponCode.trim() && !appliedCoupon;
  const paystackPaymentLink = paymentSettings.paystack_payment_link || "";
  const baseRazorpayPaymentLink = paymentSettings.razorpay_payment_link || "";
  const razorpayPaymentLink = (appliedCoupon?.razorpayPaymentLink) || baseRazorpayPaymentLink;
  const razorpayBaseInr = Math.round(finalAmount * 100);
  const razorpayFeeInr = paymentMethod === "razorpay" ? Math.ceil(razorpayBaseInr * 0.03) : 0;
  const razorpayTotalInr = razorpayBaseInr + razorpayFeeInr;
  const paymentChannels = useMemo(() => [
    {
      id: "upi",
      label: "UPI",
      description: "Scan the official QR and enter your transaction ID.",
      enabled: upiEnabled,
      backendMethod: "upi",
    },
    {
      id: "card",
      label: "Credit/Debit Card",
      description: "Continue through the card payment gateway.",
      enabled: paystackEnabled,
      backendMethod: "paystack",
    },
    {
      id: "paystack",
      label: "Paystack",
      description: "Open Paystack and complete payment securely.",
      enabled: paystackEnabled,
      backendMethod: "paystack",
    },
    {
      id: "cashfree",
      label: "Cashfree",
      description: "Scan the Cashfree QR and enter your transaction ID.",
      enabled: cashfreeEnabled,
      backendMethod: "cashfree",
    },
    {
      id: "razorpay",
      label: "Card / International",
      description: "Credit/Debit card, international payments via Razorpay.",
      enabled: razorpayEnabled,
      backendMethod: "razorpay",
    },
    {
      id: "selar",
      label: "Selar (Georgia / International)",
      description: "Pay securely via Selar for Georgian and international delegates.",
      enabled: selarEnabled,
      backendMethod: "selar",
    },
  ], [cashfreeEnabled, paystackEnabled, upiEnabled, razorpayEnabled, selarEnabled]);
  const selectedPaymentChannel = useMemo(
    () => paymentChannels.find((channel) => channel.id === paymentChannel && channel.enabled) || paymentChannels.find((channel) => channel.enabled),
    [paymentChannel, paymentChannels],
  );
  const payNowDisabled = paymentMethod === "paystack" && (
    !paystackPaymentLink ||
    isCouponLoading ||
    Boolean(couponNeedsValidation)
  );

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/payment-settings`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Payment settings unavailable")))
      .then((data) => {
        if (!active) return;
        const nextSettings = { ...defaultPaymentSettings, ...data };
        setPaymentSettings(nextSettings);
        setDefaultQrImage(nextSettings.defaultQrImage || nextSettings.default_qr_image || DEFAULT_QR_IMAGE);

        if (!nextSettings.upi_enabled && !nextSettings.paystack_enabled && nextSettings.cashfree_enabled) {
          setPaymentMethod("cashfree");
          setPaymentChannel("cashfree");
        } else if (!nextSettings.upi_enabled && nextSettings.paystack_enabled) {
          setPaymentMethod("paystack");
          setPaymentChannel((current) => ["upi", "cashfree"].includes(current) ? "card" : current);
        } else if (nextSettings.upi_enabled && !nextSettings.paystack_enabled && !nextSettings.cashfree_enabled) {
          setPaymentMethod("upi");
          setPaymentChannel("upi");
        }
      })
      .catch(() => {
        if (active) setPaymentSettings(defaultPaymentSettings);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step,
        referralCode,
        couponCode,
        appliedCoupon,
        couponError,
        hasCoupon,
        defaultQrImage,
        paymentSettings,
        paymentMethod,
        paymentChannel,
        leader,
        members,
        utr,
        termsAccepted,
      }),
    );
  }, [step, referralCode, couponCode, appliedCoupon, couponError, hasCoupon, defaultQrImage, paymentSettings, paymentMethod, paymentChannel, leader, members, utr, termsAccepted]);

  useEffect(() => {
    if (!selectedPaymentChannel) return;
    if (paymentChannel !== selectedPaymentChannel.id) setPaymentChannel(selectedPaymentChannel.id);
    if (paymentMethod !== selectedPaymentChannel.backendMethod) setPaymentMethod(selectedPaymentChannel.backendMethod);
  }, [paymentChannel, paymentMethod, selectedPaymentChannel]);

  useEffect(() => {
    if (!razorpayEnabled) return;
    if (document.getElementById("razorpay-checkout-js")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, [razorpayEnabled]);

  const handleRazorpayPayment = async () => {
    setSubmitError("");
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create payment order.");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MedInnovate 2026",
        description: "Team Registration Fee",
        order_id: orderData.orderId,
        handler(response) {
          setUtr(response.razorpay_payment_id);
          setRazorpayMeta({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: leader.fullName,
          email: leader.email,
          contact: leader.phone,
        },
        theme: { color: "#7C3AED" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setSubmitError(error.message || "Payment failed. Please try again.");
    }
  };

  const updateLeader = (field, value) => setLeader((current) => ({ ...current, [field]: value }));
  const updatePaymentDetails = (field, value) => setPaymentDetails((current) => ({ ...current, [field]: value }));
  const selectPaymentChannel = (channel) => {
    if (!channel.enabled) return;
    setPaymentChannel(channel.id);
    setPaymentMethod(channel.backendMethod);
  };
  const updateMember = (index, field, value) => {
    setMembers((current) => current.map((member, memberIndex) => (memberIndex === index ? { ...member, [field]: value } : member)));
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    setAppliedCoupon(null);

    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError("No coupon applied. Standard team price will be used.");
      return;
    }

    setIsCouponLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });

      if (!response.ok) {
        setCouponError("Invalid or expired coupon");
        return;
      }

      const data = await response.json();

      if (!data.valid) {
        setCouponError(data.message || "Invalid or expired coupon");
        return;
      }

      setAppliedCoupon(data);
      setCouponCode(normalizedCode);
    } catch (error) {
      console.error("Coupon validation error:", error);
      if (LOCAL_COUPONS[normalizedCode]) {
        setAppliedCoupon(LOCAL_COUPONS[normalizedCode]);
        setCouponCode(normalizedCode);
        setCouponError("");
        return;
      }
      setCouponError("Unable to validate coupon right now.");
    } finally {
      setIsCouponLoading(false);
    }
  };

  const leaderComplete = leader.fullName.trim() && leader.email.trim() && leader.phone.trim() && leader.country.trim() && leader.college.trim() && leader.discipline.trim() && leader.year.trim();
  const completeTeammates = members.filter(memberIsComplete);
  const hasPartialTeammate = members.some((member) => memberHasAnyDetails(member) && !memberIsComplete(member));
  const totalTeamSize = 1 + completeTeammates.length;
  const teammatesComplete = completeTeammates.length >= REQUIRED_TEAMMATES && totalTeamSize <= MAX_TEAM_SIZE && !hasPartialTeammate;
  const paymentComplete = termsAccepted && hasPaymentMethod && utr.trim();

  const openPaystackPayment = () => {
    if (payNowDisabled) return;
    window.open(paystackPaymentLink, "_blank", "noopener,noreferrer");
  };

  const goNext = () => {
    setSubmitError("");
    if (step === 1 && !leaderComplete) {
      setSubmitError("Please complete all required leader details.");
      return;
    }
    if (step === 2 && !teammatesComplete) {
      setSubmitError(`Please complete at least ${REQUIRED_TEAMMATES} teammates. Optional teammate cards can be left fully blank.`);
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!paymentComplete) {
      setSubmitError("Please choose an enabled payment method, enter transaction ID, and accept the terms.");
      return;
    }

    if (!teammatesComplete) {
      setSubmitError(`Teams must have ${MIN_TEAM_SIZE} to ${MAX_TEAM_SIZE} members total. Complete optional teammate cards or leave them blank.`);
      return;
    }

    const payloadMembers = [
      {
        name: leader.fullName.trim(),
        email: leader.email.trim(),
        college: leader.college.trim(),
        country: leader.country.trim(),
        phone: leader.phone.trim(),
        discipline: leader.discipline.trim(),
        year: leader.year.trim(),
        gender: leader.gender.trim(),
      },
      ...members
        .filter(memberHasAnyDetails)
        .map((member) => ({
          name: member.fullName.trim(),
          email: member.email.trim(),
          college: member.college.trim(),
          country: member.country.trim(),
          discipline: member.discipline.trim(),
          year: member.year.trim(),
        })),
    ];

    const payload = {
      team_name: `${leader.fullName.trim() || "MedInnovate"} Team`,
      members: payloadMembers,
      utr: utr.trim(),
      coupon_code: appliedCoupon ? couponCode.trim() : "",
      referral_code: referralCode.trim(),
      amount_paid: finalAmount,
      discount_amount: savedAmount,
      final_amount: finalAmount,
      payment_method: paymentMethod,
      razorpay_order_id: razorpayMeta?.orderId || "",
      razorpay_signature: razorpayMeta?.signature || "",
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed. Please try again.");

      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-violet-100 bg-[#fbf9ff] p-8 text-center shadow-[0_28px_90px_rgba(124,58,237,0.12)] sm:p-12">
          <div className="text-5xl font-black text-[#7C3AED]">Success</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111827]">Registration Successful!</h2>
          <p className="mt-4 text-slate-600">Your team has been registered and is pending verification.</p>
          <p className="mt-4 text-sm font-semibold text-slate-500">Email trigger placeholder: confirmation email will be sent after backend email setup.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl rounded-[2.5rem] border border-violet-100 bg-[#fbf9ff]/95 p-5 shadow-[0_28px_90px_rgba(124,58,237,0.12)] sm:p-8">
        <Link
          to="/"
          className="mb-8 inline-flex rounded-full border border-violet-100 bg-white px-5 py-2.5 text-sm font-black text-[#7C3AED] shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:text-[#EC4899]"
        >
          Back to website
        </Link>

        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7C3AED]">Registration Wizard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Submit your idea.</h1>
        </div>

        <div className="mb-4 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-[#7C3AED] md:hidden">
          {steps[step]}
        </div>

        <div className="mb-8 hidden gap-3 md:grid md:grid-cols-5">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                index <= step
                  ? "border-transparent bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-[0_14px_34px_rgba(124,58,237,0.18)]"
                  : "border-violet-100 bg-white text-slate-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)] sm:p-7">
            {step === 0 && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-3xl font-black text-[#111827]">Referral & Access</h2>
                  <p className="mt-2 text-slate-500">Enter a referral code if someone referred your team. Coupon codes are applied later during payment.</p>
                  <div className="mt-6">
                    <input value={referralCode} onChange={(event) => setReferralCode(event.target.value.toUpperCase())} placeholder="Referral code" className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 font-semibold text-[#111827] outline-none transition focus:border-[#EC4899]" />
                  </div>
                  <div className="mt-5 rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4 text-sm font-bold text-slate-600">
                    {referralCode ? `Referral code saved: ${referralCode}` : "Referral code is optional. You can continue without one."}
                  </div>
                </div>
                <div className="space-y-3">
                  <PriceRow label="Original price" value={formatCurrency(ORIGINAL_PRICE)} />
                  <PriceRow label="Discount amount" value={formatCurrency(0)} />
                  <PriceRow label="Final amount before coupon" value={formatCurrency(ORIGINAL_PRICE)} accent />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-3xl font-black text-[#111827]">Team Leader Information</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TextInput label="Full Name" value={leader.fullName} onChange={(value) => updateLeader("fullName", value)} required />
                  <TextInput label="Email" type="email" value={leader.email} onChange={(value) => updateLeader("email", value)} required />
                  <TextInput label="Phone number" value={leader.phone} onChange={(value) => updateLeader("phone", value)} required />
                  <TextInput label="Country" value={leader.country} onChange={(value) => updateLeader("country", value)} required />
                  <TextInput label="College / Institution" value={leader.college} onChange={(value) => updateLeader("college", value)} required />
                  <TextInput label="Course / Discipline" value={leader.discipline} onChange={(value) => updateLeader("discipline", value)} required />
                  <TextInput label="Year of study" value={leader.year} onChange={(value) => updateLeader("year", value)} required />
                  <TextInput label="Gender (optional)" value={leader.gender} onChange={(value) => updateLeader("gender", value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-[#111827]">Team Members</h2>
                    <p className="mt-2 text-slate-500">Teams need {MIN_TEAM_SIZE} to {MAX_TEAM_SIZE} members total. Leader already counted; add at least {REQUIRED_TEAMMATES} teammates.</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-[#7C3AED]">{totalTeamSize}/{MAX_TEAM_SIZE} members</div>
                </div>
                <div className="mt-6 space-y-4">
                  {members.map((member, index) => (
                    <details key={index} open={index === 0} className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
                      <summary className="cursor-pointer text-lg font-black text-[#111827]">
                        Member {index + 2} {index >= REQUIRED_TEAMMATES ? <span className="text-sm text-slate-400">(optional)</span> : null}
                      </summary>
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <TextInput label="Full name" value={member.fullName} onChange={(value) => updateMember(index, "fullName", value)} required={index < REQUIRED_TEAMMATES} />
                        <TextInput label="Email" type="email" value={member.email} onChange={(value) => updateMember(index, "email", value)} required={index < REQUIRED_TEAMMATES} />
                        <TextInput label="Country" value={member.country} onChange={(value) => updateMember(index, "country", value)} required={index < REQUIRED_TEAMMATES} />
                        <TextInput label="College" value={member.college} onChange={(value) => updateMember(index, "college", value)} required={index < REQUIRED_TEAMMATES} />
                        <TextInput label="Discipline" value={member.discipline} onChange={(value) => updateMember(index, "discipline", value)} required={index < REQUIRED_TEAMMATES} />
                        <TextInput label="Year" value={member.year} onChange={(value) => updateMember(index, "year", value)} required={index < REQUIRED_TEAMMATES} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-3xl font-black text-[#111827]">Review</h2>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <ReviewCard title="Referral & coupon" onEdit={() => setStep(0)} lines={[referralCode ? `Referral: ${referralCode}` : "No referral code", appliedCoupon ? `Coupon: ${couponCode}` : "Coupon not applied yet", `Current final amount: ${formatCurrency(finalAmount)}`]} />
                  <ReviewCard title="Leader info" onEdit={() => setStep(1)} lines={[leader.fullName, leader.email, leader.phone, leader.country, leader.college, leader.discipline, leader.year]} />
                  <ReviewCard title="All members" onEdit={() => setStep(2)} lines={[leader.fullName, ...members.filter(memberHasAnyDetails).map((member, index) => `Member ${index + 2}: ${member.fullName || "Incomplete"}`), `Team size: ${totalTeamSize}`]} />
                  <ReviewCard title="Team cost" onEdit={() => setStep(0)} lines={[`Payment method: ${formatPaymentMethod(paymentMethod)}`, `Original: ${formatCurrency(ORIGINAL_PRICE)}`, `Discount: ${formatCurrency(savedAmount)}`, `Final: ${formatCurrency(finalAmount)}`]} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-3xl font-black text-[#111827]">Complete Registration</h2>
                <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
                      <h3 className="text-lg font-black text-[#111827]">Payment Method</h3>
                      <div className="mt-5 space-y-3">
                        {paymentChannels.map((channel) => (
                          <button
                            key={channel.id}
                            type="button"
                            onClick={() => selectPaymentChannel(channel)}
                            disabled={!channel.enabled}
                            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                              paymentChannel === channel.id && channel.enabled
                                ? "border-transparent bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-[0_18px_38px_rgba(124,58,237,0.18)]"
                                : "border-violet-100 bg-white text-slate-600 hover:border-fuchsia-200"
                            } ${!channel.enabled ? "cursor-not-allowed opacity-45" : ""}`}
                          >
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${paymentChannel === channel.id && channel.enabled ? "border-white" : "border-violet-200"}`}>
                              {paymentChannel === channel.id && channel.enabled ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                            </span>
                            <span>
                              <span className="block text-sm font-black">{channel.label}</span>
                              <span className={`mt-1 block text-xs font-semibold leading-5 ${paymentChannel === channel.id && channel.enabled ? "text-white/85" : "text-slate-500"}`}>
                                {channel.enabled ? channel.description : "Currently unavailable"}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                      {!upiEnabled && !paystackEnabled && !cashfreeEnabled && (
                        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                          Payments are temporarily unavailable.
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
                      <h3 className="text-lg font-black text-[#111827]">Apply Coupon</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Coupon codes are separate from referral codes. Applying a valid coupon updates the final amount and loads the matching QR from the admin panel.
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setHasCoupon("yes")}
                          className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${hasCoupon === "yes" ? "border-transparent bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white" : "border-violet-100 bg-white text-slate-600"}`}
                        >
                          Yes, I have a coupon
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHasCoupon("no");
                            setCouponCode("");
                            setAppliedCoupon(null);
                            setCouponError("");
                          }}
                          className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${hasCoupon === "no" ? "border-transparent bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white" : "border-violet-100 bg-white text-slate-600"}`}
                        >
                          No, show main QR
                        </button>
                      </div>
                      {hasCoupon === "yes" && (
                        <>
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <input
                              value={couponCode}
                              onChange={(event) => {
                                setCouponCode(event.target.value.toUpperCase());
                                setCouponError("");
                                setAppliedCoupon(null);
                              }}
                              placeholder="Coupon code"
                              className="min-w-0 flex-1 rounded-2xl border border-violet-100 bg-white px-4 py-3 font-semibold text-[#111827] outline-none transition focus:border-[#EC4899]"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={isCouponLoading}
                              className="rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60"
                            >
                              {isCouponLoading ? "Applying..." : "Apply"}
                            </button>
                          </div>
                          <div className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 text-sm font-bold">
                            {appliedCoupon ? (
                              <span className="text-green-700">Coupon applied. Final amount and QR updated.</span>
                            ) : couponError ? (
                              <span className="text-slate-600">{couponError}</span>
                            ) : (
                              <span className="text-slate-500">Enter a coupon code to update the amount and QR.</span>
                            )}
                          </div>
                        </>
                      )}
                      {hasCoupon === "no" && (
                        <div className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 text-sm font-bold text-slate-600">
                          Main QR loaded. Standard team price is active.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-[#111827]">Payment Details</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {paymentMethod === "paystack"
                            ? paymentSettings.paystack_instructions || "For African delegates please use Paystack."
                            : paymentMethod === "cashfree"
                              ? paymentSettings.cashfree_instructions || "Use Cashfree QR, then enter your transaction ID."
                              : `Pay exactly ${formatCurrency(finalAmount)}. Use the coupon-specific QR shown here if a coupon was applied.`}
                        </p>
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#EC4899] shadow-sm">
                        {formatCurrency(finalAmount)}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {(paymentChannel === "upi" || paymentChannel === "cashfree") && (
                        <>
                          {paymentChannel === "upi" ? (
                            <TextInput label="UPI ID" value={paymentDetails.upiId} onChange={(value) => updatePaymentDetails("upiId", value)} placeholder="name@bank" />
                          ) : (
                            <TextInput label="Cashfree Reference" value={paymentDetails.cashfreeId} onChange={(value) => updatePaymentDetails("cashfreeId", value)} placeholder="Cashfree ID or note" />
                          )}
                          <div className="rounded-3xl border border-violet-100 bg-white p-5 text-center">
                            {qrImage ? (
                              <img src={resolveAssetUrl(qrImage)} alt="Payment QR Code" className="mx-auto h-52 w-52 rounded-2xl border border-violet-100 bg-white object-contain p-3" />
                            ) : (
                              <div className="mx-auto grid h-52 w-52 place-items-center rounded-2xl border border-violet-100 bg-white p-3 text-sm font-bold text-slate-400">
                                QR will appear here
                              </div>
                            )}
                            <p className="mt-3 text-sm font-semibold text-slate-500">Scan and pay the final amount, then enter the transaction ID.</p>
                          </div>
                        </>
                      )}

                      {paymentChannel === "card" && (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5">
                          <h4 className="text-sm font-black text-[#111827]">Bank Transfer Details</h4>
                          <div className="mt-4 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Account Holder</span>
                              <span className="mt-1 block text-[#111827]">GIRIK SUBUDHI</span>
                            </div>
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Account Number</span>
                              <span className="mt-1 block text-[#111827]">08301460000294</span>
                            </div>
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">IFSC</span>
                              <span className="mt-1 block text-[#111827]">HDFC0000830</span>
                            </div>
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Branch</span>
                              <span className="mt-1 block text-[#111827]">CBD BELAPUR</span>
                            </div>
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Account Type</span>
                              <span className="mt-1 block text-[#111827]">Savings Account</span>
                            </div>
                            <div className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
                              <span className="block text-xs font-black uppercase tracking-[0.14em] text-slate-400">Bank Name</span>
                              <span className="mt-1 block text-[#111827]">HDFC Bank</span>
                            </div>
                          </div>
                          <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                            Transfer the final amount to this account, then enter the transaction ID below.
                          </p>
                        </div>
                      )}

                      {paymentChannel === "paystack" && (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5">
                          <h4 className="text-sm font-black text-[#111827]">Paystack checkout</h4>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                            Continue to Paystack, complete the payment for {formatCurrency(finalAmount)}, then paste the transaction ID below.
                          </p>
                        </div>
                      )}

                      {paymentChannel === "paystack" && paymentMethod === "paystack" && (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5 text-center">
                          <button
                            type="button"
                            onClick={openPaystackPayment}
                            disabled={payNowDisabled}
                            className="inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            PAY NOW
                          </button>
                          {payNowDisabled && (
                            <p className="mt-3 text-xs font-bold text-slate-500">
                              {couponNeedsValidation ? "Apply the coupon or choose no coupon before paying." : "Paystack link is not configured yet."}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-3 rounded-2xl border border-violet-100 bg-white p-4 text-sm font-bold text-slate-600">
                        <div className="flex items-center justify-between gap-4">
                          <span>Original Amount</span>
                          <span className="text-[#111827]">{formatCurrency(ORIGINAL_PRICE)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Coupon Code</span>
                          <span className="text-[#111827]">{appliedCoupon ? couponCode : "None"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Discount</span>
                          <span className="text-emerald-700">{formatCurrency(savedAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-violet-100 pt-3 text-base">
                          <span>Final Amount</span>
                          <span className="text-[#EC4899]">{formatCurrency(finalAmount)}</span>
                        </div>
                      </div>

                      {paymentChannel === "razorpay" && (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5">
                          <h4 className="text-sm font-black text-[#111827]">International Card Payment</h4>
                          <div className="mt-3 space-y-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                            <div className="flex justify-between font-semibold text-slate-600">
                              <span>Registration fee</span>
                              <span>₹{razorpayBaseInr}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-500">
                              <span>Processing fee (3%)</span>
                              <span>₹{razorpayFeeInr}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-[#111827]">
                              <span>Total payable</span>
                              <span>₹{razorpayTotalInr}</span>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <button
                              type="button"
                              onClick={() => razorpayPaymentLink && window.open(razorpayPaymentLink, "_blank", "noopener,noreferrer")}
                              disabled={!razorpayPaymentLink}
                              className="inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Pay ₹{razorpayTotalInr}
                            </button>
                          </div>
                        </div>
                      )}

                      {paymentChannel === "selar" && (
                        <div className="rounded-3xl border border-violet-100 bg-white p-5">
                          <h4 className="text-sm font-black text-[#111827]">Selar Payment</h4>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                            Click Pay Now to open Selar. Complete your payment, then paste your Order ID or receipt number below.
                          </p>
                          <div className="mt-4 text-center">
                            <button
                              type="button"
                              onClick={() => selarPaymentLink && window.open(selarPaymentLink, "_blank", "noopener,noreferrer")}
                              disabled={!selarPaymentLink}
                              className="inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3 text-sm font-black uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      )}

                      <TextInput label="Transaction ID" value={utr} onChange={setUtr} required />
                      <label className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-600">
                        <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-[#7C3AED]" />
                        I confirm that the details and payment information are accurate.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{submitError}</div>}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0} className="rounded-full border border-violet-100 bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#7C3AED] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          {step < 4 ? (
            <button type="button" onClick={goNext} className="rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              Continue
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting || !paymentComplete} className="rounded-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] px-8 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ title, lines, onEdit }) {
  return (
    <div className="rounded-3xl border border-violet-100 bg-[#fbf9ff] p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-black text-[#111827]">{title}</h3>
        <button type="button" onClick={onEdit} className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#7C3AED] shadow-sm">
          Edit
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {lines.filter(Boolean).map((line) => (
          <p key={line} className="text-sm font-semibold text-slate-600">{line}</p>
        ))}
      </div>
    </div>
  );
}

function Registration({ full = false }) {
  return full ? <RegistrationForm /> : <RegistrationSummary />;
}

export default Registration;
