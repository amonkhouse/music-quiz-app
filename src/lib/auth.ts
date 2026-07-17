import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.SESSION_SECRET;

export const RESULTS_COOKIE = "quiz_results_session";

function sign(payload: string): string {
  if (!SECRET) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function signSession(): string {
  const payload = Date.now().toString();
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token || !SECRET) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
