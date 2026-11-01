export type JobSector =
  | 'Hospitality & Hotel Operations'
  | 'Logistics & Delivery Staff'
  | 'Technical, Maintenance & MST'
  | 'Corporate, Reception & Lady Staff'
  | 'Accounts, Finance & Billing'
  | 'Back Office & MIS Operations'
  | 'BPO & Call Center (Telecaller)'
  | 'Information Technology & Software'
  | 'Security & Facility Management'
  | 'General Operations & Helper';

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'AI ATS Screened'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected / Offer'
  | 'Rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  isVerifiedCompany: boolean;
  isFeatured: boolean;
  sector: JobSector;
  subCategory: string; // e.g. "HK Boy", "Pantry Boy", "BMS Operator", "MST Maintenance", "Loading/Unloading", "Receptionist", "MIS Executive"
  location: string;
  city: string;
  experienceRequired: string; // e.g. "Fresher", "1-2 Years", "3-5 Years"
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'month' | 'year' | 'day';
  jobType: 'Full-time' | 'Part-time' | 'Shift-based' | 'Night Shift';
  openings: number;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[]; // e.g. "Free Food", "Accommodation", "PF & ESIC", "Overtime Bonus", "Day Shift"
  urgentHiring?: boolean;
}

export interface VerifiedBadge {
  id: string;
  name: string;
  category: string;
  badgeLevel: 'Gold' | 'Silver' | 'Certified';
  source: 'Assessment Quiz' | 'Digital Certificate' | 'Government Skill India / NSDC' | 'ITI Diploma';
  verificationId: string;
  earnedDate: string;
  scorePercentage?: number;
  atsBoostPoints: number; // e.g. +8%, +10%
  certificateUrl?: string;
  issuingOrg?: string;
  skillsVerified: string[];
}

export interface DigitalCertificate {
  id: string;
  title: string;
  issuingOrg: string;
  credentialId: string;
  issueDate: string;
  expiryDate?: string;
  verificationUrl?: string;
  status: 'Verified' | 'Pending Verification';
  skillsCovered: string[];
  badgeIssued?: boolean;
}

export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AssessmentTrack {
  id: string;
  title: string;
  sector: JobSector;
  category: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  atsBoost: number;
  badgeName: string;
  badgeLevel: 'Gold' | 'Silver' | 'Certified';
  icon: string;
  questions: AptitudeQuestion[];
}

export type DocumentCategory =
  | 'Government ID Proof'
  | 'Educational Degree / Diploma'
  | 'Skill & Trade Certificate'
  | 'Experience & Salary Slip'
  | 'Verification & Medical';

export interface CandidateDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  documentType: string;
  documentNumber?: string;
  fileName: string;
  fileSize: string;
  fileFormat: 'pdf' | 'image' | 'doc';
  uploadDate: string;
  expiryDate?: string;
  issuingAuthority?: string;
  status: 'Verified' | 'Pending Review' | 'Not Submitted';
  verificationSource?: string;
  verifiedDate?: string;
  isEncrypted: boolean;
  previewUrl?: string;
  fileDataUrl?: string;
  notes?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  sector: JobSector;
  subCategory: string;
  experienceYears: number;
  expectedSalary: string;
  education: string;
  languages: string[];
  skills: string[];
  about: string;
  avatarUrl?: string;
  hasLicense?: boolean;
  licenseType?: string; // e.g. "Two Wheeler", "Heavy Commercial Vehicle (HMV)", "BMS Certified"
  isAvailableImmediately: boolean;
  resumeFileName?: string;
  resumeText?: string;
  atsScore?: number;
  atsSummary?: string;
  lastUpdated: string;
  verifiedBadges?: VerifiedBadge[];
  digitalCertificates?: DigitalCertificate[];
  documents?: CandidateDocument[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateTitle: string;
  candidateExperience: number;
  candidateAvatarUrl?: string;
  resumeFileName?: string;
  resumeText?: string;
  coverNote?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusHistory: {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
  }[];
  atsMatchScore: number;
  candidateVerifiedBadges?: VerifiedBadge[];
  atsMatchDetails?: {
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
    recommendation: string;
  };
  scheduledInterview?: {
    date: string;
    time: string;
    mode: 'In-Person / Office Visit' | 'Video Call (Google Meet / Zoom)' | 'Telephonic Round';
    locationOrLink: string;
    recruiterContact: string;
    notes: string;
    status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: 'candidate' | 'recruiter';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  interviewInvite?: {
    jobTitle: string;
    date: string;
    time: string;
    mode: string;
    locationOrLink: string;
  };
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'status_update' | 'interview' | 'chat' | 'job_alert' | 'system';
  isRead: boolean;
  linkAction?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  badgeText?: string;
}

export interface CandidateSubscription {
  isActive: boolean;
  planId?: 'candidate_1m' | 'candidate_3m';
  planName?: string;
  price?: number;
  startDate?: string;
  expiresAt?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface CandidatePassPlan {
  id: 'candidate_1m' | 'candidate_3m';
  name: string;
  duration: string;
  durationDays: number;
  price: number;
  originalPrice: number;
  discountBadge?: string;
  features: string[];
  isPopular?: boolean;
}

export interface HiredCommissionRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatarUrl?: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  hiredDate: string;
  monthlySalary: number;
  commissionRate: number; // 0.20 (20%)
  commissionAmount: number; // monthlySalary * 0.20
  paymentStatus: 'Pending' | 'Paid' | 'Invoiced';
  invoiceNumber: string;
  paidDate?: string;
  transactionId?: string;
}

export interface InterviewEmailLog {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  sentAt: string;
  status: 'Sent' | 'Delivered';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'candidate' | 'recruiter' | 'admin';
  authProvider: 'google' | 'email' | 'guest';
  isExperienced?: boolean;
  createdAt: string;
}
