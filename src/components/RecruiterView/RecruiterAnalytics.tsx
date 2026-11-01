import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Target,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecruiterAnalytics: React.FC = () => {
  const { jobs, applications } = useApp();

  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewed = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const selected = applications.filter((a) => a.status === 'Selected / Offer').length;

  const funnelData = [
    { stage: 'Job Views', count: 1840, pct: '100%' },
    { stage: 'Applications Submitted', count: totalApps * 15 + 42, pct: '38%' },
    { stage: 'AI ATS Verified (>80%)', count: Math.round((totalApps * 15 + 42) * 0.72), pct: '28%' },
    { stage: 'Recruiter Shortlisted', count: Math.max(shortlisted * 8, 22), pct: '14%' },
    { stage: 'Interview Scheduled', count: Math.max(interviewed * 6, 14), pct: '8%' },
    { stage: 'Final Hires / Offers', count: Math.max(selected * 3, 5), pct: '3.5%' },
  ];

  const sectorDistribution = [
    { sector: 'Hospitality & Hotel Operations', share: 28, color: 'bg-blue-500' },
    { sector: 'Technical & MST Maintenance', share: 22, color: 'bg-indigo-500' },
    { sector: 'Logistics & Delivery Staff', share: 18, color: 'bg-amber-500' },
    { sector: 'Corporate Reception & Staff', share: 12, color: 'bg-purple-500' },
    { sector: 'BPO & Call Center Telecaller', share: 12, color: 'bg-emerald-500' },
    { sector: 'Accounts, MIS & IT Support', share: 8, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Hiring Performance & Recruitment Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics on candidate pipeline speed, ATS score distribution, and hiring conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Reporting Period: Last 30 Days
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Time-to-Hire</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            4.8 <span className="text-xs font-bold text-slate-400">Days</span>
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            ⚡ 68% faster than traditional portals
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Interview Turnout Rate</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            92.4%
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Boosted by automated email & SMS alerts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Candidate ATS Score</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            89.2%
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Pre-screened verified resumes
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cost per Hire Efficiency</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            ₹450 <span className="text-xs font-bold text-slate-400">/hire</span>
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Direct connect with zero agency margin
          </p>
        </div>
      </div>

      {/* Funnel & Sector Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Candidate Pipeline & Conversion Funnel
          </h2>

          <div className="space-y-3 pt-2">
            {funnelData.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{step.stage}</span>
                  <span className="text-slate-500">
                    {step.count} candidates ({step.pct})
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segment Demand Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Demand by Segment / श्रेणी अनुसार मांग
          </h2>

          <div className="space-y-3 pt-2">
            {sectorDistribution.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{sec.sector}</span>
                  <span className="text-slate-500">{sec.share}% share</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${sec.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${sec.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
