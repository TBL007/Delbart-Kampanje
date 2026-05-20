import { signOut } from "../../../auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/signout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
  try {
    await signOut({ redirectTo: "/" });
    return NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/signout error:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
