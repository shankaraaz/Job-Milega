import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CANDIDATE_PASS_PLANS } from '../../data/mockData';
import { CandidatePassPlan } from '../../types';

interface CandidatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightJobTitle?: string;
}

export const CandidatePassModal: React.FC<CandidatePassModalProps> = ({
  isOpen,
  onClose,
  highlightJobTitle,
}) => {
  const {
    candidateSubscription,
    hasActiveCandidateSubscription,
    subscribeCandidate,
    cancelCandidateSubscription,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<'candidate_1m' | 'candidate_3m'>('candidate_3m');
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('candidate@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  const currentPlan =
    CANDIDATE_PASS_PLANS.find((p) => p.id === selectedPlanId) || CANDIDATE_PASS_PLANS[1];

  const payableAmount = Math.max(1, currentPlan.price - discount);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'JOB50' || couponCode.trim().toUpperCase() === 'FIRST50') {
      setDiscount(Math.round(currentPlan.price * 0.5));
    } else if (couponCode.trim().toUpperCase() === 'SAVE20') {
      setDiscount(Math.round(currentPlan.price * 0.2));
    } else {
      alert('Invalid coupon code. Try JOB50 or SAVE20');
    }
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    const txnId = 'TXN-CAND-' + Math.floor(10000000 + Math.random() * 90000000);

    setTimeout(() => {
      subscribeCandidate(selectedPlanId, {
        method: paymentMethod.toUpperCase(),
        transactionId: txnId,
      });
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white overflow-hidden">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm text-xs font-bold text-amber-200 mb-2 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Job Milega Candidate Access Pass</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Job Kahan Hai Pura Dekho & Apply Karo
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-lg leading-relaxed">
                {highlightJobTitle
                  ? `Unlock recruiter mobile numbers & direct apply for "${highlightJobTitle}" and all other jobs!`
                  : 'Get recruiter phone numbers, WhatsApp chat, exact hotel/office locations & 1-click instant apply across India.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {hasActiveCandidateSubscription && step !== 'payment' && step !== 'success' ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Aapka Job Milega VIP Pass Active Hai!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Plan: <strong>{candidateSubscription.planName}</strong> • Valid until:{' '}
                <strong>{candidateSubscription.expiresAt}</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sabhi jobs ke recruiter mobile numbers, WhatsApp chat aur 1-click apply unlock ho chuke hain!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Explore Unlocked Jobs
                </button>
                <button
                  onClick={cancelCandidateSubscription}
                  className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  Reset / Test Deactivate
                </button>
              </div>
            </div>
          ) : step === 'select' ? (
            <>
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <Phone className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <span className="text-[11px] font-bold block text-slate-800 dark:text-slate-200">
                    Recruiter Direct Call
                  </span>
                  <span className="text-[10px] text-slate-400">Direct mobile number</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <MessageCircle className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                  <span className="text-[11px] font-bold block text-slate-800 dark:text-slate-200">
                    WhatsApp Chat
                  </span>
                  <span className="text-[10px] text-slate-400">1-click direct message</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <MapPin className="w-4 h-4 mx-auto text-rose-500 mb-1" />
                  <span className="text-[11px] font-bold block text-slate-800 dark:text-slate-200">
                    Exact Address
                  </span>
                  <span className="text-[10px] text-slate-400">Full hotel / office landmark</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <Zap className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <span className="text-[11px] font-bold block text-slate-800 dark:text-slate-200">
                    1-Click Apply
                  </span>
                  <span className="text-[10px] text-slate-400">Unlimited applications</span>
                </div>
              </div>

              {/* Pricing Cards Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CANDIDATE_PASS_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-xl ring-2 ring-amber-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
                      }`}
                    >
                      {plan.discountBadge && (
                        <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md">
                          {plan.discountBadge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {plan.name}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {plan.duration}
                          </span>
                        </div>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">
                            ₹{plan.price}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            ₹{plan.originalPrice}
                          </span>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                            Only ₹{Math.round(plan.price / (plan.durationDays / 30))}/mo
                          </span>
                        </div>

                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanId(plan.id);
                            setStep('payment');
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                              : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>Get {plan.name} (₹{plan.price})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Policy note */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  <strong>Job Milega Trust:</strong> Direct recruiter contacts, verified salaries & 100% genuine jobs across hotel ops, tech, delivery, bpo, office & hospitality.
                </span>
              </div>
            </>
          ) : step === 'payment' ? (
            /* Checkout Step */
            <div className="space-y-5">
              <button
                onClick={() => setStep('select')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                ← Change Plan ({currentPlan.name})
              </button>

              {/* Plan Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentPlan.name} ({currentPlan.duration})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Full recruiter direct details + 1-click apply unlock
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    ₹{payableAmount}
                  </span>
                  {discount > 0 && (
                    <span className="block text-[11px] text-emerald-600 font-semibold">
                      ₹{discount} Saved!
                    </span>
                  )}
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. JOB50 or SAVE20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Apply
                </button>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Payment Method / भुगतान का तरीका
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>UPI / GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'qr'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-500" />
                    <span>Scan QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span>Debit / ATM Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Your UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                    placeholder="mobile@upi or user@okhdfcbank"
                  />
                  <div className="flex gap-2 text-[10px] text-slate-400">
                    <span>Supported:</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">Google Pay • PhonePe • Paytm • BHIM</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-md flex items-center justify-center border border-slate-200">
                    <QrCode className="w-32 h-32 text-slate-800" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Scan using any UPI App to Pay ₹{payableAmount}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Auto-verifies instantly after scan
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 9921"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        defaultValue="10/29"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        defaultValue="821"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Processing Payment ₹{payableAmount}...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>Pay ₹{payableAmount} & Unlock All Jobs Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Success Step */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Badhaai Ho! Pass Activate Ho Gaya! 🎉
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Aapka <strong>{currentPlan.name}</strong> successfully active hai. Ab aap kisi bhi job ki complete details, recruiter phone numbers & WhatsApp chat dekh sakte hain aur 1-click apply kar sakte hain.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                >
                  Start Applying Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
