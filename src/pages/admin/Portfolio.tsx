import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Database,
  Image as ImageIcon,
  ListOrdered,
  CheckCircle
} from "lucide-react";
import { features } from "process";

export default function PortfolioAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPortfolio = async () => {
    try {
      const res = await api.get("http://localhost:5000/api/portfolio");
      setItems(res.data);
    } catch (error) {
      toast.error("Gagal memuat portfolio");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", category: "",  image: null });
    setPreview(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ 
      title: item.title, 
      category: item.category,
      
      image: null 
    });
    setPreview(item.image_url || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.category.trim() || (!form.image && !editingId)) {
      toast.error("Judul, kategori, dan gambar wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category.trim());
      
      
      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await api.put(`http://localhost:5000/api/portfolio/${editingId}`, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
        toast.success("Portfolio berhasil diperbarui");
      } else {
        await api.post("http://localhost:5000/api/portfolio", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
        toast.success("Portfolio berhasil ditambahkan");
      }

      setShowForm(false);
      fetchPortfolio();
    } catch (error) {
      toast.error(editingId ? "Gagal memperbarui portfolio" : "Gagal menambahkan portfolio");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item portfolio ini?")) return;

    try {
      await api.delete(`http://localhost:5000/api/portfolio/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      toast.success("Portfolio berhasil dihapus");
      fetchPortfolio();
    } catch (error) {
      toast.error("Gagal menghapus portfolio");
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Manajemen Portfolio
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola proyek kreatif yang ditampilkan di website Anda
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah Portfolio
        </button>
      </div>

      {/* Empty & Loading States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 font-medium">Memuat portfolio...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Portfolio</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Tambahkan proyek pertama Anda untuk menampilkan karya kreatif kepada calon klien
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Portfolio Pertama
          </button>
        </div>
      ) : (
        /* Portfolio Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-violet-50 rounded-xl">
                    <div className="w-6 h-6 flex items-center justify-center text-violet-600 font-bold">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit portfolio"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-800 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                  </div>

                  {item.image_url && (
                    <div className="mt-2 aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Gambar+Tidak+Tersedia";
                        }}
                      />
                    </div>
                  )}
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
                {editingId ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-500" />
                    Edit Portfolio
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah Portfolio
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
                <label className="block text-sm font-medium text-slate-700">
                  Judul Proyek
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
                  required
                />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Kategori
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
                  required
                />
              </div>
                {/* Features */}
<div className="space-y-2">
  <label className="text-sm font-medium text-slate-700">
    Fitur / Highlight
  </label>

  

  <p className="text-xs text-slate-500">
    Pisahkan dengan koma
  </p>
</div>
              {/* Image Upload */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Gambar Proyek
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-violet-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {preview ? (
                      <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-violet-600" />
                        </div>
                        <span className="text-slate-600 text-sm">
                          {editingId ? "Klik untuk ganti gambar" : "Pilih gambar proyek"}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          Format: JPG, PNG, WEBP (max 5MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
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
                  ) : editingId ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Perbarui
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
      {!isLoading && items.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50/30 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
            <Database className="w-4 h-4 text-violet-600" />
            <span>
              Terdapat <span className="font-bold text-violet-700">{items.length}</span> proyek portfolio aktif
            </span>
          </div>
        </div>
      )}
    </div>
  );
}