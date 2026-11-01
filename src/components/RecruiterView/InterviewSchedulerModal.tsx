import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  Mail,
  User,
  Phone,
  CheckCircle2,
  Send,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Application } from '../../types';
import { useApp } from '../../context/AppContext';

interface InterviewSchedulerModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewSchedulerModal: React.FC<InterviewSchedulerModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { scheduleInterview, isEmployerVerified } = useApp();

  const [date, setDate] = useState('2026-11-04');
  const [time, setTime] = useState('11:00 AM');
  const [mode, setMode] = useState<'In-Person / Office Visit' | 'Video Call (Google Meet / Zoom)' | 'Telephonic Round'>('In-Person / Office Visit');
  const [locationOrLink, setLocationOrLink] = useState('Nexus Integrated Facility HQ, 4th Floor, Electronic City, Bengaluru');
  const [recruiterContact, setRecruiterContact] = useState('Vikram Joshi (Head HR) - +91 99887 76655');
  const [notes, setNotes] = useState('Please bring 2 passport photos, original Aadhar Card, and trade certificate/license copy.');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!isOpen || !application) return null;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await scheduleInterview(application.id, {
      date,
      time,
      mode,
      locationOrLink,
      recruiterContact,
      notes,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Schedule Interview / इंटरव्यू तय करें
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Candidate: <strong className="text-slate-800 dark:text-slate-200">{application.candidateName}</strong> for{' '}
              <span className="text-blue-600 dark:text-blue-400">{application.jobTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSchedule} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Candidate Snapshot Bar */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                {application.candidateName[0]}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{application.candidateName}</p>
                <p className="text-slate-500 text-[11px]">{application.candidateEmail} • {application.candidatePhone}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ATS Match: {application.atsMatchScore}%
            </span>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Interview Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Interview Time Slot *
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:30 AM or 03:00 PM"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
              Interview Mode / प्रकार *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { label: 'In-Person / Office Visit', icon: MapPin },
                { label: 'Video Call (Google Meet / Zoom)', icon: Video },
                { label: 'Telephonic Round', icon: Phone },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMode(item.label as any)}
                  className={`p-2.5 rounded-xl border text-left font-semibold text-xs flex items-center gap-2 transition-all ${
                    mode === item.label
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Venue or Link */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              {mode === 'In-Person / Office Visit' ? 'Office / Company Venue Address *' : 'Video Meeting Link / Dial-in Number *'}
            </label>
            <input
              type="text"
              value={locationOrLink}
              onChange={(e) => setLocationOrLink(e.target.value)}
              placeholder="e.g. Building 4B, Cyber City or https://meet.google.com/abc-defg-hij"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              required
            />
          </div>

          {/* Recruiter Contact */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Interview Coordinator / Recruiter Contact *
            </label>
            <input
              type="text"
              value={recruiterContact}
              onChange={(e) => setRecruiterContact(e.target.value)}
              placeholder="e.g. Vikram Joshi (HR Lead) - +91 99887 76655"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Instructions & Documents for Candidate
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Documents to bring, dress code, building gate entry instructions..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
            />
          </div>

          {/* Email Notification Option & Live Preview */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  Dispatch Automated Interview Invitation Email & Calendar Invite (.ics)
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                {showEmailPreview ? 'Hide Email Preview' : 'View Email Preview'}
              </button>
            </div>

            {/* Email Preview Card */}
            {showEmailPreview && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-700 animate-fadeIn">
                <p className="text-slate-400"><strong className="text-amber-400">To:</strong> {application.candidateEmail}</p>
                <p className="text-slate-400"><strong className="text-amber-400">Subject:</strong> Interview Scheduled: {application.jobTitle} at {application.companyName} - Job Milega</p>
                <div className="p-2 rounded bg-slate-800/90 text-slate-200 whitespace-pre-line border border-slate-700 mt-2">
{`Dear ${application.candidateName},

Congratulations! You have been shortlisted for "${application.jobTitle}" at ${application.companyName}.

Date: ${date}
Time: ${time}
Mode: ${mode}
Location/Link: ${locationOrLink}
Recruiter Contact: ${recruiterContact}

Instructions:
${notes}

Warm regards,
Recruitment Team - Job Milega Portal`}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              <Send className="w-4 h-4 text-white" />
              <span>{isSubmitting ? 'Scheduling...' : 'Confirm & Send Email Invite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
