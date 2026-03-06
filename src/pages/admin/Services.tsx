import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Package, ListOrdered, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id?: number;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  features: string;
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [form, setForm] = useState<Service>({
    title: "",
    description: "",
    icon: "",
    order_index: 0,
    features: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error("Gagal memuat layanan");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({
      title: "",
      description: "",
      icon: "",
      order_index: services.length > 0 ? Math.max(...services.map(s => s.order_index)) + 1 : 1,
      features: "",
    });
    setShowForm(true);
  };

  const openEdit = (item: Service) => {
    setSelected(item);
    setForm({ 
      title: item.title,
    description: item.description,
    icon: item.icon,
    features: item.features || "",
    order_index: item.order_index,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.description.trim() || !form.icon.trim() || !form.features.trim()) {
      toast.error("Semua kolom wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = selected 
        ? `http://localhost:5000/api/services/${selected.id}`
        : "http://localhost:5000/api/services";
      
      const method = selected ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Operasi gagal");

      toast.success(selected ? "Layanan berhasil diperbarui" : "Layanan berhasil ditambahkan");
      setShowForm(false);
      fetchServices();
    } catch (error) {
      toast.error(selected ? "Gagal memperbarui layanan" : "Gagal menambahkan layanan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      toast.success("Layanan berhasil dihapus");
      fetchServices();
    } catch (error) {
      toast.error("Gagal menghapus layanan");
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Manajemen Layanan
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola layanan kreatif yang Anda tawarkan kepada klien
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </button>
      </div>

      {/* Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 font-medium">Memuat daftar layanan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Layanan</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Mulai dengan menambahkan layanan kreatif pertama Anda
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </button>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services
            .sort((a, b) => a.order_index - b.order_index)
            .map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-violet-50 rounded-xl">
                      <div className="w-6 h-6 flex items-center justify-center text-violet-600 font-bold">
                        {service.icon || <Package className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(service)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit layanan"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-800 text-xs font-medium rounded-full">
                          {service.order_index}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{service.title}</h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* FORM MODAL */}
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
                    Edit Layanan
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah Layanan
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
              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Judul Layanan
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Deskripsi
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-500 min-h-[100px]"
                  required
                />
              </div>
{/* Features Field */}
<div className="space-y-2">
  <label className="text-sm font-medium text-slate-700">
    Fitur Layanan
  </label>

  <input
    value={form.features}
    onChange={(e) =>
      setForm({ ...form, features: e.target.value })
    }
    placeholder="Contoh: Same Day Edit, Drone Aerial, Highlight Video"
    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-500"
  />

  <p className="text-xs text-slate-500">
    Pisahkan fitur dengan koma (,)
  </p>
</div>
              {/* Icon Field */}
<div className="space-y-2">
  <label className="text-sm font-medium text-slate-700">
    Icon
    <span className="text-rose-500 ml-1">*</span>
  </label>

  <div className="relative">
    <select
      value={form.icon}
      onChange={(e) => setForm({ ...form, icon: e.target.value })}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 bg-white"
      required
    >
      <option value="">Pilih Icon</option>

<option value="Heart">❤️ Wedding</option>
<option value="Gem">💍 Engagement</option>

<option value="Film">🎬 Cinematic Film</option>
<option value="Video">🎥 Videography</option>

<option value="Camera">📸 Photography</option>
<option value="Image">📷 Photo Shoot</option>

<option value="Calendar">📅 Event Coverage</option>
<option value="PartyPopper">🎉 Celebration</option>

<option value="Building2">🏢 Corporate Video</option>
<option value="Briefcase">💼 Business Video</option>

<option value="Plane">🚁 Drone Aerial</option>
<option value="Map">🌍 Travel Cinematic</option>

<option value="Users">👥 Team</option>
    </select>

    {/* Preview icon {form.icon} */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
      {form.icon ? (
        <span className="text-lg"></span>
      ) : (
        <span></span>
      )}
    </div>
  </div>
</div>

              {/* Order Index Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-slate-500" />
                  Urutan Tampil
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-500"
                  required
                />
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
                      <CheckCircle className="w-4 h-4" />
                      Simpan
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tambah
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Footer */}
      {!isLoading && services.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50/30 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              Terdapat <span className="font-bold text-violet-700">{services.length}</span> layanan aktif
            </span>
          </div>
        </div>
      )}
    </div>
  );
}