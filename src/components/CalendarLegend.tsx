import React, { useState } from 'react';
import {
  Tag,
  ShieldAlert,
  RotateCw,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  CheckCircle2,
  Info,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Contract, RiskLevel, CalendarActivityEvent } from '../types';
import { TranslationDictionary } from '../i18n/translations';

export interface LegendFilter {
  category: 'type' | 'risk' | 'status' | 'marker';
  value: string;
  label: string;
  colorClass: string;
}

interface CalendarLegendProps {
  contracts: Contract[];
  events: CalendarActivityEvent[];
  t?: TranslationDictionary;
  activeFilter?: LegendFilter | null;
  onSelectFilter?: (filter: LegendFilter | null) => void;
  className?: string;
}

export interface LegendItemDef {
  id: string;
  label: string;
  shortLabel?: string;
  dotColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
  matchValues: string[];
}

export const CONTRACT_TYPE_LEGEND: LegendItemDef[] = [
  {
    id: 'type-vendor',
    label: 'Vendor Agreement',
    shortLabel: 'Vendor',
    dotColor: 'bg-indigo-500',
    bgClass: 'bg-indigo-50/90',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-800',
    description: 'Supplier, procurement, & supply chain contracts',
    matchValues: ['Vendor Agreement', 'Vendor'],
  },
  {
    id: 'type-software',
    label: 'Software License (SaaS)',
    shortLabel: 'Software',
    dotColor: 'bg-sky-500',
    bgClass: 'bg-sky-50/90',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-800',
    description: 'Cloud software, enterprise tooling & SaaS subscriptions',
    matchValues: ['Software License', 'Software'],
  },
  {
    id: 'type-service',
    label: 'Service Agreement (SLA)',
    shortLabel: 'Service',
    dotColor: 'bg-emerald-500',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    description: 'Professional consulting, managed IT, & service level terms',
    matchValues: ['Service Agreement', 'Service'],
  },
  {
    id: 'type-lease',
    label: 'Lease & Facilities',
    shortLabel: 'Lease',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    description: 'Office leases, warehouse spaces & hardware rental',
    matchValues: ['Lease/Rental Agreement', 'Lease'],
  },
  {
    id: 'type-maintenance',
    label: 'Maintenance Agreement',
    shortLabel: 'Maintenance',
    dotColor: 'bg-blue-500',
    bgClass: 'bg-blue-50/90',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-800',
    description: 'Facility maintenance, machinery upkeep, & continuous SLA',
    matchValues: ['Maintenance Agreement', 'Maintenance'],
  },
  {
    id: 'type-nda',
    label: 'Non-Disclosure (NDA)',
    shortLabel: 'NDA',
    dotColor: 'bg-purple-500',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-800',
    description: 'Mutual non-disclosure & intellectual property protection',
    matchValues: ['Non-Disclosure Agreement (NDA)', 'NDA'],
  },
  {
    id: 'type-insurance',
    label: 'Insurance & Coverage',
    shortLabel: 'Insurance',
    dotColor: 'bg-teal-500',
    bgClass: 'bg-teal-50/90',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-800',
    description: 'Corporate indemnity, liability & asset protection policies',
    matchValues: ['Insurance Agreement', 'Insurance'],
  },
  {
    id: 'type-partnership',
    label: 'Partnership & Client',
    shortLabel: 'Partner / Client',
    dotColor: 'bg-rose-500',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    description: 'Strategic alliances, joint ventures, & customer contracts',
    matchValues: ['Partnership Agreement', 'Customer Agreement', 'Client'],
  },
];

export const RISK_LEVEL_LEGEND: LegendItemDef[] = [
  {
    id: 'risk-critical',
    label: 'Critical Risk (80-100)',
    shortLabel: 'Critical',
    dotColor: 'bg-rose-600 ring-2 ring-rose-300',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    description: 'Immediate executive action required; <15 days or critical alert',
    matchValues: ['Critical'],
  },
  {
    id: 'risk-high',
    label: 'High Risk (60-79)',
    shortLabel: 'High',
    dotColor: 'bg-orange-500 ring-2 ring-orange-300',
    bgClass: 'bg-orange-50/90',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-800',
    description: 'Notice period closing soon; active renegotiation required',
    matchValues: ['High'],
  },
  {
    id: 'risk-medium',
    label: 'Medium Risk (35-59)',
    shortLabel: 'Medium',
    dotColor: 'bg-amber-500 ring-2 ring-amber-300',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    description: 'Standard review window; monitor renewal terms & pricing',
    matchValues: ['Medium'],
  },
  {
    id: 'risk-safe',
    label: 'Safe Tier (0-34)',
    shortLabel: 'Safe',
    dotColor: 'bg-emerald-500 ring-2 ring-emerald-300',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    description: 'Active & compliant; healthy timeline or auto-renewal active',
    matchValues: ['Safe'],
  },
];

export const RENEWAL_STATUS_LEGEND: LegendItemDef[] = [
  {
    id: 'status-active',
    label: 'Active & Compliant',
    shortLabel: 'Active',
    dotColor: 'bg-emerald-500',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    description: 'Agreement is fully in force with no pending expiration actions',
    matchValues: ['Active', 'Safe'],
  },
  {
    id: 'status-notice',
    label: 'Notice Period Deadline',
    shortLabel: 'Notice Period',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    description: 'Mandatory notice window; deadline to notify counterparty',
    matchValues: ['Notice Period', 'notice_period'],
  },
  {
    id: 'status-review',
    label: 'In Review / Negotiation',
    shortLabel: 'In Review',
    dotColor: 'bg-purple-500',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-800',
    description: 'Internal stakeholder review, vendor renegotiation or legal audit',
    matchValues: ['In Review', 'Under Review', 'Negotiation', 'Review', 'Pending Approval'],
  },
  {
    id: 'status-expiring',
    label: 'Expiring Soon / Escalation',
    shortLabel: 'Expiring Soon',
    dotColor: 'bg-rose-600',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    description: 'Under 30 days to contract termination or escalated milestone',
    matchValues: ['Expiring Soon', 'Critical Escalation', 'expiry', 'escalation'],
  },
  {
    id: 'status-scheduled',
    label: 'Renewal Scheduled',
    shortLabel: 'Scheduled',
    dotColor: 'bg-blue-500',
    bgClass: 'bg-blue-50/90',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-800',
    description: 'Follow-up or reminder event scheduled on calendar timeline',
    matchValues: ['Scheduled', 'reminder_30', 'reminder_15', 'reminder_7', 'meeting'],
  },
  {
    id: 'status-renewed',
    label: 'Renewed / Extended',
    shortLabel: 'Renewed',
    dotColor: 'bg-teal-500',
    bgClass: 'bg-teal-50/90',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-800',
    description: 'Extension completed; new contract terms approved & active',
    matchValues: ['Renewed', 'Extended', 'renewal'],
  },
  {
    id: 'status-expired',
    label: 'Expired / Action Needed',
    shortLabel: 'Expired',
    dotColor: 'bg-stone-500',
    bgClass: 'bg-stone-100',
    borderClass: 'border-stone-300',
    textClass: 'text-stone-700',
    description: 'Past renewal cut-off; archived or requiring retroactive agreement',
    matchValues: ['Expired', 'Expired Action Needed', 'Archived'],
  },
];

export const CalendarLegend: React.FC<CalendarLegendProps> = ({
  contracts,
  events,
  t,
  activeFilter,
  onSelectFilter,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'types' | 'risk' | 'status'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Helper to count how many contracts or events match a definition
  const getTypeCount = (item: LegendItemDef) => {
    return contracts.filter((c) =>
      item.matchValues.some((v) => c.type?.toLowerCase().includes(v.toLowerCase()))
    ).length;
  };

  const getRiskCount = (item: LegendItemDef) => {
    return contracts.filter((c) =>
      item.matchValues.some((v) => c.riskLevel?.toLowerCase() === v.toLowerCase())
    ).length;
  };

  const getStatusCount = (item: LegendItemDef) => {
    const fromContracts = contracts.filter((c) =>
      item.matchValues.some(
        (v) =>
          c.status?.toLowerCase() === v.toLowerCase() ||
          c.renewalStatus?.toLowerCase() === v.toLowerCase()
      )
    ).length;
    return fromContracts;
  };

  const handleItemClick = (category: 'type' | 'risk' | 'status', item: LegendItemDef) => {
    if (!onSelectFilter) return;

    if (activeFilter?.category === category && activeFilter?.value === item.id) {
      // Toggle off
      onSelectFilter(null);
    } else {
      onSelectFilter({
        category,
        value: item.id,
        label: item.shortLabel || item.label,
        colorClass: item.dotColor.split(' ')[0],
      });
    }
  };

  const isItemSelected = (category: 'type' | 'risk' | 'status', item: LegendItemDef) => {
    return activeFilter?.category === category && activeFilter?.value === item.id;
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#EDE8E1] shadow-2xs transition-all overflow-hidden ${className}`}
      data-testid="calendar-color-legend"
    >
      {/* Header Bar */}
      <div className="px-4 py-3 bg-[#FAF8F5]/80 border-b border-[#EDE8E1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B1528] text-white flex items-center justify-center shadow-2xs shrink-0">
            <Layers className="w-4 h-4 text-[#C84B31]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-[#0B1528] tracking-tight">
                Calendar Color-Coded Legend
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D5CEC5] text-slate-600 font-semibold hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Indicator
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Distinguish contract types, risk tiers, and renewal statuses at a glance. Click any badge to filter timeline.
            </p>
          </div>
        </div>

        {/* Right side controls: Tabs, Filter clear, and Expand/Collapse */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active Filter Pill if one is applied */}
          {activeFilter && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1528] text-white text-xs font-mono shadow-xs animate-in fade-in">
              <span className={`w-2 h-2 rounded-full ${activeFilter.colorClass}`} />
              <span className="text-slate-300 text-[10px] uppercase font-bold">Filtered:</span>
              <span className="font-bold">{activeFilter.label}</span>
              <button
                onClick={() => onSelectFilter?.(null)}
                className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors"
                title="Clear legend filter"
                aria-label="Clear legend filter"
              >
                <X className="w-3 h-3 text-slate-300 hover:text-white" />
              </button>
            </div>
          )}

          {/* Dimension Tabs (All, Types, Risk, Status) */}
          <div className="flex items-center bg-white border border-[#D5CEC5] rounded-lg p-0.5 text-xs font-semibold shadow-2xs">
            {(
              [
                { id: 'all', label: 'All Legends' },
                { id: 'types', label: 'Contract Types' },
                { id: 'risk', label: 'Risk Levels' },
                { id: 'status', label: 'Renewal Status' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-[#0B1528] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-[#D5CEC5] bg-white hover:bg-stone-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse legend' : 'Expand legend'}
            aria-label={isExpanded ? 'Collapse legend' : 'Expand legend'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Legend Body */}
      {isExpanded ? (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* COLUMN 1: CONTRACT TYPES */}
            {(activeTab === 'all' || activeTab === 'types') && (
              <div
                className={`space-y-2 rounded-xl p-3 border transition-all ${
                  activeTab === 'types'
                    ? 'col-span-full bg-[#FAF8F5]/40 border-indigo-200'
                    : 'bg-[#FAF8F5]/40 border-[#EDE8E1]'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE8E1]">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Contract Types
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {CONTRACT_TYPE_LEGEND.length} Categories
                  </span>
                </div>

                <div
                  className={`grid gap-1.5 ${
                    activeTab === 'types'
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1'
                  }`}
                >
                  {CONTRACT_TYPE_LEGEND.map((item) => {
                    const count = getTypeCount(item);
                    const selected = isItemSelected('type', item);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick('type', item)}
                        className={`text-left w-full px-2.5 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                          item.bgClass
                        } ${item.borderClass} ${item.textClass} ${
                          selected
                            ? 'ring-2 ring-[#0B1528] shadow-xs font-bold scale-[1.01]'
                            : 'hover:brightness-95 hover:shadow-2xs'
                        }`}
                        title={`${item.label}: ${item.description}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`}
                          />
                          <span className="font-semibold truncate text-[11px]">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/80 border border-black/5 font-bold shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COLUMN 2: RISK LEVELS */}
            {(activeTab === 'all' || activeTab === 'risk') && (
              <div
                className={`space-y-2 rounded-xl p-3 border transition-all ${
                  activeTab === 'risk'
                    ? 'col-span-full bg-[#FAF8F5]/40 border-rose-200'
                    : 'bg-[#FAF8F5]/40 border-[#EDE8E1]'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE8E1]">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Risk Levels
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    ContractGuard Matrix
                  </span>
                </div>

                <div
                  className={`grid gap-1.5 ${
                    activeTab === 'risk'
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {RISK_LEVEL_LEGEND.map((item) => {
                    const count = getRiskCount(item);
                    const selected = isItemSelected('risk', item);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick('risk', item)}
                        className={`text-left w-full px-2.5 py-2 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1 group cursor-pointer ${
                          item.bgClass
                        } ${item.borderClass} ${item.textClass} ${
                          selected
                            ? 'ring-2 ring-[#0B1528] shadow-xs font-bold scale-[1.01]'
                            : 'hover:brightness-95 hover:shadow-2xs'
                        }`}
                        title={`${item.label}: ${item.description}`}
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full shrink-0 ${item.dotColor}`}
                            />
                            <span className="font-bold text-[12px]">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/90 border border-black/5 font-extrabold shrink-0">
                            {count} Contracts
                          </span>
                        </div>
                        <p className="text-[10px] opacity-80 leading-tight pl-5 line-clamp-1">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COLUMN 3: RENEWAL STATUSES */}
            {(activeTab === 'all' || activeTab === 'status') && (
              <div
                className={`space-y-2 rounded-xl p-3 border transition-all ${
                  activeTab === 'status'
                    ? 'col-span-full bg-[#FAF8F5]/40 border-teal-200'
                    : 'bg-[#FAF8F5]/40 border-[#EDE8E1]'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE8E1]">
                  <div className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Renewal Statuses
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {RENEWAL_STATUS_LEGEND.length} Stages
                  </span>
                </div>

                <div
                  className={`grid gap-1.5 ${
                    activeTab === 'status'
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1'
                  }`}
                >
                  {RENEWAL_STATUS_LEGEND.map((item) => {
                    const count = getStatusCount(item);
                    const selected = isItemSelected('status', item);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick('status', item)}
                        className={`text-left w-full px-2.5 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                          item.bgClass
                        } ${item.borderClass} ${item.textClass} ${
                          selected
                            ? 'ring-2 ring-[#0B1528] shadow-xs font-bold scale-[1.01]'
                            : 'hover:brightness-95 hover:shadow-2xs'
                        }`}
                        title={`${item.label}: ${item.description}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`}
                          />
                          <span className="font-semibold truncate text-[11px]">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/80 border border-black/5 font-bold shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Timeline Dot Markers Micro-Guide */}
          <div className="pt-2 border-t border-[#EDE8E1] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 bg-white px-2 py-1.5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0B1528] uppercase text-[10px] tracking-wider font-mono">
                Calendar Dot Guide:
              </span>
              <div className="flex items-center flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-medium text-slate-700">Red: Expiry Cutoff / Escalation</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-medium text-slate-700">Orange: 30d/15d Reminder</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-700">Yellow: Notice Deadline</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-700">Green: Routine / Active SLA</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700">Blue: Approved Renewal</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-medium text-slate-700">Purple: Review Meeting</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Info className="w-3 h-3 text-[#C84B31]" />
              <span>Click any badge above to highlight or filter events</span>
            </div>
          </div>
        </div>
      ) : (
        /* Compact Strip view when collapsed */
        <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-white">
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Quick Legend:
            </span>

            {/* Risk compact dots */}
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
              <span className="text-[11px] font-semibold text-slate-600">Risk:</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Critical
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 text-[10px] font-bold border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> High
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Safe
              </span>
            </div>

            {/* Types compact sample */}
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 hidden sm:flex">
              <span className="text-[11px] font-semibold text-slate-600">Types:</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Vendor
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-sky-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Software
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Service
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Lease
              </span>
            </div>

            {/* Statuses compact sample */}
            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="text-[11px] font-semibold text-slate-600">Statuses:</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Notice
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> In Review
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Expiring
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className="text-[11px] font-bold text-[#C84B31] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Expand Full Legend</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
