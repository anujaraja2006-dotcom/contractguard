import React, { useState } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Reminder, Contract, ReminderStatus } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { calculateDaysRemaining, formatDate } from '../utils/contractUtils';

interface RemindersViewProps {
  reminders: Reminder[];
  contracts: Contract[];
  t: TranslationDictionary;
  onCompleteReminder: (id: string) => void;
  onSnoozeReminder: (id: string, days: number) => void;
  onTestSendAlert: (reminder: Reminder) => void;
  onAddReminder: (newReminder: Partial<Reminder>) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  contracts,
  t,
  onCompleteReminder,
  onSnoozeReminder,
  onTestSendAlert,
  onAddReminder,
}) => {
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Completed' | 'Snoozed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || '');
  const [customDays, setCustomDays] = useState(15);
  const [customType, setCustomType] = useState('Renewal Negotiation Review');

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'Completed') return r.status === 'Completed';
    if (filter === 'Snoozed') return r.status === 'Snoozed';
    if (filter === 'Today') {
      const days = calculateDaysRemaining(r.reminderDate);
      return days === 0;
    }
    if (filter === 'Upcoming') {
      const days = calculateDaysRemaining(r.reminderDate);
      return days > 0 && r.status !== 'Completed';
    }
    return true;
  });

  const handleCreateCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const contract = contracts.find((c) => c.id === selectedContractId);
    if (!contract) return;

    const reminderDate = new Date(contract.renewalDate);
    reminderDate.setDate(reminderDate.getDate() - customDays);

    onAddReminder({
      contractId: contract.id,
      contractName: contract.name,
      companyName: contract.companyName,
      reminderDate: reminderDate.toISOString().split('T')[0],
      daysBeforeExpiry: customDays,
      reminderType: customType,
      recipientEmail: contract.contactEmail || 'lead@enterprise.in',
      recipientRole: 'Responsible Employee',
      status: 'Scheduled',
      escalationLevel: 1,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-bold">
            Automated Engine
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1C1E] mt-1.5 tracking-tight">
            Never Miss What Matters.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1.5">
            Stay ahead of every important contract deadline and multi-tier escalation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl bg-[#243029] hover:bg-[#1A231E] text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Reminder</span>
          </button>
        </div>
      </div>

      {/* 2. Escalation Architecture Reference Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            Multi-Tier Escalation Hierarchy
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              L1
            </span>
            <div>
              <div className="font-bold text-stone-900 text-sm">Responsible Employee</div>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Triggered at 90d, 60d, 30d. Direct notice to contract owner.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              L2
            </span>
            <div>
              <div className="font-bold text-amber-900 text-sm">Department Manager</div>
              <p className="text-amber-800 text-xs sm:text-sm mt-1">
                Escalates at 15d if renewal action has not been marked in-review.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              L3
            </span>
            <div>
              <div className="font-bold text-rose-900 text-sm">Executive Administrator</div>
              <p className="text-rose-800 text-xs sm:text-sm mt-1">
                Emergency escalation at 7d &amp; 1d to prevent service blackout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
        {(['All', 'Today', 'Upcoming', 'Completed', 'Snoozed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-[#243029] text-white font-bold shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Reminder Cards List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400 text-sm">
            No reminders found in this category.
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const daysRemaining = calculateDaysRemaining(reminder.reminderDate);
            const isEscalated = reminder.escalationLevel === 3;

            return (
              <div
                key={reminder.id}
                className={`bg-white p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isEscalated
                    ? 'border-rose-300 shadow-sm bg-rose-50/20'
                    : 'border-stone-200/90 shadow-xs'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                        reminder.escalationLevel === 3
                          ? 'bg-rose-100 text-rose-800'
                          : reminder.escalationLevel === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Level {reminder.escalationLevel} Escalation
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-stone-500">
                      {reminder.reminderType}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        reminder.status === 'Completed'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {reminder.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {reminder.contractName}
                  </h3>
                  <p className="text-sm text-stone-500">
                    Counterparty: <strong className="text-stone-800 font-semibold">{reminder.companyName}</strong> • Recipient: {reminder.recipientEmail} ({reminder.recipientRole})
                  </p>
                </div>

                {/* Reminder Timing & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-bold text-stone-900">
                      {formatDate(reminder.reminderDate)}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                        daysRemaining <= 0 ? 'text-rose-600 font-bold' : 'text-stone-500'
                      }`}
                    >
                      {daysRemaining === 0
                        ? 'Due Today'
                        : daysRemaining < 0
                        ? 'Passed'
                        : `In ${daysRemaining} days`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTestSendAlert(reminder)}
                      className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Trigger simulated email and in-app alert"
                    >
                      <Send className="w-4 h-4 text-stone-600" />
                      <span className="hidden sm:inline">Send Test Alert</span>
                    </button>

                    {reminder.status !== 'Completed' && (
                      <>
                        <button
                          onClick={() => onSnoozeReminder(reminder.id, 7)}
                          className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                          title="Snooze for 7 days"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Snooze</span>
                        </button>
                        <button
                          onClick={() => onCompleteReminder(reminder.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Done</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-7 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Schedule Custom Reminder</h3>
            <form onSubmit={handleCreateCustomReminder} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Select Contract</label>
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Days Before Renewal Date
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Reminder Type</label>
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="e.g. RFP Tender Preparation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#243029] text-white font-bold hover:bg-[#1A231E] cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
