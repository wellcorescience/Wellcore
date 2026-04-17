"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Loader2, X, Star, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"core" | "listing" | "media">("core");
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    category: "",
    brand: "",
    isFeatured: false,
    isOnSale: false,
    salePercent: "0",
    images: [] as { url: string; public_id: string }[],
    tags: [] as string[],
    highlights: [""] as string[],
    specifications: [{ name: "", value: "" }] as { name: string; value: string }[]
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands")
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const brandData = await brandRes.json();

      if (prodRes.ok) setProducts(prodData.products);
      if (catRes.ok) setCategories(catData.categories);
      if (brandRes.ok) setBrands(brandData.brands);
      
    } catch (error) {
      toast.error("Failed to fetch administrative data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch (error) {
      toast.error("Failed to refresh inventory");
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
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: data.url, public_id: data.public_id }]
        }));
        toast.success("Visual asset transmitted");
      }
    } catch (error) {
      toast.error("Data transmission failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Basic validation
      if (!formData.category) throw new Error("Classification Required");
      if (!formData.brand) throw new Error("Brand Designation Required");

      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct._id}` 
        : "/api/admin/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Protocol ${editingProduct ? 'Updated' : 'Initialized'}`);
        setIsModalOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm Protocol Termination? This action is irreversible.")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Protocol removed from active duty");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Termination failed");
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || "").toString(),
      stock: product.stock.toString(),
      description: product.description,
      category: product.category?._id || product.category || "",
      brand: product.brand?._id || product.brand || "",
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      salePercent: (product.salePercent || 0).toString(),
      images: product.images || [],
      tags: product.tags || [],
      highlights: product.highlights?.length ? product.highlights : [""],
      specifications: product.specifications?.length ? product.specifications : [{ name: "", value: "" }]
    });
    setIsModalOpen(true);
  };

  // Dynamic Field Handlers
  const addTag = () => setFormData({ ...formData, tags: [...formData.tags, ""] });
  const removeTag = (idx: number) => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) });
  const updateTag = (idx: number, val: string) => {
    const newTags = [...formData.tags];
    newTags[idx] = val;
    setFormData({ ...formData, tags: newTags });
  };

  const addHighlight = () => setFormData({ ...formData, highlights: [...formData.highlights, ""] });
  const removeHighlight = (idx: number) => setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== idx) });
  const updateHighlight = (idx: number, val: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[idx] = val;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addSpec = () => setFormData({ ...formData, specifications: [...formData.specifications, { name: "", value: "" }] });
  const removeSpec = (idx: number) => setFormData({ ...formData, specifications: formData.specifications.filter((_, i) => i !== idx) });
  const updateSpec = (idx: number, field: "name" | "value", val: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[idx] = { ...newSpecs[idx], [field]: val };
    setFormData({ ...formData, specifications: newSpecs });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      category: categories[0]?._id || "",
      brand: brands[0]?._id || "",
      isFeatured: false,
      isOnSale: false,
      salePercent: "0",
      images: [],
      tags: [],
      highlights: [""],
      specifications: [{ name: "", value: "" }]
    });
  };

  // Modernized Price Calculation Logic
  const handlePriceChange = (field: 'price' | 'originalPrice', value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentPrice = field === 'price' ? numValue : parseFloat(formData.price) || 0;
    const currentMRP = field === 'originalPrice' ? numValue : parseFloat(formData.originalPrice) || 0;
    
    let salePercent = 0;
    let isOnSale = false;

    if (currentMRP > currentPrice && currentMRP > 0) {
      salePercent = Math.round(((currentMRP - currentPrice) / currentMRP) * 100);
      isOnSale = true;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
      salePercent: salePercent.toString(),
      isOnSale: isOnSale
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter text-on-background">Product Management</h1>
           <p className="text-on-surface-variant text-sm font-medium tracking-wide">Manage High-Performance Clinical Protocols</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-primary text-black font-headline font-black uppercase text-xs tracking-[0.2em] py-4 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> Add New Protocol
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.3em] text-on-surface-variant animate-pulse font-headline">Syncing Secure Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.25em] font-black">
                  <th className="p-8 w-24">Media</th>
                  <th className="p-8">Protocol Specification</th>
                  <th className="p-8">Classification</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right italic font-headline text-xs text-on-surface">Settlement (₹)</th>
                  <th className="p-8 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <span className="material-symbols-outlined text-6xl text-stone-200 mb-4">inventory_2</span>
                       <p className="font-headline font-black uppercase text-on-surface-variant opacity-50">Logistics Inventory Empty</p>
                    </td>
                  </tr>
                ) : products.map(product => (
                  <tr key={product._id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-8">
                      <div className="w-20 h-20 bg-white border border-outline-variant/10 rounded-2xl overflow-hidden p-3 shadow-inner">
                         {product.images?.[0] ? (
                           <img src={product.images[0].url} alt={product.title} className="w-full h-full object-contain" />
                         ) : (
                           <ImageIcon className="w-full h-full text-stone-200" />
                         )}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-black text-on-surface uppercase tracking-tight italic text-xl">{product.title}</div>
                        {product.isFeatured && <Star className="w-4 h-4 fill-primary text-primary" />}
                        {product.isOnSale && <Tag className="w-4 h-4 text-error" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">ID: {product._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">{product.brand?.name || 'Unknown Brand'}</span>
                      </div>
                    </td>
                    <td className="p-8">
                       <span className="px-3 py-1 bg-primary/10 text-primary-dim rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                         {product.category?.name || 'Unclassified'}
                       </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full shadow-lg ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-error'}`}></div>
                         <div>
                            <div className={`text-[11px] font-black uppercase tracking-tight ${product.stock > 0 ? 'text-on-surface' : 'text-error'}`}>
                              {product.stock > 0 ? `${product.stock} Units` : 'Depleted'}
                            </div>
                            <div className="text-[9px] font-label uppercase text-on-surface-variant tracking-widest">{product.stock > 0 ? 'In Circulation' : 'Out of Protocol'}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="font-black text-on-surface text-2xl italic tracking-tighter">₹{product.price.toLocaleString()}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-[10px] text-on-surface-variant line-through font-bold">₹{product.originalPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openEdit(product)}
                          className="p-4 bg-surface-container text-on-surface-variant hover:bg-stone-900 hover:text-white rounded-2xl transition-all shadow-sm" title="Modify"
                        >
                          <Edit className="w-5 h-5 stroke-[2.5]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-4 bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error rounded-2xl transition-all shadow-sm" title="Delete"
                        >
                          <Trash2 className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-3xl border border-white/5 my-auto">
            <div className="p-10 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
               <div>
                  <h2 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-on-background">
                    {editingProduct ? 'Modify Protocol' : 'Initialize New Protocol'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-dim mt-1">Verification Section Alpha</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-error/10 hover:text-error rounded-full transition-all text-on-surface-variant">
                  <X className="w-8 h-8 stroke-[3]" />
               </button>
            </div>
            
            <div className="px-10 py-6 border-b border-outline-variant/5 bg-surface-container-lowest flex gap-8">
               {(['core', 'listing', 'media'] as const).map((t) => (
                 <button 
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === t ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                 >
                    {t} Protocol
                    {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>}
                 </button>
               ))}
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {activeTab === 'core' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Protocol Designation (Title)</label>
                    <input 
                      required 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      type="text" 
                      className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black text-lg transition-all focus:outline-none rounded-t-xl" 
                      placeholder="Enter Protocol Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Classification</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl appearance-none"
                    >
                      <option value="" disabled>Select Layer</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Brand Designation</label>
                    <select 
                      required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl appearance-none"
                    >
                      <option value="" disabled>Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Original Price / MRP (₹)</label>
                    <input 
                      required
                      value={formData.originalPrice}
                      onChange={e => handlePriceChange('originalPrice', e.target.value)}
                      type="number" className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl" 
                      placeholder="e.g. 2499"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Selling Price (₹)</label>
                    <input 
                      required
                      value={formData.price}
                      onChange={e => handlePriceChange('price', e.target.value)}
                      type="number" className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black text-lg transition-all focus:outline-none rounded-t-xl" 
                      placeholder="e.g. 1999"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Computed Discount (%)</label>
                    <div className="w-full bg-surface-container-low/50 px-6 py-4 font-black text-lg rounded-t-xl text-on-surface-variant flex items-center justify-between">
                       <span>{formData.salePercent}%</span>
                       {parseInt(formData.salePercent) > 0 && <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded uppercase tracking-widest">Active Sale</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Inventory Count</label>
                    <input 
                      required
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      type="number" className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-black text-lg transition-all focus:outline-none rounded-t-xl" 
                    />
                  </div>

                  <div className="flex gap-8 md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={formData.isFeatured}
                          onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                          className="w-6 h-6 rounded-md accent-primary"
                        />
                        <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Flag as Featured</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={formData.isOnSale}
                          onChange={e => setFormData({...formData, isOnSale: e.target.checked})}
                          className="w-6 h-6 rounded-md accent-error"
                        />
                        <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-error transition-colors">Enable Sale Pricing</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'listing' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Custom Collections (Tags)</label>
                    <div className="space-y-3">
                      {formData.tags.map((t, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            value={t}
                            onChange={e => updateTag(idx, e.target.value)}
                            className="flex-1 bg-surface-container-low border-b border-outline-variant/20 px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary rounded"
                            placeholder="e.g. perform (Energy & Endurance)"
                          />
                          <button type="button" onClick={() => removeTag(idx)} className="p-2 text-error hover:bg-error/10 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addTag}
                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70"
                      >
                        <Plus className="w-3 h-3" /> Assign to Custom Collection
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">About this Item (Clinical Highlights)</label>
                    <div className="space-y-3">
                      {formData.highlights.map((h, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            value={h}
                            onChange={e => updateHighlight(idx, e.target.value)}
                            className="flex-1 bg-surface-container-low border-b border-outline-variant/20 px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary rounded"
                            placeholder="e.g. 5g Pure Creatine Monohydrate"
                          />
                          <button type="button" onClick={() => removeHighlight(idx)} className="p-2 text-error hover:bg-error/10 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addHighlight}
                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70"
                      >
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Technical Specifications (Clinical Data)</label>
                    <div className="space-y-3">
                      {formData.specifications.map((s, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            value={s.name}
                            onChange={e => updateSpec(idx, 'name', e.target.value)}
                            className="w-1/3 bg-surface-container-low border-b border-outline-variant/20 px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary rounded"
                            placeholder="Attribute Name"
                          />
                          <input 
                            value={s.value}
                            onChange={e => updateSpec(idx, 'value', e.target.value)}
                            className="flex-1 bg-surface-container-low border-b border-outline-variant/20 px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary rounded"
                            placeholder="Value"
                          />
                          <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-error hover:bg-error/10 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addSpec}
                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-70"
                      >
                        <Plus className="w-3 h-3" /> Add Specification
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Protocol Narrative (Description)</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={6} 
                      className="w-full bg-surface-container-low border-b-4 border-transparent focus:border-primary px-6 py-4 font-bold transition-all focus:outline-none rounded-t-xl resize-none"
                      placeholder="Describe the clinical benefits and formulation..."
                    ></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Visual Asset Guidelines</h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Upload at least 5 high-resolution assets for a professional Amazon-style listing. High-quality imagery increases clinical trust and conversion rates by 40%.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                     {formData.images.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-surface-container-high rounded-2xl overflow-hidden p-2 border border-outline-variant/20 relative group">
                           <img src={img.url} className="w-full h-full object-contain" />
                           <button 
                             type="button"
                             onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                             className="absolute inset-0 bg-error/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-6 h-6" />
                           </button>
                           <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] px-1 rounded font-black tracking-widest">IMAGE {idx + 1}</div>
                        </div>
                     ))}
                     {formData.images.length < 10 && (
                       <label className="aspect-square border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group overflow-hidden relative">
                          {uploading ? (
                             <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          ) : (
                             <>
                               <ImageIcon className="w-8 h-8 text-stone-300 group-hover:text-primary" />
                               <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant mt-2 text-center px-2">Slot {formData.images.length + 1}</span>
                             </>
                          )}
                          <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                       </label>
                     )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-6 pt-10 border-t border-outline-variant/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="px-10 py-5 border border-outline-variant/20 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] hover:bg-surface-container-high transition-all active:scale-95"
                >
                  Terminate Form
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-12 py-5 bg-stone-900 text-white hover:bg-primary hover:text-black rounded-2xl font-headline font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl shadow-stone-900/40 disabled:bg-stone-500 active:scale-95"
                >
                  {submitting ? 'Committing Data...' : 'Commit Protocol'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
