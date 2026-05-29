"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid email or password",
    OAuthSignin: "Error connecting to OAuth provider",
    OAuthCallback: "Error in OAuth callback",
    OAuthCreateAccount: "Could not create OAuth account",
    EmailCreateAccount: "Could not create email account",
    Callback: "Error in authentication callback",
    EmailSignInError: "Email sign in error",
    SessionCallback: "Session callback error",
    default: "An authentication error occurred",
  };

  const message = error
    ? errorMessages[error] || errorMessages.default
    : errorMessages.default;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        <p className="text-lg text-gray-600 mb-8">{message}</p>
        <Link href="/api/auth/signin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
