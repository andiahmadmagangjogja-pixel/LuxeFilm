import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  HelpCircle, 
  ListOrdered,
  Loader2,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  order_index: number;
}

export default function FAQAdmin() {
  const [data, setData] = useState<FAQ[]>([]);
  const [form, setForm] = useState<FAQ>({
    question: "",
    answer: "",
    order_index: 1,
  });
  const [selected, setSelected] = useState<FAQ | null>(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  // Configure axios with token
  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faq");
      setData(res.data);
    } catch (err) {
      toast.error("Gagal memuat FAQ");
      console.error(err);
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
      question: "",
      answer: "",
      order_index: data.length > 0 
        ? Math.max(...data.map(f => f.order_index)) + 1 
        : 1,
    });
    setShow(true);
  };

  const openEdit = (item: FAQ) => {
    setSelected(item);
    setForm(item);
    setShow(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Pertanyaan dan jawaban wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selected?.id) {
        await axios.put(`http://localhost:5000/api/faq/${selected.id}`, form);
        toast.success("FAQ berhasil diperbarui");
      } else {
        await axios.post("http://localhost:5000/api/faq", form);
        toast.success("FAQ berhasil ditambahkan");
      }

      setShow(false);
      fetchData();
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      await axios.delete(`http://localhost:5000/api/faq/${id}`);
      toast.success("FAQ berhasil dihapus");
      fetchData();
    } catch (err) {
      toast.error("Gagal menghapus FAQ");
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700">
              Manajemen FAQ
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola pertanyaan yang sering diajukan oleh klien Anda
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Tambah FAQ
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 font-medium">Memuat daftar FAQ...</p>
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada FAQ</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Buat FAQ pertama Anda untuk membantu klien menemukan jawaban dengan cepat.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah FAQ Pertama
          </button>
        </div>
      ) : (
        /* FAQ List - Beautiful Card Design */
        <div className="space-y-3">
          {data
            .sort((a, b) => a.order_index - b.order_index)
            .map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Order Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-700 font-bold text-sm">{faq.order_index}</span>
                      </div>
                    </div>

                    {/* Question & Answer */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <p className="font-bold text-slate-800 text-base leading-tight">{faq.question}</p>
                      </div>
                      <p className="text-slate-600 text-sm pl-6 leading-relaxed">{faq.answer}</p>
                    </div>

                    {/* Actions - Fade in on hover */}
                    
                  </div>
                </div>

                {/* Bottom Action Bar (Mobile-friendly) */}
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(faq)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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

      {/* Form Modal*/}
      {show && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in"
          onClick={() => setShow(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto animate-in slide-in-from-bottom-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50/30">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {selected ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-500" />
                    Edit FAQ
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-violet-600" />
                    Tambah FAQ Baru
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

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Question Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Pertanyaan</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  placeholder=""
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  required
                />
              </div>

              {/* Answer Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <span>Jawaban</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder=""
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900 resize-y"
                  required
                />
                
              </div>

              {/* Order Index Field */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-slate-500" />
                  <span>Urutan Tampil</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.order_index || ""}
                  onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 1 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900"
                  placeholder={`Saat ini: ${data.length + 1}`}
                />
                
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
                      Perbarui FAQ
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Simpan FAQ
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
              Terdapat <span className="font-bold text-violet-700">{data.length}</span> pertanyaan FAQ aktif di website Anda
            </span>
          </div>
        </div>
      )}
    </div>
  );
}