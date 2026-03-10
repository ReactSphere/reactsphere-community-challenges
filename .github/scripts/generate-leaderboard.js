#!/usr/bin/env node
/**
 * generate-leaderboard.js
 *
 * Generates a contributions leaderboard for the
 * reactsphere-community-challenges repo.
 *
 * Counts:
 *   - Commits
 *   - Pull Requests (opened)
 *   - Issues (opened)
 *   - Code Reviews (PR review submissions)
 *   - Documentation changes (*.md files)
 *
 * Requires environment variables:
 *   GITHUB_TOKEN – PAT or workflow token
 *   ORG          – GitHub org name
 *   REPO         – Repository name
 *   OUTPUT_FILE  – Output markdown file (default: LEADERBOARD.md)
 */

'use strict';

const https = require('https');
const fs = require('fs');

const ORG = process.env.ORG;
const REPO = process.env.REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'LEADERBOARD.md';

if (!ORG || !REPO) {
  console.error('ERROR: ORG and REPO environment variables must be set.');
  process.exit(1);
}
if (!TOKEN) {
  console.error('ERROR: GITHUB_TOKEN environment variable is not set.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function isIgnoredUser(login) {
  if (!login) return true;
  if (login.endsWith('[bot]')) return true;
  const ignored = ['Copilot'];
  return ignored.includes(login);
}

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const results = [];

    function fetchPage(url) {
      const options = {
        hostname: 'api.github.com',
        path: url,
        headers: {
          Authorization: `token ${TOKEN}`,
          'User-Agent': 'leaderboard-generator/1.0',
          Accept: 'application/vnd.github+json',
        },
      };

      https.get(options, (res) => {
        if (res.statusCode === 403 || res.statusCode === 429) {
          const resetAt = res.headers['x-ratelimit-reset'];
          const waitSec = resetAt
            ? Math.max(0, Number(resetAt) - Math.floor(Date.now() / 1000)) + 1
            : 60;
          console.warn(`Rate limited on ${url}. Waiting ${waitSec}s…`);
          setTimeout(() => fetchPage(url), waitSec * 1000);
          return;
        }
        if (res.statusCode === 204) {
          resolve(results);
          return;
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          console.warn(`WARN: GET ${url} returned HTTP ${res.statusCode} – skipping.`);
          resolve(results);
          return;
        }

        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let data;
          try {
            data = JSON.parse(body);
          } catch (e) {
            console.warn(`WARN: Could not parse response for ${url}`);
            resolve(results);
            return;
          }

          if (Array.isArray(data)) results.push(...data);
          else results.push(data);

          const link = res.headers['link'] || '';
          const nextMatch = link.match(/<([^>]+)>;\s*rel="next"/);
          if (nextMatch) {
            const nextUrl = new URL(nextMatch[1]);
            fetchPage(nextUrl.pathname + nextUrl.search);
          } else resolve(results);
        });
      }).on('error', (err) => {
        console.error(`ERROR: Network error fetching ${url}: ${err.message}`);
        reject(err);
      });
    }

    fetchPage(path);
  });
}

// ---------------------------------------------------------------------------
// Fetch contributions
// ---------------------------------------------------------------------------

async function fetchCommits() {
  const commits = await apiGet(`/repos/${ORG}/${REPO}/commits?per_page=100`);
  return commits.filter((c) => c.author && c.author.login);
}

async function fetchPullRequests() {
  const prs = await apiGet(`/repos/${ORG}/${REPO}/pulls?state=all&per_page=100`);
  return prs.filter((p) => p.user && p.user.login);
}

async function fetchIssues() {
  const issues = await apiGet(`/repos/${ORG}/${REPO}/issues?state=all&per_page=100`);
  return issues.filter((i) => !i.pull_request && i.user && i.user.login);
}

async function fetchReviews() {
  const prs = await apiGet(`/repos/${ORG}/${REPO}/pulls?state=all&per_page=100`);
  const reviews = [];
  const recentPrs = prs.slice(0, 30);
  for (const pr of recentPrs) {
    const prReviews = await apiGet(`/repos/${ORG}/${REPO}/pulls/${pr.number}/reviews?per_page=100`);
    reviews.push(...prReviews.filter((r) => r.user && r.user.login));
  }
  return reviews;
}

async function fetchDocCommits() {
  const commits = await apiGet(`/repos/${ORG}/${REPO}/commits?per_page=50`);
  const eligible = commits.filter((c) => c.author && c.author.login);

  const BATCH = 10;
  const docCommits = [];
  for (let i = 0; i < eligible.length; i += BATCH) {
    const batch = eligible.slice(i, i + BATCH);
    const details = await Promise.all(batch.map((c) => apiGet(`/repos/${ORG}/${REPO}/commits/${c.sha}`)));
    for (let j = 0; j < batch.length; j++) {
      const files = (details[j][0] || details[j]).files || [];
      const isDoc = files.some((f) => f.filename.endsWith('.md') || f.filename.startsWith('docs/'));
      if (isDoc) docCommits.push(batch[j]);
    }
  }
  return docCommits;
}

// ---------------------------------------------------------------------------
// Aggregate contributions
// ---------------------------------------------------------------------------

function ensureUser(map, login, avatarUrl) {
  if (isIgnoredUser(login)) return;
  if (!map[login]) {
    map[login] = { login, avatarUrl: avatarUrl || `https://github.com/${login}.png`, commits: 0, pullRequests: 0, issues: 0, codeReviews: 0, documentation: 0 };
  }
  if (avatarUrl && map[login].avatarUrl.endsWith('.png')) map[login].avatarUrl = avatarUrl;
}

async function aggregateContributions() {
  const contributions = {};

  // Commits
  try {
    const commits = await fetchCommits();
    commits.forEach((c) => {
      ensureUser(contributions, c.author.login, c.author.avatar_url);
      contributions[c.author.login].commits += 1;
    });
  } catch {}

  // PRs
  try {
    const prs = await fetchPullRequests();
    prs.forEach((p) => {
      ensureUser(contributions, p.user.login, p.user.avatar_url);
      contributions[p.user.login].pullRequests += 1;
    });
  } catch {}

  // Issues
  try {
    const issues = await fetchIssues();
    issues.forEach((i) => {
      ensureUser(contributions, i.user.login, i.user.avatar_url);
      contributions[i.user.login].issues += 1;
    });
  } catch {}

  // Reviews
  try {
    const reviews = await fetchReviews();
    reviews.forEach((r) => {
      ensureUser(contributions, r.user.login, r.user.avatar_url);
      contributions[r.user.login].codeReviews += 1;
    });
  } catch {}

  // Documentation
  try {
    const docs = await fetchDocCommits();
    docs.forEach((c) => {
      ensureUser(contributions, c.author.login, c.author.avatar_url);
      contributions[c.author.login].documentation += 1;
    });
  } catch {}

  return contributions;
}

// ---------------------------------------------------------------------------
// Generate Markdown
// ---------------------------------------------------------------------------

function totalContributions(entry) {
  return entry.commits + entry.pullRequests + entry.issues + entry.codeReviews + entry.documentation;
}

function badge(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}.`;
}

function generateMarkdown(contributions) {
  const sorted = Object.values(contributions).sort((a, b) => totalContributions(b) - totalContributions(a));
  const now = new Date().toISOString().split('T')[0];

  const lines = [
    '# 🏆 ReactSphere Challenge Leaderboard',
    '',
    `> Last updated: ${now}`,
    '',
    '| Rank | Avatar | Username | Total | Commits | PRs | Issues | Reviews | Docs |',
    '|------|--------|----------|------:|--------:|---:|-------:|--------:|-----:|',
  ];

  sorted.forEach((entry, idx) => {
    const rank = idx + 1;
    const total = totalContributions(entry);
    const avatar = `<img src="${entry.avatarUrl}" width="32" height="32" alt="${entry.login}" />`;
    const username = `[@${entry.login}](https://github.com/${entry.login})`;
    lines.push(`| ${badge(rank)} | ${avatar} | ${username} | **${total}** | ${entry.commits} | ${entry.pullRequests} | ${entry.issues} | ${entry.codeReviews} | ${entry.documentation} |`);
  });

  lines.push('');
  lines.push('_Generated automatically by the leaderboard workflow._');
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  try {
    console.log('=== ReactSphere Challenge Leaderboard Generator ===');
    const contributions = await aggregateContributions();
    const markdown = generateMarkdown(contributions);
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
    console.log(`Leaderboard written to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`FATAL: ${err.message}`);
    process.exit(1);
  }
})();