import { useState } from "react";
import { isAxiosError } from "axios";
import {
  ArrowRight,
  Check,
  CircleAlert,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { acceptProjectInvitationApi } from "../../services/projectService";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const invitedEmail = searchParams.get("email")?.trim().toLowerCase();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const returnTo = `${location.pathname}${location.search}`;
  const accountEmail = user?.email?.trim().toLowerCase();

  const handleAccept = async () => {
    if (!projectId) return;

    setSubmitting(true);
    setError(null);
    try {
      await acceptProjectInvitationApi(projectId);
      setAccepted(true);
      void fetchProjects();
    } catch (requestError: unknown) {
      setError(
        isAxiosError(requestError)
          ? requestError.response?.data?.message ||
              "No se pudo aceptar la invitación."
          : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchAccount = () => {
    logout();
    navigate("/login", { state: { from: returnTo } });
  };

  const pageShell = (content: React.ReactNode) => (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0d14] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.12),transparent_55%),linear-gradient(135deg,transparent_48%,rgba(255,255,255,0.025)_49%,transparent_50%)]" />
      <div className="relative w-full max-w-lg border border-cyan-500/25 bg-[#101722]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            MiniJira <span className="text-slate-500">/ Workspace</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Project access
          </span>
        </div>
        <div className="px-6 py-8 sm:px-9 sm:py-10">{content}</div>
      </div>
    </main>
  );

  if (!projectId || !invitedEmail) {
    return pageShell(
      <div className="text-center">
        <CircleAlert className="mx-auto mb-4 h-10 w-10 text-amber-400" />
        <h1 className="font-mono text-xl font-bold uppercase text-white">
          Enlace no válido
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          El enlace no contiene los datos necesarios para identificar la
          invitación.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-400 px-5 font-mono text-xs font-bold uppercase text-slate-950 transition hover:bg-cyan-300"
        >
          Ir a MiniJira <ArrowRight className="h-4 w-4" />
        </Link>
      </div>,
    );
  }

  if (!token) {
    return pageShell(
      <div>
        <div className="mb-7 flex h-12 w-12 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
          <Mail className="h-6 w-6" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
          Invitation received
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold uppercase text-white">
          Te han invitado a un proyecto
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Inicia sesión con esta cuenta para revisar y aceptar la invitación.
        </p>
        <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4 text-sm text-slate-200">
          <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
          <span className="break-all">{invitedEmail}</span>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            to="/login"
            state={{ from: returnTo }}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-400 px-4 font-mono text-xs font-bold uppercase text-slate-950 transition hover:bg-cyan-300"
          >
            Iniciar sesión <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/register"
            state={{ from: returnTo }}
            className="inline-flex min-h-11 items-center justify-center border border-white/15 px-4 font-mono text-xs font-bold uppercase text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-200"
          >
            Crear cuenta
          </Link>
        </div>
      </div>,
    );
  }

  if (accountEmail !== invitedEmail) {
    return pageShell(
      <div>
        <div className="mb-7 flex h-12 w-12 items-center justify-center border border-amber-400/30 bg-amber-400/10 text-amber-300">
          <CircleAlert className="h-6 w-6" />
        </div>
        <h1 className="font-mono text-2xl font-bold uppercase text-white">
          Cambia de cuenta
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Esta invitación se envió a{" "}
          <span className="text-slate-200">{invitedEmail}</span>, pero has
          iniciado sesión como{" "}
          <span className="text-slate-200">
            {accountEmail || "otra cuenta"}
          </span>
          .
        </p>
        <button
          type="button"
          onClick={handleSwitchAccount}
          className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-cyan-400 px-5 font-mono text-xs font-bold uppercase text-slate-950 transition hover:bg-cyan-300"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión y continuar
        </button>
      </div>,
    );
  }

  if (accepted) {
    return pageShell(
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
          <Check className="h-7 w-7" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
          Access granted
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold uppercase text-white">
          Ya formas parte del proyecto
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          La invitación se aceptó correctamente. Ya puedes colaborar con tu
          equipo.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/project/${projectId}`)}
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 bg-emerald-400 px-5 font-mono text-xs font-bold uppercase text-slate-950 transition hover:bg-emerald-300"
        >
          Abrir proyecto <ArrowRight className="h-4 w-4" />
        </button>
      </div>,
    );
  }

  return pageShell(
    <div>
      <div className="mb-7 flex h-12 w-12 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
        <UsersRound className="h-6 w-6" />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
        Pending invitation
      </p>
      <h1 className="mt-2 font-mono text-2xl font-bold uppercase text-white">
        Únete al equipo
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        Confirma que quieres unirte al proyecto. Al aceptar, tendrás acceso a
        sus tareas y miembros.
      </p>
      <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4 text-sm text-slate-200">
        <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-300" />
        <span className="break-all">Invitación para {invitedEmail}</span>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-5 border border-red-400/25 bg-red-400/5 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleAccept}
        disabled={submitting}
        className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-cyan-400 px-5 font-mono text-xs font-bold uppercase text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" /> Aceptando
            invitación
          </>
        ) : (
          <>
            Aceptar invitación <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>,
  );
}
