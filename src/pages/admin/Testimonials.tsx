import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  MessageSquare,
  Star,
  User,
  BadgeCheck
} from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  message: string;
  rating: number;
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial>({
    name: "",
    role: "",
    message: "",
    rating: 5,
  });
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  // Configure axios with token
  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      toast.error("Gagal memuat testimonial");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({
      name: "",
      role: "",
      message: "",
      rating: 5,
    });
    setShowForm(true);
  };

  const openEdit = (item: Testimonial) => {
    setSelected(item);
    setForm({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.role.trim() || !form.message.trim() || form.rating < 1 || form.rating > 5) {
      toast.error("Semua kolom wajib diisi dengan data valid");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selected?.id) {
        await axios.put(`http://localhost:5000/api/testimonials/${selected.id}`, form);
        toast.success("Testimonial berhasil diperbarui");
      } else {
        await axios.post("http://localhost:5000/api/testimonials", form);
        toast.success("Testimonial berhasil ditambahkan");
      }

      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      toast.error(selected ? "Gagal memperbarui testimonial" : "Gagal menambahkan testimonial");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Yakin ingin menghapus testimonial ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      await axios.delete(`http://localhost:5000/api/testimonials/${id}`);
      toast.success("Testimonial berhasil dihapus");
      fetchTestimonials();
    } catch (error) {
      toast.error("Gagal menghapus testimonial");
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Manajemen Testimonial
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola testimonial klien yang ditampilkan di website Anda
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah Testimonial
        </button>
      </div>

      {/* Loading & Empty States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 font-medium">Memuat daftar testimonial...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Testimonial</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Tambahkan testimonial pertama Anda untuk membangun kepercayaan calon klien.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Testimonial Pertama
          </button>
        </div>
      ) : (
        /* Testimonials Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Rating */}
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400" size={20} />
                  ))}
                </div>

                {/* Message */}
                <p className="text-slate-700 italic leading-relaxed mb-6 border-l-2 border-violet-100 pl-4 py-2">
                  "{testimonial.message}"
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                    <p className="text-sm text-violet-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(testimonial)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto animate-in slide-in-from-bottom-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50/30">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {selected ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-500" />
                    Edit Testimonial
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah Testimonial Baru
                  </>
                )}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Nama Klien</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  required
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-slate-500" />
                  <span>Peran/Jabatan</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  placeholder="Contoh: CEO PT Maju Jaya"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Pesan Testimonial</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Testimonial dari klien..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900 resize-y"
                  required
                />
                <p className="text-xs text-slate-500">
                  Gunakan tanda kutip ("") untuk penekanan. Maksimal 200 karakter disarankan.
                </p>
              </div>

              {/* Rating Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Rating (1-5)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`p-1.5 rounded-full transition-all ${
                        form.rating >= star
                          ? "text-amber-400 bg-amber-50"
                          : "text-slate-300 hover:text-amber-300"
                      }`}
                      aria-label={`Beri rating ${star} bintang`}
                    >
                      <Star 
                        size={24} 
                        className={form.rating >= star ? "fill-amber-400" : ""} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Rating akan ditampilkan sebagai bintang emas di website
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-violet-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-700 text-white hover:opacity-90 shadow-md"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : selected ? (
                    <>
                      <BadgeCheck className="w-4 h-4" />
                      Perbarui Testimonial
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Simpan Testimonial
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Footer */}
      {!isLoading && testimonials.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50/30 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
            <MessageSquare className="w-4 h-4 text-violet-600" />
            <span>
              Terdapat <span className="font-bold text-violet-700">{testimonials.length}</span> testimonial aktif yang ditampilkan di website Anda
            </span>
          </div>
        </div>
      )}
    </div>
  );
}