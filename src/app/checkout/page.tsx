"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCartStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Pre-fill some data if available
        if (data.user.name) {
          const names = data.user.name.split(" ");
          setFormData(prev => ({
            ...prev,
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || ""
          }));
        }
      } else {
        toast.error("Please login to proceed with checkout");
        router.push("/login?redirect=/checkout");
      }
    } catch (error) {
      console.error("Auth check failed", error);
    }
  };

  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [mounted, cartItems, router]);

  if (!mounted || cartItems.length === 0) return null;

  const total = cartTotal();
  const tax = total * 0.18;
  const grandTotal = total + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyPayment = async (response: any, orderId: string) => {
    try {
      const res = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: orderId, // Our internal DB order ID
        }),
      });

      if (res.ok) {
        toast.success("Payment verified! Protocol confirmed.");
        clearCart();
        router.push("/profile"); // Or a success page
      } else {
        const data = await res.json();
        throw new Error(data.error || "Payment verification failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: "N/A", // Standard fallback
        },
        paymentMethod,
        totalAmount: grandTotal,
        phone: formData.phone
      };

      if (paymentMethod === "COD") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to place order");
        }

        toast.success("Order placed successfully (Cash on Delivery)!");
        clearCart();
        router.push("/profile");
      } else {
        // Razorpay Flow
        const res = await fetch("/api/orders/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to initialize payment");
        }

        const { order, key } = await res.json();

        const options = {
          key: key,
          amount: order.amount,
          currency: order.currency,
          name: "Wellcore Science",
          description: "Performance Protocol Purchase",
          order_id: order.id,
          handler: function (response: any) {
             verifyPayment(response, order.receipt); // receipt contains our DB order ID
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: user?.email || "",
            contact: formData.phone,
          },
          theme: {
            color: "#DAF900", // Wellcore Primary
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-on-background mb-2 uppercase italic">Secure Checkout</h1>
          <p className="text-on-surface-variant font-medium">Finalize your high-performance protocol verification.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-black border-2 border-primary-fixed shadow-lg shadow-primary/20">1</div>
            <span className="ml-3 font-headline font-black text-sm uppercase tracking-widest text-primary">Logistics</span>
          </div>
          <div className="h-px w-8 bg-outline-variant/30"></div>
          <div className="flex items-center group opacity-50">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-black border-2 border-transparent">2</div>
            <span className="ml-3 font-headline font-black text-sm uppercase tracking-widest text-on-surface-variant">Settlement</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <section className="lg:col-span-8 space-y-12">
          <form id="checkout-form" onSubmit={placeOrder} className="space-y-12">
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 shadow-xl">
              <h2 className="font-headline text-2xl font-black mb-8 flex items-center gap-3 uppercase italic tracking-tighter">
                <span className="material-symbols-outlined text-primary !text-3xl">local_shipping</span>
                Shipping Protocols
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none" placeholder="First Name" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none" placeholder="Last Name" type="text"/>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Full Delivery Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none" placeholder="Street, Building, Area" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none" placeholder="City" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Postal Code</label>
                  <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none" placeholder="Pincode" type="text"/>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-headline font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Phone Number (Required for Logistics)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">+91</span>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary pl-12 pr-4 py-4 font-medium transition-all focus:outline-none" placeholder="9876543210" type="tel"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 shadow-xl">
              <h2 className="font-headline text-2xl font-black mb-8 flex items-center gap-3 uppercase italic tracking-tighter">
                <span className="material-symbols-outlined text-primary !text-3xl">payments</span>
                Payment Protocol
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className={`relative flex items-center p-6 rounded-2xl cursor-pointer border-2 transition-all group ${paymentMethod === "ONLINE" ? "bg-primary-container/10 border-primary" : "bg-surface-container-low border-transparent hover:border-primary/50"}`}>
                  <input 
                    name="payment" 
                    type="radio" 
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-headline font-black uppercase text-[10px] tracking-widest text-primary">Recommended</span>
                    <span className="text-on-background font-black text-lg">Online Secure</span>
                    <p className="text-xs text-on-surface-variant font-medium">Cards, UPI, Netbanking</p>
                  </div>
                  <span className={`ml-auto material-symbols-outlined ${paymentMethod === "ONLINE" ? "text-primary" : "text-outline-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </label>

                <label className={`relative flex items-center p-6 rounded-2xl cursor-pointer border-2 transition-all group ${paymentMethod === "COD" ? "bg-primary-container/10 border-primary" : "bg-surface-container-low border-transparent hover:border-primary/50"}`}>
                  <input 
                    name="payment" 
                    type="radio" 
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-headline font-black uppercase text-[10px] tracking-widest text-on-surface-variant">Standard</span>
                    <span className="text-on-background font-black text-lg">Pay on Arrival</span>
                    <p className="text-xs text-on-surface-variant font-medium">Cash on Delivery</p>
                  </div>
                  <span className={`ml-auto material-symbols-outlined ${paymentMethod === "COD" ? "text-primary" : "text-outline-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                </label>
              </div>

              <div className="mt-10 p-6 bg-surface-container-low border-l-4 border-primary rounded-r-2xl">
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <p className="text-xs font-black font-headline uppercase tracking-widest">End-to-End Encryption</p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                    Your session is protected with SSL 256-bit encryption. All payment protocols are managed via Razorpay's secure infrastructure.
                </p>
              </div>
            </div>
          </form>
        </section>

        <aside className="lg:col-span-4">
          <div className="bg-inverse-surface text-surface-container-lowest p-8 rounded-3xl sticky top-28 shadow-2xl">
            <h3 className="font-headline text-xl font-black mb-8 uppercase tracking-tighter italic">Protocol Summary</h3>
            <div className="space-y-6 mb-8 pb-8 border-b border-white/10">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10 p-2">
                    <img className="w-full h-full object-contain" alt={item.name} src={item.image}/>
                    <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] w-5 h-5 flex items-center justify-center font-black rounded-full border-2 border-inverse-surface">{item.quantity}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-sm leading-tight line-clamp-2 uppercase tracking-tight">{item.name}</h4>
                      <span className="font-black text-primary text-sm mt-1">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 font-bold text-sm">
              <div className="flex justify-between">
                <span className="uppercase tracking-widest text-stone-400 text-[10px]">Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-widest text-stone-400 text-[10px]">Shipping</span>
                <span className="text-primary uppercase tracking-widest text-xs">Priority Free</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-widest text-stone-400 text-[10px]">GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl pt-6 mt-6 border-t border-white/10 text-primary font-black italic tracking-tighter">
                <span>TOTAL</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className={`w-full mt-10 py-5 font-headline font-black uppercase tracking-[0.2em] text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 ${loading ? 'bg-stone-600 text-stone-400' : 'bg-primary text-black'}`}
            >
              {loading ? "Initializing..." : "Authorize Transaction"}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
              <span className="material-symbols-outlined text-4xl">contactless</span>
              <span className="material-symbols-outlined text-4xl">credit_score</span>
              <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
