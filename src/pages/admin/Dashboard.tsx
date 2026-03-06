import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"];

export default function DashboardAdmin() {
  const [totalPortfolio, setTotalPortfolio] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [dataChart, setDataChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/portfolio");
      const data = res.data;

      setTotalPortfolio(data.length);

      const kategori = [...new Set(data.map((item: any) => item.category))];
      setTotalKategori(kategori.length);

      const grouped: any = {};

      data.forEach((item: any) => {
        grouped[item.category] = (grouped[item.category] || 0) + 1;
      });

      const chartReady = Object.keys(grouped).map((key) => ({
        name: key,
        total: grouped[key],
      }));

      setDataChart(chartReady);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold">📊</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Admin
          </h1>
          <p className="text-sm text-slate-500">
            Ringkasan aktivitas dan statistik website
          </p>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Total Portfolio"
          value={totalPortfolio}
          subtitle="Jumlah karya yang ditampilkan"
          icon="🎬"
          loading={loading}
        />

        <StatCard
          title="Total Kategori"
          value={totalKategori}
          subtitle="Kategori portfolio yang tersedia"
          icon="🏷️"
          loading={loading}
        />

        <StatCard
          title="Status Sistem"
          value="Online"
          subtitle="Server berjalan dengan normal"
          icon="✅"
          loading={loading}
          status
        />

      </div>

      {/* CHART
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Distribusi Portfolio
          </h3>
          <p className="text-sm text-slate-500">
            Perbandingan jumlah portfolio berdasarkan kategori
          </p>
        </div>

        <div className="p-6">

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[350px]">

              <ResponsiveContainer width="100%" height={350}>
  <BarChart layout="vertical" data={dataChart}>
    
    <CartesianGrid strokeDasharray="3 3" horizontal={false} />

    <XAxis type="number" />

    <YAxis
      dataKey="name"
      type="category"
      width={120}
    />

    <Tooltip />

    <Bar
      dataKey="total"
      fill="#8b5cf6"
      radius={[6,6,6,6]}
    />

  </BarChart>
</ResponsiveContainer>

            </div>
          )}

        </div>

      </div> */}
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Portfolio Terbaru
  </h3>

  <div className="space-y-3">

    {dataChart.slice(0,5).map((item) => (
      <div
        key={item.name}
        className="flex items-center justify-between border-b border-slate-100 pb-2"
      >

        <div>
          <p className="font-medium text-slate-800">
            {item.name}
          </p>
          <p className="text-xs text-slate-500">
            {item.total} item
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {item.total}
        </span>

      </div>
    ))}

  </div>
</div>
      {/* AKSI CEPAT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Aksi Cepat
        </h3>

        <div className="flex flex-wrap gap-3">

          <a
            href="/admin/portfolio"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition"
          >
            + Tambah Portfolio
          </a>

          <a
            href="/admin/services"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            + Tambah Layanan
          </a>

          <a
            href="/admin/testimonials"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"
          >
            + Tambah Testimoni
          </a>

        </div>

      </div>

    </div>
  );
}

/* ========================= */
/* KOMPONEN STAT CARD */
/* ========================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading,
  status = false,
}: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold text-slate-500 uppercase">
            {title}
          </p>

          {loading ? (
            <div className="h-6 w-16 bg-slate-200 rounded mt-3 animate-pulse"></div>
          ) : (
            <h2
              className={`text-3xl font-bold mt-2 ${
                status ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {value}
            </h2>
          )}

          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>

        </div>

        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}