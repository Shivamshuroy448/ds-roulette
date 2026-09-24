import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/topics';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import GitHubModal from './GitHubModal';
import {
  X,
  Check,
  Copy,
  Bookmark,
  Trophy,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Lock
} from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function TopicModal({
  topic,
  onClose,
  onSpinAgain,
  isMastered,
  onToggleMastered,
  isBookmarked,
  onToggleBookmarked,
  theme
}) {
  const { stats, recordQuizResult, recordStudyActivity } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Multi-question drill state
  const questions = (topic.quizzes && topic.quizzes.length > 0)
    ? topic.quizzes
    : (topic.quiz ? [topic.quiz] : []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [isDrillComplete, setIsDrillComplete] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);

  const currentQuiz = questions[currentQuestionIndex];
  const isQuizCompleted = questions.length === 0 || isDrillComplete || (questions.length > 0 && currentQuestionIndex === questions.length - 1 && hasAnswered && selectedOption === currentQuiz?.correctIndex);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setDrillScore(0);
    setIsDrillComplete(false);
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    setAutoAdvanceTimer(null);
    setCopied(false);
  }, [topic]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    };
  }, [autoAdvanceTimer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!topic) return null;

  const category = CATEGORIES[topic.category] || {
    name: 'General',
    color: '#cfb584',
    bgColor: 'rgba(207, 181, 132, 0.12)'
  };

  const handleCopyCode = async () => {
    if (!topic.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(topic.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handleNextQuestion = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsDrillComplete(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4b483', '#7ea193', '#c29b7f', '#be7b72', '#ede6db']
      });
    }
  };

  const handleRetryQuestion = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleQuizAnswer = (optionIdx) => {
    if (hasAnswered || !currentQuiz) return;
    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const isCorrect = optionIdx === currentQuiz.correctIndex;
    recordQuizResult(isCorrect);

    if (isCorrect) {
      sound.playChime();
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#d4b483', '#7ea193', '#c29b7f']
      });
      setDrillScore((prev) => prev + 1);

      // Auto-advance to the next question after 1.5s
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1500);
      setAutoAdvanceTimer(timer);
    } else {
      sound.playTick(0.6);
      // NOTE: Never auto-advance on wrong answer! The user must retry.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-white/5 bg-[#1a1714]">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border"
                style={{
                  backgroundColor: category.bgColor,
                  color: category.color,
                  borderColor: category.border
                }}
              >
                {category.name}
              </span>

              <span className="text-[10px] text-stone-400 font-mono">
                {topic.estimatedTime} read
              </span>

              {topic.difficulty && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-stone-400 font-mono">
                  {topic.difficulty}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-[#f5ede0] tracking-tight leading-snug">
              {topic.title}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleBookmarked(topic.id)}
              aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Topic"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                isBookmarked
                  ? 'bg-[#27211b] text-[#d4b483] border-[#d4b483]/30'
                  : 'text-stone-500 hover:text-stone-300 border-transparent hover:bg-white/5'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#d4b483]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto pr-4 select-text text-stone-300">
          {/* 1. Intuition */}
          <section className="space-y-1.5 bg-[#1c1815] p-3.5 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#d4b483]">
              01 • Intuitive Mental Model
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {topic.intuition}
            </p>
          </section>

          {/* 2. Recruiter Trap */}
          <section className="space-y-1.5 bg-[#201915]/60 p-3.5 rounded-xl border border-[#c29b7f]/25">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#c29b7f]">
              02 • The Interview Trap & Senior Insight
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {topic.recruiterTrap}
            </p>
          </section>

          {/* 3. Code Snippet */}
          {topic.codeSnippet && (
            <section className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                  03 • Implementation ({topic.codeLanguage})
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer font-mono"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#7ea193]" />
                      <span className="text-[#7ea193]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-[#0f0e0c] border border-white/5 overflow-hidden font-mono text-xs">
                <pre className="p-3.5 overflow-x-auto text-[#d4b483]/90 leading-relaxed">
                  <code>{topic.codeSnippet}</code>
                </pre>
              </div>
            </section>
          )}

          {/* 4. Multi-Question Recall Drill */}
          {questions.length > 0 && (
            <section className="space-y-2.5 bg-[#1a1714] p-3.5 rounded-xl border border-white/5">
              {/* Drill Completed Banner */}
              {isDrillComplete ? (
                <div className="py-3 px-2 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#26211a] border border-[#d4b483]/40 flex items-center justify-center text-[#d4b483] shadow-lg">
                    <Trophy className="w-6 h-6 text-[#d4b483]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#f5ede0]">
                      Drill Completed! 🎉
                    </h4>
                    <p className="text-xs text-stone-400 font-mono">
                      Score: <span className="text-[#d4b483] font-semibold">{drillScore}</span> / {questions.length} Questions Answered
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setSelectedOption(null);
                        setHasAnswered(false);
                        setDrillScore(0);
                        setIsDrillComplete(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Drill</span>
                    </button>

                    <button
                      onClick={() => setIsGitHubModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d1916] hover:bg-[#25201b] text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer shadow-sm"
                      title="Upload completed study card to GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload to GitHub ↗</span>
                    </button>

                    {!isMastered && (
                      <button
                        onClick={() => onToggleMastered(topic.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#26211a] hover:bg-[#322a21] text-[#d4b483] border border-[#d4b483]/40 transition-colors cursor-pointer shadow-sm"
                      >
                        <Trophy className="w-3 h-3 text-[#d4b483]" />
                        <span>Mark Mastered ✓</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Header with Step Progress */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4b483]">
                        04 • Drill Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>

                    {/* Progress Step Pills */}
                    <div className="flex items-center gap-1">
                      {questions.map((_, qIdx) => (
                        <div
                          key={qIdx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            qIdx === currentQuestionIndex
                              ? 'w-4 bg-[#d4b483]'
                              : qIdx < currentQuestionIndex
                              ? 'w-2 bg-[#7ea193]'
                              : 'w-2 bg-white/10'
                          }`}
                          title={`Question ${qIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-xs sm:text-sm font-medium text-stone-200 leading-snug">
                    {currentQuiz?.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                    {currentQuiz?.options.map((option, idx) => {
                      let optStyle = "bg-[#141210] hover:bg-[#1f1b17] border-white/5 text-stone-300";

                      if (hasAnswered) {
                        if (idx === currentQuiz.correctIndex) {
                          optStyle = "bg-[#18241d] border-[#7ea193]/60 text-[#a8c7b8] font-medium";
                        } else if (idx === selectedOption) {
                          optStyle = "bg-[#281a1a] border-[#be7b72]/60 text-[#d49e97]";
                        } else {
                          optStyle = "bg-[#141210] border-white/5 text-stone-600 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={hasAnswered}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${optStyle}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[10px] font-mono text-stone-400 shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </span>

                          {hasAnswered && idx === currentQuiz.correctIndex && (
                            <Check className="w-3.5 h-3.5 text-[#7ea193] shrink-0" />
                          )}
                          {hasAnswered && idx === selectedOption && idx !== currentQuiz.correctIndex && (
                            <X className="w-3.5 h-3.5 text-[#be7b72] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Box & Actions */}
                  {hasAnswered && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                      {selectedOption === currentQuiz.correctIndex ? (
                        <div className="p-2.5 rounded-lg text-xs leading-relaxed bg-[#18241d]/60 text-[#a8c7b8] border border-[#7ea193]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-[#7ea193]">✓ Correct: </span>
                            {currentQuiz.explanation}
                          </div>
                          <button
                            onClick={handleNextQuestion}
                            className="self-end sm:self-center shrink-0 flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-[#7ea193]/20 hover:bg-[#7ea193]/30 text-[#a8c7b8] border border-[#7ea193]/40 transition-colors cursor-pointer"
                          >
                            <span>Next Question →</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg text-xs leading-relaxed bg-[#281a1a]/60 text-[#d49e97] border border-[#be7b72]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-[#be7b72]">Takeaway: </span>
                            {currentQuiz.explanation}
                          </div>
                          <button
                            onClick={handleRetryQuestion}
                            className="self-end sm:self-center shrink-0 flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-[#be7b72]/20 hover:bg-[#be7b72]/30 text-[#d49e97] border border-[#be7b72]/40 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Try Again</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* 5. Deep Research & Authoritative Reading */}
          {topic.deepResearch && (
            <section className="space-y-2 bg-[#171411] p-3.5 rounded-xl border border-white/5 hover:border-[#d4b483]/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#d4b483] flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-[#d4b483]" />
                  <span>05 • Deep Research & Authoritative Reading</span>
                </div>
                {topic.deepResearch.source && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-stone-400 border border-white/5">
                    {topic.deepResearch.source}
                  </span>
                )}
              </div>

              <a
                href={topic.deepResearch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#201b17] hover:bg-[#27211c] border border-white/10 hover:border-[#d4b483]/40 transition-all group cursor-pointer text-stone-200"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[#f5ede0] group-hover:text-[#d4b483] transition-colors truncate">
                    {topic.deepResearch.title}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono truncate mt-0.5">
                    {topic.deepResearch.url}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#d4b483] group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Explore</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#1a1714] border-t border-white/5 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMastered(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border cursor-pointer ${
                isMastered
                  ? 'bg-[#26211a] text-[#d4b483] border-[#d4b483]/40'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/5 hover:text-white'
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${isMastered ? 'text-[#d4b483]' : 'text-stone-500'}`} />
              <span>{isMastered ? 'Mastered ✓' : 'Mark Mastered'}</span>
            </button>

            {/* Upload to GitHub Button - ONLY shown after completing all quiz questions */}
            {isQuizCompleted ? (
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d1916] hover:bg-[#25201b] text-[#d4b483] hover:text-white border border-[#d4b483]/30 hover:border-[#d4b483]/60 transition-all cursor-pointer shadow-sm animate-in fade-in"
                title="Upload study card to GitHub (Gist or Repo Commit)"
              >
                <GithubIcon className="w-3.5 h-3.5 text-[#d4b483]" />
                <span>Upload to GitHub</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-stone-400 bg-white/5 border border-white/5 select-none"
                title="Answer the drill question(s) above to unlock GitHub export"
              >
                <Lock className="w-3 h-3 text-stone-500" />
                <span>Complete quiz to export</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#221e1a] hover:bg-[#2a2520] text-[#f5ede0] border border-[#d4b483]/30 hover:border-[#d4b483]/60 transition-colors cursor-pointer"
          >
            <span>Spin Again</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#d4b483]" />
          </button>
        </div>

        {/* GitHub Upload & Permission Dialog */}
        <GitHubModal
          isOpen={isGitHubModalOpen}
          onClose={() => setIsGitHubModalOpen(false)}
          topic={topic}
          quizState={{ selectedOption, hasAnswered }}
          streak={stats?.streak || 1}
        />
      </div>
    </div>
  );
}
