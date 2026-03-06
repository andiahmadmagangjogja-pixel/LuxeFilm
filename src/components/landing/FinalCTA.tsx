import AnimatedSection from "./AnimatedSection";

export default function FinalCTA() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px gold-gradient-bg" />

      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Momen Indah Tak Akan
            <br />
            <span className="gold-gradient-text">Datang Dua Kali</span>
          </h2>
          <p className="text-muted-foreground font-body mb-10 max-w-xl mx-auto leading-relaxed">
            Jangan biarkan momen berharga berlalu tanpa cerita yang layak.
            Hubungi kami sekarang dan biarkan kami mengabadikannya untuk selamanya.
          </p>
          <a
            href="#contact"
            className="inline-block gold-gradient-bg text-primary-foreground px-10 py-4 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            Booking Sekarang
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
