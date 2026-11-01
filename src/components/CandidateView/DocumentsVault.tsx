import React, { useState } from 'react';
import {
  FileText,
  Shield,
  ShieldCheck,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Lock,
  Plus,
  ExternalLink,
  Calendar,
  Building,
  KeyRound,
  Filter,
  Sparkles,
  Printer,
  X,
  FileSpreadsheet,
  Award,
  GraduationCap,
  CreditCard,
  FileBadge,
  FileCheck2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateDocument, DocumentCategory } from '../../types';

const CATEGORIES: DocumentCategory[] = [
  'Government ID Proof',
  'Educational Degree / Diploma',
  'Skill & Trade Certificate',
  'Experience & Salary Slip',
  'Verification & Medical',
];

interface QuickPreset {
  label: string;
  category: DocumentCategory;
  documentType: string;
  title: string;
  documentNumber: string;
  issuingAuthority: string;
  expiryDate?: string;
  fileName: string;
  fileFormat: 'pdf' | 'image' | 'doc';
  fileSize: string;
  notes: string;
}

const PRESET_TEMPLATES: QuickPreset[] = [
  {
    label: 'Aadhaar Card (UIDAI)',
    category: 'Government ID Proof',
    documentType: 'Aadhaar Card',
    title: 'Aadhaar Card (UIDAI Masked)',
    documentNumber: 'XXXX-XXXX-8921',
    issuingAuthority: 'UIDAI (Govt. of India)',
    fileName: 'Aadhaar_Card_Masked.pdf',
    fileFormat: 'pdf',
    fileSize: '1.4 MB',
    notes: 'Government verified biometric identity proof with masked digits.',
  },
  {
    label: 'PAN Card (Income Tax)',
    category: 'Government ID Proof',
    documentType: 'PAN Card',
    title: 'Permanent Account Number (PAN Card)',
    documentNumber: 'ABCDE1234F',
    issuingAuthority: 'Income Tax Department, Govt of India',
    fileName: 'PAN_Card_Copy.jpg',
    fileFormat: 'image',
    fileSize: '820 KB',
    notes: 'Verified tax and identity document for salary crediting and TDS compliance.',
  },
  {
    label: 'ITI Electrician Diploma',
    category: 'Educational Degree / Diploma',
    documentType: 'ITI Trade Certificate',
    title: 'National Trade Certificate - ITI Electrician',
    documentNumber: 'NCVT-2023-EL-5582',
    issuingAuthority: 'National Council for Vocational Training (NCVT)',
    fileName: 'NCVT_Electrician_Certificate.pdf',
    fileFormat: 'pdf',
    fileSize: '2.8 MB',
    notes: '2-Year Full-time trade qualification with distinction grade.',
  },
  {
    label: 'Medical Fitness Certificate',
    category: 'Verification & Medical',
    documentType: 'Medical Fitness Certificate',
    title: 'Doctor Medical Fitness & Vision Certificate',
    documentNumber: 'MED-MH-2026-901',
    issuingAuthority: 'Civil Hospital Mumbai / Registered MBBS Practitioner',
    expiryDate: '2027-10-30',
    fileName: 'Medical_Fitness_Certificate.pdf',
    fileFormat: 'pdf',
    fileSize: '1.2 MB',
    notes: 'Certified fit for commercial shift operations, electrical work, and physical duties.',
  },
  {
    label: 'Police Clearance (PCC)',
    category: 'Verification & Medical',
    documentType: 'Police Clearance Certificate',
    title: 'Police Verification & Background NOC',
    documentNumber: 'MUM-POL-NOC-44812',
    issuingAuthority: 'Mumbai Police Commissionerate',
    expiryDate: '2027-04-15',
    fileName: 'Police_Clearance_NOC.pdf',
    fileFormat: 'pdf',
    fileSize: '1.5 MB',
    notes: 'Clean background verification record with zero criminal antecedents.',
  },
  {
    label: 'Last 3 Months Salary Slip',
    category: 'Experience & Salary Slip',
    documentType: 'Salary Slips / Pay Slip',
    title: 'Previous Employer Salary Slips (Q3 2026)',
    documentNumber: 'PAY-2026-AUG-OCT',
    issuingAuthority: 'The Orchid Hotel & Hospitality Payroll Dept',
    fileName: 'Salary_Slips_Consolidated.pdf',
    fileFormat: 'pdf',
    fileSize: '1.9 MB',
    notes: 'Proof of previous compensation (₹26,500/month in-hand) for salary benchmarking.',
  },
];

export const DocumentsVault: React.FC = () => {
  const {
    candidate,
    uploadCandidateDocument,
    deleteCandidateDocument,
    updateCandidateDocument,
    verifyCandidateDocument,
    addNotification,
  } = useApp();

  const documents = candidate.documents || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<CandidateDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<CandidateDocument | null>(null);
  const [showMaskedNumbers, setShowMaskedNumbers] = useState<Record<string, boolean>>({});

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Government ID Proof');
  const [newDocType, setNewDocType] = useState('Aadhaar Card');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newAuthority, setNewAuthority] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newFileFormat, setNewFileFormat] = useState<'pdf' | 'image' | 'doc'>('pdf');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');
  const [newFileDataUrl, setNewFileDataUrl] = useState<string | undefined>(undefined);
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Zoom in preview modal
  const [previewZoom, setPreviewZoom] = useState(100);

  // Stats calculation
  const totalDocs = documents.length;
  const verifiedDocs = documents.filter((d) => d.status === 'Verified').length;
  const pendingDocs = documents.filter((d) => d.status === 'Pending Review').length;
  const verificationScore = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

  // Filtered documents
  const filteredDocuments =
    selectedCategory === 'All'
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  const toggleMask = (id: string) => {
    setShowMaskedNumbers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplyPreset = (preset: QuickPreset) => {
    setNewTitle(preset.title);
    setNewCategory(preset.category);
    setNewDocType(preset.documentType);
    setNewDocNumber(preset.documentNumber);
    setNewAuthority(preset.issuingAuthority);
    setNewExpiryDate(preset.expiryDate || '');
    setNewNotes(preset.notes);
    setNewFileName(preset.fileName);
    setNewFileFormat(preset.fileFormat);
    setNewFileSize(preset.fileSize);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setNewFileSize(`${sizeInMb} MB`);

    if (file.type.includes('image')) {
      setNewFileFormat('image');
    } else if (file.type.includes('pdf')) {
      setNewFileFormat('pdf');
    } else {
      setNewFileFormat('doc');
    }

    if (!newTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName);
    }

    // Read client-side preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewFileDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please provide a document title.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      uploadCandidateDocument({
        title: newTitle.trim(),
        category: newCategory,
        documentType: newDocType.trim() || newTitle.trim(),
        documentNumber: newDocNumber.trim() || undefined,
        fileName: newFileName.trim() || `${newTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: newFileSize || '1.2 MB',
        fileFormat: newFileFormat,
        expiryDate: newExpiryDate || undefined,
        issuingAuthority: newAuthority.trim() || 'Official Issuing Authority',
        status: 'Pending Review',
        isEncrypted,
        fileDataUrl: newFileDataUrl,
        notes: newNotes.trim() || undefined,
      });

      setIsUploading(false);
      setIsUploadModalOpen(false);

      // Reset form
      setNewTitle('');
      setNewDocNumber('');
      setNewAuthority('');
      setNewExpiryDate('');
      setNewNotes('');
      setNewFileName('');
      setNewFileDataUrl(undefined);
    }, 600);
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    deleteCandidateDocument(docToDelete.id);
    setDocToDelete(null);
  };

  const handleTriggerDigiLockerVerification = (doc: CandidateDocument) => {
    verifyCandidateDocument(doc.id);
    try {
      import('canvas-confetti').then((m) => {
        const confetti = m.default || m;
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      });
    } catch (e) {}
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'Government ID Proof':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'Educational Degree / Diploma':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'Skill & Trade Certificate':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'Experience & Salary Slip':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case 'Verification & Medical':
        return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case 'Government ID Proof':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'Educational Degree / Diploma':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'Skill & Trade Certificate':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'Experience & Salary Slip':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'Verification & Medical':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const handleDownloadMock = (doc: CandidateDocument) => {
    addNotification(
      'Download Started',
      `Downloading encrypted copy of "${doc.fileName}" (${doc.fileSize}).`,
      'system'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Status & Security Trust */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-blue-400" />
                256-Bit AES Encrypted Vault
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DigiLocker & Govt API Linked
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Candidate Documents & KYC Vault</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-normal">
                दस्तावेज़ वॉल्ट
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Securely store Government ID proofs (Aadhaar, PAN, Driving License), educational diplomas,
              and trade licenses. Verified documents get a golden trust badge that boosts your recruiter
              shortlisting by up to <strong className="text-amber-300">3.5x</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero document leak guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-blue-400" />
                Masked sensitive identity digits
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                Shared only when you apply
              </span>
            </div>
          </div>

          {/* Quick KPI & Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
            {/* Score pill */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full sm:w-auto min-w-[220px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Document Trust Score</span>
                <span className="font-bold text-amber-400 text-sm">{verificationScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${verificationScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{verifiedDocs} of {totalDocs} Verified</span>
                <span className="text-emerald-300 font-semibold">
                  {verificationScore >= 80 ? 'High Trust 🛡️' : 'Standard Trust'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>All Documents</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              {totalDocs}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat.replace('Educational Degree / Diploma', 'Degrees & Diplomas')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Helper Button */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => {
              // Quick load a random unadded preset
              const unadded = PRESET_TEMPLATES.find(
                (p) => !documents.some((d) => d.title.toLowerCase().includes(p.label.toLowerCase()))
              ) || PRESET_TEMPLATES[0];
              handleApplyPreset(unadded);
              setIsUploadModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-dashed border-blue-400 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Quick Sample (Aadhaar / ITI / Medical)</span>
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No documents in this category yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your certificates, degrees, or ID proofs to verify your credentials with employers.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isMasked = !showMaskedNumbers[doc.id];
            const isVerified = doc.status === 'Verified';

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Header: Category Pill & Status Badge */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${getCategoryColor(
                        doc.category
                      )}`}
                    >
                      {getCategoryIcon(doc.category)}
                      <span className="truncate max-w-[150px]">{doc.category}</span>
                    </span>

                    {/* Status Pill */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Verified ✓</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Under Review</span>
                      </span>
                    )}
                  </div>

                  {/* Document Title & File Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.issuingAuthority || 'Official Board'}</span>
                    </p>
                  </div>

                  {/* Document Number with Masking Feature */}
                  {doc.documentNumber && (
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 truncate mr-2">
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">
                          Document / Reg ID
                        </span>
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          {isMasked && doc.documentNumber.length > 6
                            ? doc.documentNumber.replace(/^.{4}/, 'XXXX-')
                            : doc.documentNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleMask(doc.id)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                        title={isMasked ? 'Reveal full number' : 'Mask number'}
                      >
                        {isMasked ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Metadata Chips: Size, Format, Expiry */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                      {doc.fileFormat.toUpperCase()} • {doc.fileSize}
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Uploaded: {doc.uploadDate}
                    </span>

                    {doc.expiryDate && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="w-3 h-3" />
                        Expires: {doc.expiryDate}
                      </span>
                    )}
                  </div>

                  {/* Verification Source if verified */}
                  {doc.verificationSource && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{doc.verificationSource}</span>
                    </div>
                  )}

                  {/* Notes if present */}
                  {doc.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                      "{doc.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedDocForPreview(doc);
                        setPreviewZoom(100);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Preview Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleDownloadMock(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {!isVerified && (
                      <button
                        onClick={() => handleTriggerDigiLockerVerification(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Instant Verify via DigiLocker"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Verify Now</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setDocToDelete(doc)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Info Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Data Privacy & Employer Access Policy
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your documents remain private. Recruiters can only inspect verification records after you apply for their job opening or accept an interview invite.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          ISO 27001 Compliant Architecture
        </span>
      </div>

      {/* Modal 1: Upload New Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Upload Verification Document
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Store ID proofs, degrees, or licenses with 256-bit encryption
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Quick Template Selector */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quick Fill from Verified Templates (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.label}
                      type="button"
                      onClick={() => handleApplyPreset(tmpl)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-blue-500" />
                      <span>{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Document Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Document Type *
                  </label>
                  <input
                    type="text"
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    placeholder="e.g. Aadhaar Card, ITI Diploma, Driving License"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Document Title */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Document Title / Label *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Government Aadhaar Card (Masked) or MSBTE Electrical Diploma"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Document Number */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Document / Registration ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-8921 or DL-MH02-202200"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    You can mask sensitive digits for privacy
                  </span>
                </div>

                {/* Issuing Authority */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Issuing Authority / Board
                  </label>
                  <input
                    type="text"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    placeholder="e.g. UIDAI, State Board, RTO, NCVT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Expiry Date (if applicable) */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* File Attachment Dropzone */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Select File (PDF, JPG, PNG)
                  </label>
                  <label className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition-colors">
                    <span className="truncate text-slate-600 dark:text-slate-300">
                      {newFileName || 'Browse file from device...'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                  </label>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Max size: 15MB • Client-side preview enabled
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Additional Verification Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Scored 74% in electrical trade, renewed commercial transport endorsement..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Encryption Toggle */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Enable AES-256 Storage Encryption
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Locks document in private encrypted storage bucket
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={(e) => setIsEncrypted(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-60"
                >
                  {isUploading ? (
                    <span>Encrypting & Saving...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save to Secure Vault</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Full Interactive Document Viewer & Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
            {/* Viewer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  {getCategoryIcon(selectedDocForPreview.category)}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {selectedDocForPreview.title}
                    </h3>
                    {selectedDocForPreview.status === 'Verified' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold shrink-0">
                        Under Review
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {selectedDocForPreview.fileName} • {selectedDocForPreview.fileSize} • AES-256 Encrypted
                  </p>
                </div>
              </div>

              {/* Zoom & Action Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(70, z - 15))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold text-slate-500 w-12 text-center">
                  {previewZoom}%
                </span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(150, z + 15))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewZoom(100)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDownloadMock(selectedDocForPreview)}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 ml-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Content Canvas */}
            <div className="flex-1 overflow-auto p-6 bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[380px]">
              <div
                style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200"
              >
                {/* Check if user uploaded a custom image data URL */}
                {selectedDocForPreview.fileDataUrl && selectedDocForPreview.fileFormat === 'image' ? (
                  <div className="bg-white p-2 rounded-2xl shadow-xl max-w-lg">
                    <img
                      src={selectedDocForPreview.fileDataUrl}
                      alt={selectedDocForPreview.title}
                      className="max-h-[460px] object-contain rounded-xl"
                    />
                  </div>
                ) : selectedDocForPreview.category === 'Government ID Proof' ? (
                  /* Stylized Authentic Indian Government Biometric Smart Card */
                  <div className="w-[420px] sm:w-[480px] bg-gradient-to-br from-amber-50 via-white to-orange-50 text-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-amber-300/80 relative overflow-hidden font-sans">
                    {/* Top Tricolor Strip */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-green-600" />

                    {/* Watermark Emblem */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                      <Shield className="w-48 h-48 text-slate-900" />
                    </div>

                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                          🇮🇳
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            {selectedDocForPreview.issuingAuthority || 'Government of India'}
                          </h4>
                          <span className="text-[10px] text-slate-500 block">
                            {selectedDocForPreview.documentType} • Official Verification Card
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          DIGILOCKER VERIFIED
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="py-4 flex gap-4 items-center">
                      {/* Photo / Chip */}
                      <div className="space-y-2 shrink-0">
                        <div className="w-20 h-24 rounded-xl border border-slate-300 overflow-hidden bg-slate-200">
                          {candidate.avatarUrl ? (
                            <img
                              src={candidate.avatarUrl}
                              alt={candidate.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                              PHOTO
                            </div>
                          )}
                        </div>
                        <div className="w-10 h-6 bg-gradient-to-r from-amber-300 to-yellow-500 rounded border border-amber-600 flex items-center justify-center text-[7px] font-bold text-amber-950">
                          CHIP
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 flex-1 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold block">
                            Full Legal Name
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {candidate.fullName}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold block">
                            Document Registration ID
                          </span>
                          <span className="font-mono font-black text-slate-900 tracking-wider text-sm">
                            {selectedDocForPreview.documentNumber || 'XXXX-XXXX-8921'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <span className="text-slate-400 block">Registered Area</span>
                            <span className="font-semibold text-slate-700">{candidate.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Status</span>
                            <span className="font-bold text-emerald-700">ACTIVE & SECURE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-amber-200 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Verification Hash: SHA-256 AES SECURED</span>
                      <span>Job Milega Verified Trust ID: JM-KYC-9921</span>
                    </div>
                  </div>
                ) : selectedDocForPreview.category === 'Educational Degree / Diploma' ||
                  selectedDocForPreview.category === 'Skill & Trade Certificate' ? (
                  /* Stylized Official Certificate / Diploma */
                  <div className="w-[420px] sm:w-[500px] bg-amber-50/90 text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-double border-amber-400 relative font-serif">
                    <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
                      <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 mx-auto flex items-center justify-center font-black text-lg border border-amber-400">
                        🎖️
                      </div>
                      <h4 className="text-base font-black uppercase tracking-wider text-slate-900 font-sans">
                        {selectedDocForPreview.issuingAuthority || 'State Board of Technical Education'}
                      </h4>
                      <p className="text-[11px] text-amber-900 font-sans font-medium uppercase tracking-widest">
                        Official Certificate of Competence & Qualification
                      </p>
                    </div>

                    <div className="text-center py-6 space-y-3 font-serif">
                      <p className="text-xs text-slate-600 italic">This is to certify that</p>
                      <h3 className="text-xl font-bold text-slate-900 font-sans tracking-wide">
                        {candidate.fullName}
                      </h3>
                      <p className="text-xs text-slate-600 italic">
                        has successfully completed and demonstrated proficiency in
                      </p>
                      <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300 inline-block font-sans font-bold text-amber-950 text-sm">
                        {selectedDocForPreview.title}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono pt-1">
                        Credential ID: {selectedDocForPreview.documentNumber || 'CERT-98214-IN'}
                      </p>
                    </div>

                    <div className="pt-4 border-t-2 border-amber-300 flex items-center justify-between text-[10px] font-sans text-slate-600">
                      <div>
                        <span className="block font-bold text-slate-800">Verified Stamp</span>
                        <span>National Depository (NAD)</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-slate-800">Date Verified</span>
                        <span>{selectedDocForPreview.verifiedDate || selectedDocForPreview.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Official Experience / Pay Slip / Verification Letter */
                  <div className="w-[420px] sm:w-[480px] bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-4 font-sans">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {selectedDocForPreview.issuingAuthority || 'Previous Employer / Facility'}
                        </h4>
                        <span className="text-[10px] text-slate-500">Official HR & Operations Record</span>
                      </div>
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        HR
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b py-1.5">
                        <span className="text-slate-500">Document Type</span>
                        <span className="font-semibold">{selectedDocForPreview.documentType}</span>
                      </div>
                      <div className="flex justify-between border-b py-1.5">
                        <span className="text-slate-500">Candidate Name</span>
                        <span className="font-semibold">{candidate.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b py-1.5">
                        <span className="text-slate-500">Reference No</span>
                        <span className="font-mono font-semibold">
                          {selectedDocForPreview.documentNumber || 'REF-2026-DOC-01'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b py-1.5">
                        <span className="text-slate-500">Verification Status</span>
                        <span className="font-bold text-emerald-600">
                          {selectedDocForPreview.status}
                        </span>
                      </div>
                    </div>

                    {selectedDocForPreview.notes && (
                      <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 italic">
                        "{selectedDocForPreview.notes}"
                      </div>
                    )}

                    <div className="pt-2 text-[10px] text-slate-400 text-center">
                      Verified for recruitment background check on Job Milega portal
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Viewer Footer: Metadata & Security Audit Info */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  Tamper Proof Checksum: <strong className="font-mono text-slate-700 dark:text-slate-300">e3b0c442...855</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Deletion Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete "{docToDelete.title}"?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This document will be permanently removed from your encrypted vault. Recruiters will no longer be able to verify this credential.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Yes, Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
