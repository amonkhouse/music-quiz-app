import { distance } from "fastest-levenshtein";

const MATCH_THRESHOLD = 0.7;

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/\bfeat\.?\b|\bft\.?\b|\bfeaturing\b/g, "") // drop "feat."/"ft."
    .replace(/^\s*the\s+/, "") // drop leading "the "
    .replace(/[^a-z0-9\s]/g, "") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  return 1 - distance(a, b) / Math.max(a.length, b.length);
}

export function isMatch(guess: string, correct: string): boolean {
  const a = normalize(guess);
  const b = normalize(correct);
  if (!a || !b) return false;
  return similarity(a, b) >= MATCH_THRESHOLD;
}

// True if `guess` fuzzy-matches the canonical answer or any accepted alias.
export function isMatchAny(guess: string, candidates: string[]): boolean {
  return candidates.some((candidate) => isMatch(guess, candidate));
}
