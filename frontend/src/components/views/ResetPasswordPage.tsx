import { ShieldAlert } from "lucide-react";
import ResetPasswordForm from "../auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0d14] p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#111622]/80 p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="mb-8 text-center">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
          <h1 className="font-mono text-2xl font-bold tracking-wider text-white">
            SET_NEW_PASSWORD
          </h1>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
