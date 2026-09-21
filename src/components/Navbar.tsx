import React, { useState, useEffect } from 'react';
import {
  Bell,
  Globe,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  Sparkles,
  LogOut,
  User as UserIcon,
  LogIn,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';
import { LanguageCode, NotificationItem, UserRole, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationDictionary } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onOpenAddContract: () => void;
  onOpenAiAssistant: () => void;
  onOpenLanguageModal: () => void;
  currentUser?: UserProfile | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  t,
  userRole,
  setUserRole,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onOpenAddContract,
  onOpenAiAssistant,
  onOpenLanguageModal,
  currentUser,
  isAuthenticated = true,
  onLogout,
  onOpenAuth,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const roles: UserRole[] = ['Admin', 'Manager', 'Employee', 'Analyst', 'Viewer'];

  // Page sequence for before and after arrow navigation
  const PAGE_SEQUENCE = [
    'home',
    'dashboard',
    'contracts',
    'reminders',
    'calendar',
    'documents',
    'analytics',
    'workflow',
    'about',
    'settings',
    'thankyou',
  ] as const;

  const normalizedTab = currentTab === 'landing' ? 'home' : currentTab;
  const currentIndex = PAGE_SEQUENCE.indexOf(normalizedTab as any);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const handlePrevPage = () => {
    const prevIndex = (safeIndex - 1 + PAGE_SEQUENCE.length) % PAGE_SEQUENCE.length;
    setCurrentTab(PAGE_SEQUENCE[prevIndex]);
  };

  const handleNextPage = () => {
    const nextIndex = (safeIndex + 1) % PAGE_SEQUENCE.length;
    setCurrentTab(PAGE_SEQUENCE[nextIndex]);
  };

  // Keyboard navigation support with ArrowLeft and ArrowRight keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex]);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E4DF] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1F2421] text-[#E0DCD6] text-xs sm:text-sm py-1.5 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Left Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-stone-400 shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ContractGuard Engine Active</span>
        </div>

        {/* Center Announcement */}
        <div className="flex-1 text-center tracking-wider uppercase font-medium flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm truncate">
          <span className="inline-block lg:hidden w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold truncate">Never Miss a Contract Renewal Again</span>
          <span className="hidden md:inline text-stone-500">•</span>
          <span className="hidden md:inline text-stone-300 normal-case tracking-normal">
            Multi-Company &amp; 23 Indian Languages
          </span>
        </div>

        {/* Right side above near notification: About Us Link */}
        <div className="shrink-0 flex items-center justify-end pl-2">
          <button
            id="topbar-about-us-btn"
            onClick={() => setCurrentTab('about')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-normal transition-all cursor-pointer ${
              currentTab === 'about'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="About Us - Company Mission, Architecture & Features"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>About Us</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand + Arrow Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => setCurrentTab('home')}
              className="group text-left flex items-center gap-2.5 cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#243029] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1A231E] transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1C1E]">
                  CONTRACTLY
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] sm:text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-stone-200/90 text-stone-700 font-bold">
                  SaaS
                </span>
              </div>
            </button>

            {/* Minimal Previous/Next Navigation Controls Using Only Arrow Symbols */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {/* Left Arrow Button "←" (Before Page) */}
              <button
                type="button"
                onClick={handlePrevPage}
                aria-label="Previous"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-[#243029] text-stone-700 hover:text-white border border-stone-300/80 shadow-xs hover:shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
              >
                <ArrowLeft className="w-5 h-5 text-current transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>

              {/* Right Arrow Button "→" (After Page) */}
              <button
                type="button"
                onClick={handleNextPage}
                aria-label="Next"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-[#243029] text-stone-700 hover:text-white border border-stone-300/80 shadow-xs hover:shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
              >
                <ArrowRight className="w-5 h-5 text-current transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#243029] text-white hover:bg-[#1A231E] transition-all shadow-xs cursor-pointer"
              title="AI Contract Assistant"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200/90 transition-all cursor-pointer"
                title="Change Interface Language (23 Indian Languages)"
              >
                <Globe className="w-4 h-4 text-stone-600" />
                <span className="font-semibold max-w-[90px] sm:max-w-none truncate">
                  {currentLangObj.nativeName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-72 max-h-84 overflow-y-auto bg-white rounded-xl shadow-xl border border-stone-200 p-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-2 text-xs font-bold tracking-wider text-stone-500 uppercase flex items-center justify-between border-b border-stone-100 mb-1">
                    <span>Indian Languages (23)</span>
                    <button
                      onClick={() => {
                        setShowLangMenu(false);
                        onOpenLanguageModal();
                      }}
                      className="text-emerald-700 hover:underline cursor-pointer font-bold"
                    >
                      Grid View
                    </button>
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="font-medium">{l.nativeName}</span>
                      <span className="text-xs text-stone-400">
                        {l.englishName} {l.isRTL ? '(RTL)' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Us Navigation Button near Notifications */}
            <button
              id="navbar-about-us-btn"
              onClick={() => setCurrentTab('about')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                currentTab === 'about'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="About Contractly"
            >
              <Info className="w-4 h-4 text-stone-600" />
              <span>About Us</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        In-App Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 my-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-sm text-stone-400">
                        No pending alerts. All renewals up to date!
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-3 text-left rounded-lg transition-colors cursor-pointer ${
                            !n.read ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {n.type === 'expiry' && (
                              <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'escalation' && (
                              <Clock className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'renewal' && (
                              <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'reminder' && (
                              <Bell className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-stone-900">{n.title}</h4>
                                <span className="text-xs text-stone-400">{n.timestamp}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 mt-1 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab('reminders');
                      }}
                      className="hover:text-emerald-700 hover:underline cursor-pointer"
                    >
                      View Reminders
                    </button>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setCurrentTab('about');
                      }}
                      className="text-emerald-700 hover:underline cursor-pointer font-medium flex items-center gap-1"
                    >
                      About Us &amp; Escalations →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 transition-colors cursor-pointer"
                title="Current Session Role"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-xs sm:text-sm">{userRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50">
                  <div className="px-2 py-1 text-xs uppercase tracking-wider text-stone-400 font-bold">
                    Simulate Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        userRole === r
                          ? 'bg-stone-100 font-bold text-stone-900'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account / Authentication Status */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs"
                  title={`Signed in as ${currentUser.email}`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#243029] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name
                      ? currentUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'U'}
                  </div>
                  <span className="font-medium max-w-[110px] truncate">{currentUser.name}</span>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick Add Contract CTA */}
            {userRole !== 'Viewer' && (
              <button
                onClick={onOpenAddContract}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#243029] text-white hover:bg-[#1A231E] transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addContract}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
