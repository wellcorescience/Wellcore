import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// POST /api/orders/verify — verify Razorpay payment signature
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If no key secret (dev mode), auto-verify
    if (!keySecret) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      order.paymentStatus = "Paid";
      order.paidAt = new Date();
      order.razorpayPaymentId = razorpay_payment_id || "mock_payment";
      order.razorpaySignature = razorpay_signature || "mock_sig";
      order.orderStatus = "Confirmed";
      await order.save();

      // Decrement stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      return NextResponse.json({ success: true, order });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = "Paid";
    order.paidAt = new Date();
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.orderStatus = "Confirmed";
    await order.save();

    // Decrement stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
