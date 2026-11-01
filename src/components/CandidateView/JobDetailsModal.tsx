import React, { useState } from 'react';
import {
  X,
  Building,
  ShieldCheck,
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  Zap,
  MessageSquare,
  Gift,
  FileCheck,
  TrendingUp,
  Lock,
  Phone,
  MessageCircle,
  Check,
} from 'lucide-react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { CandidatePassModal } from './CandidatePassModal';
import confetti from 'canvas-confetti';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onOpenChatWithRecruiter: (job: Job) => void;
  onOpenSalaryBenchmark?: () => void;
  onOpenApplyModal?: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onOpenChatWithRecruiter,
  onOpenSalaryBenchmark,
  onOpenApplyModal,
}) => {
  const {
    applications,
    applyForJob,
    candidate,
    hasActiveCandidateSubscription,
    candidateSubscription,
    subscribeCandidate,
  } = useApp();

  const [applying, setApplying] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  if (!job) return null;

  const app = applications.find((a) => a.jobId === job.id);
  const isApplied = Boolean(app);

  // Compute simulated skill match
  const matchedSkills = candidate.skills.filter(
    (sk) =>
      job.requirements.some((req) => req.toLowerCase().includes(sk.toLowerCase())) ||
      job.responsibilities.some((resp) => resp.toLowerCase().includes(sk.toLowerCase()))
  );
  const calculatedMatchScore = Math.min(97, Math.max(72, 60 + matchedSkills.length * 8));

  const handleApply = async () => {
    if (isApplied || applying) return;

    if (!hasActiveCandidateSubscription) {
      setIsPassModalOpen(true);
      return;
    }

    if (onOpenApplyModal && job) {
      onClose();
      onOpenApplyModal(job);
      return;
    }
    setApplying(true);
    const success = await applyForJob(job.id);
    setApplying(false);
    if (success) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              {job.isVerifiedCompany && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Verified Recruiter
                </span>
              )}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {job.sector}
              </span>

              {hasActiveCandidateSubscription ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ⭐ VIP Pass Unlocked
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Details Locked (Starts @ ₹99)
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {job.title}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share job link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {shareCopied && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Job link copied to clipboard! Share with friends on WhatsApp.
            </div>
          )}

          {/* Quick Stats Grid - ALWAYS VISIBLE (job kahan pe hai wo dekhai de!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Monthly Salary</p>
              <p className="text-sm font-bold text-slate-900 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {job.salaryMin.toLocaleString('en-IN')} - {job.salaryMax.toLocaleString('en-IN')}
              </p>
              {onOpenSalaryBenchmark && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSalaryBenchmark();
                  }}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold mt-1 flex items-center gap-0.5"
                >
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Market Benchmark →</span>
                </button>
              )}
            </div>

            {/* Location (Clearly visible to user as requested) */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded-lg border border-blue-100 dark:border-blue-900/40">
              <p className="text-[11px] text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Job Kahan Hai (Location)
              </p>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                {job.location}
              </p>
              <span className="text-[10px] font-semibold text-slate-500 block">
                City: {job.city}
              </span>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium">Experience Needed</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {job.experienceRequired}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-medium">Job Type & Shift</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {job.jobType}
              </p>
            </div>
          </div>

          {/* Recruiter Direct Contact Section - UNLOCKED vs LOCKED */}
          {hasActiveCandidateSubscription ? (
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recruiter Direct Contact (Unlocked with VIP Pass)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold">
                  Verified Contact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Recruiter Mobile:</span>
                    <a
                      href="tel:+919820144521"
                      className="font-bold text-slate-900 dark:text-white hover:text-blue-600"
                    >
                      +91 98201 44521 (HR Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">WhatsApp Direct:</span>
                    <a
                      href="https://wa.me/919820144521"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      Chat on WhatsApp (+91 98201 44521)
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                📍 <strong>Interview Address & Site Landmark:</strong> Near Metro Station, Opp. Times Square Complex, {job.location}
              </p>
            </div>
          ) : (
            /* PAYWALL CARD: Location is visible above, but contacts & apply locked */
            <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15 border-2 border-amber-400/50 dark:border-amber-500/30 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Lock className="w-6 h-6 text-slate-950" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  Details & Recruiter Contact Locked
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-2">
                  Job Kahan Hai Dikh Raha Hai ({job.city}) • Pura Portal Open Karne Ke Liye Pass Lein
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
                  Job location <strong>"{job.location}"</strong> visible hai. Lekin recruiter ka direct mobile number (+91 98XXX XXXXX), WhatsApp chat link, exact venue landmark aur 1-click apply karne ke liye pass lein. <strong>Jaise hi pass lenge, pura portal open ho jayega!</strong>
                </p>
              </div>

              {/* Instant 1-Click Purchase Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                {/* 1 Month Pass @ ₹99 */}
                <div
                  onClick={() => {
                    subscribeCandidate('candidate_1m', {
                      method: 'UPI',
                      transactionId: 'TXN-PASS-' + Date.now(),
                    });
                  }}
                  className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 hover:border-amber-500 cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      1 Month Pass
                    </span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">
                      ₹99
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">30 Days Unlimited Portal Access</p>
                  <button className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors">
                    Unlock Now (₹99)
                  </button>
                </div>

                {/* 3 Months Pass @ ₹299 */}
                <div
                  onClick={() => {
                    subscribeCandidate('candidate_3m', {
                      method: 'UPI',
                      transactionId: 'TXN-PASS-' + Date.now(),
                    });
                  }}
                  className="p-3.5 rounded-xl border-2 border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 hover:border-orange-600 cursor-pointer transition-all shadow-sm group relative hover:scale-[1.02]"
                >
                  <span className="absolute -top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500 text-white shadow-sm">
                    Best Value
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      3 Months Pass
                    </span>
                    <span className="text-base font-black text-orange-600 dark:text-orange-400">
                      ₹299
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">90 Days Full Access + Priority ATS</p>
                  <button className="mt-2.5 w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold transition-opacity">
                    Unlock Now (₹299)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View all payment options (QR Code, GPay, Card) →</span>
              </button>
            </div>
          )}

          {/* AI Profile Match Card */}
          <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:via-blue-950/40 dark:to-purple-950/40 p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    AI Match Score for Your Profile ({candidate.fullName})
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculated by comparing your experience ({candidate.experienceYears}y) & skills with this posting.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {calculatedMatchScore}%
                </span>
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  High Suitability
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${calculatedMatchScore}%` }}
              />
            </div>
          </div>

          {/* Job Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Job Description / काम का विवरण
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-500" />
              Key Responsibilities / जिम्मेदारियां
            </h3>
            <ul className="mt-2.5 space-y-2">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Requirements & Qualifications / योग्यता
            </h3>
            <ul className="mt-2.5 space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits & Perks */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-500" />
              Perks, Benefits & Facilities / सुविधाएं
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {job.perks.map((perk, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5"
                >
                  <span>✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                if (!hasActiveCandidateSubscription) {
                  setIsPassModalOpen(true);
                  return;
                }
                onClose();
                onOpenChatWithRecruiter(job);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>{hasActiveCandidateSubscription ? 'Chat with Recruiter' : 'Chat (Requires Pass)'}</span>
            </button>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {isApplied ? (
              <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Already Applied (Status: {app?.status})</span>
              </div>
            ) : !hasActiveCandidateSubscription ? (
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Unlock Full Portal & Apply (₹99)</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {applying ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Apply Now (One-Click)</span>
                    <Zap className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Pass Modal */}
      <CandidatePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        highlightJobTitle={job.title}
      />
    </div>
  );
};
