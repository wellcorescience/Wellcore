import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models/CategoryBrand";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
