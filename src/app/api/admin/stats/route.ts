import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAdminFromRequest } from "@/lib/adminAuth";

// GET /api/admin/stats — dashboard stats
export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({ paymentStatus: "Paid" }).select("totalPrice").lean(),
    ]);

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .lean();

    const pendingOrders = await Order.countDocuments({ orderStatus: "Processing" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });

    // Low stock products
    const lowStock = await Product.find({ stock: { $lte: 5 } })
      .select("title stock slug")
      .lean();

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      lowStock,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
