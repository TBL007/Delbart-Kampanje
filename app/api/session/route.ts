import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth";

/**
 * GET /api/session
 * Get current session information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        session: {
          user: {
            email: session.user?.email,
            isAdmin: (session.user as any)?.isAdmin,
          },
          expiresAt: (session.user as any)?.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
