import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductInteractiveSection from "@/components/products/ProductInteractiveSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const resolvedParams = await params;
  await dbConnect();

  const product = await Product.findOne({ slug: resolvedParams.slug }).lean();

  if (!product) {
    notFound();
  }

  // Ensure arrays exist for UI mapping
  const images = product.images || [];
  const flavors = product.flavors || [];
  const sizes = product.sizes || [];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 md:py-24 min-h-screen">
      <div className="mb-8 flex items-center gap-2 text-on-surface-variant font-label text-[10px] tracking-widest uppercase">
         <Link href="/">Home</Link>
         <span>/</span>
         <Link href="/category/all">Protocols</Link>
         <span>/</span>
         <span className="text-primary font-bold">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: High-quality image gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
            {images.map((img: any, idx: number) => (
              <button 
                key={idx} 
                className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-28 bg-surface-container rounded-lg overflow-hidden transition-all ${idx === 0 ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-outline-variant'}`}
              >
                <img className="w-full h-full object-contain p-2" alt={`Thumb ${idx}`} src={img.url} />
              </button>
            ))}
          </div>
          {/* Main Product View */}
          <div className="flex-1 bg-surface-container-low rounded-3xl overflow-hidden relative group border border-outline-variant/10">
            <img 
              className="w-full h-full object-contain p-12 transform group-hover:scale-105 transition-transform duration-700" 
              alt={product.title} 
              src={images[0]?.url || "/placeholder.png"} 
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full">In Stock</span>
              {product.isFeatured && (
                <span className="bg-surface/80 backdrop-blur-md text-on-surface px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full">Top Scored</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Information + CTAs (Client Component) */}
        <ProductInteractiveSection product={JSON.parse(JSON.stringify(product))} />
      </div>

      <div className="h-32"></div>

      {/* Bento Grid: Science & Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-surface-container p-10 rounded-2xl">
          <h3 className="font-headline text-3xl font-black tracking-tight mb-8 uppercase italic underline decoration-primary decoration-4 underline-offset-8">The Molecular Advantage</h3>
          <p className="text-on-surface-variant leading-relaxed text-lg mb-8 font-medium">
             {product.description}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="text-3xl font-black text-primary mb-1">High</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bioavailability</div>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="text-3xl font-black text-primary mb-1">Elite</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Performance</div>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="text-3xl font-black text-primary mb-1">Lab</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Certified</div>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="text-3xl font-black text-primary mb-1">Zero</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fillers</div>
            </div>
          </div>
        </div>
        
        <div className="bg-inverse-surface text-white p-10 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-primary-fixed text-5xl mb-6">science</span>
            <h3 className="font-headline text-2xl font-bold mb-4 uppercase tracking-tighter">Laboratory Verified Protocols</h3>
            <p className="text-stone-400 text-sm leading-relaxed font-body">
                Every batch is tested for purity, potency, and heavy metals by independent 3rd party laboratories. Our commitment to radical transparency ensures you only fuel with the best.
            </p>
          </div>
          <button className="mt-8 flex items-center gap-2 text-primary font-black text-xs tracking-widest uppercase hover:gap-4 transition-all">
              View Lab Results
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Technical Specifications Section */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h3 className="font-headline text-3xl font-black tracking-tight mb-12 uppercase italic underline decoration-primary decoration-4 underline-offset-8">
            Clinical & Technical Dossier
          </h3>
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {product.specifications.map((spec: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-8 border-b border-r border-outline-variant/5 hover:bg-surface-container-low transition-colors group"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-hover:text-primary transition-colors">
                    {spec.name}
                  </div>
                  <div className="text-lg font-black text-on-surface uppercase italic tracking-tight">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
