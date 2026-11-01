import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Download,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Star,
  Printer,
  Award,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';

interface ApplicantManagerProps {
  onOpenScheduleInterview: (app: Application) => void;
  onOpenChatWithCandidate: (jobId: string, candidateId: string, candidateName: string, companyName: string) => void;
  onDownloadProfile: (app: Application) => void;
}

export const ApplicantManager: React.FC<ApplicantManagerProps> = ({
  onOpenScheduleInterview,
  onOpenChatWithCandidate,
  onDownloadProfile,
}) => {
  const { applications, updateApplicationStatus, shortlistCandidate, jobs, candidate } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyVerifiedBadges, setOnlyVerifiedBadges] = useState(false);

  const filteredApps = applications.filter((app) => {
    if (selectedJobId !== 'All' && app.jobId !== selectedJobId) return false;
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (onlyVerifiedBadges && (!app.candidateVerifiedBadges || app.candidateVerifiedBadges.length === 0)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.candidateName.toLowerCase().includes(q);
      const matchRole = app.jobTitle.toLowerCase().includes(q);
      const matchTitle = app.candidateTitle.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Applicant Tracking & AI ATS Screening
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review candidate resumes, shortlist qualified talent, schedule interviews with automated emails, and export biodata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Total Applicants: {applications.length}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Shortlisted: {applications.filter((a) => a.status === 'Shortlisted').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-900 dark:text-white text-xs"
          />
        </div>

        {/* Filter by Job Posting */}
        <div>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="All">All Job Vacancies ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.city})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="All">All Application Stages</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="AI ATS Screened">AI ATS Screened</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected / Offer">Selected / Offer Made</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Filter: Only Verified Badges Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setOnlyVerifiedBadges(!onlyVerifiedBadges)}
            className={`w-full py-2 px-3 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              onlyVerifiedBadges
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600" />
            <span>{onlyVerifiedBadges ? '✓ Verified Badges' : 'Filter: Verified Badges'}</span>
          </button>
        </div>
      </div>

      {/* Applicants List Table / Cards */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No applicants matching this filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filter or posting a featured boost.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isShortlisted = app.status === 'Shortlisted';
            const isInterview = app.status === 'Interview Scheduled';

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-3.5">
                  {app.candidateAvatarUrl ? (
                    <img
                      src={app.candidateAvatarUrl}
                      alt={app.candidateName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md border border-indigo-500/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {app.candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {app.candidateName}
                      </h3>
                      {/* AI ATS Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        AI ATS Score: {app.atsMatchScore}%
                      </span>
                      {app.resumeFileName && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          📄 {app.resumeFileName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Applied for <strong className="text-blue-600 dark:text-blue-400">{app.jobTitle}</strong> • {app.candidateExperience} yrs exp {app.expectedSalary ? `• Exp: ${app.expectedSalary}` : ''}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {app.candidatePhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {app.candidateEmail}
                      </span>
                      <span>Applied: {app.appliedDate}</span>
                      {app.noticePeriod && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          • {app.noticePeriod}
                        </span>
                      )}
                    </div>

                    {app.coverNote && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 line-clamp-1">
                        "{app.coverNote}"
                      </p>
                    )}

                    {/* Matched skills chips */}
                    {app.atsMatchDetails?.matchedSkills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {app.atsMatchDetails.matchedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Verified Skill Badges */}
                    {app.candidateVerifiedBadges && app.candidateVerifiedBadges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {app.candidateVerifiedBadges.map((badge) => (
                          <span
                            key={badge.id}
                            className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs"
                            title={`Verified via ${badge.source} • ID: ${badge.verificationId}`}
                          >
                            <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>{badge.name}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px]">
                              (+{badge.atsBoostPoints}% ATS)
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stored KYC Documents Verification */}
                    {candidate.id === app.candidateId && candidate.documents && candidate.documents.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          <Lock className="w-3 h-3 text-emerald-500" />
                          <span>
                            {candidate.documents.filter((d) => d.status === 'Verified').length} Verified Documents Attached
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Selector & Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="AI ATS Screened">AI ATS Screened</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected / Offer">Selected / Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Shortlist Quick Action */}
                  {!isShortlisted && !isInterview && (
                    <button
                      onClick={() => shortlistCandidate(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Shortlist this candidate"
                    >
                      <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                      <span>Shortlist</span>
                    </button>
                  )}

                  {/* Schedule Interview */}
                  <button
                    onClick={() => onOpenScheduleInterview(app)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span>{isInterview ? 'Edit Interview' : 'Schedule Interview'}</span>
                  </button>

                  {/* Download Profile / Biodata */}
                  <button
                    onClick={() => onDownloadProfile(app)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Download candidate formatted profile & contact biodata"
                  >
                    <Download className="w-4 h-4 text-blue-500" />
                  </button>

                  {/* Real-time Chat */}
                  <button
                    onClick={() =>
                      onOpenChatWithCandidate(
                        app.jobId,
                        app.candidateId,
                        app.candidateName,
                        app.companyName
                      )
                    }
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Message candidate directly"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
