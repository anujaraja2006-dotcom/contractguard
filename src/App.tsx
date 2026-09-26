import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { ContractsView } from './components/ContractsView';
import { ContractDetailModal } from './components/ContractDetailModal';
import { ContractFormModal } from './components/ContractFormModal';
import { RemindersView } from './components/RemindersView';
import { CalendarView } from './components/CalendarView';
import { DocumentsView } from './components/DocumentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { RenewalWorkflowView } from './components/RenewalWorkflowView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';
import { ThankYouView } from './components/ThankYouView';
import { AuthView } from './components/AuthView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { FirstLoginLanguageModal } from './components/FirstLoginLanguageModal';
import { Sidebar } from './components/Sidebar';
import { EscalationsView } from './components/EscalationsView';

import {
  mockContracts,
  mockCompanies,
  mockDepartments,
  mockUsers,
  mockReminders,
  mockDocuments,
  mockRenewalHistory,
  mockComments,
  mockNotifications,
  mockCalendarEvents,
} from './data/mockData';
import {
  Contract,
  Company,
  Department,
  User,
  Reminder,
  ContractDocument,
  RenewalRecord,
  CommentItem,
  RenewalStage,
  NotificationItem,
  UserRole,
  LanguageCode,
} from './types';
import {
  INDIAN_LANGUAGES,
  IndianLanguage,
  getLanguageByCode,
} from './i18n/languages';
import { getTranslations } from './i18n/translations';
import { calculateDaysRemaining, classifyRisk } from './utils/contractUtils';
import { CheckCircle2, AlertTriangle, X, Bell } from 'lucide-react';
import { PageSequenceNavigator } from './components/PageSequenceNavigator';

export function App() {
  // Navigation & View State: The Calendar item is highlighted as user is in Calendar module
  const [currentTab, setCurrentTab] = useState<string>('calendar');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [calendarCategoryFilter, setCalendarCategoryFilter] = useState<string>('all');
  const [calendarWorkspaceFilter, setCalendarWorkspaceFilter] = useState<string>('all');
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleNavigate = (nextTab: string, direction: 'forward' | 'backward' = 'forward') => {
    if (nextTab === currentTab) return;
    setTransitionDirection(direction);
    setIsTransitioning(true);

    if (direction === 'forward') {
      setHistoryStack((prev) => [...prev, currentTab]);
    } else {
      setHistoryStack((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === nextTab) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }

    setTimeout(() => {
      setCurrentTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 60);
    }, 160);
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('contractly_session_token');
    } catch {
      return false;
    }
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Multi-Company & Multi-Language & User State
  const [currentCompany, setCurrentCompany] = useState<Company>(mockCompanies[0]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(mockCompanies[0].id);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem('contractly_session_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return mockUsers[0];
  });

  // Default to English ('en') on first page, multi-language is an on-demand choice
  const [currentLanguage, setCurrentLanguage] = useState<IndianLanguage>(() => {
    try {
      const savedLang = localStorage.getItem('contractguard_lang');
      if (savedLang) {
        return getLanguageByCode(savedLang);
      }
    } catch {
      // ignore
    }
    return getLanguageByCode('en');
  });

  const [isFirstLoginLanguageOpen, setIsFirstLoginLanguageOpen] = useState(false);

  // Core Data State
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [documents, setDocuments] = useState<ContractDocument[]>(mockDocuments);
  const [renewalHistory, setRenewalHistory] = useState<RenewalRecord[]>(mockRenewalHistory);
  const [comments, setComments] = useState<CommentItem[]>(mockComments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Modals & Panels State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type?: 'info' | 'success' | 'alert';
  } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Translations
  const t = getTranslations(currentLanguage.code);

  // Language selection handler
  const handleSelectLanguage = (code: LanguageCode) => {
    const l = getLanguageByCode(code);
    setCurrentLanguage(l);
    try {
      localStorage.setItem('contractguard_lang', code);
    } catch {
      // ignore
    }
    showToast(
      code === 'en'
        ? 'Interface set to English (Default)'
        : `Language changed to ${l.nativeName} (${l.englishName})`,
      'info'
    );
  };

  // Sync RTL direction to document body when language changes
  useEffect(() => {
    if (currentLanguage.isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = currentLanguage.code;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLanguage.code;
    }
  }, [currentLanguage]);

  // Notifications management
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Contract CRUD handlers
  const handleOpenAddContract = () => {
    setContractToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditContract = (contract: Contract) => {
    setContractToEdit(contract);
    setIsFormModalOpen(true);
  };

  const handleSaveContract = (contractData: Partial<Contract>) => {
    if (contractToEdit) {
      // Edit existing
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractToEdit.id ? ({ ...c, ...contractData } as Contract) : c
        )
      );
      if (selectedContract?.id === contractToEdit.id) {
        setSelectedContract((prev) =>
          prev ? ({ ...prev, ...contractData } as Contract) : null
        );
      }
      showToast(`Contract "${contractData.name}" updated successfully.`, 'success');
    } else {
      // Create new
      const newContract: Contract = {
        id: `cnt-${Date.now()}`,
        contractNumber: contractData.contractNumber || `CNT-${Date.now().toString().slice(-4)}`,
        name: contractData.name || 'New Contract Agreement',
        type: contractData.type || 'Vendor Agreement',
        description: contractData.description || '',
        companyId: currentCompany.id,
        companyName: contractData.companyName || currentCompany.name,
        contactPerson: contractData.contactPerson || 'Authorized Officer',
        contactEmail: contractData.contactEmail || 'contact@partner.in',
        contactPhone: contractData.contactPhone || '+91 98765 43210',
        departmentId: contractData.departmentId || mockDepartments[0].id,
        departmentName: contractData.departmentName || mockDepartments[0].name,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        startDate: contractData.startDate || new Date().toISOString().split('T')[0],
        endDate: contractData.endDate || new Date().toISOString().split('T')[0],
        renewalDate:
          contractData.renewalDate ||
          contractData.endDate ||
          new Date().toISOString().split('T')[0],
        noticePeriodDays: contractData.noticePeriodDays ?? 30,
        autoRenewal: contractData.autoRenewal || false,
        contractValue: contractData.contractValue || 0,
        currency: contractData.currency || 'INR',
        paymentFrequency: contractData.paymentFrequency || 'Annual',
        status: contractData.status || 'Active',
        renewalStage: 'Review',
        riskLevel: contractData.riskLevel || 'Medium',
        riskScore: contractData.riskScore || 50,
        notes: contractData.notes || '',
        customFields: contractData.customFields || [],
      };

      setContracts((prev) => [newContract, ...prev]);

      // Automatically schedule L1 reminder
      const renewalDateObj = new Date(newContract.renewalDate);
      const reminderDate30 = new Date(renewalDateObj);
      reminderDate30.setDate(reminderDate30.getDate() - 30);

      const autoReminder: Reminder = {
        id: `rem-${Date.now()}`,
        contractId: newContract.id,
        contractName: newContract.name,
        companyName: newContract.companyName,
        reminderDate: reminderDate30.toISOString().split('T')[0],
        daysBeforeExpiry: 30,
        reminderType: '30-Day Notice & Renewal Review',
        recipientEmail: newContract.contactEmail,
        recipientRole: 'Responsible Employee',
        status: 'Scheduled',
        escalationLevel: 1,
      };
      setReminders((prev) => [autoReminder, ...prev]);

      showToast(`Contract "${newContract.name}" created with automated reminders!`, 'success');
    }
  };

  const handleDeleteContract = (contractId: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== contractId));
    setReminders((prev) => prev.filter((r) => r.contractId !== contractId));
    if (selectedContract?.id === contractId) {
      setIsDetailModalOpen(false);
      setSelectedContract(null);
    }
    showToast('Contract removed from repository.', 'alert');
  };

  // Quick Renew
  const handleQuickRenew = (contract: Contract) => {
    const currentRenewal = new Date(contract.renewalDate);
    const nextRenewal = new Date(currentRenewal);
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
    const nextRenewalStr = nextRenewal.toISOString().split('T')[0];

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contract.id
          ? {
              ...c,
              renewalDate: nextRenewalStr,
              endDate: nextRenewalStr,
              status: 'Renewed',
              renewalStage: 'Completed',
              riskLevel: 'Safe',
              riskScore: 10,
            }
          : c
      )
    );

    const historyEntry: RenewalRecord = {
      id: `ren-${Date.now()}`,
      contractId: contract.id,
      contractName: contract.name,
      previousRenewalDate: contract.renewalDate,
      newRenewalDate: nextRenewalStr,
      decision: 'Renewed',
      approvedBy: currentUser.name,
      costBeforeRenewal: contract.contractValue,
      costAfterRenewal: Math.round(contract.contractValue * 1.05),
      currency: contract.currency,
      notes: `Renewed for an additional 12 months with standard CPI indexation by ${currentUser.name}.`,
      renewalDate: nextRenewalStr,
      recordedAt: new Date().toISOString(),
    };
    setRenewalHistory((prev) => [historyEntry, ...prev]);

    if (selectedContract?.id === contract.id) {
      setSelectedContract((prev) =>
        prev
          ? {
              ...prev,
              renewalDate: nextRenewalStr,
              endDate: nextRenewalStr,
              status: 'Renewed',
              renewalStage: 'Completed',
              riskLevel: 'Safe',
              riskScore: 10,
            }
          : null
      );
    }

    showToast(`Contract "${contract.name}" successfully renewed for another year!`, 'success');
  };

  // Advance Pipeline Workflow Stage
  const handleAdvanceWorkflow = (contractId: string, nextStage: RenewalStage) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, renewalStage: nextStage } : c))
    );
    if (selectedContract?.id === contractId) {
      setSelectedContract((prev) => (prev ? { ...prev, renewalStage: nextStage } : null));
    }
    showToast(`Agreement pipeline advanced to stage "${nextStage}".`, 'info');
  };

  // Immediate Escalation Action
  const handleTriggerEscalation = (contract: Contract) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contract.id
          ? {
              ...c,
              riskLevel: 'Critical',
              riskScore: Math.max(c.riskScore, 96),
              renewalStatus: 'Critical Escalation',
            }
          : c
      )
    );

    const escalationNotification: NotificationItem = {
      id: `notif-esc-${Date.now()}`,
      title: `⚠ Immediate Escalation: ${contract.name}`,
      message: `Management and legal counsel alerted regarding critical cutoff for ${contract.name} (${contract.companyName}).`,
      timestamp: 'Just now',
      read: false,
      type: 'escalation',
      contractId: contract.id,
    };
    setNotifications((prev) => [escalationNotification, ...prev]);

    showToast(
      `Executive escalation dispatched for "${contract.name}". Manager and Admin notified.`,
      'alert'
    );
  };

  // Reminder Actions
  const handleCompleteReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r))
    );
    showToast('Reminder marked as completed.', 'success');
  };

  const handleSnoozeReminder = (id: string, days: number) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextDate = new Date(r.reminderDate);
          nextDate.setDate(nextDate.getDate() + days);
          return {
            ...r,
            reminderDate: nextDate.toISOString().split('T')[0],
            status: 'Snoozed',
          };
        }
        return r;
      })
    );
    showToast(`Reminder snoozed for ${days} days.`, 'info');
  };

  const handleTestSendAlert = (reminder: Reminder) => {
    showToast(
      `Dispatched alert for "${reminder.contractName}" to ${reminder.recipientEmail} (Level ${reminder.escalationLevel})`,
      'info'
    );
  };

  const handleAddReminder = (newReminder: Partial<Reminder>) => {
    const r: Reminder = {
      id: `rem-${Date.now()}`,
      contractId: newReminder.contractId || '',
      contractName: newReminder.contractName || '',
      companyName: newReminder.companyName || '',
      reminderDate: newReminder.reminderDate || new Date().toISOString().split('T')[0],
      daysBeforeExpiry: newReminder.daysBeforeExpiry || 15,
      reminderType: newReminder.reminderType || 'Contract Expiry Notice',
      recipientEmail: newReminder.recipientEmail || currentUser.email,
      recipientRole: newReminder.recipientRole || 'Responsible Employee',
      status: 'Scheduled',
      escalationLevel: newReminder.escalationLevel || 1,
    };
    setReminders((prev) => [r, ...prev]);
    showToast('Scheduled custom reminder.', 'success');
  };

  // Add Comment
  const handleAddComment = (contractId: string, text: string) => {
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      contractId,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text,
      timestamp: 'Just now',
      resolved: false,
    };
    setComments((prev) => [newComment, ...prev]);
    showToast('Comment saved to audit trail.', 'success');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Contract Number',
      'Contract Name',
      'Type',
      'Company',
      'Department',
      'Owner',
      'Start Date',
      'End Date',
      'Renewal Date',
      'Notice Days',
      'Value',
      'Currency',
      'Status',
      'Risk Level',
      'Risk Score',
    ];

    const rows = contracts.map((c) => [
      `"${c.contractNumber}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.type}"`,
      `"${c.companyName}"`,
      `"${c.departmentName}"`,
      `"${c.ownerName}"`,
      `"${c.startDate}"`,
      `"${c.endDate}"`,
      `"${c.renewalDate}"`,
      c.noticePeriodDays,
      c.contractValue,
      `"${c.currency}"`,
      `"${c.status}"`,
      `"${c.riskLevel}"`,
      c.riskScore,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ContractGuard_Contracts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Contract CSV downloaded successfully.', 'success');
  };

  // Export Full Backup (JSON)
  const handleExportFullBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      organization: currentCompany,
      contracts,
      reminders,
      documents,
      renewalHistory,
      comments,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ContractGuard_Full_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full database backup downloaded.', 'success');
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name}! Redirecting to Dashboard...`, 'success');
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('contractly_session_token');
      localStorage.removeItem('contractly_session_user');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    showToast('Signed out successfully.', 'info');
    setCurrentTab('home');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setCurrentTab('auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans selection:bg-[#243029] selection:text-white">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#243029] text-white shadow-2xl text-xs font-medium border border-stone-700 animate-in slide-in-from-bottom duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toast.type === 'alert' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:text-stone-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Navigation - Completely removed when viewing MARS Calendar as requested */}
      {currentTab !== 'calendar' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tabId) => handleNavigate(tabId, 'forward')}
          language={currentLanguage.code}
          setLanguage={handleSelectLanguage}
          t={t}
          userRole={currentUser.role}
          setUserRole={(role: UserRole) => {
            setCurrentUser((prev) => ({ ...prev, role }));
          }}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearNotifications={handleClearNotifications}
          onOpenAddContract={handleOpenAddContract}
          onOpenAiAssistant={() => setIsAIAssistantOpen(true)}
          onOpenLanguageModal={() => setIsFirstLoginLanguageOpen(true)}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onOpenAuth={handleOpenAuth}
          onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
        />
      )}

      {/* Left Navigation Sidebar - ONLY shown in Calendar module as requested */}
      {currentTab === 'calendar' && (
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tabId) => handleNavigate(tabId, 'forward')}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          currentUser={currentUser}
          contracts={contracts}
          reminders={reminders}
          t={t}
          activeWorkspaceFilter={calendarWorkspaceFilter}
          onSelectWorkspaceFilter={(ws) => {
            setCalendarWorkspaceFilter(ws);
          }}
          activeCategoryFilter={calendarCategoryFilter}
          onSelectCategoryFilter={(cat) => {
            setCalendarCategoryFilter(cat);
          }}
          userRole={currentUser.role}
          setUserRole={(role: UserRole) => {
            setCurrentUser((prev) => ({ ...prev, role }));
          }}
        />
      )}

      {/* Viewport-fixed Minimal Arrow-Only Page Navigation Controls */}
      <PageSequenceNavigator
        currentTab={currentTab}
        onNavigate={handleNavigate}
        historyStack={historyStack}
        loop={true}
      />

      {/* Main View Area with Directional Slide & Fade Transition */}
      <main
        className={`flex-1 transition-all duration-400 ease-in-out ${
          currentTab === 'calendar' ? 'lg:pl-64' : ''
        } ${
          isTransitioning
            ? transitionDirection === 'forward'
              ? '-translate-x-5 opacity-0'
              : 'translate-x-5 opacity-0'
            : 'translate-x-0 opacity-100'
        }`}
      >
        {(currentTab === 'landing' || currentTab === 'home') && (
          <LandingPage
            t={t}
            currentLanguage={currentLanguage}
            onSelectLanguage={handleSelectLanguage}
            onOpenLanguageModal={() => setIsFirstLoginLanguageOpen(true)}
            onGetStarted={() => {
              if (isAuthenticated) {
                setCurrentTab('dashboard');
              } else {
                handleOpenAuth('signup');
              }
            }}
            onExploreContracts={() => setCurrentTab('contracts')}
            onNavigateTab={(tabId) => setCurrentTab(tabId)}
          />
        )}

        {currentTab === 'auth' && (
          <AuthView
            initialMode={authMode}
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            contracts={contracts}
            companies={mockCompanies}
            departments={mockDepartments}
            selectedCompanyId={selectedCompanyId}
            setSelectedCompanyId={(id) => {
              setSelectedCompanyId(id);
              const comp = mockCompanies.find((c) => c.id === id);
              if (comp) setCurrentCompany(comp);
            }}
            selectedDepartmentId={selectedDepartmentId}
            setSelectedDepartmentId={setSelectedDepartmentId}
            t={t}
            onSelectContract={(contract) => {
              setSelectedContract(contract);
              setIsDetailModalOpen(true);
            }}
            onAddContract={handleOpenAddContract}
            onOpenAiAssistant={() => setIsAIAssistantOpen(true)}
            onNavigateToCalendar={() => setCurrentTab('calendar')}
          />
        )}

        {currentTab === 'contracts' && (
          <ContractsView
            contracts={contracts}
            t={t}
            onSelectContract={(contract) => {
              setSelectedContract(contract);
              setIsDetailModalOpen(true);
            }}
            onAddContract={handleOpenAddContract}
            onEditContract={handleOpenEditContract}
            onDeleteContract={handleDeleteContract}
            onExportCsv={handleExportCsv}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersView
            reminders={reminders}
            contracts={contracts}
            t={t}
            onCompleteReminder={handleCompleteReminder}
            onSnoozeReminder={handleSnoozeReminder}
            onTestSendAlert={handleTestSendAlert}
            onAddReminder={handleAddReminder}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            contracts={contracts}
            reminders={reminders}
            t={t}
            onSelectContract={(contract) => {
              setSelectedContract(contract);
              setIsDetailModalOpen(true);
            }}
            onEditContract={handleOpenEditContract}
            onRenewContract={handleQuickRenew}
            onTriggerEscalation={handleTriggerEscalation}
            initialEvents={mockCalendarEvents}
            activeCategoryFilter={calendarCategoryFilter}
            onSelectCategoryFilter={setCalendarCategoryFilter}
            activeWorkspaceFilter={calendarWorkspaceFilter}
            onSelectWorkspaceFilter={setCalendarWorkspaceFilter}
            onToggleSidebar={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {currentTab === 'escalations' && (
          <EscalationsView
            contracts={contracts}
            reminders={reminders}
            t={t}
            onSelectContract={(contract) => {
              setSelectedContract(contract);
              setIsDetailModalOpen(true);
            }}
            onNavigateToCalendar={() => handleNavigate('calendar', 'forward')}
            onTriggerEscalation={handleTriggerEscalation}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentsView
            documents={documents}
            contracts={contracts}
            t={t}
            onUploadDocument={(newDoc) => {
              setDocuments((prev) => [newDoc, ...prev]);
              showToast(`Document "${newDoc.fileName}" verified and archived.`, 'success');
            }}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            contracts={contracts}
            companies={mockCompanies}
            departments={mockDepartments}
            t={t}
            onExportReport={handleExportCsv}
          />
        )}

        {(currentTab === 'workflow' || currentTab === 'renewals') && (
          <RenewalWorkflowView
            contracts={contracts}
            renewalHistory={renewalHistory}
            t={t}
            onSelectContract={(contract) => {
              setSelectedContract(contract);
              setIsDetailModalOpen(true);
            }}
            onAdvanceWorkflow={handleAdvanceWorkflow}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            t={t}
            onGetStarted={() => setCurrentTab('dashboard')}
            onExploreContracts={() => setCurrentTab('contracts')}
          />
        )}

        {currentTab === 'thankyou' && (
          <ThankYouView
            t={t}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            onGoToContracts={() => setCurrentTab('contracts')}
            onGoToReminders={() => setCurrentTab('reminders')}
            onGoToHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            currentCompany={currentCompany}
            companies={mockCompanies}
            currentUser={currentUser}
            users={mockUsers}
            currentLanguage={currentLanguage}
            onLanguageChange={(lang) => handleSelectLanguage(lang.code)}
            onCompanyChange={setCurrentCompany}
            t={t}
            onExportFullBackup={handleExportFullBackup}
          />
        )}
      </main>

      {/* Contract Detail Modal */}
      <ContractDetailModal
        contract={selectedContract}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        t={t}
        onEdit={(contract) => {
          setIsDetailModalOpen(false);
          handleOpenEditContract(contract);
        }}
        onAdvanceWorkflow={handleAdvanceWorkflow}
        onQuickRenew={handleQuickRenew}
        documents={documents}
        comments={comments}
        onAddComment={handleAddComment}
        onOpenSetReminder={(_contract) => {
          setIsDetailModalOpen(false);
          setCurrentTab('reminders');
        }}
      />

      {/* Add / Edit Contract Modal */}
      <ContractFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveContract}
        contractToEdit={contractToEdit}
        departments={mockDepartments}
        t={t}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        contracts={contracts}
        currentLanguage={currentLanguage}
      />

      {/* Language Selection Modal (Triggered by user choice) */}
      <FirstLoginLanguageModal
        isOpen={isFirstLoginLanguageOpen}
        onClose={() => setIsFirstLoginLanguageOpen(false)}
        onSelectLanguage={(code) => {
          handleSelectLanguage(code);
          setIsFirstLoginLanguageOpen(false);
        }}
        currentLanguage={currentLanguage.code}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ContractGuard • Multi-Company Indian SaaS Contract Renewal Reminder &amp; Repository
          </span>
          <div className="flex items-center gap-3">
            <span>English (Default)</span>
            <span>•</span>
            <button
              onClick={() => setIsFirstLoginLanguageOpen(true)}
              className="text-stone-600 hover:text-stone-900 underline cursor-pointer"
            >
              Choose from 22 Regional Languages
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
