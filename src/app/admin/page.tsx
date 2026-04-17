import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { ShoppingBag, Users, TrendingUp, AlertCircle, Clock, CheckCircle, IndianRupee } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'admin') {
     redirect("/login");
  }

  await dbConnect();

  // Fetch aggregated data
  const [totalOrders, totalProducts, totalUsers, paidOrders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({ paymentStatus: "Paid" }).select("totalAmount").lean(),
  ]);

  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email")
    .lean();

  const pendingOrders = await Order.countDocuments({ orderStatus: "Processing" });
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).limit(5).lean();

  const stats = [
    { name: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
    { name: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Customers", value: totalUsers.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Products In Inventory", value: totalProducts.toString(), icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-2">Protocol Command Center</h1>
        <p className="text-on-surface-variant font-medium">Real-time status of Wellcore Science operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-2">{stat.name}</h3>
            <div className="text-4xl font-headline font-black text-on-surface italic">{stat.value}</div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform">
               <stat.icon className="w-32 h-32" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline font-black text-2xl uppercase italic tracking-tight">Recent Deployments</h2>
            <Link href="/admin/orders" className="text-xs font-black uppercase text-primary hover:underline">View All Protocols</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">
                  <th className="pb-4">Transaction ID</th>
                  <th className="pb-4">Operator (User)</th>
                  <th className="pb-4 text-center">Settlement</th>
                  <th className="pb-4 text-right">Magnitude</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="py-5 font-mono text-[10px] font-black uppercase text-on-surface-variant">{order.orderId}</td>
                    <td className="py-5">
                       <div className="font-bold uppercase tracking-tight text-on-surface">{order.user?.name || 'Anonymous'}</div>
                       <div className="text-[10px] text-on-surface-variant">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-5 text-center">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-sm border uppercase ${order.paymentStatus === 'Paid' ? 'border-green-500/30 text-green-600 bg-green-50' : 'border-red-500/30 text-red-600 bg-red-50'}`}>
                          {order.paymentStatus}
                       </span>
                    </td>
                    <td className="py-5 text-right font-black italic tracking-widest text-primary">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="py-5 text-right">
                       <span className="bg-stone-900 text-white text-[9px] font-black px-2 py-1 uppercase rounded-sm">
                          {order.orderStatus}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Side Panel */}
        <div className="lg:col-span-4 space-y-8">
           {/* Alerts */}
           <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl">
              <h2 className="font-headline font-black text-lg uppercase mb-6 flex items-center gap-2">
                 <AlertCircle className="text-primary w-5 h-5" />
                 Stock Alerts
              </h2>
              <div className="space-y-4">
                 {lowStockProducts.map((p: any) => (
                    <div key={p._id.toString()} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="max-w-[150px]">
                          <div className="text-xs font-bold uppercase truncate">{p.title}</div>
                          <div className="text-[10px] text-stone-400">Inventory Critical</div>
                       </div>
                       <div className="text-xl font-black text-error italic">{p.stock}</div>
                    </div>
                 ))}
                 {lowStockProducts.length === 0 && (
                   <p className="text-stone-500 text-xs italic">All stock levels optimized.</p>
                 )}
              </div>
              <Link href="/admin/products" className="w-full mt-6 py-3 bg-primary text-black font-headline font-black uppercase text-[10px] flex items-center justify-center rounded-xl hover:scale-105 transition-all">Refill Logistics</Link>
           </div>

           {/* Quick Stats */}
           <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/10">
              <h2 className="font-headline font-black text-lg uppercase mb-6 italic tracking-tight underline decoration-primary decoration-4 underline-offset-4">Internal Intelligence</h2>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                       <div className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Awaiting Processing</div>
                       <div className="text-2xl font-black italic">{pendingOrders} Orders</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                       <div className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Authorized Agents (Users)</div>
                       <div className="text-2xl font-black italic">{totalUsers}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
