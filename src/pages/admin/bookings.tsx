import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Package,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export default function BookingPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    package_id: "",
    event_date: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPackagesLoading, setIsPackagesLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pricing");
        setPackages(res.data);
      } catch (error) {
        toast.error("Gagal memuat daftar paket");
        console.error(error);
      } finally {
        setIsPackagesLoading(false);
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim() || !form.phone.trim() || !form.package_id || !form.event_date) {
      toast.error("Nama, No HP, Paket, dan Tanggal Acara wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/booking", form);
      toast.success("Booking berhasil dikirim! 🎉\nTim Luxefilm akan menghubungi Anda dalam 24 jam.");
      
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        package_id: "",
        event_date: "",
        message: ""
      });
    } catch (error) {
      toast.error("Gagal mengirim booking. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/30 to-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-6">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700 mb-3">
            Booking Layanan
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Isi formulir di bawah untuk memesan layanan sinematografi Luxefilm. Tim kami akan menghubungi Anda untuk konfirmasi detail.
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50/30 px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-600" />
              Detail Booking
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                <span>Nama Lengkap</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                placeholder="Contoh: Budi Santoso"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
              />
              <p className="text-xs text-slate-500">
                Opsional - untuk pengiriman invoice digital
              </p>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Nomor WhatsApp</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                placeholder="+6281234567890"
                required
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
              />
              <p className="text-xs text-slate-500">
                Format internasional dengan kode negara (contoh: +6281234567890)
              </p>
            </div>

            {/* Package Selection */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-slate-500" />
                <span>Pilih Paket Layanan</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={form.package_id}
                  onChange={(e) => setForm({...form, package_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none appearance-none bg-white text-slate-900"
                >
                  <option value="" disabled className="text-slate-400">
                    {isPackagesLoading ? "Memuat paket..." : "Pilih paket layanan"}
                  </option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id} className="text-slate-800">
                      {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {packages.length === 0 && !isPackagesLoading && (
                <p className="text-xs text-amber-600 mt-1">
                  Belum ada paket tersedia. Hubungi admin untuk informasi lebih lanjut.
                </p>
              )}
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Tanggal Acara</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.event_date}
                onChange={(e) => setForm({...form, event_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
              />
              <p className="text-xs text-slate-500">
                Pilih tanggal minimal hari ini
              </p>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Catatan Tambahan</span>
              </label>
              <textarea
                placeholder="Contoh: Lokasi acara di Jakarta Selatan, tema warna emas dan putih..."
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900 resize-y"
              />
              <p className="text-xs text-slate-500">
                Berikan detail tambahan tentang acara Anda untuk membantu kami mempersiapkan layanan terbaik
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isPackagesLoading}
              className={`w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                isSubmitting || isPackagesLoading ? "opacity-85 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Kirim Booking Sekarang
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              <span className="font-medium text-violet-600">✨ Respons Cepat:</span> Tim Luxefilm akan menghubungi Anda dalam 24 jam kerja melalui WhatsApp untuk konfirmasi detail booking.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 text-center space-y-3">
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Respon 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Gratis Konsultasi</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>100% Privasi Data</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Data Anda aman dan hanya digunakan untuk keperluan booking. Kami tidak akan membagikan informasi Anda kepada pihak ketiga tanpa persetujuan.
          </p>
        </div>
      </div>
    </div>
  );
}