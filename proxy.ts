import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET, });

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  if (!token.isAdmin) {
    return NextResponse.redirect(new URL("/403", request.url));
  }
  console.log("MIDDLEWARE RUNNING:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin(.*)", "/api/admin(.*)"],
};

