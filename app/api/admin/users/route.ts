import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabaseClient } from "../../../utils/admin";

/**
 * GET /api/admin/users
 * List all admin users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const supabase = getAdminSupabaseClient();

    const { data: adminUsers, error } = await supabase
      .from("admin_users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch admin users" },
        { status: 500 }
      );
    }

    return NextResponse.json(adminUsers);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
}

/**
 * POST /api/admin/users
 * Add a new admin user by email
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new admin user
    const { data: newUser, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        role: "admin",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin user:", error);
      return NextResponse.json(
        { error: "Failed to create admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Remove an admin user by email
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    // Delete the admin user
    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("email", email);

    if (error) {
      console.error("Error deleting admin user:", error);
      return NextResponse.json(
        { error: "Failed to delete admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Admin user deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
}
