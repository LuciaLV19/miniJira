import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Error Message Box */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          error ? "max-h-20 opacity-100 mb-1" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono rounded-lg">
          {error}
        </div>
      </div>
      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a0d14] border border-cyan-500/30 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0a0d14] border border-cyan-500/30 rounded-lg pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 inset-y-0 px-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center mt-4 w-full py-2.5 px-4 h-9 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-sm rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
}
