import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { createShiprocketOrder } from "@/lib/shiprocket";

// Helper to check admin session
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && (session.user as any)?.role === 'admin';
}

// PUT /api/admin/orders/[id] — update order status, tracking
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { orderStatus, trackingId, courier, paymentStatus } = body;

    const order = await Order.findById(id).populate("user", "name email");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.orderStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingId) order.trackingId = trackingId;
    if (courier) order.courier = courier;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus === "Delivered") order.deliveredAt = new Date();

    // Trigger Shiprocket if newly confirmed
    if (orderStatus === "Confirmed" && previousStatus !== "Confirmed") {
      const shiprocketResult = await createShiprocketOrder(order);
      if (shiprocketResult.success) {
        order.shiprocketOrderId = shiprocketResult.data.order_id;
        order.shiprocketShipmentId = shiprocketResult.data.shipment_id;
        // Shiprocket might return a tracking ID immediately if configured
        if (shiprocketResult.data.awb_code) {
          order.trackingId = shiprocketResult.data.awb_code;
        }
      } else {
        console.error("Shiprocket creation failed:", shiprocketResult.error);
        // We don't block the status update but log it
      }
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/admin/orders/[id] — get single order details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "title slug images")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
