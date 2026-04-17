import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models/CategoryBrand";
import { getAdminFromRequest } from "@/lib/adminAuth";

// POST /api/admin/categories — create new category
export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await dbConnect();
    const { name } = await req.json();
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const category = await Category.create({ name, slug });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/admin/categories
export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
