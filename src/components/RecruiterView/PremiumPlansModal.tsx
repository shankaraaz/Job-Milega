import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  QrCode,
  Download,
  Check,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_PLANS } from '../../data/mockData';
import { PaymentPlan } from '../../types';
import confetti from 'canvas-confetti';

interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({ isOpen, onClose }) => {
  const { purchasedPlans, purchasePlan, isEmployerVerified } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(PAYMENT_PLANS[0]);
  const [paymentStep, setPaymentStep] = useState<'select' | 'checkout' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('recruiter@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('451');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxnId, setLastTxnId] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST50' || couponCode.toUpperCase() === 'DISCOUNT50') {
      setDiscountPercent(50);
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscountPercent(20);
    } else {
      alert('Invalid coupon code. Try FIRST50 or SAVE20');
    }
  };

  const finalAmount = Math.round(selectedPlan.price * (1 - discountPercent / 100));

  const handlePayNow = () => {
    setIsProcessing(true);
    const txnId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
    setLastTxnId(txnId);

    setTimeout(() => {
      purchasePlan(selectedPlan.id, {
        method: paymentMethod.toUpperCase(),
        transactionId: txnId,
      });
      setIsProcessing(false);
      setPaymentStep('success');

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1500);
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `
=============================================
JOB MILEGA - TAX INVOICE & PAYMENT RECEIPT
=============================================
Invoice No: INV-${lastTxnId || '987654'}
Date: ${new Date().toLocaleDateString('en-IN')}
Platform: Job Milega Technologies Pvt Ltd (GSTIN: 27AABCT9988C1ZR)

Bill To:
Company: Nexus Integrated Facility Services / Verified Employer
Plan Purchased: ${selectedPlan.name}
Billing Period: ${selectedPlan.period}

Amount Breakdown:
Base Price: ₹${selectedPlan.price}
Discount (${discountPercent}%): -₹${Math.round(selectedPlan.price * (discountPercent / 100))}
CGST (9%): ₹${Math.round(finalAmount * 0.09)}
SGST (9%): ₹${Math.round(finalAmount * 0.09)}
---------------------------------------------
Total Paid: ₹${finalAmount}
Payment Mode: ${paymentMethod.toUpperCase()} (Authorized & Verified)
Transaction ID: ${lastTxnId || 'TXN-CONFIRMED'}
Status: SUCCESSFUL
=============================================
Thank you for hiring on Job Milega!
`;
    const element = document.createElement('a');
    const file = new Blob([invoiceContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `JobMilega_Invoice_${lastTxnId || 'Receipt'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Services
              </span>
              {isEmployerVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Recruiter Active
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Recruiter Plans & Employer Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {paymentStep === 'select' && (
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mb-6">
                Upgrade your hiring capacity on Job Milega. Get priority applications, featured badges for urgent blue/white collar hires, and the official verified employer trust checkmark.
              </p>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PAYMENT_PLANS.map((plan) => {
                  const isCurrent = purchasedPlans.includes(plan.id);

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan.id === plan.id
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-lg'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      {plan.badgeText && (
                        <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                          {plan.badgeText}
                        </span>
                      )}

                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">
                            ₹{plan.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400">/{plan.period}</span>
                        </div>

                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                          {plan.features.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {isCurrent ? (
                          <div className="text-center py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                            Active Plan ✓
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlan(plan);
                              setPaymentStep('checkout');
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              plan.isPopular
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {plan.price === 0 ? 'Current Tier' : 'Upgrade Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {paymentStep === 'checkout' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <button
                onClick={() => setPaymentStep('select')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to plans
              </button>

              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Selected Package: {selectedPlan.name}</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Validity & Billing</span>
                  <span>{selectedPlan.period}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount ({discountPercent}%)</span>
                    <span>-₹{Math.round(selectedPlan.price * (discountPercent / 100))}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-base text-slate-900 dark:text-emerald-400">
                  <span>Total Payable:</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Promo Code (try FIRST50 or SAVE20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-semibold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Payment Method (Secure TLS 256-Bit)
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-500" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    <span>Card / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-indigo-500" />
                    <span>NetBanking</span>
                  </button>
                </div>

                {/* UPI Fields */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <span>Supported:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px]">Google Pay</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px]">PhonePe</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px]">Paytm</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px]">BHIM UPI</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Enter your UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 bg-white dark:bg-slate-800 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{isProcessing ? 'Authorizing Payment...' : `Pay ₹${finalAmount} & Activate Instantly`}</span>
              </button>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500">
                Your transaction for <strong className="text-slate-800 dark:text-slate-200">{selectedPlan.name}</strong> was authorized. Transaction ID: <span className="font-mono text-indigo-500 font-bold">{lastTxnId}</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Download GST Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentStep('select');
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
