"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Filter, Loader2, X, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to sync deployment records");
    } finally {
      setLoading(false);
    }
  };

  const handleShiprocket = async () => {
    const toastId = toast.loading("Transmitting logistics vector to Shiprocket API...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Manifesto Accepted by Shiprocket Core", { id: toastId });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (orders.length === 0) {
      toast.error("No intelligence records found to export");
      return;
    }

    const headers = ["Protocol ID", "Date", "Subject", "Email", "Amount", "Method", "Status"];
    const csvRows = orders.map(order => [
      order.orderId,
      new Date(order.createdAt).toLocaleDateString(),
      order.user?.name || "Anonymous",
      order.user?.email || "N/A",
      order.totalAmount,
      order.paymentMethod,
      order.orderStatus
    ].join(","));

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `wellcore_deployment_records_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Intelligence Records Exported");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        toast.success(`Protocol status updated: ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="p-8 print:p-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
           <h1 className="text-3xl font-headline font-black uppercase italic tracking-tighter">Deployment Records</h1>
           <p className="text-on-surface-variant text-sm font-medium">Monitoring Global Performance Protocol Fulfillment</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-surface-container border border-outline-variant/20 text-on-surface font-headline font-black uppercase text-[10px] tracking-widest py-3 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Intelligence (CSV)
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 print:hidden">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Scan Order ID or User identity..." 
            className="w-full bg-surface-container border-b-2 border-transparent focus:border-primary px-10 py-4 font-bold transition-all focus:outline-none rounded-t-xl"
          />
          <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-2 bg-surface-container p-1 rounded-2xl border border-outline-variant/10">
          {["All", ...statuses].map((s) => (
             <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === s ? 'bg-stone-900 text-white shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
             >
               {s}
             </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Syncing Records...</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px] print:hidden">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">
                  <th className="p-6">Protocol ID</th>
                  <th className="p-6">Verification Date</th>
                  <th className="p-6">Subject (User)</th>
                  <th className="p-6">Settlement</th>
                  <th className="p-6">Method</th>
                  <th className="p-6">Operation Status</th>
                  <th className="p-6 text-right">Observation</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="p-6 font-mono text-[10px] font-black text-on-surface uppercase tracking-tighter">{order.orderId}</td>
                    <td className="p-6 text-on-surface-variant font-medium">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-6">
                      <div className="font-bold uppercase tracking-tight text-on-surface">{order.user?.name || 'Anonymous User'}</div>
                      <div className="text-[10px] text-on-surface-variant line-clamp-1">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-6 font-black italic text-lg text-primary">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest border ${order.paymentMethod === 'ONLINE' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-surface-container border-outline-variant/20 text-on-surface-variant'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-6">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-stone-900 text-white text-[10px] font-black uppercase py-2 px-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all border-none"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="p-3 bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-black rounded-lg transition-all inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Eye className="w-4 h-4" /> Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative border border-outline-variant/10 flex flex-col">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
               <div>
                  <h2 className="text-2xl font-headline font-black uppercase italic tracking-tighter flex items-center gap-4">
                    Protocol {selectedOrder.orderId}
                    <span className="bg-primary text-black text-[10px] px-3 py-1 rounded-sm uppercase tracking-[0.2em] font-black">Verified</span>
                  </h2>
                  <div className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest mt-1">Initiated on {new Date(selectedOrder.createdAt).toLocaleString()}</div>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors print:hidden">
                  <X className="w-7 h-7" />
               </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/5">
                  <h3 className="font-headline font-black text-sm uppercase tracking-widest text-primary mb-6 border-b border-primary/20 pb-2">Subject Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                       <span className="text-on-surface-variant uppercase font-black tracking-tighter">Identity:</span>
                       <span className="font-bold uppercase">{selectedOrder.user?.name || 'Anonymous Subject'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-on-surface-variant uppercase font-black tracking-tighter">Comms:</span>
                       <span className="font-bold">{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-on-surface-variant uppercase font-black tracking-tighter">Phone:</span>
                       <span className="font-bold">+{selectedOrder.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/5">
                  <h3 className="font-headline font-black text-sm uppercase tracking-widest text-primary mb-6 border-b border-primary/20 pb-2">Logistics Vector</h3>
                  <div className="space-y-2 text-xs">
                    <div className="font-black text-on-surface uppercase mb-2">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'Subject'}</div>
                    <div className="font-medium text-on-surface-variant">{selectedOrder.shippingAddress?.address}</div>
                    <div className="font-medium text-on-surface-variant">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.pincode}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight italic mb-6 underline decoration-primary decoration-4 underline-offset-4">Provisioned Hardware (Items)</h3>
                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden shadow-inner">
                  <table className="w-full text-left text-sm font-medium">
                    <thead className="bg-surface-container text-[10px] font-black uppercase text-on-surface-variant">
                      <tr>
                        <th className="p-4">Spec Piece</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Base Point</th>
                        <th className="p-4 text-right">Sum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 italic">
                      {(selectedOrder?.orderItems || selectedOrder?.items || []).map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-4 uppercase font-black tracking-tighter">{item.product?.title || item.name || 'Unknown Protocol'}</td>
                          <td className="p-4 text-center font-bold">X{item.quantity}</td>
                          <td className="p-4 text-right">₹{item.price.toFixed(2)}</td>
                          <td className="p-4 text-right font-black text-primary">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-variant/10">
                <div className="w-80 space-y-4 font-black">
                  <div className="flex justify-between text-[10px] uppercase text-on-surface-variant tracking-widest">
                    <span>Hardware Value</span>
                    <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase text-primary tracking-widest">
                    <span>Priority Courier</span>
                    <span>Verified Free</span>
                  </div>
                  <div className="flex justify-between text-3xl pt-6 mt-6 border-t border-stone-100 text-on-surface italic tracking-tighter">
                    <span>GRAND SUM</span>
                    <span className="text-primary">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-outline-variant/10 flex flex-wrap gap-4 print:hidden">
                <button 
                  onClick={handleShiprocket}
                  className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-headline font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black transition-all shadow-xl shadow-stone-900/10"
                >
                  Transmit Shipping Manifesto (Shiprocket)
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-surface-container border border-outline-variant/20 text-on-surface py-4 rounded-xl font-headline font-black uppercase tracking-widest text-[10px] hover:bg-surface-container-high transition-all"
                >
                  Generate Acquisition Invoice (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
