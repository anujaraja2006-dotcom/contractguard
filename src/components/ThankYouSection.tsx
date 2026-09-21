import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowRight } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface ThankYouSectionProps {
  t: TranslationDictionary;
  onBackToTop: () => void;
  onExploreMore?: () => void;
}

export const ThankYouSection: React.FC<ThankYouSectionProps> = ({
  t: _t,
  onBackToTop,
  onExploreMore,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // IntersectionObserver to trigger smooth staggered entry animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="thank-you-section"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden bg-[#F5F0E6] text-[#292524] selection:bg-[#243029] selection:text-white"
    >
      {/* 
        Earthy, botanical background:
        - Soft cream/beige (#F5F0E6)
        - Very faint, blurred botanical image (leaves/plant silhouette) in the corner and behind text at low opacity
        - Subtle organic radial gradient accents
      */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Faint botanical foliage overlay */}
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=80"
          alt="Botanical leaf silhouette"
          className="absolute -top-12 -right-12 sm:right-0 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] object-cover object-center filter blur-sm grayscale opacity-[0.06] transform rotate-12 transition-transform duration-1000 ease-out animate-[pulse_10s_ease-in-out_infinite]"
        />
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80"
          alt="Soft botanical forest shade"
          className="absolute -bottom-16 -left-16 w-[400px] sm:w-[540px] h-[400px] sm:h-[540px] object-cover filter blur-md grayscale opacity-[0.05] -rotate-6"
        />

        {/* Ambient subtle grain and radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(240,233,222,0.8),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#24302905_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* Decorative Floating Plant/Leaf Accent (Gentle sway animation) */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-10 opacity-75 animate-bounce [animation-duration:4s]">
        <span className="inline-block text-2xl filter drop-shadow-xs transform rotate-[-8deg]">🌿</span>
      </div>

      {/* Content Container (Centered horizontally and vertically, max-width ~650-700px) */}
      <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col items-center justify-center my-auto">
        
        {/* Main Headline: 🌟 Thank You! 🌟 in large, elegant serif font */}
        <h1
          className={`font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1917] leading-tight mb-6 sm:mb-8 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          🌟 Thank You! 🌟
        </h1>

        {/* First Quote Block: Italic serif with generous line-height */}
        <div
          className={`my-2 sm:my-3 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#3E3834] leading-relaxed max-w-xl mx-auto px-4">
            &ldquo;Great things are never achieved alone; they are built together with support, guidance, and encouragement.&rdquo;
          </blockquote>
        </div>

        {/* Thin Horizontal Botanical Divider with Leaf Accent */}
        <div
          className={`flex items-center justify-center gap-3 my-6 sm:my-8 w-full transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '220ms' }}
        >
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#8C827A]/50"></div>
          <span className="text-emerald-800/80 text-sm transform -rotate-12 select-none">🌱</span>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[#8C827A]/50"></div>
        </div>

        {/* Body Paragraph 1: Clean sans-serif, regular weight, comfortable line-height */}
        <div
          className={`space-y-4 mb-6 sm:mb-8 text-[#44403C] text-base sm:text-lg leading-relaxed max-w-[620px] transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '320ms' }}
        >
          <p>
            Thank you to everyone who took the time to attend, listen, and support our Contract Renewal Reminder Project.
          </p>
          <p>
            Your presence, valuable feedback, and encouragement mean a lot to us. We truly appreciate your time and interest in our work.
          </p>
        </div>

        {/* Second Quote Block: Italic serif with generous line-height */}
        <div
          className={`my-2 sm:my-3 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '420ms' }}
        >
          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#3E3834] leading-relaxed max-w-xl mx-auto px-4">
            &ldquo;Every idea becomes stronger when it is shared, discussed, and improved together.&rdquo;
          </blockquote>
        </div>

        {/* Subtle separator dot */}
        <div
          className={`flex items-center justify-center gap-2 my-4 sm:my-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '480ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700/60"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
        </div>

        {/* Closing Line: Slightly emphasized (medium weight or slightly larger) */}
        <p
          className={`font-sans font-medium text-stone-800 text-lg sm:text-xl tracking-wide mb-6 sm:mb-8 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '540ms' }}
        >
          Once again, thank you for being a part of our journey! ✨
        </p>

        {/* Final Line: Standout closing statement (bold, accent color, larger font size, extra top margin) */}
        <p
          className={`font-serif font-bold text-2xl sm:text-3xl text-emerald-900 tracking-tight mt-2 mb-10 transition-all duration-800 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '640ms' }}
        >
          💙 Thank You &amp; Have a Wonderful Day!
        </p>

        {/* Action Controls: Back to Top & Explore Dashboard */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 pt-2 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '720ms' }}
        >
          <button
            type="button"
            onClick={onBackToTop}
            className="min-h-[44px] px-7 py-3 rounded-full bg-[#243029] hover:bg-[#1A231E] text-[#F7F5F0] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
          >
            <ArrowUp className="w-4 h-4 text-emerald-300" />
            <span>Back to Top</span>
          </button>

          {onExploreMore && (
            <button
              type="button"
              onClick={onExploreMore}
              className="min-h-[44px] px-6 py-3 rounded-full bg-white/70 hover:bg-white text-stone-800 border border-stone-300/80 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-xs hover:shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle Botanical Footer Note */}
      <div className="relative z-10 mt-12 sm:mt-16 text-xs text-stone-600 font-sans tracking-wider uppercase flex items-center gap-2 select-none">
        <span>CONTRACTLY</span>
        <span>•</span>
        <span>Contract Renewal Reminder Project</span>
      </div>
    </section>
  );
};
