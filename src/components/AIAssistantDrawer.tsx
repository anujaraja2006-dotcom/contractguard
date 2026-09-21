import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw,
  Building2,
  FileText,
} from 'lucide-react';
import { Contract } from '../types';
import { IndianLanguage } from '../i18n/languages';
import { formatCurrency, formatDate } from '../utils/contractUtils';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: Contract[];
  currentLanguage: IndianLanguage;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  contracts,
  currentLanguage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am your ContractGuard AI Legal & Renewal Advisor. I can analyze risk exposure across all ${contracts.length} active agreements, summarize clause obligations, or draft multi-tier renewal notices in English or any of the 23 Indian languages. How may I assist you today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Summarize upcoming critical renewals',
    'Draft renewal notice for Apollo Health',
    'List high risk contracts this quarter',
    `Translate renewal summary to ${currentLanguage.englishName}`,
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('critical') || q.includes('upcoming') || q.includes('expire')) {
        const criticals = contracts.filter((c) => c.riskLevel === 'Critical');
        reply = `**Critical Renewal Summary (Immediate Action Required):**\n\nThere are **${criticals.length} contracts** expiring within the next 7 days:\n` +
          criticals
            .map(
              (c) =>
                `• **${c.name}** (${c.companyName})\n  Renewal Date: **${formatDate(
                  c.renewalDate
                )}** | Value: **${formatCurrency(c.contractValue, c.currency)}**\n  Action: Contact ${c.contactPerson} (${c.contactEmail}) immediately.`
            )
            .join('\n\n') +
          `\n\n*Recommendation:* Initiate Level 3 Executive escalations to prevent operational disruption.`;
      } else if (q.includes('draft') || q.includes('email') || q.includes('notice')) {
        reply = `**Subject:** Official Notice of Contract Renewal — Agreement Ref: AGT-2026-APO\n\nDear Apollo Health Partner,\n\nWe would like to formally initiate the renewal consultation for our Corporate Health & Wellness Services Agreement, due on **October 15, 2026**.\n\nIn accordance with Section 8.2 (Notice Period: 30 days), our legal and HR departments have approved extending our collaboration with optimized terms.\n\nPlease confirm your availability for a 20-minute alignment call this Thursday at 3:00 PM IST.\n\nWarm regards,\n**Contract Management Team**\nContractGuard Automated Dispatch`;
      } else if (q.includes('translate') || q.includes('hindi') || q.includes('marathi') || q.includes('tamil')) {
        reply = `**नवीकरण सूचना (Renewal Notice in ${currentLanguage.englishName}):**\n\nआदरणीय भागीदार,\n\nआमच्या कॉर्पोरेट सेवा कराराचे नूतनीकरण करण्याची मुदत जवळ आली आहे. कराराच्या अटींनुसार, कृपया नवीन मुदतीच्या संदर्भात आपल्या सहमतीची पुष्टी करावी.\n\nआपला नम्र,\nकॉन्ट्रॅक्टगार्ड व्यवस्थापन संघ`;
      } else {
        reply = `Based on your contract repository (${contracts.length} agreements total), your highest exposure lies in IT Cloud Infrastructure and Facility Leases. All agreements adhere to Indian compliance regulations and are audited for standard 30-to-60-day notice cutoff windows.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#243029] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                ContractGuard AI Assistant
              </h3>
              <p className="text-[11px] text-stone-500">
                Contextual intelligence across {contracts.length} agreements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-stone-50/70 border-b border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium bg-white px-2.5 py-1 rounded-full border border-stone-200 text-stone-700 hover:border-stone-400 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#243029] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#243029] text-white rounded-tr-xs'
                      : 'bg-stone-100/80 text-stone-900 rounded-tl-xs border border-stone-200/60'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 flex items-center justify-between ${
                      isUser ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(m.text, m.id)}
                        className="hover:text-stone-700 ml-2"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-[#243029] text-white flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-xs text-xs text-stone-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-stone-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about renewals, legal terms, or drafts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#243029] bg-stone-50/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-[#243029] text-white hover:bg-[#1A231E] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
