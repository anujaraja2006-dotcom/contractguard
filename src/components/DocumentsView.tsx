import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  Eye,
  Download,
  Trash2,
  Building2,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';
import { ContractDocument, Contract } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { formatCurrency, formatDate } from '../utils/contractUtils';

interface DocumentsViewProps {
  documents: ContractDocument[];
  contracts: Contract[];
  t: TranslationDictionary;
  onUploadDocument: (newDoc: ContractDocument) => void;
  onLinkExtractedToContract?: (extractedData: any) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  contracts,
  t,
  onUploadDocument,
  onLinkExtractedToContract,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Simulated OCR Extraction States
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [uploadedFileTemp, setUploadedFileTemp] = useState<File | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.contractName && doc.contractName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    return true;
  });

  const categories = ['Master Agreement', 'NDA', 'License', 'Amendment', 'Invoice', 'Other'];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSimulatedOcr(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSimulatedOcr(e.target.files[0]);
    }
  };

  const processSimulatedOcr = (file: File) => {
    setUploadedFileTemp(file);
    setIsExtracting(true);

    // Simulate smart OCR parsing
    setTimeout(() => {
      setIsExtracting(false);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setExtractedData({
        contractName: `${cleanName} Service Agreement`,
        vendorName: 'Infosys BPM Ltd',
        startDate: '2026-01-15',
        endDate: '2027-01-14',
        renewalDate: '2027-01-14',
        noticePeriod: 45,
        contractValue: 7800000,
        currency: 'INR',
        paymentTerms: 'Quarterly Advance Net 30',
      });
    }, 1200);
  };

  const handleConfirmOcrSave = () => {
    if (!uploadedFileTemp) return;

    const newDoc: ContractDocument = {
      id: `doc-${Date.now()}`,
      fileName: uploadedFileTemp.name,
      fileType: uploadedFileTemp.type || 'application/pdf',
      fileSize: `${(uploadedFileTemp.size / (1024 * 1024)).toFixed(1)} MB`,
      category: 'Master Agreement',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Anuj Raja',
      version: 'v1.0',
      status: 'Verified',
      extractedFields: extractedData,
      contractName: extractedData?.contractName,
    };

    onUploadDocument(newDoc);
    setIsUploadModalOpen(false);
    setExtractedData(null);
    setUploadedFileTemp(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Repository &amp; OCR Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            Your Documents, Organized.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Keep executed agreements, addendums, and invoices securely archived with automated OCR
            key-term extraction.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#243029] hover:bg-[#1A231E] text-white shadow-sm transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Agreement</span>
        </button>
      </div>

      {/* 2. Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by file name or agreement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-[#243029]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
            className="px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/60 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Documents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#243029]/8 text-[#243029] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-stone-900 truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate">
                    {doc.contractName || 'General Document'}
                  </p>
                </div>
              </div>

              {doc.extractedFields && (
                <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Extracted Value:</span>
                    <strong className="text-stone-900">
                      {formatCurrency(doc.extractedFields.contractValue || 0, doc.extractedFields.currency || 'INR')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Renewal Target:</span>
                    <span className="text-stone-800">{formatDate(doc.extractedFields.renewalDate || '')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>{doc.fileSize} • {doc.version}</span>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded hover:bg-stone-100 text-stone-600"
                  title="Preview document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-stone-100 text-stone-600"
                  title="Download copy"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Upload & OCR Extraction Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI OCR Extraction Engine</span>
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  Upload Contract Document
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setExtractedData(null);
                  setUploadedFileTemp(null);
                }}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag and Drop Zone */}
            {!extractedData && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  dragOver ? 'border-[#243029] bg-stone-50' : 'border-stone-300 hover:border-stone-400'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-stone-800">
                  Drag and drop your contract PDF, DOCX, or scanned image
                </h4>
                <p className="text-xs text-stone-500 mt-1">Supports PDF, DOCX, PNG up to 25MB</p>
                <label className="mt-4 inline-block px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#243029] text-white hover:bg-[#1A231E] transition-colors cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>

                {isExtracting && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Extracting renewal clauses, counterparty, and financial terms...</span>
                  </div>
                )}
              </div>
            )}

            {/* OCR Confirmation Screen (Never overwrite without user confirmation) */}
            {extractedData && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>OCR Extraction Preview (Please Confirm Before Saving)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    The engine extracted the following attributes from{' '}
                    <strong>{uploadedFileTemp?.name}</strong>. Verify accuracy before committing to
                    the database.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Contract Name</span>
                    <input
                      type="text"
                      value={extractedData.contractName}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, contractName: e.target.value })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Counterparty</span>
                    <input
                      type="text"
                      value={extractedData.vendorName}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, vendorName: e.target.value })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Renewal Date</span>
                    <input
                      type="date"
                      value={extractedData.renewalDate}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, renewalDate: e.target.value })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Notice Period</span>
                    <input
                      type="number"
                      value={extractedData.noticePeriod}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          noticePeriod: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Contract Value</span>
                    <input
                      type="number"
                      value={extractedData.contractValue}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          contractValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-400 uppercase">Payment Terms</span>
                    <input
                      type="text"
                      value={extractedData.paymentTerms}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, paymentTerms: e.target.value })
                      }
                      className="w-full font-semibold text-stone-900 bg-transparent border-b border-stone-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setExtractedData(null)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Re-upload
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmOcrSave}
                    className="px-6 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
                  >
                    Confirm &amp; Archive Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
