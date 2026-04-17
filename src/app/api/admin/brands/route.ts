import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Brand } from "@/models/CategoryBrand";
import { getAdminFromRequest } from "@/lib/adminAuth";

// POST /api/admin/brands — create new brand
export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await dbConnect();
    const { name, logo } = await req.json();
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const brand = await Brand.create({ name, slug, logo });
    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/admin/brands
export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await dbConnect();
    const brands = await Brand.find().sort({ name: 1 }).lean();
    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
