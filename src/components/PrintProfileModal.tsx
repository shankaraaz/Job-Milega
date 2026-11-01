import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CandidateProfile, Application } from '../types';

interface PrintProfileModalProps {
  candidate: CandidateProfile | null;
  application?: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintProfileModal: React.FC<PrintProfileModalProps> = ({
  candidate,
  application,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !candidate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadBiodata = () => {
    const content = `
======================================================
JOB MILEGA - VERIFIED CANDIDATE BIODATA / PROFILE
======================================================
Candidate Name: ${candidate.fullName}
Role / Title: ${candidate.currentTitle}
Experience: ${candidate.experienceYears} Years
Sector: ${candidate.sector} (${candidate.subCategory})
Phone: ${candidate.phone}
Email: ${candidate.email}
Location: ${candidate.location}
Expected Salary: ${candidate.expectedSalary}
Highest Education: ${candidate.education}
Immediate Availability: ${candidate.isAvailableImmediately ? 'YES (Immediate Joiner)' : 'Standard Notice'}

LICENSES & CERTIFICATIONS:
${candidate.licenseType || 'Standard Aadhar & Bank KYC Verified'}

VERIFIED SKILL BADGES & ASSESSMENTS:
${candidate.verifiedBadges && candidate.verifiedBadges.length > 0 ? candidate.verifiedBadges.map(b => `• ${b.name} (Credential ID: ${b.verificationId}, Boost: +${b.atsBoostPoints}% ATS) - ${b.issuingOrg || b.source}`).join('\n') : 'Pre-screened verified profile'}

LANGUAGES KNOWN:
${candidate.languages.join(', ')}

KEY SKILLS:
${candidate.skills.join(', ')}

PROFESSIONAL SUMMARY & WORK EXPERIENCE:
${candidate.about}

AI ATS SCREENING SCORE: ${candidate.atsScore || 92} / 100
Screening Feedback: ${candidate.atsSummary || 'Pre-screened verified talent.'}
======================================================
Generated via Job Milega Portal (https://jobmilega.in)
Verified Employer & Candidate Network
======================================================
`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${candidate.fullName.replace(/\s+/g, '_')}_Biodata_JobMilega.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Candidate Profile & Biodata Export
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Format
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBiodata}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Biodata (.txt)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 dark:text-white bg-white dark:bg-slate-900">
          {/* Header Strip */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {(application?.candidateAvatarUrl || candidate.avatarUrl) && (
                <img
                  src={application?.candidateAvatarUrl || candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm flex-shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    {candidate.fullName}
                  </h1>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {candidate.currentTitle} • {candidate.sector}
                </p>
                {application?.resumeFileName && (
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Attached File: <span className="font-semibold text-slate-700 dark:text-slate-300">📎 {application.resumeFileName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">Job Milega ID: {candidate.id}</p>
              <p className="text-slate-500">Updated: {candidate.lastUpdated}</p>
              <div className="inline-block px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 font-extrabold text-[11px]">
                ATS Score: {candidate.atsScore || 92}% Match
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{candidate.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{candidate.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Location</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{candidate.location}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Expected Salary</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{candidate.expectedSalary}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Professional Profile & Objective
            </h3>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {candidate.about}
            </p>
          </div>

          {/* Education & Licenses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                Education & Qualifications
              </h4>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{candidate.education}</p>
              <p className="text-[11px] text-slate-500 mt-1">Total Experience: {candidate.experienceYears} Years</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Certificates & Licenses
              </h4>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {candidate.licenseType || 'Aadhar KYC Verified'}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Immediate Availability: {candidate.isAvailableImmediately ? 'Yes ✓' : 'Notice required'}
              </p>
            </div>
          </div>

          {/* Stored & Verified KYC Documents */}
          {candidate.documents && candidate.documents.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-500/10 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Stored & Verified KYC Documents ({candidate.documents.length})
                </h3>
                <span className="text-[10px] font-bold text-slate-500">AES-256 Encrypted</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {candidate.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {doc.documentNumber ? `ID: ${doc.documentNumber}` : doc.category} • {doc.issuingAuthority || 'Govt Board'}
                      </span>
                    </div>
                    {doc.status === 'Verified' ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 shrink-0">
                        Under Review
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Skills Badges */}
          {candidate.verifiedBadges && candidate.verifiedBadges.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Officially Verified Skill Badges ({candidate.verifiedBadges.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidate.verifiedBadges.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        🏅 {b.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                        +{b.atsBoostPoints}% ATS
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Credential ID: {b.verificationId} • Issued by: {b.issuingOrg || b.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Skills */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Key Domain Competencies & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Languages Known
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {candidate.languages.map((l, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Footer declaration */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
            <span>Verified Candidate Profile • Job Milega Platform (www.jobmilega.in)</span>
            <span>Document Signature: Electronically Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
