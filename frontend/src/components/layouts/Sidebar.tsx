import { useProjectStore } from "../../store/useProjectStore";
import ProjectList from "../projects/ProjectList";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  // Sidebar state for management
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    return savedWidth ? parseInt(savedWidth) : 256;
  });
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
  });

  // Sidebar state for resizing
  const isResizing = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Project Store and modal state
  const projects = useProjectStore((state) => state.projects);
  const openModal = useProjectStore((state) => state.openProjectModal);

  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");

  // UseEffect to handle mouse events for resizing the sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = e.clientX;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 450) newWidth = 450;

      setSidebarWidth(newWidth);
      localStorage.setItem("sidebarWidth", newWidth.toString());
    };

    // Function to handle mouse up event and stop resizing
    const handleMouseUp = () => {
      isResizing.current = false;
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Function to start resizing the sidebar
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    setIsDragging(true);
    document.body.style.cursor = "ew-resize";
  };

  return (
    <div
      style={{ width: isCollapsed ? 0 : sidebarWidth }}
      className={`h-full relative shrink-0 select-none z-0 ${
        !isDragging ? "transition-[width] duration-300 ease-in-out" : ""
      }`}
    >
      {/* Sidebar content */}
      <aside
        style={{
          width: sidebarWidth,
          transform: isCollapsed
            ? `translateX(-${sidebarWidth}px)`
            : "translateX(0)",
        }}
        className="w-full border-r border-neon-cyan/20 bg-cyber-card/40 p-4 flex flex-col justify-between h-full absolute top-0 left-0 z-0 transition-transform duration-300 ease-in-out"
      >
        <div className="flex flex-col gap-4 overflow-y-auto h-full min-w-37.5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neon-magenta/30 pb-2">
            <h2 className="text-neon-magenta text-xs tracking-widest uppercase font-bold drop-shadow-text-magenta">
              // ACTIVE_PROJECTS
            </h2>
            <span className="text-xs bg-neon-magenta/10 text-neon-magenta px-2 py-0.5 border border-neon-magenta/20 rounded font-mono">
              {projects.length}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative m-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-[10px] text-neon-magenta/70 font-mono">
                ⌕
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects"
              className="w-full rounded border border-neon-magenta/30 bg-black/70 py-2 pl-8 pr-3 text-[11px] text-neon-magenta placeholder:text-neon-magenta/50 shadow-[0_0_0_1px_rgba(236,72,153,0.08)] outline-none transition-all duration-300 focus:border-neon-magenta focus:ring-2 focus:ring-neon-magenta/30 focus:shadow-[0_0_12px_rgba(236,72,153,0.18)]"
            />
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto pr-3">
            <ProjectList searchQuery={searchQuery} />
          </div>
        </div>

        {/* New Project Button */}
        <div className="min-w-37.5">
          <button
            onClick={() => openModal()}
            className="w-full mt-4 py-2.5 px-4 bg-transparent border border-neon-cyan text-neon-cyan shadow-none hover:shadow-neon-cyan hover:bg-neon-cyan/5 transition-all duration-300 rounded font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-[0.98]"
          >
            + START_PROJECT
          </button>
        </div>
      </aside>

      {/* DRAG STRIP */}
      <div
        onMouseDown={startResizing}
        style={{ left: isCollapsed ? 0 : sidebarWidth - 3 }}
        className={`absolute top-0 w-1.5 h-full cursor-ew-resize bg-transparent hover:bg-neon-magenta/40 z-20 group flex items-center justify-center ${
          !isDragging ? "transition-[left] duration-300 ease-in-out" : ""
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            localStorage.setItem(
              "sidebarCollapsed",
              JSON.stringify(newCollapsed),
            );
          }}
          className="absolute w-4 h-8 bg-[#000000]! opacity-100 border border-neon-magenta/30 text-neon-magenta/70 text-[8px] font-mono flex items-center justify-center rounded transition-all duration-200 group-hover: cursor-pointer hover:border-neon-magenta hover:text-neon-magenta hover:shadow-[0_0_12px_rgba(236,72,153,0.5)] z-30"
          style={{
            transform: isCollapsed ? "translateX(3px)" : "translateX(1px)",
          }}
          title={isCollapsed ? "Deploy" : "Collapse"}
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>
    </div>
  );
}
