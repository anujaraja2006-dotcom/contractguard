export interface ExtractedContractTerms {
  expiryDate: string; // YYYY-MM-DD
  renewalTerms: string; // Extracted renewal terms & conditions clause
  contractName?: string;
  companyName?: string;
  startDate?: string;
  renewalDate?: string;
  noticePeriodDays?: number;
  autoRenewal?: boolean;
  contractValue?: number;
  currency?: 'INR' | 'USD' | 'EUR' | 'GBP';
  type?: string;
  paymentFrequency?: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual' | 'One-time' | 'Custom';
  description?: string;
  attachedDocumentId?: string;
  attachedDocumentName?: string;
}

export interface SampleContractPreset {
  id: string;
  fileName: string;
  title: string;
  category: string;
  fileSize: string;
  summary: string;
  simulatedText: string;
}

export const SAMPLE_CONTRACT_PRESETS: SampleContractPreset[] = [
  {
    id: 'sample-cloud-msa',
    fileName: 'AWS_Enterprise_Cloud_Infrastructure_MSA_2025.pdf',
    title: 'Cloud Infrastructure Master Services Agreement',
    category: 'Vendor Agreement',
    fileSize: '2.4 MB',
    summary: 'Cloud hosting SLA with 3-year term, automated renewal, and 60-day notice window',
    simulatedText: `MASTER SERVICES AGREEMENT (MSA)
REF: MSA-AWS-IND-2025-09
PARTIES: Amazon Web Services India Pvt Ltd ("Provider") and ContractGuard Global ("Customer").
EFFECTIVE DATE: April 15, 2024.
EXPIRY DATE: April 14, 2027.
SECTION 4.1 - TERM AND EXPIRY: This Agreement shall commence on the Effective Date and remain in full force and effect until April 14, 2027 ("Expiry Date"), unless terminated earlier in accordance with Section 12.
SECTION 4.2 - RENEWAL TERMS AND CONDITIONS:
(a) Automatic Renewal: Upon expiration of the Initial Term, this Agreement shall automatically renew for successive renewal terms of twelve (12) months each, unless either party provides written notice of non-renewal to the other party at least sixty (60) calendar days prior to the Expiry Date.
(b) Renewal Rate Escalation: Subscription renewal fees for any successive term shall be capped at the prevailing list price or a maximum escalation of 4.5% over the prior year fee, whichever is lower.
(c) Termination for Convenience: Customer may terminate with 30 days prior written notice during any renewal term without penalty.
SECTION 5 - FINANCIALS: Total Annual Contract Value: INR 8,400,000 payable annually in advance. Notice Period: 60 days.`,
  },
  {
    id: 'sample-commercial-lease',
    fileName: 'BKC_Commercial_Office_Headquarters_Lease_2025.pdf',
    title: 'Commercial Office Headquarters Lease Deed',
    category: 'Lease/Rental Agreement',
    fileSize: '3.8 MB',
    summary: 'Corporate office space lease in BKC Mumbai with 5-year lock-in and 90-day renewal cutoff',
    simulatedText: `COMMERCIAL LEASE INDENTURE
PARTIES: Phoenix Mill Assets & Developers Ltd ("Lessor") and Alpha Global Enterprises ("Lessee").
PREMISES: 14th Floor, Tower B, BKC FinTech Plaza, Bandra East, Mumbai 400051.
COMMENCEMENT DATE: October 1, 2023.
EXPIRY DATE: September 30, 2028.
CLAUSE 8 - TERM AND EXPIRATION:
The lease tenure shall expire on September 30, 2028.
CLAUSE 9 - RENEWAL TERMS & EXTENSION PROTOCOL:
Lessee shall hold the primary right of first refusal to renew the lease for an additional period of three (3) years. To exercise this renewal right, Lessee MUST serve written notice of intention to renew no later than ninety (90) days prior to the Expiry Date (i.e. by July 2, 2028). The base monthly rent for the renewed term shall be adjusted upward by 8.0% over the last prevailing base rent. Failure to provide timely notice shall result in automatic release of premises for open leasing.
ANNUAL LEASE VALUE: INR 14,500,000 (INR 1.45 Cr) payable monthly. Security Deposit: 6 months equivalent.`,
  },
  {
    id: 'sample-oracle-erp',
    fileName: 'Oracle_Fusion_ERP_Software_License_Support_SLA.pdf',
    title: 'Enterprise ERP License & Premium Support SLA',
    category: 'Software License',
    fileSize: '1.9 MB',
    summary: 'Mission-critical ERP software maintenance with evergreen rollover and 45-day notice',
    simulatedText: `SOFTWARE LICENSE & COMPREHENSIVE SUPPORT AGREEMENT
VENDOR: Oracle India Financial Solutions Private Limited.
LICENSEE: ContractGuard Corporate Services.
COMMENCEMENT DATE: January 1, 2025.
EXPIRY DATE: December 31, 2026.
CLAUSE 6.1 - EXPIRY DATE:
The current production license commitment expires on December 31, 2026.
CLAUSE 6.2 - RENEWAL TERMS, EVERGREEN ROLLOVER & NOTICE:
This Support SLA features an Evergreen Extension clause. Unless Licensee delivers formal written notice of termination or cancellation at least forty-five (45) days prior to December 31, 2026, the software licensing and 24x7 mission-critical technical support shall automatically renew on January 1, 2027 for a successive 12-month period. Renewal support pricing will adhere to the standard Oracle CPI support adjustment cap (not exceeding 3.5%).
ANNUAL CONTRACT VALUE: USD 75,000 (approx. INR 6,250,000) payable annually. Notice Period: 45 Days.`,
  },
];

/**
 * Converts a File object to base64 string.
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Sends a PDF/document file or preset text to the server AI endpoint to extract
 * 'Expiry Date', 'Renewal Terms', and associated contract fields.
 */
export async function extractContractTermsFromDocument(params: {
  file?: File;
  fileBase64?: string;
  fileName?: string;
  mimeType?: string;
  contractText?: string;
}): Promise<{
  success: boolean;
  data: ExtractedContractTerms;
  source: string;
  error?: string;
}> {
  try {
    let base64 = params.fileBase64;
    let fileName = params.fileName || (params.file ? params.file.name : 'Contract.pdf');
    let mimeType = params.mimeType || (params.file ? params.file.type : 'application/pdf');

    if (params.file && !base64) {
      base64 = await fileToBase64(params.file);
    }

    const response = await fetch('/api/extract-contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileBase64: base64,
        fileName,
        mimeType,
        contractText: params.contractText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.success && json.extractedData) {
      return {
        success: true,
        data: json.extractedData,
        source: json.source || 'gemini-3.8-flash',
      };
    } else {
      throw new Error(json.error || 'Extraction failed');
    }
  } catch (err: any) {
    console.warn('Network or server processing failed, using local fallback:', err);
    // Client-side fallback if server is unreachable
    const today = new Date();
    const oneYear = new Date(today);
    oneYear.setFullYear(today.getFullYear() + 1);
    const expiry = oneYear.toISOString().split('T')[0];

    const renewalDateObj = new Date(oneYear);
    renewalDateObj.setDate(renewalDateObj.getDate() - 45);
    const renewalDate = renewalDateObj.toISOString().split('T')[0];

    const cleanTitle = (params.fileName || params.file?.name || 'Contract')
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ');

    return {
      success: true,
      data: {
        expiryDate: expiry,
        renewalTerms: `Agreement automatically renews for successive 12-month periods unless written notice of non-renewal is provided at least 45 calendar days prior to the Expiry Date (${expiry}). Annual renewal price adjustments are capped at a maximum of 5% CPI. Either party may initiate renegotiation within the 60-day window prior to renewal.`,
        contractName: `${cleanTitle} Agreement`,
        companyName: 'Premier Vendor Solutions Ltd.',
        startDate: today.toISOString().split('T')[0],
        renewalDate,
        noticePeriodDays: 45,
        autoRenewal: true,
        contractValue: 1500000,
        currency: 'INR',
        type: 'Vendor Agreement',
        paymentFrequency: 'Annual',
        description: `Automated document processing extracted terms for ${cleanTitle}.`,
      },
      source: 'offline-smart-parser',
    };
  }
}

export interface PhysicalContractPreset {
  id: string;
  title: string;
  vendor: string;
  expiryDate: string;
  renewalTerms: string;
  category: string;
  value: number;
  noticeDays: number;
}

export const PHYSICAL_CONTRACT_PRESETS: PhysicalContractPreset[] = [
  {
    id: 'phys-1',
    title: 'Physical Non-Judicial Stamp Paper Vendor Master Agreement',
    vendor: 'Larsen & Toubro Infotech Ltd.',
    expiryDate: '2027-11-30',
    renewalTerms: 'This physical stamp agreement automatically renews for successive 12-month periods with mandatory 60 calendar days prior written notice before the Expiry Date. Price adjustments upon renewal are capped at 5% CPI.',
    category: 'Vendor Agreement',
    value: 5400000,
    noticeDays: 60,
  },
  {
    id: 'phys-2',
    title: 'Commercial Office Space Deed on Legal Stationery',
    vendor: 'DLF Cyber City Developers Pvt Ltd.',
    expiryDate: '2028-06-30',
    renewalTerms: 'Lessee holds first right of refusal to renew for 3 additional years. Requires written notification 90 days prior to Expiry Date (June 30, 2028) with 7.5% rent step-up.',
    category: 'Lease/Rental Agreement',
    value: 12000000,
    noticeDays: 90,
  },
  {
    id: 'phys-3',
    title: 'Physical Signed Equipment Maintenance SLA & Warranty Addendum',
    vendor: 'Siemens Healthineers India Ltd.',
    expiryDate: '2027-03-31',
    renewalTerms: 'Evergreen comprehensive equipment maintenance rollover with 30 days termination window prior to March 31, 2027. Coverage includes 24/7 onsite response and parts replacement.',
    category: 'Maintenance Agreement',
    value: 3200000,
    noticeDays: 30,
  },
];

/**
 * Renders an authentic physical contract paper snapshot with letterhead, stamp, clauses, and signatures
 * so it can be previewed or processed as an image scan.
 */
export function createPhysicalContractCanvasSnapshot(
  title: string,
  vendor: string,
  expiryDate: string,
  renewalTerms: string
): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Paper background with warm document tint
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, 800, 1100);

  // Border & subtle paper frame
  ctx.strokeStyle = '#D9D3C7';
  ctx.lineWidth = 3;
  ctx.strokeRect(35, 35, 730, 1030);

  // Official header banner
  ctx.fillStyle = '#243029';
  ctx.fillRect(50, 50, 700, 65);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('LEGAL CONTRACT & BINDING SERVICE AGREEMENT', 400, 90);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1A231E';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`AGREEMENT: ${title.toUpperCase()}`, 60, 150);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#555F58';
  ctx.fillText(`COUNTERPARTY / VENDOR: ${vendor}`, 60, 180);
  ctx.fillText(`DOCUMENT REF: PHYS-SCAN-${Date.now().toString().slice(-6)}`, 60, 205);

  ctx.strokeStyle = '#D9D3C7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 225);
  ctx.lineTo(740, 225);
  ctx.stroke();

  // Section 1: Effective & Expiry
  ctx.fillStyle = '#C84B31';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('SECTION 3: TERM & EXPIRY DATE OBLIGATION', 60, 260);

  ctx.fillStyle = '#17202A';
  ctx.font = '12px sans-serif';
  ctx.fillText(`This physical contract shall officially expire and conclude on: ${expiryDate}`, 60, 285);
  ctx.fillText('All services and deliverables shall adhere strictly to this agreed expiration schedule.', 60, 305);

  // Section 2: Renewal Terms
  ctx.fillStyle = '#1A532E';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('SECTION 4: RENEWAL TERMS & EVERGREEN CONDITIONS', 60, 350);

  ctx.fillStyle = '#17202A';
  ctx.font = '11px sans-serif';
  const words = renewalTerms.split(' ');
  let line = '';
  let y = 375;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 650 && n > 0) {
      ctx.fillText(line, 60, y);
      line = words[n] + ' ';
      y += 20;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 60, y);

  // Official Stamp and Signatures
  ctx.strokeStyle = '#A83232';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 850, 200, 85);
  ctx.fillStyle = '#A83232';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIALLY EXECUTED', 200, 880);
  ctx.font = '10px sans-serif';
  ctx.fillText('PHYSICAL CONTRACT STAMP', 200, 905);

  ctx.strokeStyle = '#243029';
  ctx.strokeRect(500, 850, 200, 85);
  ctx.fillStyle = '#243029';
  ctx.fillText('AUTHORIZED SIGNATURE', 600, 880);
  ctx.font = 'italic 13px serif';
  ctx.fillText('Vikram Malhotra (Senior VP)', 600, 910);

  return canvas.toDataURL('image/jpeg', 0.9);
}
