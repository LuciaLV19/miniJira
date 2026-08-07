import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import api from "../../api/axios";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) return;
    // Your register logic here
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log("Register response:", response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Username
        </label>
        <div className="relative flex items-center">
          <User className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0a0d14] border border-cyan-500/30 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="reg-email"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="reg-email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a0d14] border border-cyan-500/30 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="reg-password"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
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
        className="mt-4 w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-sm rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] active:scale-[0.98] transition-all cursor-pointer"
      >
        Create Account
      </button>
    </form>
  );
}
