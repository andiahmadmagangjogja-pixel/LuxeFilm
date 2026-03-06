import { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";

interface Step {
  id: number;
  title: string;
  description: string;
  order_number: number;
}

export default function WorkProcess() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/work-process")
      .then((res) => res.json())
      .then((data) => {
        setSteps(data);
      })
      .catch((err) => {
        console.error("Gagal ambil work process:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            Proses Kerja
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Cara Kami <span className="gold-gradient-text">Bekerja</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <AnimatedSection key={step.id} delay={i * 0.1}>
              <div className="flex gap-6 md:gap-10 items-start group">
                <div className="flex flex-col items-center">
                  <span className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
                    {String(step.order_number).padStart(2, "0")}
                  </span>

                  {i < steps.length - 1 && (
                    <div className="w-px h-16 bg-border/50 mt-2" />
                  )}
                </div>

                <div className="pb-8">
                  <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}