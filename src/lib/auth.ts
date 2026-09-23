import "server-only";
import crypto from "crypto";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const COOKIE = "aac_admin";
const SECRET =
  process.env.ADMIN_SESSION_SECRET || "aac-local-secret-change-in-production";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function hashPassword(password: string, salt?: string) {
  const useSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, useSalt, 64).toString("hex");
  return `${useSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

export async function hasAdmin(): Promise<boolean> {
  try {
    const admin = await db.adminUser.findFirst();
    return !!admin;
  } catch {
    return false;
  }
}

export async function createAdmin(password: string) {
  const exists = await db.adminUser.findFirst();
  if (exists) throw new Error("Admin já existe");
  await db.adminUser.create({ data: { passwordHash: hashPassword(password) } });
}

export async function login(password: string): Promise<boolean> {
  const admin = await db.adminUser.findFirst();
  if (!admin || !verifyPassword(password, admin.passwordHash)) return false;
  const token = createSessionToken();
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function changePassword(current: string, next: string) {
  const admin = await db.adminUser.findFirst();
  if (!admin || !verifyPassword(current, admin.passwordHash)) return false;
  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: hashPassword(next) },
  });
  return true;
}

function createSessionToken(): string {
  const payload = `admin.${Date.now() + TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expiry = Number(parts[1]);
  if (!expiry || expiry < Date.now()) return false;
  try {
    const expected = sign(payload);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]));
  } catch {
    return false;
  }
}
