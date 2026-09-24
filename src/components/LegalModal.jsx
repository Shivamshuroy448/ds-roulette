import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  FileText,
  Cookie,
  CreditCard,
  Building2,
  CheckCircle,
  ExternalLink,
  Lock,
  EyeOff,
  Database,
  Trash2
} from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const modalRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'cookies', label: 'Cookie & Storage Policy', icon: Cookie },
    { id: 'refund', label: 'Refund Policy', icon: CreditCard },
    { id: 'business', label: 'Business & Contact', icon: Building2 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-[#161412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-150 text-stone-300"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#1a1714]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#221e1a] border border-[#d4b483]/30 flex items-center justify-center text-[#d4b483]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-sm font-semibold text-[#f5ede0]">
                Legal & Privacy Center
              </h2>
              <p className="text-[11px] text-stone-400 font-mono">
                RoyLabs Compliance, Safety & Data Disclosures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close legal modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Legal Sections"
          className="flex items-center gap-1 p-2 bg-[#13110f] border-b border-white/5 overflow-x-auto scrollbar-none"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483] ${
                  isActive
                    ? 'bg-[#26211c] text-[#f5ede0] border border-[#d4b483]/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d4b483]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-stone-300">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div id="panel-privacy" role="tabpanel" aria-labelledby="tab-privacy" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4b483]">
                  Effective Date: September 2026
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  Version 2.0 • Zero-Tracking Standard
                </span>
              </div>

              <div className="p-3 bg-[#1e1a16] border border-[#d4b483]/20 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#d4b483] font-semibold text-xs">
                  <EyeOff className="w-4 h-4 shrink-0" />
                  <span>Privacy Summary: Zero Third-Party Tracking</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  RoyLabs does not use third-party analytics trackers, advertising networks, or marketing cookies. We collect only what is strictly necessary to run this application.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">1. Information We Collect</h3>
                <p>We believe in strict data minimization. Depending on how you interact with DS Roulette, we process:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  <li>
                    <strong className="text-[#f5ede0]">Guest Mode (Default):</strong> Zero personal identifiable information (PII). Your progress, bookmarked cards, custom category selections, and sound preferences are stored strictly on your device using HTML5 LocalStorage.
                  </li>
                  <li>
                    <strong className="text-[#f5ede0]">Google Authentication (Optional):</strong> If you choose to sign in via Google OAuth, we receive only your public profile name, verified email address, and avatar URL provided by Google LLC via Firebase Authentication.
                  </li>
                  <li>
                    <strong className="text-[#f5ede0]">GitHub Study Notes Export (Optional):</strong> If you choose to export your notes to GitHub, your GitHub Personal Access Token (PAT) and repository details are stored strictly in your local browser's LocalStorage and sent directly to <code className="text-[#d4b483]">api.github.com</code>. We never see or store your tokens on our servers.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">2. Purpose of Processing</h3>
                <p>Your data is processed strictly for the following legal bases (GDPR Art. 6):</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  <li>To provide and maintain your study streak and concept mastery status (Contractual Necessity).</li>
                  <li>To execute user-requested flashcard study note exports to your personal GitHub repository (User Consent).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">3. Third-Party Infrastructure</h3>
                <p>We work with trusted industry providers under strict data privacy obligations:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  <li><strong>Vercel Inc.</strong> (Hosting & Edge Delivery): Processes standard HTTP connection logs for security and uptime monitoring.</li>
                  <li><strong>Google LLC / Firebase</strong> (Authentication): Processes Google OAuth credentials securely under Google's standard enterprise privacy agreements.</li>
                  <li><strong>GitHub Inc.</strong>: Directly contacted by your browser when you trigger a note export.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">4. Your Rights & Data Deletion (GDPR & CCPA)</h3>
                <p>
                  You have the unconditional right to access, rectify, or delete your data at any time. Because non-authenticated data is stored locally on your device, you can completely erase all data in 1 click using the <strong>"Reset Progress"</strong> button in your Profile modal, or by clearing your browser's site data.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">5. Contact Our Privacy Lead</h3>
                <p>
                  For any privacy inquiries, GDPR data requests, or deletion verifications, please reach out to <strong className="text-[#f5ede0]">support@roylabs.app</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS AND CONDITIONS */}
          {activeTab === 'terms' && (
            <div id="panel-terms" role="tabpanel" aria-labelledby="tab-terms" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4b483]">
                  Effective Date: September 2026
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  User Terms & Educational Disclaimers
                </span>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using DS Roulette (roylabs.vercel.app), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue using the service.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">2. Educational & Informational Purpose Only</h3>
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1 text-amber-200/90 text-[11px]">
                  <strong>Non-Affiliation & No Guarantee Notice:</strong>
                  <p>
                    DS Roulette is an independent educational training aid developed by RoyLabs. DS Roulette is <strong>NOT affiliated with, sponsored by, or endorsed by Google, Meta, Amazon, Apple, Netflix, Microsoft, LeetCode, HackerRank, or any prospective employer</strong>.
                  </p>
                </div>
                <p>
                  All interview questions, mental models, code snippets, and recruiter insights are synthesized educational summaries intended for self-study and interview preparation. <strong>We make NO guarantee of employment, job offer, recruitment success, or specific interview outcomes.</strong>
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">3. Intellectual Property</h3>
                <p>
                  The unique web application design, wheel interactive software, compilation, and editorial flashcard summaries are the proprietary property of RoyLabs. Open-source underlying libraries and mathematical/algorithmic concepts remain the property of their respective creators or the public domain.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">4. Acceptable Use</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  <li>Use automated scrapers, bots, or extraction scripts to mass-download the proprietary question curriculum.</li>
                  <li>Attempt to bypass security features, reverse-engineer proprietary code, or interfere with service availability.</li>
                  <li>Use the service for any unlawful or abusive purpose.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">5. Disclaimer of Warranties & Limitation of Liability</h3>
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. ROY LABS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OR INABILITY TO USE THE SERVICE.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: COOKIE & STORAGE POLICY */}
          {activeTab === 'cookies' && (
            <div id="panel-cookies" role="tabpanel" aria-labelledby="tab-cookies" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4b483]">
                  Cookie & Local Storage Disclosure
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  ePrivacy Directive & GDPR Compliant
                </span>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">1. Do We Use Cookies?</h3>
                <p>
                  <strong>No.</strong> DS Roulette does <strong>not</strong> set any HTTP tracking cookies on your device. We do not use advertising pixels, cross-site trackers, or third-party cookies.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">2. What Local Storage Keys Are Used?</h3>
                <p>
                  Under the EU ePrivacy Directive, storage that is <em>strictly necessary</em> to provide a service explicitly requested by the user is legally exempt from consent requirements. We use HTML5 LocalStorage strictly for functional session preferences:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border border-white/10 rounded-lg text-[11px] font-mono text-left">
                    <thead className="bg-[#1e1a16] text-[#d4b483]">
                      <tr>
                        <th className="p-2 border-b border-white/10">Storage Key</th>
                        <th className="p-2 border-b border-white/10">Type & Purpose</th>
                        <th className="p-2 border-b border-white/10">Classification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-stone-300">
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_theme</td>
                        <td className="p-2">Remembers your selected visual aesthetic (Kyoto, Linear, Matcha)</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_categories</td>
                        <td className="p-2">Remembers active question filter categories on the dial</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_mastered</td>
                        <td className="p-2">Stores the IDs of questions you have marked as mastered</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_bookmarks</td>
                        <td className="p-2">Stores your bookmarked topic flashcards for quick review</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_stats</td>
                        <td className="p-2">Tracks your daily study streak count and quiz accuracy</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_consent_acknowledged</td>
                        <td className="p-2">Remembers that you have acknowledged our privacy and storage notice</td>
                        <td className="p-2 text-emerald-400 font-sans">Strictly Necessary</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-[#f5ede0]">ds_roulette_github_config_*</td>
                        <td className="p-2">Stores optional user-provided GitHub repository and token details locally</td>
                        <td className="p-2 text-emerald-400 font-sans">User Initiated</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">3. How to Clear Local Storage</h3>
                <p>
                  You can purge all stored local data at any time either by clicking <strong>"Reset Progress"</strong> in your Profile modal or by clearing storage in your browser settings (Inspect &gt; Application &gt; Local Storage &gt; Clear).
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: REFUND POLICY */}
          {activeTab === 'refund' && (
            <div id="panel-refund" role="tabpanel" aria-labelledby="tab-refund" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4b483]">
                  Commercial Status & Refund Policy
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  100% Free Educational Access
                </span>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">1. Current Pricing & Free Access</h3>
                <p>
                  <strong>DS Roulette is currently 100% free of charge.</strong> You are not required to enter payment information, credit card details, or pay any subscription fees to access the full curriculum of 47 data science concepts, interactive quizzes, or study tools.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">2. Future Commercial Offerings</h3>
                <p>
                  In the event that RoyLabs introduces optional paid premium features, downloadable comprehensive interview guides, or 1-on-1 mock interview reviews in the future:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  <li>
                    <strong className="text-[#f5ede0]">14-Day Statutory Withdrawal:</strong> In compliance with consumer protection standards and EU consumer rights directives, buyers of digital products or subscription memberships will be entitled to request a full refund within 14 days of purchase, provided services have not been fully consumed.
                  </li>
                  <li>
                    <strong className="text-[#f5ede0]">Cancellation:</strong> Any recurring subscription may be cancelled at any time with zero penalty through your account settings.
                  </li>
                  <li>
                    <strong className="text-[#f5ede0]">Refund Inquiries:</strong> Contact <strong className="text-[#f5ede0]">support@roylabs.app</strong> with your transaction reference.
                  </li>
                </ul>
              </section>
            </div>
          )}

          {/* TAB 5: BUSINESS & CONTACT */}
          {activeTab === 'business' && (
            <div id="panel-business" role="tabpanel" aria-labelledby="tab-business" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4b483]">
                  Publisher Information & Legal Notice
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  Transparency Notice
                </span>
              </div>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#f5ede0]">Operator & Publisher Information</h3>
                <div className="p-3.5 bg-[#1e1a16] border border-white/10 rounded-xl space-y-2 text-stone-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Entity / Project:</span>
                      <strong className="text-[#f5ede0]">RoyLabs (DS Roulette)</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Lead Developer:</span>
                      <strong className="text-[#f5ede0]">Shivamshu Roy</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Official Inquiries & Support:</span>
                      <a href="mailto:support@roylabs.app" className="text-[#d4b483] hover:underline font-mono">
                        support@roylabs.app
                      </a>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Hosting Provider:</span>
                      <span className="text-[#f5ede0]">Vercel Inc., 440 N Barranca Ave #4133, Covina, CA</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-[#f5ede0]">Copyright & Trademark Disclaimers</h3>
                <p>
                  &copy; {new Date().getFullYear()} RoyLabs. All rights reserved.
                </p>
                <p className="text-stone-400 text-[11px]">
                  All third-party trademarks, company names, and logos mentioned in the study materials (including SQL, Python, TensorFlow, PyTorch, Docker, Kubernetes, AWS, Google Cloud, Meta, LeetCode) are the intellectual property of their respective owners. Their mention does not imply endorsement, sponsorship, or affiliation.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-white/5 bg-[#141210] flex items-center justify-between">
          <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#d4b483]" />
            <span>Encrypted Client State • Verified Safe</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#d4b483] hover:bg-[#e2c69d] text-stone-900 font-medium text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
