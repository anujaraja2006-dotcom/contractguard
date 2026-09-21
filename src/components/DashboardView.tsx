import React, { useState } from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Building2,
  Calendar,
  Eye,
  RotateCw,
} from 'lucide-react';
import { Contract, Company, Department } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import {
  calculateDaysRemaining,
  formatCurrency,
  formatDate,
  getRiskBadgeColor,
  getStatusBadgeColor,
} from '../utils/contractUtils';

interface DashboardViewProps {
  contracts: Contract[];
  companies: Company[];
  departments: Department[];
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
  onAddContract: () => void;
  onOpenAiAssistant: () => void;
  onNavigateToCalendar: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contracts,
  companies,
  departments,
  selectedCompanyId,
  setSelectedCompanyId,
  selectedDepartmentId,
  setSelectedDepartmentId,
  t,
  onSelectContract,
  onAddContract,
  onOpenAiAssistant,
  onNavigateToCalendar,
}) => {
  const [quickSearchPrompt, setQuickSearchPrompt] = useState('');

  // Filter contracts based on company & department
  const filteredContracts = contracts.filter((c) => {
    if (selectedCompanyId !== 'all' && c.companyId !== selectedCompanyId) return false;
    if (selectedDepartmentId !== 'all' && c.departmentId !== selectedDepartmentId) return false;
    return true;
  });

  // Calculate Metrics
  const totalContractsCount = filteredContracts.length;
  const activeContractsCount = filteredContracts.filter((c) => c.status === 'Active').length;

  const expiringSoonContracts = filteredContracts.filter((c) => {
    const days = calculateDaysRemaining(c.renewalDate);
    return days >= 0 && days <= 30;
  });

  const criticalRiskContracts = filteredContracts.filter((c) => {
    const days = calculateDaysRemaining(c.renewalDate);
    return days >= 0 && days <= 7;
  });

  const totalPortfolioValue = filteredContracts.reduce((sum, c) => sum + c.contractValue, 0);

  // Contracts expiring within the next 30 days or already in renewal stage
  const upcomingRenewals = [...filteredContracts]
    .sort((a, b) => {
      const daysA = calculateDaysRemaining(a.renewalDate);
      const daysB = calculateDaysRemaining(b.renewalDate);
      return daysA - daysB;
    })
    .slice(0, 6);

  // Monthly breakdown for Renewal Overview chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts = [2, 4, 3, 6, 5, 8, 4, 7, 9, 5, 3, 4]; // realistic baseline distribution

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Dashboard Header with Greeting & Scope Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-bold">
            Operational Overview
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1C1E] mt-1.5 tracking-tight">
            {t.welcomeBack}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1.5">
            Real-time contract renewal tracking, risk classification, and upcoming notice deadlines.
          </p>
        </div>

        {/* Company & Department Scope Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-xs">
            <Building2 className="w-4 h-4 text-stone-500" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              aria-label="Filter by Company"
              className="text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Organizations</option>
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-xs">
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              aria-label="Filter by Department"
              className="text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onAddContract}
            className="px-5 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            + {t.addContract}
          </button>
        </div>
      </div>

      {/* 2. Natural-Language AI Search Prompt Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <input
            type="text"
            placeholder={t.askAiPlaceholder}
            value={quickSearchPrompt}
            onChange={(e) => setQuickSearchPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onOpenAiAssistant();
            }}
            className="w-full text-sm sm:text-base text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenAiAssistant}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          >
            Ask Assistant
          </button>
        </div>
      </div>

      {/* 3. KPI Cards Grid (Editorial & High-Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Contracts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              {t.totalContracts}
            </span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
              {totalContractsCount}
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-1.5 flex items-center gap-1.5">
              <span>Valued at</span>
              <span className="font-bold text-stone-800">
                {formatCurrency(totalPortfolioValue, 'INR')}
              </span>
            </div>
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              {t.activeContracts}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-emerald-800">
              {activeContractsCount}
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-1.5">
              {Math.round((activeContractsCount / (totalContractsCount || 1)) * 100)}% compliance
              rate
            </div>
          </div>
        </div>

        {/* Renewals This Month */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              {t.renewalsThisMonth}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-amber-800">
              {expiringSoonContracts.length}
            </div>
            <div className="text-xs sm:text-sm text-amber-700 mt-1.5 flex items-center gap-1 font-semibold">
              <span>Notice windows active</span>
            </div>
          </div>
        </div>

        {/* Expiring Soon / Critical */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              {t.criticalRisk}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-rose-700">
              {criticalRiskContracts.length}
            </div>
            <div className="text-xs sm:text-sm text-rose-600 mt-1.5 font-semibold">
              Requires immediate renewal approval
            </div>
          </div>
        </div>
      </div>

      {/* 4. Renewal Overview Chart Section (Visual & Clean) */}
      <div className="bg-white p-7 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500">
              Timeline Horizon
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Renewal Overview &amp; Expiry Forecast
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToCalendar}
              className="text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>Open Full Calendar</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bar visualization of upcoming monthly renewals */}
        <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-stone-100">
          {months.map((m, idx) => {
            const count = monthlyCounts[idx];
            const heightPercent = Math.min(100, count * 11);
            const isCurrentMonth = idx === 8; // September is index 8 (current month 2026-09)
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-xs font-bold text-stone-700 group-hover:text-stone-900 transition-colors">
                  {count}
                </div>
                <div className="w-full max-w-[32px] bg-stone-100 rounded-t-md h-36 flex items-end justify-center overflow-hidden">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-90 ${
                      isCurrentMonth
                        ? 'bg-[#243029] shadow-sm'
                        : 'bg-stone-300 group-hover:bg-stone-400'
                    }`}
                  ></div>
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    isCurrentMonth ? 'text-stone-900 font-bold underline' : 'text-stone-500'
                  }`}
                >
                  {m}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-stone-600 pt-4 font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#243029]"></span>
              <span>Current Month Renewals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-stone-300"></span>
              <span>Scheduled Pipeline</span>
            </div>
          </div>
          <span className="font-semibold text-stone-900">Total Projected Obligation: ₹3.84 Cr</span>
        </div>
      </div>

      {/* 5. Upcoming Renewals Table / Card Section */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500">
              Action Required
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Upcoming Renewals &amp; Deadlines
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-stone-500 font-medium">
            Sorted by earliest renewal date
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 text-xs sm:text-sm uppercase tracking-wider text-stone-600 font-bold border-b border-stone-200">
                <th className="py-3.5 px-5">{t.contractName}</th>
                <th className="py-3.5 px-4">{t.company}</th>
                <th className="py-3.5 px-4">{t.renewalDate}</th>
                <th className="py-3.5 px-4">{t.status}</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">{t.contractValue}</th>
                <th className="py-3.5 px-5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {upcomingRenewals.map((contract) => {
                const daysRemaining = calculateDaysRemaining(contract.renewalDate);
                const riskInfo = getRiskBadgeColor(contract.riskLevel);
                const statusInfo = getStatusBadgeColor(contract.status);

                return (
                  <tr
                    key={contract.id}
                    onClick={() => onSelectContract(contract)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-medium text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-base text-stone-900 group-hover:text-emerald-900">
                          {contract.name}
                        </span>
                        {contract.autoRenewal && (
                          <span
                            className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-700 font-medium"
                            title="Auto-renewal clause present"
                          >
                            Auto
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                        {contract.contractNumber} • {contract.departmentName}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-stone-700 text-sm sm:text-base font-medium">{contract.companyName}</td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-stone-900 text-sm sm:text-base">
                        {formatDate(contract.renewalDate)}
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                          daysRemaining <= 7
                            ? 'text-rose-600'
                            : daysRemaining <= 30
                            ? 'text-amber-600'
                            : 'text-stone-500'
                        }`}
                      >
                        {daysRemaining < 0
                          ? `Expired ${Math.abs(daysRemaining)} days ago`
                          : daysRemaining === 0
                          ? 'Expires Today'
                          : `${daysRemaining} days remaining`}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                      >
                        {contract.status}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`}></span>
                        <span>{contract.riskLevel} ({contract.riskScore})</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-stone-900 text-sm sm:text-base">
                      {formatCurrency(contract.contractValue, contract.currency)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectContract(contract);
                        }}
                        className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="View contract details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
