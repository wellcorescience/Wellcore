"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cartTotal();

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-32 text-center flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-stone-900 dark:text-white">Your Arsenal is empty.</h2>
        <p className="text-stone-500 font-medium mb-8 max-w-md mx-auto">
          You haven't added any clinical-grade supplements to your protocol yet.
        </p>
        <Link 
          href="/category/all" 
          className="bg-primary-fixed text-on-primary-fixed font-black italic uppercase py-4 px-10 rounded-md hover:scale-[1.02] transition-transform duration-200"
        >
          Initialize Protocol
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">Your Arsenal</h1>
        <div className="flex items-center gap-2 text-stone-500 font-medium">
          <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items in protocol</span>
          <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
          <span>Ready for performance</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <section className="lg:col-span-8">
          <div className="space-y-12">
            {cartItems.map((item) => (
              <div key={item.product} className="group relative flex flex-col md:flex-row gap-8 pb-12 border-b border-surface-container">
                <div className="w-full md:w-48 h-48 bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <img className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={item.name} src={item.image}/>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold tracking-tight uppercase">{item.name}</h3>
                      <span className="text-xl font-bold font-headline">₹{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-stone-500 text-sm mb-4">Quantity: {item.quantity}</p>
                    <div className="inline-flex items-center bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-primary">
                      <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> Clinical Purity
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center bg-surface-container rounded-full p-1">
                      <button onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-full transition-colors">
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-full transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product)} className="flex items-center text-stone-400 hover:text-error transition-colors text-xs font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-sm mr-2">delete</span> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="bg-surface-container-lowest p-8 rounded-xl sticky top-32 border-t-4 border-primary shadow-sm">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Summary</h2>
            <div className="space-y-6 mb-8">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-stone-500 uppercase tracking-widest">Subtotal</span>
                <span className="text-on-surface">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-stone-500 uppercase tracking-widest">Shipping</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-stone-500 uppercase tracking-widest">Est. Taxes</span>
                <span className="text-on-surface">₹{(total * 0.18).toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-surface-container-high flex justify-between items-end">
                <span className="text-lg font-black italic uppercase tracking-tighter">Total</span>
                <span className="text-3xl font-black italic tracking-tighter">₹{(total * 1.18).toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-md font-black italic uppercase tracking-tighter flex items-center justify-center group hover:scale-[1.02] transition-transform duration-200">
                Proceed to Checkout
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>Secure Clinical-Grade Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <span>2-Day Lab-to-Door Delivery</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Synergistic Add-Ons</h2>
            <p className="text-stone-500 uppercase text-xs font-bold tracking-[0.2em] mt-2">Frequently bought together</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-surface-container-lowest p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <div className="aspect-square mb-6 bg-surface-container flex items-center justify-center rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:rotate-6 group-hover:scale-110" alt="Shaker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_xPmP71-YIWX1gA4bGacLOlyNxZSiKs3vR2dRKmQ6Y4wOho8gSNQVgUrq9NtKbDzc75sU3Leb_OMCzutDfQ3D1TGLyKz6UgXXQphswbMETM-YBwAOEksk8mXVgLDbfeapnZFn5X-O7LKaXHIxVPqJkDTTgK3XB3inoPxkGvsvt2ftGj8F4RfdM4UsYYmS3fT0jGq6LhsgEEuD9x68D6QzJdBvekOTwUQwecv5jFYqV-a575xCoKeDNvxZqkuNGRuFpNVji5tCN7Y"/>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold tracking-tight">KINETIC SHAKER V2</h4>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Matte Black | 750ml</span>
              </div>
              <span className="font-bold">₹999</span>
            </div>
            <button className="w-full py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
              Add to Arsenal
            </button>
          </div>
          <div className="group bg-surface-container-lowest p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <div className="aspect-square mb-6 bg-surface-container flex items-center justify-center rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:rotate-6 group-hover:scale-110" alt="Omega" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdxBypLBf1H8taoerUj6C6cR2ke4C6qr5ehfkXdQnwXgi93cP2SK0laxgICTgW67Q-9yVJqwDb0eQ5bxRiRdY1nT4TumKZQWW5u-NDViVpeAl8_t20-fG2L8TBykoFMtdLNz-SbACbMhWnjal-KC2Grv-QWgNmi8DW-Ol-2ZBzOoy6ky6x6SbGGsWm9TkV8GVOeeZcchmzhGmw4alhfvs30ZmTo2mSMJtTRFjcyyPzRTZCNIHehC9BE2n2a7LagP_m6JRYTZaY6tg"/>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold tracking-tight">OMEGA-SYNAPTIC OIL</h4>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Cognitive Focus | 60ml</span>
              </div>
              <span className="font-bold">₹1,499</span>
            </div>
            <button className="w-full py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
              Add to Arsenal
            </button>
          </div>
          <div className="group bg-surface-container-lowest p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <div className="aspect-square mb-6 bg-surface-container flex items-center justify-center rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:rotate-6 group-hover:scale-110" alt="Nootropic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc_3vxNpqCk-AT-47qkjNjdzy3A-zAuB6_KpT0-B4Y-RXZpMlo00NAadNtPnRDzxC9q18FGtyW5TmRyqz5An2lHtmeCnF5Gjzi96CODK54_oWZjw4y5QUJtkLKMIOX80ICsxyk3YirWsp8W35aDq2NydO4V6M2X7oSyqy9b0eag7ACGUUQWYIP1UI50WLdWI_dkOLDkmvYj-8wq-yJfLHUY9iocQ5C_jQs18shtSgv9Xx7FzAvCZGQ1sth4VE_FUSVyiN53Ow_2cc"/>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold tracking-tight">REST-STATE NOOTROPIC</h4>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Sleep Recovery | 60 Caps</span>
              </div>
              <span className="font-bold">₹2,499</span>
            </div>
            <button className="w-full py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors">
              Add to Arsenal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
