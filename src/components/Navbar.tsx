import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Bell,
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  CreditCard,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenAiScanner: () => void;
  onOpenCandidatePass?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiScanner,
  onOpenCandidatePass,
}) => {
  const {
    role,
    activeNav,
    darkMode,
    setDarkMode,
    unreadNotificationCount,
    notifications,
    markNotificationsAsRead,
    hasActiveCandidateSubscription,
    candidateSubscription,
    isRecruiterProSubscribed,
    currentUser,
    isAuthenticated,
    logout,
    setIsAuthModalOpen,
    setAuthModalDefaultMode,
    loginWithGoogle,
    setSidebarMobileOpen,
    setSidebarCollapsed,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Derive human-readable page title
  const getPageTitle = () => {
    switch (activeNav) {
      case 'jobs':
        return 'Find Jobs • All India Segments';
      case 'applications':
        return 'Application Tracker & Status';
      case 'profile':
        return 'Candidate Profile & Biodata';
      case 'skills':
        return 'Verified Skills & Badges Hub';
      case 'documents':
        return 'Candidate Documents & KYC Vault';
      case 'alerts':
        return 'Job Alerts & SMS Notifications';
      case 'salary':
        return 'Salary Benchmarking Guide';
      case 'dashboard':
        return 'Recruiter Executive Dashboard';
      case 'applicants':
        return 'Applicants Manager & AI Score';
      case 'interviews':
        return 'Scheduled Interviews & Email Invites';
      case 'analytics':
        return 'Hiring Analytics & Trends';
      case 'chat':
        return 'Direct Recruiter - Candidate Chat';
      case 'overview':
        return 'Super Admin System Overview';
      case 'segments':
        return 'All India Segments Inspector & Live Auditor';
      case 'shortlisted':
        return 'Shortlisted Candidates Database';
      case 'postings':
        return 'Job Postings Moderation';
      case 'verifications':
        return 'Company & KYC Verifications';
      default:
        return 'Job Milega Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors h-16">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle + Active Page Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setSidebarMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle icon */}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Page Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {getPageTitle()}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Job Milega • India's All-Segment Recruitment Platform
            </p>
          </div>
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Candidate Pass Pill (if candidate) */}
          {role === 'candidate' && onOpenCandidatePass && (
            hasActiveCandidateSubscription ? (
              <button
                onClick={onOpenCandidatePass}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm"
                title={`VIP Pass valid till ${candidateSubscription.expiresAt}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>VIP Pass Active</span>
              </button>
            ) : (
              <button
                onClick={onOpenCandidatePass}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Lock className="w-3 h-3 text-slate-950" />
                <span>Unlock Details (₹99)</span>
              </button>
            )
          )}

          {/* AI Resume Scanner trigger */}
          <button
            onClick={onOpenAiScanner}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
            title="Scan resume with AI ATS"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Scan</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (!showNotifMenu) markNotificationsAsRead();
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-500" />
                    Notifications & Job Match Alerts
                  </span>
                  <button
                    onClick={() => setShowNotifMenu(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.isRead
                            ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                            : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                  <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      <span>Google Verified ✓</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Account Settings
                    </button>
                    {onOpenCandidatePass && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCandidatePass();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-amber-600 dark:text-amber-400"
                      >
                        {hasActiveCandidateSubscription ? 'VIP Pass Active' : 'Get Pass (₹99)'}
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Login & Google Login Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalDefaultMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Login
              </button>

              <button
                onClick={() => loginWithGoogle()}
                className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                title="1-Click Login with Google"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalDefaultMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
