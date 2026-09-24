import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { requestPasswordResetApi } from "../../services/authService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await requestPasswordResetApi(email);
      setMessage(response.message);
    } catch (requestError) {
      setError(
        isAxiosError(requestError)
          ? requestError.response?.data?.message
          : "Unable to request password reset",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs text-slate-400">
        Enter your account email to reset your password.
      </p>
      {message && (
        <p className="rounded border border-cyan-500/40 bg-cyan-950/30 p-3 text-xs text-cyan-300">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300">
          {error}
        </p>
      )}
      <label
        htmlFor="forgot-email"
        className="text-xs font-mono uppercase tracking-wider text-cyan-400"
      >
        Email
      </label>
      <div className="relative flex items-center">
        <Mail className="absolute left-3 h-4 w-4 text-slate-500" />
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-cyan-500/30 bg-[#0a0d14] py-2 pl-9 pr-4 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex h-9 items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-[#0a0d14] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Send reset link"
        )}
      </button>
    </form>
  );
}
