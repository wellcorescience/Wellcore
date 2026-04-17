import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import Storefront from "@/models/Storefront";

// Helper to check admin session
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
}

export async function GET() {
  try {
    // We allow GET for public visibility in some cases, but usually, 
    // the admin dashboard needs the full data. 
    // For now, let's just ensure we have a db connection.
    await dbConnect();
    let storefront = await Storefront.findOne();
    
    if (!storefront) {
      storefront = await Storefront.create({});
    }
    
    return NextResponse.json({ success: true, storefront });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized access detected" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();

    let storefront = await Storefront.findOne();
    if (!storefront) {
      storefront = await Storefront.create(body);
    } else {
      const { _id, __v, createdAt, updatedAt, ...updates } = body;
      
      Object.keys(updates).forEach(key => {
        storefront.set(key, updates[key]);
      });
      
      if (updates.shopVideos) storefront.markModified('shopVideos');
      if (updates.trustedReviews) storefront.markModified('trustedReviews');

      await storefront.save();
    }
    
    return NextResponse.json({ success: true, storefront });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
