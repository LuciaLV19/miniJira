import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { isAxiosError } from "axios";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register } = useAuthStore();

  const passwordRequirements = (password: string) => [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Include uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Include lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Include number", valid: /[0-9]/.test(password) },
    {
      label: "Include special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const requirements = passwordRequirements(password);
  const passwordsMatch = password && password === confirmPassword;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!requirements.every((req) => req.valid)) {
      setError("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password, confirmPassword });
      navigate("/"); // Redirect to dashboard after successful registration
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || "Registration failed");
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
            value={username}
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
            value={email}
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
        {/* Lista visual de requisitos */}
        {password && (
          <div className="grid grid-cols-2 mt-1 font-mono text-[11px]">
            {requirements.map(
              (req: { label: string; valid: boolean }, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    req.valid ? "text-neon-green" : "text-gray-500"
                  }`}
                >
                  <span>{req.valid ? "✓" : "○"}</span>
                  <span>{req.label}</span>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="reg-confirm-password"
          className="text-xs font-mono text-cyan-400 uppercase tracking-wider"
        >
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
          <input
            id="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#0a0d14] border border-cyan-500/30 rounded-lg pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center mt-4 w-full h-9 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-sm rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
