import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Helper: extract user from cookie and check admin role
export async function getAdminFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}
