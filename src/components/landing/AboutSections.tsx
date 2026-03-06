import AnimatedSection from "./AnimatedSection";
import { useSettings } from "@/conteks/SettingsConteks";
import { Mail, Phone, MapPin, Map } from "lucide-react";

export default function AboutSection() {
  const { settings, loading } = useSettings();

  if (loading || !settings) return null;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* TEXT */}
        <AnimatedSection>
          <div>
            <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">Booking</p>
          <h2 >
          </h2>
          
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              {settings.about_title}
            </h2>

            <p className="text-muted-foreground font-body mb-8 leading-relaxed center">
              {settings.about_text}
            </p>

            {/* CONTACT INFO */}
            <div className="space-y-4 border-t border-border pt-6">

              {settings.contact_email && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mt-1" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
               
              {settings.whatsapp_number && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mt-1" />
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    {settings.whatsapp_number}
                  </a>
                </div>
              )}

              
{settings.office_address && (
  <div className="flex items-start gap-3 text-sm text-muted-foreground">
    <MapPin className="w-4 h-4 mt-1" />
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        settings.office_address
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition-colors"
    >
      {settings.office_address}
    </a>
  </div>
)}

            </div>
          </div>
        </AnimatedSection>

        {/* IMAGE */}
        <AnimatedSection delay={0.15}>
          {settings.about_image && (
            <div className="relative">
              <img
                src={
                  settings.about_image.startsWith("http")
                    ? settings.about_image
                    : `http://localhost:5000${settings.about_image.startsWith("/") ? "" : "/"}${settings.about_image}`
                }
                alt="About Luxefilm"
                className="w-full h-[420px] object-cover rounded-2xl shadow-md"
              />
            </div>
          )}
        </AnimatedSection>

      </div>
    </section>
  );
}