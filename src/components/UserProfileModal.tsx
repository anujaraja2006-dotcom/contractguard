import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Building,
  Phone,
  Briefcase,
  Shield,
  Globe,
  Calendar,
  CheckCircle2,
  Edit3,
  Save,
  LogOut,
  Sparkles,
  Camera,
  Layers,
  Clock,
  Key,
} from 'lucide-react';
import { UserProfile, Department, Company, LanguageCode, UserRole } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  departments: Department[];
  companies: Company[];
  currentLanguage: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  onLogout?: () => void;
  isNewlyCreated?: boolean;
  t: TranslationDictionary;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  departments,
  companies,
  currentLanguage,
  onLanguageChange,
  onLogout,
  isNewlyCreated = false,
  t,
}) => {
  // Mode state: 'view' or 'edit'
  const [mode, setMode] = useState<'view' | 'edit'>(isNewlyCreated ? 'edit' : 'view');

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [companyId, setCompanyId] = useState(currentUser.companyId || (companies[0]?.id ?? 'comp-1'));
  const [departmentId, setDepartmentId] = useState(currentUser.departmentId || (departments[0]?.id ?? 'dept-1'));
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [title, setTitle] = useState(currentUser.title || (currentUser.role === 'Admin' ? 'Lead Contract Administrator' : 'Contract Specialist'));
  const [bio, setBio] = useState(currentUser.bio || 'Managing corporate agreements, vendor renewals, and SLA compliance.');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(currentUser.preferredLanguage || currentLanguage);
  const [dateFormat, setDateFormat] = useState(currentUser.dateFormat || 'DD/MM/YYYY');
  const [currency, setCurrency] = useState(currentUser.currency || 'INR');
  const [avatarColor, setAvatarColor] = useState('from-emerald-700 to-stone-900');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync state when currentUser or isNewlyCreated changes
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setRole(currentUser.role);
      setCompanyId(currentUser.companyId || (companies[0]?.id ?? 'comp-1'));
      setDepartmentId(currentUser.departmentId || (departments[0]?.id ?? 'dept-1'));
      setPhone(currentUser.phone || '+91 98765 43210');
      setTitle(currentUser.title || (currentUser.role === 'Admin' ? 'Lead Contract Administrator' : 'Contract Specialist'));
      setBio(currentUser.bio || 'Managing corporate agreements, vendor renewals, and SLA compliance.');
      setPreferredLanguage(currentUser.preferredLanguage || currentLanguage);
      setDateFormat(currentUser.dateFormat || 'DD/MM/YYYY');
      setCurrency(currentUser.currency || 'INR');
      setMode(isNewlyCreated ? 'edit' : 'view');
      setErrors({});
    }
  }, [currentUser, isNewlyCreated, currentLanguage, companies, departments, isOpen]);

  if (!isOpen) return null;

  const currentCompany = companies.find((c) => c.id === companyId) || companies[0];
  const currentDept = departments.find((d) => d.id === departmentId) || departments[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedUser: UserProfile = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      role,
      companyId,
      departmentId,
      phone: phone.trim(),
      title: title.trim(),
      bio: bio.trim(),
      preferredLanguage,
      dateFormat,
      currency,
    };

    onUpdateUser(updatedUser);

    // If preferred language changed, update active interface language as well
    if (onLanguageChange && preferredLanguage !== currentLanguage) {
      onLanguageChange(preferredLanguage);
    }

    setIsSavedRecently(true);
    setMode('view');
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const rolesList: UserRole[] = ['Admin', 'Manager', 'Employee', 'Analyst', 'Viewer'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-title"
      >
        {/* Top Header */}
        <div className="bg-[#1A231E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 id="user-profile-title" className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>User Profile</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {role}
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Manage personal credentials, role permissions and account settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'view' ? (
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/15"
                title="Edit profile information"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setMode('view');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Newly Created Account Welcome Banner */}
        {isNewlyCreated && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-emerald-900 flex-1">
              <strong className="font-bold">Welcome to ContractGuard!</strong> Your account was created successfully. You can customize your name, job title, role, and department below.
            </div>
          </div>
        )}

        {/* Recently Saved Toast Indicator */}
        {isSavedRecently && (
          <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-semibold flex items-center gap-2 shrink-0 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile changes saved and synced successfully!</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* User Hero Banner Card */}
          <div className="rounded-xl bg-gradient-to-br from-stone-50 to-stone-100/70 border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar Pill */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#243029] to-[#121815] text-white flex items-center justify-center text-2xl font-bold shadow-md border-2 border-white ring-2 ring-stone-200">
                {initials}
              </div>
              {mode === 'edit' && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Profile Summary Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 truncate">
                  {name || 'Contract Officer'}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#243029] text-white">
                  {role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5 truncate">
                {title} • {currentCompany?.name || 'Apex Global Technologies'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500 mt-2.5">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{email}</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{currentDept?.name || 'General Operations'}</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* VIEW MODE */}
          {mode === 'view' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                    <span>Identity &amp; Role</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Full Legal Name</span>
                      <strong className="text-stone-800 text-sm font-semibold">{name}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Job Title</span>
                      <span className="text-stone-800 font-medium">{title}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">System Role</span>
                      <span className="text-stone-800 font-medium">{role} (Full Access)</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Bio &amp; Scope</span>
                      <span className="text-stone-600 italic">{bio}</span>
                    </div>
                  </div>
                </div>

                {/* Organization Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-500" />
                    <span>Organization &amp; Department</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Company / Entity</span>
                      <strong className="text-stone-800 text-sm font-semibold">
                        {currentCompany?.name || 'Apex Global Technologies'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Department Unit</span>
                      <span className="text-stone-800 font-medium">
                        {currentDept?.name || 'Legal & Compliance'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Official Phone</span>
                      <span className="text-stone-800 font-medium">{phone}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Official Email</span>
                      <span className="text-stone-800 font-medium">{email}</span>
                    </div>
                  </div>
                </div>

                {/* Preferences Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-500" />
                    <span>Localization &amp; Display</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Preferred Interface Language</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-stone-900 font-bold">
                          {SUPPORTED_LANGUAGES.find((l) => l.code === preferredLanguage)?.nativeName || 'English'}
                        </span>
                        <span className="text-stone-400 text-[11px]">
                          ({SUPPORTED_LANGUAGES.find((l) => l.code === preferredLanguage)?.englishName || 'English'})
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Date Format</span>
                        <span className="text-stone-800 font-mono font-medium">{dateFormat}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Currency</span>
                        <span className="text-stone-800 font-mono font-medium">{currency} (₹)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security & Access Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Security &amp; Active Session</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">Account Status</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Active</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">Session Authenticity</span>
                      <span className="text-stone-700 font-mono text-[11px]">Secure JWT Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">Member Since</span>
                      <span className="text-stone-700 font-medium">October 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Single Logout in Profile */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Edit Profile Details</span>
                </button>

                {onLogout && (
                  <button
                    type="button"
                    id="profile-logout-btn"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs active:scale-95"
                    title="Logout from this account"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* EDIT MODE */}
          {mode === 'edit' && (
            <form onSubmit={handleSave} className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 pb-2 border-b border-stone-200">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Edit Personal &amp; Organization Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="e.g. Anuj Raja"
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029] transition-all ${
                        errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="e.g. anujaraja2006@gmail.com"
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029] transition-all ${
                        errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      User Role &amp; Permission Level
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>
                          {r} {r === 'Admin' ? '(Full System Access)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Job Title / Position
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Lead Contract Administrator"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Company / Organization
                    </label>
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Department Unit
                    </label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Preferred Interface Language
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.nativeName} ({l.englishName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Operating Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                    >
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                    </select>
                  </div>
                </div>

                {/* Bio / Responsibilities */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Bio &amp; Contract Management Scope
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short summary of roles and contract responsibilities..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#243029]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setMode('view');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
