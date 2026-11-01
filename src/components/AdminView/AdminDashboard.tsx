import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Download,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  Phone,
  Mail,
  Building,
  Check,
  X,
  CreditCard,
  Printer,
  Lock,
  Layers,
  MapPin,
  IndianRupee,
  Calendar,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, Job } from '../../types';

interface AdminDashboardProps {
  onDownloadProfile: (app: Application) => void;
  onOpenScheduleInterview: (app: Application) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onDownloadProfile,
  onOpenScheduleInterview,
}) => {
  const {
    jobs,
    applications,
    deleteJob,
    toggleFeatured,
    emailLogs,
    activeNav,
    setActiveNav,
    addNotification,
    candidate,
    verifyCandidateDocument,
    currentUser,
    isSuperAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'shortlisted' | 'postings' | 'verifications'>(
    activeNav === 'segments' ? 'segments' : activeNav === 'shortlisted' ? 'shortlisted' : 'overview'
  );
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with activeNav from Sidebar
  React.useEffect(() => {
    if (activeNav === 'segments') setActiveTab('segments');
    else if (activeNav === 'shortlisted') setActiveTab('shortlisted');
    else if (activeNav === 'postings') setActiveTab('postings');
    else if (activeNav === 'verifications') setActiveTab('verifications');
    else if (activeNav === 'overview') setActiveTab('overview');
  }, [activeNav]);

  // All shortlisted candidates across all companies
  const allShortlistedCandidates = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Selected / Offer'
  );

  // Inspector Segments Definition
  const ALL_INSPECTOR_SEGMENTS = [
    {
      id: 'hk_hotel',
      name: 'Housekeeping Boy & Hotel Operations',
      shortName: 'HK Boy & Hotel',
      icon: '🏨',
      sector: 'Hospitality & Hotel Operations',
      keywords: ['hk boy', 'hotel', 'housekeeping', 'room service', 'pantry'],
      desc: 'Guest room cleaning, linen setup, lobby upkeep & hotel helper duties.',
      benchmarkSalary: '₹18,000 - ₹24,000 / month',
    },
    {
      id: 'pantry_helper',
      name: 'Office Pantry Boy & Hospitality Helper',
      shortName: 'Pantry Boy',
      icon: '☕',
      sector: 'Pantry & Hospitality Helper',
      keywords: ['pantry', 'tea', 'coffee', 'office boy', 'helper'],
      desc: 'Corporate beverage prep, executive tea service, pantry sanitation & office assistance.',
      benchmarkSalary: '₹16,000 - ₹21,000 / month',
    },
    {
      id: 'bms_operator',
      name: 'BMS Operator (Building Management System)',
      shortName: 'BMS Operator',
      icon: '🏢',
      sector: 'Technical, Maintenance & MST',
      keywords: ['bms', 'building management', 'scada', 'hvac', 'ahu', 'chiller'],
      desc: '24/7 central automation monitoring, HVAC, fire alarm & DG telemetry.',
      benchmarkSalary: '₹26,000 - ₹35,000 / month',
    },
    {
      id: 'mst_tech',
      name: 'MST Maintenance Team (Multi-Skilled Tech)',
      shortName: 'MST Tech Team',
      icon: '🔧',
      sector: 'Technical, Maintenance & MST',
      keywords: ['mst', 'maintenance', 'electrician', 'plumber', 'technician'],
      desc: 'Electrical boards, DG sync, plumbing lines & asset preventive repairs.',
      benchmarkSalary: '₹24,000 - ₹34,000 / month',
    },
    {
      id: 'loading_unloading',
      name: 'Loading & Unloading Staff (Warehouse Porter)',
      shortName: 'Loading & Unloading',
      icon: '📦',
      sector: 'Logistics & Delivery Staff',
      keywords: ['loading', 'unloading', 'warehouse', 'porter', 'pallet'],
      desc: 'Carton handling, container de-stuffing, dock stacking & dispatch staging.',
      benchmarkSalary: '₹17,000 - ₹23,000 / month',
    },
    {
      id: 'lady_receptionist',
      name: 'Front Desk Lady Staff Receptionist',
      shortName: 'Lady Receptionist',
      icon: '👩‍💼',
      sector: 'Corporate, Reception & Lady Staff',
      keywords: ['receptionist', 'front desk', 'lady staff', 'hostess', 'visitor'],
      desc: 'Guest warm greetings, visitor passes, EPABX coordination & clinic front desk.',
      benchmarkSalary: '₹22,000 - ₹28,000 / month',
    },
    {
      id: 'accountant',
      name: 'Senior Accountant (Tally Prime, GST & TDS)',
      shortName: 'Accountant',
      icon: '📊',
      sector: 'Accounts, Finance & Billing',
      keywords: ['accountant', 'tally', 'gst', 'tds', 'billing', 'audit'],
      desc: 'Tally Prime vouchers, GSTR-1/3B filing, TDS reconciliation & ledger audit.',
      benchmarkSalary: '₹28,000 - ₹38,000 / month',
    },
    {
      id: 'mis_backoffice',
      name: 'MIS Executive & Back Office Operations',
      shortName: 'MIS & Back Office',
      icon: '📁',
      sector: 'Back Office & MIS Operations',
      keywords: ['mis', 'back office', 'excel', 'vlookup', 'data entry'],
      desc: 'Advanced Excel reporting, inventory consolidation & daily dispatch dashboards.',
      benchmarkSalary: '₹24,000 - ₹32,000 / month',
    },
    {
      id: 'bpo_telecaller',
      name: 'Call Center Executive / BPO Telecaller',
      shortName: 'BPO Telecaller',
      icon: '🎧',
      sector: 'BPO & Call Center (Telecaller)',
      keywords: ['call center', 'bpo', 'telecaller', 'inbound', 'outbound', 'voice'],
      desc: 'Customer dispute resolution, sales lead calling & CRM call disposition logging.',
      benchmarkSalary: '₹19,000 - ₹27,000 / month',
    },
    {
      id: 'delivery_rider',
      name: 'Delivery Staff / Rider (Bike / EV)',
      shortName: 'Delivery Staff',
      icon: '🛵',
      sector: 'Logistics & Delivery Staff',
      keywords: ['delivery', 'rider', 'bike', 'courier', 'fleet'],
      desc: 'Hyperlocal package deliveries, route adherence & customer signature capture.',
      benchmarkSalary: '₹20,000 - ₹32,000 / month',
    },
    {
      id: 'it_hardware_dev',
      name: 'IT Desktop Support & Software Developers',
      shortName: 'IT Sector',
      icon: '🖥️',
      sector: 'Information Technology & Software',
      keywords: ['it', 'desktop support', 'software', 'developer', 'hardware', 'react'],
      desc: 'LAN network maintenance, PC troubleshooting & full-stack web application engineering.',
      benchmarkSalary: '₹30,000 - ₹60,000 / month',
    },
  ];

  const [verificationRequests, setVerificationRequests] = useState([
    {
      id: 'vr-1',
      companyName: 'Nexus Integrated Facility Services',
      gstin: '29ABCDE1234F1Z5',
      cin: 'U74999KA2020PTC134882',
      contactPerson: 'Vikram Joshi (Operations Director)',
      contactEmail: 'vikram.joshi@nexusfacility.in',
      requestedDate: '2026-10-28',
      status: 'Approved',
    },
    {
      id: 'vr-2',
      companyName: 'DLF Asset Management Pvt Ltd',
      gstin: '07AAACD1111G1ZP',
      cin: 'L70101HR1963PLC002484',
      contactPerson: 'Sanjay Rawat (Talent Acquisition)',
      contactEmail: 'sanjay.rawat@dlf.in',
      requestedDate: '2026-10-29',
      status: 'Approved',
    },
    {
      id: 'vr-3',
      companyName: 'The Grand Imperial Luxury Hotel',
      gstin: '27AABCT8899K1Z2',
      cin: 'U55101MH2018PTC309112',
      contactPerson: 'Chef Rohan Mehta (GM)',
      contactEmail: 'hr@grandimperialhotel.com',
      requestedDate: '2026-10-30',
      status: 'Pending Review',
    },
    {
      id: 'vr-4',
      companyName: 'FlashSpeed Hyperlocal Delivery Network',
      gstin: '06AABCF4433E1ZQ',
      cin: 'U63030DL2022PTC392810',
      contactPerson: 'Ankit Gupta (Fleet Lead)',
      contactEmail: 'fleet@flashspeed.in',
      requestedDate: '2026-10-30',
      status: 'Pending Review',
    },
  ]);

  const handleApproveVerification = (id: string, name: string) => {
    setVerificationRequests((prev) =>
      prev.map((vr) => (vr.id === id ? { ...vr, status: 'Approved' } : vr))
    );
    addNotification('Employer Verification Approved', `Verified badge granted to ${name}.`, 'system');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-sm flex items-center gap-1">
              👑 Super Admin: {currentUser?.name || 'Shivshankar Luck'}
            </span>
            <span className="text-xs text-emerald-300 font-semibold hidden sm:inline">
              {currentUser?.email || 'shivshankarluck@gmail.com'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Master Administration & All-Segment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Audit job postings across every employment segment (HK boy, pantry, BMS, MST, delivery, receptionist, accountant, BPO, IT), inspect shortlisted talent, and download biodata.
          </p>
        </div>

        {/* Admin Nav Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-emerald-700/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'segments' ? 'bg-teal-600 text-white shadow-sm' : 'text-teal-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Segments Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab('shortlisted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'shortlisted' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Shortlisted ({allShortlistedCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('postings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'postings' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Moderate Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'verifications' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Verifications ({verificationRequests.filter((v) => v.status === 'Pending Review').length} pending)
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Platform Gross Revenue</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-400 mt-2">
                ₹38,980
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">From featured boosts & verifications</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">All Shortlisted Talent</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {allShortlistedCandidates.length}
              </p>
              <p className="text-[11px] text-indigo-500 mt-1">Across 12 corporate partners</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Active Job Postings</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {jobs.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Covering 11 Indian job segments</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Verified Employers</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {verificationRequests.filter((v) => v.status === 'Approved').length}
              </p>
              <p className="text-[11px] text-emerald-500 mt-1">GSTIN & CIN certified</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 rounded-2xl p-6 border border-teal-800/40 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">
                  Super Admin Exclusive
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  Inspect All Job Segments
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check HK boy, helper, pantry, BMS, MST, receptionist, accountant, BPO & IT sectors.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('segments')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shrink-0 ml-3"
              >
                Inspect Segments →
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Talent Database
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                  All Shortlisted Candidates Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect shortlisted candidates and download complete profile biodata.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('shortlisted')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shrink-0 ml-3"
              >
                Open Shortlisted →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: All Segments Inspector (Requested by Shivshankar!) */}
      {activeTab === 'segments' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Search */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    All India Employment Segments Inspector
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audit vacancies, applicant pipeline, and shortlisted talent for every job category across India.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search segment or role..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Horizontal Segment Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedSegmentId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedSegmentId === 'all'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🌐</span>
              <span>All Segments ({ALL_INSPECTOR_SEGMENTS.length})</span>
            </button>

            {ALL_INSPECTOR_SEGMENTS.map((seg) => {
              const segJobsCount = jobs.filter((j) => {
                const text = (j.title + ' ' + j.sector + ' ' + j.subCategory).toLowerCase();
                return seg.keywords.some((k) => text.includes(k));
              }).length;

              return (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedSegmentId === seg.id
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{seg.icon}</span>
                  <span>{seg.shortName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedSegmentId === seg.id
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {segJobsCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Segment Deep-Dive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ALL_INSPECTOR_SEGMENTS.filter((seg) => {
              if (selectedSegmentId !== 'all' && seg.id !== selectedSegmentId) return false;
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                  seg.name.toLowerCase().includes(q) ||
                  seg.desc.toLowerCase().includes(q) ||
                  seg.keywords.some((k) => k.includes(q))
                );
              }
              return true;
            }).map((seg) => {
              const segJobs = jobs.filter((j) => {
                const text = (j.title + ' ' + j.sector + ' ' + j.subCategory).toLowerCase();
                return seg.keywords.some((k) => text.includes(k));
              });

              const segJobIds = new Set(segJobs.map((j) => j.id));
              const segApplications = applications.filter(
                (a) =>
                  segJobIds.has(a.jobId) ||
                  seg.keywords.some((k) =>
                    (a.jobTitle + ' ' + a.candidateTitle).toLowerCase().includes(k)
                  )
              );

              const segShortlisted = segApplications.filter(
                (a) =>
                  a.status === 'Shortlisted' ||
                  a.status === 'Interview Scheduled' ||
                  a.status === 'Selected / Offer'
              );

              return (
                <div
                  key={seg.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          {seg.icon}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                            {seg.name}
                          </h3>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block mt-0.5">
                            {seg.sector}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                      {seg.desc}
                    </p>

                    {/* Pay & Demand Bar */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Pay Range:</span>
                        <span className="font-black text-slate-900 dark:text-emerald-400 text-[11px]">
                          {seg.benchmarkSalary}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Live Vacancies:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {segJobs.length} Active Jobs
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Shortlisted Talent:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {segShortlisted.length} Candidates
                        </span>
                      </div>
                    </div>

                    {/* Jobs in this segment list snippet */}
                    {segJobs.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Current Openings:
                        </span>
                        {segJobs.slice(0, 2).map((j) => (
                          <div
                            key={j.id}
                            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] flex items-center justify-between gap-2"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {j.title}
                            </span>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {j.city}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for Super Admin */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSegmentId(seg.id);
                        setActiveTab('shortlisted');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold text-xs transition-colors text-center"
                    >
                      Audit Talent ({segShortlisted.length})
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('postings');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                      title="Inspect Vacancies"
                    >
                      Jobs ({segJobs.length})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: All Shortlisted Candidates (Crucial user requirement!) */}
      {activeTab === 'shortlisted' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                All Shortlisted Candidates Across Platform
              </h2>
              <p className="text-xs text-slate-500">
                Candidates marked as Shortlisted or Interview Scheduled by any employer. Click to download profile.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {allShortlistedCandidates.length} Candidates Shortlisted
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate Details</th>
                  <th className="py-3 px-4">Applied Job & Company</th>
                  <th className="py-3 px-4">AI ATS Score</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Interview Details</th>
                  <th className="py-3 px-4 text-right">Download & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allShortlistedCandidates.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {app.candidateAvatarUrl ? (
                          <img
                            src={app.candidateAvatarUrl}
                            alt={app.candidateName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {app.candidateName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {app.candidateName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{app.candidatePhone}</span> • <span>{app.candidateEmail}</span>
                          </div>
                          {app.resumeFileName && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                              📎 {app.resumeFileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {app.jobTitle}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        {app.companyName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-900">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {app.atsMatchScore}%
                      </span>
                      {app.candidateVerifiedBadges && app.candidateVerifiedBadges.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {app.candidateVerifiedBadges.map((b) => (
                            <span
                              key={b.id}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 whitespace-nowrap"
                              title={`${b.name} (${b.source})`}
                            >
                              🏅 {b.name.replace(/[^\w\s]/gi, '').slice(0, 16)}...
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {app.scheduledInterview ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {app.scheduledInterview.date} @ {app.scheduledInterview.time}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {app.scheduledInterview.mode}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Interview not set yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onDownloadProfile(app)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                          title="Download candidate formatted profile & CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Profile</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Moderate Postings */}
      {activeTab === 'postings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Moderate Job Listings ({jobs.length})
            </h2>
            <span className="text-xs text-slate-400">Admin actions: Feature, Toggle Urgent, or Remove</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Featured Boost</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{job.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{job.company}</td>
                    <td className="py-3 px-4 text-slate-500">{job.sector}</td>
                    <td className="py-3 px-4 text-slate-500">{job.city}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(job.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.isFeatured
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {job.isFeatured ? '★ Featured Active' : '+ Make Featured'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Remove job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Employer Verifications */}
      {activeTab === 'verifications' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Employer Corporate Verification Requests
              </h2>
              <p className="text-xs text-slate-500">Validate GSTIN, CIN, and authorized signatory credentials.</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {verificationRequests.map((vr) => (
              <div
                key={vr.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{vr.companyName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        vr.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                      }`}
                    >
                      {vr.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-slate-600 dark:text-slate-300 text-[11px]">
                    <p><strong className="text-slate-500">GSTIN:</strong> {vr.gstin}</p>
                    <p><strong className="text-slate-500">CIN:</strong> {vr.cin}</p>
                    <p><strong className="text-slate-500">Contact:</strong> {vr.contactPerson}</p>
                    <p><strong className="text-slate-500">Email:</strong> {vr.contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {vr.status !== 'Approved' && (
                    <button
                      onClick={() => handleApproveVerification(vr.id, vr.companyName)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Badge</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Candidate Document Vault Verification Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-slate-50/30 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  Candidate KYC & Document Verification Audit Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Review and certify Aadhaar, Trade Diplomas, Wireman Licenses, and Educational Proofs.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                Candidate: {candidate.fullName} ({candidate.documents?.length || 0} Documents)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(candidate.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </span>
                      {doc.status === 'Verified' ? (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          Verified ✓
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                          Pending Review
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {doc.documentNumber ? `ID: ${doc.documentNumber} • ` : ''}
                      {doc.issuingAuthority || 'Govt Authority'} • {doc.fileSize}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {doc.status !== 'Verified' ? (
                      <button
                        onClick={() => {
                          verifyCandidateDocument(doc.id);
                          addNotification(
                            'Admin Verification Granted',
                            `Candidate document "${doc.title}" verified by Admin Desk.`,
                            'system'
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verify</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Certified</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
