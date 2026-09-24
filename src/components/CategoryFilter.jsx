import React from 'react';
import { CATEGORIES } from '../data/topics';
import { Database, Brain, BarChart2, Cpu, TrendingUp, Layers, Target } from 'lucide-react';

const ICON_MAP = {
  Database,
  Brain,
  BarChart2,
  Cpu,
  TrendingUp,
  Layers
};

export default function CategoryFilter({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onFocusCategory,
  topicCounts,
  theme
}) {
  const allCategoryIds = Object.keys(CATEGORIES);
  const isSingleFocused = selectedCategories.length === 1;
  const focusedCatId = isSingleFocused ? selectedCategories[0] : null;
  const isAllSelected = selectedCategories.length === allCategoryIds.length;

  const totalActiveTopics = selectedCategories.reduce((acc, catId) => acc + (topicCounts[catId] || 0), 0);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-2.5">
      {/* 1. Quick 1-Click Focus Selector Strip */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-stone-400">
          <Target className="w-3.5 h-3.5 text-[#d4b483]" />
          <span>Focus Mode:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
          {/* All button */}
          <button
            onClick={onSelectAll}
            className={`px-2 py-1 rounded transition-colors cursor-pointer text-[10px] font-mono ${
              isAllSelected
                ? 'bg-[#27211b] text-[#d4b483] border border-[#d4b483]/30 font-semibold'
                : 'bg-[#181512] text-stone-400 hover:text-stone-200 border border-white/5'
            }`}
          >
            All (47)
          </button>

          {/* Quick Focus Pills */}
          {allCategoryIds.map((catId) => {
            const cat = CATEGORIES[catId];
            const isFocused = isSingleFocused && focusedCatId === catId;
            const count = topicCounts[catId] || 0;

            return (
              <button
                key={catId}
                onClick={() => onFocusCategory(catId)}
                title={`Focus wheel exclusively on ${cat.name}`}
                className={`px-2 py-1 rounded transition-all cursor-pointer text-[10px] font-mono flex items-center gap-1.5 shrink-0 ${
                  isFocused
                    ? 'bg-[#27211b] text-[#f5ede0] border font-medium shadow-sm'
                    : 'bg-[#181512] text-stone-400 hover:text-stone-200 border border-white/5 hover:border-white/10'
                }`}
                style={{
                  borderColor: isFocused ? cat.color : undefined
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name.split(' ')[0]}</span>
                <span className="text-stone-500 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Category Pills with Multi-Select & Direct Focus */}
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
        {allCategoryIds.map((catId) => {
          const cat = CATEGORIES[catId];
          const isSelected = selectedCategories.includes(catId);
          const isOnlyThis = isSingleFocused && focusedCatId === catId;
          const count = topicCounts[catId] || 0;

          return (
            <div
              key={catId}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border select-none ${
                isSelected
                  ? 'bg-[#1e1a16] text-[#f5ede0] border-[#d4b483]/30 shadow-sm'
                  : 'bg-[#151311]/40 text-stone-500 border-white/5 opacity-60'
              }`}
            >
              {/* Toggle checkbox click */}
              <button
                onClick={() => onToggleCategory(catId)}
                className="flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: cat.color,
                    opacity: isSelected ? 1 : 0.4
                  }}
                />
                <span className="font-normal">{cat.name}</span>
                <span className="text-[10px] font-mono text-stone-400 font-semibold">
                  {count}
                </span>
              </button>

              {/* Instant Focus click */}
              {!isOnlyThis && (
                <button
                  onClick={() => onFocusCategory(catId)}
                  title={`Focus only on ${cat.name}`}
                  className="text-[9px] px-1 py-0.2 rounded bg-white/5 hover:bg-white/15 text-stone-400 hover:text-stone-200 transition-colors font-mono cursor-pointer ml-0.5"
                >
                  focus
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Active Status Banner */}
      <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-0.5 px-1">
        <span>
          {isSingleFocused ? (
            <span className="text-[#d4b483]">
              🎯 Focused on {CATEGORIES[focusedCatId]?.name} ({totalActiveTopics} cards on dial)
            </span>
          ) : (
            <span>
              Dial includes {selectedCategories.length} disciplines ({totalActiveTopics} cards total)
            </span>
          )}
        </span>
        {isSingleFocused && (
          <button
            onClick={onSelectAll}
            className="text-stone-400 hover:text-stone-200 underline cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>
    </div>
  );
}
