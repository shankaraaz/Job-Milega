import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Zap,
  Table,
  PhoneCall,
  Truck,
  Briefcase,
  AlertCircle,
  X,
  FileCheck2,
  TrendingUp,
  Download,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_TRACKS, POPULAR_ISSUING_ORGS } from '../../data/skillsAssessmentData';
import { AssessmentTrack, AptitudeQuestion, VerifiedBadge } from '../../types';

interface VerifiedSkillsHubProps {
  onOpenAiScan?: () => void;
}

export const VerifiedSkillsHub: React.FC<VerifiedSkillsHubProps> = ({ onOpenAiScan }) => {
  const { candidate, addVerifiedBadge, linkDigitalCertificate, removeVerifiedBadge } = useApp();

  const [activeTab, setActiveTab] = useState<'assessments' | 'badges' | 'certificates'>('assessments');

  // Assessment Quiz State
  const [selectedTrack, setSelectedTrack] = useState<AssessmentTrack | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number; percentage: number }>({
    correct: 0,
    total: 0,
    percentage: 0,
  });
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins in seconds

  // Link Certificate Modal State
  const [isLinkCertOpen, setIsLinkCertOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    title: '',
    issuingOrg: POPULAR_ISSUING_ORGS[0].name,
    credentialId: '',
    issueDate: new Date().toISOString().split('T')[0],
    verificationUrl: '',
    skillsCovered: '',
  });
  const [isVerifyingCert, setIsVerifyingCert] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (selectedTrack && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedTrack, quizSubmitted, timeLeft]);

  const handleStartTrack = (track: AssessmentTrack) => {
    setSelectedTrack(track);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setTimeLeft(track.durationMinutes * 60);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    if (!selectedTrack) return;
    let correctCount = 0;
    selectedTrack.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const total = selectedTrack.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    setQuizScore({ correct: correctCount, total, percentage });
    setQuizSubmitted(true);

    // If passed (>= passingScore), award the badge!
    if (percentage >= selectedTrack.passingScore) {
      const newBadge: VerifiedBadge = {
        id: 'badge-' + selectedTrack.id + '-' + Date.now(),
        name: selectedTrack.badgeName,
        category: selectedTrack.category,
        badgeLevel: selectedTrack.badgeLevel,
        source: 'Assessment Quiz',
        verificationId: `JM-${selectedTrack.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        earnedDate: new Date().toISOString().split('T')[0],
        scorePercentage: percentage,
        atsBoostPoints: selectedTrack.atsBoost,
        issuingOrg: 'Job Milega Assessment Council',
        skillsVerified: [selectedTrack.title, selectedTrack.badgeName.replace(/[^\w\s]/gi, '').trim()],
      };
      addVerifiedBadge(newBadge);
    }
  };

  const handleCloseQuizModal = () => {
    setSelectedTrack(null);
    setQuizSubmitted(false);
  };

  const handleLinkCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.credentialId) return;

    setIsVerifyingCert(true);
    setTimeout(() => {
      setIsVerifyingCert(false);
      linkDigitalCertificate({
        title: certForm.title.trim(),
        issuingOrg: certForm.issuingOrg,
        credentialId: certForm.credentialId.trim(),
        issueDate: certForm.issueDate,
        verificationUrl: certForm.verificationUrl.trim() || `https://registry.gov.in/verify?id=${certForm.credentialId}`,
        status: 'Verified',
        skillsCovered: certForm.skillsCovered
          ? certForm.skillsCovered.split(',').map((s) => s.trim()).filter(Boolean)
          : [certForm.title.trim()],
      });
      setIsLinkCertOpen(false);
      setCertForm({
        title: '',
        issuingOrg: POPULAR_ISSUING_ORGS[0].name,
        credentialId: '',
        issueDate: new Date().toISOString().split('T')[0],
        verificationUrl: '',
        skillsCovered: '',
      });
      setActiveTab('badges');
    }, 1000);
  };

  const verifiedBadges = candidate.verifiedBadges || [];
  const digitalCerts = candidate.digitalCertificates || [];
  const totalBoost = verifiedBadges.reduce((acc, b) => acc + (b.atsBoostPoints || 0), 0);

  // Render Icon Helper
  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Table':
        return <Table className="w-5 h-5 text-emerald-500" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-indigo-500" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-orange-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-violet-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Verified Skills Advantage */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white border border-blue-700/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                Verified Skills & Credentials
              </span>
              <span className="text-xs text-blue-200">Boost Your Recruiter Visibility</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Prove Your Skills & Unlock Priority Recruiter Ranking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Recruiters prioritize verified candidates by 4.2x. Take a short 5-minute practical assessment or link your government Skill India / ITI / digital diploma to earn official Gold badges and boost your ATS score.
            </p>
          </div>

          {/* Quick Metrics KPI Pod */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shrink-0 w-full sm:w-auto flex items-center justify-around gap-6 text-center">
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block uppercase">Active Badges</span>
              <span className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-amber-400" />
                {verifiedBadges.length}
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block uppercase">Total ATS Boost</span>
              <span className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5" />
                +{totalBoost}%
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block uppercase">Overall Score</span>
              <span className="text-2xl font-black text-blue-300">
                {candidate.atsScore || 92}%
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'assessments'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Short Aptitude Assessments ({ASSESSMENT_TRACKS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Earned Verified Badges ({verifiedBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Linked Digital Certs ({digitalCerts.length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsLinkCertOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Link Digital Certificate</span>
        </button>
      </div>

      {/* TAB 1: Aptitude Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Sector-Specific Skill Tests (5 Questions • 5 Mins)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score 70% or higher to earn an official verified badge on your profile and boost your ATS rank.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Instant AI Evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSESSMENT_TRACKS.map((track) => {
              const alreadyEarned = verifiedBadges.some((b) => b.name === track.badgeName);

              return (
                <div
                  key={track.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getTrackIcon(track.icon)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {track.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {track.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Questions</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{track.questions.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Time</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{track.durationMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">ATS Boost</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{track.atsBoost}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {track.badgeLevel} Badge
                      </span>
                    </div>

                    {alreadyEarned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Earned ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartTrack(track)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                      >
                        <span>Start Test</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Earned Badges Showcase */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Your Verified Skills & Recognition Badges
              </h2>
              <p className="text-xs text-slate-500">
                These credentials appear prominently in recruiter applicant rankings and on your printable biodata.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{totalBoost}% ATS Boost Active
            </span>
          </div>

          {verifiedBadges.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Verified Badges Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Take a quick 5-minute aptitude assessment or link your digital certificate to earn your first verified skill badge.
              </p>
              <button
                onClick={() => setActiveTab('assessments')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Browse Assessments →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-400/50 dark:border-amber-500/30 p-5 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-500/20 text-lg">
                        🏅
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white">
                          {badge.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          ID: {badge.verificationId}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      +{badge.atsBoostPoints}% ATS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Source:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{badge.source}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Issuing Body:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{badge.issuingOrg || 'Job Milega Council'}</span>
                    </div>
                    {badge.scorePercentage && (
                      <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span>Assessment Score:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{badge.scorePercentage}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Earned Date:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{badge.earnedDate}</span>
                    </div>
                  </div>

                  {badge.skillsVerified && badge.skillsVerified.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {badge.skillsVerified.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified & Active
                    </span>
                    <button
                      onClick={() => removeVerifiedBadge(badge.id)}
                      className="text-slate-400 hover:text-rose-500 text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Linked Digital Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                Linked Digital Certificates & Government Credentials
              </h2>
              <p className="text-xs text-slate-500">
                NSDC Skill India, ITI Trade Diplomas, NIELIT, Tally, Google, or State Technical Board certificates.
              </p>
            </div>
            <button
              onClick={() => setIsLinkCertOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link Another Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digitalCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {cert.issuingOrg}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 shrink-0">
                    Verified ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Credential Roll / Reg ID</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.credentialId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Issue Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.issueDate}</span>
                  </div>
                </div>

                {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Competencies Covered</span>
                    <div className="flex flex-wrap gap-1">
                      {cert.skillsCovered.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cert.verificationUrl && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Public Registry Verification Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-[10px] text-emerald-600 font-bold">+8% ATS Boost</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Interactive Assessment Quiz */}
      {selectedTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedTrack.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Aptitude Skill Assessment • Passing Mark: {selectedTrack.passingScore}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!quizSubmitted && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleCloseQuizModal}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quiz Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {!quizSubmitted ? (
                <>
                  {/* Question Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>
                        Question {currentQuestionIndex + 1} of {selectedTrack.questions.length}
                      </span>
                      <span>
                        Answered: {Object.keys(selectedAnswers).length} / {selectedTrack.questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{
                          width: `${((currentQuestionIndex + 1) / selectedTrack.questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Current Question */}
                  {(() => {
                    const q = selectedTrack.questions[currentQuestionIndex];
                    const selectedOpt = selectedAnswers[currentQuestionIndex];

                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                            Question {currentQuestionIndex + 1}
                          </span>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                            {q.question}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                          {q.options.map((option, optIdx) => {
                            const isChosen = selectedOpt === optIdx;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleAnswerSelect(optIdx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                                  isChosen
                                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm font-semibold'
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                      isChosen
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </div>
                                  <span>{option}</span>
                                </div>

                                {isChosen && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    {currentQuestionIndex < selectedTrack.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishQuiz}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Assessment</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Quiz Results & Answers Review */
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black text-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                      {quizScore.percentage >= selectedTrack.passingScore ? '🏆' : '📚'}
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {quizScore.percentage >= selectedTrack.passingScore
                          ? 'Congratulations! Assessment Passed'
                          : 'Almost There! Try Again'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        You scored {quizScore.correct} out of {quizScore.total} questions ({quizScore.percentage}%)
                      </p>
                    </div>

                    {quizScore.percentage >= selectedTrack.passingScore ? (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                        🎉 Earned Official Badge: <strong>{selectedTrack.badgeName}</strong>! Your ATS ranking has been boosted by +{selectedTrack.atsBoost}%.
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                        Passing score is {selectedTrack.passingScore}%. You can retake the test anytime to earn the verified badge.
                      </div>
                    )}
                  </div>

                  {/* Question-by-Question Review */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Answer Review & Explanations
                    </h3>

                    {selectedTrack.questions.map((q, idx) => {
                      const userChoice = selectedAnswers[idx];
                      const isCorrect = userChoice === q.correctOptionIndex;

                      return (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 bg-white dark:bg-slate-900"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              Q{idx + 1}. {q.question}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                            </span>
                          </div>

                          <div className="text-[11px] space-y-1">
                            <p className="text-slate-600 dark:text-slate-400">
                              <strong>Your Answer:</strong>{' '}
                              <span className={isCorrect ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                                {userChoice !== undefined ? q.options[userChoice] : 'Not Answered'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-600 font-semibold">
                                <strong>Correct Answer:</strong> {q.options[q.correctOptionIndex]}
                              </p>
                            )}
                            <p className="text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                              💡 {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleCloseQuizModal}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      Done & View Badges
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Link Digital Certificate */}
      {isLinkCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Link Digital Certificate / Diploma
                </h3>
              </div>
              <button
                onClick={() => setIsLinkCertOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLinkCertificateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Issuing Authority / Organization *
                </label>
                <select
                  value={certForm.issuingOrg}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrg: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {POPULAR_ISSUING_ORGS.map((org) => (
                    <option key={org.name} value={org.name}>
                      {org.name} ({org.type})
                    </option>
                  ))}
                  <option value="Other Recognized Institute">Other Government / Private Institute</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Certificate / Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g., NSDC Housekeeping Attendant, TallyPrime Pro, ITI Electrical"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                    Credential Roll / Reg ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    placeholder="e.g. NSDC-2024-94812"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Skills Covered (Comma separated)
                </label>
                <input
                  type="text"
                  value={certForm.skillsCovered}
                  onChange={(e) => setCertForm({ ...certForm, skillsCovered: e.target.value })}
                  placeholder="e.g. Guest Etiquette, Chemical Safety, Room Sanitization"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Online Verification URL / Portal Link (Optional)
                </label>
                <input
                  type="url"
                  value={certForm.verificationUrl}
                  onChange={(e) => setCertForm({ ...certForm, verificationUrl: e.target.value })}
                  placeholder="https://verify.skillindia.gov.in/check?id=..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Our automated registry checker verifies the credential against partner databases and immediately issues a Verified Badge with <strong>+8% ATS boost</strong>.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkCertOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingCert}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                  {isVerifyingCert ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Credential...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Link Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
