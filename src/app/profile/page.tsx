"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { LogOut, Package, Truck, Clock, CheckCircle, ExternalLink, User as UserIcon, Shield } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/profile");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersRes.ok) setOrders(ordersData.orders);
    } catch (error) {
      toast.error("Failed to sync protocol data");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Session Terminated");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (status === "loading" || (status === "authenticated" && loadingOrders)) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
         <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full"></div>
            <div className="h-4 w-32 bg-stone-200 rounded"></div>
         </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <main className="min-h-screen bg-surface-container-low/30 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-outline-variant/10">
                <div className="flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-primary text-black flex items-center justify-center rounded-3xl text-4xl font-black mb-6 shadow-xl shadow-primary/20 overflow-hidden">
                      {(user as any)?.image ? (
                        <img src={(user as any).image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                   </div>
                   <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-on-background">{user?.name}</h1>
                      {(user as any)?.role === 'admin' && <Shield className="w-5 h-5 text-primary" />}
                   </div>
                   <p className="text-on-surface-variant font-medium">{user?.email}</p>
                   
                   <div className="w-full h-px bg-outline-variant/20 my-8"></div>
                   
                   <div className="w-full space-y-4">
                      {(user as any)?.role === 'admin' && (
                        <Link href="/admin" className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/10">
                          <Shield className="w-4 h-4" /> Command Center (Admin)
                        </Link>
                      )}
                      
                      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-primary-dim" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Total Protocols</span>
                         </div>
                         <span className="font-black text-xl italic">{orders.length}</span>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 p-4 text-error font-black uppercase text-[10px] tracking-[0.2em] border-2 border-error/10 rounded-2xl hover:bg-error hover:text-white transition-all group"
                      >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Terminate Session
                      </button>
                   </div>
                </div>
             </div>

             <div className="bg-inverse-surface text-surface p-10 rounded-[2.5rem] shadow-2xl">
                <h3 className="font-headline font-black text-xl uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                  <Truck className="text-primary w-6 h-6" />
                  Logistics Alert
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  Real-time synchronization with Shiprocket protocol active. Track your high-performance assets directly from this panel.
                </p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Protocol Note</div>
                   <p className="text-xs italic text-stone-300">"Science is the only tool for peak optimization. Stay the course."</p>
                </div>
             </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-8 space-y-10">
             <div>
                <h2 className="text-5xl font-headline font-black uppercase italic tracking-tighter text-on-background mb-4">Protocol History</h2>
                <div className="h-1.5 w-24 bg-primary rounded-full"></div>
             </div>

             {orders.length === 0 ? (
               <div className="bg-surface-container-lowest p-20 rounded-[3rem] text-center border-2 border-dashed border-outline-variant/30">
                  <Package className="w-16 h-16 text-stone-200 mx-auto mb-6" />
                  <h3 className="font-headline font-black text-2xl uppercase italic tracking-tight mb-2">No Active Protocols</h3>
                  <p className="text-on-surface-variant mb-8">You haven't initialized any performance protocols yet.</p>
                  <Link href="/category/all" className="inline-block bg-primary text-black font-headline font-black uppercase text-xs tracking-[0.2em] py-5 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                    Explore Laboratory
                  </Link>
               </div>
             ) : (
               <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-surface-container-lowest rounded-[2.5rem] shadow-xl border border-outline-variant/10 overflow-hidden group hover:border-primary/30 transition-all">
                       <div className="p-8 md:p-10">
                          <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                             <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">Authorization ID</div>
                                <div className="text-2xl font-black font-mono tracking-tighter">{order.orderId}</div>
                             </div>
                             <div className="px-6 py-2 bg-surface-container-high rounded-full border border-outline-variant/10">
                                <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
                                  order.orderStatus === 'Delivered' ? 'text-green-500' : 
                                  order.orderStatus === 'Shipped' ? 'text-primary' : 
                                  'text-amber-500'
                                }`}>
                                   {order.orderStatus === 'Delivered' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
                                   {order.orderStatus}
                                </span>
                             </div>
                             <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">Total Settlement</div>
                                <div className="text-3xl font-black italic tracking-tighter text-primary">₹{order.totalPrice.toLocaleString()}</div>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-8 items-center">
                             <div className="flex -space-x-4 overflow-hidden">
                                {order.orderItems.map((item: any, i: number) => (
                                   <div key={i} className="inline-block h-16 w-16 rounded-2xl ring-4 ring-surface-container-lowest bg-white p-2 border border-outline-variant/20">
                                      <img className="h-full w-full object-contain" src={item.image} alt={item.name} />
                                   </div>
                                ))}
                             </div>
                             <div className="flex-1">
                                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                                   {order.orderItems.length} {order.orderItems.length === 1 ? 'Laboratory Protocol' : 'Clinical Protocols'}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-1 italic">
                                   Initialized on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                             </div>
                          </div>
                       </div>
                       
                       {(order.trackingId || order.shiprocketOrderId) && (
                         <div className="bg-surface-container-low/50 p-6 md:px-10 flex flex-wrap items-center justify-between gap-6 border-t border-outline-variant/10">
                            <div className="flex items-center gap-4">
                               <Truck className="w-5 h-5 text-on-surface-variant" />
                               <div>
                                  <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">Logistics Tracking Info</div>
                                  <div className="text-xs font-bold font-mono">{order.trackingId || "Manifesting..."}</div>
                               </div>
                            </div>
                            {order.trackingId && (
                               <a 
                                 href={`https://shiprocket.co/tracking/${order.trackingId}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black px-6 py-3 rounded-xl border border-outline-variant/20 hover:bg-stone-900 hover:text-white transition-all shadow-sm"
                               >
                                  Track Protocol <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
             )}
          </section>
        </div>
      </div>
    </main>
  );
}
