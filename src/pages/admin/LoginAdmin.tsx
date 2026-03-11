import { useState } from "react";
import axios from "axios";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft } from "lucide-react";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
  email,
  password,
});

      // ✅ Core Logic: simpan token
      localStorage.setItem("token", res.data.token);

      // Core Logic: redirect dashboard
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Kredensial tidak valid. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand / Logo Area */}
        <div className="text-center mb-10">
          
        
          <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300 tracking-tight">
            Admin Luxefilm
          </h2>
          <p className="text-gray-400 mt-2">Masuk untuk mengelola website Anda</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-black border border-gray-800 rounded-2xl p-7 shadow-2xl space-y-6"
        >
          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-yellow-400" />
              <span>Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@luxefilm.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-700 bg-black/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all outline-none text-white placeholder:text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-yellow-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-700 bg-black/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all outline-none text-white placeholder:text-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98] ${
              loading
                ? "bg-gray-800 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:opacity-90 shadow-lg shadow-yellow-500/20"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sedang login...
              </>
            ) : (
              "Login ke Dashboard"
            )}
          </button>
        </form>

        {/* Back to Website Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-gray-200 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ke Website
        </button>

        
      </div>
    </div>
  );
}