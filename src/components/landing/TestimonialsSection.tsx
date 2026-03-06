import { useEffect, useState } from "react";
import axios from "axios";
import AnimatedSection from "./AnimatedSection";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  rating: number;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const next = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  if (testimonials.length === 0) return null;

  const item = testimonials[current];

  return (
    <section id="testimonials" className="section-padding bg-muted/20">
      <div className="max-w-5xl mx-auto">

        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
            Testimoni
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Kata <span className="gold-gradient-text">Mereka</span>
          </h2>
        </AnimatedSection>

        <div className="relative">

          <AnimatedSection key={item.id}>
            <div className="glass-card p-12 rounded-2xl text-center">

              {/* rating */}
              <div className="flex justify-center mb-6">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* message */}
              <p className="text-lg md:text-xl italic text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                “{item.message}”
              </p>

              {/* name */}
              <h4 className="font-semibold text-lg">
                {item.name}
              </h4>

              <p className="text-sm text-muted-foreground">
                {item.role}
              </p>

            </div>
          </AnimatedSection>

          {/* tombol kiri */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 text-muted-foreground hover:text-primary transition"
          >
            <ChevronLeft size={32} />
          </button>

          {/* tombol kanan */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 text-muted-foreground hover:text-primary transition"
          >
            <ChevronRight size={32} />
          </button>

        </div>

        {/* indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                current === i
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}