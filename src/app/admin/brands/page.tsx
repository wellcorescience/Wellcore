"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: ""
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (res.ok) setBrands(data.brands);
    } catch (error) {
      toast.error("Failed to fetch brand designations");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, logo: data.url }));
        toast.success("Brand asset transmitted");
      }
    } catch (error) {
      toast.error("Asset transmission failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("New Brand Designation Initialized");
        setIsModalOpen(false);
        setFormData({ name: "", logo: "" });
        fetchBrands();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Operation Terminated");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter text-on-background">Brand Designations</h1>
           <p className="text-on-surface-variant text-sm font-medium tracking-wide">Manage Science-Partnerships & Labels</p>
        </div>
        <button 
          onClick={() => { setFormData({ name: "", logo: "" }); setIsModalOpen(true); }}
          className="bg-primary text-black font-headline font-black uppercase text-xs tracking-[0.2em] py-4 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> Add Brand
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl max-w-3xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 text-primary animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Syncing Designations...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.25em] font-black">
                <th className="p-8 w-24">Asset</th>
                <th className="p-8">Brand Designation</th>
                <th className="p-8">Slug ID</th>
                <th className="p-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {brands.map(brand => (
                <tr key={brand._id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-8">
                     <div className="w-16 h-16 bg-white border border-outline-variant/10 rounded-xl overflow-hidden p-2 shadow-inner">
                        {brand.logo ? (
                           <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                           <ImageIcon className="w-full h-full text-stone-200" />
                        )}
                     </div>
                  </td>
                  <td className="p-8 text-xl font-black uppercase italic tracking-tight text-on-surface">{brand.name}</td>
                  <td className="p-8">
                     <span className="font-mono text-[10px] bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">/{brand.slug}</span>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-all">
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl w-full max-w-md border border-white/5">
            <div className="p-10 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
               <h2 className="text-2xl font-headline font-black uppercase italic tracking-tighter text-on-background">Initialize Brand</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-all">
                  <X className="w-6 h-6" />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Designation Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    placeholder="e.g. Elite Labs"
                    className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black text-lg transition-all focus:outline-none rounded-t-xl" 
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Brand Verification Multi-Media (Logo)</label>
                  <div className="flex gap-4 items-center">
                     {formData.logo && (
                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden p-2 border border-outline-variant/20 shadow-inner">
                           <img src={formData.logo} className="w-full h-full object-contain" />
                        </div>
                     )}
                     <label className="flex-1 border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-surface-container-low transition-all flex flex-col items-center">
                        {uploading ? (
                           <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                           <>
                             <ImageIcon className="w-8 h-8 text-stone-300" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-2">Upload Graphic</span>
                           </>
                        )}
                        <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                     </label>
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={submitting}
                 className="w-full py-5 bg-stone-900 text-white hover:bg-primary hover:text-black rounded-2xl font-headline font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl shadow-stone-900/40 disabled:bg-stone-500 active:scale-95"
               >
                 {submitting ? 'Committing...' : 'Commit Designation'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
