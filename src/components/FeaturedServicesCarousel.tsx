import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

export interface FeaturedService {
  id: string;
  title: string;
  shortDesc: string;
  expandedDesc: string;
  imageUrl: string;
  tabId: string;
  category: string;
}

export const FEATURED_SERVICES: FeaturedService[] = [
  {
    id: 'lifecycle',
    title: 'Contract Lifecycle Management',
    shortDesc: 'Streamline enterprise agreements from creation and redlining to electronic execution.',
    expandedDesc:
      'Complete end-to-end administration for master service agreements, vendor SLAs, and NDAs with real-time audit trails, automatic notice term tracking, and unified role-based permissions.',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    tabId: 'contracts',
    category: 'Core Service',
  },
  {
    id: 'reminders',
    title: 'Automated Renewal Reminders',
    shortDesc: 'Proactive multi-channel notifications before critical notice windows expire.',
    expandedDesc:
      'Configurable multi-tier escalation alerts dispatched at 90, 60, 30, 15, and 7-day intervals directly to contract owners, department heads, and executive procurement leaders.',
    imageUrl:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    tabId: 'reminders',
    category: 'Proactive Alerting',
  },
  {
    id: 'documents',
    title: 'Secure Repository & OCR Vault',
    shortDesc: 'Centralized document vault with intelligent clause and date extraction.',
    expandedDesc:
      'Encrypted cloud archiving for PDF and DOCX agreements featuring instant optical character recognition (OCR), automated renewal clause extraction, and tamper-evident storage.',
    imageUrl:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    tabId: 'documents',
    category: 'Document Intelligence',
  },
  {
    id: 'analytics',
    title: 'Executive Analytics & Spend',
    shortDesc: 'Actionable financial visibility and predictive risk forecasting across vendors.',
    expandedDesc:
      'Granular breakdown of annualized recurring obligations, department expenditures, vendor concentration risks, and benchmarked renegotiation cost savings.',
    imageUrl:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    tabId: 'analytics',
    category: 'Spend Intelligence',
  },
  {
    id: 'renewals',
    title: 'Renegotiation & Approval Workflow',
    shortDesc: 'Structured 5-stage renewal pipeline with stakeholder approval gates.',
    expandedDesc:
      'Standardized review cycles through Review, Commercial Negotiation, Executive Approval, Renewal Execution, and Archival with complete immutable audit logs.',
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    tabId: 'workflow',
    category: 'Workflow Pipeline',
  },
  {
    id: 'calendar',
    title: 'Unified Calendar & Deadlines',
    shortDesc: 'Comprehensive monthly calendar tracking notice windows and milestones.',
    expandedDesc:
      'Synchronized timeline mapping contract notice opt-out periods, upcoming auto-renewals, compliance filings, and contract review meetings in an intuitive calendar view.',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tabId: 'calendar',
    category: 'Timeline Tracking',
  },
  {
    id: 'dashboard',
    title: 'Real-Time Portfolio Cockpit',
    shortDesc: 'Instant executive overview of all key contract metrics and renewal health.',
    expandedDesc:
      'Holistic organizational command center delivering live KPI monitoring, risk distribution scoring, upcoming expiration horizons, and prompt renewal action triggers.',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tabId: 'dashboard',
    category: 'Executive Overview',
  },
];

interface FeaturedServicesCarouselProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FeaturedServicesCarousel: React.FC<FeaturedServicesCarouselProps> = ({
  onNavigateTab,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const total = FEATURED_SERVICES.length;
  const timeoutRef = useRef<number | null>(null);

  // Auto-shift every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, isPaused, total]);

  // Keyboard navigation (ArrowLeft and ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Circular offset: -3, -2, -1, 0, 1, 2, 3
  const getOffset = (idx: number) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const handleCardClick = (idx: number, tabId: string) => {
    if (idx === activeIndex) {
      if (onNavigateTab) onNavigateTab(tabId);
    } else {
      setActiveIndex(idx);
    }
  };

  return (
    <section
      id="featured-services"
      aria-label="Featured Services"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. BACKGROUND: Full-width section with blurred/softened tropical resort photo & light cream overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* High-resolution Tropical Resort Photo */}
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=80"
          alt="Tropical resort pavilion and pool"
          className="absolute inset-0 w-full h-full object-cover object-center filter blur-md sm:blur-lg scale-105 opacity-30 sm:opacity-35 transition-opacity duration-1000"
        />

        {/* Light Cream Overlay for pristine contrast & readability */}
        <div className="absolute inset-0 bg-[#F9F6F0]/90 backdrop-blur-[2px]"></div>

        {/* Soft Warm Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(201,161,92,0.06),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(240,233,222,0.5)_100%)]"></div>
      </div>

      {/* Decorative top accent line with gold hue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#C9A15C]/40 to-transparent"></div>

      {/* 2. SECTION HEADER: Centered heading "Featured Services" in an elegant serif font */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A15C]/10 border border-[#C9A15C]/30 text-[#9E7730] text-xs font-semibold uppercase tracking-widest mb-3.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A15C]" />
          <span>Curated Excellence</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] leading-tight">
          Featured Services
        </h2>

        <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-sans">
          Explore everything you need to manage contracts, renewals, documents, reminders, and business insights in one intelligent workspace.
        </p>
      </div>

      {/* 3. CAROUSEL STAGE: Horizontal row of 7 cards, partially overlapping/peeking at edges */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-8">
        {/* Navigation Controls: Left & Right Chevrons */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous service"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-[#1C1917] border border-stone-200/90 shadow-lg hover:shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
        >
          <ChevronLeft className="w-6 h-6 text-stone-700 group-hover:text-[#9E7730] transition-colors" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next service"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-[#1C1917] border border-stone-200/90 shadow-lg hover:shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
        >
          <ChevronRight className="w-6 h-6 text-stone-700 group-hover:text-[#9E7730] transition-colors" />
        </button>

        {/* Carousel Viewport */}
        <div className="relative h-[550px] sm:h-[580px] lg:h-[620px] flex items-center justify-center overflow-hidden">
          {FEATURED_SERVICES.map((service, idx) => {
            const offset = getOffset(idx);
            const isActive = offset === 0;

            // Positioning math for infinite horizontal carousel with peeking edge cards
            let translateX = '0%';
            let scale = 0.72;
            let zIndex = 5;
            let opacity = 0;
            let pointerEvents: 'auto' | 'none' = 'none';

            if (isActive) {
              translateX = '0%';
              scale = 1;
              zIndex = 30;
              opacity = 1;
              pointerEvents = 'auto';
            } else if (offset === -1) {
              translateX = '-88%';
              scale = 0.88;
              zIndex = 20;
              opacity = 0.88;
              pointerEvents = 'auto';
            } else if (offset === 1) {
              translateX = '88%';
              scale = 0.88;
              zIndex = 20;
              opacity = 0.88;
              pointerEvents = 'auto';
            } else if (offset === -2) {
              translateX = '-168%';
              scale = 0.76;
              zIndex = 10;
              opacity = 0.5;
              pointerEvents = 'auto';
            } else if (offset === 2) {
              translateX = '168%';
              scale = 0.76;
              zIndex = 10;
              opacity = 0.5;
              pointerEvents = 'auto';
            } else if (offset === -3) {
              translateX = '-240%';
              scale = 0.65;
              zIndex = 5;
              opacity = 0.2;
              pointerEvents = 'none';
            } else if (offset === 3) {
              translateX = '240%';
              scale = 0.65;
              zIndex = 5;
              opacity = 0.2;
              pointerEvents = 'none';
            }

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(idx, service.tabId)}
                className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[90%] sm:w-[420px] lg:w-[460px] transition-all duration-700 ease-in-out cursor-pointer ${
                  isActive ? 'cursor-default' : 'hover:opacity-95'
                }`}
                style={{
                  transform: `translate(calc(-50% + ${translateX}), -50%) scale(${scale})`,
                  zIndex,
                  opacity,
                  pointerEvents,
                }}
              >
                {isActive ? (
                  /* =========================================================
                     CENTER (ACTIVE) CARD:
                     - Enlarged (taller, wider, elevated with stronger shadow)
                     - Solid white/cream background, 16px rounded corners
                     - Large featured image at the top (rounded corners)
                     - Title (serif font)
                     - Longer description paragraph below it
                     - Bottom buttons: plain-text "Details" link & solid gold/mustard (#C9A15C) "Explore More" button
                     ========================================================= */
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl shadow-stone-900/15 overflow-hidden flex flex-col p-4 sm:p-6 text-left transition-all duration-500">
                    {/* Large Featured Image at the Top */}
                    <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden mb-5 group bg-stone-100 shadow-inner">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-stone-800 shadow-xs">
                        {service.category}
                      </span>
                    </div>

                    {/* Title in Elegant Serif Font */}
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight leading-snug mb-3">
                      {service.title}
                    </h3>

                    {/* Longer Description Paragraph */}
                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans mb-6">
                      {service.expandedDesc}
                    </p>

                    {/* Two Buttons at the Bottom: Plain-text "Details" link and solid gold/mustard "Explore More" button */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateTab) onNavigateTab(service.tabId);
                        }}
                        className="text-sm font-semibold text-stone-700 hover:text-[#C9A15C] transition-colors flex items-center gap-1 cursor-pointer group py-1"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#C9A15C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateTab) onNavigateTab(service.tabId);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#C9A15C] hover:bg-[#B8924D] active:bg-[#A8823E] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
                      >
                        <span>Explore More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* =========================================================
                     SIDE CARDS:
                     - Smaller, semi-transparent / muted white background
                     - Rounded corners (~12-16px)
                     - Soft drop shadow
                     - Contains: Title (serif font), 2-line description text, outlined "Explore More" button
                     ========================================================= */
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-md p-6 sm:p-7 flex flex-col justify-between h-[360px] sm:h-[400px] text-left transition-all duration-500 hover:shadow-lg hover:border-[#C9A15C]/50">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67E36] mb-2 block">
                        {service.category}
                      </span>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug mb-3">
                        {service.title}
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
                        {service.shortDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200/60 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(idx);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-[#C9A15C] hover:border-[#B8924D] text-[#9E7730] hover:bg-[#C9A15C]/10 text-xs sm:text-sm font-semibold transition-all duration-200 text-center cursor-pointer shadow-2xs"
                      >
                        Explore More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. DOT INDICATORS: Exactly 7 indicators below cards */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            {FEATURED_SERVICES.map((service, i) => (
              <button
                key={service.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`Jump to ${service.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 ${
                  activeIndex === i
                    ? 'w-8 h-2.5 bg-[#C9A15C] shadow-xs'
                    : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium select-none">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-[#C9A15C] animate-pulse'
              }`}
            />
            <span>
              {isPaused ? 'Paused on interaction' : `Auto-scrolling (${activeIndex + 1} of ${total})`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
