#!/usr/bin/env node
/**
 * Map every blog post's tags onto the curated taxonomy in blog/tags.yml.
 *
 * Deterministic and idempotent: the same input always yields the same tags,
 * and running it twice changes nothing. Only the `tags` entry of the front
 * matter is rewritten; every other byte of each file is preserved.
 *
 * Rules:
 * - Each old tag maps through TAG_MAP (null drops it). Tags already in
 *   blog/tags.yml map to themselves. An unknown tag is a hard error, so new
 *   tags always need an explicit mapping decision.
 * - `drupal` is kept only when the body mentions Drupal at least 3 times,
 *   and `wordpress` only when the body mentions WordPress at least 3 times.
 * - The old pipeline stamped `agent` and `ai` on almost every post, so
 *   `agents` and `ai-engineering` also need 3 matching mentions in the body.
 * - Mentions inside the pipeline's boilerplate "Why this matters for Drupal
 *   and WordPress" section do not count as evidence.
 * - Content-type tags (review, playbook, build) are also inferred from the
 *   slug and title, and take the last slot.
 * - At most MAX_TAGS tags; at least one tag (FALLBACK_TAG when nothing maps).
 *
 * Usage: node scripts/retag.mjs [--check]
 *   --check  report files whose tags would change and exit 1, without writing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const MAX_TAGS = 5;
const MIN_MENTIONS = 3;
const FALLBACK_TAG = 'architecture';
const CONTENT_TYPES = ['review', 'playbook', 'build'];

/** Old tag -> new taxonomy tag, or null to drop it. */
export const TAG_MAP = {
  // CMS (subject to the mention threshold)
  'drupal-10': 'drupal', 'drupal-11': 'drupal', 'drupal-cms': 'drupal', d12: 'drupal',
  canvas: 'drupal', flowdrop: 'drupal', 'drupal-commerce': 'drupal', starshot: 'drupal',
  recipes: 'drupal', pathauto: 'drupal', vbo: 'drupal', entities: 'drupal', views: 'drupal',
  'ui-suite': 'drupal', 'layout-builder': 'drupal',
  gutenberg: 'wordpress', 'block-editor': 'wordpress', 'plugin-development': 'wordpress',
  plugins: 'wordpress', 'wp-cli': 'wordpress', 'interactivity-api': 'wordpress',
  dataviews: 'wordpress', 'realtime-collaboration': 'wordpress', 'wordpress-playground': 'wordpress',
  // AI and agents
  ai: 'ai-engineering', llm: 'ai-engineering', openai: 'ai-engineering', gemini: 'ai-engineering',
  codex: 'ai-engineering', claude: 'ai-engineering', deepseek: 'ai-engineering', ollama: 'ai-engineering',
  agent: 'agents', 'ai-agent': 'agents', agentic: 'agents', 'agentic-ai': 'agents', mcp: 'agents',
  // Security
  'vulnerability-management': 'security', vulnerability: 'security', triage: 'security',
  'incident-response': 'security', ddos: 'security', malware: 'security', csp: 'security',
  sandbox: 'security', gdpr: 'security', privacy: 'security', vault: 'security',
  'secrets-management': 'security', secrets: 'security', 'key-management': 'security',
  patching: 'security', firefox: 'security', devsecops: 'security', forensics: 'security',
  authorization: 'auth',
  // Delivery
  'ci-cd': 'ci-cd', ci: 'ci-cd', cicd: 'ci-cd', 'github-actions': 'ci-cd',
  migration: 'release-engineering', compatibility: 'release-engineering',
  upgrades: 'release-engineering', upgrade: 'release-engineering', deprecations: 'release-engineering',
  'breaking-changes': 'release-engineering', rc: 'release-engineering', deployment: 'release-engineering',
  release: 'release-engineering', 'release-management': 'release-engineering',
  validation: 'testing', evaluations: 'testing', phpunit: 'testing', qa: 'testing', playwright: 'testing',
  // Platform and operations
  ops: 'devops', operations: 'devops', automation: 'devops', ddev: 'devops', docker: 'devops',
  traffic: 'devops', 'platform-engineering': 'devops', 'configuration-management': 'devops',
  pantheon: 'cloud', cloudflare: 'cloud', infrastructure: 'cloud', workers: 'cloud',
  cache: 'performance', benchmarking: 'performance',
  // Languages and web
  symfony: 'php', composer: 'php', laravel: 'php', pydantic: 'python',
  htmx: 'javascript', ajax: 'javascript', nodejs: 'javascript', 'chrome-extension': 'javascript',
  jsonapi: 'apis', api: 'apis', graphql: 'apis',
  'integration-architecture': 'integrations', messaging: 'integrations', jira: 'integrations',
  frontend: 'full-stack', headless: 'architecture', 'technical-debt': 'architecture',
  seo: 'technical-seo', 'google-news': 'technical-seo',
  sa11y: 'accessibility',
  community: 'open-source', contrib: 'open-source', maintainer: 'open-source', gitlab: 'open-source',
  checklist: 'playbook',
  // Dropped: too generic, too narrow or not a topic
  devlog: null, learning: null, workflow: null, cms: null, content: null, engineering: null,
  audit: null, governance: null, 'admin-ui': null, 'full-html': null, email: null,
  multilingual: null, dependencies: null, b2b: null, commerce: null, enterprise: null,
  backend: null, core: null, government: null, 'digital-sovereignty': null, analysis: null,
  quality: null, hackathon: null, rust: null, wasm: null, wsod: null, search: null, cli: null,
  risk: null, 'theme-development': null, dx: null, 'software-engineering': null,
  'best-practices': null, 'developer-experience': null, opinion: null, webscraping: null,
  survey: null, 'product-strategy': null, reliability: null, github: null, 'native-modules': null,
  roundup: null, 'editorial-workflows': null, 'editorial-workflow': null, 'code-review': null,
  'sql-server': null, yaml: null, sdk: null, 'data-integrity': null, maintenance: null,
  tooling: null,
};

/** Tags that are kept only when the body supports them (MIN_MENTIONS matches). */
export const EVIDENCE = {
  drupal: /\bdrupal\b/gi,
  wordpress: /\bwordpress\b/gi,
  agents: /\b(agents?|agentic|MCP)\b/gi,
  'ai-engineering': /\b(AI|LLMs?|GPT|Claude|Gemini|OpenAI|Codex|Copilot|Ollama|DeepSeek)\b/g,
};
const CMS_TAGS = ['drupal', 'wordpress'];
/** Boilerplate section headings whose content is not topic evidence. */
const BOILERPLATE_HEADING = /^(#{2,3})\s+(why this matters for drupal and wordpress|implications for drupal and wordpress)\b/i;

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;

function loadTaxonomy() {
  const tags = yaml.load(fs.readFileSync(path.join(BLOG_DIR, 'tags.yml'), 'utf8'));
  return new Set(Object.keys(tags));
}

/** Drop boilerplate sections (heading up to the next heading of the same or higher level). */
export function evidenceText(body) {
  const kept = [];
  let skipLevel = 0;
  for (const line of body.split('\n')) {
    const heading = line.match(/^(#{1,6})\s/);
    if (skipLevel && heading && heading[1].length <= skipLevel) skipLevel = 0;
    const boilerplate = line.match(BOILERPLATE_HEADING);
    if (boilerplate) skipLevel = boilerplate[1].length;
    if (!skipLevel) kept.push(line);
  }
  return kept.join('\n');
}

function hasEvidence(tag, body) {
  const pattern = EVIDENCE[tag];
  return !pattern || (body.match(pattern) || []).length >= MIN_MENTIONS;
}

function mapTag(tag, taxonomy, file) {
  if (Object.hasOwn(TAG_MAP, tag)) return TAG_MAP[tag];
  if (taxonomy.has(tag)) return tag;
  throw new Error(`${file}: tag "${tag}" has no mapping in scripts/retag.mjs TAG_MAP`);
}

function inferContentType(frontMatter, mapped) {
  const slug = String(frontMatter.slug ?? '');
  const title = String(frontMatter.title ?? '');
  if (/^build(ing)?-/.test(slug)) return 'build';
  if (/^review\b/i.test(title)) return 'review';
  if (/\b(playbook|checklist)\b/i.test(title)) return 'playbook';
  return CONTENT_TYPES.find((type) => mapped.includes(type)) ?? null;
}

export function computeTags(frontMatter, body, taxonomy, file = '') {
  const mapped = [];
  for (const tag of frontMatter.tags ?? []) {
    const next = mapTag(String(tag), taxonomy, file);
    if (next && !mapped.includes(next)) mapped.push(next);
  }
  const evidence = evidenceText(body);
  const withEvidence = mapped.filter((tag) => hasEvidence(tag, evidence));
  // When the evidence filter would leave no topic at all, fall back to the
  // mapped topics (never the CMS tags) before using FALLBACK_TAG.
  const hasTopic = (tags) => tags.some((tag) => !CONTENT_TYPES.includes(tag) && !CMS_TAGS.includes(tag));
  const supported = hasTopic(withEvidence) || withEvidence.some((tag) => CMS_TAGS.includes(tag))
    ? withEvidence
    : mapped.filter((tag) => !CMS_TAGS.includes(tag));
  // Engineering topics lead, CMS tags follow (they are specialties, not the
  // headline), and the content type takes the last slot. CMS tags that pass
  // the mention threshold always keep their slot.
  const cms = supported.filter((tag) => CMS_TAGS.includes(tag));
  const topics = supported.filter(
    (tag) => !CONTENT_TYPES.includes(tag) && !CMS_TAGS.includes(tag),
  );
  const contentType = inferContentType(frontMatter, mapped);
  const room = (contentType ? MAX_TAGS - 1 : MAX_TAGS) - cms.length;
  const result = [...topics.slice(0, room), ...cms, ...(contentType ? [contentType] : [])];
  return result.length > 0 ? result : [FALLBACK_TAG];
}

/** Replace only the `tags:` entry (flow or block style) inside the front matter text. */
function replaceTagsEntry(frontMatterText, tags) {
  const lines = frontMatterText.split('\n');
  const start = lines.findIndex((line) => /^tags:/.test(line));
  const entry = `tags: [${tags.join(', ')}]`;
  if (start === -1) return [...lines, entry].join('\n');
  let end = start + 1;
  // Block-style lists continue on indented lines or on "- item" lines.
  while (end < lines.length && /^(\s+\S|- )/.test(lines[end])) end++;
  lines.splice(start, end - start, entry);
  return lines.join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  const taxonomy = loadTaxonomy();
  const files = fs.readdirSync(BLOG_DIR).filter((name) => /\.mdx?$/.test(name)).sort();
  let changed = 0;
  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const match = source.match(FRONT_MATTER);
    if (!match) throw new Error(`${file}: missing front matter`);
    const frontMatter = yaml.load(match[1]);
    const body = source.slice(match[0].length);
    const tags = computeTags(frontMatter, body, taxonomy, file);
    const current = (frontMatter.tags ?? []).map(String);
    if (current.join('\0') === tags.join('\0')) continue;
    changed++;
    if (check) {
      console.log(`${file}: [${current.join(', ')}] -> [${tags.join(', ')}]`);
      continue;
    }
    const updated = `---\n${replaceTagsEntry(match[1], tags)}\n---\n${body}`;
    fs.writeFileSync(fullPath, updated);
  }
  console.log(`${check ? 'Would change' : 'Retagged'} ${changed} of ${files.length} posts.`);
  if (check && changed > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
