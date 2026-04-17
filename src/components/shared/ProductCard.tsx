import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: { url: string }[];
    category: string;
    ratings: {
      average: number;
      count: number;
    };
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden flex items-center justify-center p-6">
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <img 
            src={product.images[0]?.url || "https://placehold.co/400x400/png?text=Supplement"} 
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button 
          className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-black shadow-lg"
          aria-label="Quick Add"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
          {product.category}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading font-semibold text-lg text-gray-900 leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.ratings.average) ? 'fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">({product.ratings.count})</span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-xs font-bold text-error">({discount}% OFF)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
