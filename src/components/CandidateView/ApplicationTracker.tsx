import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';

interface ApplicationTrackerProps {
  onOpenChatWithJob: (jobId: string, companyName: string) => void;
  onExploreJobs: () => void;
}

const STAGES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'AI ATS Screened',
  'Shortlisted',
  'Interview Scheduled',
  'Selected / Offer',
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  onOpenChatWithJob,
  onExploreJobs,
}) => {
  const { applications, candidate } = useApp();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Candidate's applications
  const myApplications = applications.filter((a) => a.candidateId === candidate.id);

  const filteredApps = myApplications.filter((app) => {
    if (selectedStatusFilter === 'All') return true;
    if (selectedStatusFilter === 'Interview') return app.status === 'Interview Scheduled';
    if (selectedStatusFilter === 'Shortlisted') return app.status === 'Shortlisted';
    return app.status === selectedStatusFilter;
  });

  const getStageIndex = (status: ApplicationStatus): number => {
    const idx = STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Real-time Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track hiring stages live from application receipt to final selection and interview slots.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {['All', 'Interview', 'Shortlisted'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedStatusFilter === filter
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {filter === 'All'
                ? `All (${myApplications.length})`
                : filter === 'Interview'
                ? `Interviews (${myApplications.filter((a) => a.status === 'Interview Scheduled').length})`
                : `Shortlisted (${myApplications.filter((a) => a.status === 'Shortlisted').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-500">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No applications in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Explore open jobs and submit your profile with 1-click apply.</p>
          <button
            onClick={onExploreJobs}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Explore Open Vacancies
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map((app) => {
            const currentStageIdx = getStageIndex(app.status);

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-6"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {app.companyName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Applied on {app.appliedDate}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {app.jobTitle}
                    </h2>
                    {app.candidateVerifiedBadges && app.candidateVerifiedBadges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {app.candidateVerifiedBadges.map((badge) => (
                          <span
                            key={badge.id}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs"
                          >
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>{badge.name}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px]">
                              (+{badge.atsBoostPoints}% ATS)
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChatWithJob(app.jobId, app.companyName)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                      <span>Message Recruiter</span>
                    </button>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        app.status === 'Interview Scheduled'
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
                          : app.status === 'Shortlisted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="py-2">
                  <div className="relative">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                      className="hidden sm:block absolute top-1/2 left-4 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 -translate-y-1/2 z-0 transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.max(0, (currentStageIdx / (STAGES.length - 1)) * 100))}%`,
                      }}
                    />

                    {/* Stage Nodes */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
                      {STAGES.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div
                            key={stage}
                            className={`flex sm:flex-col items-center sm:text-center gap-2 p-2 sm:p-0 rounded-lg sm:rounded-none ${
                              isCurrent ? 'bg-blue-50/70 dark:bg-blue-950/30 sm:bg-transparent' : ''
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                                isCompleted
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                              } ${isCurrent ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div className="sm:mt-2 text-left sm:text-center">
                              <p
                                className={`text-xs font-bold leading-tight ${
                                  isCurrent
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : isCompleted
                                    ? 'text-slate-900 dark:text-slate-200'
                                    : 'text-slate-400 dark:text-slate-600'
                                }`}
                              >
                                {stage}
                              </p>
                              <p className="text-[10px] text-slate-400 hidden sm:block">
                                {idx === 0
                                  ? 'Received'
                                  : idx === 1
                                  ? 'HR Review'
                                  : idx === 2
                                  ? 'ATS Match'
                                  : idx === 3
                                  ? 'Shortlisted'
                                  : idx === 4
                                  ? 'Slot Booked'
                                  : 'Selection'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scheduled Interview Highlight Box (if interview is set) */}
                {app.scheduledInterview && (
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-900/60 shadow-inner">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Confirmed Interview Invitation
                          </h4>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Automated confirmation email dispatched to your inbox.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                        {app.scheduledInterview.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                      <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                        <span className="text-slate-400 text-[10px] font-medium block">Date & Time</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {app.scheduledInterview.date} at {app.scheduledInterview.time}
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                        <span className="text-slate-400 text-[10px] font-medium block">Interview Mode</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {app.scheduledInterview.mode}
                        </span>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                        <span className="text-slate-400 text-[10px] font-medium block">Recruiter Contact</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate block">
                          {app.scheduledInterview.recruiterContact}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-amber-200/40 dark:border-amber-900/30 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">Venue / Link: </span>
                      {app.scheduledInterview.locationOrLink}
                    </div>

                    {app.scheduledInterview.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                        Note: {app.scheduledInterview.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Status History Logs */}
                {app.statusHistory.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                      Recent Activity Log:
                    </span>
                    <div className="space-y-1.5">
                      {app.statusHistory.slice(-3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <strong className="text-slate-800 dark:text-slate-200">{item.status}:</strong>{' '}
                            {item.note || 'Status updated'}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
