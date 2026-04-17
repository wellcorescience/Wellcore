"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Eye, Zap, LayoutTemplate, MessageSquare, Link as LinkIcon, PhoneCall, Trash2, Plus, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function StorefrontSettings() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [isUploadingVideo, setIsUploadingVideo] = useState<{[key: number]: boolean}>({});

  const [formData, setFormData] = useState<any>({
    heroHeadline: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroButtonLink: "",
    heroBackgroundImage: "",
    topBarText: "",
    activeDeal: "",
    shopVideos: [],
    trustedReviews: [],
    hotlinePhone: "",
    whatsappNumber: "",
    supportEmail: "",
    physicalAddress: "",
    footerAboutText: "",
    facebookUrl: "",
    instagramUrl: "",
    privacyPolicyHtml: "",
    termsOfServiceHtml: "",
    refundPolicyHtml: "",
    shippingPolicyHtml: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sfRes, dealsRes, productsRes] = await Promise.all([
        fetch("/api/admin/storefront"),
        fetch("/api/admin/deals"),
        fetch("/api/admin/products")
      ]);
      const sfData = await sfRes.json();
      const dealsData = await dealsRes.json();
      const productsData = await productsRes.json();

      if (sfData.success && sfData.storefront) {
        setFormData({
          ...formData,
          ...sfData.storefront,
          activeDeal: sfData.storefront.activeDeal || "",
        });
      }
      if (dealsData.success) {
        setDeals(dealsData.deals);
      }
      if (productsRes.ok) {
        setProducts(productsData.products);
      }
    } catch (error) {
      toast.error("Failed to load storefront metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const toastId = toast.loading("Deploying Storefront CMS...");
    try {
      const payload = { ...formData };
      
      // Clean up internal Mongoose fields to prevent subdocument ID mismatch
      if (payload.shopVideos) {
        payload.shopVideos = payload.shopVideos.map(({ _id, __v, ...rest }: any) => rest);
      }
      if (payload.trustedReviews) {
        payload.trustedReviews = payload.trustedReviews.map(({ _id, __v, ...rest }: any) => rest);
      }

      if (!payload.activeDeal) payload.activeDeal = null;

      const res = await fetch("/api/admin/storefront", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Storefront Updated Successfully", { id: toastId });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update", { id: toastId });
    }
  };

  const handleVideoChange = (index: number, field: string, value: string) => {
    const newVideos = [...(formData.shopVideos || [])];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setFormData({ ...formData, shopVideos: newVideos });
  };
  const addVideo = () => setFormData({ ...formData, shopVideos: [...(formData.shopVideos || []), { title: "", productName: "", price: "", videoThumbnail: "", videoUrl: "" }] });
  const removeVideo = (index: number) => setFormData({ ...formData, shopVideos: formData.shopVideos.filter((_:any, i:number) => i !== index) });

  const handleReviewChange = (index: number, field: string, value: string) => {
    const newReviews = [...(formData.trustedReviews || [])];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setFormData({ ...formData, trustedReviews: newReviews });
  };
  const addReview = () => setFormData({ ...formData, trustedReviews: [...(formData.trustedReviews || []), { name: "", role: "", text: "", image: "" }] });
  const removeReview = (index: number) => setFormData({ ...formData, trustedReviews: formData.trustedReviews.filter((_:any, i:number) => i !== index) });

  const handleVideoAssetUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(prev => ({ ...prev, [index]: true }));
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (data.success) {
        handleVideoChange(index, "videoUrl", data.url);
        toast.success("Protocol video asset deployment complete");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Visual payload corrupted");
    } finally {
      setIsUploadingVideo(prev => ({ ...prev, [index]: false }));
    }
  };


  const tabs = [
    { id: "hero", name: "Hero & Deals", icon: LayoutTemplate },
    { id: "media", name: "Shop Videos", icon: Zap },
    { id: "reviews", name: "Reviews", icon: MessageSquare },
    { id: "footer", name: "Footer Info", icon: PhoneCall },
    { id: "legal", name: "Legal & Policies", icon: FileText },
  ];

  if (loading) return <div className="p-8"><div className="animate-pulse bg-surface-container-low h-[600px] rounded-3xl" /></div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-2 text-on-surface">Ultra Storefront CMS</h1>
        <p className="text-on-surface-variant font-medium">Full systematic control over global site aesthetics and content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
           {tabs.map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
               className={`w-full flex items-center gap-3 p-4 rounded-2xl font-headline font-bold uppercase text-sm tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-black scale-105 shadow-xl' : 'bg-surface-container-lowest text-stone-400 hover:bg-surface-container hover:text-white border border-white/5'}`}
             >
               <tab.icon className="w-5 h-5" /> {tab.name}
             </button>
           ))}
           
           <div className="pt-8 border-t border-white/5 mt-8">
              <button onClick={handleSave} className="w-full py-4 bg-primary text-black font-headline font-black uppercase text-sm tracking-widest rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mb-4">
                 <Save className="w-5 h-5" /> Deploy All
              </button>
              <a href="/" target="_blank" className="w-full py-4 bg-white/10 text-white font-headline font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                 <Eye className="w-4 h-4" /> Live Preview
              </a>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-xl min-h-[600px]">
           
           {/* Tab 1: Hero & Deals */}
           {activeTab === "hero" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-3 border-b border-outline-variant/10 pb-4 text-primary">
                 Hero & Layout Configuration
               </h2>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Top Announcement Bar</label>
                   <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                     value={formData.topBarText || ""} onChange={e => setFormData({...formData, topBarText: e.target.value})}
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><Zap className="w-3 h-3 text-primary"/> Active Deal Timer Override</label>
                   <select className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none"
                     value={formData.activeDeal || ""} onChange={e => setFormData({...formData, activeDeal: e.target.value})}
                   >
                      <option value="">-- No Active Deal Outline --</option>
                      {deals.map(deal => (
                         <option key={deal._id} value={deal._id}>{deal.name} ({deal.discountPercent}% OFF)</option>
                      ))}
                   </select>
                 </div>
               </div>

               <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Hero Background Image URL</label>
                   <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                     value={formData.heroBackgroundImage || ""} onChange={e => setFormData({...formData, heroBackgroundImage: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Hero Headline</label>
                   <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                     value={formData.heroHeadline || ""} onChange={e => setFormData({...formData, heroHeadline: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Hero Subtitle</label>
                   <textarea rows={3} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none resize-none" 
                     value={formData.heroSubtitle || ""} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Button Text</label>
                      <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                        value={formData.heroButtonText || ""} onChange={e => setFormData({...formData, heroButtonText: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Button Link URL</label>
                      <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                        value={formData.heroButtonLink || ""} onChange={e => setFormData({...formData, heroButtonLink: e.target.value})}
                      />
                    </div>
                 </div>
               </div>
             </div>
           )}

           {/* Tab 2: Shop Videos */}
           {activeTab === "media" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                 <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-primary">Interactive Shop Reels</h2>
                 <button onClick={addVideo} type="button" className="bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-black transition-all">
                   <Plus className="w-4 h-4"/> Add Video Reel
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {(formData.shopVideos || []).map((video: any, i: number) => (
                   <div key={i} className="bg-surface-container p-6 rounded-2xl border border-white/5 relative group">
                      <button onClick={() => removeVideo(i)} type="button" className="absolute top-4 right-4 text-stone-500 hover:text-error transition-colors"><Trash2 className="w-5 h-5"/></button>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-1 text-primary">Linked Protocol (Select Product)</label>
                          <select 
                           className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-3 text-sm font-bold focus:outline-none appearance-none"
                           value={products.find(p => p.title === video.productName)?._id || ""}
                           onChange={(e) => {
                             const product = products.find(p => p._id === e.target.value);
                             if (product) {
                               const newVideos = [...(formData.shopVideos || [])];
                               newVideos[i] = { 
                                 ...newVideos[i], 
                                 productName: product.title, 
                                 price: product.price,
                                 videoThumbnail: product.images?.[0]?.url || "",
                                 title: `Protocol ${product.title.split(' ').pop() || '01'}` 
                               };
                               setFormData({ ...formData, shopVideos: newVideos });
                             }
                           }}
                          >
                            <option value="">-- Choose Protocol --</option>
                            {products.map(p => (
                              <option key={p._id} value={p._id}>{p.title} - ₹{p.price}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-1">Intro Title</label>
                            <input placeholder="Title" className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                              value={video.title || ""} onChange={e => handleVideoChange(i, "title", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-1">Display Price (₹)</label>
                            <input placeholder="Price" className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                              value={video.price || ""} onChange={e => handleVideoChange(i, "price", e.target.value)} />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-1">Visual Asset (Thumbnail URL)</label>
                          <input placeholder="Thumb URL" className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                            value={video.videoThumbnail || ""} onChange={e => handleVideoChange(i, "videoThumbnail", e.target.value)} />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-1 text-primary flex justify-between items-center">
                            <span>Direct Video Asset (MP4 URL)</span>
                            {isUploadingVideo[i] && <span className="animate-pulse text-primary lowercase tracking-tight">Transmitting asset...</span>}
                          </label>
                          <div className="flex gap-2">
                             <input placeholder="https://example.com/asset.mp4" className="flex-1 bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                               value={video.videoUrl || ""} onChange={e => handleVideoChange(i, "videoUrl", e.target.value)} />
                             <label className="bg-primary/20 hover:bg-primary hover:text-black text-primary p-2 rounded cursor-pointer transition-all flex items-center justify-center min-w-[40px]">
                                {isUploadingVideo[i] ? <Zap className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <input type="file" className="hidden" accept="video/*" onChange={(e) => handleVideoAssetUpload(i, e)} />
                             </label>
                          </div>
                        </div>
                      </div>
                   </div>
                 ))}
                 {(!formData.shopVideos || formData.shopVideos.length === 0) && (
                   <div className="col-span-full py-12 text-center text-stone-500 italic">No video reels configured. Add one to display the Shop by Video section.</div>
                 )}
               </div>
             </div>
           )}

           {/* Tab 3: Reviews */}
           {activeTab === "reviews" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                 <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-primary">Verified Performance Reviews</h2>
                 <button onClick={addReview} type="button" className="bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-black transition-all">
                   <Plus className="w-4 h-4"/> Add Review Entry
                 </button>
               </div>
               
               <div className="space-y-6">
                 {(formData.trustedReviews || []).map((review: any, i: number) => (
                   <div key={i} className="bg-surface-container p-6 rounded-2xl border border-white/5 relative flex gap-6 items-start">
                      <div className="w-20 h-20 bg-surface-container-low rounded-full shrink-0 overflow-hidden border-2 border-white/10">
                        {review.image ? <img src={review.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">No Img</div>}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-4">
                          <input placeholder="Reviewer Name" className="flex-1 bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                            value={review.name || ""} onChange={e => handleReviewChange(i, "name", e.target.value)} />
                          <input placeholder="Role (e.g. Bodybuilder)" className="flex-1 bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                            value={review.role || ""} onChange={e => handleReviewChange(i, "role", e.target.value)} />
                        </div>
                        <input placeholder="Image URL (optional)" className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none" 
                          value={review.image || ""} onChange={e => handleReviewChange(i, "image", e.target.value)} />
                        <textarea placeholder="Review Text content..." rows={2} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-3 py-2 text-sm font-bold focus:outline-none resize-none" 
                          value={review.text || ""} onChange={e => handleReviewChange(i, "text", e.target.value)} />
                      </div>
                      <button onClick={() => removeReview(i)} type="button" className="p-2 text-stone-500 hover:text-error transition-colors"><Trash2 className="w-5 h-5"/></button>
                   </div>
                 ))}
                 {(!formData.trustedReviews || formData.trustedReviews.length === 0) && (
                   <div className="py-12 text-center text-stone-500 italic">No reviews populated. Defaults will hide the section.</div>
                 )}
               </div>
             </div>
           )}

           {/* Tab 4: Footer Info */}
           {activeTab === "footer" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-3 border-b border-outline-variant/10 pb-4 text-primary">
                 Global Footer & Support Protocol
               </h2>
               
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <h3 className="font-bold text-stone-400 uppercase tracking-widest text-[10px]">Contact Logistics</h3>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><PhoneCall className="w-3 h-3 text-primary"/> Support Hotline</label>
                     <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                       value={formData.hotlinePhone || ""} onChange={e => setFormData({...formData, hotlinePhone: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><MessageSquare className="w-3 h-3 text-green-500"/> WhatsApp Connect</label>
                     <input type="text" placeholder="+91 WhatsApp Number" className="w-full bg-surface-container border-b-4 border-transparent focus:border-green-500 px-4 py-3 font-bold transition-all focus:outline-none" 
                       value={formData.whatsappNumber || ""} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Support Email</label>
                     <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                       value={formData.supportEmail || ""} onChange={e => setFormData({...formData, supportEmail: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Physical Facility Address</label>
                     <textarea rows={2} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none resize-none" 
                       value={formData.physicalAddress || ""} onChange={e => setFormData({...formData, physicalAddress: e.target.value})} />
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-bold text-stone-400 uppercase tracking-widest text-[10px]">Socials & Branding</h3>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><LinkIcon className="w-3 h-3"/> Facebook Deep Link</label>
                     <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                       value={formData.facebookUrl || ""} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><LinkIcon className="w-3 h-3"/> Instagram Deep Link</label>
                     <input type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none" 
                       value={formData.instagramUrl || ""} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mt-4">Footer 'About' Doctrine</label>
                     <textarea rows={5} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-bold transition-all focus:outline-none resize-none text-sm" 
                       value={formData.footerAboutText || ""} onChange={e => setFormData({...formData, footerAboutText: e.target.value})} />
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Tab 5: Legal & Policies */}
           {activeTab === "legal" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-3 border-b border-outline-variant/10 pb-4 text-primary">
                 Corporate Legal Doctrine (HTML Supported)
               </h2>
               
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><FileText className="w-3 h-3 text-primary"/> Privacy Policy</label>
                   <textarea rows={6} placeholder="<h2>1. Data Collection</h2><p>We do not sell your data...</p>" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-mono text-xs transition-all focus:outline-none resize-y" 
                     value={formData.privacyPolicyHtml || ""} onChange={e => setFormData({...formData, privacyPolicyHtml: e.target.value})} />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><FileText className="w-3 h-3 text-primary"/> Terms of Service</label>
                   <textarea rows={6} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-mono text-xs transition-all focus:outline-none resize-y" 
                     value={formData.termsOfServiceHtml || ""} onChange={e => setFormData({...formData, termsOfServiceHtml: e.target.value})} />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><FileText className="w-3 h-3 text-primary"/> Refund Policy</label>
                   <textarea rows={6} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-mono text-xs transition-all focus:outline-none resize-y" 
                     value={formData.refundPolicyHtml || ""} onChange={e => setFormData({...formData, refundPolicyHtml: e.target.value})} />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex gap-2"><FileText className="w-3 h-3 text-primary"/> Shipping Policy</label>
                   <textarea rows={6} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-4 py-3 font-mono text-xs transition-all focus:outline-none resize-y" 
                     value={formData.shippingPolicyHtml || ""} onChange={e => setFormData({...formData, shippingPolicyHtml: e.target.value})} />
                 </div>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
