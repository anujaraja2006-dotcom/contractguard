import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  Download,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { Contract, ContractType, RiskLevel, ContractStatus } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import {
  calculateDaysRemaining,
  formatCurrency,
  formatDate,
  getRiskBadgeColor,
  getStatusBadgeColor,
} from '../utils/contractUtils';

interface ContractsViewProps {
  contracts: Contract[];
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
  onAddContract: () => void;
  onEditContract: (contract: Contract) => void;
  onDeleteContract: (contractId: string) => void;
  onExportCsv: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  t,
  onSelectContract,
  onAddContract,
  onEditContract,
  onDeleteContract,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'renewalDate' | 'value' | 'risk' | 'name'>('renewalDate');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter & Search Logic
  const filteredContracts = contracts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.departmentName.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (riskFilter !== 'all' && c.riskLevel !== riskFilter) return false;
    return true;
  });

  // Sorting
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    if (sortBy === 'renewalDate') {
      return (
        calculateDaysRemaining(a.renewalDate) - calculateDaysRemaining(b.renewalDate)
      );
    } else if (sortBy === 'value') {
      return b.contractValue - a.contractValue;
    } else if (sortBy === 'risk') {
      return b.riskScore - a.riskScore;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const contractTypes = Array.from(new Set(contracts.map((c) => c.type)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-bold">
            Repository
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1C1E] mt-1.5 tracking-tight">
            Your Contracts
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1.5">
            Keep every agreement organized, accessible, and up to date with automated expiry
            classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
          <button
            onClick={onAddContract}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addContract}</span>
          </button>
        </div>
      </div>

      {/* 2. Search, Filter & View Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchContractsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#243029] bg-stone-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="px-3 py-2.5 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Under Review">Under Review</option>
            <option value="Renewed">Renewed</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            aria-label="Filter by Risk"
            className="px-3 py-2.5 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Risks</option>
            <option value="Critical">Critical (0–7d)</option>
            <option value="High">High (8–30d)</option>
            <option value="Medium">Medium (31–90d)</option>
            <option value="Safe">Safe (90+d)</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Contract Type"
            className="px-3 py-2.5 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {contractTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort contracts"
            className="px-3 py-2.5 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="renewalDate">Sort: Renewal Date</option>
            <option value="value">Sort: Value (High-Low)</option>
            <option value="risk">Sort: Risk Score</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50/50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white shadow-xs text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Contracts Presentation (Table or Grid) */}
      {sortedContracts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
          <p className="text-base sm:text-lg">No contracts found matching your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setRiskFilter('all');
              setTypeFilter('all');
            }}
            className="mt-3 text-sm font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 text-xs sm:text-sm uppercase tracking-wider text-stone-600 font-bold border-b border-stone-200">
                  <th className="py-3.5 px-5">{t.contractName}</th>
                  <th className="py-3.5 px-4">{t.company}</th>
                  <th className="py-3.5 px-4">{t.startDate}</th>
                  <th className="py-3.5 px-4">{t.renewalDate}</th>
                  <th className="py-3.5 px-4">{t.status}</th>
                  <th className="py-3.5 px-4">Risk</th>
                  <th className="py-3.5 px-4">{t.contractValue}</th>
                  <th className="py-3.5 px-5 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {sortedContracts.map((contract) => {
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
                            <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-700 font-medium">
                              Auto
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                          {contract.contractNumber} • {contract.type}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-stone-700 text-sm sm:text-base font-medium">{contract.companyName}</td>

                      <td className="py-4 px-4 text-stone-600 text-sm sm:text-base">
                        {formatDate(contract.startDate)}
                      </td>

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
                            ? `Expired`
                            : daysRemaining === 0
                            ? 'Expires Today'
                            : `${daysRemaining} days left`}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectContract(contract);
                            }}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                            title={t.viewDetails}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditContract(contract);
                            }}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                            title={t.editContract}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete contract "${contract.name}"?`)) {
                                onDeleteContract(contract.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                            title={t.deleteContract}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContracts.map((contract) => {
            const daysRemaining = calculateDaysRemaining(contract.renewalDate);
            const riskInfo = getRiskBadgeColor(contract.riskLevel);
            const statusInfo = getStatusBadgeColor(contract.status);

            return (
              <div
                key={contract.id}
                onClick={() => onSelectContract(contract)}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                    >
                      {contract.status}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`}></span>
                      <span>{contract.riskLevel}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug line-clamp-2">
                    {contract.name}
                  </h3>
                  <p className="text-sm font-medium text-stone-500 mt-1.5">{contract.companyName}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Renewal Date:</span>
                    <span className="font-bold text-stone-800">
                      {formatDate(contract.renewalDate)} ({daysRemaining}d)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Value:</span>
                    <span className="font-bold text-stone-900">
                      {formatCurrency(contract.contractValue, contract.currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
