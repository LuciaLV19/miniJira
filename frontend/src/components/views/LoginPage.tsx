import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import ForgotPasswordForm from "../auth/ForgotPasswordForm";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen w-full bg-[#0a0d14] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md bg-[#111622]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white font-mono uppercase">
            {mode === "forgot"
              ? "PASSWORD_RECOVERY"
              : isLogin
                ? "SYSTEM_ACCESS"
                : "NEW_OPERATIVE"}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {mode === "forgot"
              ? "Recover access to your account"
              : isLogin
                ? "Enter your network credentials"
                : "Create a new identity in the system"}
          </p>
        </div>

        {/* Dynamic Component Rendering */}
        {mode === "forgot" ? (
          <ForgotPasswordForm />
        ) : isLogin ? (
          <LoginForm />
        ) : (
          <RegisterForm />
        )}

        {/* Toggle Form Switch */}
        <div className="mt-6 text-center">
          {isLogin && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="mb-3 block w-full text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Forgot your password?
            </button>
          )}
          {mode !== "forgot" && (
            <button
              type="button"
              onClick={() =>
                setMode(mode === "register" ? "login" : "register")
              }
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : "Already registered? Access system"}
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-3 text-xs font-mono text-slate-400 hover:text-cyan-400 underline underline-offset-4"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
