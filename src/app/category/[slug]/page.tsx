import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { Category, Brand } from "@/models/CategoryBrand";
import AddToCartButton from "@/components/products/AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  await dbConnect();

  const { slug } = resolvedParams;
  const brandFilter = resolvedSearchParams.brand as string;
  const minPrice = Number(resolvedSearchParams.minPrice) || 0;
  const maxPrice = Number(resolvedSearchParams.maxPrice) || 25000;

  // Fetch Sidebar Data
  const [categories, allBrands] = await Promise.all([
    Category.find().lean(),
    Brand.find().lean()
  ]);

  // Find current category
  const currentCategory = categories.find((c: any) => c.slug === slug);
  const title = currentCategory ? currentCategory.name : slug.replace(/-/g, ' ').toUpperCase();

  // Build filter
  const filter: any = {};
  if (currentCategory) {
    filter.category = currentCategory._id;
  } else if (slug !== 'all') {
    // If it's not 'all' and no category found, maybe it's a direct search or tag
    filter.$or = [
      { tags: { $in: [slug] } },
      { subcategory: slug }
    ];
  }

  if (brandFilter) {
    const brand = allBrands.find((b: any) => b.slug === brandFilter);
    if (brand) filter.brand = brand._id;
  }

  filter.price = { $gte: minPrice, $lte: maxPrice };

  // Fetch Products
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Sidebar: Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
          <div>
            <h3 className="font-headline font-extrabold text-lg tracking-tight mb-6 uppercase">Filters</h3>
            
            {/* Category */}
            <div className="mb-8">
              <p className="font-label text-xs font-bold tracking-widest text-primary-dim mb-4 uppercase">Category</p>
              <div className="space-y-3">
                <Link 
                  href="/category/all" 
                  className={`flex items-center gap-3 cursor-pointer group ${slug === 'all' ? 'text-primary' : ''}`}
                >
                  <span className={`w-2 h-2 rounded-full ${slug === 'all' ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors uppercase">All Categories</span>
                </Link>
                {categories.map((cat: any) => (
                  <Link 
                    key={cat._id.toString()} 
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-3 cursor-pointer group ${slug === cat.slug ? 'text-primary' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${slug === cat.slug ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors uppercase">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <p className="font-label text-xs font-bold tracking-widest text-primary-dim mb-4 uppercase">Price Range</p>
              <div className="space-y-3">
                <Link href={`?minPrice=0&maxPrice=1000`} className="text-[10px] font-black hover:text-primary block transition-colors uppercase tracking-widest">Under ₹1,000</Link>
                <Link href={`?minPrice=1000&maxPrice=3000`} className="text-[10px] font-black hover:text-primary block transition-colors uppercase tracking-widest">₹1,000 - ₹3,000</Link>
                <Link href={`?minPrice=3000&maxPrice=7000`} className="text-[10px] font-black hover:text-primary block transition-colors uppercase tracking-widest">₹3,000 - ₹7,000</Link>
                <Link href={`?minPrice=7000&maxPrice=25000`} className="text-[10px] font-black hover:text-primary block transition-colors uppercase tracking-widest">Over ₹7,000</Link>
              </div>
            </div>

            {/* Brand */}
            <div className="mb-8">
              <p className="font-label text-xs font-bold tracking-widest text-primary-dim mb-4 uppercase">Brand</p>
              <div className="space-y-3">
                {allBrands.map((brand: any) => (
                  <Link 
                    key={brand._id.toString()}
                    href={`?brand=${brand.slug}`}
                    className={`flex items-center gap-3 cursor-pointer group ${brandFilter === brand.slug ? 'text-primary' : ''}`}
                  >
                     <span className={`w-2 h-2 rounded-full ${brandFilter === brand.slug ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors uppercase">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-grow">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant font-label text-[10px] tracking-widest uppercase">
               <Link href="/">Home</Link>
               <span>/</span>
               <span className="text-primary font-bold">{title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Results For "{title}"</h1>
            <p className="text-on-surface-variant font-medium">
              {products.length} premium formulas engineered for elite human physiological optimization.
            </p>
          </header>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <div key={product._id.toString()} className="group bg-surface-container-lowest transition-all duration-300 hover:scale-[1.02] border border-outline-variant/10">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="aspect-square bg-surface-container-low overflow-hidden relative">
                      <img 
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
                        alt={product.title} 
                        src={product.images?.[0]?.url || "/placeholder.png"} 
                      />
                      {product.isOnSale && (
                        <div className="absolute top-4 left-4 bg-error text-white font-label text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                          -{product.salePercent}% DEAL
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/product/${product.slug}`}>
                        <h2 className="font-headline font-extrabold text-xl group-hover:text-primary transition-colors uppercase line-clamp-1">{product.title}</h2>
                      </Link>
                      {product.ratings && (
                         <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-[10px] font-bold">{product.ratings.average.toFixed(1)}</span>
                         </div>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 font-medium line-clamp-2 h-10">{product.description}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="font-label text-[10px] font-black text-primary block uppercase tracking-widest mb-1">Settlement</span>
                        <div className="flex items-baseline gap-2">
                           {product.salePercent > 0 && (
                             <span className="text-2xl font-black text-error">-{product.salePercent}%</span>
                           )}
                           <span className="text-2xl font-black italic tracking-tighter text-on-surface">₹{product.price.toLocaleString()}</span>
                        </div>
                        {product.originalPrice && (
                           <div className="text-stone-500 text-xs font-bold font-headline mt-1">M.R.P.: <span className="line-through">₹{product.originalPrice.toLocaleString()}</span></div>
                        )}
                      </div>
                      <AddToCartButton 
                        item={{
                          product: product._id.toString(),
                          name: product.title,
                          price: product.price,
                          image: product.images?.[0]?.url || "",
                          quantity: 1,
                          stock: product.stock
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
               <span className="material-symbols-outlined text-7xl text-stone-300 mb-6" data-icon="science">science</span>
               <h2 className="text-2xl font-headline font-black uppercase mb-2">No Matching Protocols Found</h2>
               <p className="text-on-surface-variant max-w-md mx-auto">Try adjusting your filters or search for another laboratory engineered supplement.</p>
               <Link href="/category/all" className="inline-block mt-8 bg-stone-900 text-white px-8 py-3 rounded-md font-headline font-bold uppercase text-sm tracking-tight hover:bg-primary transition-colors">View All Products</Link>
            </div>
          )}

          {/* Pagination (Keeping UI for now) */}
          {products.length > 9 && (
            <div className="mt-20 flex justify-center items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors rounded-sm">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-inverse-surface text-primary-fixed font-bold text-sm rounded-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors rounded-sm">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
