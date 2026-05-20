import { auth } from "../../auth";

import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-side guard to ensure only admin users can execute code
 * Throws error and redirects if user is not admin
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const isAdmin = (session.user as any)?.isAdmin;
  const expiresAt = (session.user as any)?.expiresAt;
  const now = Date.now();

  // Check session expiration
  if (expiresAt && now > expiresAt) {
    redirect("/api/auth/signin");
  }

  // Check admin status
  if (!isAdmin) {
    redirect("/403");
  }

  return session;
}

/**
 * Server-side function to check if a user email is an admin
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error checking admin status:", error);
    return false;
  }

  return !!data;
}

/**
 * Get the Supabase admin service client
 */
export function getAdminSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseServiceKey);
}
