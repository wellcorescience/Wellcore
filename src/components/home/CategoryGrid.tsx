import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Whey Protein",
    slug: "whey-protein",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=2070&auto=format&fit=crop",
    desc: "100% Pure Whey Isolate"
  },
  {
    id: 2,
    title: "Pre-Workout",
    slug: "pre-workout",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    desc: "Explosive Energy"
  },
  {
    id: 3,
    title: "Mass Gainer",
    slug: "mass-gainer",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop",
    desc: "Clean Muscle Growth"
  },
  {
    id: 4,
    title: "Fat Burner",
    slug: "fat-burner",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop",
    desc: "Shred Safely"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-4 uppercase">
            Shop By <span className="text-primary-dark">Goal</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the right supplement stack curated specifically for your fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative block h-80 rounded-xl overflow-hidden shadow-md">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-1 uppercase font-heading">{cat.title}</h3>
                <p className="text-primary font-medium text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {cat.desc}
                </p>
                <div className="inline-flex items-center text-sm font-bold text-white group-hover:text-primary transition-colors">
                  EXPLORE <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
