import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin"];

export function middleware(request: NextRequest) {
  if (PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    // TODO: integrate NextAuth session validation once backend auth is connected.
    return NextResponse.next();
  }

  return NextResponse.next();
}

