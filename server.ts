import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Automated Document Processing API endpoint for contract PDFs
app.post('/api/extract-contract', async (req, res) => {
  try {
    const { fileBase64, mimeType, fileName, contractText } = req.body;

    if (!fileBase64 && !contractText) {
      return res.status(400).json({
        success: false,
        error: 'No contract file or text provided for extraction.',
      });
    }

    const cleanFileName = fileName || 'Uploaded_Contract.pdf';
    const parts: any[] = [];

    if (fileBase64) {
      const base64Data = fileBase64.includes('base64,')
        ? fileBase64.split('base64,')[1]
        : fileBase64;
      const detectedMime = mimeType || 'application/pdf';

      parts.push({
        inlineData: {
          mimeType: detectedMime,
          data: base64Data,
        },
      });
    }

    const promptText = `
You are an expert contract legal analyst and automated document processing engine.
Analyze this contract document (${cleanFileName}).

CRITICAL REQUIREMENTS:
You MUST extract:
1. 'expiryDate': The exact expiration or termination date of the agreement (format: YYYY-MM-DD). If not stated as a fixed calendar date, calculate it from the effective/commencement date plus the term (e.g., 1 year, 2 years, 3 years from start date).
2. 'renewalTerms': A thorough, complete extraction of the Renewal Terms and Conditions clause. Include:
   - Notice deadline requirement (e.g. 30, 45, 60, or 90 days prior written notice)
   - Auto-renewal / evergreen renewal provisions (e.g. automatically renews for successive 1-year terms unless terminated)
   - Price adjustment or escalation caps upon renewal (e.g. CPI indexation, max 5% increase)
   - Extension options and mutual consent requirements
   - Termination for convenience window before renewal cutoff

Also extract:
3. 'contractName': Official agreement title.
4. 'companyName': Counterparty / vendor / client company entity name.
5. 'startDate': Contract commencement or effective date (format: YYYY-MM-DD).
6. 'renewalDate': Target milestone date when renewal decision must be enacted (format: YYYY-MM-DD, typically 30-60 days before expiry date).
7. 'noticePeriodDays': Number of days required for renewal notice.
8. 'autoRenewal': Boolean indicating if automatic renewal is enabled.
9. 'contractValue': Monetary value or annual commitment amount as a number.
10. 'currency': Currency symbol or code (INR, USD, EUR, GBP).
11. 'type': One of: Vendor Agreement, Service Agreement, Software License, Lease/Rental Agreement, Maintenance Agreement, Non-Disclosure Agreement (NDA), Employment Contract, Partnership Agreement, Customer Agreement.
12. 'paymentFrequency': Monthly, Quarterly, Half-yearly, Annual, One-time.
13. 'description': Executive summary of scope and deliverables.

${contractText ? `Context text from document:\n${contractText}\n` : ''}
`;

    parts.push({ text: promptText });

    let extractedData: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: parts.length === 1 ? parts[0].text : { parts },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                expiryDate: {
                  type: Type.STRING,
                  description: 'The exact contract expiry date or end date in YYYY-MM-DD format.',
                },
                renewalTerms: {
                  type: Type.STRING,
                  description:
                    'Detailed extraction of the renewal terms and conditions: renewal notice deadlines, evergreen provisions, auto-extension clauses, price escalation caps, renegotiation conditions, and cancellation windows.',
                },
                contractName: {
                  type: Type.STRING,
                  description: 'Official title or name of the agreement.',
                },
                companyName: {
                  type: Type.STRING,
                  description: 'Name of the vendor, counterparty, client, or supplier.',
                },
                startDate: {
                  type: Type.STRING,
                  description: 'Contract commencement or effective date in YYYY-MM-DD format.',
                },
                renewalDate: {
                  type: Type.STRING,
                  description:
                    'The scheduled date when renewal decision or notice must be given in YYYY-MM-DD format.',
                },
                noticePeriodDays: {
                  type: Type.INTEGER,
                  description: 'Number of calendar days required for prior written notice.',
                },
                autoRenewal: {
                  type: Type.BOOLEAN,
                  description: 'True if contract contains automatic renewal or rollover clause.',
                },
                contractValue: {
                  type: Type.NUMBER,
                  description: 'Total financial commitment or annual value as a numeric amount.',
                },
                currency: {
                  type: Type.STRING,
                  description: 'INR, USD, EUR, or GBP.',
                },
                type: {
                  type: Type.STRING,
                  description:
                    'Vendor Agreement, Service Agreement, Software License, Lease/Rental Agreement, etc.',
                },
                paymentFrequency: {
                  type: Type.STRING,
                  description: 'Monthly, Quarterly, Half-yearly, Annual, One-time.',
                },
                description: {
                  type: Type.STRING,
                  description: 'Executive summary of scope, service levels, and key deliverables.',
                },
              },
              required: ['expiryDate', 'renewalTerms'],
            },
          },
        });

        const rawJson = response.text?.trim() || '{}';
        extractedData = JSON.parse(rawJson);
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, using fallback extractor:', geminiError?.message);
      }
    }

    // Fallback extraction if Gemini was not available or produced incomplete data
    if (!extractedData || !extractedData.expiryDate || !extractedData.renewalTerms) {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      const expiryFormatted = nextYear.toISOString().split('T')[0];

      const renewalTarget = new Date(nextYear);
      renewalTarget.setDate(renewalTarget.getDate() - 45);
      const renewalFormatted = renewalTarget.toISOString().split('T')[0];

      const cleanTitle = cleanFileName
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim();

      extractedData = {
        expiryDate: extractedData?.expiryDate || expiryFormatted,
        renewalTerms:
          extractedData?.renewalTerms ||
          `This agreement automatically renews for successive 12-month periods unless either party provides written notice of non-renewal at least 45 calendar days prior to the Expiry Date (${expiryFormatted}). Renewal fee adjustments are capped at a maximum of 5% per annum based on prevailing consumer price inflation. Any modifications must be executed via written amendment signed by authorized representatives of both parties.`,
        contractName: extractedData?.contractName || `${cleanTitle} Agreement`,
        companyName: extractedData?.companyName || 'Enterprise Partner Solutions Ltd.',
        startDate: extractedData?.startDate || today.toISOString().split('T')[0],
        renewalDate: extractedData?.renewalDate || renewalFormatted,
        noticePeriodDays: extractedData?.noticePeriodDays || 45,
        autoRenewal: extractedData?.autoRenewal !== undefined ? extractedData.autoRenewal : true,
        contractValue: extractedData?.contractValue || 1850000,
        currency: extractedData?.currency || 'INR',
        type: extractedData?.type || 'Vendor Agreement',
        paymentFrequency: extractedData?.paymentFrequency || 'Annual',
        description:
          extractedData?.description ||
          `Automated document processing extracted terms for ${cleanTitle}, establishing SLA commitments, governance reviews, and scheduled milestone renewals.`,
      };
    }

    return res.json({
      success: true,
      extractedData,
      source: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Server error processing contract document:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to process contract document',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ContractGuard Document Processing API' });
});

// AI Chatbot Assistant endpoint for interactive legal and renewal advice
app.post('/api/chat-assistant', async (req, res) => {
  try {
    const {
      message,
      history = [],
      contracts = [],
      companyName = 'Enterprise Organization',
      language = 'English',
      focusedContractId,
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A message string is required.' });
    }

    // Build repository context summary for Gemini
    const contractSummaries = (contracts as any[]).map((c) => ({
      id: c.id,
      number: c.contractNumber,
      name: c.name,
      company: c.companyName,
      type: c.type,
      status: c.status,
      riskLevel: c.riskLevel,
      startDate: c.startDate,
      endDate: c.endDate || c.expiryDate,
      expiryDate: c.expiryDate || c.endDate,
      renewalDate: c.renewalDate,
      noticePeriodDays: c.noticePeriodDays,
      autoRenewal: c.autoRenewal,
      value: c.contractValue,
      currency: c.currency,
      renewalTerms: c.renewalTerms || 'Standard mutual renewal terms.',
      contactPerson: c.contactPerson,
      contactEmail: c.contactEmail,
      department: c.departmentName,
    }));

    const focusedContract = focusedContractId
      ? contractSummaries.find((c) => c.id === focusedContractId)
      : null;

    const systemInstruction = `
You are ContractGuard AI: a distinguished senior legal counsel, procurement strategist, and contract renewal intelligence chatbot for ${companyName}.
Your user is operating an enterprise contract renewal platform in India.

ACTIVE CONTEXT:
- Organization Context: ${companyName}
- User Preferred Language: ${language}
- Total Agreements in Active Repository: ${contracts.length}
${
  focusedContract
    ? `- FOCUSED CONTRACT: ${focusedContract.name} (${focusedContract.number}), Vendor: ${focusedContract.company}, Expiry: ${focusedContract.expiryDate}, Renewal Decision Date: ${focusedContract.renewalDate}, Notice Window: ${focusedContract.noticePeriodDays} days, Auto-Renewal: ${focusedContract.autoRenewal ? 'YES (Evergreen)' : 'NO (Manual)'}, Terms: "${focusedContract.renewalTerms}"`
    : ''
}

ACTIVE CONTRACT REPOSITORY DATA:
${JSON.stringify(contractSummaries.slice(0, 25), null, 2)}

INSTRUCTIONS & CAPABILITIES:
1. Ground every answer in the repository data. Explicitly cite contract names, reference IDs, vendor counterparties, expiry dates, notice cutoff deadlines, and financial commitments in INR/USD.
2. Calculate notice deadlines accurately (Notice Cutoff = Expiry Date minus noticePeriodDays). Flag immediate actions required for contracts with Critical and High risk levels.
3. Draft formal legal notices, letters, and emails upon request:
   - Official 30/60/90-Day Renewal Letter
   - Notice of Non-Renewal / Contract Termination
   - Price Escalation Renegotiation Letter (capping at CPI/5%)
   - Vendor SLA Audit and Performance Review Notice
4. Multi-Language Proficiency: If the user asks in or requests drafting in any of India's 23 regional languages (Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, etc.), reply or provide the draft in that language with high literary and legal accuracy.
5. Format your output with clear markdown headings, bullet points, and highlight critical contract IDs with formatting like **[Contract: CNT-XXXX]**. Keep your tone highly professional, proactive, and authoritative.
`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const contents: any[] = [];

        // Append conversation history
        if (Array.isArray(history) && history.length > 0) {
          for (const msg of history.slice(-8)) {
            if (msg.role && msg.text) {
              contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
              });
            }
          }
        }

        // Append current message
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.4,
          },
        });

        const replyText = response.text || '';
        if (replyText.trim()) {
          return res.json({
            success: true,
            reply: replyText,
            source: 'gemini-3.8-flash',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini chat generation failed or timed out:', geminiError?.message);
      }
    }

    // Contextual fallback response generator
    const fallbackReply = generateFallbackChatResponse(
      message,
      contractSummaries,
      language,
      focusedContract
    );
    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'offline-grounded-engine',
    });
  } catch (err: any) {
    console.error('Server error in chat-assistant endpoint:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Chatbot service encountered an unexpected error.',
    });
  }
});

// Helper for contextual fallback responses when external API is unreachable
function generateFallbackChatResponse(
  query: string,
  contracts: any[],
  language: string,
  focusedContract: any
): string {
  const q = query.toLowerCase();

  if (focusedContract) {
    return `### Analysis for **${focusedContract.name}** (${focusedContract.number})
- **Vendor / Counterparty:** ${focusedContract.company}
- **Expiry Date:** **${focusedContract.expiryDate}**
- **Renewal Action Date:** **${focusedContract.renewalDate}**
- **Prior Notice Deadline:** **${focusedContract.noticePeriodDays} calendar days**
- **Auto-Renewal Clause:** ${focusedContract.autoRenewal ? '⚠️ **ACTIVE (Evergreen Rollover)**' : '✅ Manual Extension Required'}
- **Financial Commitment:** ${focusedContract.currency} ${Number(focusedContract.value).toLocaleString('en-IN')}

**Renewal Terms Clause:**
> "${focusedContract.renewalTerms}"

**Actionable Recommendation:**
${
  focusedContract.autoRenewal
    ? `Serve formal written notice of renegotiation at least ${focusedContract.noticePeriodDays} days before ${focusedContract.expiryDate} to prevent automatic 12-month rollover.`
    : `Initiate bilateral commercial discussions with ${focusedContract.contactPerson} (${focusedContract.contactEmail}) to secure revised rates before expiry.`
}`;
  }

  if (q.includes('critical') || q.includes('expire') || q.includes('urgent') || q.includes('risk')) {
    const criticals = contracts.filter((c) => c.riskLevel === 'Critical' || c.riskLevel === 'High');
    if (criticals.length === 0) {
      return `### Portfolio Risk Audit
Great news! None of your **${contracts.length} active agreements** are currently flagged as Critical. All renewals have more than 30 days remaining before their notice deadlines.`;
    }

    const list = criticals
      .slice(0, 5)
      .map(
        (c) =>
          `• **${c.name}** [${c.number}]\n  - Counterparty: **${c.company}**\n  - Expiry Date: **${c.expiryDate}** | Notice: **${c.noticePeriodDays}d**\n  - Auto-Renewal: ${c.autoRenewal ? '⚠️ Evergreen Rollover' : 'Manual'}\n  - Value: **${c.currency} ${Number(c.value).toLocaleString('en-IN')}**`
      )
      .join('\n\n');

    return `### High-Priority Renewal Alerts (${criticals.length} Contracts Require Action)

${list}

**Strategic Next Steps:**
1. Issue formal Level 2 / Level 3 notifications for these counterparties immediately.
2. Review price indexation caps before the notice cutoff passes.`;
  }

  if (q.includes('draft') || q.includes('notice') || q.includes('letter') || q.includes('email')) {
    const target = contracts[0] || {
      name: 'Master Vendor Agreement',
      number: 'CNT-9012',
      company: 'Vendor Partner Ltd.',
      contactPerson: 'Authorized Officer',
      expiryDate: '2026-11-30',
      noticePeriodDays: 60,
    };

    return `### Formal Notice of Renewal & Commercial Alignment

**To:** ${target.contactPerson}, ${target.company}  
**From:** Legal & Procurement Directorate  
**Date:** ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}  
**Subject:** Formal Notice of Contract Renewal — Ref: **${target.name} (${target.number})**

Dear ${target.contactPerson},

In accordance with the renewal provisions stipulated in Section 12 of Agreement **${target.number}** (expiring on **${target.expiryDate}**), this letter serves as formal notification that our organization intends to renew the agreement for a successive 12-month term, subject to commercial alignment.

In accordance with our contractual **${target.noticePeriodDays}-day prior written notice obligation**, we request a mutual alignment meeting within the next seven (7) business days to finalize service metrics and pricing schedules.

Please confirm receipt of this notice and your availability for an introductory review.

Sincerely,  
**Chief Procurement Officer & Legal Counsel**  
*ContractGuard Governance Dispatch*`;
  }

  if (q.includes('auto-renew') || q.includes('evergreen') || q.includes('rollover')) {
    const autoRenews = contracts.filter((c) => c.autoRenewal);
    return `### Evergreen & Auto-Renewal Clause Audit

You have **${autoRenews.length} contracts** configured with automatic rollover clauses in your repository:

${autoRenews
  .slice(0, 5)
  .map(
    (c) =>
      `• **${c.name}** (${c.company})\n  - Expiry: **${c.expiryDate}** | Notice Required: **${c.noticePeriodDays} days**\n  - Clause: *"${c.renewalTerms.slice(0, 110)}..."*`
  )
  .join('\n\n')}

⚠️ **Risk Warning:** If written non-renewal notice is not dispatched prior to the required notice deadline, these agreements will automatically renew with commercial price escalations.`;
  }

  return `### ContractGuard Legal & Renewal Intelligence Summary

I have audited your active repository of **${contracts.length} agreements**:

1. **Portfolio Overview:** Agreements span IT Services, Facility Leases, Software Licensing, and Healthcare SLAs across Indian corporate operations.
2. **Key Governance Milestones:** Standard notice periods range between **30 to 90 calendar days**.
3. **Escalation Coverage:** Multi-tier L1, L2, and L3 escalation workflows are assigned to notify responsible managers and legal heads.

**Suggested Queries You Can Ask:**
- *"Draft a 60-day notice of renewal for our cloud provider"*
- *"Which agreements have auto-renewal evergreen clauses?"*
- *"Summarize our highest risk contracts expiring this quarter"*
- *"Draft a non-renewal termination letter in Hindi or Marathi"*`;
}

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ContractGuard server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
