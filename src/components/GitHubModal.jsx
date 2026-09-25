import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  GitCommit,
  Check,
  ExternalLink,
  AlertCircle,
  Key,
  FolderGit2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

function GithubIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
import {
  getStoredGitHubConfig,
  saveGitHubConfig,
  clearGitHubConfig,
  generateTopicMarkdown,
  commitToGitHubRepo
} from '../utils/github';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function GitHubModal({ isOpen, onClose, topic, quizState, streak = 1 }) {
  const { user } = useAuth();
  const userId = user?.uid || (user?.email ? encodeURIComponent(user.email) : null);

  const [config, setConfig] = useState(() => getStoredGitHubConfig(userId));
  const [activeMode, setActiveMode] = useState('select'); // 'select' | 'repo-form' | 'success'
  const [copiedGist, setCopiedGist] = useState(false);

  // Form states for Mode B
  const [owner, setOwner] = useState(config.owner || '');
  const [repo, setRepo] = useState(config.repo || '');
  const [folder, setFolder] = useState(config.folder || 'study-notes');
  const [token, setToken] = useState(config.token || '');
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitError, setCommitError] = useState('');
  const [commitResult, setCommitResult] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGitHubConfig(userId);
      setConfig(stored);
      setOwner(stored.owner || '');
      setRepo(stored.repo || '');
      setFolder(stored.folder || 'study-notes');
      setToken(stored.token || '');
      setActiveMode('select');
      setCommitError('');
      setCommitResult(null);
      setCopiedGist(false);
      setConsentGiven(Boolean(stored.token));
    }
  }, [isOpen, userId]);

  if (!isOpen || !topic) return null;

  const hasConfiguredRepo = Boolean(config.owner && config.repo && config.token);

  // Handle Mode 1: Instant Gist / Markdown Export
  const handleInstantGist = async () => {
    const md = generateTopicMarkdown(topic, quizState, streak);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedGist(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#d4b483', '#7ea193']
      });
      // Open GitHub Gist in new tab
      window.open('https://gist.github.com/', '_blank');
      setTimeout(() => setCopiedGist(false), 3000);
    } catch (_) {
      window.open('https://gist.github.com/', '_blank');
    }
  };

  // Handle Mode 2: Commit to Repository
  const handleRepoCommit = async (customConfig = null) => {
    setIsCommitting(true);
    setCommitError('');

    const targetConfig = customConfig || config;

    try {
      const result = await commitToGitHubRepo({
        owner: targetConfig.owner,
        repo: targetConfig.repo,
        folder: targetConfig.folder,
        token: targetConfig.token,
        topic,
        quizState,
        streak
      });

      setCommitResult(result);
      setActiveMode('success');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#2ea043', '#7ea193', '#d4b483']
      });
    } catch (err) {
      setCommitError(err.message || 'Failed to commit to repository.');
    } finally {
      setIsCommitting(false);
    }
  };

  // Save Settings & Commit
  const handleSaveAndCommit = (e) => {
    e.preventDefault();
    if (!owner.trim() || !repo.trim() || !token.trim()) {
      setCommitError('Please fill in your GitHub username, repository, and token.');
      return;
    }

    const newConfig = {
      owner: owner.trim(),
      repo: repo.trim(),
      folder: folder.trim() || 'study-notes',
      token: token.trim()
    };

    saveGitHubConfig(newConfig, userId);
    setConfig(newConfig);
    handleRepoCommit(newConfig);
  };

  const handleDisconnect = () => {
    clearGitHubConfig(userId);
    setConfig({ owner: '', repo: '', folder: 'study-notes', token: '' });
    setOwner('');
    setRepo('');
    setToken('');
    setActiveMode('select');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#161412] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden animate-in zoom-in-95 duration-150 text-stone-300 text-xs"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#221e1a] border border-[#d4b483]/30 flex items-center justify-center text-[#d4b483] shadow-md shrink-0">
            <GithubIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5ede0]">
              Upload to GitHub
            </h3>
            <p className="text-[11px] text-stone-400 truncate max-w-xs">
              {topic.title}
            </p>
          </div>
        </div>

        {/* MODE: Select Destination */}
        {activeMode === 'select' && (
          <div className="space-y-3.5">
            <p className="text-[11px] text-stone-400">
              Where would you like to save this study card?
            </p>

            {/* Option 1: Instant 1-Click Gist */}
            <div className="p-3.5 rounded-xl bg-[#1d1916] border border-white/5 hover:border-[#d4b483]/30 transition-all space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-medium text-stone-200">
                  <Sparkles className="w-4 h-4 text-[#d4b483]" />
                  <span>Mode 1: Instant Gist (1-Click)</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-stone-400">
                  Zero Setup
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Copies formatted markdown notes & opens GitHub Gist in 1 click. Perfect for quick sharing with friends.
              </p>
              <button
                onClick={handleInstantGist}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#26211a] hover:bg-[#322a21] border border-[#d4b483]/30 text-[#d4b483] font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedGist ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied & Opening Gist!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Copy Markdown & Open Gist ↗</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Direct Repo Commit */}
            <div className="p-3.5 rounded-xl bg-[#1d1916] border border-white/5 hover:border-emerald-500/30 transition-all space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-medium text-stone-200">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                  <span>Mode 2: Commit to Repository</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                  🟩 Green Squares
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Pushes a markdown card into your GitHub repo, recording real commits on your profile graph.
              </p>

              {hasConfiguredRepo ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono bg-[#141210] p-2 rounded-lg border border-white/5">
                    <span className="text-stone-300 truncate">
                      {config.owner}/{config.repo}/{config.folder}/
                    </span>
                    <button
                      onClick={() => setActiveMode('repo-form')}
                      className="text-[#d4b483] hover:underline text-[10px] shrink-0 ml-2"
                    >
                      Edit
                    </button>
                  </div>

                  <button
                    onClick={() => handleRepoCommit()}
                    disabled={isCommitting}
                    className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isCommitting ? (
                      <span>Pushing Commit to GitHub...</span>
                    ) : (
                      <>
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Push Commit to GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveMode('repo-form')}
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-[#202923] hover:bg-[#28382c] border border-emerald-500/30 text-emerald-300 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Connect Repository & Grant Permission</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              )}
            </div>

            {commitError && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{commitError}</span>
              </div>
            )}
          </div>
        )}

        {/* MODE: Connect Repo & Permission Form */}
        {activeMode === 'repo-form' && (
          <form onSubmit={handleSaveAndCommit} className="space-y-3 animate-in fade-in duration-100">
            <div className="p-2.5 bg-[#1a1714] rounded-xl border border-[#d4b483]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-[#d4b483] font-medium text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GitHub Security & Local Storage Policy</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                Credentials are saved <strong>only in your local browser storage</strong>{user?.email ? ` for ${user.email}` : ''} and never transmitted to RoyLabs servers. We recommend generating a <strong>Fine-Grained Token</strong> limited strictly to repository contents.
              </p>
            </div>

            {commitError && (
              <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[10px]">
                {commitError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="gh-username-input" className="block text-[10px] font-mono uppercase text-stone-400 mb-1">
                  GitHub Username
                </label>
                <input
                  id="gh-username-input"
                  type="text"
                  required
                  placeholder="e.g. randomguy"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full bg-[#110f0d] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#d4b483]/40 focus-visible:ring-1 focus-visible:ring-[#d4b483] font-mono"
                />
              </div>

              <div>
                <label htmlFor="gh-repo-input" className="block text-[10px] font-mono uppercase text-stone-400 mb-1">
                  Repository Name
                </label>
                <input
                  id="gh-repo-input"
                  type="text"
                  required
                  placeholder="e.g. dsroulette"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full bg-[#110f0d] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#d4b483]/40 focus-visible:ring-1 focus-visible:ring-[#d4b483] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="gh-folder-input" className="block text-[10px] font-mono uppercase text-stone-400 mb-1">
                  Target Folder
                </label>
                <input
                  id="gh-folder-input"
                  type="text"
                  placeholder="study-notes"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full bg-[#110f0d] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#d4b483]/40 focus-visible:ring-1 focus-visible:ring-[#d4b483] font-mono"
                />
              </div>

              <div>
                <label htmlFor="gh-branch-input" className="block text-[10px] font-mono uppercase text-stone-400 mb-1">
                  Branch
                </label>
                <input
                  id="gh-branch-input"
                  type="text"
                  disabled
                  value="main (auto-detects master)"
                  className="w-full bg-[#110f0d]/50 border border-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-stone-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gh-token-input" className="block text-[10px] font-mono uppercase text-stone-400">
                  Personal Access Token (PAT)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=DS+Roulette+Study+Sync"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#d4b483] hover:underline flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-[#d4b483]"
                >
                  <span>Generate Token (1-click)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                id="gh-token-input"
                type="password"
                required
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-[#110f0d] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#d4b483]/40 focus-visible:ring-1 focus-visible:ring-[#d4b483] font-mono"
              />
            </div>

            {/* Form Consent Checkbox */}
            <label className="flex items-start gap-2 pt-1 text-[11px] text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#110f0d] text-[#d4b483] focus:ring-[#d4b483] cursor-pointer"
              />
              <span className="leading-snug">
                I understand that this Personal Access Token is stored strictly in my browser's LocalStorage and transmitted directly to <code className="text-[#d4b483]">api.github.com</code>. RoyLabs does not store or see my credentials.
              </span>
            </label>

            <div className="pt-1 flex gap-2">
              <button
                type="submit"
                disabled={isCommitting || !consentGiven}
                aria-label="Save credentials and push commit to GitHub"
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  isCommitting || !consentGiven
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400'
                }`}
              >
                {isCommitting ? <span>Connecting & Pushing...</span> : <span>Save & Push Commit</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('select')}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#d4b483]"
              >
                Cancel
              </button>
            </div>

            {hasConfiguredRepo && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                >
                  Disconnect saved GitHub account
                </button>
              </div>
            )}
          </form>
        )}

        {/* MODE: Success Screen */}
        {activeMode === 'success' && commitResult && (
          <div className="text-center space-y-3 py-2 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-lg shadow-md">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#f5ede0]">
                Successfully Committed to GitHub! 🟩
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                {commitResult.path}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={commitResult.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View File</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </a>

              <a
                href={commitResult.commitUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Commit</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-1 py-1.5 text-xs text-stone-500 hover:text-stone-300 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
