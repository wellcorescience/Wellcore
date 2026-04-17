import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// POST /api/orders — create a new order (COD)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const {
      items, 
      shippingAddress,
      paymentMethod,
      phone,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No order items" }, { status: 400 });
    }

    const itemsPrice = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const taxPrice = itemsPrice * 0.18;
    const finalTotal = itemsPrice + taxPrice;

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name || 'Unknown'} not found` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.title} is out of stock (only ${product.stock} left)` },
          { status: 400 }
        );
      }
    }

    const order = await Order.create({
      user: (session.user as any).id,
      orderItems: items.map((item: any) => ({
        product: item.product,
        name: item.name || "Product",
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        ...shippingAddress,
        phone: phone || shippingAddress.phone 
      },
      paymentMethod,
      itemsPrice,
      shippingPrice: 0,
      taxPrice,
      totalAmount: finalTotal,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
      orderStatus: "Processing",
    });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/orders — get user's orders
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({ user: (session.user as any).id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
