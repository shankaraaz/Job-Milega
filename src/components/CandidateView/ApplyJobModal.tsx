import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  Image as ImageIcon,
  Check,
  Zap,
  Award,
} from 'lucide-react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface ApplyJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessTrack?: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccessTrack,
}) => {
  const { candidate, applyForJob, runAiResumeScan } = useApp();

  // Pre-fill fields from current candidate profile
  const [fullName, setFullName] = useState(candidate.fullName || '');
  const [phone, setPhone] = useState(candidate.phone || '');
  const [email, setEmail] = useState(candidate.email || '');
  const [location, setLocation] = useState(candidate.location || '');
  const [experienceYears, setExperienceYears] = useState(candidate.experienceYears || 2);
  const [expectedSalary, setExpectedSalary] = useState(candidate.expectedSalary || '₹25,000 / month');
  const [noticePeriod, setNoticePeriod] = useState('Immediate Joiner (तुरंत उपलब्ध)');
  const [coverNote, setCoverNote] = useState(
    `Namaste! I am very interested in this ${job?.title || 'position'}. I have relevant hands-on operational experience and can join immediately.`
  );

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string>(
    candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );

  // Resume state
  const [resumeFileName, setResumeFileName] = useState<string>(candidate.resumeFileName || 'My_Verified_Biodata.pdf');
  const [resumeText, setResumeText] = useState<string>(candidate.resumeText || '');
  const [isScanningResume, setIsScanningResume] = useState(false);
  const [atsScore, setAtsScore] = useState<number>(candidate.atsScore || 92);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen || !job) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset sample photo avatars for blue/pink/white-collar users who don't have files on mobile
  const sampleAvatars = [
    { label: 'Male Staff', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Female Staff', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Technician', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  // Handle Resume File Upload & quick scan
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setIsScanningResume(true);

    // Mock text or extract from file
    const sampleExtracted = `
Name: ${fullName}
Role: ${job.title}
Phone: ${phone}
Experience: ${experienceYears} Years
Target Job: ${job.title} at ${job.company}
Skills: ${candidate.skills.join(', ')}
    `;
    setResumeText(sampleExtracted);

    const aiRes = await runAiResumeScan(sampleExtracted, job.title, job.description);
    setIsScanningResume(false);

    if (aiRes && aiRes.score) {
      setAtsScore(aiRes.score);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please enter your Name and Mobile Number');
      return;
    }

    setIsSubmitting(true);
    const success = await applyForJob(job.id, {
      candidateName: fullName,
      candidateEmail: email,
      candidatePhone: phone,
      candidateAvatarUrl: photoPreview,
      resumeFileName,
      resumeText,
      expectedSalary,
      noticePeriod,
      coverNote,
      atsScore,
    });
    setIsSubmitting(false);

    if (success) {
      setIsSubmittedSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-transparent dark:from-blue-950/40 dark:via-indigo-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                Job Application Form
              </span>
              <span className="text-xs text-slate-500 font-medium">{job.company}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Apply for: {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success Confirmation */}
        {!isSubmittedSuccess ? (
          <form onSubmit={handleSubmitApplication} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Quick Job Spec Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Salary Offered</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {job.salaryMin.toLocaleString('en-IN')} - {job.salaryMax.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Job Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {job.location}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Experience</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.experienceRequired}
                </span>
              </div>
            </div>

            {/* Verified Badges Ranking Advantage */}
            {candidate.verifiedBadges && candidate.verifiedBadges.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    🏅
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {candidate.verifiedBadges.length} Verified Skill Badge{candidate.verifiedBadges.length > 1 ? 's' : ''} Linked
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {candidate.verifiedBadges.map((b) => b.name).join(', ')}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 shrink-0">
                  Priority ATS Ranking
                </span>
              </div>
            )}

            {/* Photo & Resume Upload Section */}
            <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Upload Photo & Resume / फोटो और बायोडाटा
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Candidate Photo Upload */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                    Candidate Photo (पासपोर्ट साइज फोटो) *
                  </label>

                  <div className="relative group mb-2">
                    <img
                      src={photoPreview}
                      alt="Candidate Preview"
                      className="w-20 h-20 rounded-full object-cover border-3 border-blue-500 shadow-md"
                    />
                    <label
                      htmlFor="photoUploadInput"
                      className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Upload new photo"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[9px] font-bold">Change</span>
                    </label>
                  </div>

                  <input
                    id="photoUploadInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <label
                    htmlFor="photoUploadInput"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Your Photo</span>
                  </label>

                  {/* Quick Preset Avatars helper */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400">Presets:</span>
                    {sampleAvatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoPreview(av.url)}
                        className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform"
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Resume File Upload */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block flex items-center justify-between">
                      <span>Resume File (सीवी / बायोडाटा) *</span>
                      <span className="text-[10px] text-emerald-600 font-bold">ATS: {atsScore}%</span>
                    </label>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Upload PDF, DOCX, or Image of your bio-data.
                    </p>

                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-850">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,image/*"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                      <FileText className="w-6 h-6 text-indigo-500 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isScanningResume ? 'Scanning Resume...' : 'Choose Resume File'}
                      </span>
                      <span className="text-[9px] text-slate-400">PDF, Word, or Photo</span>
                    </label>
                  </div>

                  {resumeFileName && (
                    <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between truncate">
                      <span className="truncate flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {resumeFileName}
                      </span>
                      <span className="text-[10px] font-bold shrink-0">Attached ✓</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Contact & Background Fields */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-500" />
                Applicant Details / आवेदक का विवरण
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Full Name (पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Mobile / WhatsApp No. (फोन नंबर) *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Email Address (ईमेल)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Current Location / City (शहर) *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Goregaon West, Mumbai"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Total Experience (कुल अनुभव)
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Fresher (0 Years)</option>
                    <option value={1}>1 Year Experience</option>
                    <option value={2}>2 Years Experience</option>
                    <option value={3}>3 Years Experience</option>
                    <option value={5}>5+ Years Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    Expected In-Hand Pay (अपेक्षित वेतन)
                  </label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. ₹22,000 / month"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                    When can you start? (कब से जॉइन कर सकते हैं?)
                  </label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Immediate Joiner (तुरंत उपलब्ध)">Immediate Joiner (तुरंत उपलब्ध)</option>
                    <option value="Within 7 Days (7 दिनों में)">Within 7 Days (7 दिनों में)</option>
                    <option value="Within 15 Days (15 दिनों में)">Within 15 Days (15 दिनों में)</option>
                    <option value="1 Month Notice (1 महीने बाद)">1 Month Notice (1 महीने बाद)</option>
                  </select>
                </div>
              </div>

              {/* Message to Recruiter */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 text-xs">
                  Cover Note / Message to Recruiter (कंपनी के लिए संदेश)
                </label>
                <textarea
                  rows={2}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Tell the employer why you are a good fit for this role..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                100% Free Application • No Agent Charge
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Zap className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-500">
                आपका आवेदन सफलतापूर्वक कंपनी को भेज दिया गया है।
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                <img
                  src={photoPreview}
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover border border-blue-500"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{fullName}</p>
                  <p className="text-slate-500 text-[11px]">{job.title} at {job.company}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                <strong>Resume Attached:</strong> {resumeFileName}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                <strong>Contact:</strong> {phone} • {location}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold">
                ✓ Automated notification sent to recruiter HR team
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSuccessTrack) onSuccessTrack();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Track Application Status Live</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close & Browse More Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
