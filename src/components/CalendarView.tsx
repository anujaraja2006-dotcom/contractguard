import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Eye,
} from 'lucide-react';
import { Contract, Reminder } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { calculateDaysRemaining, formatCurrency, formatDate } from '../utils/contractUtils';

interface CalendarViewProps {
  contracts: Contract[];
  reminders: Reminder[];
  t: TranslationDictionary;
  onSelectContract: (contract: Contract) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  contracts,
  reminders,
  t,
  onSelectContract,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // September 2026 (index 8)
  const [viewType, setViewType] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(20);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Build calendar event items for the current month
  const getEventsForDay = (day: number) => {
    const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    const renewalEvents = contracts.filter((c) => c.renewalDate === dayStr);
    const expiryEvents = contracts.filter((c) => c.endDate === dayStr && c.renewalDate !== c.endDate);
    const reminderEvents = reminders.filter((r) => r.reminderDate === dayStr);

    return { renewalEvents, expiryEvents, reminderEvents };
  };

  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
    selectedDayNumber
  ).padStart(2, '0')}`;

  const selectedDayEvents = getEventsForDay(selectedDayNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Schedule
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1C1E] mt-1 tracking-tight">
            Renewal Calendar
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Visual month, week, and day horizons for contract expiries, renewal cutoffs, and scheduled
            reminders.
          </p>
        </div>

        {/* View Switcher & Month Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            {(['Month', 'Week', 'Day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewType(mode)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewType === mode
                    ? 'bg-white font-semibold text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-stone-100 text-stone-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-serif text-sm font-bold text-stone-800 min-w-[130px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-stone-100 text-stone-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid + Side Upcoming Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar View (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-xl bg-stone-50/50 p-2 opacity-30"></div>
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const { renewalEvents, expiryEvents, reminderEvents } = getEventsForDay(day);
              const isSelected = selectedDayNumber === day;
              const hasEvents =
                renewalEvents.length > 0 || expiryEvents.length > 0 || reminderEvents.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDayNumber(day)}
                  className={`h-24 sm:h-28 p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#243029] bg-stone-50 ring-1 ring-[#243029] shadow-xs'
                      : hasEvents
                      ? 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                      : 'border-stone-100 bg-white/70 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#243029] text-white'
                          : 'text-stone-700'
                      }`}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {renewalEvents.slice(0, 1).map((c) => (
                      <div
                        key={c.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                        title={c.name}
                      >
                        Renewal: {c.name}
                      </div>
                    ))}
                    {reminderEvents.slice(0, 1).map((r) => (
                      <div
                        key={r.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                        title={r.contractName}
                      >
                        Alert: {r.contractName}
                      </div>
                    ))}
                    {renewalEvents.length + reminderEvents.length > 2 && (
                      <div className="text-[9px] text-stone-400 font-semibold">
                        +{renewalEvents.length + reminderEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span>Contract Renewal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
              <span>Scheduled Reminder</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              <span>Critical Notice Expiry</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Selected Date Renewals & Events (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Selected Date Detail
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
              {formatDate(selectedDateStr)}
            </h3>
          </div>

          {selectedDayEvents.renewalEvents.length === 0 &&
          selectedDayEvents.reminderEvents.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              No renewals or scheduled alerts on this day.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.renewalEvents.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectContract(c)}
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Target Renewal
                    </span>
                    <span className="text-xs font-bold text-emerald-900">
                      {formatCurrency(c.contractValue, c.currency)}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 mt-1">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{c.companyName}</p>
                </div>
              ))}

              {selectedDayEvents.reminderEvents.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      Level {r.escalationLevel} Reminder
                    </span>
                    <span className="text-[10px] text-amber-900 font-medium">
                      {r.daysBeforeExpiry}d notice
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 mt-1">
                    {r.contractName}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Recipient: {r.recipientEmail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
