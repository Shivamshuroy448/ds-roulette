import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, TOPICS } from '../data/topics';
import { getSafeAvatarUrl, sanitizeText } from '../utils/security';
import {
  X,
  Flame,
  Trophy,
  CheckCircle2,
  Bookmark,
  LogOut,
  Target,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Calendar,
  HelpCircle
} from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  masteredIds = [],
  bookmarkedIds = [],
  onResetProgress
}) {
  const { user, stats, logout, setIsAuthModalOpen } = useAuth();

  if (!isOpen) return null;

  const totalTopics = TOPICS.length;
  const masteredCount = masteredIds.length;
  const progressPercent = Math.round((masteredCount / totalTopics) * 100) || 0;
  const quizAccuracy = stats.quizzesAttempted > 0
    ? Math.round((stats.quizzesCorrect / stats.quizzesAttempted) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-white/5 flex items-start justify-between bg-[#1a1714]">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={getSafeAvatarUrl(user?.photoURL, user?.displayName)}
                alt={sanitizeText(user?.displayName, 50) || "Profile"}
                className="w-12 h-12 rounded-xl object-cover border border-[#d4b483]/30 shadow-md bg-[#221e1a]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7ea193] border-2 border-[#1a1714]" />
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#f5ede0] flex items-center gap-2">
                <span>{sanitizeText(user?.displayName, 40) || 'Guest Scholar'}</span>
                {user && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#221e1a] text-[#d4b483] border border-[#d4b483]/20">
                    Google
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                {sanitizeText(user?.email, 60) || 'Sign in to sync with cloud'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto pr-4 text-xs">
          {/* 1. Daily Study Streak Banner */}
          <div className="bg-[#1f1b17] border border-[#d4b483]/20 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2a241e] border border-[#d4b483]/30 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                🔥
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#d4b483]">
                  Daily Study Streak
                </div>
                <div className="text-base font-semibold text-[#f5ede0] font-mono">
                  {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'} Active
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-mono">Total Spins</div>
              <div className="text-xs font-semibold text-stone-300 font-mono">{stats.totalSpins}</div>
            </div>
          </div>

          {/* 2. Mastery & Quiz Stats Overview Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#191613] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#d4b483]" />
                <span>Curriculum Mastery</span>
              </div>
              <div className="text-base font-semibold text-[#f5ede0] font-mono">
                {masteredCount} <span className="text-xs text-stone-500">/ {totalTopics}</span>
              </div>
              <div className="w-full h-1 bg-[#221e1a] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#d4b483] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-[#191613] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-[#7ea193]" />
                <span>Quiz Accuracy</span>
              </div>
              <div className="text-base font-semibold text-[#f5ede0] font-mono">
                {quizAccuracy}%
              </div>
              <div className="text-[10px] text-stone-500 font-mono truncate">
                {stats.quizzesCorrect} of {stats.quizzesAttempted} correct
              </div>
            </div>
          </div>

          {/* 3. Mastery Breakdown by Discipline */}
          <div className="space-y-2 bg-[#191613] p-3.5 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
              Discipline Progress Radar
            </div>

            <div className="space-y-2 pt-1">
              {Object.keys(CATEGORIES).map((catId) => {
                const cat = CATEGORIES[catId];
                const catTopics = TOPICS.filter((t) => t.category === catId);
                const catMastered = catTopics.filter((t) => masteredIds.includes(t.id)).length;
                const catPct = Math.round((catMastered / catTopics.length) * 100) || 0;

                return (
                  <div key={catId} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-300 flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-stone-400">
                        {catMastered}/{catTopics.length} ({catPct}%)
                      </span>
                    </div>

                    <div className="w-full h-1 bg-[#221e1a] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${catPct}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Not Logged In prompt if user is null */}
          {!user && (
            <div className="bg-[#1f1b17] rounded-xl p-3 border border-[#d4b483]/20 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-xs text-[#f5ede0]">Guest Mode</div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  Sign in with Google to sync stats across devices.
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#d4b483] hover:bg-[#e2c69d] text-stone-900 font-medium text-xs transition-colors cursor-pointer shrink-0"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#1a1714] border-t border-white/5 flex items-center justify-between text-xs font-mono">
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Sign Out</span>
            </button>
          ) : (
            <span className="text-[10px] text-stone-600">Local storage profile active</span>
          )}

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset your study streak and mastered cards?")) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
