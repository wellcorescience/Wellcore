import { CheckCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const features = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "Sourced directly from verified manufacturers."
  },
  {
    id: 2,
    icon: CheckCircle,
    title: "Lab Tested",
    desc: "Every batch is tested for purity & heavy metals."
  },
  {
    id: 3,
    icon: Truck,
    title: "Fast Delivery",
    desc: "Free express shipping on orders over ₹999."
  },
  {
    id: 4,
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day hassle-free replacement policy."
  }
];

export default function BrandFeatures() {
  return (
    <section className="py-16 bg-black border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 text-primary">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-white font-heading font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
