import React from 'react';
import {
  ShieldCheck,
  Award,
  Globe2,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  Lock,
  Building2,
  Sparkles,
} from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface AboutViewProps {
  t: TranslationDictionary;
  onGetStarted: () => void;
  onExploreContracts: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  t,
  onGetStarted,
  onExploreContracts,
}) => {
  return (
    <div className="w-full pb-20">
      {/* Header Banner */}
      <section className="bg-[#1F2421] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>About Contractly</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F5F0] mb-4">
            Protecting Enterprises From The High Cost of Missed Renewals
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Contractly was built to replace brittle spreadsheets with automated expiry tracking,
            structured notice window monitoring, and multi-tier escalations across modern Indian enterprises.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* The Problem & Our Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#243029]">
              Our Mission
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2 mb-4">
              Eliminating Unwanted Auto-Renewals &amp; Compliance Drift
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Over 65% of mid-to-large enterprises report having at least one critical vendor
              contract unexpectedly auto-renew at higher rates simply because the 30-day or 60-day notice
              deadline was overlooked in a spreadsheet.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Contractly provides centralized visibility, auditable workflows, and automated alerts that
              progress from responsible project leads to department heads and executive management.
            </p>
          </div>
          <div className="bg-[#FAF8F5] p-6 rounded-xl border border-stone-200/80 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Pre-Emptive 90-Day Warning Schedules</h3>
                <p className="text-xs text-stone-500 mt-0.5">Calculates exact notice cutoff dates rather than just expiry dates.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">3-Tier Escalation Hierarchy</h3>
                <p className="text-xs text-stone-500 mt-0.5">Ensures no renewal slips through when personnel change or take leave.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">English Standard with Multilingual Choice</h3>
                <p className="text-xs text-stone-500 mt-0.5">Operates in English by default, with instant switching to 22 Indian languages.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Architectural Pillars */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
              Core Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Built on Modern Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-[#243029]/8 text-[#243029] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Multi-Company Support</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Partition contracts across parent entities, subsidiaries, and joint ventures securely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-[#243029]/8 text-[#243029] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Role-Based Access</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Granular Admin, Manager, Employee, Analyst, and Viewer permissions with audit trails.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-[#243029]/8 text-[#243029] flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">OCR Document Vault</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Parse key terms, dates, and liability caps from uploaded PDF agreements automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-9 h-9 rounded-lg bg-[#243029]/8 text-[#243029] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">AI Notice Drafting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generate formal renegotiation and termination notices in English and regional languages.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 rounded-2xl bg-[#243029] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">Ready to streamline your contracts?</h3>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              Start by viewing active agreements or setting up automated reminders.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-full bg-[#FAF8F5] text-[#1A211D] hover:bg-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onExploreContracts}
              className="px-4 py-2.5 rounded-full text-white/90 hover:text-white border border-white/20 text-xs font-medium transition-colors cursor-pointer"
            >
              View Contracts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
