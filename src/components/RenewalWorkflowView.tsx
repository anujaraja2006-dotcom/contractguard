import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  CheckCircle2,
  Clock,
  History,
  Building2,
  Eye,
  RotateCw,
} from 'lucide-react';
import { Contract, RenewalStage, RenewalRecord } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { calculateDaysRemaining, formatCurrency, formatDate } from '../utils/contractUtils';

interface RenewalWorkflowViewProps {
  contracts: Contract[];
  renewalHistory: RenewalRecord[];
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
  onAdvanceWorkflow: (contractId: string, nextStage: RenewalStage) => void;
}

export const RenewalWorkflowView: React.FC<RenewalWorkflowViewProps> = ({
  contracts,
  renewalHistory,
  t,
  onSelectContract,
  onAdvanceWorkflow,
}) => {
  const stages: RenewalStage[] = ['Review', 'Negotiation', 'Approval', 'Renewal', 'Completed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Pipeline Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            Renewal Workflow &amp; Approval Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Systematic progression from internal review and commercial negotiation to formal renewal
            and audit logging.
          </p>
        </div>
      </div>

      {/* 2. Kanban Board of Renewal Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage, idx) => {
          const stageContracts = contracts.filter(
            (c) => (c.renewalStage || 'Review') === stage
          );

          return (
            <div
              key={stage}
              className="bg-[#FAF8F5] rounded-xl border border-stone-200/80 p-4 flex flex-col justify-between min-w-[220px]"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#243029]"></span>
                    <h3 className="font-serif text-base font-bold text-stone-900">{stage}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200/80 font-bold text-stone-700">
                    {stageContracts.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageContracts.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-stone-400">
                      No contracts in this stage
                    </div>
                  ) : (
                    stageContracts.map((c) => {
                      const daysRemaining = calculateDaysRemaining(c.renewalDate);
                      return (
                        <div
                          key={c.id}
                          onClick={() => onSelectContract(c)}
                          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="text-[10px] font-mono text-stone-400">
                            {c.contractNumber}
                          </div>
                          <h4 className="font-semibold text-stone-900 text-xs mt-1 leading-snug group-hover:text-emerald-900">
                            {c.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                            {c.companyName}
                          </p>

                          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                            <span
                              className={`font-semibold ${
                                daysRemaining <= 7 ? 'text-rose-600' : 'text-stone-600'
                              }`}
                            >
                              {daysRemaining}d left
                            </span>
                            <span className="font-bold text-stone-900">
                              {formatCurrency(c.contractValue, c.currency)}
                            </span>
                          </div>

                          {idx < stages.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAdvanceWorkflow(c.id, stages[idx + 1]);
                              }}
                              className="mt-2.5 w-full py-1 rounded bg-stone-100 hover:bg-[#243029] hover:text-white text-stone-700 text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Move to {stages[idx + 1]}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Immutable Renewal History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Immutable Renewal History
              </h3>
              <p className="text-xs text-stone-500">
                Past renewal events, cost adjustments, and executive sign-offs are permanently preserved.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                <th className="py-3 px-5">Contract</th>
                <th className="py-3 px-4">Previous Renewal</th>
                <th className="py-3 px-4">New Renewal</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Cost Shift</th>
                <th className="py-3 px-5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {renewalHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-5 font-semibold text-stone-900">{rec.contractName}</td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {formatDate(rec.previousRenewalDate)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-800">
                    {formatDate(rec.newRenewalDate)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                      {rec.decision}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">{rec.approvedBy}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-stone-900">
                      {formatCurrency(rec.costAfterRenewal, rec.currency)}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Was {formatCurrency(rec.costBeforeRenewal, rec.currency)}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-stone-600 max-w-xs">{rec.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
