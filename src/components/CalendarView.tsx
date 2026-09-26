import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Eye,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Users,
  FileText,
  RotateCw,
  BellRing,
  X,
  Sparkles,
  ExternalLink,
  Edit,
  TrendingUp,
  MoreHorizontal,
  RefreshCw,
  Check,
  Tag,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  Contract,
  Reminder,
  CalendarActivityEvent,
  CalendarEventType,
} from '../types';
import { TranslationDictionary } from '../i18n/translations';
import {
  formatCurrency,
  formatDate,
  calculateDaysRemaining,
} from '../utils/contractUtils';

interface CalendarViewProps {
  contracts: Contract[];
  reminders: Reminder[];
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
  onEditContract?: (contract: Contract) => void;
  onRenewContract?: (contract: Contract) => void;
  onTriggerEscalation?: (contract: Contract) => void;
  initialEvents?: CalendarActivityEvent[];
  activeCategoryFilter?: string;
  onSelectCategoryFilter?: (cat: string) => void;
  activeWorkspaceFilter?: string;
  onSelectWorkspaceFilter?: (ws: string) => void;
  onToggleSidebar?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  contracts,
  reminders,
  t,
  onSelectContract,
  onEditContract,
  onRenewContract,
  onTriggerEscalation,
  initialEvents = [],
  activeCategoryFilter = 'all',
  onSelectCategoryFilter,
  activeWorkspaceFilter = 'all',
  onSelectWorkspaceFilter,
  onToggleSidebar,
}) => {
  // Navigation & View State - Default view is WEEK as requested
  const [viewType, setViewType] = useState<'Month' | 'Week' | 'Day' | 'Year'>('Week');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // September 2026
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(25); // 25 Sep 2026

  // 1. LIVE TIME ENGINE (ticking every 1000ms with real-time seconds)
  const [liveNow, setLiveNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveTimeString = liveNow.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const liveDateString = liveNow.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 2. ALL YEARS MANAGEMENT: Previous, Current & Upcoming
  const previousYears = [2021, 2022, 2023, 2024, 2025];
  const systemCurrentYear = 2026;
  const upcomingYears = [2027, 2028, 2029, 2030, 2031, 2032];
  const allYearsList = [...previousYears, systemCurrentYear, ...upcomingYears];

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [yearCategoryTab, setYearCategoryTab] = useState<'all' | 'previous' | 'current' | 'upcoming'>('all');

  // Multi-Year Data Generator & Metadata
  interface MonthSummaryItem {
    month: string;
    count: number;
    level: string;
    dots?: string[];
    highlight?: boolean;
    resolved?: boolean;
  }

  const getYearSummary = (year: number): {
    type: 'previous' | 'current' | 'upcoming';
    label: string;
    badge: string;
    totalContracts: number;
    description: string;
    months: MonthSummaryItem[];
  } => {
    if (year < 2026) {
      return {
        type: 'previous' as const,
        label: 'Historical Archive',
        badge: 'Previous Year',
        totalContracts: year === 2025 ? 38 : year === 2024 ? 31 : year === 2023 ? 22 : year === 2022 ? 14 : 9,
        description: 'Historical renewals, past performance and settled agreements. 100% resolved.',
        months: [
          { month: 'January', count: 2, level: 'Archived', dots: ['green', 'blue'] },
          { month: 'February', count: 3, level: 'Archived', dots: ['green', 'yellow'] },
          { month: 'March', count: 2, level: 'Archived', dots: ['green'] },
          { month: 'April', count: 4, level: 'Archived', dots: ['orange', 'green'] },
          { month: 'May', count: 3, level: 'Archived', dots: ['green', 'blue'] },
          { month: 'June', count: 4, level: 'Archived', dots: ['green', 'orange'] },
          { month: 'July', count: 2, level: 'Archived', dots: ['blue'] },
          { month: 'August', count: 3, level: 'Archived', dots: ['green', 'yellow'] },
          { month: 'September', count: 4, level: 'Archived', dots: ['orange', 'green'] },
          { month: 'October', count: 5, level: 'Archived', dots: ['red', 'orange', 'green'] },
          { month: 'November', count: 3, level: 'Archived', dots: ['green'] },
          { month: 'December', count: 6, level: 'Archived', dots: ['red', 'orange', 'blue'] },
        ],
      };
    } else if (year === 2026) {
      return {
        type: 'current' as const,
        label: 'Active Execution',
        badge: 'Current Year (Live)',
        totalContracts: 72,
        description: 'Current operational renewal pipeline: 12 Upcoming, 7 Expiring Soon, 3 Expired, 2 Escalations.',
        months: [
          { month: 'January', count: 3, level: 'Normal', dots: ['green', 'green', 'blue'] },
          { month: 'February', count: 5, level: 'Moderate', dots: ['green', 'orange', 'blue'] },
          { month: 'March', count: 2, level: 'Normal', dots: ['green', 'blue'] },
          { month: 'April', count: 4, level: 'Moderate', dots: ['green', 'yellow', 'blue'] },
          { month: 'May', count: 7, level: 'High', dots: ['green', 'orange', 'yellow', 'red'] },
          { month: 'June', count: 3, level: 'Normal', dots: ['green', 'blue'] },
          { month: 'July', count: 5, level: 'Moderate', dots: ['green', 'orange', 'blue'] },
          { month: 'August', count: 2, level: 'Normal', dots: ['green'] },
          { month: 'September', count: 6, level: 'High workload', highlight: true, dots: ['orange', 'yellow', 'red', 'blue'] },
          { month: 'October', count: 9, level: 'Peak workload', highlight: true, dots: ['red', 'orange', 'yellow', 'green'] },
          { month: 'November', count: 5, level: 'Moderate', dots: ['orange', 'yellow', 'green'] },
          { month: 'December', count: 11, level: 'Peak workload', highlight: true, dots: ['red', 'red', 'orange', 'yellow', 'blue'] },
        ],
      };
    } else {
      return {
        type: 'upcoming' as const,
        label: 'Strategic Pipeline',
        badge: 'Upcoming Year',
        totalContracts: year === 2027 ? 45 : year === 2028 ? 28 : year === 2029 ? 16 : year === 2030 ? 12 : 8,
        description: 'Future commitments, long-term facilities, multi-year software & lease horizons.',
        months: [
          { month: 'January', count: year === 2027 ? 4 : 2, level: 'Projected', dots: ['blue', 'green'] },
          { month: 'February', count: year === 2027 ? 3 : 1, level: 'Projected', dots: ['blue'] },
          { month: 'March', count: year === 2027 ? 5 : 3, level: 'Projected', dots: ['blue', 'orange'] },
          { month: 'April', count: year === 2027 ? 2 : 2, level: 'Projected', dots: ['green'] },
          { month: 'May', count: year === 2027 ? 6 : 2, level: 'Projected', dots: ['blue', 'yellow'] },
          { month: 'June', count: year === 2027 ? 4 : 4, level: 'Projected', dots: ['blue', 'green'] },
          { month: 'July', count: year === 2027 ? 3 : 1, level: 'Projected', dots: ['blue'] },
          { month: 'August', count: year === 2027 ? 2 : 2, level: 'Projected', dots: ['green'] },
          { month: 'September', count: year === 2027 ? 5 : 3, level: 'Projected', dots: ['blue', 'orange'] },
          { month: 'October', count: year === 2027 ? 4 : 2, level: 'Projected', dots: ['blue', 'yellow'] },
          { month: 'November', count: year === 2027 ? 3 : 2, level: 'Projected', dots: ['blue'] },
          { month: 'December', count: year === 2027 ? 4 : 4, level: 'Projected', dots: ['blue', 'green'] },
        ],
      };
    }
  };

  // Top Bar Search & Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filters State
  const [selectedContractFilter, setSelectedContractFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryFilter);
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Right-Side Detail Panel State
  const [activeEventDetail, setActiveEventDetail] = useState<CalendarActivityEvent | null>(() => {
    return initialEvents[0] || null;
  });
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState<boolean>(false);

  // Add Event Modal
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [isFastApiModalOpen, setIsFastApiModalOpen] = useState<boolean>(false);
  const [fastApiActiveTab, setFastApiActiveTab] = useState<'main' | 'calendar_router' | 'calendar_html' | 'calendar_css' | 'architecture'>('architecture');
  const [customEvents, setCustomEvents] = useState<CalendarActivityEvent[]>(initialEvents);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarEventType>('review');
  const [newEventDate, setNewEventDate] = useState('2026-09-25');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventEndTime, setNewEventEndTime] = useState('11:00 AM');
  const [newEventContractId, setNewEventContractId] = useState(contracts[0]?.id || '');
  const [newEventOwner, setNewEventOwner] = useState('Anuja');
  const [newEventNotes, setNewEventNotes] = useState('');

  // Sync external category filter from left sidebar if provided
  React.useEffect(() => {
    if (activeCategoryFilter !== 'all') {
      setSelectedCategory(activeCategoryFilter);
    }
  }, [activeCategoryFilter]);

  // Today Reference is Friday 25 September 2026
  const simulatedToday = {
    year: 2026,
    month: 8, // September
    day: 25,
    dayName: 'FRI',
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Weekdays for the primary weekly view: MON, TUE, WED, THU, FRI, SAT, SUN
  const weekDays = [
    { name: 'MON', full: 'Monday', date: '2026-09-21', dayNum: 21 },
    { name: 'TUE', full: 'Tuesday', date: '2026-09-22', dayNum: 22 },
    { name: 'WED', full: 'Wednesday', date: '2026-09-23', dayNum: 23 },
    { name: 'THU', full: 'Thursday', date: '2026-09-24', dayNum: 24 },
    { name: 'FRI', full: 'Friday', date: '2026-09-25', dayNum: 25, isToday: true },
    { name: 'SAT', full: 'Saturday', date: '2026-09-26', dayNum: 26 },
    { name: 'SUN', full: 'Sunday', date: '2026-09-27', dayNum: 27 },
  ];

  // Vertical time slots: 8 AM to 6 PM
  const timeSlots = [
    { hour: 8, label: '8 AM', timeStr: '8:00 AM' },
    { hour: 9, label: '9 AM', timeStr: '9:00 AM' },
    { hour: 10, label: '10 AM', timeStr: '10:00 AM' },
    { hour: 11, label: '11 AM', timeStr: '11:00 AM' },
    { hour: 12, label: '12 PM', timeStr: '12:00 PM' },
    { hour: 13, label: '1 PM', timeStr: '1:00 PM' },
    { hour: 14, label: '2 PM', timeStr: '2:00 PM' },
    { hour: 15, label: '3 PM', timeStr: '3:00 PM' },
    { hour: 16, label: '4 PM', timeStr: '4:00 PM' },
    { hour: 17, label: '5 PM', timeStr: '5:00 PM' },
    { hour: 18, label: '6 PM', timeStr: '6:00 PM' },
  ];

  const handleGoToToday = () => {
    setCurrentYear(simulatedToday.year);
    setCurrentMonth(simulatedToday.month);
    setSelectedDayNumber(simulatedToday.day);
    setViewType('Week');
  };

  const handlePrev = () => {
    if (viewType === 'Week') {
      setSelectedDayNumber((d) => Math.max(1, d - 7));
    } else if (viewType === 'Month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else if (viewType === 'Day') {
      setSelectedDayNumber((d) => Math.max(1, d - 1));
    } else {
      setCurrentYear((y) => y - 1);
    }
  };

  const handleNext = () => {
    if (viewType === 'Week') {
      setSelectedDayNumber((d) => Math.min(30, d + 7));
    } else if (viewType === 'Month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    } else if (viewType === 'Day') {
      setSelectedDayNumber((d) => Math.min(30, d + 1));
    } else {
      setCurrentYear((y) => y + 1);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotificationMsg('Calendar refreshed with latest contract milestones.');
      setTimeout(() => setNotificationMsg(null), 3000);
    }, 400);
  };

  // Helper to parse time string like "10:00 AM" into 24-hr fractional number
  const parseHourValue = (timeStr?: string): number => {
    if (!timeStr) return 9;
    const parts = timeStr.trim().split(' ');
    const isPM = parts[1]?.toUpperCase() === 'PM';
    const [hStr, mStr] = parts[0].split(':');
    let hour = parseInt(hStr, 10);
    const minute = mStr ? parseInt(mStr, 10) : 0;
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour + minute / 60;
  };

  // Combine generated & custom events
  const allEvents = useMemo(() => {
    return [...customEvents];
  }, [customEvents]);

  // Filter events based on top bar filters and search
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // Live search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContract = ev.contractName?.toLowerCase().includes(q) ?? false;
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesOwner = ev.ownerName?.toLowerCase().includes(q) ?? false;
        const matchesParty = ev.partyName?.toLowerCase().includes(q) ?? false;
        if (!matchesContract && !matchesTitle && !matchesOwner && !matchesParty) return false;
      }

      // Contract filter
      if (selectedContractFilter !== 'all') {
        if (ev.contractId !== selectedContractFilter) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!ev.category || !ev.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Owner filter
      if (selectedOwner !== 'all') {
        if (ev.ownerName !== selectedOwner) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (ev.status !== selectedStatus) return false;
      }

      // Sidebar Workspace Filter
      if (activeWorkspaceFilter !== 'all') {
        if (activeWorkspaceFilter === 'upcoming') {
          if (ev.eventType !== 'reminder_30' && ev.eventType !== 'review' && ev.eventType !== 'renewal') return false;
        } else if (activeWorkspaceFilter === 'expiring') {
          if (ev.status !== 'Expiring Soon' && ev.eventType !== 'expiry') return false;
        } else if (activeWorkspaceFilter === 'expired') {
          if (ev.status !== 'Expired' && ev.dotColor !== 'red') return false;
        } else if (activeWorkspaceFilter === 'escalations') {
          if (!ev.requiresEscalation && ev.eventType !== 'escalation') return false;
        }
      }

      return true;
    });
  }, [
    allEvents,
    searchQuery,
    selectedContractFilter,
    selectedCategory,
    selectedOwner,
    selectedStatus,
    activeWorkspaceFilter,
  ]);

  // Group events by date YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarActivityEvent[]>();
    filteredEvents.forEach((ev) => {
      const list = map.get(ev.date) || [];
      list.push(ev);
      map.set(ev.date, list);
    });
    return map;
  }, [filteredEvents]);

  // Open right side detail panel
  const handleOpenEventDetail = (event: CalendarActivityEvent) => {
    setActiveEventDetail(event);
    setIsDetailPanelOpen(true);
  };

  // Find related contract object for the detail panel
  const selectedContractObj = useMemo(() => {
    if (!activeEventDetail?.contractId) {
      return contracts.find((c) => c.name === activeEventDetail?.contractName) || contracts[0];
    }
    return (
      contracts.find((c) => c.id === activeEventDetail.contractId) ||
      contracts.find((c) => c.name === activeEventDetail.contractName) ||
      contracts[0]
    );
  }, [activeEventDetail, contracts]);

  // Event Card Soft Colors:
  // GREEN: Active / Normal
  // ORANGE: Renewal approaching
  // YELLOW: Notice period
  // RED: Expired / Critical / Escalation
  // BLUE: Renewed
  // PURPLE: Review / Meeting
  const getCardStyle = (dotColor: CalendarActivityEvent['dotColor']) => {
    switch (dotColor) {
      case 'green':
        return {
          bg: 'bg-emerald-50/95 hover:bg-emerald-100/90',
          border: 'border-emerald-300',
          text: 'text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800',
          indicator: 'bg-emerald-500',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50/95 hover:bg-orange-100/90',
          border: 'border-orange-300',
          text: 'text-orange-950',
          badge: 'bg-orange-100 text-orange-800',
          indicator: 'bg-orange-500',
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50/95 hover:bg-amber-100/90',
          border: 'border-amber-300',
          text: 'text-amber-950',
          badge: 'bg-amber-100 text-amber-800',
          indicator: 'bg-amber-500',
        };
      case 'red':
        return {
          bg: 'bg-rose-50/95 hover:bg-rose-100/90',
          border: 'border-rose-300',
          text: 'text-rose-950',
          badge: 'bg-rose-100 text-rose-800',
          indicator: 'bg-rose-600',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50/95 hover:bg-blue-100/90',
          border: 'border-blue-300',
          text: 'text-blue-950',
          badge: 'bg-blue-100 text-blue-800',
          indicator: 'bg-blue-500',
        };
      case 'purple':
      default:
        return {
          bg: 'bg-purple-50/95 hover:bg-purple-100/90',
          border: 'border-purple-300',
          text: 'text-purple-950',
          badge: 'bg-purple-100 text-purple-800',
          indicator: 'bg-purple-500',
        };
    }
  };

  // Quick submission for + Add Event modal
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const related = contracts.find((c) => c.id === newEventContractId);
    let dot: CalendarActivityEvent['dotColor'] = 'purple';
    if (newEventType === 'expiry' || newEventType === 'escalation') dot = 'red';
    else if (newEventType === 'reminder_30' || newEventType === 'reminder_15' || newEventType === 'reminder_7') dot = 'orange';
    else if (newEventType === 'notice_period') dot = 'yellow';
    else if (newEventType === 'renewal') dot = 'blue';

    const newEv: CalendarActivityEvent = {
      id: `ev-new-${Date.now()}`,
      title: newEventType.replace('_', ' ').toUpperCase(),
      eventType: newEventType,
      date: newEventDate,
      time: newEventTime,
      endTime: newEventEndTime,
      durationMinutes: 60,
      contractId: related?.id,
      contractName: newEventTitle,
      partyName: related?.companyName || 'Corporate Vendor',
      category: related?.type || 'Vendor',
      status: related?.status || 'Active',
      daysRemaining: related ? calculateDaysRemaining(related.renewalDate) : 30,
      priority: 'High',
      dotColor: dot,
      ownerName: newEventOwner,
      description: newEventNotes,
      requiresEscalation: newEventType === 'escalation',
    };

    setCustomEvents((prev) => [newEv, ...prev]);
    setIsAddEventModalOpen(false);
    setActiveEventDetail(newEv);
    setIsDetailPanelOpen(true);
    setNewEventTitle('');
    setNewEventNotes('');
  };

  return (
    <div className="relative max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* 1. TOP SUMMARY KPI CARDS (Compact cards above calendar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white px-4 py-3 rounded-xl border border-[#EDE8E1] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Upcoming Renewals
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#0B1528] tabular-nums">
              12
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl border border-[#EDE8E1] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Expiring This Week
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-600 tabular-nums">
              4
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl border border-[#EDE8E1] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Expired
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-rose-600 tabular-nums">
              2
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl border border-[#EDE8E1] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Pending Actions
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#C84B31] tabular-nums">
              6
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C84B31] flex items-center justify-center font-bold text-xs">
            <FileCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. TOP TOOLBAR with Live Time, Multi-Year Controls & Ordered View Selector */}
      <div className="bg-white p-3.5 rounded-xl border border-[#EDE8E1] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Today, < Previous, > Next + LIVE TIME WIDGET */}
        <div className="flex items-center flex-wrap gap-2.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              aria-label="Open MARS Calendar sidebar"
              className="lg:hidden px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#D5CEC5] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Menu className="w-4 h-4 text-[#C84B31]" />
              <span className="font-sans">MARS</span>
            </button>
          )}
          <button
            onClick={handleGoToToday}
            className="px-3.5 py-1.5 text-xs font-bold text-[#0B1528] bg-[#FAF8F5] border border-[#D5CEC5] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg p-0.5">
            <button
              onClick={handlePrev}
              aria-label="Previous time window"
              className="p-1 text-slate-600 hover:text-black hover:bg-white rounded transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next time window"
              className="p-1 text-slate-600 hover:text-black hover:bg-white rounded transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* REAL-TIME LIVE TIME DISPLAY */}
          <div className="flex items-center gap-2 bg-[#0B1528] text-white px-2.5 py-1 rounded-lg text-xs font-mono shadow-xs border border-slate-700/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">LIVE</span>
            <span className="font-bold tabular-nums text-white text-xs">{liveTimeString}</span>
            <span className="text-slate-400 text-[10px] hidden md:inline">|</span>
            <span className="text-slate-300 text-[11px] font-sans hidden md:inline">{liveDateString}</span>
          </div>
        </div>

        {/* Centre: Active Month & Year Title with Multi-Year Jump Selector */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg text-[#0B1528] tracking-tight">
              {viewType === 'Year' ? `Yearly Horizon` : `${monthNames[currentMonth]}`}
            </span>

            {/* Clickable Year Selector with Popover showing Previous, Current & Upcoming Years */}
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#FAF8F5] border border-[#D5CEC5] hover:bg-stone-100 text-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                title="Select from Previous, Current and Upcoming Years"
              >
                <span>{currentYear}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-9 z-40 w-72 bg-white rounded-xl border border-[#EDE8E1] shadow-2xl p-3 text-xs animate-in fade-in duration-100">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E1]">
                    <span className="font-bold text-[#0B1528] uppercase text-[10px] tracking-wider">
                      Select Calendar Year
                    </span>
                    <button
                      onClick={() => setIsYearDropdownOpen(false)}
                      className="text-slate-400 hover:text-black p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section 1: Previous Years */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      ⏪ Previous Years (Archived)
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {previousYears.map((yr) => (
                        <button
                          key={yr}
                          onClick={() => {
                            setCurrentYear(yr);
                            setIsYearDropdownOpen(false);
                          }}
                          className={`py-1 text-center font-mono rounded font-medium transition-colors cursor-pointer ${
                            currentYear === yr
                              ? 'bg-[#0B1528] text-white font-bold'
                              : 'bg-stone-50 hover:bg-stone-100 text-slate-700'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Current Year */}
                  <div className="mt-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-[#C84B31] uppercase tracking-wider block font-mono">
                      🌟 Current Year (Active Execution)
                    </span>
                    <button
                      onClick={() => {
                        setCurrentYear(systemCurrentYear);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full py-1.5 text-center font-mono rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        currentYear === systemCurrentYear
                          ? 'bg-[#C84B31] text-white shadow-xs'
                          : 'bg-red-50 hover:bg-red-100 text-[#C84B31] border border-red-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      {systemCurrentYear} (Active Year)
                    </button>
                  </div>

                  {/* Section 3: Upcoming Years */}
                  <div className="mt-2.5 space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block font-mono">
                      ⏩ Upcoming Years (Future Pipeline)
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {upcomingYears.map((yr) => (
                        <button
                          key={yr}
                          onClick={() => {
                            setCurrentYear(yr);
                            setIsYearDropdownOpen(false);
                          }}
                          className={`py-1 text-center font-mono rounded font-medium transition-colors cursor-pointer ${
                            currentYear === yr
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-stone-50 hover:bg-stone-100 text-slate-700'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Year Navigation Switcher Strip: Previous, Current, Upcoming */}
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono select-none">
            <span className="text-slate-400 mr-0.5">Years:</span>
            <button
              onClick={() => setCurrentYear(2025)}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                currentYear === 2025
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              2025
            </button>
            <button
              onClick={() => setCurrentYear(2026)}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                currentYear === 2026
                  ? 'bg-[#C84B31] text-white font-bold shadow-2xs'
                  : 'text-[#C84B31] hover:bg-red-50 font-bold'
              }`}
            >
              ★ 2026
            </button>
            <button
              onClick={() => setCurrentYear(2027)}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                currentYear === 2027
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              2027
            </button>
            <button
              onClick={() => setCurrentYear(2028)}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                currentYear === 2028
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              2028
            </button>
            <button
              onClick={() => setViewType('Year')}
              className="text-[#C84B31] hover:underline font-bold ml-1 cursor-pointer"
            >
              All Years →
            </button>
          </div>
        </div>

        {/* Right Side: View Selector (Strict Order: YEAR -> MONTH -> WEEK -> DAY), Search, Refresh, Notifications, More */}
        <div className="flex items-center gap-2">
          {/* View Selector: YEAR -> MONTH -> WEEK -> DAY as specified */}
          <div className="flex items-center bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg p-0.5 text-xs font-semibold">
            {(['Year', 'Month', 'Week', 'Day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewType(mode)}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all cursor-pointer ${
                  viewType === mode
                    ? 'bg-white text-[#0B1528] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Toggle Icon */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search contracts"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isSearchOpen || searchQuery
                  ? 'bg-[#0B1528] text-white border-[#0B1528]'
                  : 'bg-[#FAF8F5] border-[#D5CEC5] text-slate-700 hover:bg-stone-100'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-11 z-30 w-72 bg-white p-2 rounded-xl border border-[#EDE8E1] shadow-lg">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contract name, owner..."
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            )}
          </div>

          {/* Refresh Icon */}
          <button
            onClick={handleRefresh}
            aria-label="Refresh calendar"
            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#D5CEC5] text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#C84B31]' : ''}`} />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              setNotificationMsg('3 contracts have critical notice deadlines this week.');
              setTimeout(() => setNotificationMsg(null), 3500);
            }}
            aria-label="Notifications"
            className="p-2 rounded-lg bg-[#FAF8F5] border border-[#D5CEC5] text-slate-700 hover:bg-stone-100 transition-colors relative cursor-pointer"
          >
            <BellRing className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-1 ring-white" />
          </button>

          {/* + Add Event CTA Button */}
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#C84B31] hover:bg-[#B33D25] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Event</span>
          </button>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              aria-label="More options"
              className="p-2 rounded-lg bg-[#FAF8F5] border border-[#D5CEC5] text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-11 z-30 w-48 bg-white py-1 rounded-xl border border-[#EDE8E1] shadow-xl text-xs font-medium">
                <button
                  onClick={() => {
                    setIsAddEventModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span>Schedule Activity</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 text-slate-700"
                >
                  Print Week View
                </button>
                <button
                  onClick={() => {
                    setViewType('Month');
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 text-slate-700"
                >
                  Switch to Month
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setIsFastApiModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-[#0B1528] font-bold"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span>FastAPI Architecture</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast Bar if triggered */}
      {notificationMsg && (
        <div className="p-3 rounded-xl bg-[#0B1528] text-white text-xs font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. CALENDAR FILTERS (Compact filters: All Contracts, All Categories, All Owners, All Status) */}
      <div className="bg-white p-3 rounded-xl border border-[#EDE8E1] shadow-2xs flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pr-1">
          Filters:
        </span>

        {/* All Contracts */}
        <select
          value={selectedContractFilter}
          onChange={(e) => setSelectedContractFilter(e.target.value)}
          aria-label="Filter contracts"
          className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#0B1528] cursor-pointer"
        >
          <option value="all">All Contracts</option>
          {contracts.slice(0, 10).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* All Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter category"
          className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#0B1528] cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="Vendor">Vendor</option>
          <option value="Client">Client</option>
          <option value="Software">Software</option>
          <option value="Lease">Lease</option>
          <option value="Employee">Employee</option>
          <option value="Service">Service</option>
          <option value="Other">Other</option>
        </select>

        {/* All Owners */}
        <select
          value={selectedOwner}
          onChange={(e) => setSelectedOwner(e.target.value)}
          aria-label="Filter contract owner"
          className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#0B1528] cursor-pointer"
        >
          <option value="all">All Owners</option>
          <option value="Anuja">Anuja (Logged-in User)</option>
          <option value="Vikram">Vikram</option>
          <option value="Amitabh">Amitabh</option>
          <option value="Rajesh">Rajesh</option>
          <option value="Pooja">Pooja</option>
        </select>

        {/* All Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter status"
          className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#0B1528] cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Under Review">Under Review</option>
          <option value="Renewed">Renewed</option>
          <option value="Expired">Expired</option>
        </select>

        {(selectedContractFilter !== 'all' ||
          selectedCategory !== 'all' ||
          selectedOwner !== 'all' ||
          selectedStatus !== 'all' ||
          searchQuery) && (
          <button
            onClick={() => {
              setSelectedContractFilter('all');
              setSelectedCategory('all');
              setSelectedOwner('all');
              setSelectedStatus('all');
              setSearchQuery('');
              if (onSelectCategoryFilter) onSelectCategoryFilter('all');
              if (onSelectWorkspaceFilter) onSelectWorkspaceFilter('all');
            }}
            className="text-[11px] font-bold text-[#C84B31] hover:underline px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* 4. MAIN CALENDAR WORKSPACE */}
      <div className="flex items-start gap-4">
        {/* Calendar View Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#EDE8E1] shadow-xs overflow-hidden">
          {/* ======================================================== */}
          {/* WEEK VIEW (PRIMARY VISUAL REFERENCE)                     */}
          {/* ======================================================== */}
          {viewType === 'Week' && (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Horizontal Day Columns Header */}
                <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-[#EDE8E1] bg-[#FAF8F5]">
                  {/* Empty top-left time header */}
                  <div className="p-3 border-r border-[#EDE8E1] text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-center">
                    GMT+5:30
                  </div>

                  {/* 7 Days: MON to SUN */}
                  {weekDays.map((d) => {
                    const isToday = d.isToday;
                    return (
                      <div
                        key={d.name}
                        onClick={() => setSelectedDayNumber(d.dayNum)}
                        className={`p-3 text-center border-r border-[#EDE8E1] last:border-r-0 cursor-pointer transition-colors ${
                          isToday ? 'bg-white font-bold' : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {d.name}
                        </div>
                        <div className="mt-1 flex items-center justify-center">
                          <span
                            className={`w-7 h-7 text-sm font-extrabold flex items-center justify-center rounded-full tabular-nums ${
                              isToday
                                ? 'ring-2 ring-[#C84B31] text-[#C84B31] shadow-xs font-black'
                                : selectedDayNumber === d.dayNum
                                ? 'bg-[#0B1528] text-white'
                                : 'text-slate-800'
                            }`}
                          >
                            {d.dayNum}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Time Slots Grid (8 AM to 6 PM) */}
                <div className="grid grid-cols-[64px_repeat(7,1fr)] relative">
                  {/* Column 1: Time Labels */}
                  <div className="border-r border-[#EDE8E1] bg-[#FAF8F5]/60 select-none">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.hour}
                        className="h-20 border-b border-[#EDE8E1] pr-2 text-right text-[11px] font-mono font-medium text-slate-500 -mt-2"
                      >
                        {slot.label}
                      </div>
                    ))}
                  </div>

                  {/* Columns 2-8: 7 Day Columns with Event Cards */}
                  {weekDays.map((d) => {
                    const dayEvents = eventsByDate.get(d.date) || [];
                    const isToday = d.isToday;

                    return (
                      <div
                        key={d.date}
                        className={`relative border-r border-[#EDE8E1] last:border-r-0 h-[880px] ${
                          isToday ? 'bg-red-50/10' : ''
                        }`}
                      >
                        {/* Hour background lines */}
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.hour}
                            className="h-20 border-b border-[#EDE8E1]/80 pointer-events-none"
                          />
                        ))}

                        {/* Live Current Time Indicator line on Today (updates in real time) */}
                        {isToday && (() => {
                          const liveHourFraction = liveNow.getHours() + liveNow.getMinutes() / 60 + liveNow.getSeconds() / 3600;
                          const indicatorHour = (liveHourFraction >= 8 && liveHourFraction <= 18) ? liveHourFraction : 11.25;
                          const indicatorTopPx = Math.max(0, Math.min(840, (indicatorHour - 8) * 80));
                          return (
                            <div
                              style={{ top: `${indicatorTopPx}px` }}
                              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                            >
                              <span className="w-3 h-3 rounded-full bg-[#C84B31] -ml-1.5 shadow-md ring-2 ring-white animate-pulse" />
                              <div className="h-[2px] w-full bg-[#C84B31]" />
                              <span className="absolute -top-3.5 right-1 text-[9px] font-mono font-bold text-white bg-[#C84B31] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                {liveTimeString}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Event Cards */}
                        {dayEvents.map((act) => {
                          const hourVal = parseHourValue(act.time);
                          const topPx = Math.max(0, (hourVal - 8) * 80);
                          const heightPx = Math.max(
                            64,
                            ((act.durationMinutes || 60) / 60) * 80 - 4
                          );
                          const cardStyle = getCardStyle(act.dotColor);
                          const isSelected = activeEventDetail?.id === act.id;

                          return (
                            <div
                              key={act.id}
                              onClick={() => handleOpenEventDetail(act)}
                              style={{
                                top: `${topPx}px`,
                                height: `${heightPx}px`,
                              }}
                              className={`absolute left-1.5 right-1.5 p-2 rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs z-10 flex flex-col justify-between overflow-hidden ${
                                cardStyle.bg
                              } ${cardStyle.border} ${cardStyle.text} ${
                                isSelected ? 'ring-2 ring-[#0B1528] shadow-md scale-[1.02]' : ''
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[11px] font-bold truncate leading-tight">
                                    {act.contractName || act.title}
                                  </span>
                                  {act.requiresEscalation && (
                                    <span className="text-[10px] text-rose-600 font-black animate-pulse">
                                      ⚠
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-medium opacity-90 truncate leading-tight">
                                  {act.title}
                                </div>
                              </div>

                              <div className="pt-1 flex items-center justify-between text-[9px] opacity-80 border-t border-black/5">
                                <span className="font-mono font-bold">
                                  {act.time}
                                </span>
                                {act.ownerName && (
                                  <span className="truncate max-w-[70px]">
                                    Owner: {act.ownerName}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MONTH VIEW                                               */}
          {/* ======================================================== */}
          {viewType === 'Month' && (
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-[#EDE8E1]">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
                  const dayEvents = eventsByDate.get(dateStr) || [];
                  const isToday = dayNum === 25;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDayNumber(dayNum)}
                      className={`min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                        selectedDayNumber === dayNum
                          ? 'border-[#0B1528] bg-slate-50 ring-1 ring-[#0B1528]'
                          : 'border-[#EDE8E1] bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday
                              ? 'ring-2 ring-[#C84B31] text-[#C84B31] font-black'
                              : 'text-slate-800'
                          }`}
                        >
                          {dayNum}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 my-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const style = getCardStyle(ev.dotColor);
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEventDetail(ev);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${style.bg} ${style.border} ${style.text}`}
                            >
                              {ev.contractName || ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-slate-400 font-bold">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* DAY VIEW                                                 */}
          {/* ======================================================== */}
          {viewType === 'Day' && (
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-[#EDE8E1] pb-3 gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#0B1528] flex items-center gap-2">
                    <span>Friday 25 September 2026 Timeline</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE {liveTimeString}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {eventsByDate.get('2026-09-25')?.length || 4} scheduled business activities today
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#D5CEC5] px-2.5 py-1 rounded-lg text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span className="font-bold text-slate-800">{liveTimeString}</span>
                  <span className="text-slate-400">({liveDateString})</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { time: '9:00 AM', title: '30-Day Reminder', contract: 'Microsoft Software Licence', dot: 'orange' },
                  { time: '10:30 AM', title: 'Vendor Follow-up', contract: 'ABC Vendor Contract', dot: 'purple' },
                  { time: '1:00 PM', title: 'Contract Review', contract: 'XYZ Service Contract', dot: 'purple' },
                  { time: '3:00 PM', title: 'Manager Approval', contract: 'ABC Vendor Contract', dot: 'purple' },
                  { time: '4:00 PM', title: 'Expiry Cutoff', contract: 'DEF Service Contract', dot: 'red' },
                  { time: '5:00 PM', title: 'Escalation Deadline', contract: 'ABC Vendor Contract', dot: 'red' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-xl border border-[#EDE8E1] hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span className="w-20 text-xs font-mono font-bold text-slate-600">
                      {item.time}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dot === 'red' ? 'bg-rose-600' : item.dot === 'orange' ? 'bg-orange-500' : 'bg-purple-500'}`} />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#0B1528]">{item.contract}</div>
                      <div className="text-[11px] text-slate-500">{item.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* YEAR VIEW: ALL YEARS (UPCOMING, CURRENT & PREVIOUS)       */}
          {/* ======================================================== */}
          {viewType === 'Year' && (() => {
            const activeSummary = getYearSummary(currentYear);
            const filteredYears = allYearsList.filter((yr) => {
              if (yearCategoryTab === 'previous') return yr < 2026;
              if (yearCategoryTab === 'current') return yr === 2026;
              if (yearCategoryTab === 'upcoming') return yr > 2026;
              return true;
            });

            return (
              <div className="p-6 space-y-6">
                {/* Year View Header with Live Time & Title */}
                <div className="flex flex-wrap items-center justify-between border-b border-[#EDE8E1] pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-extrabold text-lg text-[#0B1528] tracking-tight">
                        Multi-Year Horizon & Renewal Lifecycle
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C84B31]/10 text-[#C84B31] border border-[#C84B31]/30">
                        All Years Overview
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Seamlessly view and navigate contracts across all Previous Years (2021–2025), Current Year (2026), and Upcoming Years (2027–2032).
                    </p>
                  </div>

                  {/* Live Clock Badge in Year View */}
                  <div className="flex items-center gap-2 bg-[#0B1528] text-white px-3 py-1.5 rounded-xl text-xs font-mono shadow-xs border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">LIVE TIME</span>
                    <span className="font-bold text-white tabular-nums">{liveTimeString}</span>
                  </div>
                </div>

                {/* 3 High-Level Multi-Year Comparative Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Card 1: Previous Years */}
                  <div
                    onClick={() => {
                      setYearCategoryTab('previous');
                      if (currentYear >= 2026) setCurrentYear(2025);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      currentYear < 2026
                        ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                        : 'border-[#EDE8E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">
                        ⏪ PREVIOUS YEARS
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${currentYear < 2026 ? 'bg-slate-800 text-slate-200' : 'bg-stone-100 text-slate-700'}`}>
                        2021 – 2025
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black font-mono">105 Contracts</div>
                    <p className="text-xs opacity-75 mt-0.5">Historical records & archived renewals. 100% resolved.</p>
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-current/10">
                      {previousYears.slice(-3).map((y) => (
                        <button
                          key={y}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentYear(y);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                            currentYear === y
                              ? 'bg-[#C84B31] text-white shadow-2xs'
                              : currentYear < 2026
                              ? 'bg-slate-800 text-slate-300 hover:text-white'
                              : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Current Year (Live) */}
                  <div
                    onClick={() => {
                      setYearCategoryTab('current');
                      setCurrentYear(2026);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      currentYear === 2026
                        ? 'border-[#C84B31] bg-gradient-to-br from-[#C84B31]/10 via-white to-red-50/20 ring-2 ring-[#C84B31] shadow-md'
                        : 'border-[#EDE8E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#C84B31] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] animate-ping" />
                        🌟 CURRENT YEAR
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#C84B31] text-white">
                        2026 (Live)
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black font-mono text-[#0B1528]">72 Contracts</div>
                    <p className="text-xs text-slate-600 mt-0.5">Active operational execution: 12 Upcoming, 7 Expiring Soon.</p>
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#EDE8E1]">
                      <span className="text-[11px] font-mono font-bold text-[#C84B31] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        Active Calendar Focus: Sep 2026
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Upcoming Years */}
                  <div
                    onClick={() => {
                      setYearCategoryTab('upcoming');
                      if (currentYear <= 2026) setCurrentYear(2027);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      currentYear > 2026
                        ? 'border-blue-600 bg-blue-900 text-white shadow-md'
                        : 'border-[#EDE8E1] bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80 text-blue-400">
                        ⏩ UPCOMING YEARS
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${currentYear > 2026 ? 'bg-blue-800 text-blue-200' : 'bg-blue-50 text-blue-700'}`}>
                        2027 – 2032
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black font-mono">109 Contracts</div>
                    <p className="text-xs opacity-75 mt-0.5">Forward strategic pipeline, multi-year leases & renewals.</p>
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-current/10">
                      {[2027, 2028, 2029, 2030].map((y) => (
                        <button
                          key={y}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentYear(y);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                            currentYear === y
                              ? 'bg-white text-blue-900 shadow-2xs font-black'
                              : currentYear > 2026
                              ? 'bg-blue-800 text-blue-200 hover:text-white'
                              : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All Years Category Tabs & Year Selector Pill Bar */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE8E1] space-y-3">
                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EDE8E1] text-xs font-semibold">
                      {[
                        { id: 'all', label: 'All Years Horizon' },
                        { id: 'previous', label: '⏪ Previous (2021-2025)' },
                        { id: 'current', label: '🌟 Current (2026)' },
                        { id: 'upcoming', label: '⏩ Upcoming (2027-2032)' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setYearCategoryTab(tab.id as any)}
                          className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                            yearCategoryTab === tab.id
                              ? 'bg-[#0B1528] text-white font-bold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      Showing {filteredYears.length} year{filteredYears.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Horizontal Interactive Year Selector Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider mr-1 shrink-0">
                      Select Year:
                    </span>
                    {filteredYears.map((yr) => {
                      const isSelected = currentYear === yr;
                      const isCurrent = yr === 2026;
                      const isPrev = yr < 2026;

                      return (
                        <button
                          key={yr}
                          onClick={() => setCurrentYear(yr)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? isCurrent
                                ? 'bg-[#C84B31] text-white shadow-md ring-2 ring-[#C84B31]/30 font-black'
                                : isPrev
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-blue-600 text-white shadow-md'
                              : isCurrent
                              ? 'bg-red-50 text-[#C84B31] border border-red-200 hover:bg-red-100'
                              : 'bg-white text-slate-700 border border-[#EDE8E1] hover:bg-stone-100 hover:border-slate-400'
                          }`}
                        >
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                          <span>{yr}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase font-medium ${
                              isSelected ? 'bg-black/20 text-white' : 'text-slate-400'
                            }`}
                          >
                            {isCurrent ? 'Live' : isPrev ? 'Archive' : 'Upcoming'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Year 12-Month Calendar Grid */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE8E1] pb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-[#0B1528] tracking-tight">
                        Year {currentYear} Renewal Calendar
                      </h4>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          currentYear === 2026
                            ? 'bg-red-100 text-[#C84B31]'
                            : currentYear < 2026
                            ? 'bg-stone-200 text-slate-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activeSummary.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        ({activeSummary.totalContracts} Contracts Total)
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      {activeSummary.description}
                    </p>
                  </div>

                  {/* 12 Months Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {activeSummary.months.map((m, idx) => (
                      <div
                        key={m.month}
                        onClick={() => {
                          setCurrentMonth(idx);
                          setViewType('Week');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          m.highlight && currentYear === 2026
                            ? 'border-[#C84B31] bg-[#C84B31]/5 ring-1 ring-[#C84B31] shadow-2xs hover:bg-[#C84B31]/10'
                            : 'border-[#EDE8E1] bg-white hover:border-slate-400 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#0B1528]">{m.month}</span>
                          <span className="text-xs font-mono font-bold text-[#C84B31]">
                            {m.count} Renewals
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF8F5]">
                          <span className="text-[11px] text-slate-500">{m.level}</span>
                          
                          {/* Visual Activity Dots */}
                          <div className="flex items-center gap-1">
                            {m.dots?.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className={`w-2 h-2 rounded-full ${
                                  d === 'red'
                                    ? 'bg-rose-500'
                                    : d === 'orange'
                                    ? 'bg-orange-500'
                                    : d === 'yellow'
                                    ? 'bg-amber-400'
                                    : d === 'green'
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-500'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ======================================================== */}
        {/* RIGHT-SIDE DETAIL PANEL (Calendar remains visible behind) */}
        {/* ======================================================== */}
        {activeEventDetail && (
          <div
            className={`w-80 sm:w-96 shrink-0 bg-white rounded-2xl border border-[#EDE8E1] shadow-sm p-5 space-y-4 transition-all duration-200 ${
              isDetailPanelOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Header */}
            <div className="border-b border-[#EDE8E1] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CONTRACT DETAILS
                </span>
                <h3 className="font-bold text-base text-[#0B1528] mt-0.5 truncate max-w-[240px]">
                  {activeEventDetail.contractName || selectedContractObj?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailPanelOpen(false)}
                aria-label="Close panel"
                className="text-slate-400 hover:text-black p-1 lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contract Properties List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-[#C84B31] bg-red-50 px-2 py-0.5 rounded">
                  {selectedContractObj?.status || activeEventDetail.status || 'Expiring Soon'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Contract Owner</span>
                <span className="font-bold text-slate-800">
                  {activeEventDetail.ownerName || selectedContractObj?.ownerName || 'Anuja'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800">
                  {activeEventDetail.category || selectedContractObj?.type || 'Vendor'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Start Date</span>
                <span className="font-mono font-medium text-slate-800">
                  {selectedContractObj ? formatDate(selectedContractObj.startDate) : '25 Sep 2025'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Expiry Date</span>
                <span className="font-mono font-medium text-slate-800">
                  {selectedContractObj ? formatDate(selectedContractObj.endDate) : '25 Oct 2026'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Notice Period</span>
                <span className="font-semibold text-slate-800">
                  {selectedContractObj?.noticePeriodDays || 60} Days
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Days Remaining</span>
                <span className="font-mono font-bold text-rose-600">
                  {activeEventDetail.daysRemaining ??
                    (selectedContractObj ? calculateDaysRemaining(selectedContractObj.renewalDate) : 29)}{' '}
                  days
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#FAF8F5]">
                <span className="text-slate-500">Reminder Status</span>
                <span className="font-medium text-slate-800">
                  {activeEventDetail.reminderStatus || '30-Day reminder sent'}
                </span>
              </div>

              {activeEventDetail.description && (
                <div className="pt-2 text-slate-600 text-[11px] italic bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE8E1]">
                  "{activeEventDetail.description}"
                </div>
              )}
            </div>

            {/* Actions: View Contract, Edit Contract, Renew Contract, Create Escalation */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  if (selectedContractObj) onSelectContract(selectedContractObj);
                }}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0B1528] hover:bg-slate-900 rounded-lg shadow-2xs transition-colors cursor-pointer text-center"
              >
                View Contract
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (selectedContractObj && onEditContract) {
                      onEditContract(selectedContractObj);
                    }
                  }}
                  className="py-1.5 px-3 text-xs font-semibold text-slate-700 bg-[#FAF8F5] border border-[#D5CEC5] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Contract
                </button>

                <button
                  onClick={() => {
                    if (selectedContractObj && onRenewContract) {
                      onRenewContract(selectedContractObj);
                    }
                  }}
                  className="py-1.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                >
                  Renew Contract
                </button>
              </div>

              <button
                onClick={() => {
                  if (selectedContractObj && onTriggerEscalation) {
                    onTriggerEscalation(selectedContractObj);
                  }
                }}
                className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Create Escalation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. ADD EVENT MODAL */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#EDE8E1] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE8E1] pb-3">
              <h3 className="font-bold text-base text-[#0B1528]">
                Schedule Contract Event
              </h3>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                aria-label="Close"
                className="text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contract Name / Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. ABC Vendor Contract, Renewal Review"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Event Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as CalendarEventType)}
                    className="w-full px-2.5 py-2 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="review">Renewal Review</option>
                    <option value="meeting">Renewal Meeting</option>
                    <option value="reminder_30">30-Day Reminder</option>
                    <option value="notice_period">Notice Deadline</option>
                    <option value="expiry">Expiry Cutoff</option>
                    <option value="escalation">Escalation Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Owner</label>
                  <input
                    type="text"
                    value={newEventOwner}
                    onChange={(e) => setNewEventOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newEventNotes}
                  onChange={(e) => setNewEventNotes(e.target.value)}
                  placeholder="Key agenda points or review requirements..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CEC5] rounded-lg focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EDE8E1]">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#C84B31] hover:bg-[#B33D25] rounded-lg cursor-pointer shadow-2xs"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FastAPI Codebase & Architecture Modal */}
      {isFastApiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C84B31] text-white flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0B1528]">
                    MARS Calendar — FastAPI & Jinja2 Backend Architecture
                  </h3>
                  <p className="text-xs text-stone-500">
                    Production Python stack: FastAPI + SQLite/PostgreSQL + Jinja2 + Vanilla JS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFastApiModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2 border-b border-stone-200 bg-white flex items-center gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setFastApiActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fastApiActiveTab === 'architecture'
                    ? 'bg-[#0B1528] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                📁 Architecture & Commands
              </button>
              <button
                onClick={() => setFastApiActiveTab('main')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fastApiActiveTab === 'main'
                    ? 'bg-[#0B1528] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                🐍 app/main.py
              </button>
              <button
                onClick={() => setFastApiActiveTab('calendar_router')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fastApiActiveTab === 'calendar_router'
                    ? 'bg-[#0B1528] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                🛣️ routers/pages.py & calendar.py
              </button>
              <button
                onClick={() => setFastApiActiveTab('calendar_html')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fastApiActiveTab === 'calendar_html'
                    ? 'bg-[#0B1528] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                📄 templates/calendar.html
              </button>
              <button
                onClick={() => setFastApiActiveTab('calendar_css')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fastApiActiveTab === 'calendar_css'
                    ? 'bg-[#0B1528] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                🎨 static/css/calendar.css
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-900 text-slate-100">
              {fastApiActiveTab === 'architecture' && (
                <div className="space-y-4">
                  <div className="text-emerald-400 font-bold">
                    # Contract Renewal Reminder System — Project Directory Structure
                  </div>
                  <pre className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto">
{`Contract-Renewal-Reminder-System/
├── app/
│   ├── main.py                  # FastAPI app setup, CORS, static mount, SQLite seed
│   ├── database.py              # SQLAlchemy engine (SQLite / PostgreSQL configurable)
│   ├── dependencies.py          # Session and user auth dependency
│   ├── models/
│   │   ├── user.py              # User entity (Admin/Manager/User)
│   │   ├── contract.py          # Contract model with categories & notice period
│   │   ├── reminder.py          # Milestone reminders (90, 60, 30, 14, 7 days)
│   │   ├── renewal.py           # Renewal historical records
│   │   └── escalation.py        # Critical escalation tracker
│   ├── schemas/
│   │   ├── user.py              # Auth request & response schemas
│   │   ├── contract.py          # Contract CRUD schemas
│   │   └── calendar.py          # Weekly time-grid event schemas
│   ├── services/
│   │   ├── contract_service.py  # Business logic & days remaining calculation
│   │   ├── calendar_service.py  # Weekly grid event synthesis & pastel styling
│   │   ├── reminder_service.py  # Automated reminder generation
│   │   └── escalation_service.py# SLA breach auto-escalations
│   └── routers/
│       ├── pages.py             # Jinja2 template routes (/calendar, /dashboard)
│       ├── auth.py              # Sign-in & profile API
│       ├── contracts.py         # RESTful contract operations & PDF upload
│       ├── calendar.py          # Event queries & activity scheduling
│       ├── reminders.py         # Automated reminder triggers
│       └── escalations.py       # Escalation command center
├── templates/
│   ├── calendar.html            # MARS Calendar with calendar-only sidebar & weekly grid
│   ├── dashboard.html           # Executive metrics & active contracts table
│   ├── contracts.html           # Full contract registry
│   ├── contract_details.html    # Contract dossier
│   └── login.html               # Enterprise authentication
├── static/
│   ├── css/
│   │   ├── style.css            # Base design system
│   │   └── calendar.css         # MARS Calendar pastel colors, grid & drawer
│   └── js/
│       └── calendar.js          # Client-side filtering, drawer, and search
├── requirements.txt             # Python dependencies
└── README.md                    # Setup and usage guide`}
                  </pre>

                  <div className="text-amber-400 font-bold mt-4">
                    # Terminal Commands to Run FastAPI Locally
                  </div>
                  <pre className="text-amber-200 bg-slate-950 p-4 rounded-xl border border-slate-800">
{`# 1. Install dependencies
pip install -r requirements.txt

# 2. Launch FastAPI development server
uvicorn app.main:app --reload --port 8000

# 3. Access in browser
MARS Calendar: http://localhost:8000/calendar
Interactive API Docs: http://localhost:8000/docs`}
                  </pre>
                </div>
              )}

              {fastApiActiveTab === 'main' && (
                <div>
                  <div className="text-emerald-400 font-bold mb-2"># app/main.py</div>
                  <pre className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models.contract import Contract
from app.routers import pages, auth, contracts, calendar, reminders, escalations

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MARS Calendar - Contract Renewal Reminder System",
    description="Enterprise module for contract renewal timelines, milestone tracking, and automated escalations.",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(pages.router)
app.include_router(calendar.router)
app.include_router(contracts.router)
app.include_router(auth.router)
app.include_router(reminders.router)
app.include_router(escalations.router)`}
                  </pre>
                </div>
              )}

              {fastApiActiveTab === 'calendar_router' && (
                <div>
                  <div className="text-emerald-400 font-bold mb-2"># app/routers/pages.py (Calendar Route)</div>
                  <pre className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`@router.get("/calendar", response_class=HTMLResponse)
def get_calendar_page(
    request: Request,
    view: str = "Week",
    workspace: str = "all",
    category: str = "all",
    q: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = CalendarQuery(
        view_type=view,
        workspace_filter=workspace,
        category_filter=category,
        search_query=q if q else None,
    )
    events = CalendarService.get_events(db, query)
    contracts = db.query(Contract).all()

    workspace_counts = {
        "upcoming": 12,
        "expiring": 7,
        "expired": 3,
        "escalations": 2,
    }

    categories = [
        "Vendor", "Client", "Software", "Lease", "Employee", "Service", "Other"
    ]

    return templates.TemplateResponse(
        "calendar.html",
        {
            "request": request,
            "user": user,
            "view_type": view,
            "active_workspace": workspace,
            "active_category": category,
            "workspace_counts": workspace_counts,
            "categories": categories,
            "events": events,
            "contracts": contracts,
            "current_month_name": "September 2026",
        },
    )`}
                  </pre>
                </div>
              )}

              {fastApiActiveTab === 'calendar_html' && (
                <div>
                  <div className="text-emerald-400 font-bold mb-2"># templates/calendar.html (Jinja2)</div>
                  <pre className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`<!-- 1. CALENDAR-ONLY SIDEBAR (Visible strictly in Calendar view) -->
<aside class="mars-sidebar">
  <div class="mars-sidebar-header">
    <div class="mars-logo-icon">📅</div>
    <div class="mars-brand-title">MARS Calendar</div>
  </div>

  <div class="mars-sidebar-content">
    <div class="sidebar-section-title">MY WORKSPACE</div>
    <ul class="sidebar-nav-list">
      <li class="sidebar-nav-item" data-workspace="upcoming">Upcoming Renewals <span class="badge">12</span></li>
      <li class="sidebar-nav-item" data-workspace="expiring">Expiring Soon <span class="badge">7</span></li>
      <li class="sidebar-nav-item" data-workspace="expired">Expired <span class="badge">3</span></li>
      <li class="sidebar-nav-item" data-workspace="escalations">Escalations <span class="badge">2</span></li>
    </ul>

    <div class="sidebar-section-title">CONTRACT CATEGORIES</div>
    <ul class="sidebar-nav-list">
      {% for cat in categories %}
      <li class="sidebar-category-item" data-category="{{ cat }}">{{ cat }}</li>
      {% endfor %}
    </ul>
  </div>

  <div class="mars-sidebar-footer">
    <div class="user-avatar">A</div>
    <div class="user-info">
      <span class="user-name">{{ user.full_name }}</span>
      <span class="user-role">Role: {{ user.role }}</span>
    </div>
  </div>
</aside>`}
                  </pre>
                </div>
              )}

              {fastApiActiveTab === 'calendar_css' && (
                <div>
                  <div className="text-emerald-400 font-bold mb-2"># static/css/calendar.css (Color System)</div>
                  <pre className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`/* Soft Pastel Contract Activity Color Palette */
.event-card.green   { background: #ECFDF5; border-color: #A7F3D0; border-left: 4px solid #10B981; color: #065F46; } /* Active / Normal */
.event-card.orange  { background: #FFF7ED; border-color: #FED7AA; border-left: 4px solid #F97316; color: #9A3412; } /* Renewal approaching */
.event-card.yellow  { background: #FEFCE8; border-color: #FEF08A; border-left: 4px solid #EAB308; color: #854D0E; } /* Notice period */
.event-card.red     { background: #FEF2F2; border-color: #FECACA; border-left: 4px solid #EF4444; color: #991B1B; } /* Expired / Escalation */
.event-card.blue    { background: #EFF6FF; border-color: #BFDBFE; border-left: 4px solid #3B82F6; color: #1E40AF; } /* Renewed */
.event-card.purple  { background: #FAF5FF; border-color: #E9D5FF; border-left: 4px solid #A855F7; color: #6B21A8; } /* Review / Meeting */`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                All files generated and ready in workspace: <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">app/</code>, <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">templates/</code>, <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">static/</code>
              </span>
              <button
                onClick={() => setIsFastApiModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0B1528] hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
