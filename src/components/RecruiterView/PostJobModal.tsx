import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Sparkles,
  Building,
  MapPin,
  IndianRupee,
  Clock,
  Plus,
  CheckCircle2,
  Gift,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobSector } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { addJob, isEmployerVerified } = useApp();

  const [sector, setSector] = useState<JobSector>('Hospitality & Hotel Operations');
  const [subCategory, setSubCategory] = useState('HK Boy & Hotel Operations');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Nexus Integrated Facility Services');
  const [location, setLocation] = useState('Andheri East, Mumbai');
  const [city, setCity] = useState('Mumbai');
  const [experienceRequired, setExperienceRequired] = useState('1-2 Years');
  const [salaryMin, setSalaryMin] = useState(18000);
  const [salaryMax, setSalaryMax] = useState(25000);
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Shift-based' | 'Night Shift'>('Full-time');
  const [openings, setOpenings] = useState(5);
  const [urgentHiring, setUrgentHiring] = useState(true);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Carry out assigned daily operational tasks with high discipline',
    'Follow company safety norms and supervisor instructions',
    'Maintain daily logs and report maintenance issues promptly',
  ]);
  const [requirements, setRequirements] = useState<string[]>([
    'Minimum 10th or 12th pass; relevant domain experience preferred',
    'Valid Aadhar card and bank account for payroll',
    'Punctual and cooperative team player attitude',
  ]);
  const [perks, setPerks] = useState<string[]>([
    'Duty Meals Included',
    'PF & ESIC Benefits',
    'Overtime Allowance',
  ]);

  const [newPerk, setNewPerk] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  if (!isOpen) return null;

  // Preset role helper when sector changes
  const handleSectorChange = (newSector: JobSector) => {
    setSector(newSector);
    if (newSector === 'Hospitality & Hotel Operations') {
      setSubCategory('HK Boy & Hotel Operations');
      setTitle('Housekeeping Boy (HK Boy) & Hotel Staff');
    } else if (newSector === 'Technical, Maintenance & MST') {
      setSubCategory('MST Maintenance Team');
      setTitle('MST Maintenance Team / BMS Operator');
    } else if (newSector === 'Logistics & Delivery Staff') {
      setSubCategory('Delivery Staff & Warehouse');
      setTitle('Delivery Staff / Loading Unloading Man');
    } else if (newSector === 'Corporate, Reception & Lady Staff') {
      setSubCategory('Lady Staff Receptionist');
      setTitle('Lady Staff / Front Desk Receptionist');
    } else if (newSector === 'Accounts, Finance & Billing') {
      setSubCategory('Accountant');
      setTitle('Senior Accountant (Tally ERP & GST)');
    } else if (newSector === 'Back Office & MIS Operations') {
      setSubCategory('MIS Executive');
      setTitle('MIS Executive & Back Office Operations');
    } else if (newSector === 'BPO & Call Center (Telecaller)') {
      setSubCategory('Call Center Telecaller');
      setTitle('Call Center Executive (Inbound & Outbound)');
    } else if (newSector === 'Information Technology & Software') {
      setSubCategory('IT Sector & Support');
      setTitle('IT Desktop & Network Support Engineer');
    }
  };

  const handleAiGenerate = async () => {
    if (!title) {
      alert('Please enter a Job Title first');
      return;
    }
    setIsAiGenerating(true);
    try {
      const response = await fetch('/api/ai/job-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector,
          jobTitle: title,
          companyName: company,
          location,
          experienceLevel: experienceRequired,
          salaryMin,
          salaryMax,
        }),
      });
      const data = await response.json();
      if (data && data.overview) {
        setDescription(data.overview);
        if (data.responsibilities) setResponsibilities(data.responsibilities);
        if (data.requirements) setRequirements(data.requirements);
        if (data.perks) setPerks(data.perks);
      }
    } catch (err) {
      console.warn('AI generator fallback', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      title: title || 'Staff Opening',
      company,
      isVerifiedCompany: isEmployerVerified,
      isFeatured: false,
      sector,
      subCategory: subCategory || sector,
      location,
      city,
      experienceRequired,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryPeriod: 'month',
      jobType,
      openings: Number(openings),
      urgentHiring,
      description: description || `Hiring for ${title} at ${company}. Punctual and hardworking candidates welcome.`,
      responsibilities,
      requirements,
      perks,
    });
    onClose();
  };

  const addCustomPerk = () => {
    if (newPerk.trim() && !perks.includes(newPerk.trim())) {
      setPerks([...perks, newPerk.trim()]);
      setNewPerk('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Post a New Vacancy / नई नौकरी पोस्ट करें
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              HK Boy, BMS, MST, Delivery, Receptionist, BPO, Accounts, MIS & IT segments supported.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Sector & Subcategory Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Select Job Segment / श्रेणी *
              </label>
              <select
                value={sector}
                onChange={(e) => handleSectorChange(e.target.value as JobSector)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium"
              >
                {SECTOR_OPTIONS.filter((s) => !s.startsWith('All')).map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Subcategory / Role Tag *
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. HK Boy, BMS Operator, MST Technician, Receptionist"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Job Title (Display Heading) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Housekeeping Boy & Hotel Staff"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Hiring Company / Organization *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* AI Description Generator Prompt Bar */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-200 dark:border-violet-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">
                  Need an attractive Job Description?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click to auto-generate responsibilities, requirements & perks using Gemini AI.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiGenerating ? 'Generating...' : 'AI Auto-Fill'}</span>
            </button>
          </div>

          {/* Location, City, Openings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Job City *
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setLocation(`${e.target.value} Central`);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              >
                {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai', 'Ahmedabad', 'Jaipur', 'Lucknow'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Area / Full Address *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Andheri East / Cyber City"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Total Openings / कुल पद *
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Salary, Experience & Shift Type */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Min Monthly (₹) *
              </label>
              <input
                type="number"
                step="500"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Max Monthly (₹) *
              </label>
              <input
                type="number"
                step="500"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Experience Needed
              </label>
              <select
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              >
                <option value="Fresher">Fresher / 0 Experience</option>
                <option value="0-2 Years">0-2 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="2-5 Years">2-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                Shift / Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Shift-based">Shift-based (Rotational)</option>
                <option value="Night Shift">Night Shift Only</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Job Description / Overview
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the role, daily work schedule, and expectations..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
            />
          </div>

          {/* Perks & Benefits Badges */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              Perks, Food & Facilities (Helps attract 3x more candidates)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPerk}
                onChange={(e) => setNewPerk(e.target.value)}
                placeholder="e.g. Free Duty Meals, Accommodation, Weekly Payout"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
              <button
                type="button"
                onClick={addCustomPerk}
                className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-semibold"
              >
                + Add Perk
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {perks.map((p, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium flex items-center gap-1"
                >
                  <span>✓ {p}</span>
                  <button
                    type="button"
                    onClick={() => setPerks(perks.filter((_, idx) => idx !== i))}
                    className="text-emerald-400 hover:text-emerald-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Urgent Hiring Toggle */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="urgentCheck"
              checked={urgentHiring}
              onChange={(e) => setUrgentHiring(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
            <label htmlFor="urgentCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 cursor-pointer">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Mark as "Urgent Hiring" (Shows highlighted orange tag to job seekers)
            </label>
          </div>

          {/* Submit Footer */}
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Publish Job Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
