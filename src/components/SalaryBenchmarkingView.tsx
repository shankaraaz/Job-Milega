import React, { useState, useMemo } from 'react';
import {
  IndianRupee,
  MapPin,
  Briefcase,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Copy,
  Check,
  Calculator,
  Compass,
  Award,
  ChevronDown,
  Info,
  DollarSign,
  Search,
} from 'lucide-react';
import { SALARY_BENCHMARKS, RoleSalaryBenchmark } from '../data/salaryBenchmarks';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

interface SalaryBenchmarkingViewProps {
  onExploreJobsWithRole?: (roleTitle: string) => void;
}

export const SalaryBenchmarkingView: React.FC<SalaryBenchmarkingViewProps> = ({
  onExploreJobsWithRole,
}) => {
  const { candidate, jobs } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('bms-operator');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [selectedExpLevel, setSelectedExpLevel] = useState<'fresher' | 'mid' | 'experienced' | 'senior'>('mid');
  const [candidateSalaryInput, setCandidateSalaryInput] = useState<number>(25000);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // AI Negotiation State
  const [isGeneratingAiAdvice, setIsGeneratingAiAdvice] = useState(false);
  const [aiNegotiationAdvice, setAiNegotiationAdvice] = useState<any>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Selected benchmark entry
  const selectedBenchmark = useMemo(() => {
    return SALARY_BENCHMARKS.find((b) => b.id === selectedRoleId) || SALARY_BENCHMARKS[0];
  }, [selectedRoleId]);

  // Filtered benchmarks for selector dropdown
  const filteredBenchmarks = useMemo(() => {
    if (!roleSearchTerm.trim()) return SALARY_BENCHMARKS;
    const q = roleSearchTerm.toLowerCase();
    return SALARY_BENCHMARKS.filter(
      (b) =>
        b.roleTitle.toLowerCase().includes(q) ||
        b.hindiTitle.toLowerCase().includes(q) ||
        b.sector.toLowerCase().includes(q)
    );
  }, [roleSearchTerm]);

  // Calculate adjusted salary figures using city multiplier
  const cityMultiplier = selectedBenchmark.cityMultipliers[selectedCity] || 1.0;
  const rawBand = selectedBenchmark.experienceLevels[selectedExpLevel];

  const adjustedMin = Math.round(rawBand.min * cityMultiplier);
  const adjustedMedian = Math.round(rawBand.median * cityMultiplier);
  const adjustedMax = Math.round(rawBand.max * cityMultiplier);
  const adjustedP25 = Math.round(rawBand.p25 * cityMultiplier);
  const adjustedP75 = Math.round(rawBand.p75 * cityMultiplier);
  const adjustedP90 = Math.round(rawBand.p90 * cityMultiplier);

  // In-Hand Take Home breakdown estimation for Median
  const grossMonthly = adjustedMedian;
  const basicPay = Math.round(grossMonthly * 0.50);
  const hra = Math.round(grossMonthly * 0.30);
  const specialAllowance = grossMonthly - basicPay - hra;
  const epfDeduction = Math.min(1800, Math.round(basicPay * 0.12));
  const esicDeduction = grossMonthly <= 21000 ? Math.round(grossMonthly * 0.0075) : 0;
  const professionalTax = 200;
  const netInHandTakeHome = grossMonthly - epfDeduction - esicDeduction - professionalTax;
  const annualCtc = grossMonthly * 12;

  // Comparison with candidate's entered salary
  const salaryDiff = candidateSalaryInput - adjustedMedian;
  const salaryDiffPercent = Math.round((salaryDiff / adjustedMedian) * 100);

  // Run AI Salary Negotiation Advisor
  const handleGenerateNegotiationAdvice = async () => {
    setIsGeneratingAiAdvice(true);
    try {
      const response = await fetch('/api/ai/salary-negotiator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: selectedBenchmark.roleTitle,
          sector: selectedBenchmark.sector,
          location: selectedCity,
          experienceYears: selectedExpLevel === 'fresher' ? 0.5 : selectedExpLevel === 'mid' ? 2 : selectedExpLevel === 'experienced' ? 4 : 6,
          currentSalary: candidateSalaryInput,
          offeredSalary: candidateSalaryInput,
          expectedSalary: adjustedP75,
          keySkills: selectedBenchmark.salaryDrivers.map((d) => d.skillOrCert),
        }),
      });
      const data = await response.json();
      setAiNegotiationAdvice(data);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {}
    } catch (err) {
      console.warn('AI Negotiator error:', err);
    } finally {
      setIsGeneratingAiAdvice(false);
    }
  };

  const handleCopy = (text: string, type: 'script' | 'email') => {
    navigator.clipboard?.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // Find matching vacancies currently on Job Milega
  const matchingJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(selectedBenchmark.roleTitle.split(' ')[0].toLowerCase()) ||
    j.sector === selectedBenchmark.sector
  );

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-900 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Updated with Real 2026 Industry Hiring Data & City Indexes</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Salary Benchmarking & Negotiation Calculator <br />
            <span className="text-amber-400">मार्केट वेतन गाइड और इन-हैंड कैलकुलेटर</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Know your exact market worth across housekeeping, BMS, MST maintenance, delivery, receptionist, BPO, accounts, and IT roles. Calculate net take-home in-hand pay and get tailored AI negotiation scripts.
          </p>
        </div>

        <div className="absolute right-4 -bottom-10 opacity-10 hidden lg:block pointer-events-none">
          <Calculator className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Role & Location Filter Selectors */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Job Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>1. Choose Job Role / पेशा</span>
              <span className="text-[10px] text-indigo-500 font-semibold">{filteredBenchmarks.length} Roles</span>
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setAiNegotiationAdvice(null);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {filteredBenchmarks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.roleTitle} ({b.hindiTitle})
                </option>
              ))}
            </select>
          </div>

          {/* 2. City / Location Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>2. Location / शहर</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(selectedBenchmark.cityMultipliers).map((c) => (
                <option key={c} value={c}>
                  {c} {c === 'Mumbai' || c.startsWith('Bengaluru') ? '(Tier-1 Metro)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Experience Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Experience Level / अनुभव</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'fresher', label: '0-1y', full: 'Fresher' },
                { id: 'mid', label: '1-3y', full: 'Mid' },
                { id: 'experienced', label: '3-5y', full: 'Exp' },
                { id: 'senior', label: '5+y', full: 'Senior' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedExpLevel(lvl.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                    selectedExpLevel === lvl.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span className="block">{lvl.label}</span>
                  <span className="text-[9px] font-normal opacity-80 block">{lvl.full}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Role Quick Description */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <p>
            <strong className="text-slate-900 dark:text-white">{selectedBenchmark.roleTitle}</strong> ({selectedBenchmark.hindiTitle}): {selectedBenchmark.description}
          </p>
        </div>
      </div>

      {/* Main Visual Benchmark Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Benchmark Range & In-Hand Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Benchmark Range Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400">
                  Market Expected Pay in {selectedCity}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center">
                    <IndianRupee className="w-6 h-6 text-indigo-600" />
                    {adjustedMedian.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    / month (Market Median)
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Approx. ₹{(annualCtc / 100000).toFixed(2)} Lakhs Annual CTC
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-400 block text-[11px]">Pay Range Span</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                  ₹{adjustedMin.toLocaleString('en-IN')} - ₹{adjustedMax.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">Based on candidate certifications</span>
              </div>
            </div>

            {/* Visual Percentile Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>Entry (25th%)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Market Median (50th%)</span>
                <span>Competitive (75th%)</span>
                <span>Top Tier (90th%)</span>
              </div>

              {/* Multi-step progress bar */}
              <div className="relative w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-slate-300 dark:bg-slate-700 w-1/4" title="25th Percentile" />
                <div className="h-full bg-blue-500 w-1/4" title="50th Percentile" />
                <div className="h-full bg-indigo-600 w-1/4" title="75th Percentile" />
                <div className="h-full bg-emerald-500 w-1/4" title="90th Percentile" />
              </div>

              {/* Price markers */}
              <div className="grid grid-cols-4 text-center text-xs">
                <div>
                  <span className="font-black text-slate-700 dark:text-slate-300">
                    ₹{adjustedP25.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Base Pay</span>
                </div>
                <div>
                  <span className="font-black text-blue-600 dark:text-blue-400">
                    ₹{adjustedMedian.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Standard</span>
                </div>
                <div>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">
                    ₹{adjustedP75.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Negotiate Here</span>
                </div>
                <div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    ₹{adjustedP90.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Lead / Specialist</span>
                </div>
              </div>
            </div>

            {/* In-Hand Monthly Take-Home Calculator Breakdown */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>In-Hand Take Home Salary Estimator / हाथ में आने वाला वेतन</span>
                <span className="text-emerald-600 font-extrabold text-xs">
                  Net: ₹{netInHandTakeHome.toLocaleString('en-IN')} / mo
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-medium block">Basic Salary</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{basicPay.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-medium block">HRA (30%)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{hra.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-rose-500 font-medium block">EPF (12% Deduction)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    -₹{epfDeduction.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-rose-500 font-medium block">ESIC & PT Deduction</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    -₹{(esicDeduction + professionalTax).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive "Compare Your Current Pay" Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              Compare Your Current In-Hand Pay vs Benchmark
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="block text-[11px] text-slate-400 mb-1">
                  Enter Your Current Monthly In-Hand Salary (or Offer Received):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="1000"
                    value={candidateSalaryInput}
                    onChange={(e) => setCandidateSalaryInput(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto pt-4 sm:pt-0">
                <div
                  className={`p-3 rounded-xl border text-xs font-bold text-center ${
                    salaryDiffPercent < -10
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : salaryDiffPercent > 10
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {salaryDiffPercent < -10 ? (
                    <div>
                      <p className="flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Underpaid by {Math.abs(salaryDiffPercent)}%
                      </p>
                      <p className="text-[10px] font-normal mt-0.5">
                        Ask for at least ₹{adjustedP75.toLocaleString('en-IN')} in next interview!
                      </p>
                    </div>
                  ) : salaryDiffPercent > 10 ? (
                    <div>
                      <p className="flex items-center justify-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-500" />
                        Top Tier Pay (+{salaryDiffPercent}% above median)
                      </p>
                      <p className="text-[10px] font-normal mt-0.5">
                        You are in the 75th-90th percentile!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>Fair Market Pay (Within ±10% of median)</p>
                      <p className="text-[10px] font-normal mt-0.5">Aligned with current hiring norms</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Negotiation Coach & Script Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Gemini AI Negotiation Script Generator
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  Get Tailored Verbal Scripts & Email Counter-Offers
                </h3>
              </div>

              <button
                type="button"
                onClick={handleGenerateNegotiationAdvice}
                disabled={isGeneratingAiAdvice}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{isGeneratingAiAdvice ? 'Drafting Scripts...' : 'Generate Negotiation Plan'}</span>
              </button>
            </div>

            {aiNegotiationAdvice ? (
              <div className="space-y-4 pt-2 text-xs animate-fadeIn">
                {/* Talking Points */}
                <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    Top 3 Justification Points for Recruiter:
                  </h4>
                  <ul className="space-y-1.5 text-slate-200">
                    {aiNegotiationAdvice.talkingPoints.map((tp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verbal Phone / F2F Script */}
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                      Verbal Negotiation Script (Say this politely in interview):
                    </h4>
                    <button
                      onClick={() => handleCopy(aiNegotiationAdvice.verbalScript, 'script')}
                      className="text-[10px] font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="p-3 rounded-lg bg-slate-950 text-slate-200 italic leading-relaxed border border-slate-800">
                    "{aiNegotiationAdvice.verbalScript}"
                  </p>
                </div>

                {/* Non-Cash Perks */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    Alternative Perks to Request (If Base Salary is Fixed):
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {aiNegotiationAdvice.nonCashPerksToNegotiate.map((perk: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 text-[11px]"
                      >
                        ✓ {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                Click <strong>"Generate Negotiation Plan"</strong> to get custom polite talking points, verbal scripts, and non-cash allowances tailored for {selectedBenchmark.roleTitle} in {selectedCity}.
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Salary Boost Drivers & Open Vacancies */}
        <div className="space-y-6">
          {/* Salary Drivers Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              What Boosts Salary in This Role?
            </h3>
            <p className="text-xs text-slate-500">
              Certifications and skills that allow candidates to command 75th-90th percentile compensation:
            </p>

            <div className="space-y-2.5">
              {selectedBenchmark.salaryDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {driver.skillOrCert}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {driver.boostAmount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Perks in this segment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-500" />
              Standard Industry Perks
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {selectedBenchmark.typicalPerks.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-medium"
                >
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          {/* Real Matching Jobs on Job Milega */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl p-6 border border-blue-200 dark:border-blue-900 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Matching Jobs on Portal</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {matchingJobs.length} Live
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Apply directly to verified employers hiring for {selectedBenchmark.roleTitle}.
            </p>

            <div className="space-y-2 pt-1">
              {matchingJobs.slice(0, 2).map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800 text-xs space-y-1 shadow-sm"
                >
                  <p className="font-bold text-slate-900 dark:text-white truncate">{job.title}</p>
                  <p className="text-[11px] text-slate-500">{job.company} • {job.city}</p>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                    ₹{job.salaryMin.toLocaleString('en-IN')} - ₹{job.salaryMax.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {onExploreJobsWithRole && (
              <button
                type="button"
                onClick={() => onExploreJobsWithRole(selectedBenchmark.roleTitle)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Browse All {matchingJobs.length} Vacancies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
