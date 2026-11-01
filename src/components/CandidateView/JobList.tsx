import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Zap,
  Building,
  Filter,
  Flame,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job, JobSector } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { CandidatePassModal } from './CandidatePassModal';
import confetti from 'canvas-confetti';

interface JobListProps {
  onOpenJobDetails: (job: Job) => void;
  onOpenAiScan: () => void;
  onOpenSalaryGuide?: () => void;
  onOpenApplyModal?: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({
  onOpenJobDetails,
  onOpenAiScan,
  onOpenSalaryGuide,
  onOpenApplyModal,
}) => {
  const {
    jobs,
    applications,
    applyForJob,
    candidate,
    candidateSubscription,
    hasActiveCandidateSubscription,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All Segments / सभी विभाग');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('All');
  const [showOnlyUrgent, setShowOnlyUrgent] = useState<boolean>(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalJob, setPassModalJob] = useState<Job | null>(null);

  const appliedJobIds = useMemo(() => {
    return new Set(applications.map((a) => a.jobId));
  }, [applications]);

  const cities = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.city))).filter(Boolean);
    return ['All Cities', ...list];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Sector filter
      if (selectedSector !== 'All Segments / सभी विभाग' && job.sector !== selectedSector) {
        return false;
      }
      // City filter
      if (selectedCity !== 'All Cities' && job.city !== selectedCity) {
        return false;
      }
      // Job type
      if (jobTypeFilter !== 'All' && job.jobType !== jobTypeFilter) {
        return false;
      }
      // Urgent filter
      if (showOnlyUrgent && !job.urgentHiring) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesSubCat = job.subCategory.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesPerks = job.perks.some((p) => p.toLowerCase().includes(query));
        const matchesLoc = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesSubCat && !matchesDesc && !matchesPerks && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, selectedSector, selectedCity, jobTypeFilter, showOnlyUrgent, searchTerm]);

  const handleQuickApply = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    if (appliedJobIds.has(job.id)) return;

    // Check candidate subscription paywall
    if (!hasActiveCandidateSubscription) {
      setPassModalJob(job);
      setIsPassModalOpen(true);
      return;
    }

    if (onOpenApplyModal) {
      onOpenApplyModal(job);
      return;
    }

    setApplyingJobId(job.id);
    const success = await applyForJob(job.id);
    setApplyingJobId(null);

    if (success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold mb-3 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct Hiring • Verified Employers • No Registration Fee</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Job Khojo. Turant Apply Karo. <br />
            <span className="text-amber-300">Job Milega Guarantee!</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            Housekeeping (HK Boy), BMS Operator, MST Maintenance, Delivery Staff, Receptionist, BPO Call Center, Accountant & IT Jobs across top Indian cities.
          </p>

          {/* Search Inputs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-2xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, skills (e.g., HK boy, BMS, Accountant, Telecaller)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm font-medium focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {}}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-6 hidden lg:block opacity-20 hover:opacity-30 transition-opacity">
          <Building className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Sector Category Pills (Horizontal Scroll) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filter By Job Category / विभाग चुनें
          </span>
          <span className="text-blue-600 dark:text-blue-400">{filteredJobs.length} Jobs Available</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTOR_OPTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedSector === sec
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Quick Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium">Quick Filters:</span>
          <button
            onClick={() => setShowOnlyUrgent(!showOnlyUrgent)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold border transition-all ${
              showOnlyUrgent
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-500" />
            <span>Urgent Hiring Only</span>
          </button>

          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Shift-based">Shift-based</option>
            <option value="Night Shift">Night Shift</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSalaryGuide && (
            <button
              onClick={onOpenSalaryGuide}
              className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Salary Benchmark Guide</span>
            </button>
          )}

          {/* AI Resume Match Helper Callout */}
          <button
            onClick={onOpenAiScan}
            className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Check Resume Match</span>
          </button>
        </div>
      </div>

      {/* Candidate Pass Banner (₹99 for 1M, ₹299 for 3M) */}
      {!hasActiveCandidateSubscription ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border-2 border-amber-400/40 dark:border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
              <Lock className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  Job Milega Pass
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  ₹99 (1 Month) • ₹299 (3 Months)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Job Kahan Hai Dikh Raha Hai • Recruiter WhatsApp & Apply Unlock Karo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Job location (City/Area) sabhi ko dikhayi de rahi hai. Lekin direct HR contact aur turant apply ke liye pass lein aur pura portal unlock karein!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setPassModalJob(null);
                setIsPassModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Unlock All Jobs (₹99)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300">
                  ⭐ VIP Pass Active: {candidateSubscription.planName}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  Valid until {candidateSubscription.expiresAt}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Pura portal unlock hai! Sabhi jobs ke recruiter direct phone number, WhatsApp aur 1-click apply active hain.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            Manage Pass →
          </button>
        </div>
      )}

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No jobs found matching your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or selecting "All Segments".</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSector('All Segments / सभी विभाग');
              setSelectedCity('All Cities');
              setShowOnlyUrgent(false);
              setJobTypeFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            const app = applications.find((a) => a.jobId === job.id);

            return (
              <div
                key={job.id}
                onClick={() => onOpenJobDetails(job)}
                className="group relative bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Badges & Company */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </span>
                        {job.isVerifiedCompany && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            title="Verified Employer with GST/CIN validation"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Verified
                          </span>
                        )}
                        {job.urgentHiring && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-900 animate-pulse">
                            <Flame className="w-3 h-3 text-rose-500" />
                            Urgent Hiring
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h2>
                    </div>

                    {/* Sector Tag */}
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {job.subCategory}
                    </span>
                  </div>

                  {/* Salary, Location & Experience specs */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-emerald-400 flex items-center gap-0.5 text-sm">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {job.salaryMin.toLocaleString('en-IN')} - {job.salaryMax.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-normal text-slate-400">/{job.salaryPeriod}</span>
                    </span>

                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {job.experienceRequired}
                    </span>

                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.jobType}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Perks Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.perks.slice(0, 3).map((perk, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
                      >
                        ✓ {perk}
                      </span>
                    ))}
                    {job.perks.length > 3 && (
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded text-slate-400">
                        +{job.perks.length - 3} more perks
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Status & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    <span>{job.openings} openings</span> • <span>Posted {job.postedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Status: {app?.status || 'Applied'}</span>
                      </span>
                    ) : !hasActiveCandidateSubscription ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassModalJob(job);
                          setIsPassModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Lock className="w-3 h-3 text-slate-950" />
                        <span>Unlock & Apply (₹99)</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleQuickApply(e, job)}
                        disabled={applyingJobId === job.id}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-60"
                      >
                        {applyingJobId === job.id ? (
                          <span>Applying...</span>
                        ) : (
                          <>
                            <span>Easy Apply</span>
                            <Zap className="w-3 h-3 text-amber-300" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Subscription Modal for ₹99 / ₹299 */}
      <CandidatePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        highlightJobTitle={passModalJob?.title}
      />
    </div>
  );
};
