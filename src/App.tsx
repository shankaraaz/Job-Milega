import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { JobList } from './components/CandidateView/JobList';
import { JobDetailsModal } from './components/CandidateView/JobDetailsModal';
import { CandidateProfileView } from './components/CandidateView/CandidateProfile';
import { ApplicationTracker } from './components/CandidateView/ApplicationTracker';
import { JobAlertsSettings } from './components/CandidateView/JobAlertsSettings';
import { RecruiterDashboard } from './components/RecruiterView/RecruiterDashboard';
import { PostJobModal } from './components/RecruiterView/PostJobModal';
import { ApplicantManager } from './components/RecruiterView/ApplicantManager';
import { InterviewSchedulerModal } from './components/RecruiterView/InterviewSchedulerModal';
import { PremiumPlansModal } from './components/RecruiterView/PremiumPlansModal';
import { RecruiterAnalytics } from './components/RecruiterView/RecruiterAnalytics';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { ChatWindow } from './components/Chat/ChatWindow';
import { AIResumeScannerModal } from './components/AIResumeScannerModal';
import { PrintProfileModal } from './components/PrintProfileModal';
import { SalaryBenchmarkingView } from './components/SalaryBenchmarkingView';
import { ApplyJobModal } from './components/CandidateView/ApplyJobModal';
import { VerifiedSkillsHub } from './components/CandidateView/VerifiedSkillsHub';
import { CandidatePassModal } from './components/CandidateView/CandidatePassModal';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/Auth/AuthModal';
import { Job, Application, CandidateProfile } from './types';
import {
  Briefcase,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  MapPin,
  Heart,
  Globe,
  Sparkles,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    role,
    setRole,
    activeNav,
    setActiveNav,
    candidate,
    startOrOpenChatWithCandidate,
    sidebarCollapsed,
  } = useApp();

  // Modals state
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [jobForApplyModal, setJobForApplyModal] = useState<Job | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isPremiumPlansOpen, setIsPremiumPlansOpen] = useState(false);
  const [isCandidatePassModalOpen, setIsCandidatePassModalOpen] = useState(false);
  const [isAiScanOpen, setIsAiScanOpen] = useState(false);
  const [isPrintProfileOpen, setIsPrintProfileOpen] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [candidateForPrint, setCandidateForPrint] = useState<CandidateProfile | null>(null);

  // Chat openers
  const handleOpenChatWithJob = (jobId: string, companyName: string) => {
    startOrOpenChatWithCandidate(jobId, candidate.id, candidate.fullName, companyName);
    setActiveNav('chat');
  };

  const handleOpenChatWithCandidateFromRecruiter = (
    jobId: string,
    candId: string,
    candName: string,
    compName: string
  ) => {
    startOrOpenChatWithCandidate(jobId, candId, candName, compName);
    setActiveNav('chat');
  };

  const handleDownloadProfileForApp = (app: Application) => {
    // Generate profile structure for the candidate of this application
    const profileToDownload: CandidateProfile = {
      ...candidate,
      id: app.candidateId,
      fullName: app.candidateName,
      email: app.candidateEmail,
      phone: app.candidatePhone,
      currentTitle: app.candidateTitle,
      experienceYears: app.candidateExperience,
      atsScore: app.atsMatchScore,
      atsSummary: app.atsMatchDetails?.summary || 'Shortlisted profile for ' + app.jobTitle,
    };
    setCandidateForPrint(profileToDownload);
    setIsPrintProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sleek Left Sidebar */}
      <Sidebar
        onOpenCandidatePass={() => setIsCandidatePassModalOpen(true)}
        onOpenUpgradePlans={() => setIsPremiumPlansOpen(true)}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
      />

      {/* Main Content Area Offset by Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-72'
        }`}
      >
        {/* Navigation Header */}
        <Navbar
          onOpenAiScanner={() => setIsAiScanOpen(true)}
          onOpenCandidatePass={() => setIsCandidatePassModalOpen(true)}
        />

        {/* Main View Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Candidate View Screens */}
        {role === 'candidate' && (
          <>
            {activeNav === 'jobs' && (
              <JobList
                onOpenJobDetails={(job) => setSelectedJobForModal(job)}
                onOpenAiScan={() => setIsAiScanOpen(true)}
                onOpenSalaryGuide={() => setActiveNav('salary')}
                onOpenApplyModal={(job) => setJobForApplyModal(job)}
              />
            )}
            {activeNav === 'applications' && (
              <ApplicationTracker
                onOpenChatWithJob={handleOpenChatWithJob}
                onExploreJobs={() => setActiveNav('jobs')}
              />
            )}
            {activeNav === 'profile' && (
              <CandidateProfileView
                onOpenPrintModal={() => {
                  setCandidateForPrint(candidate);
                  setIsPrintProfileOpen(true);
                }}
                onOpenAiScan={() => setIsAiScanOpen(true)}
              />
            )}
            {activeNav === 'documents' && (
              <CandidateProfileView
                defaultTab="documents"
                onOpenPrintModal={() => {
                  setCandidateForPrint(candidate);
                  setIsPrintProfileOpen(true);
                }}
                onOpenAiScan={() => setIsAiScanOpen(true)}
              />
            )}
            {activeNav === 'skills' && (
              <VerifiedSkillsHub onOpenAiScan={() => setIsAiScanOpen(true)} />
            )}
            {activeNav === 'chat' && <ChatWindow />}
            {activeNav === 'alerts' && <JobAlertsSettings />}
            {activeNav === 'salary' && (
              <SalaryBenchmarkingView
                onExploreJobsWithRole={() => setActiveNav('jobs')}
              />
            )}
          </>
        )}

        {/* Recruiter View Screens */}
        {role === 'recruiter' && (
          <>
            {activeNav === 'dashboard' && (
              <RecruiterDashboard
                onOpenPostJob={() => setIsPostJobModalOpen(true)}
                onOpenUpgradePlans={() => setIsPremiumPlansOpen(true)}
                onNavigateToApplicants={() => setActiveNav('applicants')}
                onNavigateToInterviews={() => setActiveNav('applicants')}
                onNavigateToAnalytics={() => setActiveNav('analytics')}
                onScheduleInterviewForApp={(app) => setSelectedAppForInterview(app)}
              />
            )}
            {activeNav === 'applicants' && (
              <ApplicantManager
                onOpenScheduleInterview={(app) => setSelectedAppForInterview(app)}
                onOpenChatWithCandidate={handleOpenChatWithCandidateFromRecruiter}
                onDownloadProfile={handleDownloadProfileForApp}
              />
            )}
            {activeNav === 'interviews' && (
              <ApplicantManager
                onOpenScheduleInterview={(app) => setSelectedAppForInterview(app)}
                onOpenChatWithCandidate={handleOpenChatWithCandidateFromRecruiter}
                onDownloadProfile={handleDownloadProfileForApp}
              />
            )}
            {activeNav === 'analytics' && <RecruiterAnalytics />}
            {activeNav === 'chat' && <ChatWindow />}
            {activeNav === 'salary' && (
              <SalaryBenchmarkingView
                onExploreJobsWithRole={() => setActiveNav('applicants')}
              />
            )}
          </>
        )}

        {/* Super Admin Screens */}
        {role === 'admin' && (
          <AdminDashboard
            onDownloadProfile={handleDownloadProfileForApp}
            onOpenScheduleInterview={(app) => setSelectedAppForInterview(app)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  Job<span className="text-blue-600">Milega</span>.in
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                India's all-inclusive recruitment portal for hotel operations, housekeeping boy, helper, pantry staff, BMS & MST technicians, delivery personnel, front desk lady receptionists, accountants, BPO telecallers, and IT engineers.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
                Blue & Pink Collar Segments
              </h4>
              <ul className="space-y-1 text-[11px]">
                <li>Housekeeping Boy (HK Boy) & Hotel Helpers</li>
                <li>Pantry Boy & Office Tea Staff</li>
                <li>Delivery Riders & Loading/Unloading Porters</li>
                <li>Lady Staff Receptionist & Front Office Hostess</li>
                <li>Security Guards & Facility Supervisors</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
                Technical, Office & IT Segments
              </h4>
              <ul className="space-y-1 text-[11px]">
                <li>BMS Operators (Building Management Systems)</li>
                <li>MST Maintenance Teams (Multi-Skilled Tech)</li>
                <li>Accountants (Tally Prime, GST & TDS)</li>
                <li>MIS Executives & Back Office Associates</li>
                <li>BPO Call Center Inbound / Outbound Telecallers</li>
                <li>IT Desktop Support & Software Developers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
                Recruiter Guarantee & Security
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                100% verified employer credentials (GSTIN / CIN), AI ATS candidate matching, automated email interview scheduling, and instant Razorpay/UPI payment receipts.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                ISO 27001 Certified Data Security
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© 2026 Job Milega Technologies Pvt Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 text-slate-400">
              Made with dedication for Indian Job Seekers & Recruiters
            </p>
          </div>
        </div>
      </footer>
      </div>

      {/* Global Modals */}
      {selectedJobForModal && (
        <JobDetailsModal
          job={selectedJobForModal}
          onClose={() => setSelectedJobForModal(null)}
          onOpenChatWithRecruiter={(job) => {
            setSelectedJobForModal(null);
            handleOpenChatWithJob(job.id, job.company);
          }}
          onOpenSalaryBenchmark={() => setActiveNav('salary')}
          onOpenApplyModal={(job) => setJobForApplyModal(job)}
        />
      )}

      {jobForApplyModal && (
        <ApplyJobModal
          job={jobForApplyModal}
          isOpen={Boolean(jobForApplyModal)}
          onClose={() => setJobForApplyModal(null)}
          onSuccessTrack={() => setActiveNav('applications')}
        />
      )}

      {isPostJobModalOpen && (
        <PostJobModal
          isOpen={isPostJobModalOpen}
          onClose={() => setIsPostJobModalOpen(false)}
        />
      )}

      {isPremiumPlansOpen && (
        <PremiumPlansModal
          isOpen={isPremiumPlansOpen}
          onClose={() => setIsPremiumPlansOpen(false)}
        />
      )}

      {isAiScanOpen && (
        <AIResumeScannerModal
          isOpen={isAiScanOpen}
          onClose={() => setIsAiScanOpen(false)}
        />
      )}

      {isPrintProfileOpen && (
        <PrintProfileModal
          candidate={candidateForPrint || candidate}
          isOpen={isPrintProfileOpen}
          onClose={() => {
            setIsPrintProfileOpen(false);
            setCandidateForPrint(null);
          }}
        />
      )}

      {selectedAppForInterview && (
        <InterviewSchedulerModal
          application={selectedAppForInterview}
          isOpen={Boolean(selectedAppForInterview)}
          onClose={() => setSelectedAppForInterview(null)}
        />
      )}

      {/* Global Candidate Pass Modal */}
      <CandidatePassModal
        isOpen={isCandidatePassModalOpen}
        onClose={() => setIsCandidatePassModalOpen(false)}
      />

      {/* Authentic Job Milega Login / Register & Google OAuth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
