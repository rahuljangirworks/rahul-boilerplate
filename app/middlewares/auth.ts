import { cache } from "react";
import type { MiddlewareFunction } from "react-router";
import { createContext, redirect } from "react-router";
import { auth } from "~/lib/auth.server";
import type { AuthUser, AuthSession } from "~/lib/auth.server";

// Routes that require an authenticated session
const PROTECTED_ROUTES = ["/dashboard"] as const;

// Routes that should only be accessible to logged-out users
const GUEST_ONLY_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/mfa",
] as const;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export type { AuthUser, AuthSession };

export const optionalAuthContext = createContext<AuthSession | null>(null);

export const requiredAuthContext = createContext<AuthSession>();

export const getSession = cache(async (request: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session;
  } catch (error) {
    console.error("Error retrieving session in middleware:", error);
    return null;
  }
});

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next
) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const sessionData = await getSession(request);

  const hasSession = !!sessionData;

  // 1. Guest only routes (redirect to dashboard if logged in)
  if (isGuestOnlyRoute(pathname)) {
    if (hasSession) {
      throw redirect("/dashboard");
    }
    context.set(optionalAuthContext, null);
    return next();
  }

  // 2. Protected routes (redirect to sign-in if logged out)
  if (isProtectedRoute(pathname)) {
    if (!hasSession) {
      const fullPath = pathname + url.search;
      const redirectTo = encodeURIComponent(fullPath);
      throw redirect(`/auth/sign-in?redirectTo=${redirectTo}`);
    }
    context.set(optionalAuthContext, sessionData);
    context.set(requiredAuthContext, sessionData);
    return next();
  }

  // 3. Public routes (pass optional session if exists)
  context.set(optionalAuthContext, sessionData);
  return next();
};
