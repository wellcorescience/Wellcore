import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    // Fetch full user from DB if needed, or just return session data
    // Here we fetch to ensure we have the most up-to-date role/info
    const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Agent not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: "Protocol verification failed" }, { status: 500 });
  }
}
