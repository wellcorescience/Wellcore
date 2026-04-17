import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Storefront from "@/models/Storefront";
import Deal from "@/models/Deal";
import AddToCartButton from "@/components/products/AddToCartButton";
import CountdownTimer from "@/components/home/CountdownTimer";
import VideoReels from "@/components/home/VideoReels";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  await dbConnect();

  // Fetch products for different sections
  const muscleWeaponProducts = await Product.find({ tags: "Muscle Weapon" }).limit(6).lean();
  const blackYakProducts = await Product.find({ tags: "Black Yak" }).limit(6).lean();
  const massGainers = await Product.find({ subcategory: "Mass Gainer" }).limit(6).lean();
  const scienceSelection = await Product.find({ isFeatured: true }).limit(8).lean();
  
  // Fetch Storefront Settings (must register Deal model first if populated)
  // Fetch Active Deal from Storefront
  const storefront = await Storefront.findOne()
    .populate({
      path: 'activeDeal',
      populate: { path: 'activeProducts', options: { lean: true } }
    })
    .lean();

  const activeDeal = storefront?.activeDeal;
  
  let dealsFiltered = [];
  if (activeDeal && activeDeal.activeProducts?.length > 0) {
    dealsFiltered = activeDeal.activeProducts;
  } else {
    dealsFiltered = await Product.find({ isOnSale: true }).limit(5).lean();
  }
  
  const dealsList = dealsFiltered; // Use the legacy name for fewer changes below
  
  // Destructure with fallbacks
  const heroHeadline = storefront?.heroHeadline || "Boost Energy & Performance";
  const heroSubtitle = storefront?.heroSubtitle || "Clinically dosed, science-backed formulas designed for elite athletes and high-performers who demand more from their bodies.";
  const heroButtonText = storefront?.heroButtonText || "Shop Now";
  const heroButtonLink = storefront?.heroButtonLink || "/category/all";
  
  // Fallback if DB is empty for initial run
  const hasProducts = dealsList.length > 0 || scienceSelection.length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[819px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Hero Protocol Background" src={storefront?.heroBackgroundImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label text-xs font-extrabold tracking-[0.2em] uppercase rounded-sm">Engineered For Performance</span>
            <h1 className="font-headline text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">{heroHeadline}</h1>
            <p className="text-stone-300 text-lg max-w-lg font-body leading-relaxed">{heroSubtitle}</p>
            <div className="pt-4 flex gap-4">
              <Link href={heroButtonLink} className="bg-primary-container text-on-primary-container px-10 py-4 font-headline font-black uppercase tracking-tight rounded-md hover:scale-105 transition-transform inline-block">{heroButtonText}</Link>
              <Link href="/science" className="border border-white/30 text-white px-10 py-4 font-headline font-black uppercase tracking-tight rounded-md backdrop-blur-md hover:bg-white/10 transition-colors inline-block">Learn The Science</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-4xl font-black tracking-tighter uppercase">Clinical Categories</h2>
              <div className="h-1 w-20 bg-primary-container mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/all">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="star">star</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Featured Collection</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/all?brand=muscle-weapon">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="swords">swords</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Muscle Weapon</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/mass-gainer">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="monitoring">monitoring</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Mass Gainers</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/nutraceuticals">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="pill">pill</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Nutraceuticals</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/all?sort=createdAt">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="new_releases">new_releases</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">New Arrivals</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/pre-workout">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="bolt">bolt</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Pre Workouts</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/all?brand=soldiers-nutrition">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="shield">shield</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Soldiers Nutrition</h3>
            </Link>
            <Link className="group relative bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-xl border border-outline-variant/10" href="/category/whey-protein">
              <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl" data-icon="fitness_center">fitness_center</span>
              </div>
              <h3 className="font-headline font-black uppercase text-[10px] tracking-widest leading-tight">Whey Proteins</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      {dealsList.length > 0 && (
        <section className="py-24 bg-surface border-y border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-error flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(var(--color-error-rgb),0.3)]">
                   <span className="material-symbols-outlined text-white text-3xl animate-bounce">bolt</span>
                 </div>
                 <div>
                   <h2 className="font-headline text-4xl font-black tracking-tighter uppercase italic">{activeDeal ? activeDeal.name : "Top Deals Of The Day"}</h2>
                   <p className="text-on-surface-variant font-black text-[10px] tracking-[0.2em] uppercase mt-1">High-Voltage Protocol Savings</p>
                 </div>
              </div>
              
              {activeDeal && activeDeal.endTime && (
                <div className="flex items-center gap-6">
                  <span className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant hidden lg:block">Offer ends in:</span>
                  <CountdownTimer targetDate={activeDeal.endTime} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dealsList.map((product: any, idx: number) => (
                <div key={product._id.toString()} className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                   
                   <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className="w-full md:w-48 aspect-square bg-surface-container-low rounded-2xl overflow-hidden relative">
                         <Link href={`/product/${product.slug}`}>
                           <img 
                             className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700" 
                             alt={product.title} 
                             src={product.images?.[0]?.url || "/placeholder.png"} 
                           />
                         </Link>
                         <div className="absolute top-2 left-2 bg-error text-white text-[8px] font-black px-2 py-1 rounded-sm">
                            -{product.salePercent}% DEAL
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                         <div>
                            <Link href={`/product/${product.slug}`}>
                              <h4 className="font-headline font-black text-2xl uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none mb-2">{product.title}</h4>
                            </Link>
                            <p className="text-on-surface-variant text-xs mb-6 font-medium line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-baseline gap-3 mb-6">
                               {product.salePercent > 0 && (
                                 <span className="text-3xl font-black text-error">-{product.salePercent}%</span>
                               )}
                               <span className="text-3xl font-black text-white italic tracking-tighter">₹{product.price.toLocaleString()}</span>
                               {product.originalPrice && (
                                 <div className="text-stone-500 text-xs font-bold font-headline">M.R.P.: <span className="line-through">₹{product.originalPrice.toLocaleString()}</span></div>
                               )}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="space-y-2">
                               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-on-surface-variant">Protocol Deployment Status</span>
                                  <span className="text-error">Sold: {Math.floor(Math.random() * 40) + 40}/100</span>
                               </div>
                               <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-error rounded-full shadow-[0_0_10px_rgba(var(--color-error-rgb),0.5)]" 
                                    style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
                                  ></div>
                               </div>
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Grid - Science Selection */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl font-black tracking-tighter uppercase">The Science Selection</h2>
            <p className="text-on-surface-variant font-label mt-4 tracking-widest uppercase text-sm">Engineered for Elite Human Performance</p>
          </div>
          
          {scienceSelection.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {scienceSelection.map((product: any) => (
                <div key={product._id.toString()} className="group block">
                  <div className="bg-surface-container-highest aspect-[4/5] rounded-xl overflow-hidden relative mb-6">
                    <Link href={`/product/${product.slug}`}>
                      <img 
                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
                        alt={product.title} 
                        src={product.images?.[0]?.url || "/placeholder.png"} 
                      />
                    </Link>
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
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
                  <Link href={`/product/${product.slug}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline font-bold uppercase text-sm">{product.title}</h3>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[10px] font-bold">{product.ratings?.average || "5.0"}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-lg">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-stone-400 text-xs line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">inventory_2</span>
              <p className="text-xl font-headline font-bold uppercase">Clinical Inventory Loading...</p>
              <p className="text-on-surface-variant mt-2 italic">Please ensure your MongoDB is connected and the seed script has been run.</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand: Muscle Weapon */}
      {muscleWeaponProducts.length > 0 && (
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline text-4xl font-black tracking-tighter uppercase italic">Muscle Weapon <span className="text-primary italic">Protocol Series</span></h2>
                <div className="h-1 w-24 bg-primary mt-2"></div>
              </div>
              <Link href="/category/all?brand=muscle-weapon" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Command All Units</Link>
            </div>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8">
              {muscleWeaponProducts.map((product: any) => (
                <div key={product._id.toString()} className="min-w-[280px] bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 group transition-all hover:bg-surface-container">
                   <Link href={`/product/${product.slug}`} className="block relative aspect-square mb-4 bg-surface-container-highest rounded-xl overflow-hidden">
                      <img className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-500" src={product.images?.[0]?.url || "/placeholder.png"} alt={product.title} />
                      {product.isOnSale && <div className="absolute top-2 left-2 bg-error text-white text-[8px] font-black px-2 py-1 flex items-center gap-1 rounded-full"><span className="material-symbols-outlined text-[10px]">bolt</span> -{product.salePercent}%</div>}
                   </Link>
                   <h4 className="font-headline font-bold text-sm uppercase tracking-tight mb-4 truncate">{product.title}</h4>
                   <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-on-surface-variant font-black uppercase tracking-widest mb-1">Settlement</div>
                        <div className="text-lg font-black text-white italic">₹{product.price.toLocaleString()}</div>
                      </div>
                      <AddToCartButton 
                        iconOnly
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand: Black Yak */}
      {blackYakProducts.length > 0 && (
        <section className="py-24 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline text-4xl font-black tracking-tighter uppercase italic">Black Yak <span className="text-primary italic">Advanced Formulas</span></h2>
                <div className="h-1 w-24 bg-primary mt-2"></div>
              </div>
              <Link href="/category/all?brand=black-yak" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Command All Units</Link>
            </div>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8">
              {blackYakProducts.map((product: any) => (
                <div key={product._id.toString()} className="min-w-[280px] bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 group transition-all hover:bg-surface-container">
                   <Link href={`/product/${product.slug}`} className="block relative aspect-square mb-4 bg-white rounded-xl overflow-hidden p-4">
                      <img className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" src={product.images?.[0]?.url || "/placeholder.png"} alt={product.title} />
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">New Deployment</div>
                   </Link>
                   <h4 className="font-headline font-bold text-sm uppercase tracking-tight mb-4 truncate text-center">{product.title}</h4>
                   <div className="flex justify-center flex-col items-center">
                      <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Settlement Unit</div>
                      <div className="text-xl font-black text-white italic mb-4">₹{product.price.toLocaleString()}</div>
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Section */}
      <section className="py-16 bg-surface-container-highest/20 border-y border-stone-200/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-black text-3xl md:text-5xl italic tracking-tighter uppercase text-stone-900/40 dark:text-white/50 hover:text-primary transition-colors cursor-default">Muscle Weapon</span>
            <span className="font-headline text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-stone-900/40 dark:text-white/50 hover:text-primary transition-colors cursor-default">Black Yak</span>
            <span className="font-black text-3xl md:text-5xl italic tracking-tighter uppercase text-stone-900/40 dark:text-white/50 hover:text-primary transition-colors cursor-default">Soldiers Nutrition</span>
          </div>
        </div>
      </section>

      {/* Video Section - Shop by Videos */}
      {storefront?.shopVideos && storefront.shopVideos.length > 0 && (
        <VideoReels reels={JSON.parse(JSON.stringify(storefront.shopVideos))} />
      )}

      {/* Reviews Section */}
      {storefront?.trustedReviews && storefront.trustedReviews.length > 0 && (
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-5xl font-black tracking-tighter uppercase">Verified Performance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {storefront.trustedReviews.map((review: any, idx: number) => (
                <div key={idx} className="bg-surface-container p-8 rounded-2xl">
                  <div className="flex text-primary mb-4 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body text-stone-600 italic mb-6">"{review.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-300 overflow-hidden">
                      <img className="w-full h-full object-cover" alt={review.name} src={review.image || "/placeholder.png"} />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-sm uppercase">{review.name}</div>
                      <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{review.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
