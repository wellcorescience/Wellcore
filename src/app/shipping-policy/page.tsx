import dbConnect from "@/lib/db";
import Storefront from "@/models/Storefront";

export default async function ShippingPolicy() {
  await dbConnect();
  const storefront = await Storefront.findOne().lean();
  
  // Notice: The default string here is basically what was statically typed before. 
  // It gives the user an excellent starting point in the DB if the DB hasn't been saved yet.
  const html = storefront?.shippingPolicyHtml || `
    <p class="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Last Updated: ${new Date().toLocaleDateString()}</p>
    <h2>1. Order Processing Times</h2>
    <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
    <h2>2. Domestic Shipping Rates and Estimates</h2>
    <p>We offer free standard shipping on all orders over ₹999. For orders under ₹999, shipping charges for your order will be calculated and displayed at checkout.</p>
  `;

  return (
    <div className="max-w-4xl mx-auto px-8 py-24 bg-surface min-h-[70vh]">
      <h1 className="font-headline text-5xl font-black uppercase italic tracking-tighter mb-8">
        Shipping <span className="text-primary">Policy</span>
      </h1>
      <div 
        className="space-y-6 text-stone-600 dark:text-stone-300 font-body leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-on-surface [&>h2]:font-headline [&>h2]:uppercase [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
