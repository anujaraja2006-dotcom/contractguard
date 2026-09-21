import { RiskLevel } from '../types';

export function calculateDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateNoticeDeadline(endDateStr: string, noticePeriodDays: number): string {
  if (!endDateStr) return '';
  const end = new Date(endDateStr);
  end.setDate(end.getDate() - (noticePeriodDays || 0));
  return end.toISOString().split('T')[0];
}

export function classifyRisk(daysRemaining: number): { level: RiskLevel; score: number } {
  if (daysRemaining <= 7) {
    const score = Math.min(100, Math.max(85, 100 - daysRemaining * 2));
    return { level: 'Critical', score };
  } else if (daysRemaining <= 30) {
    const score = Math.min(84, Math.max(65, 85 - Math.round((daysRemaining - 7) * 0.8)));
    return { level: 'High', score };
  } else if (daysRemaining <= 90) {
    const score = Math.min(64, Math.max(30, 65 - Math.round((daysRemaining - 30) * 0.5)));
    return { level: 'Medium', score };
  } else {
    const score = Math.max(5, Math.min(29, Math.round(100 / (daysRemaining / 10))));
    return { level: 'Safe', score };
  }
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  } else if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US')}`;
  } else if (currency === 'EUR') {
    return `€${amount.toLocaleString('de-DE')}`;
  } else if (currency === 'GBP') {
    return `£${amount.toLocaleString('en-GB')}`;
  }
  return `${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string, format: string = 'DD/MM/YYYY'): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  } else if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  }
  return dateStr;
}

export function getRiskBadgeColor(level: RiskLevel): { bg: string; text: string; border: string; dot: string } {
  switch (level) {
    case 'Critical':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'High':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50/60',
        text: 'text-amber-800',
        border: 'border-amber-200/60',
        dot: 'bg-yellow-500',
      };
    case 'Safe':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
  }
}

export function getStatusBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Active':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'Expiring Soon':
      return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    case 'Under Review':
    case 'Pending Approval':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'Renewed':
      return { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' };
    case 'Expired':
      return { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' };
    case 'Archived':
    case 'Cancelled':
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    default:
      return { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-200' };
  }
}
