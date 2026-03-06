import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useSettings } from "@/conteks/SettingsConteks";


interface Settings {
  whatsapp: string;
  email: string;
  whatsapp_number: string;
  contact_email: string;
  about_title: string;
  about_text: string;
}

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    services: "",
    message: "",
  });
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings>({
  whatsapp: "",
  email: "",
  whatsapp_number: "",
  contact_email: "",
  about_title: "",
  about_text: "",
});
 

  // Fetch settings dari backend
 useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings");
      const data = await res.json();

      const result = Array.isArray(data) ? data[0] : data;

      setSettings({
        whatsapp: result.whatsapp_number || "",
        email: result.contact_email || "",
        whatsapp_number: result.whatsapp_number|| "",
        contact_email: result.office_address || "", // ini untuk alamat
        about_title : result.about_title|| "",
          about_text : result.about_text|| "",
      });

    } catch (error) {
      console.error("Gagal mengambil settings:", error);
    }
  };

  fetchSettings();
}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings?.whatsapp) return;

    const text = `
Halo LuxeFilms!

Nama: ${form.name}
Email: ${form.email}
No. WhatsApp: ${form.phone}
Layanan: ${form.services}

Pesan:
${form.message}
    `;

    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");
  };

  
useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Gagal ambil layanan:", err);
    }
  };

  fetchServices();
}, []);
  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">Booking</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Mulai <span className="gold-gradient-text">Ceritamu</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Hubungi kami sekarang untuk konsultasi gratis. Kami siap membantu mewujudkan visi Anda.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <AnimatedSection className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <Phone className="text-primary shrink-0 mt-1" size={20} />
              <div>
              <p className="font-heading text-sm font-semibold mb-1">
                  Telepon / WhatsApp
                </p>
                {settings.whatsapp_number && (
  <div className="flex items-start gap-3 text-sm text-muted-foreground">
    <a
      href={`https://wa.me/${settings.whatsapp_number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition-colors"
    >
      {settings.whatsapp_number}
    </a>
  </div>
)}
               
            </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-primary shrink-0 mt-1" size={20} />
              <div>
                <p className="font-heading text-sm font-semibold mb-1">
                  Email
                </p>
                <p className="text-muted-foreground text-sm font-body">
                 {settings.email && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                 
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              )}
               
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-primary shrink-0 mt-1" size={20} />
              <div>
              <p className="font-heading text-sm font-semibold mb-1">
                  Studio
                </p>
                <p className="text-muted-foreground text-sm font-body">
                  {settings.contact_email && (
  <div className="flex items-start gap-3 text-sm text-muted-foreground">
    
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        settings.contact_email
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition-colors"
    >
      {settings.contact_email}
    </a>
  </div>
)}

                </p>
            </div>
             
            </div>
          <div>
            
          <h2 >
          </h2>
          
            <h2 className="text-primary text-sm tracking-[0.3em] uppercase font-body mb-4">
              {settings.about_title}
            </h2>

            <p className="text-muted-foreground font-body mb-8 leading-relaxed center">
              {settings.about_text}
            </p>
          </div>

          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.15} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card rounded-lg p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-secondary/50 border border-border/50 rounded-sm px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-secondary/50 border border-border/50 rounded-sm px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  placeholder="No. WhatsApp"
                  required
                  maxLength={20}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-secondary/50 border border-border/50 rounded-sm px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <select
  value={form.services}
  onChange={(e) => setForm({ ...form, services: e.target.value })}
  className="bg-secondary/50 border border-border/50 rounded-sm px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
>
  <option value="">Pilih Project</option>

  {services.map((item) => (
    <option key={item.id} value={item.title}>
      {item.title}
    </option>
  ))}
</select>
              </div>
              <textarea
                placeholder="Ceritakan kebutuhan Anda..."
                rows={4}
                required
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-secondary/50 border border-border/50 rounded-sm px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full gold-gradient-bg text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Kirim via WhatsApp
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
