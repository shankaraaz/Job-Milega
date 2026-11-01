import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Zap,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SECTOR_OPTIONS } from '../data/mockData';

interface AIResumeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIResumeScannerModal: React.FC<AIResumeScannerModalProps> = ({ isOpen, onClose }) => {
  const { runAiResumeScan, candidate, updateCandidate, addNotification } = useApp();

  const [resumeText, setResumeText] = useState(
    candidate.resumeText ||
      `Name: Rajesh Kumar Verma
Phone: +91 98765 43210
Location: Mumbai, India
Role: BMS Operator / Multi-Skilled Technician
Experience: 3 years in commercial IT park HVAC, BMS SCADA screen monitoring, electrical repairs, DG maintenance.
Education: Diploma in Electrical Engineering, PWD Wireman License Grade II
Skills: BMS Scada, Chiller operations, AHU filter cleaning, Electrical wiring, MS Excel reporting, Team coordination.`
  );
  const [targetRole, setTargetRole] = useState('BMS Operator & MST Maintenance');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleScan = async () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    const result = await runAiResumeScan(resumeText, targetRole);
    setIsScanning(false);
    if (result) {
      setScanResult(result);
    }
  };

  const handleApplyToProfile = () => {
    if (!scanResult) return;
    updateCandidate({
      atsScore: scanResult.score,
      atsSummary: scanResult.summary,
      skills: Array.from(new Set([...candidate.skills, ...(scanResult.extractedSkills || [])])),
    });
    addNotification('AI Profile Enhanced', 'Extracted skills and ATS score updated on your Job Milega profile.', 'system');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-violet-900/10 via-indigo-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Gemini AI Resume & ATS Scanner
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated resume parsing, keyword matching, and sector suitability analysis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {!scanResult ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  Target Job Role / Position to Compare Against
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. BMS Operator, HK Boy, Lady Staff Receptionist, Accountant, Telecaller"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Candidate Resume Text or Biodata *</span>
                  <span className="text-[11px] text-slate-400">Paste raw resume text, bio or past experience</span>
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste candidate resume, duty background, certifications..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning || !resumeText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Scanning with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Scan & Score Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* ATS Score Top Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg">
                    <span className="text-3xl leading-none">{scanResult.score}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">/ 100</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      ATS Match Diagnostic
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      {scanResult.candidateName || 'Candidate Profile'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Recommended Sector: <strong className="text-emerald-400">{scanResult.sectorMatch}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scanResult.recommendation}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Professional Assessment Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {scanResult.summary}
                </p>
              </div>

              {/* Strengths */}
              {scanResult.keyStrengths && (
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Key Candidate Strengths
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scanResult.keyStrengths.map((str: string, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Extraction */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-500" />
                  Identified & Matched Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(scanResult.extractedSkills || []).map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing skills */}
              {scanResult.missingSkills && scanResult.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Upskilling & Gap Recommendations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.missingSkills.map((gap: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs"
                      >
                        ⚡ Recommended: {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setScanResult(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs"
                >
                  Scan Another Resume
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleApplyToProfile}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Save & Update Profile ATS Score</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
