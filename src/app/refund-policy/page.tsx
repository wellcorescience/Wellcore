import dbConnect from "@/lib/db";
import Storefront from "@/models/Storefront";

export default async function RefundPolicy() {
  await dbConnect();
  const storefront = await Storefront.findOne().lean();
  const html = storefront?.refundPolicyHtml || "<h2>1. Return Doctrine</h2><p>All protocol units are final sale unless damaged.</p>";

  return (
    <div className="max-w-4xl mx-auto px-8 py-24 bg-surface min-h-[70vh]">
      <h1 className="font-headline text-5xl font-black uppercase italic tracking-tighter mb-8">
        Refund <span className="text-primary">Policy</span>
      </h1>
      <div 
        className="space-y-6 text-stone-600 dark:text-stone-300 font-body leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-on-surface [&>h2]:font-headline [&>h2]:uppercase [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
