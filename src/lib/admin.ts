import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "godhandusa_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sessionToken(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD as string)
    .update("godhandusa-admin-session")
    .digest("hex");
}

function digest(value: string): Buffer {
  return createHmac("sha256", "godhandusa-admin-compare")
    .update(value)
    .digest();
}

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, process.env.ADMIN_PASSWORD as string);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && safeEqual(token, sessionToken());
}

export async function setAdminCookie() {
  const store = await cookies();

  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
