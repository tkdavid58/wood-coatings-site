import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "admin";

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || "changeme";
}

function expectedToken(): string {
  return crypto.createHmac("sha256", getSecret()).update(SESSION_VALUE).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = expectedToken();
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(tokenBuf, expectedBuf);
}

export function checkPassword(password: string): boolean {
  const secret = getSecret();
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
