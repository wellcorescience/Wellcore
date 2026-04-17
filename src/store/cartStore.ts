import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string; // product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find((x) => x.product === item.product);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((x) =>
                x.product === existingItem.product ? { ...item, quantity: item.quantity + existingItem.quantity } : x
              ),
            };
          } else {
            return { cartItems: [...state.cartItems, item] };
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((x) => x.product !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((x) =>
            x.product === productId ? { ...x, quantity } : x
          ),
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      cartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'wellcore-cart',
    }
  )
);
