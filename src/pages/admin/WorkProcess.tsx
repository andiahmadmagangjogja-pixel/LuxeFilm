import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle, ListOrdered } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: number;
  title: string;
  description: string;
  order_number: number;
  is_active: number;
}

export default function WorkProcessAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    order_number: 1,
    is_active: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/work-process", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Judul dan deskripsi wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingId 
        ? `http://localhost:5000/api/work-process/${editingId}`
        : "http://localhost:5000/api/work-process";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Operasi gagal");

      toast.success(editingId ? "Item diperbarui" : "Item ditambahkan");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        order_number: items.length > 0 ? Math.max(...items.map(i => i.order_number)) + 1 : 1,
        is_active: 1,
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(editingId ? "Gagal memperbarui" : "Gagal menambahkan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Item) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus item ini?")) return;

    try {
      // ✅ FIXED: Full URL for DELETE endpoint consistency
      await fetch(`http://localhost:5000/api/work-process/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Item dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus");
      console.error(error);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      order_number: items.length > 0 ? Math.max(...items.map(i => i.order_number)) + 1 : 1,
      is_active: 1,
    });
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header - Clean with top-right button only */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <ListOrdered className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Proses Kerja
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola langkah-langkah kerja kreatif Luxefilm yang ditampilkan di website
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah Langkah
        </button>
      </div>

      {/* Items List - No always-visible form */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <ListOrdered className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Langkah</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Tambahkan langkah pertama dalam proses kerja kreatif Luxefilm
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Langkah Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items
            .sort((a, b) => a.order_number - b.order_number)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                          {item.order_number}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.is_active === 1
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}>
                        {item.is_active === 1 ? "Aktif" : "Nonaktif"}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit langkah"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus langkah"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* FORM MODAL - Only appears when button clicked */}
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
                    Edit Langkah
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah Langkah
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
                  Judul Langkah
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Deskripsi
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 resize-y"
                  required
                />
              </div>

              {/* Order & Status Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700  items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-slate-500" />
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.order_number}
                    onChange={(e) => setForm({ ...form, order_number: Number(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none text-slate-900 appearance-none bg-white"
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
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
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              Terdapat <span className="font-bold text-violet-700">{items.length}</span> langkah kerja, 
              <span className="font-bold text-emerald-500 ml-1">{items.filter(i => i.is_active === 1).length}</span> aktif
            </span>
          </div>
        </div>
      )}
    </div>
  );
}