import { useEffect, useState } from "react";
import axios from "axios";
import AnimatedSection from "./AnimatedSection";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faq");
      setFaqs(res.data);
    } catch (error) {
      console.error("Failed to fetch FAQ:", error);
    }
  };

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            FAQ
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Pertanyaan yang <span className="gold-gradient-text">Sering Ditanyakan</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <div className="glass-card rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-semibold text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform ${
                      openId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openId === item.id && (
                  <div className="px-6 pb-6 text-muted-foreground">
                    {item.answer}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}