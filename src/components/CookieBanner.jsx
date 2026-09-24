import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieBanner({ onOpenLegal }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem('ds_roulette_consent_acknowledged');
      if (!acknowledged) {
        setIsVisible(true);
      }
    } catch (_) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('ds_roulette_consent_acknowledged', 'true');
    } catch (_) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Storage and privacy notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#191613]/95 border border-[#d4b483]/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200 text-stone-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#221e1a] border border-[#d4b483]/30 flex items-center justify-center text-[#d4b483] shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#f5ede0] flex items-center gap-1.5">
              <span>Zero-Tracking Privacy Notice</span>
            </h3>
            <button
              onClick={handleAccept}
              aria-label="Dismiss notice"
              className="text-stone-400 hover:text-stone-200 transition-colors cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            We use strictly necessary browser storage to remember your study streak, mastered questions, and theme. We do not use third-party cookies or advertising trackers.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 rounded-lg bg-[#d4b483] hover:bg-[#e2c69d] text-stone-900 font-medium text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
            >
              Accept & Continue
            </button>

            <button
              onClick={() => onOpenLegal('cookies')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
            >
              Storage Details
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
