import { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Check, Star } from "lucide-react";
import axios from "axios";

interface Pricing {
  id: number;
  name: string;
  price: number;
  description: string;
  is_popular: number;
  features: string[];
}


export default function PricingSection() {
  const [packages, setPackages] = useState<Pricing[]>([]);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pricing");
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
    }
  };

  const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
  
};


  const sortedPackages = () => {
  const popular = packages.find(p => p.is_popular === 1);
  const others = packages.filter(p => p.is_popular !== 1);

  if (!popular) return packages;

  if (others.length === 2) {
    return [others[0], popular, others[1]];
  }

  return [popular, ...others];
};
  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            Investasi
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Pilih Paket <span className="gold-gradient-text">Terbaik</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {sortedPackages().map((pkg, i) => (
            <AnimatedSection key={pkg.id} delay={i * 0.15}>
              <div
                className={`rounded-lg p-8 h-full flex flex-col relative ${
                  pkg.is_popular
                    ? "border-2 border-primary bg-card"
                    : "glass-card"
                }`}
              >
                {pkg.is_popular === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient-bg text-primary-foreground px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-1">
                    <Star size={12} /> Terpopuler
                  </div>
                )}

                <h3 className="font-heading text-xl font-semibold mb-1">
                  {pkg.name}
                </h3>

                <p className="text-muted-foreground text-xs font-body mb-4">
                  {pkg.description}
                </p>

                <div className="mb-6">
                  <span className="text-3xl font-heading font-bold gold-gradient-text">
  {formatRupiah(pkg.price)}
</span>
                </div>
<ul className="space-y-3 mb-8 flex-1">
                <a
                  href="#contact"
                  className={`text-center py-3 text-sm font-semibold tracking-widest uppercase rounded-sm transition-opacity ${
                    pkg.is_popular
                      ? "gold-gradient-bg text-primary-foreground hover:opacity-90"
                      : "border border-primary/50 text-primary hover:bg-primary/10"
                  }`}
                >
                  Pilih Paket
                </a>
                
  {pkg.features?.map((feature: any) => (
  <li
    key={feature.id}
    className="flex items-start gap-3 text-sm font-body text-foreground/80"
  >
    <Check className="text-primary shrink-0 mt-0.5" size={16} />
    {feature.feature}
  </li>
))}
</ul>
              </div>
              
            </AnimatedSection>
            
          ))}
        </div>
      </div>
    </section>
  );
}