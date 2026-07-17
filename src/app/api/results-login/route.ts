import { NextRequest, NextResponse } from "next/server";
import { RESULTS_COOKIE, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!process.env.RESULTS_PASSWORD) {
    throw new Error("RESULTS_PASSWORD is not set");
  }

  if (password !== process.env.RESULTS_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(RESULTS_COOKIE, signSession(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 4,
  });
  return res;
}
