import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Wheel from './components/Wheel';
import CategoryFilter from './components/CategoryFilter';
import TopicModal from './components/TopicModal';
import MasteryDashboard from './components/MasteryDashboard';
import MotionBackground from './components/MotionBackground';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import LegalModal from './components/LegalModal';
import CookieBanner from './components/CookieBanner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CATEGORIES, TOPICS } from './data/topics';
import { THEMES } from './data/themes';
import { sound } from './utils/audio';

function AppContent() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('privacy');

  const handleOpenLegal = useCallback((tab = 'privacy') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#privacy') handleOpenLegal('privacy');
      else if (hash === '#terms') handleOpenLegal('terms');
      else if (hash === '#cookies' || hash === '#cookie') handleOpenLegal('cookies');
      else if (hash === '#refund' || hash === '#refunds') handleOpenLegal('refund');
      else if (hash === '#contact' || hash === '#business') handleOpenLegal('business');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [handleOpenLegal]);

  const allCategoryKeys = useMemo(() => Object.keys(CATEGORIES), []);

  // Active theme (kyoto | linear | matcha)
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('ds_roulette_theme');
      return THEMES[savedTheme] || THEMES.kyoto;
    } catch {
      return THEMES.kyoto;
    }
  });

  // Selected categories on the wheel
  const [selectedCategories, setSelectedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_roulette_categories');
      return saved ? JSON.parse(saved) : allCategoryKeys;
    } catch {
      return allCategoryKeys;
    }
  });

  // Mastered topic IDs
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_roulette_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarked topic IDs
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_roulette_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio mute state
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());

  // Active topic opened in modal
  const [activeTopic, setActiveTopic] = useState(null);

  // Is wheel currently spinning
  const [isSpinning, setIsSpinning] = useState(false);

  // Is dashboard drawer open
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Recent spin history
  const [recentSpins, setRecentSpins] = useState([]);

  // Save theme to localStorage
  const handleSelectTheme = (thm) => {
    setCurrentTheme(thm);
    try {
      localStorage.setItem('ds_roulette_theme', thm.id);
    } catch (_) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('ds_roulette_categories', JSON.stringify(selectedCategories));
    } catch (_) {}
  }, [selectedCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_roulette_mastered', JSON.stringify(masteredIds));
    } catch (_) {}
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_roulette_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (_) {}
  }, [bookmarkedIds]);

  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === allCategoryKeys.length) {
      setSelectedCategories([allCategoryKeys[0]]);
    } else {
      setSelectedCategories(allCategoryKeys);
    }
  };

  const handleToggleMute = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleMastered = (topicId) => {
    setMasteredIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleToggleBookmarked = (topicId) => {
    setBookmarkedIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleResetProgress = () => {
    setMasteredIds([]);
    setBookmarkedIds([]);
    try {
      localStorage.removeItem('ds_roulette_mastered');
      localStorage.removeItem('ds_roulette_bookmarks');
    } catch (_) {}
  };

  const handleTopicSelected = useCallback((topic) => {
    setActiveTopic(topic);
    setRecentSpins((prev) => {
      const filtered = prev.filter((t) => t.id !== topic.id);
      return [topic, ...filtered].slice(0, 4);
    });
  }, []);

  const activeWheelTopics = useMemo(() => {
    return TOPICS.filter((t) => selectedCategories.includes(t.category));
  }, [selectedCategories]);

  const topicCounts = useMemo(() => {
    const counts = {};
    TOPICS.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if ((e.key === 'd' || e.key === 'D') && !activeTopic) {
        setIsDashboardOpen((prev) => !prev);
      } else if ((e.key === 'p' || e.key === 'P') && !activeTopic) {
        setIsProfileOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTopic]);

  return (
    <div
      className="min-h-screen text-[#ede6db] flex flex-col selection:bg-[#d4b483]/20 selection:text-[#f5ede0] relative overflow-x-hidden transition-colors duration-500 font-sans"
      style={{ backgroundColor: currentTheme.bodyBg }}
    >
      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#d4b483] focus:text-stone-900 focus:font-medium focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Calm Ambient Lamp & Grain Background */}
      <MotionBackground theme={currentTheme} />

      {/* Top Navbar */}
      <Navbar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        masteredCount={masteredIds.length}
        totalCount={TOPICS.length}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex="-1"
        className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-5 sm:py-6 max-w-4xl mx-auto w-full outline-none"
      >
        {/* Editorial Header */}
        <div className="text-center max-w-md mx-auto mb-3 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1c1815] border border-white/5 text-[10px] font-mono text-stone-400">
            <span>Daily Practice • 47 High-Yield Concepts</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#f5ede0] tracking-tight">
            Data Science Roulette
          </h2>
          <p className="text-xs text-stone-400 font-normal">
            Spin to unlock a focused interview mental model with practical code and recruiter insights.
          </p>
        </div>

        {/* Category Filter with 1-Click Focus Mode */}
        <div className="mb-2 w-full">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onSelectAll={handleSelectAllCategories}
            onFocusCategory={(catId) => setSelectedCategories([catId])}
            topicCounts={topicCounts}
            theme={currentTheme}
          />
        </div>

        {/* Minimalist Dial */}
        <div className="my-1">
          <Wheel
            topics={activeWheelTopics}
            onTopicSelected={handleTopicSelected}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            theme={currentTheme}
          />
        </div>

        {/* Shortcuts & Recent Strip */}
        <div className="w-full max-w-2xl mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-black/40 border border-white/10 text-stone-300 text-[9px]">
                Space
              </kbd>
              <span>spin</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-black/40 border border-white/10 text-stone-300 text-[9px]">
                M
              </kbd>
              <span>mute</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-black/40 border border-white/10 text-stone-300 text-[9px]">
                D
              </kbd>
              <span>archive</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-black/40 border border-white/10 text-stone-300 text-[9px]">
                P
              </kbd>
              <span>profile</span>
            </span>
          </div>

          {recentSpins.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
              <span className="text-[10px] text-stone-500 font-mono shrink-0">
                Recent:
              </span>
              <div className="flex items-center gap-1">
                {recentSpins.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#1c1815] hover:bg-[#25201b] border border-white/5 text-stone-300 transition-colors truncate max-w-[120px] cursor-pointer font-mono"
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Compliant & Accessible Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-4 bg-[#110f0d]/60 text-center text-xs text-stone-400 font-sans space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
          <button
            onClick={() => handleOpenLegal('privacy')}
            className="hover:text-[#f5ede0] transition-colors cursor-pointer underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:ring-[#d4b483] rounded px-1"
          >
            Privacy Policy
          </button>
          <span className="text-stone-600">•</span>
          <button
            onClick={() => handleOpenLegal('terms')}
            className="hover:text-[#f5ede0] transition-colors cursor-pointer underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:ring-[#d4b483] rounded px-1"
          >
            Terms & Conditions
          </button>
          <span className="text-stone-600">•</span>
          <button
            onClick={() => handleOpenLegal('cookies')}
            className="hover:text-[#f5ede0] transition-colors cursor-pointer underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:ring-[#d4b483] rounded px-1"
          >
            Cookie & Storage Policy
          </button>
          <span className="text-stone-600">•</span>
          <button
            onClick={() => handleOpenLegal('refund')}
            className="hover:text-[#f5ede0] transition-colors cursor-pointer underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:ring-[#d4b483] rounded px-1"
          >
            Refund Policy
          </button>
          <span className="text-stone-600">•</span>
          <button
            onClick={() => handleOpenLegal('business')}
            className="hover:text-[#f5ede0] transition-colors cursor-pointer underline-offset-4 hover:underline focus-visible:ring-1 focus-visible:ring-[#d4b483] rounded px-1"
          >
            Business & Contact
          </button>
        </div>

        <div className="max-w-xl mx-auto space-y-1 text-[11px] text-stone-400 leading-relaxed">
          <p className="font-mono text-[10px]">
            &copy; {new Date().getFullYear()} RoyLabs. Educational Interview Preparation Platform.
          </p>
          <p className="text-[10px]">
            Zero third-party trackers or ad cookies. DS Roulette is an independent educational tool and is not affiliated with, sponsored by, or endorsed by Google, Meta, LeetCode, or any employer.
          </p>
        </div>
      </footer>

      {/* Topic Flashcard Modal */}
      {activeTopic && (
        <TopicModal
          topic={activeTopic}
          onClose={() => setActiveTopic(null)}
          onSpinAgain={() => {
            const spinBtn = document.querySelector('button[aria-label="Spin the wheel"]');
            if (spinBtn) {
              setTimeout(() => spinBtn.click(), 100);
            }
          }}
          isMastered={masteredIds.includes(activeTopic.id)}
          onToggleMastered={handleToggleMastered}
          isBookmarked={bookmarkedIds.includes(activeTopic.id)}
          onToggleBookmarked={handleToggleBookmarked}
          theme={currentTheme}
        />
      )}

      {/* Dashboard Drawer */}
      <MasteryDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        masteredIds={masteredIds}
        bookmarkedIds={bookmarkedIds}
        onSelectTopic={(topic) => setActiveTopic(topic)}
        onResetProgress={handleResetProgress}
        theme={currentTheme}
      />

      {/* Google Sign In & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile & Study Streak Tracker Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        masteredIds={masteredIds}
        bookmarkedIds={bookmarkedIds}
        onResetProgress={handleResetProgress}
      />

      {/* Comprehensive Legal, Privacy & Compliance Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => {
          setIsLegalOpen(false);
          if (window.location.hash) {
            history.replaceState(null, null, ' ');
          }
        }}
        initialTab={legalTab}
      />

      {/* Strictly Necessary Storage & Privacy Notice Banner */}
      <CookieBanner onOpenLegal={handleOpenLegal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
