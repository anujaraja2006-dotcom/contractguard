import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Contract } from '../types';
import { IndianLanguage } from '../i18n/languages';
import { formatCurrency, formatDate } from '../utils/contractUtils';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: Contract[];
  currentLanguage: IndianLanguage;
  companyName?: string;
  onSelectContract?: (contract: Contract) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  citedContractIds?: string[];
  source?: 'gemini-3.8-flash' | 'offline-grounded-engine';
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  contracts,
  currentLanguage,
  companyName = 'Enterprise Organization',
  onSelectContract,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Thinking...');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>('all');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize welcome message when drawer is opened or contracts change
  useEffect(() => {
    if (messages.length === 0) {
      const criticalCount = contracts.filter((c) => c.riskLevel === 'Critical').length;
      const autoRenewCount = contracts.filter((c) => c.autoRenewal).length;

      const welcomeGreeting = `Namaste! I am your **ContractGuard AI Legal & Renewal Advisor**, powered by Gemini 3.8 Flash.

I have full operational awareness of your active repository:
- **${contracts.length} Total Contracts** for *${companyName}*
- **${criticalCount} Critical Renewals** requiring immediate attention
- **${autoRenewCount} Auto-Renewal Agreements** with automatic rollover clauses
- Language support in **English** and **22 Indian regional languages** (Hindi, Marathi, Tamil, etc.)

How can I assist you with your contracts today?`;

      setMessages([
        {
          id: 'msg-welcome',
          role: 'model',
          text: welcomeGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'gemini-3.8-flash',
        },
      ]);
    }
  }, [contracts, companyName]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '⚠️ Critical Renewals', query: 'Summarize our upcoming critical contract renewals and immediate action steps.' },
    { label: '✍️ Draft Renewal Notice', query: 'Draft an official 30-day notice of renewal letter with commercial alignment.' },
    { label: '🔄 Auto-Renewal Traps', query: 'Which contracts have automatic evergreen renewal clauses and what are their notice deadlines?' },
    { label: '💰 Exposure Summary', query: 'Calculate the total financial value commitment across all active vendor agreements.' },
    { label: `🌐 Hindi Notice Draft`, query: 'Draft an official contract renewal consultation letter in formal Hindi.' },
    { label: '🛑 Draft Non-Renewal', query: 'Draft a formal letter of non-renewal (contract termination upon expiry) for a vendor.' },
  ];

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = (textOverride || input).trim();
    if (!textToSend || isLoading) return;

    setErrorBanner(null);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textOverride) setInput('');
    setIsLoading(true);
    setLoadingStatus('Consulting contract clauses & Gemini 3.8 Flash...');

    try {
      // Build history for conversational memory
      const historyPayload = nextMessages
        .slice(-6)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          contracts: contracts.map((c) => ({
            id: c.id,
            contractNumber: c.contractNumber,
            name: c.name,
            companyName: c.companyName,
            type: c.type,
            status: c.status,
            riskLevel: c.riskLevel,
            startDate: c.startDate,
            endDate: c.endDate || c.expiryDate,
            expiryDate: c.expiryDate || c.endDate,
            renewalDate: c.renewalDate,
            noticePeriodDays: c.noticePeriodDays,
            autoRenewal: c.autoRenewal,
            contractValue: c.contractValue,
            currency: c.currency,
            renewalTerms: c.renewalTerms,
            contactPerson: c.contactPerson,
            contactEmail: c.contactEmail,
            departmentName: c.departmentName,
          })),
          companyName,
          language: currentLanguage.englishName,
          focusedContractId: selectedContractId !== 'all' ? selectedContractId : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate response.');
      }

      // Check if any contract numbers or IDs were cited in response
      const citedIds: string[] = [];
      contracts.forEach((c) => {
        if (
          data.reply.includes(c.contractNumber) ||
          data.reply.toLowerCase().includes(c.name.toLowerCase())
        ) {
          citedIds.push(c.id);
        }
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citedContractIds: citedIds.length > 0 ? Array.from(new Set(citedIds)) : undefined,
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      setErrorBanner('Failed to reach AI service. Please check your network or try again.');

      // Add a helpful local fallback message so the user is never stuck
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        text: `### Contract Advisory Note\n\nI was unable to establish a live connection to the Gemini AI API, but here is a direct summary from your local repository:\n\n• **Total Active Contracts:** ${contracts.length}\n• **Upcoming Critical Expirations:** ${
          contracts.filter((c) => c.riskLevel === 'Critical').length
        } contracts\n• **Standard Notice Window:** 30–60 days\n\nYou can review individual contract terms or click "Retry" below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'offline-grounded-engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
    setErrorBanner(null);
  };

  const activeFocusedContract =
    selectedContractId !== 'all' ? contracts.find((c) => c.id === selectedContractId) : null;

  // Simple Markdown Formatter for Assistant Responses
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Header 3
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-stone-900 dark:text-white text-sm sm:text-base mt-2 mb-1">
                {trimmed.replace(/^###\s+/, '')}
              </h4>
            );
          }

          // Header 2 / 1
          if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            return (
              <h3 key={idx} className="font-bold text-stone-900 dark:text-white text-base mt-2 mb-1">
                {trimmed.replace(/^#+\s+/, '')}
              </h3>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-emerald-600 pl-3 py-1 my-1.5 italic text-stone-700 bg-stone-100/60 rounded-r text-xs"
              >
                {trimmed.replace(/^>\s+/, '')}
              </blockquote>
            );
          }

          // Bullet List Item
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.replace(/^([•\-\*])\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Normal paragraph with inline markdown
          return (
            <p
              key={idx}
              className="text-stone-800"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  // Helper for bold and citations
  const formatInlineMarkdown = (text: string): string => {
    let formatted = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>')
      // Italics
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Citations [Contract: CNT-XXXX]
      .replace(
        /\[(Contract:\s*)?([A-Z0-9\-]+)\]/g,
        '<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">$2</span>'
      );

    return formatted;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 text-stone-900 relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#243029] text-amber-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  Ask AI — ContractGuard
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Advisor • Grounded in {contracts.length} agreements</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
              title="Close Ask AI Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Context Scope Bar */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>Context Scope:</span>
            </span>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#243029] cursor-pointer max-w-[240px] truncate"
            >
              <option value="all">Entire Repository ({contracts.length} Contracts)</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.contractNumber})
                </option>
              ))}
            </select>
          </div>

          {activeFocusedContract && (
            <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate flex items-center gap-1">
              <span>Expiry: {activeFocusedContract.expiryDate || activeFocusedContract.endDate}</span>
              <span>•</span>
              <span>{activeFocusedContract.noticePeriodDays}d notice</span>
            </div>
          )}
        </div>

        {/* Error Notification Banner */}
        {errorBanner && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#243029] text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                    isUser
                      ? 'bg-[#243029] text-white rounded-br-xs'
                      : 'bg-stone-50 border border-stone-200/90 text-stone-900 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] text-stone-400">
                    <span className="font-semibold text-stone-500 uppercase tracking-wider">
                      {isUser ? 'You' : 'ContractGuard AI'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="hover:text-stone-700 transition-colors cursor-pointer p-0.5"
                          title="Copy response text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div>
                      {renderFormattedText(msg.text)}

                      {/* Referenced Contracts Pills */}
                      {msg.citedContractIds && msg.citedContractIds.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-stone-200 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-stone-400">
                            Referenced:
                          </span>
                          {msg.citedContractIds.map((cId) => {
                            const contract = contracts.find((c) => c.id === cId);
                            if (!contract) return null;
                            return (
                              <button
                                key={cId}
                                onClick={() => onSelectContract && onSelectContract(contract)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                                title={`View details for ${contract.name}`}
                              >
                                <FileText className="w-3 h-3" />
                                <span>{contract.contractNumber}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in duration-150">
              <div className="w-7 h-7 rounded-lg bg-[#243029] text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-bl-xs bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {loadingStatus}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Grounding analysis against active repository terms and renewal clauses...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-stone-200 bg-[#FAF8F5] shrink-0">
          <div className="text-[10px] uppercase font-bold text-stone-500 mb-1.5 tracking-wider">
            Suggested Prompts:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeFocusedContract
                    ? `Ask about ${activeFocusedContract.name}...`
                    : 'Ask about renewal terms, notice periods, clauses, or draft a letter...'
                }
                disabled={isLoading}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#243029] focus:border-transparent resize-none bg-stone-50/50"
              />
              <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-between px-1">
                <span>Enter to send • Shift + Enter for new line</span>
                <span>Language: {currentLanguage.englishName}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-[#243029] hover:bg-[#1A231E] disabled:bg-stone-300 text-white font-semibold transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
