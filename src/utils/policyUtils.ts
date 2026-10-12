import { Company, CompanyAutoRenewPolicy } from '../types';

export const INITIAL_COMPANY_POLICIES: Record<string, CompanyAutoRenewPolicy> = {
  'comp-1': {
    companyId: 'comp-1',
    companyName: 'ApexTech Solutions India Pvt Ltd',
    defaultNoticePeriodDays: 60,
    defaultAutoRenewalEnabled: true,
    defaultRenewalDurationMonths: 12,
    priceEscalationCapPercent: 5.0,
    renegotiationWindowDays: 30,
    autoScheduleReminders: true,
    defaultRenewalTermsTemplate:
      'Agreement automatically renews for successive 12-month periods unless written notice of non-renewal is provided at least 60 calendar days prior to the Expiry Date. Renewal fee escalation is capped at 5.0% per annum.',
    escalationWorkflow: {
      l1: {
        tier: 1,
        name: 'L1: Proactive Contract Owner Review',
        triggerDaysBeforeExpiry: [90, 60, 30],
        recipientRole: 'Contract Owner / Assigned Manager',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Initiate vendor performance audit and benchmark commercial quotes.',
      },
      l2: {
        tier: 2,
        name: 'L2: Department Lead & Legal Escalation',
        triggerDaysBeforeExpiry: [15],
        recipientRole: 'Department Head / Legal Counsel',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Authorize formal renewal term extension or issue notice of non-renewal.',
      },
      l3: {
        tier: 3,
        name: 'L3: Executive Emergency Cutoff Escalation',
        triggerDaysBeforeExpiry: [7, 1],
        recipientRole: 'Chief Operating Officer / Legal VP',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: true },
        actionRequired: 'Critical executive sign-off required prior to immutable auto-rollover deadline.',
      },
    },
    updatedAt: '2026-10-10',
    updatedBy: 'Anuj Raja (Super Admin)',
  },
  'comp-2': {
    companyId: 'comp-2',
    companyName: 'Bharat Logistics & Infra Ltd',
    defaultNoticePeriodDays: 45,
    defaultAutoRenewalEnabled: false,
    defaultRenewalDurationMonths: 12,
    priceEscalationCapPercent: 4.0,
    renegotiationWindowDays: 20,
    autoScheduleReminders: true,
    defaultRenewalTermsTemplate:
      'Contract terminates upon expiry unless bilateral written agreement is executed with 45 days prior notice. Rate renegotiations capped at 4.0% CPI.',
    escalationWorkflow: {
      l1: {
        tier: 1,
        name: 'L1: Procurement Coordinator Review',
        triggerDaysBeforeExpiry: [60, 45],
        recipientRole: 'Procurement Specialist',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: false, sms: false },
        actionRequired: 'Review fleet and freight service volume metrics and negotiate next-term discounts.',
      },
      l2: {
        tier: 2,
        name: 'L2: Supply Chain Director Review',
        triggerDaysBeforeExpiry: [20],
        recipientRole: 'Procurement Director',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Approval of vendor rate revisions or launch RFP for replacement carrier.',
      },
      l3: {
        tier: 3,
        name: 'L3: CFO Risk Committee Escalation',
        triggerDaysBeforeExpiry: [5],
        recipientRole: 'Chief Financial Officer',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: true },
        actionRequired: 'Final treasury approval for high-value logistics commitment.',
      },
    },
    updatedAt: '2026-10-08',
    updatedBy: 'Rajesh Nair',
  },
  'comp-3': {
    companyId: 'comp-3',
    companyName: 'Zenith BioCare Systems',
    defaultNoticePeriodDays: 90,
    defaultAutoRenewalEnabled: true,
    defaultRenewalDurationMonths: 24,
    priceEscalationCapPercent: 3.5,
    renegotiationWindowDays: 45,
    autoScheduleReminders: true,
    defaultRenewalTermsTemplate:
      'Healthcare and diagnostic device SLA automatically renews for successive 24-month cycles unless 90 days prior written notice is served. Annual maintenance fee adjustment capped at 3.5%.',
    escalationWorkflow: {
      l1: {
        tier: 1,
        name: 'L1: Clinical Compliance Audit',
        triggerDaysBeforeExpiry: [120, 90],
        recipientRole: 'Medical Compliance Officer',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: false, sms: false },
        actionRequired: 'Inspect medical regulatory certifications and FDA/CDSCO device approvals.',
      },
      l2: {
        tier: 2,
        name: 'L2: Healthcare Operations Escalation',
        triggerDaysBeforeExpiry: [30],
        recipientRole: 'VP Healthcare Operations',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Finalize diagnostic service warranty SLA and calibration coverage.',
      },
      l3: {
        tier: 3,
        name: 'L3: Managing Director Emergency Action',
        triggerDaysBeforeExpiry: [10, 2],
        recipientRole: 'Managing Director & Legal Board',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: true },
        actionRequired: 'Statutory compliance validation before healthcare service rollover.',
      },
    },
    updatedAt: '2026-10-05',
    updatedBy: 'Pooja Sundaram',
  },
};

/**
 * Returns the effective auto-renew policy for a given company, falling back to corporate defaults if not present.
 */
export function getCompanyAutoRenewPolicy(company: Company): CompanyAutoRenewPolicy {
  if (company.autoRenewPolicy) {
    return company.autoRenewPolicy;
  }
  if (INITIAL_COMPANY_POLICIES[company.id]) {
    return INITIAL_COMPANY_POLICIES[company.id];
  }

  // Generic fallback
  return {
    companyId: company.id,
    companyName: company.name,
    defaultNoticePeriodDays: 60,
    defaultAutoRenewalEnabled: true,
    defaultRenewalDurationMonths: 12,
    priceEscalationCapPercent: 5.0,
    renegotiationWindowDays: 30,
    autoScheduleReminders: true,
    defaultRenewalTermsTemplate:
      'Agreement automatically renews for successive 12-month periods unless written notice of non-renewal is provided at least 60 calendar days prior to the Expiry Date. Price escalation capped at 5.0% per annum.',
    escalationWorkflow: {
      l1: {
        tier: 1,
        name: 'L1: Proactive Contract Owner Review',
        triggerDaysBeforeExpiry: [90, 60, 30],
        recipientRole: 'Contract Owner',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Review performance and assess renegotiation opportunity.',
      },
      l2: {
        tier: 2,
        name: 'L2: Department Lead & Legal Escalation',
        triggerDaysBeforeExpiry: [15],
        recipientRole: 'Department Head',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: false },
        actionRequired: 'Sign off on renewal term or issue notice of non-renewal.',
      },
      l3: {
        tier: 3,
        name: 'L3: Executive Emergency Cutoff Escalation',
        triggerDaysBeforeExpiry: [7, 1],
        recipientRole: 'Executive Officer',
        autoDispatch: true,
        channels: { email: true, inApp: true, whatsapp: true, sms: true },
        actionRequired: 'Emergency executive decision before contract rollover.',
      },
    },
    updatedAt: new Date().toISOString().split('T')[0],
    updatedBy: 'ContractGuard System',
  };
}
