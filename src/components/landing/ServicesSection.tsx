import { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Heart, Gem, Film, Video, Camera, Image,PartyPopper, Briefcase,Plane, Map, Users, GraduationCap, Building2, Calendar } from "lucide-react";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  features: string
};

// Mapping string icon dari database ke lucide icon
const iconMap: any = {
  heart: Heart,
  gem: Gem,
  film: Film,
  video: Video,
  camera: Camera,
  image: Image,
  PartyPopper: PartyPopper,
  plane: Plane,
  map:Map,
  users:Users,
  graduation: GraduationCap,
  building: Building2,
  event: Calendar,

};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            Layanan Kami
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Apa yang Bisa Kami{" "}
            <span className="gold-gradient-text">Ciptakan</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
  {services.map((s, i) => {
    const IconComponent = iconMap[s.icon?.toLowerCase()] || Heart;

    return (
      <AnimatedSection key={s.id} delay={i * 0.1}>
        <div className="glass-card rounded-lg p-8 h-full group hover:border-primary/30 transition-colors duration-500">
          
          <IconComponent
            className="text-primary mb-6"
            size={32}
          />

          <h3 className="font-heading text-xl font-semibold mb-3">
            {s.title}
          </h3>

          <p className="text-muted-foreground text-sm font-body leading-relaxed mb-6">
            {s.description}
          </p>

          {/* 🔥 FEATURES */}
          {s.features && (
  <div className="flex flex-wrap gap-2">
    {s.features.split(",").map((f, idx) => (
      <div
        key={idx}
        className="px-4 py-2 text-xs rounded-full 
        bg-primary/10 text-primary 
        border border-primary/30
        text-center
        whitespace-nowrap"
      >
        {f.trim()}
      </div>
    ))}
  </div>
)}

        </div>
      </AnimatedSection>
    );
  })}
</div>
      </div>
    </section>
  );
}