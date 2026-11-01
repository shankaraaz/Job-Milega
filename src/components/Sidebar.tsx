import React from 'react';
import {
  Briefcase,
  Search,
  Clock,
  FileText,
  Award,
  Lock,
  MessageSquare,
  Bell,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  CreditCard,
  Plus,
  Flame,
  CheckCircle2,
  FolderLock,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  onOpenCandidatePass: () => void;
  onOpenUpgradePlans: () => void;
  onOpenPostJob: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCandidatePass,
  onOpenUpgradePlans,
  onOpenPostJob,
}) => {
  const {
    role,
    setRole,
    isSuperAdmin,
    activeNav,
    setActiveNav,
    applications,
    candidate,
    jobs,
    emailLogs,
    hiredCommissions,
    hasActiveCandidateSubscription,
    candidateSubscription,
    isRecruiterProSubscribed,
    currentUser,
    isAuthenticated,
    logout,
    setIsAuthModalOpen,
    setAuthModalDefaultMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarMobileOpen,
    setSidebarMobileOpen,
  } = useApp();

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    setSidebarMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarMobileOpen && (
        <div
          onClick={() => setSidebarMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72'}`}
      >
        {/* Desktop Border Collapse/Expand Floating Button */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-5 z-50 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all cursor-pointer"
          title={sidebarCollapsed ? "Expand sidebar (Click to open)" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Top Header: Logo + Collapse Toggle */}
        <div
          className={`h-16 border-b border-slate-100 dark:border-slate-800 flex items-center shrink-0 transition-all ${
            sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <div
            onClick={() => {
              if (sidebarCollapsed) {
                setSidebarCollapsed(false);
              } else {
                if (role === 'candidate') handleNavClick('jobs');
                else if (role === 'recruiter') handleNavClick('dashboard');
                else handleNavClick('overview');
              }
            }}
            className={`flex items-center gap-2.5 cursor-pointer group ${
              sidebarCollapsed ? 'justify-center' : 'overflow-hidden'
            }`}
            title={sidebarCollapsed ? 'Job Milega (Click to expand)' : 'Job Milega Home'}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>

            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Job<span className="text-blue-600 dark:text-blue-400">Milega</span>
                  </span>
                  <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    .in
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  All-India Recruitment Portal
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle (only when expanded, clean inside header) */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Pill (Candidate / Recruiter / Admin - Admin is SuperAdmin Only) */}
        {!sidebarCollapsed ? (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Portal Role:
              </span>
              {isSuperAdmin && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  👑 Super Admin
                </span>
              )}
            </div>

            <div
              className={`grid gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold ${
                isSuperAdmin ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  role === 'candidate'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-1.5 rounded-lg transition-all text-center ${
                  role === 'recruiter'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Recruiter
              </button>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-1.5 rounded-lg transition-all text-center ${
                    role === 'admin'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Super Admin Panel (Shivshankar)"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex justify-center">
            <button
              onClick={() => {
                if (role === 'candidate') setRole('recruiter');
                else if (role === 'recruiter') {
                  if (isSuperAdmin) setRole('admin');
                  else setRole('candidate');
                } else setRole('candidate');
              }}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300"
              title={`Switch role (Current: ${role === 'candidate' ? 'Job Seeker' : role === 'recruiter' ? 'Recruiter' : 'Admin'})`}
            >
              {role === 'candidate' ? '👤' : role === 'recruiter' ? '🏢' : '🛡️'}
            </button>
          </div>
        )}

        {/* Navigation Links Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-semibold">
          {/* Candidate Menu */}
          {role === 'candidate' && (
            <>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                  Candidate Hub
                </span>
              )}

              <button
                onClick={() => handleNavClick('jobs')}
                title="Find Jobs"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'jobs'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Search className="w-4 h-4 shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Find Jobs</span>}
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {jobs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('applications')}
                title="Track Status"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'applications'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Track Status</span>}
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                title="Resume & Biodata"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-indigo-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Resume & Biodata</span>}
              </button>

              <button
                onClick={() => handleNavClick('skills')}
                title="Verified Skills & Badges"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'skills'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4 shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Verified Skills & Badges</span>}
                {!sidebarCollapsed && candidate.verifiedBadges && candidate.verifiedBadges.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('documents')}
                title="Documents Vault"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'documents'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <FolderLock className="w-4 h-4 shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Documents Vault</span>}
                {!sidebarCollapsed && candidate.documents && candidate.documents.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    {candidate.documents.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                title="Messages & Chat"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'chat'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Messages & Chat</span>}
              </button>

              <button
                onClick={() => handleNavClick('alerts')}
                title="Job Alerts Settings"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'alerts'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Bell className="w-4 h-4 shrink-0 text-rose-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Job Alerts Settings</span>}
              </button>

              <button
                onClick={() => handleNavClick('salary')}
                title="Salary Benchmarks"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'salary'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Salary Benchmarks</span>}
              </button>
            </>
          )}

          {/* Recruiter Menu */}
          {role === 'recruiter' && (
            <>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                  Recruiter Suite
                </span>
              )}

              <button
                onClick={() => handleNavClick('dashboard')}
                title="Command Dashboard"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-indigo-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Command Dashboard</span>}
              </button>

              <button
                onClick={() => handleNavClick('applicants')}
                title="Applicants & AI Score"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'applicants'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Applicants & AI Score</span>}
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('interviews')}
                title="Interviews & Email Invites"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'interviews'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Interviews & Email Invites</span>}
                {!sidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                    {emailLogs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('analytics')}
                title="Hiring Analytics"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'analytics'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Hiring Analytics</span>}
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                title="Candidate Messages"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'chat'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Candidate Messages</span>}
              </button>

              <button
                onClick={() => handleNavClick('salary')}
                title="Salary Benchmarks"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'salary'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Salary Benchmarks</span>}
              </button>
            </>
          )}

          {/* Admin Menu - Exclusively for Super Admin (shivshankarluck) */}
          {role === 'admin' && isSuperAdmin && (
            <>
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Super Admin Suite
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                    Shivshankar
                  </span>
                </div>
              )}

              <button
                onClick={() => handleNavClick('overview')}
                title="Overview & Stats"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'overview'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-emerald-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Overview & Stats</span>}
              </button>

              <button
                onClick={() => handleNavClick('segments')}
                title="All-Segment Inspector Hub"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'segments'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-teal-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Inspect All Segments</span>}
                {!sidebarCollapsed && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    11 Sectors
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('shortlisted')}
                title="Shortlisted Candidates"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'shortlisted'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Shortlisted Candidates</span>}
              </button>

              <button
                onClick={() => handleNavClick('postings')}
                title="Moderate Postings"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'postings'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0 text-indigo-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Moderate Postings</span>}
              </button>

              <button
                onClick={() => handleNavClick('verifications')}
                title="Verification Requests"
                className={`w-full flex items-center rounded-xl transition-all ${
                  sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
                } ${
                  activeNav === 'verifications'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
                {!sidebarCollapsed && <span className="flex-1 text-left">Verification Requests</span>}
              </button>
            </>
          )}
        </div>

        {/* Subscription / Plan Quick Widget at Bottom of Sidebar */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            {role === 'candidate' ? (
              hasActiveCandidateSubscription ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      VIP Pass Active
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {candidateSubscription.expiresAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    All recruiter contacts & apply unlocked.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-300 dark:border-amber-700/60 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 block">
                      Candidate Access Pass
                    </span>
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-xs mt-0.5">
                      Unlock Recruiter WhatsApp
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      ₹99 (1 Month) • ₹299 (3 Months)
                    </p>
                  </div>
                  <button
                    onClick={onOpenCandidatePass}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-slate-950" />
                    <span>Get Pass (₹99)</span>
                  </button>
                </div>
              )
            ) : role === 'recruiter' ? (
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    All India Recruiter
                  </span>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">
                    ₹999/mo
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Unlimited postings • 20% salary on hire
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={onOpenPostJob}
                    className="flex-1 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px]"
                  >
                    + Post Vacancy
                  </button>
                  <button
                    onClick={onOpenUpgradePlans}
                    className="px-2 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px]"
                  >
                    Plans
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* User Profile Bar at bottom */}
        <div
          className={`border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center shrink-0 ${
            sidebarCollapsed ? 'p-2 justify-center' : 'p-3 justify-between gap-2'
          }`}
        >
          {isAuthenticated && currentUser ? (
            <div
              className={`flex items-center gap-2.5 truncate ${
                sidebarCollapsed ? 'justify-center' : 'flex-1'
              }`}
            >
              <img
                src={
                  currentUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                title={`${currentUser.name} (${currentUser.email})`}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                onClick={() => {
                  if (sidebarCollapsed) setSidebarCollapsed(false);
                }}
              />
              {!sidebarCollapsed && (
                <>
                  <div className="truncate flex-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {sidebarCollapsed ? (
                <button
                  onClick={() => {
                    setAuthModalDefaultMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm"
                  title="Login / Register"
                >
                  <User className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalDefaultMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all text-center"
                >
                  Login / Register
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
