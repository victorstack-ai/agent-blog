#!/usr/bin/env node
/**
 * Content gate for blog posts. Exits 1 and lists every violation when any
 * post breaks a rule, so CI stops before the build.
 *
 * Rules for every post in blog/:
 * - front matter has slug, title, authors, tags, description and date
 * - every tag is defined in blog/tags.yml
 * - the body has a <!-- truncate --> marker
 * - description is at most 200 characters
 * - no <script or <style tags, and no "' @theme/" import typo
 * - no link to the wrong LinkedIn profile (linkedin.com/in/victor-jimenez)
 * - no old CTA footer ("Looking for an Architect", "Need an Enterprise ... Architect")
 * Extra rules for posts dated 2026-10-01 or later (written by Victor):
 * - no em or en dashes and no emoji anywhere in the file
 *
 * Usage: node scripts/validate-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const REQUIRED_FIELDS = ['slug', 'title', 'authors', 'tags', 'description', 'date'];
const MAX_DESCRIPTION = 200;
const STRICT_FROM = '2026-10-01';
const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;

/** Patterns checked on the raw file text, with the message to report. */
const TEXT_RULES = [
  { pattern: /<script/i, message: '<script> tag (MDX cannot compile it)' },
  { pattern: /<style/i, message: '<style> tag (MDX cannot compile it)' },
  { pattern: /['"] @theme\//, message: 'space before @theme import breaks the MDX loader' },
  { pattern: /linkedin\.com\/in\/victor-jimenez(?![\w-])/i, message: 'link to the wrong LinkedIn profile; use linkedin.com/in/victor-j-8268a2266' },
  { pattern: /looking for an architect|need an enterprise [\w ]*architect|enterprise cms case studies/i, message: 'old CTA footer text' },
];

const STRICT_RULES = [
  { pattern: /[–—]/, message: 'em or en dash' },
  { pattern: /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u, message: 'emoji' },
];

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function findAll(text, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return [...text.matchAll(new RegExp(pattern.source, flags))].map((m) => lineOf(text, m.index));
}

function toIsoDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function checkPost(file, source, taxonomy) {
  const errors = [];
  const add = (message, line) => errors.push(`${file}${line ? `:${line}` : ''}: ${message}`);

  const match = source.match(FRONT_MATTER);
  if (!match) {
    add('missing front matter');
    return errors;
  }
  let frontMatter;
  try {
    frontMatter = yaml.load(match[1]) ?? {};
  } catch (error) {
    add(`invalid front matter YAML: ${error.reason ?? error.message}`);
    return errors;
  }

  for (const field of REQUIRED_FIELDS) {
    const value = frontMatter[field];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      add(`missing required front matter field "${field}"`);
    }
  }
  for (const tag of frontMatter.tags ?? []) {
    if (!taxonomy.has(String(tag))) add(`tag "${tag}" is not defined in blog/tags.yml`);
  }
  if (typeof frontMatter.description === 'string' && frontMatter.description.length > MAX_DESCRIPTION) {
    add(`description is ${frontMatter.description.length} characters (max ${MAX_DESCRIPTION})`);
  }
  if (!source.includes('<!-- truncate -->')) add('missing <!-- truncate --> marker');

  for (const { pattern, message } of TEXT_RULES) {
    for (const line of findAll(source, pattern)) add(message, line);
  }
  if (frontMatter.date && toIsoDate(frontMatter.date) >= STRICT_FROM) {
    for (const { pattern, message } of STRICT_RULES) {
      for (const line of findAll(source, pattern)) add(`${message} (not allowed in posts dated ${STRICT_FROM} or later)`, line);
    }
  }
  return errors;
}

function main() {
  const taxonomy = new Set(Object.keys(yaml.load(fs.readFileSync(path.join(BLOG_DIR, 'tags.yml'), 'utf8')) ?? {}));
  const entries = fs.readdirSync(BLOG_DIR).sort();
  const posts = entries.filter((name) => /\.mdx?$/.test(name));
  const errors = [];

  for (const file of posts) {
    errors.push(...checkPost(file, fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'), taxonomy));
  }
  // Script and style tags are banned in any file under blog/, not only posts.
  for (const file of entries.filter((name) => !posts.includes(name))) {
    const fullPath = path.join(BLOG_DIR, file);
    if (!fs.statSync(fullPath).isFile()) continue;
    const text = fs.readFileSync(fullPath, 'utf8');
    for (const { pattern, message } of TEXT_RULES.slice(0, 2)) {
      for (const line of findAll(text, pattern)) errors.push(`${file}:${line}: ${message}`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`::error::${error}`);
    console.error(`Content validation failed: ${errors.length} error(s) in ${posts.length} posts.`);
    process.exitCode = 1;
    return;
  }
  console.log(`Content validation passed: ${posts.length} posts.`);
}

main();
