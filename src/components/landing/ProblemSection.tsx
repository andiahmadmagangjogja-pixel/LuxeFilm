import { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { XCircle } from "lucide-react";

interface Problem {
  id: number;
  title: string;
  description: string;
  is_active: number;
}

export default function ProblemSection() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/problems");
        const data = await res.json();

        // tampilkan hanya yang aktif
        const activeProblems = data.filter((item: Problem) => item.is_active === 1);

        setProblems(activeProblems);
      } catch (error) {
        console.error("Gagal mengambil problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            Masalah Umum
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Apakah Anda Mengalami{" "}
            <span className="gold-gradient-text">Ini?</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 font-body">
            Banyak klien datang kepada kami dengan kekecewaan yang sama —
            momen spesial yang terabadikan dengan cara yang biasa saja.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, i) => (
            <AnimatedSection key={problem.id} delay={i * 0.1}>
              <div className="glass-card rounded-lg p-6 text-left flex items-start gap-4">
                <XCircle className="text-destructive shrink-0 mt-0.5" size={20} />

                <div>
                  <p className="font-semibold text-sm mb-1">{problem.title}</p>
                  <p className="text-foreground/80 font-body text-sm leading-relaxed">
                    {problem.description}
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