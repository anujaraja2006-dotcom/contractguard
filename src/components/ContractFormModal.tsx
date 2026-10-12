import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Building2,
  ShieldCheck,
  DollarSign,
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Check,
  Camera,
} from 'lucide-react';
import { Contract, ContractType, Department, PaymentFrequency, ContractStatus, CompanyAutoRenewPolicy } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { calculateDaysRemaining, classifyRisk, formatCurrency, formatDate } from '../utils/contractUtils';
import {
  extractContractTermsFromDocument,
  SAMPLE_CONTRACT_PRESETS,
  SampleContractPreset,
  ExtractedContractTerms,
} from '../utils/documentProcessor';
import { CameraContractScannerModal } from './CameraContractScannerModal';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: Partial<Contract>) => void;
  contractToEdit: Contract | null;
  departments: Department[];
  t: TranslationDictionary;
  initialPrefillData?: Partial<Contract> | null;
  companyAutoRenewPolicy?: CompanyAutoRenewPolicy;
}

export const ContractFormModal: React.FC<ContractFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contractToEdit,
  departments,
  t,
  initialPrefillData,
  companyAutoRenewPolicy,
}) => {
  const [formData, setFormData] = useState<Partial<Contract>>({
    name: '',
    contractNumber: '',
    type: 'Vendor Agreement',
    description: '',
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    departmentId: departments[0]?.id || '',
    departmentName: departments[0]?.name || '',
    ownerName: 'Vikram Malhotra',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    expiryDate: '',
    renewalDate: '',
    renewalTerms: '',
    noticePeriodDays: 30,
    autoRenewal: false,
    contractValue: 500000,
    currency: 'INR',
    paymentFrequency: 'Annual',
    status: 'Active',
    notes: '',
    customFields: [],
  });

  const [validationError, setValidationError] = useState('');

  // AI Document Processing State
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());
  const [isDocProcessingExpanded, setIsDocProcessingExpanded] = useState(true);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [attachedDocInfo, setAttachedDocInfo] = useState<{ id: string; name: string } | null>(null);
  const [extractedSummary, setExtractedSummary] = useState<{
    fileName: string;
    expiryDate: string;
    renewalTerms: string;
    noticeDays?: number;
    autoRenewal?: boolean;
    contractValue?: number;
    currency?: string;
    source?: string;
    timestamp: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contractToEdit) {
      setFormData({
        ...contractToEdit,
        expiryDate: contractToEdit.expiryDate || contractToEdit.endDate,
        renewalTerms: contractToEdit.renewalTerms || '',
      });
      setAutoFilledFields(new Set());
      setExtractedSummary(null);
      setAttachedDocInfo(null);
      setIsDocProcessingExpanded(false);
    } else if (initialPrefillData) {
      setFormData((prev) => ({
        ...prev,
        ...initialPrefillData,
        expiryDate: initialPrefillData.expiryDate || initialPrefillData.endDate || prev.endDate,
        renewalTerms: initialPrefillData.renewalTerms || prev.renewalTerms || '',
      }));
      // Mark prefilled fields as auto-filled
      const filled = new Set<string>();
      if (initialPrefillData.endDate) filled.add('endDate');
      if (initialPrefillData.expiryDate) filled.add('expiryDate');
      if (initialPrefillData.renewalTerms) filled.add('renewalTerms');
      if (initialPrefillData.name) filled.add('name');
      if (initialPrefillData.companyName) filled.add('companyName');
      setAutoFilledFields(filled);
      if ((initialPrefillData as any).attachedDocumentId) {
        setAttachedDocInfo({
          id: (initialPrefillData as any).attachedDocumentId,
          name: (initialPrefillData as any).attachedDocumentName || 'Scanned_Contract_Paper.jpg',
        });
      } else {
        setAttachedDocInfo(null);
      }
      setIsDocProcessingExpanded(true);
    } else {
      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      setFormData({
        name: '',
        contractNumber: `CNT-${Date.now().toString().slice(-5)}`,
        type: 'Vendor Agreement',
        description: '',
        companyName: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        departmentId: departments[0]?.id || '',
        departmentName: departments[0]?.name || '',
        ownerName: 'Anuj Raja',
        startDate: today.toISOString().split('T')[0],
        endDate: oneYearLater.toISOString().split('T')[0],
        expiryDate: oneYearLater.toISOString().split('T')[0],
        renewalDate: oneYearLater.toISOString().split('T')[0],
        renewalTerms: companyAutoRenewPolicy?.defaultRenewalTermsTemplate || '',
        noticePeriodDays: companyAutoRenewPolicy?.defaultNoticePeriodDays ?? 60,
        autoRenewal: companyAutoRenewPolicy?.defaultAutoRenewalEnabled ?? true,
        contractValue: 1200000,
        currency: 'INR',
        paymentFrequency: 'Annual',
        status: 'Active',
        notes: '',
        customFields: [{ id: 'cf-new', label: 'Purchase Order No.', value: 'PO-98214' }],
      });
      setAutoFilledFields(new Set());
      setAttachedDocInfo(null);
      setExtractedSummary(null);
      setIsDocProcessingExpanded(true);
    }
    setValidationError('');
  }, [contractToEdit, initialPrefillData, isOpen]);

  if (!isOpen) return null;

  // Process Document and auto-fill form fields
  const processContractDocument = async (options: {
    file?: File;
    preset?: SampleContractPreset;
  }) => {
    setIsProcessingDoc(true);
    setValidationError('');

    try {
      setProcessingStatus('Uploading and parsing contract document bytes...');
      await new Promise((r) => setTimeout(r, 300));

      setProcessingStatus('Connecting to Gemini AI Service: Scanning clauses & terms...');
      await new Promise((r) => setTimeout(r, 400));

      setProcessingStatus('Extracting Expiry Date, Renewal Terms & Notice conditions...');

      const result = await extractContractTermsFromDocument({
        file: options.file,
        fileName: options.file?.name || options.preset?.fileName,
        mimeType: options.file?.type || 'application/pdf',
        contractText: options.preset?.simulatedText,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to extract terms from contract PDF');
      }

      const extracted = result.data;
      const expiry = extracted.expiryDate || formData.endDate || '';
      const renewalTermsExtracted = extracted.renewalTerms || '';
      const renewalTarget = extracted.renewalDate || expiry;

      // Auto-fill form fields with extracted data
      setFormData((prev) => {
        const next: Partial<Contract> = {
          ...prev,
          endDate: expiry,
          expiryDate: expiry,
          renewalDate: renewalTarget,
          renewalTerms: renewalTermsExtracted,
        };

        if (extracted.contractName) next.name = extracted.contractName;
        if (extracted.companyName) next.companyName = extracted.companyName;
        if (extracted.startDate) next.startDate = extracted.startDate;
        if (extracted.noticePeriodDays !== undefined) next.noticePeriodDays = extracted.noticePeriodDays;
        if (extracted.autoRenewal !== undefined) next.autoRenewal = extracted.autoRenewal;
        if (extracted.contractValue !== undefined) next.contractValue = extracted.contractValue;
        if (extracted.currency) next.currency = extracted.currency as any;
        if (extracted.type) next.type = extracted.type;
        if (extracted.paymentFrequency) next.paymentFrequency = extracted.paymentFrequency as any;
        if (extracted.description) next.description = extracted.description;

        return next;
      });

      // Track which fields were auto-filled to show visual cues
      const updatedAutoFields = new Set<string>([
        'endDate',
        'expiryDate',
        'renewalTerms',
        'renewalDate',
      ]);
      if (extracted.contractName) updatedAutoFields.add('name');
      if (extracted.companyName) updatedAutoFields.add('companyName');
      if (extracted.startDate) updatedAutoFields.add('startDate');
      if (extracted.noticePeriodDays !== undefined) updatedAutoFields.add('noticePeriodDays');
      if (extracted.autoRenewal !== undefined) updatedAutoFields.add('autoRenewal');
      if (extracted.contractValue !== undefined) updatedAutoFields.add('contractValue');
      if (extracted.currency) updatedAutoFields.add('currency');
      if (extracted.type) updatedAutoFields.add('type');
      if (extracted.paymentFrequency) updatedAutoFields.add('paymentFrequency');
      if (extracted.description) updatedAutoFields.add('description');

      setAutoFilledFields(updatedAutoFields);

      setExtractedSummary({
        fileName: options.file?.name || options.preset?.fileName || 'Contract.pdf',
        expiryDate: expiry,
        renewalTerms: renewalTermsExtracted,
        noticeDays: extracted.noticePeriodDays,
        autoRenewal: extracted.autoRenewal,
        contractValue: extracted.contractValue,
        currency: extracted.currency,
        source: result.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } catch (err: any) {
      console.error('Error during contract document processing:', err);
      setValidationError(err?.message || 'Could not extract contract terms from the document.');
    } finally {
      setIsProcessingDoc(false);
      setProcessingStatus('');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processContractDocument({ file: e.dataTransfer.files[0] });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processContractDocument({ file: e.target.files[0] });
    }
  };

  const handleClearExtractedTerms = () => {
    setAutoFilledFields(new Set());
    setExtractedSummary(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setValidationError('Contract name is required.');
      return;
    }
    if (!formData.companyName?.trim()) {
      setValidationError('Company/Vendor name is required.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setValidationError('Start date and Expiry (End) date are required.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setValidationError('Expiry Date cannot be earlier than Start Date.');
      return;
    }

    const dept = departments.find((d) => d.id === formData.departmentId);
    const renewalDate = formData.renewalDate || formData.endDate;
    const days = calculateDaysRemaining(renewalDate);
    const risk = classifyRisk(days);

    onSave({
      ...formData,
      departmentName: dept ? dept.name : formData.departmentName,
      renewalDate,
      expiryDate: formData.endDate,
      renewalTerms: formData.renewalTerms || '',
      riskLevel: risk.level,
      riskScore: risk.score,
      attachedDocumentId: attachedDocInfo?.id,
    } as any);
    onClose();
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...(prev.customFields || []),
        { id: `cf-${Date.now()}`, label: 'Custom Field', value: '' },
      ],
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                {contractToEdit ? 'Edit Agreement' : 'New Agreement'}
              </span>
              {autoFilledFields.size > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>AI Auto-Filled ({autoFilledFields.size} fields)</span>
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
              {contractToEdit ? 'Modify Contract Details' : 'Add Contract to ContractGuard'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {validationError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FEATURE: AUTOMATED DOCUMENT PROCESSING (AI EXTRACTION DROPZONE) */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50/70 via-white to-stone-50 p-4 sm:p-5 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#243029] text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A231E]">
                      Automated Document Processing (AI Extraction)
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-300">
                      Gemini 3.8 Flash
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Upload contract PDF to automatically extract <strong className="text-stone-900 font-bold">Expiry Date</strong> and <strong className="text-stone-900 font-bold">Renewal Terms</strong> to auto-fill form fields.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDocProcessingExpanded(!isDocProcessingExpanded)}
                className="text-stone-500 hover:text-stone-800 p-1 rounded hover:bg-white/80 transition-colors"
                title={isDocProcessingExpanded ? 'Collapse AI Document Processor' : 'Expand AI Document Processor'}
              >
                {isDocProcessingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isDocProcessingExpanded && (
              <div className="mt-4 space-y-3.5">
                {/* Upload Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all bg-white/80 ${
                    dragOver
                      ? 'border-[#243029] bg-emerald-50/40 ring-2 ring-[#243029]/20'
                      : 'border-stone-300 hover:border-emerald-700'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {isProcessingDoc ? (
                    <div className="py-4 space-y-3 flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
                        <Sparkles className="w-4 h-4 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-stone-900">{processingStatus}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Parsing contract legal language, clause conditions, and milestone dates...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-stone-800">
                        Drag and drop your contract PDF here, or select an option below:
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Supported: PDF, DOCX, Scanned Physical Images (Up to 25MB)
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-lg bg-[#243029] hover:bg-[#1A231E] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Browse Files
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCameraScannerOpen(true)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Scan with Camera</span>
                        </button>
                      </div>

                      {/* Sample Preset Buttons for quick 1-click verification */}
                      <div className="mt-3 pt-3 border-t border-stone-200/60">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1.5">
                          Or test with sample contract documents:
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {SAMPLE_CONTRACT_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => processContractDocument({ preset })}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={preset.summary}
                            >
                              <FileText className="w-3 h-3 text-stone-500" />
                              <span className="truncate max-w-[180px]">{preset.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Extraction Feedback Summary */}
                {extractedSummary && (
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-stone-900">
                          AI Extraction Complete for &ldquo;{extractedSummary.fileName}&rdquo;
                        </span>
                        <span className="text-[10px] text-stone-400">({extractedSummary.timestamp})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearExtractedTerms}
                        className="text-[10px] text-stone-500 hover:text-rose-600 underline font-medium cursor-pointer"
                      >
                        Reset / Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Expiry Date Card */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900 uppercase">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-700" />
                            Extracted Expiry Date
                          </span>
                          <span className="text-emerald-700 font-mono">Auto-Filled</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-950 mt-1">
                          {formatDate(extractedSummary.expiryDate)}
                          <span className="text-[11px] font-normal text-stone-500 ml-2">({extractedSummary.expiryDate})</span>
                        </div>
                      </div>

                      {/* Notice & Rollover Card */}
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <div className="text-[10px] font-bold text-stone-500 uppercase flex items-center justify-between">
                          <span>Notice &amp; Rollover</span>
                          <span className="text-stone-400 font-mono">Auto-Filled</span>
                        </div>
                        <div className="text-xs font-semibold text-stone-800 mt-1 flex items-center gap-3">
                          <span>Notice: <strong>{extractedSummary.noticeDays ?? 30} days</strong></span>
                          <span>•</span>
                          <span>Auto-Renewal: <strong className={extractedSummary.autoRenewal ? 'text-emerald-700' : 'text-stone-600'}>
                            {extractedSummary.autoRenewal ? 'Enabled' : 'Disabled'}
                          </strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Renewal Terms Preview */}
                    <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          Extracted Renewal Terms &amp; Conditions
                        </span>
                        <span className="text-amber-800 font-mono">Populated Below</span>
                      </div>
                      <p className="text-[11px] text-stone-700 leading-relaxed italic line-clamp-3">
                        &ldquo;{extractedSummary.renewalTerms}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                      <span>
                        ✓ {autoFilledFields.size} form fields populated from document. You may review and make manual edits below before saving.
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Upload Another</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Attached Document Indicator */}
                {attachedDocInfo && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-950 font-semibold shadow-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Attached Document: <strong>{attachedDocInfo.name}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                      Physical Scan Attached
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200 flex items-center justify-between">
              <span>1. Basic Identification</span>
              {autoFilledFields.has('name') && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✨ AI Auto-Filled
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Contract Name *
                  </label>
                  {autoFilledFields.has('name') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Infrastructure MSA"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('name') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contract Number / ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGT-AWS-2025-01"
                  value={formData.contractNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Contract Type
                  </label>
                  {autoFilledFields.has('type') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <select
                  value={formData.type || 'Vendor Agreement'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer ${
                    autoFilledFields.has('type') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                >
                  <option value="Vendor Agreement">Vendor Agreement</option>
                  <option value="Customer Agreement">Customer Agreement</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Lease/Rental Agreement">Lease/Rental Agreement</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Maintenance Agreement">Maintenance Agreement</option>
                  <option value="Software License">Software License</option>
                  <option value="Insurance Agreement">Insurance Agreement</option>
                  <option value="Partnership Agreement">Partnership Agreement</option>
                  <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">Description / Scope Summary</label>
                {autoFilledFields.has('description') && (
                  <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                )}
              </div>
              <textarea
                rows={2}
                placeholder="Scope of work, deliverables, and service levels..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                  autoFilledFields.has('description') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                }`}
              ></textarea>
            </div>
          </div>

          {/* Section 2: Counterparty & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200 flex items-center justify-between">
              <span>2. Counterparty &amp; Contact Information</span>
              {autoFilledFields.has('companyName') && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✨ AI Auto-Filled
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Company / Vendor Name *
                  </label>
                  {autoFilledFields.has('companyName') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services Ltd"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('companyName') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deepak Saxena"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="vendor@company.com"
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone || ''}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 3: Critical Dates, Expiry Date & Renewal Terms */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Critical Dates, Expiry Date &amp; Renewal Terms
              </h3>
              {(autoFilledFields.has('endDate') || autoFilledFields.has('renewalTerms')) ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>AI Extracted Expiry &amp; Renewal Terms</span>
                </span>
              ) : companyAutoRenewPolicy ? (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span>🏛️ Default Policy ({companyAutoRenewPolicy.defaultNoticePeriodDays}d notice, {companyAutoRenewPolicy.defaultAutoRenewalEnabled ? 'Auto-Renew' : 'Manual'})</span>
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Start Date *</label>
                  {autoFilledFields.has('startDate') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="date"
                  required
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('startDate') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              {/* EXPIRY DATE FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-900">
                    Expiry Date (End Date) *
                  </label>
                  {autoFilledFields.has('endDate') && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                      ✨ AI Extracted Expiry
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  required
                  value={formData.endDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                      expiryDate: e.target.value,
                      renewalDate: formData.renewalDate || e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-lg border font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('endDate')
                      ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20 text-emerald-950 font-bold'
                      : 'border-stone-300 text-stone-900'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Renewal Action Date
                  </label>
                  {autoFilledFields.has('renewalDate') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="date"
                  value={formData.renewalDate || ''}
                  onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('renewalDate') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Notice Period (Days)
                  </label>
                  {autoFilledFields.has('noticePeriodDays') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.noticePeriodDays ?? 30}
                  onChange={(e) =>
                    setFormData({ ...formData, noticePeriodDays: parseInt(e.target.value) || 0 })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('noticePeriodDays') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  checked={formData.autoRenewal || false}
                  onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                  className="w-4 h-4 rounded text-[#243029] focus:ring-[#243029] cursor-pointer"
                />
                <label htmlFor="autoRenewal" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Auto-Renewal Clause Enabled
                  {autoFilledFields.has('autoRenewal') && (
                    <span className="text-[9px] font-bold text-emerald-700 ml-1.5">✨ AI</span>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Renewed">Renewed</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* RENEWAL TERMS FIELD */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs font-bold text-stone-900">
                    Renewal Terms &amp; Conditions
                  </label>
                  <span className="text-[10px] text-stone-500 font-normal">
                    (Auto-renewal rules, extension mechanics, notice window, CPI caps)
                  </span>
                </div>
                {autoFilledFields.has('renewalTerms') && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>✨ AI Extracted Renewal Terms</span>
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Agreement automatically renews for successive 12-month periods unless written notice of non-renewal is provided at least 60 calendar days prior to the Expiry Date. Renewal fee adjustments capped at 5% CPI per annum."
                value={formData.renewalTerms || ''}
                onChange={(e) => setFormData({ ...formData, renewalTerms: e.target.value })}
                className={`w-full px-3 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                  autoFilledFields.has('renewalTerms')
                    ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20 text-stone-900 font-medium'
                    : 'border-stone-300 text-stone-900'
                }`}
              ></textarea>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                <span>
                  Extracted automatically from uploaded contract PDFs using Gemini document processing.
                </span>
                {formData.renewalTerms && (
                  <span className="text-[10px] text-stone-400">
                    {formData.renewalTerms.length} characters
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Section 4: Financial Terms */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200 flex items-center justify-between">
              <span>4. Financial Terms &amp; Currency</span>
              {autoFilledFields.has('contractValue') && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✨ AI Auto-Filled
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Contract Value
                  </label>
                  {autoFilledFields.has('contractValue') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.contractValue || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] ${
                    autoFilledFields.has('contractValue') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Currency</label>
                  {autoFilledFields.has('currency') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <select
                  value={formData.currency || 'INR'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer ${
                    autoFilledFields.has('currency') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Payment Frequency
                  </label>
                  {autoFilledFields.has('paymentFrequency') && (
                    <span className="text-[9px] font-bold text-emerald-700">✨ AI Populated</span>
                  )}
                </div>
                <select
                  value={formData.paymentFrequency || 'Annual'}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentFrequency: e.target.value as any })
                  }
                  className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer ${
                    autoFilledFields.has('paymentFrequency') ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-300'
                  }`}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-yearly">Half-yearly</option>
                  <option value="Annual">Annual</option>
                  <option value="One-time">One-time</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Custom Metadata Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                5. Custom Metadata Fields
              </h3>
              <button
                type="button"
                onClick={addCustomField}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Field</span>
              </button>
            </div>

            {formData.customFields?.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Purchase Order No.)"
                  value={field.label}
                  onChange={(e) => {
                    const next = [...(formData.customFields || [])];
                    next[idx].label = e.target.value;
                    setFormData({ ...formData, customFields: next });
                  }}
                  className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => {
                    const next = [...(formData.customFields || [])];
                    next[idx].value = e.target.value;
                    setFormData({ ...formData, customFields: next });
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                  title="Remove Field"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div className="text-[11px] text-stone-500">
              {autoFilledFields.size > 0 && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>AI Extracted &bull; Ready for verification</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#243029] hover:bg-[#1A231E] text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{contractToEdit ? 'Save Changes' : 'Create Contract'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Physical Contract Scanner Modal */}
      <CameraContractScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onDocumentScannedAndAttached={(scannedDoc, extracted) => {
          setAttachedDocInfo({ id: scannedDoc.id, name: scannedDoc.fileName });

          const expiry = extracted.expiryDate || '';
          setFormData((prev) => ({
            ...prev,
            name: extracted.contractName || prev.name,
            companyName: extracted.companyName || prev.companyName,
            endDate: expiry || prev.endDate,
            expiryDate: expiry || prev.expiryDate,
            renewalDate: extracted.renewalDate || expiry || prev.renewalDate,
            renewalTerms: extracted.renewalTerms || prev.renewalTerms,
            startDate: extracted.startDate || prev.startDate,
            noticePeriodDays: extracted.noticePeriodDays ?? prev.noticePeriodDays,
            autoRenewal: extracted.autoRenewal ?? prev.autoRenewal,
            contractValue: extracted.contractValue ?? prev.contractValue,
            currency: (extracted.currency as any) || prev.currency,
            type: extracted.type || prev.type,
            description: extracted.description || prev.description,
          }));

          const updated = new Set<string>([
            'endDate',
            'expiryDate',
            'renewalTerms',
            'renewalDate',
            'name',
            'companyName',
          ]);
          setAutoFilledFields(updated);
          setExtractedSummary({
            fileName: scannedDoc.fileName,
            expiryDate: expiry,
            renewalTerms: extracted.renewalTerms,
            noticeDays: extracted.noticePeriodDays,
            autoRenewal: extracted.autoRenewal,
            contractValue: extracted.contractValue,
            currency: extracted.currency,
            source: 'gemini-3.8-flash (Camera Scanner)',
            timestamp: new Date().toLocaleTimeString(),
          });
        }}
      />
    </div>
  );
};
