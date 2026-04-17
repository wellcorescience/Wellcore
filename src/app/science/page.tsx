import Link from "next/link";

export default function SciencePage() {
  const methodologies = [
    {
      title: "Molecular Precision",
      description: "Every formula is engineered at the molecular level to ensure maximum receptor affinity and cellular uptake.",
      icon: "biotech",
      image: "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Clinical Dosage",
      description: "We use exact clinical dosages used in peer-reviewed human trials, never proprietary blends or 'fairy dust' amounts.",
      icon: "clinical_notes",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Bio-Availability",
      description: "Utilizing liposomal delivery and advanced ion-exchange processes to ensure active compounds bypass digestive degradation.",
      icon: "vital_signs",
      image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80"
    },
    {
      title: "Third-Party Rigor",
      description: "Each batch undergoes triple-blind testing for purity, heavy metals, and label accuracy in independent ISO-certified labs.",
      icon: "verified_user",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-outline-variant/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-container)_0%,_transparent_70%)] opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] border border-primary/30 rounded-full animate-pulse"></div>
          <div className="absolute w-[600px] h-[600px] border border-primary/20 rounded-full animate-pulse [animation-delay:1s]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="font-label text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-700">Experimental Protocol Alpha</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Radical <span className="text-primary italic underline decoration-4 underline-offset-8">Transparency</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            We don't sell supplements. We provide laboratory-verified physiological optimization protocols based on elite human performance data.
          </p>
        </div>
      </section>

      {/* Methodology Grid */}
      <section className="py-32 px-6 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {methodologies.map((m, idx) => (
            <div key={idx} className="bg-stone-950 p-10 rounded-[2rem] relative overflow-hidden group min-h-[400px] flex flex-col justify-end text-white">
              <img src={m.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000 origin-center" alt={m.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent z-0"></div>
              
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform origin-left">{m.icon}</span>
                <h3 className="font-headline text-2xl font-black uppercase italic mb-4 tracking-tight text-white">{m.title}</h3>
                <p className="text-stone-300 leading-relaxed font-medium text-sm">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Laboratory Bento Section */}
      <section className="py-32 px-6 max-w-screen-2xl mx-auto border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto lg:h-[600px]">
          <div className="md:col-span-8 bg-stone-950 rounded-[2rem] p-12 flex flex-col justify-end relative overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" alt="Elite Purity Laboratory" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent z-10"></div>
            <div className="relative z-20">
               <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Elite Purity Standards</h2>
               <p className="max-w-xl text-stone-300 font-medium leading-relaxed">
                 Our facility operates under pharmaceutical-grade protocols. Every air particle is filtered, every surface is sterilized, and every molecule is accounted for. This is where high performance begins.
               </p>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-8">
             <div className="bg-stone-950 p-10 rounded-[2rem] text-white relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="HPLC Testing Equipment" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col justify-end h-full"><div>
                  <span className="material-symbols-outlined text-4xl mb-4 text-primary">science</span>
                  <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2 text-white">HPLC Verified</h4>
                  <p className="font-bold text-sm leading-tight text-stone-300">High-Performance Liquid Chromatography testing on every batch.</p>
                </div></div>
             </div>
             <div className="bg-stone-950 p-10 rounded-[2rem] relative overflow-hidden group text-white">
                <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale" alt="Elite Athletic Performance" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-0"></div>
                <div className="relative z-10 flex flex-col justify-end h-full"><div>
                  <span className="material-symbols-outlined text-4xl text-primary mb-4">gavel</span>
                  <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2 text-white">WADA Compliant</h4>
                  <p className="text-stone-300 font-medium text-sm leading-tight">Safe for competitive elite athletes. No banned substances.</p>
                </div></div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-inverse-surface text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-8">Ready to Level Up?</h2>
          <p className="text-stone-400 text-lg mb-12 font-medium">
            Explore our curated selection of high-performance formulas, each backed by the rigorous scientific standards detailed above.
          </p>
          <Link 
            href="/category/all"
            className="inline-block bg-primary text-black px-12 py-5 rounded-full font-headline font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]"
          >
            View All Protocols
          </Link>
        </div>
      </section>
    </div>
  );
}
