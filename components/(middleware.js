import { NextResponse } from "next/server";

export function middleware(req) {
  const isLoggedIn =
    req.cookies.get("isLoggedIn") || req.nextUrl.searchParams.get("isLoggedIn");

  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/talkntype")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/talkntype/:path*"],
};
