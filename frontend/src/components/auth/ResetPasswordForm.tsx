import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPasswordApi } from "../../services/authService";

export default function ResetPasswordForm() {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await resetPasswordApi(token, password, confirmPassword);
      navigate("/login");
    } catch (requestError) {
      setError(
        isAxiosError(requestError)
          ? requestError.response?.data?.message
          : "Unable to reset password",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300">
          {error}
        </p>
      )}
      <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
        New password
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            required
            minLength={8}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-[#0a0d14] py-2 pl-9 pr-10 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </label>
      <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
        Confirm password
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            required
            minLength={8}
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-[#0a0d14] py-2 pl-9 pr-10 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </label>
      <button
        type="submit"
        className="rounded-lg bg-cyan-500 py-2.5 font-mono text-sm font-bold uppercase text-[#0a0d14]"
      >
        Update password
      </button>
    </form>
  );
}
