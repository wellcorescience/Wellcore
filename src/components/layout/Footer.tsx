import Link from "next/link";
import dbConnect from "@/lib/db";
import Storefront from "@/models/Storefront";

export default async function Footer() {
  await dbConnect();
  const storefront = await Storefront.findOne().lean();

  const hotline = storefront?.hotlinePhone || "+91 7015553297";
  const email = storefront?.supportEmail || "info.wellcorescience@gmail.com";
  const address = storefront?.physicalAddress || "Add: MangalColony, Part 2, Karnal, HR - 132001.";
  const aboutText = storefront?.footerAboutText || "100% Genuine Supplements. Zero Compromise.\nAuthentic Nutrition You Can Trust Only Original.";
  const facebook = storefront?.facebookUrl || "https://www.facebook.com/wellcorescience";
  const instagram = storefront?.instagramUrl || "https://www.instagram.com/wellcore.science/";
  const whatsapp = storefront?.whatsappNumber;

  return (
    <>
    <footer className="w-full py-16 bg-stone-950 mt-auto border-t border-outline-variant/10 text-stone-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
        
        {/* Column 1: Logo and Contact */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <Link href={facebook} target="_blank" className="w-8 h-8 rounded flex items-center justify-center bg-[#3b5998] hover:opacity-80 transition-opacity">
              <span className="font-bold text-white text-xs">f</span>
            </Link>
            <Link href={instagram} target="_blank" className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-tr from-[#f09433] to-[#bc1888] hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-white text-[16px]">photo_camera</span>
            </Link>
          </div>
          <div>
            <div className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
              <span className="text-primary mt-2 block">Well Core</span> Science
            </div>
          </div>
          <div className="space-y-4 font-body text-sm text-stone-400">
            <div>
              <div className="font-bold text-white mb-1">Hotline Free 24/7:</div>
              <div className="text-primary font-bold text-lg">{hotline}</div>
            </div>
            <div className="whitespace-pre-line">{address}</div>
            <div>Email: {email}</div>
          </div>
        </div>

        {/* Column 2: About The Store */}
        <div>
          <h5 className="font-headline font-bold uppercase tracking-widest text-white mb-6">About The Store</h5>
          <div className="space-y-4 text-sm text-stone-400 leading-relaxed font-body">
            <p className="whitespace-pre-line">{aboutText}</p>
            <div className="flex items-center gap-4 mt-6">
              <span className="material-symbols-outlined text-primary text-4xl">headphones</span>
              <div>
                <div className="text-xs">Got Question? Call us 24/7</div>
                <div className="text-primary font-bold text-xl">{hotline}</div>
              </div>
            </div>
            <div className="text-xs mt-2">{email}</div>
          </div>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h5 className="font-headline font-bold uppercase tracking-widest text-white mb-6">Quick Links</h5>
          <ul className="space-y-3 font-body text-sm text-stone-400">
            <li><Link className="hover:text-primary transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/terms-of-service">Terms of Service</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/refund-policy">Refund Policy</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/shipping-policy">Shipping Policy</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/contact">Contact Information</Link></li>
          </ul>
        </div>

        {/* Column 4: Shop By Collections */}
        <div>
          <h5 className="font-headline font-bold uppercase tracking-widest text-white mb-6">Shop By Collections</h5>
          <ul className="space-y-3 font-body text-sm text-stone-400 grid grid-cols-1 gap-y-2">
            <li><Link className="hover:text-primary transition-colors" href="/category/all">All Products</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?tags=perform">Energy & Endurance</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/nutraceuticals">Nutraceuticals</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?isFeatured=true">Featured Collection</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/pre-workout">Pre Workouts</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/mass-gainer">Mass Gainers</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/whey-protein">Whey Proteins</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?sort=createdAt">New Arrivals</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?brand=soldiers-nutrition">Soldiers Nutrition</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?brand=black-yak">Black Yak</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/category/all?brand=muscle-weapon">Muscle Weapon</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="/profile/orders">Track your order</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-6">
        <div className="flex gap-2 opacity-70 grayscale">
          {/* Using simple placeholder badges for payment methods as in standard UI */}
          <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">VISA</div>
          <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">MasterCard</div>
          <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">Amex</div>
          <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">UPI</div>
        </div>
        <p className="font-body text-xs tracking-normal text-stone-500 text-center">
          Copyright &copy; {new Date().getFullYear()} Well Core Science. All Rights Reserved. Made by CYBEReSTUDIO
        </p>
      </div>
    </footer>

    {/* Floating WhatsApp CTA */}
    {whatsapp && (
      <Link href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center">
         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
         </svg>
      </Link>
    )}
    </>
  );
}
