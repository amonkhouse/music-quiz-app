import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RESULTS_COOKIE, verifySession } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(RESULTS_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.redirect(new URL("/results/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/results"],
};
