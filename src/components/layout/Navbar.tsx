"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  
  const { data: session } = useSession();
  const user = session?.user;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Protocol terminated (Logged out)");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-1 px-6">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">local_shipping</span> Free Protocol Deployment Over ₹999</span>
              <span className="hidden md:flex items-center gap-1"><span className="material-symbols-outlined text-xs">verified</span> Lab Certified Formulas</span>
           </div>
           <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/wellcorescience" target="_blank" rel="noopener noreferrer" className="hover:text-stone-300 transition-colors">Facebook</a>
              <a href="https://www.instagram.com/wellcore.science/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-300 transition-colors">Instagram</a>
              <span className="text-white/30 hidden md:block">|</span>
              <a href="tel:+917015553297" className="flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-xs">call</span> Hotline: +91 7015553297</a>
           </div>
        </div>
      </div>

      <header className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto px-6 h-20">
          <div className="flex items-center gap-8">
            <Link className="text-2xl font-black italic tracking-tighter text-white uppercase" href="/">
              Wellcore <span className="text-primary italic">Science</span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link className={`font-headline tracking-tight font-bold text-sm uppercase transition-all duration-300 ${pathname?.startsWith('/category') ? 'text-primary' : 'text-white hover:text-primary'}`} href="/category/all">Protocols</Link>
              <Link className="font-headline tracking-tight font-bold text-sm uppercase text-stone-300 hover:text-primary transition-all duration-300" href="/category/all?tags=perform">Perform</Link>
              <Link className="font-headline tracking-tight font-bold text-sm uppercase text-stone-300 hover:text-primary transition-all duration-300" href="/category/all?tags=recover">Recover</Link>
              <Link className="font-headline tracking-tight font-bold text-sm uppercase text-stone-300 hover:text-primary transition-all duration-300" href="/science">Science</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="material-symbols-outlined text-stone-300 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-label outline-none ml-2 text-white placeholder-stone-400" placeholder="Search Protocols..." type="text" />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative group p-2 text-white hover:text-primary transition-all">
                <span className="material-symbols-outlined !text-2xl">shopping_bag</span>
                {mounted && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-on-primary font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Link href="/profile" className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-black text-xs uppercase border border-primary/20 overflow-hidden">
                        {(user as any).image ? <img src={(user as any).image} alt="User" /> : user.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-headline font-black text-xs uppercase tracking-widest hidden lg:block text-white group-hover:text-primary transition-colors">
                        {user.name?.split(' ')[0]}
                      </span>
                    </Link>
                    {(user as any).role === 'admin' && (
                      <a href="/admin/products" className="bg-primary text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-transform">
                        Admin
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-stone-300 hover:text-error transition-all cursor-pointer relative z-50"
                    title="Logout"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              ) : (
                <a href="/login" className="flex items-center gap-2 group p-2 text-white hover:text-primary transition-all relative z-50">
                  <span className="material-symbols-outlined pointer-events-none">person</span>
                  <span className="font-headline font-black text-xs uppercase tracking-widest hidden lg:block pointer-events-none">Sign In</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface/90 backdrop-blur-lg z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-outline-variant/10">
        <Link href="/" className={`flex flex-col items-center justify-center ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant'} active:scale-95 transition-all`}>
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[8px] font-black tracking-widest uppercase mt-0.5">Home</span>
        </Link>
        <Link href="/category/all" className={`flex flex-col items-center justify-center ${pathname?.startsWith('/category') ? 'text-primary' : 'text-on-surface-variant'} active:scale-95 transition-all`}>
          <span className="material-symbols-outlined">science</span>
          <span className="font-label text-[8px] font-black tracking-widest uppercase mt-0.5">Shop</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center justify-center ${pathname === '/cart' ? 'text-primary' : 'text-on-surface-variant'} active:scale-95 transition-all relative`}>
          <span className="material-symbols-outlined">shopping_bag</span>
          {mounted && cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-on-primary text-[8px] w-3 h-3 flex items-center justify-center rounded-full">!</span>
          )}
          <span className="font-label text-[8px] font-black tracking-widest uppercase mt-0.5">Cart</span>
        </Link>
        <Link href={user ? "/profile" : "/login"} className={`flex flex-col items-center justify-center ${pathname === '/login' || pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant'} active:scale-95 transition-all`}>
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[8px] font-black tracking-widest uppercase mt-0.5">{user ? "Profile" : "Login"}</span>
        </Link>
      </nav>
    </>
  );
}
