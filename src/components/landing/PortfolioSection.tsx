import AnimatedSection from "./AnimatedSection";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PortfolioSection() {

  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/portfolio")
      .then((res) => {
        setPortfolioItems(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section id="portfolio" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">Portfolio</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Karya yang <span className="gold-gradient-text">Berbicara</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Setiap project adalah cerita unik. Lihat bagaimana kami mengubah momen menjadi kenangan abadi.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                    <Play className="text-primary ml-1" size={20} />
                  </div>
                  <p className="font-heading text-sm font-semibold">{item.title}</p>
                  <p className="text-primary text-xs tracking-widest uppercase mt-1">
                    {item.category}
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
