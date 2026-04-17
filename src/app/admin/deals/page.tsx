"use client";

import { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Check, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DealsEngine() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Flash Sale",
    discountPercent: 10,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // +24 hours
    isActive: true,
    activeProducts: [] as string[],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [dealsRes, productsRes] = await Promise.all([
        fetch("/api/admin/deals"),
        fetch("/api/admin/products")
      ]);
      const dealsData = await dealsRes.json();
      const productsData = await productsRes.json();
      
      if (dealsData.success) setDeals(dealsData.deals);
      if (productsRes.ok) setProducts(productsData.products);
      
    } catch (error) {
      toast.error("Failed to load clinical engine data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("New Protocol Initialized");
        setShowModal(false);
        fetchInitialData();
      }
    } catch (error) {
       toast.error("Initialization Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this Protocol?")) return;
    try {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Protocol Terminated");
        fetchInitialData();
      }
    } catch (error) {
      toast.error("Termination Failed");
    }
  };

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      activeProducts: prev.activeProducts.includes(productId)
        ? prev.activeProducts.filter(id => id !== productId)
        : [...prev.activeProducts, productId]
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter text-on-background">Deals Engine</h1>
          <p className="text-on-surface-variant font-medium">Create and deploy high-conversion Amazon-style flash sales.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-black font-headline font-black uppercase text-xs tracking-[0.2em] py-4 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> New Deal Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <div key={deal._id} className="bg-surface-container-lowest border-2 border-outline-variant/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                   <Zap className="w-6 h-6 fill-black" />
                </div>
                {deal.isActive && (
                   <div className="bg-primary/10 text-primary-dim text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 flex items-center gap-2 uppercase tracking-widest">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      Live
                   </div>
                )}
             </div>

             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">Protocol Name</h3>
             <div className="text-2xl font-headline font-black text-on-surface italic uppercase mb-1">{deal.name}</div>
             <div className="text-4xl font-headline font-black text-primary italic mb-6">{deal.discountPercent}% OFF</div>

             <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                   <span>Type</span>
                   <span className="text-on-surface">{deal.type}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                   <span>Ends</span>
                   <span className="text-on-surface">{new Date(deal.endTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                   <span>Linked Protocols</span>
                   <span className="text-on-surface">{deal.activeProducts?.length || 0} Items</span>
                </div>
             </div>

             <div className="flex gap-4">
               <button 
                  onClick={() => handleDelete(deal._id)}
                  className="flex-1 py-4 bg-surface-container-high text-on-surface font-headline font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-error hover:text-white transition-all"
               >
                  Deactivate
               </button>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-[3rem] p-12 max-w-2xl w-full border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto">
            <h2 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-on-background mb-8">New Deal Protocol</h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Protocol Designation</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary p-4 font-black uppercase italic text-xl transition-all focus:outline-none rounded-t-xl" placeholder="Today Protocol" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Discount Magnitude (%)</label>
                  <input type="number" required value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: parseInt(e.target.value)})} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary p-4 font-black text-xl transition-all focus:outline-none rounded-t-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Deal Classification</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary p-4 font-black text-lg transition-all focus:outline-none rounded-t-xl appearance-none">
                    <option>Flash Sale</option>
                    <option>Seasonal Protocol</option>
                    <option>Clearance Event</option>
                  </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Start Time</label>
                   <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary p-4 font-black transition-all focus:outline-none rounded-t-xl" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">End Time</label>
                   <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary p-4 font-black transition-all focus:outline-none rounded-t-xl" />
                </div>
                
                {/* Product Selector */}
                <div className="col-span-2 space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Link Protocols (Select Products)</label>
                   <div className="max-h-48 overflow-y-auto bg-surface-container-low rounded-2xl p-4 grid grid-cols-2 gap-3 border border-outline-variant/10">
                      {products.map(product => (
                         <div 
                           key={product._id} 
                           onClick={() => toggleProduct(product._id)}
                           className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.activeProducts.includes(product._id) ? 'bg-primary/5 border-primary' : 'bg-surface-container-lowest border-transparent hover:border-primary/30'}`}
                         >
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${formData.activeProducts.includes(product._id) ? 'bg-primary' : 'border border-outline-variant'}`}>
                               {formData.activeProducts.includes(product._id) && <Check className="w-3 h-3 text-black stroke-[4]" />}
                            </div>
                            <div className="flex-1">
                               <div className="text-[10px] font-black uppercase truncate">{product.title}</div>
                               <div className="text-[8px] font-bold text-on-surface-variant">₹{product.price}</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-6 h-6 rounded-md accent-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-primary transition-colors">Force Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-headline font-black uppercase text-xs tracking-[0.2em] border border-outline-variant/20 rounded-2xl hover:bg-surface-container-high transition-all">Abort</button>
                <button type="submit" className="flex-1 py-5 bg-stone-900 text-white font-headline font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-black transition-all shadow-2xl">Deploy Protocol</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
