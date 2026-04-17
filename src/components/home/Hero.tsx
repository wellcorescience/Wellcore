import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-black h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image / Overlay - We use a gradient and deep color for premium look since we don't have a specific image yet */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')" }}
      />
      
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
        <div className="max-w-2xl text-left">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary font-bold text-sm mb-6 tracking-wider uppercase border border-primary/30">
            Fuel Your Ambition
          </span>
          <h1 className="text-white font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            ENGINEERED FOR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              UNDENIABLE
            </span> RESULTS.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
            Scientifically backed, transparently dosed, and rigorously tested supplements to push you past your limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/category/whey-protein" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-black font-bold text-lg px-8 py-4 rounded-md hover:bg-white transition-colors"
            >
              Shop Top Deals <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/category/all-products" 
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-bold text-lg px-8 py-4 rounded-md border-2 border-white hover:bg-white hover:text-black transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
