// Session-only comment store shared across tabs of the app (alumni stories and
// learning communities). Nothing is written to localStorage or a server: like
// results, comments disappear on reload. A pilot would send them to a
// moderated backend with verified accounts.

import { useSyncExternalStore } from 'react';

const threads = new Map(); // threadId -> comment[]
const listeners = new Set();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

export function seedThread(threadId, seed = []) {
  if (!threads.has(threadId)) {
    threads.set(threadId, seed.map((c, i) => ({ id: `${threadId}-seed-${i}`, likes: 0, liked: false, mine: false, at: null, ...c })));
  }
}

export function addComment(threadId, { author, role = 'student', body }) {
  const text = body.trim().slice(0, 600);
  if (!text) return;
  const list = threads.get(threadId) ?? [];
  threads.set(threadId, [...list, { id: `${threadId}-${Date.now()}`, author: author?.trim() || 'Anonymous student', role, body: text, likes: 0, liked: false, mine: true, at: Date.now() }]);
  emit();
}

export function toggleLike(threadId, commentId) {
  const list = threads.get(threadId) ?? [];
  threads.set(threadId, list.map((c) => (c.id === commentId ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c)));
  emit();
}

export function removeComment(threadId, commentId) {
  const list = threads.get(threadId) ?? [];
  threads.set(threadId, list.filter((c) => !(c.id === commentId && c.mine)));
  emit();
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useThread(threadId, seed) {
  seedThread(threadId, seed);
  useSyncExternalStore(subscribe, () => version);
  return threads.get(threadId) ?? [];
}

// Exposed for tests.
export function _getThread(threadId) {
  return threads.get(threadId) ?? [];
}
