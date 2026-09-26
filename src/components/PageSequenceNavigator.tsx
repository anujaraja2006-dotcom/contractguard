import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PAGE_SEQUENCE = [
  'home',
  'dashboard',
  'contracts',
  'reminders',
  'documents',
  'analytics',
  'workflow',
  'calendar',
  'about',
  'settings',
  'thankyou',
] as const;

export type PageId = (typeof PAGE_SEQUENCE)[number] | string;

interface PageSequenceNavigatorProps {
  currentTab: string;
  onNavigate: (tabId: string, direction: 'forward' | 'backward') => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  loop?: boolean;
  historyStack?: string[];
}

export const PageSequenceNavigator: React.FC<PageSequenceNavigatorProps> = ({
  currentTab,
  onNavigate,
  canGoBack = true,
  canGoForward = true,
  loop = true,
  historyStack = [],
}) => {
  const currentIndex = PAGE_SEQUENCE.indexOf(currentTab as any);

  const handlePrevious = () => {
    if (historyStack.length > 0) {
      const prevPage = historyStack[historyStack.length - 1];
      onNavigate(prevPage, 'backward');
      return;
    }

    if (currentIndex > 0) {
      onNavigate(PAGE_SEQUENCE[currentIndex - 1], 'backward');
    } else if (loop) {
      onNavigate(PAGE_SEQUENCE[PAGE_SEQUENCE.length - 1], 'backward');
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < PAGE_SEQUENCE.length - 1) {
      onNavigate(PAGE_SEQUENCE[currentIndex + 1], 'forward');
    } else if (loop) {
      onNavigate(PAGE_SEQUENCE[0], 'forward');
    } else if (currentIndex === -1) {
      onNavigate(PAGE_SEQUENCE[0], 'forward');
    }
  };

  // Keyboard navigation support: ArrowLeft & ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in form inputs, textareas, or contentEditable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check if modal or dialog is currently open
      if (document.querySelector('[role="dialog"]') || document.querySelector('.modal-open')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, historyStack, loop]);

  const isLeftDisabled = !loop && currentIndex === 0 && historyStack.length === 0;
  const isRightDisabled = !loop && currentIndex === PAGE_SEQUENCE.length - 1;

  return (
    <>
      {/* Left Navigation Arrow: Fixed vertically centered on the left edge */}
      <aside aria-label="Page navigation" className="contents">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isLeftDisabled}
          aria-label="Go to previous page"
          className={`fixed left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
            isLeftDisabled
              ? 'opacity-30 cursor-not-allowed bg-white/70 border border-slate-200 text-slate-400 shadow-none'
              : 'bg-white/85 hover:bg-[#2563EB] text-slate-500 hover:text-white border border-slate-200/90 hover:border-[#2563EB] shadow-md hover:shadow-xl backdrop-blur-md hover:scale-105 sm:hover:scale-110 active:scale-95 cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </button>

        {/* Right Navigation Arrow: Fixed vertically centered on the right edge */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isRightDisabled}
          aria-label="Go to next page"
          className={`fixed right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
            isRightDisabled
              ? 'opacity-30 cursor-not-allowed bg-white/70 border border-slate-200 text-slate-400 shadow-none'
              : 'bg-white/85 hover:bg-[#2563EB] text-slate-500 hover:text-white border border-slate-200/90 hover:border-[#2563EB] shadow-md hover:shadow-xl backdrop-blur-md hover:scale-105 sm:hover:scale-110 active:scale-95 cursor-pointer'
          }`}
        >
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </aside>
    </>
  );
};
