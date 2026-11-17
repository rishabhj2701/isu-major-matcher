// Session-only activity counters that feed achievements. Nothing is stored.

import { useSyncExternalStore } from 'react';

const counts = {};
const listeners = new Set();
let version = 0;

export function track(event, n = 1) {
  counts[event] = (counts[event] ?? 0) + n;
  version += 1;
  listeners.forEach((l) => l());
}

export function useCounts() {
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => version);
  return counts;
}
