import { useEffect, useState } from "react";
import axios from "axios";

export default function WhatsAppButton() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/settings")
      .then(res => setSettings(res.data));
  }, []);

  if (!settings?.whatsapp_number) return null;

  return (
    <a
      href={`https://wa.me/${settings.whatsapp_number}?text=Halo saya ingin konsultasi`}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg"
    >
      WA
    </a>
  );
}