export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-neon-cyan/30 shadow-[0_1px_10px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Name of the Terminal */}
          <div className="flex items-center gap-3 select-none group">
            {/* DIGITAL LOGO */}
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
          </div>

          {/* Network Module of the Terminal */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-neon-cyan/60 bg-neon-cyan/5 border border-neon-cyan/20 px-2.5 py-1 rounded shadow-[inset_0_0_4px_rgba(6,182,212,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
            <span className="tracking-widest">NODE_01 // SECURE_LINK</span>
          </div>
        </div>
      </div>
    </header>
  );
}
