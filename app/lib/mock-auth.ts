/**
 * Mock Auth Layer
 *
 * This module provides fake/demo authentication for the boilerplate.
 * Replace with real auth (Better Auth, NextAuth, etc.) when ready for production.
 *
 * The mock uses a simple cookie-based session to persist login state across page loads.
 */

const SESSION_COOKIE = "boilerplate_demo_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "admin" | "user";
  createdAt: string;
  subscriptionTier: string;
}

export interface MockSession {
  user: MockUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

const DEMO_USERS: MockUser[] = [
  {
    id: "user_1",
    name: "Rahul",
    email: "rahul@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    role: "admin",
    createdAt: "2025-01-15T00:00:00Z",
    subscriptionTier: "Pro",
  },
  {
    id: "user_2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "admin",
    createdAt: "2025-02-20T00:00:00Z",
    subscriptionTier: "Pro",
  },
  {
    id: "user_3",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    role: "user",
    createdAt: "2025-03-10T00:00:00Z",
    subscriptionTier: "Starter",
  },
  {
    id: "user_4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: "user",
    createdAt: "2025-04-05T00:00:00Z",
    subscriptionTier: "Starter",
  },
  {
    id: "user_5",
    name: "Alex Kim",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "user",
    createdAt: "2025-05-01T00:00:00Z",
    subscriptionTier: "Pro",
  },
];

/**
 * Get the default demo user (Rahul).
 */
export function getDefaultUser(): MockUser {
  return DEMO_USERS[0];
}

/**
 * Get all demo users.
 */
export function getAllUsers(): MockUser[] {
  return DEMO_USERS;
}

/**
 * Get a demo user by ID.
 */
function getUserById(id: string): MockUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}

/**
 * Create a session cookie value for a user.
 */
function createSessionCookie(userId: string): string {
  const sessionData = JSON.stringify({
    userId,
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  });
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionData)}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

/**
 * Parse the session cookie from a Request object.
 */
function parseSessionCookie(request: Request): { userId: string; sessionId: string } | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

/**
 * Server-side: Get the current session from the request.
 * Returns null if not logged in.
 */
export function getSession(request: Request): MockSession | null {
  const parsed = parseSessionCookie(request);
  if (!parsed) return null;

  const user = getUserById(parsed.userId);
  if (!user) return null;

  return {
    user,
    session: {
      id: parsed.sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
    },
  };
}

/**
 * Server-side: Create a session for a user (returns Set-Cookie header value).
 */
export function createSession(userId: string): string {
  return createSessionCookie(userId);
}

/**
 * Server-side: Destroy the session (returns Set-Cookie header value).
 */
export function destroySession(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Demo sign-in: accepts any email/password, returns the first matching user or the default user.
 */
export function demoSignIn(email: string, _password: string): { sessionCookie: string; user: MockUser } {
  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? DEMO_USERS[0];
  return {
    sessionCookie: createSessionCookie(user.id),
    user,
  };
}

/**
 * Demo sign-up: creates a new user (in-memory only) and returns a session.
 */
export function demoSignUp(name: string, email: string, _password: string): { sessionCookie: string; user: MockUser } {
  const newUser: MockUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    role: "user",
    createdAt: new Date().toISOString(),
    subscriptionTier: "Starter",
  };

  // Add to in-memory list for the current server session
  DEMO_USERS.push(newUser);

  return {
    sessionCookie: createSessionCookie(newUser.id),
    user: newUser,
  };
}
