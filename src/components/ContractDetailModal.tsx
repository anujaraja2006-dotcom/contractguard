import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CreditCard,
  MessageSquare,
  Workflow,
  CheckCircle2,
  Bell,
  ArrowRight,
  Send,
  Edit2,
  RotateCw,
} from 'lucide-react';
import { Contract, CommentItem, ContractDocument, RenewalStage } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import {
  calculateDaysRemaining,
  calculateNoticeDeadline,
  formatCurrency,
  formatDate,
  getRiskBadgeColor,
  getStatusBadgeColor,
} from '../utils/contractUtils';

interface ContractDetailModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  onEdit: (contract: Contract) => void;
  onAdvanceWorkflow: (contractId: string, nextStage: RenewalStage) => void;
  onQuickRenew: (contract: Contract) => void;
  documents: ContractDocument[];
  comments: CommentItem[];
  onAddComment: (contractId: string, text: string) => void;
  onOpenSetReminder: (contract: Contract) => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  contract,
  isOpen,
  onClose,
  t,
  onEdit,
  onAdvanceWorkflow,
  onQuickRenew,
  documents,
  comments,
  onAddComment,
  onOpenSetReminder,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'dates' | 'documents' | 'payments' | 'workflow' | 'comments'
  >('overview');
  const [commentInput, setCommentInput] = useState('');

  if (!isOpen || !contract) return null;

  const daysRemaining = calculateDaysRemaining(contract.renewalDate);
  const noticeDeadline = calculateNoticeDeadline(contract.endDate, contract.noticePeriodDays);
  const noticeDaysRemaining = calculateDaysRemaining(noticeDeadline);
  const riskInfo = getRiskBadgeColor(contract.riskLevel);
  const statusInfo = getStatusBadgeColor(contract.status);

  const contractDocs = documents.filter((d) => d.contractId === contract.id);
  const contractComments = comments.filter((c) => c.contractId === contract.id);

  const stages: RenewalStage[] = [
    'Review',
    'Negotiation',
    'Approval',
    'Renewal',
    'Completed',
  ];
  const currentStageIndex = stages.indexOf(contract.renewalStage || 'Review');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(contract.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                {contract.contractNumber}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
              >
                {contract.status}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.dot}`}></span>
                <span>Risk: {contract.riskLevel} ({contract.riskScore}/100)</span>
              </span>
              {contract.autoRenewal && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                  Auto-Renewal Enabled
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1C1E] leading-tight">
              {contract.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-stone-400" />
              <span>{contract.companyName}</span>
              <span>•</span>
              <span>{contract.departmentName}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenSetReminder(contract)}
              className="px-3.5 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.setReminder}</span>
            </button>
            <button
              onClick={() => onEdit(contract)}
              className="px-3.5 py-2 rounded-lg bg-[#243029] hover:bg-[#1A231E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.editContract}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prominent Renewal Timeline Horizon */}
        <div className="px-6 sm:px-8 py-4 bg-[#F5F2ED] border-b border-stone-200/90">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            <span>Contract Renewal Horizon</span>
            <span
              className={`font-bold ${
                daysRemaining <= 7
                  ? 'text-rose-700'
                  : daysRemaining <= 30
                  ? 'text-amber-700'
                  : 'text-stone-700'
              }`}
            >
              {daysRemaining < 0
                ? 'Expired'
                : `${daysRemaining} Days Until Renewal`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* Start Date */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-medium">Start Date</span>
              <div className="font-semibold text-stone-900 mt-0.5">
                {formatDate(contract.startDate)}
              </div>
            </div>

            {/* Notice Deadline */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <span className="text-[10px] text-amber-700 uppercase font-bold">
                Notice Cutoff ({contract.noticePeriodDays}d)
              </span>
              <div className="font-semibold text-amber-900 mt-0.5">
                {formatDate(noticeDeadline)}
              </div>
            </div>

            {/* Expiry Date */}
            <div className="p-2.5 rounded-lg bg-white border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-medium">End Date</span>
              <div className="font-semibold text-stone-900 mt-0.5">
                {formatDate(contract.endDate)}
              </div>
            </div>

            {/* Renewal Target Date */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-bold">
                Renewal Date
              </span>
              <div className="font-bold text-emerald-950 mt-0.5">
                {formatDate(contract.renewalDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="px-6 sm:px-8 border-b border-stone-200 bg-white flex items-center space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'dates', label: 'Important Dates & Risk' },
            { id: 'documents', label: `Documents (${contractDocs.length})` },
            { id: 'payments', label: 'Payments' },
            { id: 'workflow', label: 'Renewal Pipeline' },
            { id: 'comments', label: `Audit & Notes (${contractComments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 text-xs font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#243029] text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Core Overview */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
                  Agreement Details
                </h3>

                <div>
                  <span className="text-[11px] text-stone-400 uppercase font-medium">Description</span>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">{contract.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Contract Type</span>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">{contract.type}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Contract Owner</span>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">{contract.ownerName}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Department</span>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">{contract.departmentName}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Total Value</span>
                    <div className="text-xs font-bold text-stone-900 mt-0.5">
                      {formatCurrency(contract.contractValue, contract.currency)}
                    </div>
                  </div>
                </div>

                {contract.customFields && contract.customFields.length > 0 && (
                  <div className="pt-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Custom Fields</span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {contract.customFields.map((cf) => (
                        <div key={cf.id} className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                          <div className="text-[10px] text-stone-500 font-medium">{cf.label}</div>
                          <div className="text-xs font-semibold text-stone-900 mt-0.5 truncate">{cf.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Counterparty & Contact */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-3">
                  <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
                    Counterparty Contact
                  </h3>
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Company Name</span>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">{contract.companyName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] text-stone-400 uppercase font-medium">Contact Person</span>
                      <div className="text-xs font-semibold text-stone-900 mt-0.5">{contract.contactPerson}</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 uppercase font-medium">Phone</span>
                      <div className="text-xs text-stone-800 mt-0.5">{contract.contactPhone}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-medium">Email</span>
                    <div className="text-xs text-emerald-800 font-medium mt-0.5">{contract.contactEmail}</div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Special Notes &amp; Action Items</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">{contract.notes}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Risk Classification &amp; Deadline Calculation
                </h3>
                <p className="text-xs text-stone-600">
                  ContractGuard continuously evaluates the remaining days, notice requirement, and
                  overall financial weight to generate an immutable risk index.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] text-stone-500 uppercase font-medium">Days Left</span>
                    <div className="font-serif text-3xl font-bold text-stone-900 mt-1">
                      {daysRemaining} Days
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">Relative to system date</p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] text-stone-500 uppercase font-medium">Notice Deadline</span>
                    <div className="font-serif text-3xl font-bold text-amber-800 mt-1">
                      {noticeDaysRemaining < 0 ? 'Passed' : `${noticeDaysRemaining}d`}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{formatDate(noticeDeadline)}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[11px] text-stone-500 uppercase font-medium">Risk Score</span>
                    <div className="font-serif text-3xl font-bold text-rose-700 mt-1">
                      {contract.riskScore}/100
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{contract.riskLevel} tier</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900">Attached Documents</h3>
                <span className="text-xs text-stone-500">Encrypted &amp; Stored securely</span>
              </div>

              {contractDocs.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-xs">
                  No verified contract documents attached yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {contractDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                          <FileText className="w-5 h-5 text-emerald-800" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-900">{doc.fileName}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {doc.fileSize} • Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          {doc.status}
                        </span>
                        <button className="px-3 py-1 text-xs font-medium rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors">
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">Payment &amp; Financial Terms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-400 uppercase">Contract Value</span>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {formatCurrency(contract.contractValue, contract.currency)}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-400 uppercase">Frequency</span>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {contract.paymentFrequency}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-400 uppercase">Paid Amount</span>
                  <div className="text-sm font-semibold text-emerald-700 mt-0.5">
                    {formatCurrency(contract.paidAmount || 0, contract.currency)}
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-[10px] text-stone-400 uppercase">Outstanding</span>
                  <div className="text-sm font-semibold text-rose-700 mt-0.5">
                    {formatCurrency(contract.outstandingAmount || 0, contract.currency)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-stone-200">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
                  Renewal Stage Progression
                </h3>

                {/* Phased Pipeline Progress */}
                <div className="flex items-center justify-between relative mb-6">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage} className="flex-1 flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-[#243029] text-white ring-4 ring-emerald-100'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium ${
                            isCurrent ? 'text-stone-900 font-bold' : 'text-stone-400'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-500">
                    Current stage: <strong className="text-stone-900">{contract.renewalStage || 'Review'}</strong>
                  </span>
                  {currentStageIndex < stages.length - 1 && (
                    <button
                      onClick={() =>
                        onAdvanceWorkflow(contract.id, stages[currentStageIndex + 1])
                      }
                      className="px-4 py-2 bg-[#243029] hover:bg-[#1A231E] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Move to {stages[currentStageIndex + 1]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Collaboration &amp; Audit Comments
              </h3>

              <div className="space-y-3">
                {contractComments.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">{c.authorName}</span>
                      <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-stone-400">{c.authorRole}</span>
                    <p className="text-xs text-stone-700 mt-2 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add an internal note or mention legal team..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#243029] text-white rounded-lg text-xs font-medium hover:bg-[#1A231E] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => onQuickRenew(contract)}
            className="px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Mark as Renewed</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
