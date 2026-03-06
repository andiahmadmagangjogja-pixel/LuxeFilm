import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Tag,
  Star,
  ListOrdered,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// ✅ FIXED: Proper feature type with null safety
export interface Feature {
  id: number;
  feature: string;
  pricing_id: number;
}

export interface Pricing {
  id?: number;
  name: string;
  price: number;
  description: string;
  features: (Feature | null)[]; // ✅ Allow null values in array (matches your API)
  is_popular: boolean;
  order_index: number;
}

// ✅ API functions properly scoped outside component
export const addFeature = (data: any) =>
  axios.post("http://localhost:5000/api/pricing/feature", data);

export const deleteFeature = (id: number) =>
  axios.delete(`http://localhost:5000/api/pricing/feature/${id}`);

export default function PricingAdmin() {
  const [data, setData] = useState<Pricing[]>([]);
  const [form, setForm] = useState<Pricing>({
    name: "",
    price: 0,
    description: "",
    features: [],
    is_popular: false,
    order_index: 0,
  });
  const [selected, setSelected] = useState<Pricing | null>(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState<{ [key:number]: string }>({}); // ✅ Properly scoped inside component
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pricing", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Gagal memuat paket harga");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({
      name: "",
      price: 0,
      description: "",
      features: [],
      is_popular: false,
      order_index: data.length > 0 ? Math.max(...data.map(p => p.order_index)) + 1 : 1,
    });
    setNewFeature({});
    setShow(true);
  };

  const openEdit = (item: Pricing) => {
    setSelected(item);
    setForm({ ...item });
    setNewFeature({});
    setShow(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || form.price <= 0 || !form.description.trim()) {
      toast.error("Nama, harga (harus > 0), dan deskripsi wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = selected 
        ? `http://localhost:5000/api/pricing/${selected.id}`
        : "http://localhost:5000/api/pricing";
      
      const method = selected ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          order_index: Number(form.order_index)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Operasi gagal");
      }

      toast.success(selected ? "Paket harga berhasil diperbarui" : "Paket harga berhasil ditambahkan");
      setShow(false);
      fetchData();
    } catch (error: any) {
      toast.error(selected ? "Gagal memperbarui paket" : "Gagal menambahkan paket");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Yakin ingin menghapus paket harga ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/pricing/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      toast.success("Paket harga berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus paket harga");
      console.error(error);
    }
  };

 const handleAddFeature = async (pricingId: number) => {

  const featureText = newFeature[pricingId];

  if (!featureText || !featureText.trim()) {
    toast.error("Fitur tidak boleh kosong");
    return;
  }

  try {

    await addFeature({
      pricing_id: pricingId,
      feature: featureText.trim(),
    });

    toast.success("Fitur berhasil ditambahkan");

    setNewFeature(prev => ({
      ...prev,
      [pricingId]: ""
    }));

    fetchData();

  } catch (err) {
    toast.error("Gagal menambahkan fitur");
    console.error(err);
  }
};

  const handleDeleteFeature = async (id: number) => {
    if (!confirm("Yakin hapus fitur ini?")) return;
    
    try {
      await deleteFeature(id);
      toast.success("Fitur dihapus");
      fetchData();
    } catch (err) {
      toast.error("Gagal menghapus fitur");
      console.error("Delete feature error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Manajemen Paket Harga
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola paket harga layanan kreatif untuk klien Anda
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Baru
        </button>
      </div>

      {/* Loading & Empty States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 font-medium">Memuat daftar paket harga...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Paket Harga</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Buat paket harga pertama Anda untuk menampilkan opsi layanan kepada calon klien.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Buat Paket Pertama
          </button>
        </div>
      ) : (
        /* Pricing Cards Grid - ✅ FIXED: Null safety for features */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data
            .sort((a, b) => a.order_index - b.order_index)
            .map((p) => {
              // ✅ CRITICAL FIX: Filter out null/undefined features BEFORE mapping
              const validFeatures = (p.features || []).filter(
                (f): f is Feature => f !== null && f !== undefined && typeof f === 'object' && 'feature' in f
              );

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                    p.is_popular
                      ? "border-2 border-violet-500 bg-gradient-to-b from-violet-50 to-white"
                      : "border-slate-200 bg-white hover:shadow-md"
                  }`}
                >
                  {p.is_popular && (
                    <div className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Paling Populer</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2.5 py-0.5 bg-violet-100 text-violet-800 text-xs font-medium rounded-full">
                          Urutan #{p.order_index}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit paket"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus paket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-800">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {p.description}
                      </p>
                      
                      {/* ✅ FIXED: Null-safe feature rendering */}
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        <h4 className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5 text-violet-500" />
                          Paket
                        </h4>
                        
                        {validFeatures.length > 0 ? (
                          validFeatures.map((feature) => (
                            <div 
                              key={feature.id} 
                              className="flex justify-between items-center group"
                            >
                              <span className="text-slate-700 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                {feature.feature}
                              </span>
                              <button
                                onClick={() => handleDeleteFeature(feature.id)}
                                className="text-rose-500 text-xs opacity-0 group-hover:opacity-100 hover:text-rose-700 transition-opacity"
                              >
                                Hapus
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">Belum ada fitur</p>
                        )}

                        {/* Add Feature Form */}
                        <div className="flex gap-2 mt-3">
                          <input
  type="text"
  placeholder="Tambah fitur baru..."
  value={newFeature[p.id!] || ""}
  onChange={(e) =>
    setNewFeature({
      ...newFeature,
      [p.id!]: e.target.value
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleAddFeature(p.id!)
    }
  }}
  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 text-slate-900"
/>
                         <button
  onClick={() => handleAddFeature(p.id!)}
  disabled={!newFeature[p.id!]?.trim()}
  className="px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Tambah
</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* FORM MODAL */}
      {show && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in"
          onClick={() => setShow(false)}
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
                    Edit Paket Harga
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah Paket Baru
                  </>
                )}
              </h2>
              <button
                onClick={() => setShow(false)}
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
                  <span>Nama Paket</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  placeholder="Contoh: Paket Pernikahan Premium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  required
                />
              </div>

              {/* Price Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span>Harga (Rp)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="10000"
                  placeholder="Contoh: 15000000"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  required
                />
                <p className="text-xs text-slate-500">
                  Masukkan angka 
                </p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <span>Deskripsi</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Jelaskan fitur dan benefit paket ini..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 min-h-[100px] text-slate-900"
                  required
                />
                <p className="text-xs text-slate-500">
                  Akan ditampilkan di halaman harga website Anda
                </p>
              </div>

              {/* Order Index Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-slate-500" />
                  <span>Urutan Tampil</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.order_index || ""}
                  onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  placeholder={`Urutan saat ini: ${data.length + 1}`}
                  required
                />
                <p className="text-xs text-slate-500">
                  Angka lebih kecil = ditampilkan lebih awal (contoh: 1 muncul sebelum 2)
                </p>
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-2.5 py-2">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_popular}
                    onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
                    form.is_popular ? "bg-violet-600" : "bg-slate-200"
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow transform transition-transform ${
                      form.is_popular ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-slate-700">
                    Tandai sebagai Paket Populer
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
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
                      Simpan Perubahan
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tambah Paket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Footer */}
      {!isLoading && data.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50/30 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              Terdapat <span className="font-bold text-violet-700">{data.length}</span> paket harga aktif, 
              termasuk <span className="font-bold text-amber-600">{data.filter(p => p.is_popular).length}</span> paket populer
            </span>
          </div>
        </div>
      )}
    </div>
  );
}