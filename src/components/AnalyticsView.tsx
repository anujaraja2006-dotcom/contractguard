import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Download,
  Calendar,
  Building2,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Contract, Company, Department } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { formatCurrency } from '../utils/contractUtils';

interface AnalyticsViewProps {
  contracts: Contract[];
  companies: Company[];
  departments: Department[];
  t: TranslationDictionary;
  onExportReport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  contracts,
  companies,
  departments,
  t,
  onExportReport,
}) => {
  const [timeRange, setTimeRange] = useState<'Quarter' | 'Year' | 'All'>('Year');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredContracts = contracts.filter((c) => {
    if (selectedDept !== 'all' && c.departmentId !== selectedDept) return false;
    return true;
  });

  const totalContracts = filteredContracts.length;
  const activeContracts = filteredContracts.filter((c) => c.status === 'Active').length;
  const renewedContracts = filteredContracts.filter((c) => c.status === 'Renewed').length;
  const expiredContracts = filteredContracts.filter((c) => c.status === 'Expired').length;
  const renewalRate = Math.round((activeContracts / (totalContracts || 1)) * 100);

  const totalValue = filteredContracts.reduce((sum, c) => sum + c.contractValue, 0);

  // Group by department
  const deptBreakdown = departments.map((d) => {
    const matched = filteredContracts.filter((c) => c.departmentId === d.id);
    const value = matched.reduce((sum, c) => sum + c.contractValue, 0);
    return {
      name: d.name,
      count: matched.length,
      value,
    };
  });

  // Group by risk
  const criticalCount = filteredContracts.filter((c) => c.riskLevel === 'Critical').length;
  const highCount = filteredContracts.filter((c) => c.riskLevel === 'High').length;
  const mediumCount = filteredContracts.filter((c) => c.riskLevel === 'Medium').length;
  const safeCount = filteredContracts.filter((c) => c.riskLevel === 'Safe').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            Understand Your Contract Portfolio.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track renewal ratios, capital exposure, and department-level compliance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            aria-label="Filter by Time Horizon"
            className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-700 font-medium cursor-pointer"
          >
            <option value="Quarter">This Quarter</option>
            <option value="Year">Fiscal Year 2026</option>
            <option value="All">All Time</option>
          </select>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#243029] hover:bg-[#1A231E] text-white shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Renewal Success Rate
          </span>
          <div className="font-serif text-4xl font-bold text-emerald-800 mt-2">
            {renewalRate}%
          </div>
          <p className="text-xs text-stone-500 mt-1">+4.2% vs previous period</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Total Contract Value
          </span>
          <div className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {formatCurrency(totalValue, 'INR')}
          </div>
          <p className="text-xs text-stone-500 mt-1">Across active agreements</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Critical Risk Exposure
          </span>
          <div className="font-serif text-4xl font-bold text-rose-700 mt-2">
            {criticalCount} Contracts
          </div>
          <p className="text-xs text-rose-600 mt-1">Expiring within 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Active Portfolio Size
          </span>
          <div className="font-serif text-4xl font-bold text-stone-900 mt-2">
            {totalContracts}
          </div>
          <p className="text-xs text-stone-500 mt-1">{activeContracts} currently active</p>
        </div>
      </div>

      {/* 3. Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Risk Distribution Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Expiry Risk Distribution
            </h3>
            <span className="text-xs text-stone-400">Total: {totalContracts}</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-rose-700">Critical Risk (0–7 Days)</span>
                <span>{criticalCount} ({Math.round((criticalCount / (totalContracts || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div
                  style={{ width: `${(criticalCount / (totalContracts || 1)) * 100}%` }}
                  className="h-full bg-rose-500 rounded-full"
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700">High Risk (8–30 Days)</span>
                <span>{highCount} ({Math.round((highCount / (totalContracts || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div
                  style={{ width: `${(highCount / (totalContracts || 1)) * 100}%` }}
                  className="h-full bg-amber-500 rounded-full"
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-yellow-700">Medium Risk (31–90 Days)</span>
                <span>{mediumCount} ({Math.round((mediumCount / (totalContracts || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div
                  style={{ width: `${(mediumCount / (totalContracts || 1)) * 100}%` }}
                  className="h-full bg-yellow-400 rounded-full"
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">Safe Horizon (90+ Days)</span>
                <span>{safeCount} ({Math.round((safeCount / (totalContracts || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div
                  style={{ width: `${(safeCount / (totalContracts || 1)) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Capital Allocation */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Department Budget Allocation
            </h3>
            <span className="text-xs text-stone-400">By Contract Value</span>
          </div>

          <div className="space-y-3">
            {deptBreakdown.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-900">{item.name}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{item.count} contracts</div>
                </div>
                <div className="font-bold text-stone-900">
                  {formatCurrency(item.value, 'INR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
