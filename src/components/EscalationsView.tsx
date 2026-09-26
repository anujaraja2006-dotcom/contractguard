import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Contract, Reminder } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { formatCurrency, formatDate, calculateDaysRemaining } from '../utils/contractUtils';

interface EscalationsViewProps {
  contracts: Contract[];
  reminders: Reminder[];
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
  onNavigateToCalendar: () => void;
  onTriggerEscalation: (contract: Contract) => void;
}

export const EscalationsView: React.FC<EscalationsViewProps> = ({
  contracts,
  reminders,
  onSelectContract,
  onNavigateToCalendar,
  onTriggerEscalation,
}) => {
  const [escalationStatusFilter, setEscalationStatusFilter] = useState<'all' | 'critical' | 'active'>('all');

  // Contracts requiring escalation or in critical risk
  const escalationCandidates = contracts.filter((c) => {
    const days = calculateDaysRemaining(c.renewalDate);
    const isCritical = c.riskLevel === 'Critical' || c.status === 'Expiring Soon' || days <= 15;
    if (escalationStatusFilter === 'critical') return c.riskLevel === 'Critical';
    if (escalationStatusFilter === 'active') return c.status === 'Active' && days <= 30;
    return isCritical;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2DDD6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
              High-Risk Management
            </span>
            <span className="text-[11px] text-slate-500 font-medium">B2B SaaS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1528] mt-1 tracking-tight">
            Escalation Workflows
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor contracts approaching expiry without recorded action, trigger manager alerts, and enforce corporate governance.
          </p>
        </div>

        <button
          onClick={onNavigateToCalendar}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0B1528] bg-white border border-[#D5CEC5] hover:bg-stone-50 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>View on Renewal Calendar →</span>
        </button>
      </div>

      {/* Escalation Workflow Diagram Card */}
      <div className="bg-[#0B1528] text-white p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
            Automated Escalation Protocol
          </span>
          <span className="text-[10px] font-mono text-slate-400">Rule Engine: Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 font-bold">Step 1</span>
            <div className="font-bold text-white mt-1">Contract Approaching Expiry</div>
            <div className="text-[11px] text-slate-400 mt-0.5">30-day notice window detected</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 font-bold">Step 2</span>
            <div className="font-bold text-white mt-1">Reminder Sent</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Owner &amp; procurement alerted</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 font-bold">Step 3</span>
            <div className="font-bold text-white mt-1">No Action Taken</div>
            <div className="text-[11px] text-slate-400 mt-0.5">48-hour inactivity threshold</div>
          </div>
          <div className="p-3 rounded-xl bg-[#C84B31]/30 border border-[#C84B31]/60">
            <span className="text-[10px] font-mono text-[#E06D53] font-bold">Step 4</span>
            <div className="font-bold text-white mt-1">Escalation Created</div>
            <div className="text-[11px] text-amber-200 mt-0.5">Appears on Renewal Calendar</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800">
            <span className="text-[10px] font-mono text-rose-400 font-bold">Step 5</span>
            <div className="font-bold text-white mt-1">Manager Notified</div>
            <div className="text-[11px] text-rose-200 mt-0.5">VP approval / intervention</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEscalationStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            escalationStatusFilter === 'all'
              ? 'bg-[#0B1528] text-white'
              : 'bg-white border border-[#D5CEC5] text-slate-700 hover:bg-stone-50'
          }`}
        >
          All Escalations ({contracts.filter((c) => c.riskLevel === 'Critical' || calculateDaysRemaining(c.renewalDate) <= 15).length})
        </button>
        <button
          onClick={() => setEscalationStatusFilter('critical')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            escalationStatusFilter === 'critical'
              ? 'bg-rose-700 text-white'
              : 'bg-white border border-[#D5CEC5] text-slate-700 hover:bg-stone-50'
          }`}
        >
          Critical Only ({contracts.filter((c) => c.riskLevel === 'Critical').length})
        </button>
      </div>

      {/* Escalation Candidates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {escalationCandidates.map((contract) => {
          const daysRemaining = calculateDaysRemaining(contract.renewalDate);
          return (
            <div
              key={contract.id}
              className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3 hover:border-rose-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      ⚠ Escalation Required
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {contract.contractNumber}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0B1528] mt-1">
                    {contract.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">{contract.companyName}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {formatCurrency(contract.contractValue, contract.currency)}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-rose-600">
                    {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days remaining`}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE8E1] text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{contract.departmentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contract Owner:</span>
                  <span className="font-semibold text-slate-800">{contract.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Notice Expiry:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatDate(contract.endDate)}
                  </span>
                </div>
              </div>

              {contract.notes && (
                <p className="text-xs text-slate-600 italic">"{contract.notes}"</p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectContract(contract)}
                  className="px-3 py-1.5 text-xs font-bold text-[#0B1528] hover:underline cursor-pointer"
                >
                  View Details
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerEscalation(contract)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Notify Manager</span>
                  </button>
                  <button
                    onClick={onNavigateToCalendar}
                    className="px-3 py-1.5 text-xs font-bold text-[#0B1528] bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                  >
                    Open on Calendar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
