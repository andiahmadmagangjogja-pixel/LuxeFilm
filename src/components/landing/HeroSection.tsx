import { motion } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HeroSection() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/settings")
      .then(res => setSettings(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!settings) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Cinematic production" className="w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          {settings.hero_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 font-body leading-relaxed"
        >
          {settings.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contact"
            className="gold-gradient-bg text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            {settings.hero_button_text || "Konsultasi Gratis"}
          </a>
        </motion.div>

      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ChevronDown size={24} />
      </motion.div>

    </section>
  );
}