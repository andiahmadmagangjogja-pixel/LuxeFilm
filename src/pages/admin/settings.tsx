import { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  Loader2,
  Image,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsAdmin() {
  const [form, setForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    about: true,
    contact: true,
    social: true,
    seo: true,
  });
  const token = localStorage.getItem("token");

  // Configure axios with token
  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      setForm(res.data || {});
    } catch (error) {
      toast.error("Gagal memuat pengaturan");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      await axios.put("http://localhost:5000/api/settings", form);
      toast.success("Pengaturan website berhasil diperbarui ✨");
      fetchSettings(); // Refresh to confirm save
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Memuat pengaturan website...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
            Pengaturan Website
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Kelola semua konten dan konfigurasi website Luxefilm Anda dalam satu tempat
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* HERO SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('hero')}
            className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-violet-50 to-indigo-50/30 border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Image className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Bagian Hero</h2>
            </div>
            {expandedSections.hero ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {expandedSections.hero && (
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Judul Utama Hero
                </label>
                <input
                  type="text"
                  name="hero_title"
                  value={form.hero_title || ""}
                  onChange={handleChange}
                  placeholder="" //contoh kalau mau di isi 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Subjudul Hero
                </label>
                <textarea
                  name="hero_subtitle"
                  value={form.hero_subtitle || ""}
                  onChange={handleChange}
                  placeholder="" //contoh 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

             
           

              
            </div>
          )}
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('about')}
            className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Image className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Tentang Kami</h2>
            </div>
            {expandedSections.about ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {expandedSections.about && (
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Judul 
                </label>
                <input
                  type="text"
                  name="about_title"
                  value={form.about_title || ""}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  name="about_text"
                  value={form.about_text || ""}
                  onChange={handleChange}
                  placeholder="Ceritakan tentang studio Anda, nilai-nilai, dan keahlian..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              
            </div>
          )}
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('contact')}
            className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Informasi Kontak</h2>
            </div>
            {expandedSections.contact ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {expandedSections.contact && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={form.contact_email || ""}
                    onChange={handleChange}
                    placeholder="contoh@luxefilm.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  />
                </div>
                
                
              </div>

              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp_number"
                  value={form.whatsapp_number || ""}
                  onChange={handleChange}
                  placeholder="+6281234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
                
              </div>

              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Alamat Kantor
                </label>
                <textarea
                  name="office_address"
                  value={form.office_address || ""}
                  onChange={handleChange}
                  placeholder=""
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                link Maps
                </label>
                <textarea
                  name="google_maps_embed"
                  value={form.google_maps_embed || ""}
                  onChange={handleChange}
                  placeholder="" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900 font-mono text-xs"
                />
                
              </div>
            </div>
          )}
        </div>

        {/* SOCIAL MEDIA SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('social')}
            className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-pink-50 to-pink-100/50 border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-pink-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Medsos</h2>
            </div>
            {expandedSections.social ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {expandedSections.social && (
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram_link"
                  value={form.instagram_link || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/luxefilm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook_link"
                  value={form.facebook_link || ""}
                  onChange={handleChange}
                  placeholder="https://facebook.com/luxefilm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin_link"
                  value={form.linkedin_link || ""}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/luxefilm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700  items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  TikTok
                </label>
                <input
                  type="text"
                  name="tiktok_link"
                  value={form.tiktok_link || ""}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@luxefilm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
          )}
        </div>

         {/* =================== PROMO =================== */}
       <div className="bg-white rounded-2xl border border-slate-200 p-6">
  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
      <span className="text-violet-600 font-bold text-sm">%</span>
    </div>
    <h2 className="text-lg font-bold text-slate-800">Promo</h2>
  </div>

  <div className="space-y-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Judul Promo
      </label>
      <input
        type="text"
        name="promo_title"
        value={form.promo_title}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Deskripsi 
      </label>
      <textarea
        name="promo_description"
        value={form.promo_description}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900 resize-y"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Diskon
      </label>
      <input
        type="text"
        name="promo_discount"
        value={form.promo_discount}
        onChange={handleChange}
        placeholder="Contoh: 50%"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Berakhir Pada
      </label>
      <input
        type="datetime-local"
        name="promo_end_date"
        value={form.promo_end_date?.slice(0, 16)}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
      />
      <p className="text-xs text-slate-500">
        Format: Tanggal dan waktu berakhir promo
      </p>
    </div>

    <div className="pt-2">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div className="relative">
          <input
  type="checkbox"
  name="promo_active"
  checked={form.promo_active === 1}
  onChange={(e) =>
    setForm({
      ...form,
      promo_active: e.target.checked ? 1 : 0
    })
  }
  className="sr-only"
/>
          <div className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
            form.promo_active === 1 ? "bg-violet-600" : "bg-slate-200"
          }`}>
            <div className={`w-3 h-3 rounded-full bg-white shadow transform transition-transform ${
              form.promo_active === 1 ? "translate-x-4" : "translate-x-0"
            }`} />
          </div>
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700 transition-colors">
          Aktifkan
        </span>
      </label>
      
    </div>
  </div>
</div>
        {/* SAVE BUTTON - Sticky Footer */}
      <div className="fixed bottom-6 right-8 z-50">
  <button
    type="submit"
    disabled={isSubmitting}
    className={`px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${
      isSubmitting ? "opacity-85 cursor-not-allowed" : ""
    }`}
  >
    {isSubmitting ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Menyimpan...
      </>
    ) : (
      <>
        <Save className="w-5 h-5" />
        Simpan Perubahan
      </>
    )}
  </button>
</div>
      </form>
    </div>
  );
}