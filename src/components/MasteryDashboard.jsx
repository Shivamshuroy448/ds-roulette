import React, { useState, useMemo } from 'react';
import { CATEGORIES, TOPICS } from '../data/topics';
import {
  X,
  Trophy,
  Bookmark,
  Search,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function MasteryDashboard({
  isOpen,
  onClose,
  masteredIds = [],
  bookmarkedIds = [],
  onSelectTopic,
  onResetProgress,
  theme
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalTopics = TOPICS.length;
  const masteredCount = masteredIds.length;
  const progressPercent = Math.round((masteredCount / totalTopics) * 100) || 0;

  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      if (activeTab === 'mastered' && !masteredIds.includes(topic.id)) return false;
      if (activeTab === 'bookmarked' && !bookmarkedIds.includes(topic.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(query);
        const matchSummary = topic.summary?.toLowerCase().includes(query);
        const matchCat = CATEGORIES[topic.category]?.name.toLowerCase().includes(query);
        return matchTitle || matchSummary || matchCat;
      }
      return true;
    });
  }, [activeTab, searchQuery, masteredIds, bookmarkedIds]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#141210] border-l border-white/5 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#191613]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#221e1a] border border-[#d4b483]/20 flex items-center justify-center text-[#d4b483]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f5ede0] leading-none">Curriculum Archive</h2>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">{masteredCount} of {totalTopics} mastered</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-b border-white/5 space-y-2 bg-[#171411]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-mono text-[11px]">Mastery Status</span>
            <span className="font-mono text-[#d4b483] text-[11px] font-semibold">
              {progressPercent}% completed
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#221e1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d4b483] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Category mini pills */}
          <div className="grid grid-cols-3 gap-1 pt-1">
            {Object.keys(CATEGORIES).map((catId) => {
              const cat = CATEGORIES[catId];
              const catTopics = TOPICS.filter((t) => t.category === catId);
              const catMastered = catTopics.filter((t) => masteredIds.includes(t.id)).length;
              return (
                <div
                  key={catId}
                  className="bg-[#1c1815] rounded p-1.5 border border-white/5 text-[10px] flex items-center justify-between"
                >
                  <span className="text-stone-400 truncate max-w-[55px]">{cat.name.split(' ')[0]}</span>
                  <span className="font-mono text-stone-300">
                    {catMastered}/{catTopics.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 border-b border-white/5 space-y-2 bg-[#161311]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, algorithms, SQL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#110f0d] border border-white/10 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#d4b483]/40 transition-colors font-mono"
            />
          </div>

          <div className="flex rounded-lg bg-[#110f0d] p-0.5 border border-white/5 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 rounded transition-all cursor-pointer text-center text-[11px] ${
                activeTab === 'all'
                  ? 'bg-[#221e1a] text-[#f5ede0] font-medium'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              All ({totalTopics})
            </button>
            <button
              onClick={() => setActiveTab('mastered')}
              className={`flex-1 py-1 rounded transition-all cursor-pointer text-center text-[11px] ${
                activeTab === 'mastered'
                  ? 'bg-[#221e1a] text-[#d4b483] font-medium'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`flex-1 py-1 rounded transition-all cursor-pointer text-center text-[11px] ${
                activeTab === 'bookmarked'
                  ? 'bg-[#221e1a] text-[#cfb584] font-medium'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Saved ({bookmarkedIds.length})
            </button>
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-10 text-stone-600 text-xs space-y-1.5">
              <BookOpen className="w-6 h-6 mx-auto text-stone-700" />
              <p>No cards match your filter.</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const cat = CATEGORIES[topic.category] || {};
              const isDone = masteredIds.includes(topic.id);
              const isSaved = bookmarkedIds.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic);
                    onClose();
                  }}
                  className={`group p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-[#1a1714]/60 border-[#d4b483]/20 hover:border-[#d4b483]/40'
                      : 'bg-[#171412]/40 border-white/5 hover:border-white/10 hover:bg-[#1c1815]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: cat.color }}>
                        {cat.name}
                      </span>
                      <span className="text-stone-600 text-[9px]">•</span>
                      <span className="text-stone-500 text-[9px] font-mono">{topic.estimatedTime}</span>
                    </div>
                    <h4 className="text-xs font-medium text-stone-200 group-hover:text-[#f5ede0] transition-colors truncate">
                      {topic.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#7ea193]" />}
                    {isSaved && <Bookmark className="w-3.5 h-3.5 fill-[#d4b483] text-[#d4b483]" />}
                    <ArrowRight className="w-3 h-3 text-stone-600 group-hover:text-stone-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#171411] border-t border-white/5 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (window.confirm("Reset study progress?")) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-400 transition-colors cursor-pointer text-[11px] font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <span className="text-stone-600 font-mono text-[10px]">
            Kyoto Deck
          </span>
        </div>
      </div>
    </div>
  );
}
