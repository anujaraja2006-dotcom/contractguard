import React from 'react';
import {
  ArrowRight,
  Bell,
  Calendar,
  FileText,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe2,
  Check,
  Presentation,
} from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import { IndianLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages';
import { LanguageCode } from '../types';
import { FeaturedModulesCarousel } from './FeaturedModulesCarousel';
import { ThankYouSection } from './ThankYouSection';

interface LandingPageProps {
  t: TranslationDictionary;
  currentLanguage: IndianLanguage;
  onSelectLanguage: (code: LanguageCode) => void;
  onOpenLanguageModal: () => void;
  onGetStarted: () => void;
  onExploreContracts: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  t,
  currentLanguage,
  onSelectLanguage,
  onOpenLanguageModal,
  onGetStarted,
  onExploreContracts,
  onNavigateTab,
}) => {
  // Common popular Indian languages for quick single-click choice
  const featuredLanguages: LanguageCode[] = [
    'en',
    'hi',
    'ta',
    'te',
    'bn',
    'mr',
    'gu',
    'kn',
    'ml',
    'pa',
    'ur',
    'as',
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Dark, Elegant Modern Office with Subtle Dark Overlay) */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Modern calm corporate office"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#141816]/85 via-[#1A211D]/80 to-[#121614]/95"></div>
          {/* Subtle architectural grain */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto py-20 sm:py-28 flex flex-col items-center">
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 text-xs sm:text-sm tracking-widest uppercase font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.categoryTag || 'CONTRACT MANAGEMENT | SMART REMINDERS | WORKFLOW'}</span>
          </div>

          {/* Interactive Language Choice Bar on First Page */}
          <div className="flex items-center gap-2.5 mb-7 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-sm sm:text-base text-stone-200 shadow-md">
            <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Interface:{' '}
              <strong className="text-white font-semibold">
                {currentLanguage.englishName}{' '}
                {currentLanguage.code === 'en' ? '(Default English)' : `(${currentLanguage.nativeName})`}
              </strong>
            </span>
            <span className="text-stone-500">•</span>
            <button
              onClick={onOpenLanguageModal}
              className="text-emerald-300 hover:text-emerald-100 font-semibold underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              Choose Language (23 Available) ▾
            </button>
          </div>

          {/* Prominent Serif Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F7F5F0] max-w-4xl leading-[1.1] mb-7">
            {t.heroHeadline || 'Never Miss a Contract Renewal.'}
          </h1>

          {/* Short Descriptive Subtitle */}
          <p className="font-sans text-stone-200 text-lg sm:text-xl sm:max-w-2xl font-normal leading-relaxed mb-10 text-stone-200/95">
            {t.heroSubtitle ||
              'Manage contracts, track renewal dates, automate reminders, monitor risks, and make smarter renewal decisions from one intelligent platform.'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-9 py-4 rounded-full bg-[#FAF8F5] text-[#1A211D] hover:bg-white text-sm sm:text-base font-bold tracking-wider uppercase transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2.5 cursor-pointer"
            >
              <span>{t.getStarted || 'Get Started'}</span>
              <ArrowRight className="w-5 h-5 text-[#1A211D]" />
            </button>
            <button
              onClick={onExploreContracts}
              className="px-7 py-4 rounded-full text-white hover:text-white border-2 border-white/30 hover:border-white/60 text-sm sm:text-base font-semibold tracking-wide transition-colors cursor-pointer"
            >
              Explore Features
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('thankyou')}
                className="px-6 py-4 rounded-full text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/40 text-sm sm:text-base font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-2"
              >
                <Presentation className="w-4.5 h-4.5" />
                <span>Final Presentation Slide</span>
              </button>
            )}
          </div>

          {/* Trust badges below hero */}
          <div className="mt-14 pt-8 border-t border-white/15 w-full flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-stone-300 text-sm sm:text-base font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Multi-Level Automated Escalations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <span>English Standard + 22 Indian Languages</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Role-Based Access Control</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MODULES CAROUSEL (Corporate Workspace Background & 7 Intelligence Modules) */}
      <FeaturedModulesCarousel
        onNavigateTab={(tabId) => (onNavigateTab ? onNavigateTab(tabId) : onExploreContracts())}
      />

      {/* 2. SECTION — WHY CONTRACTLY (Editorial Asymmetric Layout) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#243029] bg-[#243029]/10 px-3.5 py-1.5 rounded-full">
              Why Contractly
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#1A1C1E] leading-tight tracking-tight">
              Your contracts deserve more than a spreadsheet.
            </h2>
            <p className="text-stone-600 text-lg sm:text-xl leading-relaxed">
              Spreadsheets fail when renewal dates shift, employees leave, or notice periods are
              buried in 60-page PDF agreements. Contractly proactively calculates notice deadlines,
              detects expiry risks, and triggers automated escalations.
            </p>

            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Proactive Notice Period Tracking
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                    Never get locked into an unwanted auto-renewal because a 30-day notice window
                    slipped by unnoticed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Multi-Level Escalation Engine
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                    Level 1 alerts responsible employees. If unacknowledged, alerts automatically
                    escalate to managers and executive administrators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Multilingual By Choice
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                    Operates in English by default. Switch easily at any time into any of 22 Indian
                    regional languages (including full RTL support for Urdu and Sindhi).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Image with Curved Shape */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                  alt="Business team discussing contracts"
                  className="w-full h-[440px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 max-w-[260px] hidden sm:block">
                <div className="flex items-center gap-2 text-emerald-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Renewal Precision</span>
                </div>
                <div className="font-serif text-4xl font-bold text-stone-900">100%</div>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Zero missed notice windows across all monitored portfolios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION — HOW IT WORKS (Numbered Process 01 to 04) */}
      <section className="py-20 bg-[#F4EFEA] border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-stone-500">
              Seamless Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1C1E] mt-2">
              How Contractly Works
            </h2>
            <p className="text-stone-600 text-base sm:text-lg mt-3">
              A structured lifecycle that protects your enterprise from surprise renewals and
              regulatory penalties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Add Your Contracts',
                desc: 'Upload agreements or enter details with custom fields, departments, notice periods, and counterparties.',
              },
              {
                number: '02',
                title: 'Track Important Dates',
                desc: 'Automated calculation of days remaining, notice deadlines, and portfolio risk classifications.',
              },
              {
                number: '03',
                title: 'Get Timely Reminders',
                desc: 'Configurable alerts sent at 90, 60, 30, 15, 7, and 1 day before expiry with multi-tier escalation.',
              },
              {
                number: '04',
                title: 'Renew With Confidence',
                desc: 'Follow the Review → Negotiation → Approval workflow and preserve complete historical audit logs.',
              },
            ].map((step) => (
              <div
                key={step.number}
                className="bg-white/95 p-7 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="font-serif text-5xl font-light text-stone-400 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION — KEY CAPABILITIES */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#243029]">
            Comprehensive Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1C1E] mt-2">
            Built for Modern Enterprise Operations
          </h2>
          <p className="text-stone-600 text-base sm:text-lg mt-3">
            Designed to serve healthcare, logistics, manufacturing, retail, IT, and high-growth
            enterprises without rigid assumptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: FileText,
              title: 'Contract Management',
              desc: 'Complete lifecycle CRUD with flexible types, custom metadata, auto-renewal toggles, and payment frequencies.',
            },
            {
              icon: Bell,
              title: 'Smart Reminders',
              desc: 'Pre-built 6-stage notification schedule with 3-tier escalation for responsible employees, managers, and admins.',
            },
            {
              icon: Calendar,
              title: 'Renewal Calendar',
              desc: 'Dedicated full-page Month, Week, and Day views mapping renewals, notice cutoffs, and payment obligations.',
            },
            {
              icon: ShieldCheck,
              title: 'Document Storage & OCR',
              desc: 'Store verified PDFs, DOCX files, and utilize simulated OCR extraction to parse contract terms instantly.',
            },
            {
              icon: TrendingUp,
              title: 'Analytics & Reports',
              desc: 'Real-time renewal rates, risk distributions, department budget breakdowns, and PDF/CSV exportability.',
            },
            {
              icon: Workflow,
              title: 'Workflow Management',
              desc: 'Phased pipeline guiding teams from initial review and renegotiation to formal executive approval.',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#243029]/8 text-[#243029] group-hover:bg-[#243029] group-hover:text-white transition-colors flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE MULTILINGUAL CHOICE SECTION (Choice to be Chosen) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            <span>Multilingual By Choice</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            English First, Multilingual on Demand
          </h2>
          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto mt-3 mb-10">
            The platform defaults to standard business English. If you or your team members prefer,
            you can choose to switch into any of India’s 22 official Eighth Schedule regional languages anytime.
          </p>

          {/* Quick Choice Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto mb-8">
            {featuredLanguages.map((code) => {
              const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
              if (!lang) return null;
              const isSelected = currentLanguage.code === code;
              return (
                <button
                  key={code}
                  onClick={() => onSelectLanguage(code)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#243029] text-white shadow-sm ring-2 ring-emerald-500/50'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold">{lang.nativeName}</span>
                  <span className={`text-xs ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`}>
                    ({lang.englishName})
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-colors cursor-pointer ${
                currentLanguage.code === 'en'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              Reset to English (Default)
            </button>
            <button
              onClick={onOpenLanguageModal}
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-stone-200/90 hover:bg-stone-300 text-stone-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4 text-stone-600" />
              <span>Browse All 23 Languages</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="bg-[#1A211D] text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight mb-5 text-[#F7F5F0]">
            Never let an important contract date pass unnoticed.
          </h2>
          <p className="text-stone-300 text-base sm:text-lg font-normal max-w-xl mx-auto mb-10 leading-relaxed">
            Gain immediate visibility over notice windows, counterparty terms, and renewal
            commitments with automated peace of mind.
          </p>
          <button
            onClick={onGetStarted}
            className="px-9 py-4 rounded-full bg-[#FAF8F5] text-[#1A211D] hover:bg-white text-sm sm:text-base font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            START MANAGING CONTRACTS
          </button>
        </div>
      </section>

      {/* 7. NEW THANK YOU SECTION (Full-viewport closing presentation slide) */}
      <ThankYouSection
        t={t}
        onBackToTop={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreMore={onGetStarted}
      />
    </div>
  );
};
