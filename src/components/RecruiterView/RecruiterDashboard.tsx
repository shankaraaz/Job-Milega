import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Plus,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  Mail,
  IndianRupee,
  MapPin,
  Trash2,
  Download,
  CreditCard,
  Building,
  Check,
  FileCheck,
  Search,
  Filter,
  DollarSign,
  QrCode,
  ArrowRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job, Application, HiredCommissionRecord } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import confetti from 'canvas-confetti';

interface RecruiterDashboardProps {
  onOpenPostJob: () => void;
  onOpenUpgradePlans: () => void;
  onNavigateToApplicants: () => void;
  onNavigateToInterviews: () => void;
  onNavigateToAnalytics: () => void;
  onScheduleInterviewForApp: (app: Application) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  onOpenPostJob,
  onOpenUpgradePlans,
  onNavigateToApplicants,
  onNavigateToInterviews,
  onNavigateToAnalytics,
  onScheduleInterviewForApp,
}) => {
  const {
    jobs,
    applications,
    isEmployerVerified,
    isRecruiterProSubscribed,
    deleteJob,
    toggleFeatured,
    emailLogs,
    hiredCommissions,
    payHiredCommission,
  } = useApp();

  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All');
  const [payingCommission, setPayingCommission] = useState<HiredCommissionRecord | null>(null);
  const [commissionPaymentMethod, setCommissionPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingCommission, setIsProcessingCommission] = useState(false);

  // Compute metrics
  const totalOpenings = jobs.reduce((acc, j) => acc + (j.openings || 1), 0);
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const scheduledCount = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const hiredCount = applications.filter((a) => a.status === 'Selected / Offer').length + hiredCommissions.length;

  const totalCommissionAmount = hiredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidCommissionAmount = hiredCommissions
    .filter((c) => c.paymentStatus === 'Paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommissions = hiredCommissions.filter((c) => c.paymentStatus !== 'Paid');

  // Filter jobs by sector
  const filteredJobs = useMemo(() => {
    if (selectedSectorFilter === 'All') return jobs;
    return jobs.filter((j) => j.sector === selectedSectorFilter);
  }, [jobs, selectedSectorFilter]);

  // Handle Pay Commission
  const handleConfirmCommissionPayment = () => {
    if (!payingCommission) return;
    setIsProcessingCommission(true);

    const txnId = 'TXN-COMM-' + Math.floor(10000000 + Math.random() * 90000000);
    setTimeout(() => {
      payHiredCommission(payingCommission.id, {
        method: commissionPaymentMethod.toUpperCase(),
        transactionId: txnId,
      });
      setIsProcessingCommission(false);
      setPayingCommission(null);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B'],
        });
      } catch (err) {}
    }, 1200);
  };

  const handleDownloadCommissionReceipt = (record: HiredCommissionRecord) => {
    const text = `
=============================================================
JOB MILEGA - SUCCESSFUL HIRE COMMISSION TAX INVOICE
=============================================================
Invoice Number: ${record.invoiceNumber}
Date of Selection: ${record.hiredDate}
Payment Status: ${record.paymentStatus.toUpperCase()}
Transaction ID: ${record.transactionId || 'PENDING SETTLEMENT'}

EMPLOYER DETAILS:
Company: ${record.companyName}
Hiring Platform: Job Milega All-India Recruitment Portal

HIRED CANDIDATE DETAILS:
Candidate Name: ${record.candidateName}
Designation / Role: ${record.jobTitle}
Candidate ID: ${record.candidateId}

COMMISSION FEE BREAKDOWN (20% FIRST MONTH SALARY):
Monthly CTC Offered: ₹${record.monthlySalary.toLocaleString('en-IN')}
Commission Rate: 20% (One-Time Success Fee on Hire)
-------------------------------------------------------------
Gross Commission: ₹${record.commissionAmount.toLocaleString('en-IN')}
CGST (9%): ₹${Math.round(record.commissionAmount * 0.09).toLocaleString('en-IN')}
SGST (9%): ₹${Math.round(record.commissionAmount * 0.09).toLocaleString('en-IN')}
-------------------------------------------------------------
Total Amount: ₹${Math.round(record.commissionAmount * 1.18).toLocaleString('en-IN')}

TERMS & CONDITIONS:
1. One-time fee only. No recurring monthly deductions.
2. Free 30-day replacement guarantee if candidate discontinues service.
=============================================================
`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `JobMilega_Hire_Commission_${record.invoiceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-900/60 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>All-India Recruiter Command Center</span>
              </span>

              {isRecruiterProSubscribed ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/25 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>All India Pro Active (₹999/mo)</span>
                </span>
              ) : (
                <button
                  onClick={onOpenUpgradePlans}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get All India Pro (₹999/mo)</span>
                </button>
              )}

              {isEmployerVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Corporate Badge</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Recruitment Suite & Hiring Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All-India coverage for hotel operations, housekeeping boy (HK boy), helper, pantry staff, BMS/MST technicians, delivery fleet, corporate receptionist, accounts, BPO telecallers & IT engineers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pan-India: 18 States • 500+ Cities</span>
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>₹999/mo All-India Plan • 20% First Salary On Hire</span>
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenPostJob}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </button>

            <button
              onClick={onOpenUpgradePlans}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>{isRecruiterProSubscribed ? 'Manage ₹999 Plan' : 'Activate ₹999 Plan'}</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* High-Impact 5 Metric KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1 */}
        <div
          onClick={onNavigateToApplicants}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Active Postings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {jobs.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalOpenings} open positions live</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={onNavigateToApplicants}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Total Applicants</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {applications.length}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold mt-0.5">100% verified biodata</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={onNavigateToApplicants}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Shortlisted</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {shortlistedCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">AI ATS screened</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={onNavigateToInterviews}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Interviews Set</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {scheduledCount}
            </p>
            <p className="text-[11px] text-amber-500 font-bold mt-0.5">{emailLogs.length} emails dispatched</p>
          </div>
        </div>

        {/* Metric 5: 20% First Salary Commission Summary */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15 dark:from-amber-950/40 dark:to-orange-950/30 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/50 dark:border-amber-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
            <span className="text-xs font-extrabold uppercase tracking-wide">20% Hiring Fee</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              %
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ₹{totalCommissionAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
              {hiredCommissions.length} Hires • 1-Time On Hire
            </p>
          </div>
        </div>
      </div>

      {/* 20% First Salary Commission Tracker & Ledger (PRO SECTION) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                Hiring Success-Fee
              </span>
              <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300">
                20% First Month Salary Model (One-Time Only)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              Candidate Hiring Commission & Billing Ledger
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Jo candidate ko aap select/hire karte hain, unki <strong>first month salary se 20% one-time success fee</strong> apply hoti hai. Zero recurring charges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Paid: ₹{paidCommissionAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Pending: ₹{(totalCommissionAmount - paidCommissionAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Commission Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Hired Candidate</th>
                <th className="py-3 px-4">Role & Company</th>
                <th className="py-3 px-4">Offered Monthly Salary</th>
                <th className="py-3 px-4">20% One-Time Commission</th>
                <th className="py-3 px-4">Status & Invoice</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hiredCommissions.map((record) => {
                const isPaid = record.paymentStatus === 'Paid';

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={record.candidateAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={record.candidateName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                            {record.candidateName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Hired on {record.hiredDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {record.jobTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">{record.companyName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        ₹{record.monthlySalary.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/month CTC</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 text-sm">
                        <span>₹{record.commissionAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        20% of 1st Month (One-time)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Paid (Txn: {record.transactionId})</span>
                          </span>
                        ) : record.paymentStatus === 'Invoiced' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                            <span>Invoiced (Due in 15 days)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <span>Pending Settlement</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          Inv: {record.invoiceNumber}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid ? (
                          <button
                            onClick={() => setPayingCommission(record)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3 text-slate-950" />
                            <span>Pay 20% (₹{record.commissionAmount.toLocaleString('en-IN')})</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Settled</span>
                          </span>
                        )}

                        <button
                          onClick={() => handleDownloadCommissionReceipt(record)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Download GST Commission Receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Segments & Pan-India Job Categories Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span>All India All-Job Segments (Recruiter Access)</span>
            </h3>
            <p className="text-xs text-slate-500">
              HK Boy, Helper, BMS Operator, MST Maintenance, Receptionist, BPO, Accounts & IT
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </span>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => setSelectedSectorFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSectorFilter === 'All'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            All Segments ({jobs.length})
          </button>
          {SECTOR_OPTIONS.filter((s) => !s.startsWith('All')).map((sector) => {
            const count = jobs.filter((j) => j.sector === sector).length;
            const isSelected = selectedSectorFilter === sector;

            return (
              <button
                key={sector}
                onClick={() => setSelectedSectorFilter(sector)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                <span>{sector}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Jobs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Your Active Vacancies ({filteredJobs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage live job postings across India • Screen applicants with AI ATS
            </p>
          </div>
          <button
            onClick={onOpenPostJob}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Job</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Role & Segment</th>
                <th className="py-3 px-4">Location (City/State)</th>
                <th className="py-3 px-4">Salary Range</th>
                <th className="py-3 px-4">Openings & Applied</th>
                <th className="py-3 px-4">Badges & Boost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.map((job) => {
                const jobApps = applications.filter((a) => a.jobId === job.id);

                return (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {job.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {job.subCategory} • {job.company}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        {job.city} ({job.location})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-emerald-400">
                      ₹{job.salaryMin.toLocaleString('en-IN')} - ₹{job.salaryMax.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-normal text-slate-400">/{job.salaryPeriod}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {job.openings} Openings
                      </span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold block">
                        {jobApps.length} candidates applied
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {job.isFeatured ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                            ★ Featured (₹999 Pro)
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleFeatured(job.id)}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                          >
                            + Boost Featured
                          </button>
                        )}
                        {job.urgentHiring && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border border-rose-200">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={onNavigateToApplicants}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs transition-colors"
                        >
                          Review Applicants ({jobApps.length})
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                          title="Delete job posting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Recent Candidate Pipeline & Email Notifications Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Live ATS Candidate Pipeline
            </h3>
            <button
              onClick={onNavigateToApplicants}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View All ({applications.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span>{app.candidateName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-extrabold border border-violet-200 dark:border-violet-800">
                      ATS: {app.atsMatchScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                    {app.jobTitle} • {app.candidatePhone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {app.status}
                  </span>
                  <button
                    onClick={() => onScheduleInterviewForApp(app)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Interview Email Notifications Log */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500" />
              Automated Email Dispatch History
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Active SMTP Relay ✓
            </span>
          </div>

          <div className="space-y-3">
            {emailLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No interview emails sent yet.</p>
            ) : (
              emailLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      To: {log.candidateName} ({log.candidateEmail})
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      ✓ {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Interview: {log.jobTitle} on {log.interviewDate} at {log.interviewTime} ({log.interviewType})
                  </p>
                  <p className="text-[10px] text-slate-400">Dispatched: {log.sentAt}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pay Commission Modal */}
      {payingCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  20% First Salary Success Fee
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Settlement for {payingCommission.candidateName}
                </h3>
                <p className="text-xs text-slate-500">
                  Role: {payingCommission.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setPayingCommission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Offered Monthly Salary:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{payingCommission.monthlySalary.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Commission Rate:</span>
                <span className="font-bold text-amber-600">20% (One-Time Success Fee)</span>
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Commission Payable:</span>
                <span className="text-amber-600 dark:text-amber-400">
                  ₹{payingCommission.commissionAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Settlement Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCommissionPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    commissionPaymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    commissionPaymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Corporate Card
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    commissionPaymentMethod === 'netbanking'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  NEFT / RTGS
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmCommissionPayment}
              disabled={isProcessingCommission}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessingCommission ? (
                <span>Processing Settlement...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settle 20% Fee (₹{payingCommission.commissionAmount.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
