import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Brand } from "@/models/CategoryBrand";

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find().sort({ name: 1 }).lean();
    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
