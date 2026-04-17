import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Deal from "@/models/Deal";
import Storefront from "@/models/Storefront";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    // If making this deal active, deactivate all others first to maintain singularity
    if (body.isActive) {
      await Deal.updateMany({}, { isActive: false });
    }

    const updatedDeal = await Deal.findByIdAndUpdate(id, body, { new: true });

    // Synchronize with Storefront activeDeal
    if (updatedDeal?.isActive) {
      await Storefront.findOneAndUpdate({}, { activeDeal: updatedDeal._id }, { upsert: true });
    } else if (body.isActive === false) {
      // If we are explicitly deactivating this deal, clear it from storefront if it was the active one
      await Storefront.findOneAndUpdate({ activeDeal: id }, { activeDeal: null });
    }

    if (!updatedDeal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deal: updatedDeal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deletedDeal = await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
