import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Razorpay from "razorpay";

// POST /api/orders/razorpay — create Razorpay order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: "No order items" }, { status: 400 });
    }

    // Validate stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.name} stock insufficient` },
          { status: 400 }
        );
      }
    }

    // Create Razorpay order
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const userId = (session.user as any).id;

    if (!keyId || !keySecret) {
      // Fallback mock for dev without keys
      const order = await Order.create({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod: "ONLINE",
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice,
        razorpayOrderId: "mock_order_" + Date.now(),
        paymentStatus: "Pending",
        orderStatus: "Processing",
      });

      return NextResponse.json({
        success: true,
        order,
        razorpayOrder: {
          id: order.razorpayOrderId,
          amount: Math.round(totalPrice * 100),
          currency: "INR",
        },
        key: "rzp_test_mock",
        mock: true,
      });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // paise
      currency: "INR",
      receipt: `wc_${Date.now()}`,
    });

    // Save order in DB with razorpay order id
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod: "ONLINE",
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalPrice,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    return NextResponse.json({
      success: true,
      order,
      razorpayOrder,
      key: keyId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
