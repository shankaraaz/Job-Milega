import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Job,
  CandidateProfile,
  Application,
  ApplicationStatus,
  Conversation,
  ChatMessage,
  NotificationItem,
  PaymentPlan,
  InterviewEmailLog,
  VerifiedBadge,
  DigitalCertificate,
  CandidateDocument,
  CandidateSubscription,
  CandidatePassPlan,
  HiredCommissionRecord,
  AuthUser,
} from '../types';
import {
  INITIAL_JOBS,
  INITIAL_CANDIDATE,
  INITIAL_APPLICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  PAYMENT_PLANS,
  CANDIDATE_PASS_PLANS,
  INITIAL_HIRED_COMMISSIONS,
} from '../data/mockData';

export type UserRole = 'candidate' | 'recruiter' | 'admin';

interface JobAlertPreferences {
  sectors: string[];
  locations: string[];
  minSalary: number;
  enablePush: boolean;
  enableEmail: boolean;
  enableWhatsApp: boolean;
  frequency: 'Instant' | 'Daily Digest' | 'Weekly';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;

  // Jobs
  jobs: Job[];
  addJob: (jobData: Omit<Job, 'id' | 'postedDate'>) => void;
  deleteJob: (jobId: string) => void;
  toggleFeatured: (jobId: string) => void;

  // Candidate
  candidate: CandidateProfile;
  updateCandidate: (data: Partial<CandidateProfile>) => void;
  addVerifiedBadge: (badge: VerifiedBadge) => void;
  linkDigitalCertificate: (certData: Omit<DigitalCertificate, 'id'>) => void;
  removeVerifiedBadge: (badgeId: string) => void;
  uploadCandidateDocument: (doc: Omit<CandidateDocument, 'id' | 'uploadDate'>) => void;
  deleteCandidateDocument: (id: string) => void;
  updateCandidateDocument: (id: string, updates: Partial<CandidateDocument>) => void;
  verifyCandidateDocument: (id: string) => void;

  // Applications
  applications: Application[];
  applyForJob: (
    jobId: string,
    customData?: {
      candidateName?: string;
      candidateEmail?: string;
      candidatePhone?: string;
      candidateAvatarUrl?: string;
      resumeFileName?: string;
      resumeText?: string;
      expectedSalary?: string;
      noticePeriod?: string;
      coverNote?: string;
      atsScore?: number;
    }
  ) => Promise<boolean>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, note?: string) => void;
  shortlistCandidate: (appId: string) => void;
  scheduleInterview: (
    appId: string,
    interviewData: {
      date: string;
      time: string;
      mode: 'In-Person / Office Visit' | 'Video Call (Google Meet / Zoom)' | 'Telephonic Round';
      locationOrLink: string;
      recruiterContact: string;
      notes: string;
    }
  ) => Promise<boolean>;

  // Chat
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (convId: string, text: string, senderRole?: 'candidate' | 'recruiter') => void;
  startOrOpenChatWithCandidate: (jobId: string, candidateId: string, candidateName: string, companyName: string) => string;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;

  // Job Alerts
  alertPreferences: JobAlertPreferences;
  updateAlertPreferences: (prefs: Partial<JobAlertPreferences>) => void;

  // Payments & Verification
  purchasedPlans: string[];
  purchasePlan: (planId: string, paymentDetails: { method: string; transactionId: string }) => boolean;
  isEmployerVerified: boolean;
  isRecruiterProSubscribed: boolean;

  // Candidate Subscriptions (₹99 for 1 Month, ₹299 for 3 Months)
  candidateSubscription: CandidateSubscription;
  hasActiveCandidateSubscription: boolean;
  subscribeCandidate: (planId: 'candidate_1m' | 'candidate_3m', paymentDetails: { method: string; transactionId: string }) => boolean;
  cancelCandidateSubscription: () => void;
  candidatePassPlans: CandidatePassPlan[];

  // Recruiter 20% First Salary Hiring Commission & Ledger
  hiredCommissions: HiredCommissionRecord[];
  recordCommissionHire: (
    candidateId: string,
    candidateName: string,
    candidateAvatarUrl: string | undefined,
    jobId: string,
    jobTitle: string,
    companyName: string,
    monthlySalary: number
  ) => void;
  payHiredCommission: (commissionId: string, paymentDetails: { method: string; transactionId: string }) => boolean;

  // Email Logs
  emailLogs: InterviewEmailLog[];

  // User Authentication & Permissions
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  loginWithEmail: (email: string, password: string, role?: UserRole) => boolean;
  loginWithGoogle: (role?: UserRole) => boolean;
  registerUser: (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isExperienced: boolean;
    role: UserRole;
    whatsappConsent?: boolean;
  }) => boolean;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalDefaultMode: 'login' | 'register';
  setAuthModalDefaultMode: (mode: 'login' | 'register') => void;

  // Sidebar Layout State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  sidebarMobileOpen: boolean;
  setSidebarMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // AI helper
  runAiResumeScan: (resumeText: string, jobRole?: string, jobDescription?: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('job_milega_theme');
    return saved ? saved === 'dark' : true; // Default to dark for clean modern UI
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('job_milega_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('job_milega_theme', 'light');
    }
  }, [darkMode]);

  // Role state
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('job_milega_role') as UserRole) || 'candidate';
  });

  const [activeNav, setActiveNav] = useState<string>('jobs');

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      const isAllowed = Boolean(
        currentUser &&
          (currentUser.email?.toLowerCase().includes('shivshankarluck') ||
            currentUser.name?.toLowerCase().includes('shivshankarluck'))
      );
      if (!isAllowed) {
        addNotification(
          'Admin Access Restricted',
          'Super Admin Control Panel is strictly reserved for shivshankarluck@gmail.com.',
          'system'
        );
        setAuthModalDefaultMode('login');
        setIsAuthModalOpen(true);
        return;
      }
    }

    setRoleState(newRole);
    localStorage.setItem('job_milega_role', newRole);
    if (newRole === 'candidate') setActiveNav('jobs');
    else if (newRole === 'recruiter') setActiveNav('dashboard');
    else if (newRole === 'admin') setActiveNav('overview');
  };

  // Persistence helpers
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('job_milega_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('job_milega_candidate');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_candidate', JSON.stringify(candidate));
  }, [candidate]);

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('job_milega_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_applications', JSON.stringify(applications));
  }, [applications]);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('job_milega_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('job_milega_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_messages', JSON.stringify(messages));
  }, [messages]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('job_milega_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [purchasedPlans, setPurchasedPlans] = useState<string[]>(() => {
    const saved = localStorage.getItem('job_milega_plans');
    return saved ? JSON.parse(saved) : ['recruiter_all_india_999'];
  });

  // Candidate Subscriptions (₹99 for 1 Month, ₹299 for 3 Months)
  const [candidateSubscription, setCandidateSubscription] = useState<CandidateSubscription>(() => {
    const saved = localStorage.getItem('job_milega_cand_sub');
    return saved ? JSON.parse(saved) : { isActive: false };
  });

  useEffect(() => {
    localStorage.setItem('job_milega_cand_sub', JSON.stringify(candidateSubscription));
  }, [candidateSubscription]);

  // Recruiter 20% First Salary Commissions Ledger
  const [hiredCommissions, setHiredCommissions] = useState<HiredCommissionRecord[]>(() => {
    const saved = localStorage.getItem('job_milega_hired_commissions');
    return saved ? JSON.parse(saved) : INITIAL_HIRED_COMMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('job_milega_hired_commissions', JSON.stringify(hiredCommissions));
  }, [hiredCommissions]);

  const [alertPreferences, setAlertPreferences] = useState<JobAlertPreferences>(() => {
    const saved = localStorage.getItem('job_milega_alerts');
    return saved
      ? JSON.parse(saved)
      : {
          sectors: ['Technical, Maintenance & MST', 'Hospitality & Hotel Operations', 'Logistics & Delivery Staff'],
          locations: ['Mumbai', 'Delhi NCR', 'Bengaluru'],
          minSalary: 20000,
          enablePush: true,
          enableEmail: true,
          enableWhatsApp: true,
          frequency: 'Instant',
        };
  });

  useEffect(() => {
    localStorage.setItem('job_milega_alerts', JSON.stringify(alertPreferences));
  }, [alertPreferences]);

  const [emailLogs, setEmailLogs] = useState<InterviewEmailLog[]>(() => {
    const saved = localStorage.getItem('job_milega_email_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'eml-1',
            candidateName: 'Rajesh Kumar Verma',
            candidateEmail: 'rajesh.verma.jobs@gmail.com',
            jobTitle: 'BMS Operator (Building Management System)',
            companyName: 'Nexus Integrated Facility Services',
            interviewDate: '2026-11-02',
            interviewTime: '11:30 AM',
            interviewType: 'In-Person / Office Visit',
            sentAt: '2026-10-30 09:30 AM',
            status: 'Delivered',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('job_milega_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('job_milega_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr-1',
      name: 'Shivshankar Luck',
      email: 'shivshankarluck@gmail.com',
      phone: '+91 98201 44521',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'candidate',
      authProvider: 'google',
      isExperienced: true,
      createdAt: '2026-10-31',
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('job_milega_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('job_milega_auth_user');
    }
  }, [currentUser]);

  // Super Admin is exclusively shivshankarluck@gmail.com
  const isSuperAdmin = Boolean(
    currentUser &&
      (currentUser.email?.toLowerCase().includes('shivshankarluck') ||
        currentUser.name?.toLowerCase().includes('shivshankarluck'))
  );

  // Auto-demote to candidate if role is admin but user is not super admin
  useEffect(() => {
    if (role === 'admin' && !isSuperAdmin) {
      setRoleState('candidate');
      setActiveNav('jobs');
      localStorage.setItem('job_milega_role', 'candidate');
    }
  }, [role, isSuperAdmin]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalDefaultMode, setAuthModalDefaultMode] = useState<'login' | 'register'>('register');

  // Sidebar Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('job_milega_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('job_milega_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState<boolean>(false);

  // Actions
  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      type,
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const updateCandidate = (data: Partial<CandidateProfile>) => {
    setCandidate((prev) => ({
      ...prev,
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  const addVerifiedBadge = (badge: VerifiedBadge) => {
    const existingBadges = candidate.verifiedBadges || [];
    if (existingBadges.some((b) => b.id === badge.id || b.name === badge.name)) {
      addNotification('Badge Already Earned', `You already hold the "${badge.name}" badge.`, 'system');
      return;
    }

    const updatedBadges = [...existingBadges, badge];
    const currentScore = candidate.atsScore || 85;
    const boostedScore = Math.min(99, currentScore + badge.atsBoostPoints);
    const updatedSkills = Array.from(new Set([...candidate.skills, ...badge.skillsVerified]));

    const updatedCandidate: CandidateProfile = {
      ...candidate,
      verifiedBadges: updatedBadges,
      atsScore: boostedScore,
      skills: updatedSkills,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCandidate(updatedCandidate);

    // Boost all candidate's existing applications
    setApplications((prev) =>
      prev.map((app) => {
        if (app.candidateId === candidate.id) {
          const newScore = Math.min(99, app.atsMatchScore + badge.atsBoostPoints);
          return {
            ...app,
            atsMatchScore: newScore,
            candidateVerifiedBadges: updatedBadges,
            statusHistory: [
              ...app.statusHistory,
              {
                status: app.status,
                timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                note: `ATS Match Score boosted (+${badge.atsBoostPoints}%) with Verified Badge: ${badge.name}`,
              },
            ],
          };
        }
        return app;
      })
    );

    try {
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
        });
      });
    } catch (e) {
      // ignore
    }

    addNotification(
      `Verified Skill Badge: ${badge.name}!`,
      `Score: ${badge.scorePercentage || 90}%. Verified skills added and candidate ATS ranking boosted by +${badge.atsBoostPoints}%.`,
      'system'
    );
  };

  const linkDigitalCertificate = (certData: Omit<DigitalCertificate, 'id'>) => {
    const certId = 'cert-' + Date.now();
    const newCert: DigitalCertificate = {
      ...certData,
      id: certId,
      status: 'Verified',
      badgeIssued: true,
    };

    const existingCerts = candidate.digitalCertificates || [];
    const updatedCerts = [...existingCerts, newCert];

    const certBadge: VerifiedBadge = {
      id: 'badge-cert-' + Date.now(),
      name: `${newCert.title} 🏅`,
      category: 'Digital Certification',
      badgeLevel: 'Certified',
      source: 'Digital Certificate',
      verificationId: newCert.credentialId,
      earnedDate: newCert.issueDate || new Date().toISOString().split('T')[0],
      atsBoostPoints: 8,
      issuingOrg: newCert.issuingOrg,
      certificateUrl: newCert.verificationUrl,
      skillsVerified: newCert.skillsCovered && newCert.skillsCovered.length > 0 ? newCert.skillsCovered : [newCert.title],
    };

    const existingBadges = candidate.verifiedBadges || [];
    const updatedBadges = [...existingBadges, certBadge];
    const currentScore = candidate.atsScore || 85;
    const boostedScore = Math.min(99, currentScore + 8);
    const updatedSkills = Array.from(new Set([...candidate.skills, ...certBadge.skillsVerified]));

    setCandidate((prev) => ({
      ...prev,
      digitalCertificates: updatedCerts,
      verifiedBadges: updatedBadges,
      atsScore: boostedScore,
      skills: updatedSkills,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));

    setApplications((prev) =>
      prev.map((app) => {
        if (app.candidateId === candidate.id) {
          return {
            ...app,
            atsMatchScore: Math.min(99, app.atsMatchScore + 8),
            candidateVerifiedBadges: updatedBadges,
          };
        }
        return app;
      })
    );

    try {
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      });
    } catch (e) {}

    addNotification(
      `Certificate Verified: ${newCert.title}`,
      `Verified via ${newCert.issuingOrg} registry. Issued Verified Digital Badge and +8% ATS ranking boost!`,
      'system'
    );
  };

  const removeVerifiedBadge = (badgeId: string) => {
    setCandidate((prev) => ({
      ...prev,
      verifiedBadges: (prev.verifiedBadges || []).filter((b) => b.id !== badgeId),
    }));
  };

  const uploadCandidateDocument = (docData: Omit<CandidateDocument, 'id' | 'uploadDate'>) => {
    const newDoc: CandidateDocument = {
      ...docData,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      isEncrypted: docData.isEncrypted !== undefined ? docData.isEncrypted : true,
    };

    setCandidate((prev) => {
      const existing = prev.documents || [];
      return {
        ...prev,
        documents: [newDoc, ...existing],
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    });

    addNotification(
      `Document Uploaded: ${newDoc.title}`,
      `File stored with 256-bit bank grade encryption. Status: ${newDoc.status}`,
      'system'
    );
  };

  const deleteCandidateDocument = (id: string) => {
    setCandidate((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((d) => d.id !== id),
    }));
    addNotification('Document Removed', 'Document was securely deleted from your vault.', 'system');
  };

  const updateCandidateDocument = (id: string, updates: Partial<CandidateDocument>) => {
    setCandidate((prev) => ({
      ...prev,
      documents: (prev.documents || []).map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const verifyCandidateDocument = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setCandidate((prev) => ({
      ...prev,
      documents: (prev.documents || []).map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'Verified',
              verifiedDate: today,
              verificationSource: d.verificationSource || 'DigiLocker Online KYC API',
            }
          : d
      ),
    }));
    addNotification(
      'Document Verified ✓',
      'Document identity successfully validated via DigiLocker / Govt Registry.',
      'system'
    );
  };

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: 'job-' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    addNotification('New Job Posted Successfully', `Job "${newJob.title}" is now live on Job Milega portal.`, 'system');
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const toggleFeatured = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isFeatured: !j.isFeatured } : j))
    );
  };

  const applyForJob = async (
    jobId: string,
    customData?: {
      candidateName?: string;
      candidateEmail?: string;
      candidatePhone?: string;
      candidateAvatarUrl?: string;
      resumeFileName?: string;
      resumeText?: string;
      expectedSalary?: string;
      noticePeriod?: string;
      coverNote?: string;
      atsScore?: number;
    }
  ): Promise<boolean> => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return false;

    // Check if already applied
    const exists = applications.some((a) => a.jobId === jobId && a.candidateId === candidate.id);
    if (exists) return false;

    const candidateAvatarUrl = customData?.candidateAvatarUrl || candidate.avatarUrl;
    const resumeFileName = customData?.resumeFileName || candidate.resumeFileName;
    const resumeText = customData?.resumeText || candidate.resumeText;

    // Update candidate profile state if new photo or resume was uploaded
    if (customData?.candidateAvatarUrl || customData?.resumeFileName) {
      updateCandidate({
        avatarUrl: candidateAvatarUrl,
        resumeFileName: resumeFileName,
        resumeText: resumeText,
        expectedSalary: customData?.expectedSalary || candidate.expectedSalary,
      });
    }

    const newApp: Application = {
      id: 'app-' + Date.now(),
      jobId,
      jobTitle: targetJob.title,
      companyName: targetJob.company,
      candidateId: candidate.id,
      candidateName: customData?.candidateName || candidate.fullName,
      candidateEmail: customData?.candidateEmail || candidate.email,
      candidatePhone: customData?.candidatePhone || candidate.phone,
      candidateTitle: candidate.currentTitle,
      candidateExperience: candidate.experienceYears,
      candidateAvatarUrl,
      resumeFileName,
      resumeText,
      coverNote: customData?.coverNote,
      expectedSalary: customData?.expectedSalary || candidate.expectedSalary,
      noticePeriod: customData?.noticePeriod || (candidate.isAvailableImmediately ? 'Immediate' : '15 Days'),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          note: `Application submitted with attached photo & resume (${resumeFileName || 'Biodata'})`,
        },
      ],
      atsMatchScore: customData?.atsScore || candidate.atsScore || 88,
      candidateVerifiedBadges: candidate.verifiedBadges || [],
      atsMatchDetails: {
        matchedSkills: candidate.skills.slice(0, 3),
        missingSkills: [],
        summary: candidate.atsSummary || 'Candidate profile matched with job criteria.',
        recommendation: 'Good fit for operational role.',
      },
    };

    setApplications((prev) => [newApp, ...prev]);
    addNotification(
      'Application Submitted!',
      `You applied for "${targetJob.title}" at ${targetJob.company}. Tracking initiated.`,
      'status_update'
    );

    // Simulate auto AI ATS screening after 2 seconds
    setTimeout(() => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === newApp.id) {
            return {
              ...app,
              status: 'AI ATS Screened',
              statusHistory: [
                ...app.statusHistory,
                {
                  status: 'AI ATS Screened',
                  timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  note: `AI ATS verified profile matching: ${app.atsMatchScore}% score`,
                },
              ],
            };
          }
          return app;
        })
      );
    }, 2500);

    return true;
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, note?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
          return {
            ...app,
            status,
            statusHistory: [
              ...app.statusHistory,
              {
                status,
                timestamp,
                note: note || `Application status transitioned to ${status}`,
              },
            ],
          };
        }
        return app;
      })
    );

    const app = applications.find((a) => a.id === appId);
    if (app) {
      addNotification(
        `Application Updated: ${status}`,
        `Your application for "${app.jobTitle}" at ${app.companyName} is now ${status}.`,
        'status_update'
      );

      // Auto-trigger 20% commission on hire
      if (status === 'Selected / Offer') {
        const targetJob = jobs.find((j) => j.id === app.jobId);
        const salary = targetJob?.salaryMin || 25000;
        recordCommissionHire(
          app.candidateId,
          app.candidateName,
          app.candidateAvatarUrl,
          app.jobId,
          app.jobTitle,
          app.companyName,
          salary
        );
      }
    }
  };

  const shortlistCandidate = (appId: string) => {
    updateApplicationStatus(appId, 'Shortlisted', 'Candidate profile shortlisted by talent team');
  };

  const scheduleInterview = async (
    appId: string,
    interviewData: {
      date: string;
      time: string;
      mode: 'In-Person / Office Visit' | 'Video Call (Google Meet / Zoom)' | 'Telephonic Round';
      locationOrLink: string;
      recruiterContact: string;
      notes: string;
    }
  ): Promise<boolean> => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return false;

    // Send email dispatch through backend endpoint
    try {
      await fetch('/api/email/interview-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: app.candidateEmail,
          candidateName: app.candidateName,
          recruiterName: interviewData.recruiterContact,
          companyName: app.companyName,
          jobTitle: app.jobTitle,
          interviewDate: interviewData.date,
          interviewTime: interviewData.time,
          interviewType: interviewData.mode,
          meetingLocationOrLink: interviewData.locationOrLink,
          instructions: interviewData.notes,
        }),
      });
    } catch (err) {
      console.warn('Backend email endpoint request:', err);
    }

    const newEmailLog: InterviewEmailLog = {
      id: 'eml-' + Date.now(),
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      interviewDate: interviewData.date,
      interviewTime: interviewData.time,
      interviewType: interviewData.mode,
      sentAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
    };
    setEmailLogs((prev) => [newEmailLog, ...prev]);

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id === appId) {
          const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
          return {
            ...item,
            status: 'Interview Scheduled',
            scheduledInterview: {
              ...interviewData,
              status: 'Scheduled',
            },
            statusHistory: [
              ...item.statusHistory,
              {
                status: 'Interview Scheduled',
                timestamp,
                note: `Interview scheduled for ${interviewData.date} at ${interviewData.time} via ${interviewData.mode}. Email notification sent.`,
              },
            ],
          };
        }
        return item;
      })
    );

    addNotification(
      'Interview Scheduled & Email Dispatched!',
      `Interview set with ${app.candidateName} for ${interviewData.date} (${interviewData.time}). Automated invitation email dispatched.`,
      'interview'
    );

    // Also auto-post interview invite to candidate chat
    const conv = conversations.find(
      (c) => c.candidateId === app.candidateId && c.jobId === app.jobId
    );
    if (conv) {
      sendMessage(
        conv.id,
        `📅 Formal Interview Invitation Scheduled!\nDate: ${interviewData.date}\nTime: ${interviewData.time}\nMode: ${interviewData.mode}\nLocation/Link: ${interviewData.locationOrLink}\nInstructions: ${interviewData.notes}`,
        'recruiter'
      );
    }

    return true;
  };

  const sendMessage = (convId: string, text: string, senderRole?: 'candidate' | 'recruiter') => {
    const roleUsed = senderRole || (role === 'candidate' ? 'candidate' : 'recruiter');
    const senderName = roleUsed === 'candidate' ? candidate.fullName : 'Recruiter / Talent Team';

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      conversationId: convId,
      senderRole: roleUsed,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: 'Just now',
              unreadCount: roleUsed === role ? c.unreadCount : c.unreadCount + 1,
            }
          : c
      )
    );

    // Simulate smart auto-reply if candidate sends message to recruiter
    if (roleUsed === 'candidate') {
      setTimeout(() => {
        const replyText =
          text.toLowerCase().includes('salary') || text.toLowerCase().includes('joining')
            ? 'Thank you for reaching out! Our HR team has noted your query and will address this during the discussion.'
            : 'Thanks for your message Rajesh! We are reviewing your schedule and will update you shortly.';

        const botMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          conversationId: convId,
          senderRole: 'recruiter',
          senderName: 'Recruitment Team',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        setMessages((prev) => ({
          ...prev,
          [convId]: [...(prev[convId] || []), botMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  lastMessage: replyText,
                  lastTimestamp: 'Just now',
                  unreadCount: role === 'candidate' ? 1 : c.unreadCount,
                }
              : c
          )
        );

        addNotification('New Recruiter Message', replyText, 'chat');
      }, 1400);
    }
  };

  const startOrOpenChatWithCandidate = (
    jobId: string,
    candidateId: string,
    candidateName: string,
    companyName: string
  ): string => {
    let existing = conversations.find(
      (c) => c.jobId === jobId && c.candidateId === candidateId
    );
    if (!existing) {
      const targetJob = jobs.find((j) => j.id === jobId);
      const newConv: Conversation = {
        id: 'conv-' + Date.now(),
        jobId,
        jobTitle: targetJob?.title || 'Open Position',
        companyName,
        candidateId,
        candidateName,
        lastMessage: 'Conversation opened between recruiter and candidate.',
        lastTimestamp: 'Just now',
        unreadCount: 0,
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConv.id]: [
          {
            id: 'm-init',
            conversationId: newConv.id,
            senderRole: 'recruiter',
            senderName: companyName + ' HR',
            text: `Namaste ${candidateName}, we are reviewing your application for ${targetJob?.title || 'the role'}. Feel free to drop any questions here!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          },
        ],
      }));
      existing = newConv;
    }
    setActiveConversationId(existing.id);
    return existing.id;
  };

  const updateAlertPreferences = (prefs: Partial<JobAlertPreferences>) => {
    setAlertPreferences((prev) => ({ ...prev, ...prefs }));
    addNotification('Job Alerts Preferences Updated', 'You will receive notifications based on your chosen filters.', 'job_alert');
  };

  const purchasePlan = (planId: string, paymentDetails: { method: string; transactionId: string }): boolean => {
    setPurchasedPlans((prev) => (prev.includes(planId) ? prev : [...prev, planId]));
    const plan = PAYMENT_PLANS.find((p) => p.id === planId);
    addNotification(
      'Payment Successful! Plan Activated',
      `Payment of ₹${plan?.price || 0} via ${paymentDetails.method} confirmed (Txn: ${paymentDetails.transactionId}).`,
      'system'
    );
    return true;
  };

  const isEmployerVerified = purchasedPlans.includes('verified_employer');
  const isRecruiterProSubscribed = purchasedPlans.includes('recruiter_all_india_999') || purchasedPlans.includes('featured_boost');

  const hasActiveCandidateSubscription = Boolean(candidateSubscription.isActive);

  const subscribeCandidate = (
    planId: 'candidate_1m' | 'candidate_3m',
    paymentDetails: { method: string; transactionId: string }
  ): boolean => {
    const plan = CANDIDATE_PASS_PLANS.find((p) => p.id === planId) || CANDIDATE_PASS_PLANS[0];
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + plan.durationDays);

    const newSub: CandidateSubscription = {
      isActive: true,
      planId,
      planName: plan.name,
      price: plan.price,
      startDate: startDate.toISOString().split('T')[0],
      expiresAt: expiryDate.toISOString().split('T')[0],
      paymentMethod: paymentDetails.method,
      transactionId: paymentDetails.transactionId,
    };

    setCandidateSubscription(newSub);

    try {
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1'],
        });
      });
    } catch (e) {}

    addNotification(
      '🎉 Job Milega VIP Pass Activated!',
      `Welcome to VIP Access! Full job details, recruiter direct phone/WhatsApp numbers, and instant 1-click apply are now UNLOCKED across all jobs for ${plan.duration}.`,
      'system'
    );
    return true;
  };

  const cancelCandidateSubscription = () => {
    setCandidateSubscription({ isActive: false });
    addNotification('Pass Expired / Deactivated', 'Your candidate subscription was deactivated.', 'system');
  };

  const recordCommissionHire = (
    candidateId: string,
    candidateName: string,
    candidateAvatarUrl: string | undefined,
    jobId: string,
    jobTitle: string,
    companyName: string,
    monthlySalary: number
  ) => {
    // Check if commission already recorded for this application
    const existing = hiredCommissions.some((c) => c.candidateId === candidateId && c.jobId === jobId);
    if (existing) return;

    const commissionRate = 0.20; // 20% of first month salary
    const commissionAmount = Math.round(monthlySalary * commissionRate);
    const invoiceNumber = 'INV-COMM-' + Math.floor(10000 + Math.random() * 90000);

    const newRecord: HiredCommissionRecord = {
      id: 'hire-com-' + Date.now(),
      candidateId,
      candidateName,
      candidateAvatarUrl,
      jobId,
      jobTitle,
      companyName,
      hiredDate: new Date().toISOString().split('T')[0],
      monthlySalary,
      commissionRate,
      commissionAmount,
      paymentStatus: 'Pending',
      invoiceNumber,
    };

    setHiredCommissions((prev) => [newRecord, ...prev]);

    addNotification(
      `🎉 Candidate Hired! 20% Success Fee Logged`,
      `${candidateName} selected for "${jobTitle}" at ${companyName}. 20% first month salary commission of ₹${commissionAmount.toLocaleString('en-IN')} added to hiring ledger (One-time only).`,
      'status_update'
    );
  };

  const payHiredCommission = (commissionId: string, paymentDetails: { method: string; transactionId: string }): boolean => {
    const today = new Date().toISOString().split('T')[0];
    setHiredCommissions((prev) =>
      prev.map((c) =>
        c.id === commissionId
          ? {
              ...c,
              paymentStatus: 'Paid',
              paidDate: today,
              transactionId: paymentDetails.transactionId,
            }
          : c
      )
    );

    const record = hiredCommissions.find((c) => c.id === commissionId);
    addNotification(
      'Hiring Commission Paid ✓',
      `Payment of ₹${record?.commissionAmount.toLocaleString('en-IN') || 0} (20% First Salary Fee for ${record?.candidateName || 'Candidate'}) confirmed. Tax receipt available.`,
      'system'
    );
    return true;
  };

  const runAiResumeScan = async (resumeText: string, jobRole?: string, jobDescription?: string) => {
    try {
      const response = await fetch('/api/ai/resume-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobRole, jobDescription }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('AI Resume Scan Error:', err);
      return null;
    }
  };

  const loginWithGoogle = (targetRole?: UserRole): boolean => {
    const roleToUse = targetRole || role;
    const googleUser: AuthUser = {
      id: 'usr-google-' + Date.now(),
      name: 'Shivshankar Luck',
      email: 'shivshankarluck@gmail.com',
      phone: '+91 98201 44521',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: roleToUse,
      authProvider: 'google',
      isExperienced: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(googleUser);
    setRole(roleToUse);
    setIsAuthModalOpen(false);

    // Update candidate profile name
    setCandidate((prev) => ({
      ...prev,
      fullName: 'Shivshankar Luck',
      email: 'shivshankarluck@gmail.com',
      phone: '+91 98201 44521',
    }));

    try {
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
        });
      });
    } catch (e) {}

    addNotification(
      'Google Login Successful! ✓',
      `Welcome back, Shivshankar Luck! Signed in as ${roleToUse === 'candidate' ? 'Job Seeker' : 'Recruiter'}.`,
      'system'
    );
    return true;
  };

  const loginWithEmail = (email: string, password: string, targetRole?: UserRole): boolean => {
    const roleToUse = targetRole || role;
    const namePart = email.split('@')[0] || 'Professional User';
    const cleanName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const userObj: AuthUser = {
      id: 'usr-email-' + Date.now(),
      name: cleanName,
      email,
      phone: '+91 98201 44521',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: roleToUse,
      authProvider: 'email',
      isExperienced: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(userObj);
    setRole(roleToUse);
    setIsAuthModalOpen(false);

    addNotification(
      'Logged In Successfully ✓',
      `Welcome to Job Milega, ${cleanName}! Accessing your ${roleToUse} dashboard.`,
      'system'
    );
    return true;
  };

  const registerUser = (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isExperienced: boolean;
    role: UserRole;
    whatsappConsent?: boolean;
  }): boolean => {
    const newUser: AuthUser = {
      id: 'usr-reg-' + Date.now(),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: data.role,
      authProvider: 'email',
      isExperienced: data.isExperienced,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(newUser);
    setRole(data.role);
    setIsAuthModalOpen(false);

    // Sync candidate details
    setCandidate((prev) => ({
      ...prev,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      experienceYears: data.isExperienced ? 2 : 0,
      education: data.isExperienced ? prev.education : 'Graduate / Fresher',
    }));

    try {
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default || confettiModule;
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
        });
      });
    } catch (e) {}

    addNotification(
      'Account Created Successfully! 🎉',
      `Namaste ${data.fullName}! Your Job Milega profile is ready. Start exploring verified openings.`,
      'system'
    );
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setRoleState('candidate');
    setActiveNav('jobs');
    localStorage.setItem('job_milega_role', 'candidate');
    addNotification('Logged Out', 'You have been logged out of Job Milega.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        darkMode,
        setDarkMode,
        activeNav,
        setActiveNav,
        jobs,
        addJob,
        deleteJob,
        toggleFeatured,
        candidate,
        updateCandidate,
        addVerifiedBadge,
        linkDigitalCertificate,
        removeVerifiedBadge,
        uploadCandidateDocument,
        deleteCandidateDocument,
        updateCandidateDocument,
        verifyCandidateDocument,
        applications,
        applyForJob,
        updateApplicationStatus,
        shortlistCandidate,
        scheduleInterview,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startOrOpenChatWithCandidate,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        addNotification,
        alertPreferences,
        updateAlertPreferences,
        purchasedPlans,
        purchasePlan,
        isEmployerVerified,
        isRecruiterProSubscribed,
        candidateSubscription,
        hasActiveCandidateSubscription,
        subscribeCandidate,
        cancelCandidateSubscription,
        candidatePassPlans: CANDIDATE_PASS_PLANS,
        hiredCommissions,
        recordCommissionHire,
        payHiredCommission,
        emailLogs,
        runAiResumeScan,
        // Auth State & Actions
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isSuperAdmin,
        loginWithEmail,
        loginWithGoogle,
        registerUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalDefaultMode,
        setAuthModalDefaultMode,
        // Sidebar Layout State
        sidebarCollapsed,
        setSidebarCollapsed,
        sidebarMobileOpen,
        setSidebarMobileOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
