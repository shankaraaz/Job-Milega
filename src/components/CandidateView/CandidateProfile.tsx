import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Download,
  Upload,
  Plus,
  X,
  CheckCircle2,
  FileText,
  Languages,
  Shield,
  Zap,
  Printer,
  Camera,
  Lock,
  ShieldCheck,
  FolderLock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { JobSector } from '../../types';
import { DocumentsVault } from './DocumentsVault';

interface CandidateProfileProps {
  onOpenPrintModal: () => void;
  onOpenAiScan: () => void;
  defaultTab?: 'biodata' | 'documents';
}

export const CandidateProfileView: React.FC<CandidateProfileProps> = ({
  onOpenPrintModal,
  onOpenAiScan,
  defaultTab = 'biodata',
}) => {
  const { candidate, updateCandidate, runAiResumeScan, addNotification, setActiveNav } = useApp();

  const [activeTab, setActiveTab] = useState<'biodata' | 'documents'>(defaultTab);

  const [formData, setFormData] = useState({ ...candidate });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    updateCandidate(formData);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      addNotification('Profile Saved', 'Your Job Milega profile and biodata have been updated successfully.', 'system');
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  // Mock Resume File Upload & AI Parsing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    const fileName = file.name;

    // Simulate reading text or provide sample content for ATS
    const simulatedResumeText = `
Name: ${formData.fullName}
Role: ${formData.currentTitle}
Phone: ${formData.phone}
Experience: ${formData.experienceYears} Years in technical and facility operations
Key Skills: ${formData.skills.join(', ')}
Education: ${formData.education}
About: ${formData.about}
    `;

    // Run AI scan on the uploaded resume
    const aiResult = await runAiResumeScan(simulatedResumeText, formData.currentTitle);

    setIsParsingResume(false);

    if (aiResult && aiResult.score) {
      const updated = {
        ...formData,
        resumeFileName: fileName,
        atsScore: aiResult.score,
        atsSummary: aiResult.summary || 'AI verified resume with high candidate suitability.',
        skills: Array.from(new Set([...formData.skills, ...(aiResult.extractedSkills || [])])),
      };
      setFormData(updated);
      updateCandidate(updated);
      addNotification(
        'Resume Uploaded & AI Scanned!',
        `ATS Match Score: ${aiResult.score}%. Skills and experience extracted automatically.`,
        'system'
      );
    } else {
      setFormData((prev) => ({ ...prev, resumeFileName: fileName }));
      updateCandidate({ resumeFileName: fileName });
      addNotification('Resume File Attached', `Uploaded ${fileName}`, 'system');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const photoUrl = reader.result;
        setFormData((prev) => ({ ...prev, avatarUrl: photoUrl }));
        updateCandidate({ avatarUrl: photoUrl });
        addNotification('Photo Updated', 'Profile photo updated successfully.', 'system');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt={formData.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {formData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
            )}

            <input
              id="profilePhotoUpload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <label
              htmlFor="profilePhotoUpload"
              className="absolute inset-0 rounded-2xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[9px] font-bold">Edit</span>
            </label>

            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Verified Candidate">
              <Shield className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formData.fullName}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ✓ Ready to Join Immediately
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
              {formData.currentTitle} • {formData.experienceYears} Years Experience
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {formData.location} • Profile Updated: {formData.lastUpdated}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab(activeTab === 'documents' ? 'biodata' : 'documents')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Documents Vault ({candidate.documents?.length || 0})</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-blue-500" />
            <span>Download / Print Biodata</span>
          </button>

          <button
            onClick={onOpenAiScan}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI ATS Score: {formData.atsScore || 92}%</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('biodata')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'biodata'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Biodata & Resume</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Documents & Verification Vault</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            {candidate.documents?.length || 0}
          </span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-300 dark:border-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Profile changes saved successfully! Recruiters can now see your updated biodata.</span>
        </div>
      )}

      {activeTab === 'documents' ? (
        <DocumentsVault />
      ) : (
        /* Main Grid: Manual Resume Fields & Resume Upload Box */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Structured Resume Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              1. Basic Information / व्यक्तिगत जानकारी
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Current City & Area *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Andheri West, Mumbai"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Job Role & Sector Preference */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              2. Job Segment & Experience / पेशा और अनुभव
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Primary Job Category</label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value as JobSector)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium"
                >
                  {SECTOR_OPTIONS.filter((s) => !s.startsWith('All')).map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Your Job Role / Subcategory Title</label>
                <input
                  type="text"
                  value={formData.currentTitle}
                  onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                  placeholder="e.g. HK Boy, BMS Operator, MST Technician, Receptionist, Accountant"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Total Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  value={formData.experienceYears}
                  onChange={(e) => handleInputChange('experienceYears', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Expected Monthly Salary</label>
                <input
                  type="text"
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                  placeholder="e.g. ₹25,000 - ₹30,000 / month"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Highest Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g. 10th Pass, 12th Pass, ITI Electrical, Diploma, B.Com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">License & Certificates (Optional)</label>
                <input
                  type="text"
                  value={formData.licenseType || ''}
                  onChange={(e) => handleInputChange('licenseType', e.target.value)}
                  placeholder="e.g. Two-Wheeler DL, Heavy License, Wireman License"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Verified Skills Badges & Digital Certifications */}
          <div className="bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-slate-900/10 dark:from-amber-950/20 dark:via-blue-950/10 dark:to-slate-900 rounded-2xl p-6 border-2 border-amber-300 dark:border-amber-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Verified Skills Badges & Certifications
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pre-verified through aptitude assessments and digital certificate registries. Boosts ATS score!
                </p>
              </div>

              <button
                onClick={() => setActiveNav('skills')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take Assessment / Link Cert →</span>
              </button>
            </div>

            {/* Badges List */}
            {candidate.verifiedBadges && candidate.verifiedBadges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidate.verifiedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-amber-300/60 dark:border-amber-500/30 shadow-sm flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-base shrink-0">
                      🏅
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {badge.name}
                        </h4>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded shrink-0">
                          +{badge.atsBoostPoints}% ATS
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ID: {badge.verificationId} • {badge.source}
                      </p>
                      {badge.skillsVerified && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {badge.skillsVerified.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No verified badges earned yet.
                </p>
                <p className="text-[11px] text-slate-400">
                  Pass a 5-minute aptitude assessment or link your government Skill India / ITI certificate to earn +8% to +10% ATS boost.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Skills & Languages */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              3. Skills & Languages / कौशल और भाषाएं
            </h2>

            {/* Skills Tags */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
                Key Skills (Type skill and press Add)
              </label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g., Room Cleaning, BMS Scada, Tally, Excel, Delivery, Telecalling"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-400 hover:text-blue-700 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Tags */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-blue-500" />
                Languages Known
              </label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLanguage();
                    }
                  }}
                  placeholder="e.g., Hindi (Fluent), English (Basic), Marathi"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* About / Summary Textarea */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                About Yourself / Biodata Summary
              </label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="Mention past companies worked with, daily duties, and immediate joining availability..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Save Profile & Biodata</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Column: Resume Upload & AI Verification Card */}
        <div className="space-y-6">
          {/* Resume Upload Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              Upload Resume (CV)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your existing PDF / DOCX resume or biodata photo. Our AI automatically extracts skills and boosts your recruiter ranking.
            </p>

            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isParsingResume}
              />
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                {isParsingResume ? (
                  <Sparkles className="w-6 h-6 animate-spin text-amber-500" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isParsingResume ? 'AI Scanning Resume...' : 'Click or Drag Resume File'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, TXT up to 10MB</span>
            </label>

            {formData.resumeFileName && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {formData.resumeFileName}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  Uploaded ✓
                </span>
              </div>
            )}
          </div>

          {/* AI ATS Score Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini AI ATS Score
              </span>
              <span className="text-2xl font-black text-amber-400">
                {formData.atsScore || 92}/100
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${formData.atsScore || 92}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {formData.atsSummary ||
                'High-caliber candidate profile. Strong experience indicators with technical/operational readiness.'}
            </p>

            <button
              onClick={onOpenAiScan}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Run Deep AI Resume Diagnostic</span>
            </button>
          </div>

          {/* Documents & Verification Vault Snapshot Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                Documents Vault
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                AES-256
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Store and manage your verified certificates, diplomas, and Government ID proofs.
            </p>

            <div className="space-y-2">
              {(candidate.documents || []).slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      {doc.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.category}</span>
                  </div>
                  {doc.status === 'Verified' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      Verified ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 shrink-0">
                      Under Review
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('documents')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FolderLock className="w-4 h-4 text-blue-400" />
              <span>Open Document Vault ({candidate.documents?.length || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
