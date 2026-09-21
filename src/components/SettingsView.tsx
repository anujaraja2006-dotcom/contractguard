import React, { useState } from 'react';
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
} from 'lucide-react';
import { Company, User, UserRole } from '../types';
import { INDIAN_LANGUAGES, IndianLanguage } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/translations';

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
}) => {
  const [activeTab, setActiveTab] = useState<
    'organization' | 'language' | 'notifications' | 'escalation' | 'users'
  >('organization');

  const [companyForm, setCompanyForm] = useState({
    name: currentCompany.name,
    gstin: currentCompany.gstin || '',
    pan: currentCompany.pan || '',
    cin: currentCompany.cin || '',
    address: currentCompany.address || '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    whatsappAlerts: true,
    smsAlerts: false,
    dailyDigest: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
            Configure enterprise credentials, multi-language preferences, and notification channels.
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
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">PAN Number</label>
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

      {activeTab === 'notifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Dispatch &amp; Alert Channels
            </h3>
            <p className="text-xs text-stone-500">
              Configure how employees, department managers, and executives receive expiry notices.
            </p>
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
                className="w-4 h-4 text-[#243029]"
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
                className="w-4 h-4 text-[#243029]"
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
                className="w-4 h-4 text-[#243029]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'escalation' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Escalation Window Customization
            </h3>
            <p className="text-xs text-stone-500">
              Customize trigger days before contract expiry for Level 1, 2, and 3 stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800">Level 1: Responsible Employee</span>
              <p className="text-[11px] text-stone-500">Notified at 90, 60, and 30 days before expiry.</p>
              <div className="font-mono text-xs font-semibold text-emerald-900">Status: Active</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900">Level 2: Department Manager</span>
              <p className="text-[11px] text-amber-800">Notified at 15 days before expiry if unhandled.</p>
              <div className="font-mono text-xs font-semibold text-amber-900">Status: Active</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <span className="font-bold text-rose-900">Level 3: Executive Admin</span>
              <p className="text-[11px] text-rose-800">Triggered at 7 and 1 day before expiry.</p>
              <div className="font-mono text-xs font-semibold text-rose-900">Status: Active</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Team Members &amp; Role-Based Access Control
            </h3>
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
