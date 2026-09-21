import React, { useState } from 'react';
import { Check, Globe, Search, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

interface FirstLoginLanguageModalProps {
  isOpen: boolean;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onClose: () => void;
}

export const FirstLoginLanguageModal: React.FC<FirstLoginLanguageModalProps> = ({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const [selected, setSelected] = useState<LanguageCode>(currentLanguage);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    onSelectLanguage(selected);
    onClose();
  };

  const handleUseEnglish = () => {
    onSelectLanguage('en');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Luxury Serif Style */}
        <div className="p-6 sm:p-8 border-b border-stone-200/80 bg-white/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#243029] flex items-center justify-center text-white shadow-xs">
                <Globe className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">
                  Multilingual India Experience
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1C1E] tracking-tight">
                  Choose Your Language
                </h2>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>English + 22 Scheduled Indian Languages</span>
            </div>
          </div>

          <p className="text-stone-600 text-sm mt-3 max-w-2xl leading-relaxed">
            Select the language you prefer for using Contractly. All navigation, contracts,
            reminders, and notifications will adapt seamlessly. You can change this anytime from
            Settings.
          </p>

          {/* Search Bar */}
          <div className="relative mt-4 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by language name (e.g. தமிழ், हिंदी, Bengali)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#243029] focus:border-transparent bg-white shadow-xs"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => setSelected(lang.code)}
                  className={`relative p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#243029] shadow-md ring-1 ring-[#243029]'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-700">
                      {lang.nativeName.charAt(0)}
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#243029] bg-[#243029] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="font-semibold text-stone-900 text-sm">{lang.nativeName}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>{lang.englishName}</span>
                      {lang.isRTL && (
                        <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                          RTL
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-serif italic truncate">
                    {lang.scriptSample}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-white flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleUseEnglish}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline transition-colors"
          >
            Use English
          </button>
          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#243029] hover:bg-[#1A231E] text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue with {SUPPORTED_LANGUAGES.find((l) => l.code === selected)?.nativeName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
