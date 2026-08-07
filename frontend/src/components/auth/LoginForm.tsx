import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Your login logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="user@cyber.net"
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
            placeholder="••••••••"
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
        className="mt-4 w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-sm rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] active:scale-[0.98] transition-all cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
}
