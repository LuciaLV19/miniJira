import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordApi } from "../../services/authService";

export default function ResetPasswordForm() {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-cyan-500/30 bg-[#0a0d14] p-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        />
      </label>
      <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
        Confirm password
        <input
          required
          minLength={8}
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-cyan-500/30 bg-[#0a0d14] p-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        />
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
