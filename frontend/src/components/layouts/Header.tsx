import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-[0_1px_10px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo y Nombre del Terminal */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            <div className="w-8 h-8 rounded border border-neon-cyan/40 bg-neon-cyan/5 flex items-center justify-center font-mono text-sm font-black text-neon-cyan transition-all duration-300 group-hover:border-neon-cyan group-hover:shadow-[0_0_10px_rgba(6,182,212,0.6)] group-hover:bg-neon-cyan/10">
              ⎔
            </div>

            <div className="flex flex-col">
              <span className="text-[14px] font-mono font-black text-neon-cyan tracking-widest uppercase transition-all duration-300 group-hover:text-white">
                KRONOS_OS
              </span>
              <span className="text-[8px] font-mono text-neon-cyan/40 tracking-wider -mt-0.5">
                SYS_STATUS: CORE_ONLINE
              </span>
            </div>
          </Link>

          {/* Network Module of the Terminal */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-neon-cyan/60 bg-neon-cyan/5 border border-neon-cyan/20 px-2.5 py-1 rounded shadow-[inset_0_0_4px_rgba(6,182,212,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
            <span className="tracking-widest">NODE_01 // SECURE_LINK</span>
          </div>

          {/* MÓDULO DE USUARIO (Acceso al perfil mediante icono) */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* ICONO DE PERFIL (Redirige a /profile) */}
                <Link
                  to="/user"
                  title="Acceder al Perfil de Usuario"
                  className="group relative flex items-center justify-center w-7 h-7 rounded border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                  {/* Icono de usuario SVG estilo ciberpunk */}
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>

                  {/* Indicador de estado en línea */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded border border-neon-cyan/50 text-neon-cyan font-mono text-xs hover:bg-neon-cyan/20 transition-all duration-200"
              >
                [ LOGIN ]
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
