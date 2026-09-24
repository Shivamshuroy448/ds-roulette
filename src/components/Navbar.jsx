import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Volume2, VolumeX, Trophy, Disc, Palette, Coffee, Terminal, Leaf, User } from 'lucide-react';
import { THEMES } from '../data/themes';
import { getSafeAvatarUrl } from '../utils/security';

const THEME_ICONS = {
  kyoto: Coffee,
  linear: Terminal,
  matcha: Leaf
};

export default function Navbar({
  isMuted,
  onToggleMute,
  masteredCount,
  totalCount,
  onOpenDashboard,
  onOpenProfile,
  currentTheme,
  onSelectTheme
}) {
  const { user, stats, setIsAuthModalOpen } = useAuth();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const percent = Math.round((masteredCount / totalCount) * 100) || 0;

  return (
    <header className="w-full border-b border-white/5 bg-[#13110f]/70 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Brand / Minimalist Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1e1b17] border border-[#d4b483]/25 flex items-center justify-center text-[#d4b483]">
            <Disc className="w-4 h-4 animate-spin [animation-duration:12s]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-wider text-[#f5ede0] font-mono">
                DS ROULETTE
              </h1>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">
                / {totalCount} concepts
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Aesthetic Palette Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu((prev) => !prev)}
              aria-label="Select theme"
              className="px-2.5 py-1.5 rounded-lg bg-[#1c1815] hover:bg-[#25201b] border border-white/10 hover:border-white/20 text-stone-300 hover:text-[#f5ede0] transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <Palette className="w-3.5 h-3.5 text-[#d4b483]" />
              <span className="hidden md:inline-block text-[11px] font-mono text-stone-400">
                {currentTheme.name}
              </span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-[#191613] border border-white/10 rounded-xl shadow-xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                  <div className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-stone-500 font-mono">
                    Aesthetic Atmosphere
                  </div>
                  {Object.values(THEMES).map((thm) => {
                    const isSelected = thm.id === currentTheme.id;
                    const ThmIcon = THEME_ICONS[thm.id] || Coffee;
                    return (
                      <button
                        key={thm.id}
                        onClick={() => {
                          onSelectTheme(thm);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#27211b] text-[#f5ede0] font-medium'
                            : 'text-stone-400 hover:text-stone-200 hover:bg-[#201c18]'
                        }`}
                      >
                        <ThmIcon className="w-3.5 h-3.5 text-[#d4b483] shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs truncate">{thm.name}</div>
                          <div className="text-[9px] text-stone-500 truncate">{thm.subtitle.split(',')[0]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            title={isMuted ? "Muted (M)" : "Audio On (M)"}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs ${
              isMuted
                ? 'bg-[#181512] border-white/5 text-stone-600'
                : 'bg-[#1c1815] border-white/10 text-stone-300 hover:text-[#f5ede0]'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#d4b483]" />
            )}
          </button>

          {/* Progress / Mastery Drawer Toggle */}
          <button
            onClick={onOpenDashboard}
            aria-label={`Open Mastery Archive: ${masteredCount} of ${totalCount} concepts mastered`}
            title="Open Mastery Archive"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1c1815] hover:bg-[#25201b] border border-white/10 hover:border-white/20 transition-all cursor-pointer text-xs group focus-visible:ring-2 focus-visible:ring-[#d4b483]"
          >
            <Trophy className="w-3.5 h-3.5 text-[#d4b483]" />
            <span className="text-stone-300 group-hover:text-[#f5ede0] font-mono text-[11px]">
              {masteredCount}/{totalCount}
            </span>
            <div className="w-8 h-1 bg-[#26221d] rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-[#d4b483] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </button>

          {/* Google Profile or Sign In Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              aria-label={`Open user profile for ${user.displayName || 'user'}`}
              title={`View Profile (${user.displayName})`}
              className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#1c1815] hover:bg-[#25201b] border border-[#d4b483]/25 hover:border-[#d4b483]/50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
            >
              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 font-semibold">
                <span>🔥</span>
                <span>{stats.streak}</span>
              </div>
              <img
                src={getSafeAvatarUrl(user.photoURL, user.displayName)}
                alt={user.displayName ? `${user.displayName}'s avatar` : "User profile avatar"}
                className="w-6 h-6 rounded-md object-cover border border-white/10"
              />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="Sign in with Google"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5ede0] hover:bg-white text-stone-900 font-medium text-xs transition-colors cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-[#d4b483]"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden xs:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
