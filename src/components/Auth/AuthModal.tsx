import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useApp, UserRole } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalDefaultMode,
    loginWithGoogle,
    loginWithEmail,
    registerUser,
    role,
  } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>(authModalDefaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);

  // Form Fields
  const [fullName, setFullName] = useState('Shivshankar Luck');
  const [email, setEmail] = useState('shivshankarluck@gmail.com');
  const [password, setPassword] = useState('Passcode@2026');
  const [phone, setPhone] = useState('9820144521');
  const [isExperienced, setIsExperienced] = useState(true);
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    setMode(authModalDefaultMode);
  }, [authModalDefaultMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (mode === 'register') {
        registerUser({
          fullName,
          email,
          password,
          phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
          isExperienced,
          role: selectedRole,
          whatsappConsent,
        });
      } else {
        loginWithEmail(email, password, selectedRole);
      }
      setIsSubmitting(false);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithGoogle(selectedRole);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto flex flex-col md:flex-row items-stretch gap-6">
        {/* Left Perks Card (matching reference image) */}
        <div className="hidden md:flex md:w-72 lg:w-80 flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl shrink-0">
          <div>
            {/* Top Illustration / Avatar */}
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-blue-50 dark:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Candidate"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </span>
              </div>
              <div className="absolute -top-1 left-2 w-5 h-5 rounded-full bg-orange-500/20" />
              <div className="absolute top-2 right-1 text-slate-300 text-xs">▲</div>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white text-center mb-5">
              {selectedRole === 'candidate' ? 'On registering, you can' : 'On recruiter registration'}
            </h3>

            <ul className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              {selectedRole === 'candidate' ? (
                <>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Build your verified biodata and let top hotel, tech & office recruiters find you
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Get automated job postings delivered right to your email & WhatsApp
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Find genuine jobs with transparent salary ranges and grow your career
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Post unlimited vacancies across all Indian states and 500+ cities
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Access verified blue, grey & white-collar talent pool with AI ATS scoring
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✓
                    </span>
                    <span className="leading-tight">
                      Pay only 20% first month salary on successful hire (Zero upfront risk)
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Candidates & Employers</span>
            </span>
          </div>
        </div>

        {/* Right Main Form Card (exact layout from screenshot) */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Role Selector Tabs */}
          <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl max-w-sm">
            <button
              type="button"
              onClick={() => setSelectedRole('candidate')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'candidate'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('recruiter')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'recruiter'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Recruiter / Employer</span>
            </button>
          </div>

          {/* Form Header & Google Login Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {mode === 'register' ? 'Create your Job Milega profile' : 'Welcome back to Job Milega'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Search & apply to jobs from India's No.1 All-Segment Job Site
              </p>
            </div>

            {/* Google One-Click Login Button (as depicted in screenshot) */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">Or</span>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
              >
                {/* Genuine Google multicolor G logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Full name<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="What is your name?"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Email ID<span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Tell us your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                We'll send relevant jobs and updates to this email
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Password<span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="(Minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This helps your account stay protected
              </p>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Mobile number<span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400 border-r border-slate-300 dark:border-slate-700 text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Recruiters will contact you on this number
                  </p>
                </div>

                {/* Work Status Toggle (matching screenshot cards) */}
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                    Work status<span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setIsExperienced(true)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isExperienced
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          I'm experienced
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          I have work experience (excluding internships)
                        </p>
                      </div>
                      <Briefcase className={`w-6 h-6 shrink-0 ${isExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>

                    <div
                      onClick={() => setIsExperienced(false)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        !isExperienced
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          I'm a fresher
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          I am a student / Haven't worked after graduation
                        </p>
                      </div>
                      <GraduationCap className={`w-6 h-6 shrink-0 ${!isExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Email Consent Checkbox (matching screenshot) */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="whatsappConsent"
                    checked={whatsappConsent}
                    onChange={(e) => setWhatsappConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="whatsappConsent" className="text-slate-600 dark:text-slate-400 text-[11px] cursor-pointer">
                    Send me important updates & promotions via SMS, email, and{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                      💬 WhatsApp
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Terms text */}
            <p className="text-[11px] text-slate-400 pt-2">
              By clicking {mode === 'register' ? 'Register' : 'Login'}, you agree to the{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 underline">
                Terms and Conditions
              </a>{' '}
              &{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 underline">
                Privacy Policy
              </a>{' '}
              of JobMilega.in
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Please wait...</span>
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Register now' : 'Login to Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {mode === 'register'
                  ? 'Already registered? Login here'
                  : "Don't have an account? Register here"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
