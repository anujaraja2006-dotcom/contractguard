export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'gu'
  | 'ur'
  | 'kn'
  | 'ml'
  | 'or'
  | 'pa'
  | 'as'
  | 'mai'
  | 'sa'
  | 'ne'
  | 'kok'
  | 'doi'
  | 'ks'
  | 'brx'
  | 'mni'
  | 'sd'
  | 'sat';

export interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  scriptSample: string;
  isRTL?: boolean;
}

export type UserRole = 'Admin' | 'Manager' | 'Employee' | 'Analyst' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  departmentId: string;
  preferredLanguage: LanguageCode;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  avatarUrl?: string;
}

export type User = UserProfile;

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  gstin?: string;
  pan?: string;
  cin?: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  leadName?: string;
  contractCount?: number;
}

export type ContractType =
  | 'Vendor Agreement'
  | 'Customer Agreement'
  | 'Employment Contract'
  | 'Lease/Rental Agreement'
  | 'Service Agreement'
  | 'Maintenance Agreement'
  | 'Software License'
  | 'Insurance Agreement'
  | 'Partnership Agreement'
  | 'Non-Disclosure Agreement (NDA)'
  | 'Custom';

export type ContractStatus =
  | 'Draft'
  | 'Active'
  | 'Expiring Soon'
  | 'Under Review'
  | 'Pending Approval'
  | 'Renewed'
  | 'Expired'
  | 'Archived'
  | 'Cancelled';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Safe';

export type PaymentFrequency =
  | 'Monthly'
  | 'Quarterly'
  | 'Half-yearly'
  | 'Annual'
  | 'One-time'
  | 'Custom';

export type RenewalStage =
  | 'Review'
  | 'Negotiation'
  | 'Approval'
  | 'Renewal'
  | 'Completed';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  name: string;
  type: ContractType | string;
  description: string;
  companyName: string; // counterparty / vendor / client
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  departmentId: string;
  departmentName: string;
  companyId: string;
  ownerId: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  renewalDate: string; // YYYY-MM-DD
  noticePeriodDays: number;
  autoRenewal: boolean;
  contractValue: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  paymentFrequency: PaymentFrequency;
  paymentDueDate?: string;
  paidAmount?: number;
  outstandingAmount?: number;
  status: ContractStatus;
  renewalStatus?: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  notes: string;
  customFields?: CustomField[];
  renewalStage?: RenewalStage;
  archived?: boolean;
}

export type ReminderStatus =
  | 'Scheduled'
  | 'Sent'
  | 'Read'
  | 'Completed'
  | 'Snoozed'
  | 'Failed';

export interface Reminder {
  id: string;
  contractId: string;
  contractName: string;
  companyName: string;
  reminderDate: string;
  daysBeforeExpiry: number;
  reminderType: string;
  recipientEmail: string;
  recipientRole: string;
  status: ReminderStatus;
  sentDate?: string;
  escalationLevel: 1 | 2 | 3;
}

export interface RenewalRecord {
  id: string;
  contractId: string;
  contractName: string;
  previousRenewalDate: string;
  newRenewalDate: string;
  decision: 'Renewed' | 'Renegotiated' | 'Extended' | 'Terminated';
  approvedBy: string;
  costBeforeRenewal: number;
  costAfterRenewal: number;
  currency: string;
  notes: string;
  renewalDate: string;
  recordedAt?: string;
}

export interface ContractDocument {
  id: string;
  contractId?: string;
  contractName?: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  category: 'Master Agreement' | 'NDA' | 'License' | 'Amendment' | 'Invoice' | 'Other';
  uploadDate: string;
  uploadedBy: string;
  version: string;
  status: 'Verified' | 'Pending Review' | 'Archived';
  storagePath?: string;
  extractedFields?: {
    contractName?: string;
    vendorName?: string;
    startDate?: string;
    endDate?: string;
    renewalDate?: string;
    noticePeriod?: number;
    contractValue?: number;
    currency?: string;
    paymentTerms?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'expiry' | 'renewal' | 'reminder' | 'payment' | 'escalation' | 'system';
  contractId?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  object: string;
  timestamp: string;
  details: string;
}

export interface CommentItem {
  id: string;
  contractId: string;
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
  resolved?: boolean;
}

export type CalendarEventType =
  | 'expiry'
  | 'renewal'
  | 'notice_period'
  | 'reminder_30'
  | 'reminder_15'
  | 'reminder_7'
  | 'escalation'
  | 'meeting'
  | 'review'
  | 'other';

export interface CalendarActivityEvent {
  id: string;
  title: string;
  eventType: CalendarEventType;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "09:00", "11:30"
  endTime?: string; // e.g. "10:00", "12:30"
  durationMinutes?: number;
  contractId?: string;
  contractName?: string;
  partyName?: string;
  category?: string;
  status?: string;
  daysRemaining?: number;
  reminderStatus?: string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  noticePeriodDays?: number;
  dotColor: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  description?: string;
  attendees?: string;
  ownerName?: string;
  requiresEscalation?: boolean;
}

