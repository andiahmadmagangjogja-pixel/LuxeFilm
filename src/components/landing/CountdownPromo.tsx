import { useEffect, useState } from "react";
import { useSettings } from "@/conteks/SettingsConteks";
import AnimatedSection from "./AnimatedSection";

export default function CountdownPromo() {
  const { settings, loading } = useSettings();

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!settings?.promo_end_date) return;

    const interval = setInterval(() => {
      const end = new Date(settings.promo_end_date.replace(" ", "T")).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);

      if (isNaN(end)) return;

      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  if (loading || !settings) return null;
  if (Number(settings.promo_active) !== 1) return null;

  const units = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 right-0 h-px gold-gradient-bg" />

      <div className="max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
            {settings.promo_title}
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Diskon <span className="gold-gradient-text">{settings.promo_discount}</span> untuk Booking Bulan Ini
          </h2>

          <p className="text-muted-foreground font-body mb-10 max-w-xl mx-auto">
            {settings.promo_description}
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 md:gap-8 mb-10">
            {units.map((u) => (
              <div key={u.label} className="text-center">
                <div className="glass-card rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
                  <span className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
                    {String(u.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs font-body uppercase tracking-wider">
                  {u.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="inline-block gold-gradient-bg text-primary-foreground px-10 py-4 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            Klaim Diskon Sekarang
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}