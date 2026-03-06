import { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { Award, Film, Heart, Users } from "lucide-react";

interface Reason {
  id: number;
  icon: string;
  title: string;
  description: string;
  is_active: number;
}

export default function WhyChooseUs() {
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/why-choose-us");
        const data = await res.json();

        const activeReasons = data.filter(
          (item: Reason) => item.is_active === 1
        );

        setReasons(activeReasons);
      } catch (error) {
        console.error("Gagal mengambil why choose us:", error);
      }
    };

    fetchReasons();
  }, []);

  const icons = [Film, Heart, Award, Users];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            Mengapa Kami
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Bukan Sekadar{" "}
            <span className="gold-gradient-text">Videografer</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Kami adalah visual storyteller yang mengubah momen Anda menjadi
            karya sinematik yang tak lekang oleh waktu.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {/** */}
            {reasons.map((r, i) => {
            const Icon = icons[i % icons.length];

            return (
              <AnimatedSection key={r.id} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors duration-500">
                    <Icon className="text-primary" size={24} />
                      {r.icon}
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold mb-3">
                    {r.title}
                  </h3>

                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </AnimatedSection>
              
            );
          })}
          {/**  
                   {reasons.map((r, i) => (
  <AnimatedSection key={r.id} delay={i * 0.1}>
    <div className="text-center group">

      <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-primary/30 flex items-center justify-center text-2xl">
        {r.icon}
      </div>

      <h3 className="font-heading text-lg font-semibold mb-3">
        {r.title}
      </h3>

      <p className="text-muted-foreground text-sm font-body leading-relaxed">
        {r.description}
      </p>

    </div>
  </AnimatedSection>
))}
  */}
                 

        </div>
      </div>
    </section>
  );
}