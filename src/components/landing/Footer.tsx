import { useEffect, useState } from "react";

interface Settings {
  instagram_link: string;
  facebook_link: string;
  linkedin_link: string;
  tiktok_link: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        const data = await res.json();

        const result = Array.isArray(data) ? data[0] : data;

        setSettings({
          instagram_link: result.instagram_link || "",
          facebook_link: result.facebook_link || "",
          linkedin_link: result.linkedin_link || "",
          tiktok_link: result.tiktok_link || "",
        });
      } catch (error) {
        console.error("Gagal ambil settings footer:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-card border-t border-border/30 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="font-heading text-lg font-bold tracking-wider">
          <span className="gold-gradient-text">LUXE</span>
          <span className="text-foreground">FILMS</span>
        </div>

        <p className="text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()} LuxeFilms. All rights reserved.
        </p>

        <div className="flex gap-6">

          {settings?.instagram_link && (
            <a
              href={settings.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-xs font-body transition-colors"
            >
              Instagram
            </a>
          )}

          {settings?.facebook_link && (
            <a
              href={settings.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-xs font-body transition-colors"
            >
              Facebook
            </a>
          )}

          {settings?.linkedin_link && (
            <a
              href={settings.linkedin_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-xs font-body transition-colors"
            >
              LinkedIn
            </a>
          )}

          {settings?.tiktok_link && (
            <a
              href={settings.tiktok_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-xs font-body transition-colors"
            >
              TikTok
            </a>
          )}

        </div>
      </div>
    </footer>
  );
}