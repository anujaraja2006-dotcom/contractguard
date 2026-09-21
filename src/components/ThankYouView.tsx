import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowRight } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface ThankYouViewProps {
  t: TranslationDictionary;
  onGoToDashboard: () => void;
  onGoToContracts: () => void;
  onGoToReminders: () => void;
  onGoToHome?: () => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({
  t: _t,
  onGoToDashboard,
  onGoToContracts: _onGoToContracts,
  onGoToReminders: _onGoToReminders,
  onGoToHome,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToTop = () => {
    if (onGoToHome) {
      onGoToHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden bg-[#F5F0E6] text-[#292524] selection:bg-[#243029] selection:text-white">
      {/* Botanical foliage background with low opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(240,233,222,0.8),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#24302905_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* Decorative Floating Leaf Accent */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-10 opacity-75 animate-bounce [animation-duration:4s]">
        <span className="inline-block text-2xl filter drop-shadow-xs transform rotate-[-8deg]">🌿</span>
      </div>

      {/* Centered container with max-width ~650-700px */}
      <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col items-center justify-center my-auto">
        
        {/* Main Headline: 🌟 Thank You! 🌟 */}
        <h1
          className={`font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1917] leading-tight mb-6 sm:mb-8 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          🌟 Thank You! 🌟
        </h1>

        {/* First Quote Block */}
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

        {/* Body Paragraphs */}
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

        {/* Second Quote Block */}
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

        {/* Separator dots */}
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

        {/* Closing Line */}
        <p
          className={`font-sans font-medium text-stone-800 text-lg sm:text-xl tracking-wide mb-6 sm:mb-8 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '540ms' }}
        >
          Once again, thank you for being a part of our journey! ✨
        </p>

        {/* Final Standout Line */}
        <p
          className={`font-serif font-bold text-2xl sm:text-3xl text-emerald-900 tracking-tight mt-2 mb-10 transition-all duration-800 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '640ms' }}
        >
          💙 Thank You &amp; Have a Wonderful Day!
        </p>

        {/* Navigation Action Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 pt-2 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '720ms' }}
        >
          <button
            type="button"
            onClick={handleBackToTop}
            className="min-h-[44px] px-7 py-3 rounded-full bg-[#243029] hover:bg-[#1A231E] text-[#F7F5F0] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
          >
            <ArrowUp className="w-4 h-4 text-emerald-300" />
            <span>Home Page</span>
          </button>

          <button
            type="button"
            onClick={onGoToDashboard}
            className="min-h-[44px] px-6 py-3 rounded-full bg-white/70 hover:bg-white text-stone-800 border border-stone-300/80 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-xs hover:shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 mt-12 sm:mt-16 text-xs text-stone-600 font-sans tracking-wider uppercase flex items-center gap-2 select-none">
        <span>CONTRACTLY</span>
        <span>•</span>
        <span>Contract Renewal Reminder Project</span>
      </div>
    </div>
  );
};
