import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Bell,
  Users,
  ShieldCheck,
  Save,
  Download,
  CheckCircle2,
  Mail,
  Smartphone,
  MessageSquare,
  RefreshCw,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Layers,
  Shield,
  FileText,
} from 'lucide-react';
import { Company, User, UserRole, CompanyAutoRenewPolicy, EscalationTierPolicy } from '../types';
import { INDIAN_LANGUAGES, IndianLanguage } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/translations';
import { getCompanyAutoRenewPolicy, INITIAL_COMPANY_POLICIES } from '../utils/policyUtils';

interface SettingsViewProps {
  currentCompany: Company;
  companies: Company[];
  currentUser: User;
  users: User[];
  currentLanguage: IndianLanguage;
  onLanguageChange: (lang: IndianLanguage) => void;
  onCompanyChange: (company: Company) => void;
  t: TranslationDictionary;
  onExportFullBackup: () => void;
  onOpenProfile?: () => void;
  autoRenewPolicies: Record<string, CompanyAutoRenewPolicy>;
  onUpdateCompanyPolicy: (companyId: string, policy: CompanyAutoRenewPolicy) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentCompany,
  companies,
  currentUser,
  users,
  currentLanguage,
  onLanguageChange,
  onCompanyChange,
  t,
  onExportFullBackup,
  onOpenProfile,
  autoRenewPolicies,
  onUpdateCompanyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<
    'organization' | 'autorenew' | 'language' | 'notifications' | 'escalation' | 'users'
  >('organization');

  // Company Entity Form
  const [companyForm, setCompanyForm] = useState({
    name: currentCompany.name,
    gstin: currentCompany.gstin || '',
    pan: currentCompany.pan || '',
    cin: currentCompany.cin || '',
    address: currentCompany.address || '',
  });

  useEffect(() => {
    setCompanyForm({
      name: currentCompany.name,
      gstin: currentCompany.gstin || '',
      pan: currentCompany.pan || '',
      cin: currentCompany.cin || '',
      address: currentCompany.address || '',
    });
  }, [currentCompany]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    whatsappAlerts: true,
    smsAlerts: false,
    dailyDigest: true,
  });

  // Global Escalation Rules
  const [escalationRules, setEscalationRules] = useState({
    l1Days: '90, 60, 30',
    l2Days: '15',
    l3Days: '7, 1',
  });

  // =========================================================================
  // GLOBAL AUTO-RENEW POLICY CONFIGURATION PER COMPANY CONTEXT
  // =========================================================================
  const [selectedPolicyCompanyId, setSelectedPolicyCompanyId] = useState<string>(currentCompany.id);
  const [policyForm, setPolicyForm] = useState<CompanyAutoRenewPolicy>(
    autoRenewPolicies[currentCompany.id] || getCompanyAutoRenewPolicy(currentCompany)
  );

  // String representations of trigger days for effortless user editing
  const [l1TriggerString, setL1TriggerString] = useState('90, 60, 30');
  const [l2TriggerString, setL2TriggerString] = useState('15');
  const [l3TriggerString, setL3TriggerString] = useState('7, 1');

  useEffect(() => {
    const targetComp = companies.find((c) => c.id === selectedPolicyCompanyId) || currentCompany;
    const policy = autoRenewPolicies[selectedPolicyCompanyId] || getCompanyAutoRenewPolicy(targetComp);
    setPolicyForm(JSON.parse(JSON.stringify(policy)));
    setL1TriggerString(policy.escalationWorkflow.l1.triggerDaysBeforeExpiry.join(', '));
    setL2TriggerString(policy.escalationWorkflow.l2.triggerDaysBeforeExpiry.join(', '));
    setL3TriggerString(policy.escalationWorkflow.l3.triggerDaysBeforeExpiry.join(', '));
  }, [selectedPolicyCompanyId, autoRenewPolicies, currentCompany]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedTabMessage, setSavedTabMessage] = useState('');

  const parseDaysString = (str: string, fallback: number[]): number[] => {
    const parsed = str
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    return parsed.length > 0 ? parsed : fallback;
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onCompanyChange({
      ...currentCompany,
      name: companyForm.name,
      gstin: companyForm.gstin,
      pan: companyForm.pan,
      cin: companyForm.cin,
      address: companyForm.address,
    });
    setSavedSuccess(true);
    setSavedTabMessage('Entity details saved!');
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedTabMessage('');
    }, 2500);
  };

  const handleSaveAutoRenewPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const l1Days = parseDaysString(l1TriggerString, [90, 60, 30]);
    const l2Days = parseDaysString(l2TriggerString, [15]);
    const l3Days = parseDaysString(l3TriggerString, [7, 1]);

    const updatedPolicy: CompanyAutoRenewPolicy = {
      ...policyForm,
      escalationWorkflow: {
        l1: {
          ...policyForm.escalationWorkflow.l1,
          triggerDaysBeforeExpiry: l1Days,
        },
        l2: {
          ...policyForm.escalationWorkflow.l2,
          triggerDaysBeforeExpiry: l2Days,
        },
        l3: {
          ...policyForm.escalationWorkflow.l3,
          triggerDaysBeforeExpiry: l3Days,
        },
      },
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: `${currentUser.name} (${currentUser.role})`,
    };

    onUpdateCompanyPolicy(selectedPolicyCompanyId, updatedPolicy);
    setSavedSuccess(true);
    setSavedTabMessage(`Auto-Renew policy saved for ${policyForm.companyName}!`);
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedTabMessage('');
    }, 2500);
  };

  const handleResetPolicyDefaults = () => {
    const targetComp = companies.find((c) => c.id === selectedPolicyCompanyId) || currentCompany;
    const standard = getCompanyAutoRenewPolicy(targetComp);
    setPolicyForm({
      ...standard,
      defaultNoticePeriodDays: 60,
      defaultAutoRenewalEnabled: true,
      defaultRenewalDurationMonths: 12,
      priceEscalationCapPercent: 5.0,
      renegotiationWindowDays: 30,
      autoScheduleReminders: true,
    });
    setL1TriggerString('90, 60, 30');
    setL2TriggerString('15');
    setL3TriggerString('7, 1');
    setSavedSuccess(true);
    setSavedTabMessage('Reset to recommended governance defaults');
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedTabMessage('');
    }, 2000);
  };

  const handleSaveNotifications = () => {
    setSavedSuccess(true);
    setSavedTabMessage('Notification preferences updated!');
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedTabMessage('');
    }, 2500);
  };

  const handleSaveEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setSavedTabMessage('Escalation rules calibrated!');
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedTabMessage('');
    }, 2500);
  };

  const activePolicyCompany =
    companies.find((c) => c.id === selectedPolicyCompanyId) || currentCompany;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Preferences &amp; Control
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Configure enterprise policies, auto-renew defaults, escalation workflows, and multi-language preferences.
          </p>
        </div>

        <button
          onClick={onExportFullBackup}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Full Backup (JSON)</span>
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-3 border-b border-stone-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'organization', label: 'Organization & Tax', icon: Building2 },
          { id: 'autorenew', label: 'Auto-Renew Policies', icon: RefreshCw },
          { id: 'language', label: '23 Indian Languages', icon: Globe },
          { id: 'notifications', label: 'Notification Channels', icon: Bell },
          { id: 'escalation', label: 'Escalation Engine', icon: ShieldCheck },
          { id: 'users', label: 'Users & Roles', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#243029] text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Organization & Tax */}
      {activeTab === 'organization' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Corporate Entity Details
              </h3>
              <p className="text-xs text-stone-500">
                Corporate registration details for Indian tax and legal compliance.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{savedTabMessage || 'Saved successfully!'}</span>
              </span>
            )}
          </div>

          {/* Quick Active Company Switcher */}
          {companies.length > 1 && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-stone-800">Active Organization Profile</span>
                <p className="text-stone-500 text-[11px]">Select which company entity you are reviewing or updating:</p>
              </div>
              <select
                value={currentCompany.id}
                onChange={(e) => {
                  const found = companies.find((c) => c.id === e.target.value);
                  if (found) {
                    onCompanyChange(found);
                    setSavedSuccess(true);
                    setSavedTabMessage(`Switched to ${found.name}`);
                    setTimeout(() => {
                      setSavedSuccess(false);
                      setSavedTabMessage('');
                    }, 2000);
                  }
                }}
                className="px-3 py-2 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 cursor-pointer text-xs"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleSaveCompany} className="space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">GSTIN Number (15-digit)</label>
                <input
                  type="text"
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">PAN Card Number</label>
                <input
                  type="text"
                  value={companyForm.pan}
                  onChange={(e) => setCompanyForm({ ...companyForm, pan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">CIN (Corporate Identity Number)</label>
              <input
                type="text"
                value={companyForm.cin}
                onChange={(e) => setCompanyForm({ ...companyForm, cin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Registered Address</label>
              <textarea
                rows={3}
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors cursor-pointer"
              >
                Save Entity Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GLOBAL AUTO-RENEW POLICY & ESCALATION WORKFLOWS */}
      {/* ========================================================================= */}
      {activeTab === 'autorenew' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Section Header */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Global Auto-Renew Policy &amp; Escalation Workflows
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                      Governance Engine
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Define default renewal notice periods, price escalation caps, rollover rules, and multi-tier escalation workflows for all new contracts created within a specific company context.
                  </p>
                </div>
              </div>

              {savedSuccess && (
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{savedTabMessage || 'Policy saved!'}</span>
                </span>
              )}
            </div>

            {/* COMPANY CONTEXT SELECTOR BANNER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-stone-50 via-emerald-50/30 to-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company Context Under Configuration</span>
                </span>
                <div className="font-serif text-lg font-bold text-stone-900">
                  {activePolicyCompany.name}
                </div>
                <div className="text-[11px] text-stone-500">
                  CIN: {activePolicyCompany.cin || 'U72900MH2021PTC368912'} &bull; GSTIN: {activePolicyCompany.gstin || '27AABCA1234F1Z8'} &bull; Last updated {policyForm.updatedAt} by {policyForm.updatedBy}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <label className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                  Switch Company Context:
                </label>
                <select
                  value={selectedPolicyCompanyId}
                  onChange={(e) => setSelectedPolicyCompanyId(e.target.value)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white text-stone-900 shadow-xs focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* POLICY FORM */}
            <form onSubmit={handleSaveAutoRenewPolicy} className="space-y-8">
              {/* Part 1: Default Renewal Notice Periods & Contract Rollover */}
              <div className="space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>1. Default Renewal Notice Periods &amp; Rollover Rules</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Any new contract created under {activePolicyCompany.name} will automatically inherit these default parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                  {/* Default Notice Period Days */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2.5">
                    <label className="block font-bold text-stone-900">
                      Default Notice Period (Days) *
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Required written notice deadline prior to contract expiry for termination or renewal action.
                    </p>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      required
                      value={policyForm.defaultNoticePeriodDays}
                      onChange={(e) =>
                        setPolicyForm({
                          ...policyForm,
                          defaultNoticePeriodDays: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-stone-400">Quick Presets:</span>
                      {[30, 45, 60, 90, 120].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setPolicyForm({ ...policyForm, defaultNoticePeriodDays: days })}
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold border cursor-pointer transition-colors ${
                            policyForm.defaultNoticePeriodDays === days
                              ? 'bg-[#243029] text-white border-[#243029]'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-Renewal Enabled by Default */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="autoRenewalDefault" className="font-bold text-stone-900 cursor-pointer">
                          Auto-Renewal by Default
                        </label>
                        <input
                          type="checkbox"
                          id="autoRenewalDefault"
                          checked={policyForm.defaultAutoRenewalEnabled}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              defaultAutoRenewalEnabled: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-[#243029] focus:ring-[#243029] cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        When enabled, the &ldquo;Auto-Renewal Clause Enabled&rdquo; checkbox on new contract forms is activated automatically.
                      </p>
                    </div>

                    <div className={`p-2 rounded-lg text-[11px] font-semibold flex items-center gap-2 ${
                      policyForm.defaultAutoRenewalEnabled
                        ? 'bg-emerald-100/70 text-emerald-900'
                        : 'bg-stone-200/60 text-stone-700'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{policyForm.defaultAutoRenewalEnabled ? 'Evergreen Auto-Rollover Active' : 'Manual Expiration by Default'}</span>
                    </div>
                  </div>

                  {/* Renewal Extension Duration */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2.5">
                    <label className="block font-bold text-stone-900">
                      Default Renewal Duration
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Standard extension term period when contract rolls over upon renewal.
                    </p>
                    <select
                      value={policyForm.defaultRenewalDurationMonths}
                      onChange={(e) =>
                        setPolicyForm({
                          ...policyForm,
                          defaultRenewalDurationMonths: parseInt(e.target.value) || 12,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-semibold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                    >
                      <option value={6}>6 Months (Half-Yearly Extension)</option>
                      <option value={12}>12 Months (1 Year Extension - Standard)</option>
                      <option value={24}>24 Months (2 Years Extension)</option>
                      <option value={36}>36 Months (3 Years Extension)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs pt-1">
                  {/* Price Escalation Cap */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                    <label className="block font-bold text-stone-900">
                      Annual Price Escalation Cap (%)
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Maximum permissible annual price adjustment upon renewal without formal commercial RFP.
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={policyForm.priceEscalationCapPercent}
                        onChange={(e) =>
                          setPolicyForm({
                            ...policyForm,
                            priceEscalationCapPercent: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 pr-8 rounded-lg border border-stone-300 font-bold text-xs bg-white"
                      />
                      <span className="absolute right-3 top-2 font-bold text-stone-400">%</span>
                    </div>
                  </div>

                  {/* Renegotiation Window */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                    <label className="block font-bold text-stone-900">
                      Renegotiation Window (Days)
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Days prior to notice cutoff to initiate commercial renegotiation with counterparty.
                    </p>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={policyForm.renegotiationWindowDays}
                      onChange={(e) =>
                        setPolicyForm({
                          ...policyForm,
                          renegotiationWindowDays: parseInt(e.target.value) || 15,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold text-xs bg-white"
                    />
                  </div>

                  {/* Auto-Schedule Reminders Toggle */}
                  <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="autoRemindersToggle" className="font-bold text-stone-900 cursor-pointer">
                          Auto-Schedule Reminders
                        </label>
                        <input
                          type="checkbox"
                          id="autoRemindersToggle"
                          checked={policyForm.autoScheduleReminders}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              autoScheduleReminders: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-[#243029] focus:ring-[#243029] cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Automatically instantiate multi-tier L1, L2, L3 escalation alerts in the database upon new contract creation.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Reminders Auto-Created On Save
                    </span>
                  </div>
                </div>
              </div>

              {/* Part 2: Default Renewal Terms Template */}
              <div className="space-y-3">
                <div className="border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>2. Default Renewal Terms &amp; Conditions Template</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    This standard clause will be pre-filled into new contract entries under {activePolicyCompany.name} (unless overridden by AI document extraction).
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <textarea
                    rows={3}
                    value={policyForm.defaultRenewalTermsTemplate}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        defaultRenewalTermsTemplate: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-stone-800 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    placeholder="Enter standard renewal terms text..."
                  ></textarea>
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>
                      Variables automatically synchronized: Notice Period ({policyForm.defaultNoticePeriodDays}d), Escalation Cap ({policyForm.priceEscalationCapPercent}%), Duration ({policyForm.defaultRenewalDurationMonths}m).
                    </span>
                    <span>{policyForm.defaultRenewalTermsTemplate.length} characters</span>
                  </div>
                </div>
              </div>

              {/* Part 3: Company Context Escalation Workflow (L1, L2, L3) */}
              <div className="space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>3. Escalation Workflow for All New Contracts in this Company Context</span>
                    </h4>
                    <span className="text-[10px] font-bold text-stone-500 font-mono">
                      3-Tier Governance Matrix
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Define the trigger schedule, responsible roles, and delivery channels applied to contracts in {activePolicyCompany.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  {/* Tier 1 / L1 Card */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Tier 1 (L1: Proactive Review)</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Early Notice
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Trigger Days Before Expiry (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={l1TriggerString}
                          onChange={(e) => setL1TriggerString(e.target.value)}
                          placeholder="90, 60, 30"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Recipient Role
                        </label>
                        <input
                          type="text"
                          value={policyForm.escalationWorkflow.l1.recipientRole}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l1: {
                                  ...policyForm.escalationWorkflow.l1,
                                  recipientRole: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                          Action Required
                        </label>
                        <textarea
                          rows={2}
                          value={policyForm.escalationWorkflow.l1.actionRequired}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l1: {
                                  ...policyForm.escalationWorkflow.l1,
                                  actionRequired: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-[11px] bg-white leading-relaxed"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                        Active Alert Channels:
                      </span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l1.channels.email}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l1: {
                                    ...policyForm.escalationWorkflow.l1,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l1.channels,
                                      email: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-[#243029]"
                          />
                          <span>Email</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l1.channels.inApp}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l1: {
                                    ...policyForm.escalationWorkflow.l1,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l1.channels,
                                      inApp: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-[#243029]"
                          />
                          <span>In-App</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l1.channels.whatsapp}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l1: {
                                    ...policyForm.escalationWorkflow.l1,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l1.channels,
                                      whatsapp: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-[#243029]"
                          />
                          <span>WhatsApp</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tier 2 / L2 Card */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/90 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Tier 2 (L2: Manager Escalation)</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-300">
                          Urgent Review
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-amber-900 mb-1">
                          Trigger Days Before Expiry
                        </label>
                        <input
                          type="text"
                          value={l2TriggerString}
                          onChange={(e) => setL2TriggerString(e.target.value)}
                          placeholder="15"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 font-mono text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-amber-900 mb-1">
                          Recipient Role
                        </label>
                        <input
                          type="text"
                          value={policyForm.escalationWorkflow.l2.recipientRole}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l2: {
                                  ...policyForm.escalationWorkflow.l2,
                                  recipientRole: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-amber-900 mb-1">
                          Action Required
                        </label>
                        <textarea
                          rows={2}
                          value={policyForm.escalationWorkflow.l2.actionRequired}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l2: {
                                  ...policyForm.escalationWorkflow.l2,
                                  actionRequired: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-[11px] bg-white leading-relaxed"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-900/60 block mb-1">
                        Active Alert Channels:
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-amber-950">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l2.channels.email}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l2: {
                                    ...policyForm.escalationWorkflow.l2,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l2.channels,
                                      email: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-amber-800"
                          />
                          <span>Email</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l2.channels.inApp}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l2: {
                                    ...policyForm.escalationWorkflow.l2,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l2.channels,
                                      inApp: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-amber-800"
                          />
                          <span>In-App</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l2.channels.whatsapp}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l2: {
                                    ...policyForm.escalationWorkflow.l2,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l2.channels,
                                      whatsapp: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-amber-800"
                          />
                          <span>WhatsApp</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tier 3 / L3 Card */}
                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/90 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                        <span className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                          <span>Tier 3 (L3: Executive Cutoff)</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-rose-900 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                          Critical Emergency
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-rose-900 mb-1">
                          Trigger Days Before Expiry
                        </label>
                        <input
                          type="text"
                          value={l3TriggerString}
                          onChange={(e) => setL3TriggerString(e.target.value)}
                          placeholder="7, 1"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 font-mono text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-rose-900 mb-1">
                          Recipient Role
                        </label>
                        <input
                          type="text"
                          value={policyForm.escalationWorkflow.l3.recipientRole}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l3: {
                                  ...policyForm.escalationWorkflow.l3,
                                  recipientRole: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 text-xs bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-rose-900 mb-1">
                          Action Required
                        </label>
                        <textarea
                          rows={2}
                          value={policyForm.escalationWorkflow.l3.actionRequired}
                          onChange={(e) =>
                            setPolicyForm({
                              ...policyForm,
                              escalationWorkflow: {
                                ...policyForm.escalationWorkflow,
                                l3: {
                                  ...policyForm.escalationWorkflow.l3,
                                  actionRequired: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 text-[11px] bg-white leading-relaxed"
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-200">
                      <span className="text-[10px] uppercase font-bold text-rose-900/60 block mb-1">
                        Active Alert Channels:
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-rose-950">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l3.channels.email}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l3: {
                                    ...policyForm.escalationWorkflow.l3,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l3.channels,
                                      email: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-rose-700"
                          />
                          <span>Email</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l3.channels.whatsapp}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l3: {
                                    ...policyForm.escalationWorkflow.l3,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l3.channels,
                                      whatsapp: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-rose-700"
                          />
                          <span>WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyForm.escalationWorkflow.l3.channels.sms}
                            onChange={(e) =>
                              setPolicyForm({
                                ...policyForm,
                                escalationWorkflow: {
                                  ...policyForm.escalationWorkflow,
                                  l3: {
                                    ...policyForm.escalationWorkflow.l3,
                                    channels: {
                                      ...policyForm.escalationWorkflow.l3.channels,
                                      sms: e.target.checked,
                                    },
                                  },
                                },
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-rose-700"
                          />
                          <span>SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 4: Live Impact Summary & Actions */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">
                      Policy Scope for &ldquo;{activePolicyCompany.name}&rdquo;
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Notice: <strong>{policyForm.defaultNoticePeriodDays} days</strong> &bull; Auto-Renewal: <strong>{policyForm.defaultAutoRenewalEnabled ? 'Enabled' : 'Disabled'}</strong> &bull; Escalation Tiers: <strong>L1 ({l1TriggerString}d), L2 ({l2TriggerString}d), L3 ({l3TriggerString}d)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetPolicyDefaults}
                    className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white font-semibold uppercase tracking-wider text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Company Policy</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Indian Languages */}
      {activeTab === 'language' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Indian Multilingual Localization (23 Languages)
            </h3>
            <p className="text-xs text-stone-500">
              ContractGuard operates natively across all 22 Eighth Schedule Indian Languages + English,
              featuring automatic Right-to-Left (RTL) flipping for Urdu and Kashmiri.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {INDIAN_LANGUAGES.map((lang: IndianLanguage) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#243029] bg-[#243029] text-white shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="text-sm font-bold font-serif">{lang.nativeName}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {lang.englishName}
                  </div>
                  {lang.isRTL && (
                    <span
                      className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      RTL Script
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Dispatch &amp; Alert Channels
              </h3>
              <p className="text-xs text-stone-500">
                Configure how employees, department managers, and executives receive expiry notices.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{savedTabMessage || 'Preferences updated!'}</span>
              </span>
            )}
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-800" />
                <div>
                  <div className="font-semibold text-stone-900">Email Notifications</div>
                  <div className="text-stone-500 text-[11px]">Direct automated alerts with contract PDF attachments.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 text-[#243029] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-stone-900">WhatsApp Business Alerts</div>
                  <div className="text-stone-500 text-[11px]">High-priority delivery to department heads via official BSP.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.whatsappAlerts}
                onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                className="w-4 h-4 text-[#243029] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-stone-700" />
                <div>
                  <div className="font-semibold text-stone-900">SMS Gateway Alert</div>
                  <div className="text-stone-500 text-[11px]">DLT registered templates for Indian cellular networks.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                className="w-4 h-4 text-[#243029] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-semibold text-stone-900">Daily Digest Summary</div>
                  <div className="text-stone-500 text-[11px]">Consolidated 9:00 AM IST morning overview of expiring agreements.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailyDigest}
                onChange={(e) => setNotifications({ ...notifications, dailyDigest: e.target.checked })}
                className="w-4 h-4 text-[#243029] rounded cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="px-5 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors cursor-pointer"
              >
                Save Notification Channels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Escalation Engine */}
      {activeTab === 'escalation' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                System-Wide Escalation Rules
              </h3>
              <p className="text-xs text-stone-500">
                Customize trigger days before contract expiry for Level 1, 2, and 3 stakeholders.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{savedTabMessage || 'Escalation schedule calibrated!'}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveEscalation} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="font-bold text-stone-800">Level 1: Responsible Employee</span>
                <p className="text-[11px] text-stone-500">Notified early before expiry to initiate review.</p>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Trigger Days Before Expiry</label>
                  <input
                    type="text"
                    value={escalationRules.l1Days}
                    onChange={(e) => setEscalationRules({ ...escalationRules, l1Days: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-md border border-stone-300 font-mono text-xs bg-white"
                    placeholder="90, 60, 30"
                  />
                </div>
                <div className="font-mono text-[11px] font-semibold text-emerald-900">Status: Active</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="font-bold text-amber-900">Level 2: Department Manager</span>
                <p className="text-[11px] text-amber-800">Notified if no initial renewal action recorded.</p>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-amber-800 mb-1">Trigger Days Before Expiry</label>
                  <input
                    type="text"
                    value={escalationRules.l2Days}
                    onChange={(e) => setEscalationRules({ ...escalationRules, l2Days: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-md border border-amber-300 font-mono text-xs bg-white"
                    placeholder="15"
                  />
                </div>
                <div className="font-mono text-[11px] font-semibold text-amber-900">Status: Active</div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                <span className="font-bold text-rose-900">Level 3: Executive Admin</span>
                <p className="text-[11px] text-rose-800">Critical breach warning before auto-rollover.</p>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-800 mb-1">Trigger Days Before Expiry</label>
                  <input
                    type="text"
                    value={escalationRules.l3Days}
                    onChange={(e) => setEscalationRules({ ...escalationRules, l3Days: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-md border border-rose-300 font-mono text-xs bg-white"
                    placeholder="7, 1"
                  />
                </div>
                <div className="font-mono text-[11px] font-semibold text-rose-900">Status: Active</div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#243029] hover:bg-[#1A231E] text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors cursor-pointer"
              >
                Save Escalation Windows
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Team Members &amp; Role-Based Access Control
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage organization user accounts, roles, access permissions, and identity.
              </p>
            </div>
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="View and edit your personal profile and account credentials"
              >
                <span>View &amp; Edit My Profile</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-5 font-semibold text-stone-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-stone-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {companies.find((c) => c.id === u.companyId)?.name || 'Apex Global'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {u.role === 'Admin' ? 'Executive & Compliance' : 'Operations & Legal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
