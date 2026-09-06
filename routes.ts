/**
 * Routes that never require authentication.
 */
export const publicRoutes: string[] = [];

/**
 * Auth routes. Logged-in users hitting these are redirected to DEFAULT_LOGIN_REDIRECT.
 */
export const authRoutes: string[] = ["/login"];

/**
 * Prefix for NextAuth API routes. These are always allowed through.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Where users land after a successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
