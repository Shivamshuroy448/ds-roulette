/**
 * GitHub Integration Utilities for DS Roulette
 * Supports:
 * 1. Mode A: Instant 1-Click Markdown / Gist Export (zero credentials required)
 * 2. Mode B: Direct Repository Commit API (turns contribution squares green)
 */

import { secureStorage } from './security';

const BASE_STORAGE_GITHUB_KEY = 'ds_roulette_github_config';

function getStorageKey(userId) {
  if (!userId) return `${BASE_STORAGE_GITHUB_KEY}_guest`;
  const safeId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${BASE_STORAGE_GITHUB_KEY}_${safeId}`;
}

// Remove legacy un-scoped key to prevent cross-account leakage across different Gmail accounts
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(BASE_STORAGE_GITHUB_KEY);
  } catch (_) {}
}

/**
 * Get stored GitHub credentials and repo configuration (isolated per user)
 */
export function getStoredGitHubConfig(userId = null) {
  const key = getStorageKey(userId);
  return secureStorage.getItem(key, {
    owner: '',
    repo: '',
    folder: 'study-notes',
    token: ''
  });
}

/**
 * Save GitHub configuration securely in localStorage (isolated per user)
 */
export function saveGitHubConfig(config, userId = null) {
  const key = getStorageKey(userId);
  return secureStorage.setItem(key, {
    owner: (config.owner || '').trim(),
    repo: (config.repo || '').trim(),
    folder: (config.folder || 'study-notes').trim().replace(/^\/|\/$/g, ''),
    token: (config.token || '').trim()
  });
}

/**
 * Clear stored GitHub credentials (isolated per user)
 */
export function clearGitHubConfig(userId = null) {
  const key = getStorageKey(userId);
  secureStorage.removeItem(key);
}

/**
 * Generates an interview-grade study markdown file from a topic
 */
export function generateTopicMarkdown(topic, quizState = null, streak = 1) {
  if (!topic) return '';

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const categoryName = topic.category ? topic.category.toUpperCase() : 'DATA SCIENCE';
  let quizSection = '';

  const questionsList = (topic.quizzes && topic.quizzes.length > 0)
    ? topic.quizzes
    : (topic.quiz ? [topic.quiz] : []);

  if (questionsList.length > 0) {
    quizSection = `
## 🎯 Interview Drill Check (${questionsList.length} Questions)
` + questionsList.map((q, idx) => `
### Question ${idx + 1}: ${q.question}
- **Correct Answer**: \`${q.options[q.correctIndex]}\`
- **Key Takeaway**: ${q.explanation}
`).join('\n');
  }

  let researchSection = '';
  if (topic.deepResearch) {
    researchSection = `
---

## 📚 Deep Research & Authoritative Reading
- **Resource**: [${topic.deepResearch.title}](${topic.deepResearch.url})
- **Source Authority**: \`${topic.deepResearch.source || 'Official Documentation'}\`
`;
  }

  return `# ☕ ${topic.title}
> **Discipline**: ${categoryName}  
> **Difficulty**: ${topic.difficulty || 'Intermediate'} | **Estimated Time**: ${topic.estimatedTime || '3 min'}  
> **Mastered On**: ${today} | **Daily Streak**: Day ${streak} 🔥  
> **Source**: [DS Roulette: Interview Wheel](https://github.com/Shivamshuroy448/ds-roulette)

---

## 💡 Intuitive Mental Model
${topic.intuition || topic.summary || 'Core high-yield data science concept.'}

---

## ⚠️ The Interview Trap & Senior Insight
${topic.recruiterTrap || 'Keep edge cases in mind when answering questions on this topic.'}

---

## 💻 Code Example & Technical Implementation
\`\`\`${topic.codeLanguage || (topic.codeSnippet?.includes('SELECT') ? 'sql' : 'python')}
${topic.codeSnippet || '# Conceptual card - review theoretical foundations.'}
\`\`\`
${quizSection}${researchSection}
---
*Generated with ☕ [DS Roulette](https://github.com/Shivamshuroy448/ds-roulette) | Keep your streak active!*
`.trim();
}

/**
 * Commits a markdown file directly to a GitHub repository using the GitHub REST API.
 * Uses base64 encoding with UTF-8 support.
 */
export async function commitToGitHubRepo({ owner, repo, folder, token, topic, quizState, streak }) {
  if (!owner || !repo || !token || !topic) {
    throw new Error("Missing GitHub credentials or repository info.");
  }

  const cleanFolder = (folder || 'study-notes').replace(/^\/|\/$/g, '');
  const categoryFolder = topic.category || 'general';
  const fileSlug = (topic.title || 'topic')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const path = `${cleanFolder}/${categoryFolder}/${fileSlug}.md`;

  const markdownContent = generateTopicMarkdown(topic, quizState, streak);
  // Safe UTF-8 to Base64 encoding
  const base64Content = btoa(unescape(encodeURIComponent(markdownContent)));

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // 1. Check if file already exists to get its sha (for clean updating)
  let sha = null;
  try {
    const existingFileRes = await fetch(apiUrl, { headers });
    if (existingFileRes.ok) {
      const fileData = await existingFileRes.json();
      sha = fileData.sha;
    }
  } catch (_) {}

  // 2. Commit the file (PUT)
  const commitPayload = {
    message: `Study: Mastered ${topic.title} [DS Roulette]`,
    content: base64Content,
    branch: 'main'
  };

  if (sha) {
    commitPayload.sha = sha;
  }

  let res = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(commitPayload)
  });

  // Fallback to 'master' branch if 'main' doesn't exist
  if (!res.ok && res.status === 404) {
    commitPayload.branch = 'master';
    res = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitPayload)
    });
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Invalid GitHub Token. Please verify token permissions.");
    }
    if (res.status === 404) {
      throw new Error(`Repository "${owner}/${repo}" not found or token lacks 'repo' write access.`);
    }
    throw new Error(errorData.message || `GitHub commit failed (${res.status})`);
  }

  const result = await res.json();
  return {
    success: true,
    path,
    commitUrl: result.commit?.html_url || `https://github.com/${owner}/${repo}/blob/main/${path}`,
    fileUrl: result.content?.html_url || `https://github.com/${owner}/${repo}/blob/main/${path}`
  };
}
