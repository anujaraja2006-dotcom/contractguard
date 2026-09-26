import React from 'react';
import {
  Calendar,
  X,
  User,
} from 'lucide-react';
import { UserProfile, Contract, Reminder, UserRole } from '../types';
import { TranslationDictionary } from '../i18n/translations';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentUser?: UserProfile | null;
  contracts: Contract[];
  reminders: Reminder[];
  t?: TranslationDictionary;
  activeWorkspaceFilter?: string;
  onSelectWorkspaceFilter?: (filter: string) => void;
  activeCategoryFilter?: string;
  onSelectCategoryFilter?: (category: string) => void;
  userRole?: UserRole;
  setUserRole?: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  currentUser,
  activeWorkspaceFilter = 'all',
  onSelectWorkspaceFilter,
  activeCategoryFilter = 'all',
  onSelectCategoryFilter,
  userRole = 'Admin',
  setUserRole,
}) => {
  const workspaceItems = [
    { id: 'upcoming', label: 'Upcoming Renewals', count: 12 },
    { id: 'expiring', label: 'Expiring Soon', count: 7 },
    { id: 'expired', label: 'Expired', count: 3 },
    { id: 'escalations', label: 'Escalations', count: 2 },
  ];

  const categoryItems = [
    'Vendor',
    'Client',
    'Software',
    'Lease',
    'Employee',
    'Service',
    'Other',
  ];

  const handleSelectWorkspace = (id: string) => {
    if (onSelectWorkspaceFilter) {
      onSelectWorkspaceFilter(activeWorkspaceFilter === id ? 'all' : id);
    }
    if (currentTab !== 'calendar') {
      onNavigate('calendar');
    }
    onCloseMobile();
  };

  const handleSelectCategory = (cat: string) => {
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(activeCategoryFilter === cat ? 'all' : cat);
    }
    if (currentTab !== 'calendar') {
      onNavigate('calendar');
    }
    onCloseMobile();
  };

  const sidebarContent = (
    <div
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      className="flex flex-col h-full bg-[#0B1528]/85 backdrop-blur-2xl text-slate-200 border-r border-white/10 shadow-[4px_0_30px_-4px_rgba(0,0,0,0.3)] rounded-r-2xl lg:rounded-r-3xl overflow-hidden select-none"
    >
      {/* 1. MARS CALENDAR HEADER - Dedicated branding area at the very top */}
      <div className="calendar-sidebar-header min-h-[70px] h-[72px] px-6 border-b border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-between shrink-0">
        <h1 className="text-[19px] sm:text-[20px] font-bold text-white tracking-normal font-sans m-0 p-0 select-none">
          MARS Calendar
        </h1>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area - pushed downward with generous spacing above MY WORKSPACE */}
      <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
        {/* SECTION 1: MY WORKSPACE */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              MY WORKSPACE
            </span>
            {activeWorkspaceFilter !== 'all' && (
              <button
                onClick={() => onSelectWorkspaceFilter && onSelectWorkspaceFilter('all')}
                className="text-[10px] text-amber-300 hover:text-amber-200 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {workspaceItems.map((item) => {
              const isSelected = activeWorkspaceFilter === item.id;
              // Specific styling for Expired vs other items as requested
              let activeClass = 'bg-[#C84B31]/90 backdrop-blur-md text-white font-bold shadow-md shadow-[#C84B31]/30 border border-white/20 ring-1 ring-[#C84B31]';
              if (item.id === 'expired') {
                activeClass = 'bg-gradient-to-r from-rose-600/90 via-rose-500/90 to-amber-600/90 text-white font-bold shadow-md shadow-rose-950/40 border border-white/25 ring-1 ring-rose-400/40 backdrop-blur-md';
              } else if (item.id === 'escalations') {
                activeClass = 'bg-gradient-to-r from-red-700/90 to-rose-700/90 text-white font-bold shadow-md shadow-red-950/40 border border-white/25 ring-1 ring-red-400/40 backdrop-blur-md';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? activeClass
                      : 'bg-white/[0.03] text-slate-300 border border-transparent hover:bg-white/[0.09] hover:text-white hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ml-2 px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-black/20 text-white'
                        : 'bg-white/[0.06] text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: CONTRACT CATEGORIES */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              CONTRACT CATEGORIES
            </span>
            {activeCategoryFilter !== 'all' && (
              <button
                onClick={() => onSelectCategoryFilter && onSelectCategoryFilter('all')}
                className="text-[10px] text-amber-300 hover:text-amber-200 hover:underline font-semibold"
              >
                All
              </button>
            )}
          </div>

          <div className="space-y-1">
            {categoryItems.map((cat) => {
              const isSelected = activeCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white/[0.12] backdrop-blur-md text-white font-bold border border-white/20 border-l-3 border-l-[#C84B31] pl-2.5 shadow-xs ring-1 ring-white/10'
                      : 'text-slate-300 border border-transparent hover:text-white hover:bg-white/[0.08] hover:border-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.04)]'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] shadow-[0_0_6px_#C84B31]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar (Frosted Glass Panel) */}
      <aside className="hidden lg:block w-64 shrink-0 fixed top-0 bottom-0 left-0 z-40 pointer-events-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Slide-in Drawer with Frosted Glass */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
