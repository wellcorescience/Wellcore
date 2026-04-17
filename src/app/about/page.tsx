export default function AboutPage() {
  return (
    <div className="bg-surface text-on-surface pb-24">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYK76mfQh1sMGWofXYOh3R-omgv0cS92jEVppGfaQTHF994Mv8B9FpHLcoEBdYkE4eXop59wCgtTn6IyhlrZOYi_ro4_0LHWEjE8kX2jTf-GM5KL7nXS8fdxjuECjuWTOx5A0QqDuXoVAOM1nULjYkcN9rR0l2KiGXbnGvdim1FNn3zg4517Bv4XCIeM8fk1cdx5YYUOaUzTQbkqoqj9ZH_tfcbd1W1PLuJ3hNtlHbhueyUDLpTBWWCXH3aEuo2N2OvLHGPHn5P14" alt="About Wellcore" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-headline font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
            Redefining <span className="text-primary tracking-normal">Human</span> Potential
          </h1>
          <div className="w-24 h-1.5 bg-primary mx-auto mt-6"></div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-8 pt-20 space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-black uppercase text-on-surface">Precision Engineered Nutrition</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Wellcore Science is not just another supplement company; we are an elite human performance laboratory. 
            We engineer high-performance, clinical-grade nutritional protocols designed specifically to optimize your body's 
            molecular mechanisms, pushing the boundaries of physiological adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
           <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
              <span className="material-symbols-outlined text-primary text-5xl mb-6 block">biotech</span>
              <h3 className="text-xl font-headline font-black uppercase tracking-tight mb-4">Laboratory Verified</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every single ingredient utilized in Wellcore Science protocols is subject to rigorous third-party clinical trials and laboratory verification. 
                We never settle for proprietary blends or hidden dosages.
              </p>
           </div>
           
           <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
              <span className="material-symbols-outlined text-primary text-5xl mb-6 block">fitness_center</span>
              <h3 className="text-xl font-headline font-black uppercase tracking-tight mb-4">Elite Efficacy</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Designed primarily for professional athletes and those who demand peak physical operation, our formulas are synthesized to yield maximum performance output.
              </p>
           </div>
        </div>

        <div className="space-y-6 pt-12">
          <h2 className="text-3xl font-headline font-black uppercase text-on-surface">Our Philosophy</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            There is no substitute for hard work, but there is a definitive advantage in science. Our mission is to bridge the gap between 
            relentless ambition and cutting-edge biochemistry. We exist to provide the crucial catalyst that transforms your effort into measurable, elite-tier results.
          </p>
        </div>
      </section>
    </div>
  );
}
