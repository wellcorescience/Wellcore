import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import Storefront from "@/models/Storefront";

export async function GET() {
  try {
    await dbConnect();
    const deals = await Deal.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, deals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // If setting active, deactivate others
    if (body.isActive) {
      await Deal.updateMany({}, { isActive: false });
    }

    const newDeal = await Deal.create(body);

    // Synchronize with Storefront activeDeal
    if (newDeal.isActive) {
      await Storefront.findOneAndUpdate({}, { activeDeal: newDeal._id }, { upsert: true });
    }

    return NextResponse.json({ success: true, deal: newDeal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
