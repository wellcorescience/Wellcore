"use client";

import { useCartStore, CartItem } from "@/store/cartStore";
import { toast } from "react-hot-toast";

interface AddToCartButtonProps {
  item: CartItem;
  className?: string;
  iconOnly?: boolean;
}

export default function AddToCartButton({ item, className, iconOnly }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  if (iconOnly) {
    return (
      <button 
        onClick={handleAdd}
        className={className || "bg-stone-900 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"}
      >
        <span className="material-symbols-outlined">add_shopping_cart</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      className={className || "bg-stone-900 text-white font-headline font-bold text-xs uppercase py-3 rounded hover:bg-primary transition-colors w-full"}
    >
      Add to Cart
    </button>
  );
}
