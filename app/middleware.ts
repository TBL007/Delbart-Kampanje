import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    // Check if user is authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    // Check if token is expired
    const now = Date.now();
    const expiresAt = (session.user as any)?.expiresAt;

    if (expiresAt && now > expiresAt) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    // Check if user is admin
    const isAdmin = (session.user as any)?.isAdmin;

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
