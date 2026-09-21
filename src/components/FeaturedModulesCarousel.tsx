import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Bell,
  FolderOpen,
  BarChart3,
  RefreshCw,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export interface ModuleItem {
  id: string;
  name: string;
  desc: string;
  tabId: string;
  icon: React.ElementType;
}

export const MODULES: ModuleItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    desc: 'Get a real-time overview of your contracts, renewals, reminders, and key business metrics in one place.',
    tabId: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'contracts',
    name: 'Contracts',
    desc: 'Create, upload, organize, and track every contract from creation to signature and renewal.',
    tabId: 'contracts',
    icon: FileEdit,
  },
  {
    id: 'reminders',
    name: 'Reminders',
    desc: 'Never miss an important deadline with smart reminders for upcoming expirations and renewals.',
    tabId: 'reminders',
    icon: Bell,
  },
  {
    id: 'documents',
    name: 'Documents',
    desc: 'Securely centralize contracts and supporting documents so everything is easy to access when you need them.',
    tabId: 'documents',
    icon: FolderOpen,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    desc: 'Turn contract data into actionable insights with visual reports, trends, KPIs, and performance analytics.',
    tabId: 'analytics',
    icon: BarChart3,
  },
  {
    id: 'renewals',
    name: 'Renewals',
    desc: 'Stay ahead of upcoming renewals with proactive tracking, renewal workflows, alerts, and status monitoring.',
    tabId: 'workflow',
    icon: RefreshCw,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    desc: 'View contract expirations, renewal dates, reminders, meetings, and important deadlines in one unified calendar.',
    tabId: 'calendar',
    icon: CalendarDays,
  },
];

interface FeaturedModulesCarouselProps {
  onNavigateTab: (tabId: string) => void;
}

export const FeaturedModulesCarousel: React.FC<FeaturedModulesCarouselProps> = ({
  onNavigateTab,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  const total = MODULES.length;

  // Auto-advance every 4.5 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Touch Swipe Support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  // Keyboard navigation when carousel is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Computes the shortest circular offset from active index (-3 to +3)
  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Small clean product preview for the active center card
  const renderActiveProductPreview = (id: string) => {
    switch (id) {
      case 'dashboard':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>PORTFOLIO OVERVIEW</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-2xs">
                <span className="block text-xs font-bold text-[#0F172A]">142</span>
                <span className="text-[10px] text-slate-500">Contracts</span>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-2xs">
                <span className="block text-xs font-bold text-amber-600">8</span>
                <span className="text-[10px] text-slate-500">Expiring</span>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-2xs">
                <span className="block text-xs font-bold text-[#2563EB]">14</span>
                <span className="text-[10px] text-slate-500">Renewals</span>
              </div>
            </div>
          </div>
        );
      case 'contracts':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] truncate max-w-[160px]">AWS Cloud Enterprise SLA</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Expiry: <strong className="text-slate-700">Nov 15, 2026</strong></span>
              <span className="text-[#2563EB] font-medium">Auto-Renew: ON</span>
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F172A] truncate">Notice Cutoff Approaching</p>
                <p className="text-[10px] text-slate-500 truncate">Action required before 30-day window</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold shrink-0">
                T-14 Days
              </span>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-blue-500" /> 2 Files Attached
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">✓ OCR Parsed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 text-[11px] text-slate-700 truncate">
                <FileText className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate">Master_Agmt.pdf</span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 text-[11px] text-slate-700 truncate">
                <FileText className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">Addendum_02.pdf</span>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500">Annual Value</span>
              <span className="font-bold text-[#0F172A]">$1.48M</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '78%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2% YoY
              </span>
              <span>Compliance: <strong>98.4%</strong></span>
            </div>
          </div>
        );
      case 'renewals':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-[#0F172A]">Negotiation Stage</span>
              <span className="text-[10px] text-[#2563EB] font-semibold">Stage 2 of 4</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">1. Review ✓</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">2. Negotiate</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">3. Sign</span>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="my-3 px-3.5 py-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-left font-sans">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-[#0F172A] flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Upcoming Schedule
              </span>
              <span className="text-[10px] text-amber-600 font-bold">3 This Month</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">Nov 15 • Cloud</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">Nov 28 • SaaS</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">Dec 04 • Legal</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="featured-modules-carousel"
      aria-label="ContractGuard Featured Modules"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full py-20 sm:py-28 overflow-hidden font-sans select-none focus:outline-none"
    >
      {/* =========================================================================
          1. BACKGROUND TREATMENT:
          - Full-width, full-height section background with warm, professional photo related to contracts/documents
          - Stack of paperwork with pen resting on top / signing documents
          - Strong blur so photo reads as soft ambient texture rather than sharp, distracting photo
          - Light cream-to-white / pale gray-to-white gradient overlay fading from edges toward center
          - Visible at corners/edges of section, fading to near-white behind heading and cards for readability
          - Completely fixed/static: does not move, re-blur, or change as cards animate, swap, or scroll
          - Background sits behind everything (lowest z-index: z-0); pill label, heading, subheading, and card row sit above it (z-10 / z-20)
          ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Warm-toned professional contract & documents photograph (paperwork, legal agreement folder, and pen) */}
        <img
          src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2400&q=80"
          alt=""
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover object-center filter blur-[12px] sm:blur-[14px] scale-105 grayscale-[20%] opacity-25 transition-none"
        />

        {/* Static Light cream-to-white gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/94 via-[#FFFFFF]/88 to-[#FAF8F5]/94" />

        {/* Fading in from edges toward center: stays visible at corners/edges, fades to near-white behind heading & cards */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_45%,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.88)_40%,rgba(250,248,245,0.65)_70%,rgba(245,242,236,0.85)_100%)]" />

        {/* Faint edge vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(15,23,42,0.05)_100%)]" />
      </div>

      {/* =========================================================================
          2. HEADER:
          - Small pill-shaped label floating above heading ("✦ Explore Our Tools")
          - Bold, confident heading "Featured Modules" in deep charcoal-navy
          - Calm, muted subheading describing the purpose of the modules
          - Generous vertical spacing (~56-80px) between subheading and card row so
            the enlarged center card never overlaps the heading or subheading
          - Elevated z-20 so heading stays fully visible and unobstructed at all times
          ========================================================================= */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 sm:mb-20 lg:mb-24">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200/80 text-[#2563EB] text-xs font-semibold tracking-wide mb-4 shadow-2xs">
          <span>✦ Explore Our Tools</span>
        </div>

        <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-tight">
          Featured Modules
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed font-sans font-normal">
          Streamline every stage of your contract lifecycle with 7 purpose-built modules designed for proactive alerts, visibility, and control.
        </p>
      </div>

      {/* =========================================================================
          3. DESKTOP 5-CARD CAROUSEL ROW LAYOUT:
          - Display 5 COMPLETE CARDS in a horizontal row on desktop!
          - Example: [ Dashboard ] [ Contracts ] [ Reminders ] [ Documents ] [ Analytics ]
          - No clipping, no heavy transparency, no blur, no overlapping that hides content.
          - Every card is 100% visible, fully rectangular, solid warm white/cream background.
          - Active card is positioned in center, slightly larger, higher elevation.
          - Inactive cards have normal 100% opacity, solid background, soft shadow.
          - Comfortable gap between cards.
          - Sits comfortably below the heading with generous top spacing.
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Navigation Chevrons: Left & Right */}
        <button
          id="featured-carousel-prev-btn"
          type="button"
          onClick={handlePrev}
          aria-label="Previous module"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#0F172A] text-[#0F172A] hover:text-white border border-slate-200/90 hover:border-[#0F172A] shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          id="featured-carousel-next-btn"
          type="button"
          onClick={handleNext}
          aria-label="Next module"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#0F172A] text-[#0F172A] hover:text-white border border-slate-200/90 hover:border-[#0F172A] shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Carousel Stage: generous height and overflow-visible so scaled cards and top icons never get clipped */}
        <div className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[650px] py-8 sm:py-12 flex items-center justify-center overflow-visible">
          {MODULES.map((mod, idx) => {
            const offset = getOffset(idx);
            const isActive = offset === 0;

            // Pitch calculation: spacing between card centers
            // On desktop (lg+): ~300px pitch allows 5 cards to sit side-by-side cleanly with ~20-24px gap.
            // Inactive card width: ~275px; Active card width: ~330px.
            const absOffset = Math.abs(offset);

            // Hide cards beyond 5 visible cards cleanly without jump
            const isVisible = absOffset <= 2;

            const IconComponent = mod.icon;

            return (
              <div
                key={mod.id}
                id={`featured-module-card-${mod.id}`}
                onClick={() => {
                  if (!isActive) setActiveIndex(idx);
                }}
                className={`absolute top-1/2 left-1/2 -translate-y-1/2 select-none overflow-visible ${
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } ${!isActive && isVisible ? 'cursor-pointer' : ''}`}
                style={{
                  // Smooth translate and scale with transformOrigin centered so top/bottom expand evenly
                  transform: `translate(calc(-50% + calc(var(--card-pitch, 300px) * ${offset})), -50%) scale(${
                    isActive ? 1.08 : 1
                  })`,
                  transformOrigin: 'center center',
                  zIndex: isActive ? 40 : 20 - absOffset,
                  transition:
                    absOffset >= 3
                      ? 'none'
                      : 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.7s ease, opacity 0.4s ease',
                }}
              >
                {/* 
                  Card Wrapper:
                  - Height: auto with min-height instead of fixed height so content is never clipped
                  - Overflow: visible so shadows and badges are unconstrained
                  - Consistent vertical flex column (display: flex; flex-direction: column;)
                  - Consistent internal padding (24-28px on all sides) with generous padding-top
                  - Active: width ~330px, min-height ~470px, solid white background, deep soft shadow
                  - Inactive: width ~275px, min-height ~410px, solid warm white/cream background, soft shadow, 100% opacity
                */}
                <div
                  className={`flex flex-col justify-between text-center overflow-visible transition-all duration-700 ease-in-out ${
                    isActive
                      ? 'w-[310px] sm:w-[330px] lg:w-[340px] h-auto min-h-[460px] sm:min-h-[480px] lg:min-h-[490px] bg-white border border-slate-200/90 rounded-[20px] p-6 sm:p-7 pt-7 sm:pt-8'
                      : 'w-[260px] sm:w-[275px] lg:w-[285px] h-auto min-h-[400px] sm:min-h-[415px] lg:min-h-[425px] bg-[#FFFDF9] border border-slate-200/80 rounded-[16px] p-6 pt-7'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? '0 20px 40px -4px rgba(15, 23, 42, 0.14), 0 10px 20px -2px rgba(37, 99, 235, 0.08)'
                      : '0 4px 16px -2px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Top: Large icon inside a subtle rounded icon container with comfortable top clearance */}
                    <div
                      className={`flex items-center justify-center rounded-2xl bg-[#EFF6FF] border border-blue-100/90 text-[#2563EB] shadow-2xs transition-all duration-500 shrink-0 ${
                        isActive
                          ? 'w-14 h-14 sm:w-16 sm:h-16 mb-3'
                          : 'w-12 h-12 sm:w-13 sm:h-13 mb-3'
                      }`}
                    >
                      <IconComponent
                        className={isActive ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6 sm:w-6.5 sm:h-6.5'}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Card Title: Elegant serif font (Playfair Display / Cormorant Garamond) in dark charcoal */}
                    <h3
                      className={`font-serif font-bold text-[#0F172A] tracking-tight leading-snug ${
                        isActive ? 'text-2xl sm:text-3xl mb-1.5' : 'text-xl sm:text-2xl mb-2'
                      }`}
                      style={{
                        fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {mod.name}
                    </h3>

                    {/* Active Card Enhancement: Small clean product preview between title and description */}
                    {isActive && renderActiveProductPreview(mod.id)}

                    {/* Card Description: Modern sans-serif in softer dark-gray tone */}
                    <p
                      className={`font-sans text-[#475569] leading-relaxed ${
                        isActive
                          ? 'text-xs sm:text-sm font-normal px-1 mt-1.5'
                          : 'text-xs sm:text-sm font-normal line-clamp-4 px-0.5 mt-1'
                      }`}
                      style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      {mod.desc}
                    </p>
                  </div>

                  {/* Button: Clearly visible "Explore More" button on every card */}
                  <div
                    className={`mt-4 pt-3.5 border-t w-full ${
                      isActive ? 'border-slate-100' : 'border-slate-200/60'
                    }`}
                  >
                    <button
                      id={`featured-module-btn-${mod.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateTab(mod.tabId);
                      }}
                      className={`w-full py-2.5 px-5 rounded-full font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] active:scale-95 ${
                        isActive
                          ? 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                          : 'bg-transparent hover:bg-[#F8FAFC] border border-[#0F172A] text-[#0F172A] hover:shadow-xs transform hover:-translate-y-0.5'
                      }`}
                      style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      <span>Explore More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            DOT INDICATORS & STATUS LABEL:
            - Exactly 7 dots below the row
            - Active dot elongates into a pill shape filled with deep navy / accent blue
            - Inactive dots are small gray circles
            - Small status label below dots
            ========================================================================= */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {MODULES.map((mod, i) => (
              <button
                key={mod.id}
                id={`featured-carousel-dot-${mod.id}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to ${mod.name} module`}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  activeIndex === i
                    ? 'w-8 h-2.5 bg-[#0F172A] shadow-2xs'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Status Label */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] font-medium select-none font-sans">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span>
              {isPaused ? 'Paused on interaction' : `Auto-rotating (${activeIndex + 1} of ${total})`}
            </span>
          </div>
        </div>
      </div>

      {/* Responsive pitch CSS variables */}
      <style>{`
        #featured-modules-carousel {
          --card-pitch: 300px;
        }
        @media (max-width: 1200px) {
          #featured-modules-carousel {
            --card-pitch: 285px;
          }
        }
        @media (max-width: 900px) {
          #featured-modules-carousel {
            --card-pitch: 290px;
          }
        }
        @media (max-width: 640px) {
          #featured-modules-carousel {
            --card-pitch: 310px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedModulesCarousel;
