"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Layers, TrendingUp, Tag } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Product Management", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Brands", href: "/admin/brands", icon: Tag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Deals Engine", href: "/admin/deals", icon: TrendingUp },
    { name: "Storefront", href: "/admin/storefront", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant/10 flex-shrink-0 min-h-screen flex flex-col">
        <div className="p-8 border-b border-outline-variant/10 mb-6">
          <Link href="/" className="group">
            <span className="font-headline font-black text-2xl italic tracking-tighter text-on-surface uppercase block">
              Wellcore <span className="text-primary italic">Science</span>
            </span>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"></div>
               <div className="text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">Command Center</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-headline font-black uppercase text-[10px] tracking-widest transition-all duration-300 group ${isActive ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10 translate-x-1' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low hover:translate-x-1'}`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-outline-variant/10">
          <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-headline font-black uppercase text-[10px] tracking-widest text-error hover:bg-error/5 transition-all w-full group">
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Terminate Protocol
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-surface relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
