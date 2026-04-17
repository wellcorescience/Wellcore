"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductInteractiveSectionProps {
  product: {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    stock: number;
    images: { url: string }[];
    flavors?: string[];
    sizes?: string[];
    highlights?: string[];
  };
}

export default function ProductInteractiveSection({ product }: ProductInteractiveSectionProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      product: product._id,
      name: product.title,
      price: product.price,
      quantity: quantity,
      stock: product.stock,
      image: product.images?.[0]?.url || ""
    });
    toast.success(`${product.title} added to protocol`);
  };

  return (
    <div className="lg:col-span-5 flex flex-col">
      <div className="mb-2">
        <span className="text-primary font-bold text-xs tracking-widest uppercase font-label">Performance Series</span>
      </div>
      <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-background mb-4 leading-tight uppercase font-black">
        {product.title}
      </h1>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center text-primary-fixed-dim">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          ))}
        </div>
        <span className="text-on-surface-variant font-bold text-sm">4.9/5 (Verified)</span>
      </div>

      {product.originalPrice && product.originalPrice > product.price ? (
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <span className="text-5xl font-black text-on-background italic tracking-tighter">
              ₹{product.price.toLocaleString()}
            </span>
            <div className="flex flex-col">
              <span className="text-xl text-on-surface-variant font-bold font-headline line-through leading-none">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-error font-black text-sm uppercase tracking-widest">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Today
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Clinical Protocol Valuation / Inclusive of all taxes</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-4 mb-10">
          <span className="text-5xl font-headline font-black text-on-background italic tracking-tighter">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Inclusive of all taxes</span>
        </div>
      )}

      {/* Selection Blocks */}
      <div className="space-y-8 mb-10">
        {product.flavors && product.flavors.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Select Flavor</label>
            <div className="flex flex-wrap gap-3">
              {product.flavors.map(flavor => (
                <button 
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-6 py-3 font-bold text-sm rounded-lg transition-all border-2 ${selectedFlavor === flavor ? 'border-primary bg-primary-container/10 text-on-background' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Select Size</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 font-bold text-sm rounded-lg transition-all border-2 ${selectedSize === size ? 'border-primary bg-primary-container/10 text-on-background' : 'border-transparent bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Quantity</label>
          <div className="flex items-center gap-4 bg-surface-container w-max p-2 rounded-lg">
             <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-stone-200 rounded transition-colors"
             >
               <span className="material-symbols-outlined">remove</span>
             </button>
             <span className="w-8 text-center font-black text-lg">{quantity}</span>
             <button 
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-stone-200 rounded transition-colors"
             >
               <span className="material-symbols-outlined">add</span>
             </button>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 mb-12">
        <button 
          onClick={handleAddToCart} 
          className="w-full py-5 bg-primary-fixed text-on-primary-fixed font-headline font-black text-lg uppercase tracking-wider rounded-lg shadow-[0_10px_20px_-10px_rgba(218,249,0,0.5)] hover:scale-[1.02] transition-transform"
        >
          Add to Cart
        </button>
        <button className="w-full py-5 bg-inverse-surface text-white font-headline font-black text-lg uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors">
          Buy Now
        </button>
      </div>

      {/* Benefits List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm font-medium">Clinically Dosed Formula</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm font-medium">Independently Lab Verified</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm font-medium">Rapid Bioavailable Intake</span>
        </div>
      </div>

      {/* Amazon-style Highlights */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="mt-12 pt-12 border-t border-outline-variant/10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface mb-6">About this Protocol</h4>
          <ul className="space-y-4">
            {product.highlights.map((highlight, idx) => (
              <li key={idx} className="flex gap-4 group">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_var(--color-primary)]"></div>
                <span className="text-sm text-on-surface-variant font-medium leading-relaxed group-hover:text-on-surface transition-colors">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
