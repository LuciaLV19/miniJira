import { useState, useRef, useEffect } from "react";
import type { Task, Priority } from "../../types/Task";
import { useProjectStore } from "../../store/useProjectStore";
import { useSettingsStore } from "../../store/useSettingsStore"; // Ajusta la ruta a tu store

/**
 * TaskCard component renders an individual task item within a Kanban column.
 * Displays key details including priority, assignee, category, due dates, and comment counts.
 */
export default function TaskCard({ task }: { task: Task }) {
  // Zustand store state selectors
  const deleteTask = useProjectStore((state) => state.deleteTask);
  const editTask = useProjectStore((state) => state.editTask);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const taskId = task.id || task._id;
  const { compactKanban } = useSettingsStore();

  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamic styling based on task priority level
  const priorityColors: Record<Priority, string> = {
    URGENT: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    HIGH: "bg-red-500/10 text-red-400 border-red-500/30",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    LOW: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  };

  /**
   * Formats string dates into concise, readable representations.
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Prepares drag-and-drop payload with task ID.
   */
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
  ) => {
    e.dataTransfer.setData("text/plain", taskId);
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  const handleEditTask = () => {
    setIsMenuOpen(false);
    editTask({
      id: taskId || "",
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      commentsCount: task.commentsCount,
      dueDate: task.dueDate,
      category: task.category,
      assignee: task.assignee,
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      draggable={true}
      onDragStart={(e) => handleDragStart(e, taskId || "")}
      onDragEnd={() => setIsDragging(false)}
      className={`group bg-black p-3 rounded border border-white/10 hover:border-neon-cyan/30 transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between min-h-35 font-mono shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
        isDragging ? "opacity-20" : ""
      } ${compactKanban ? "p-2 space-y-1 text-xs" : "p-4 space-y-3 text-sm"} `}
    >
      {/* 1. Header: Category Tag & Priority Badge */}
      <div>
        <div className="relative flex items-center justify-between gap-2 mb-2">
          <span
            className="text-[9px] font-bold tracking-widest text-white/40 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase truncate max-w-35"
            title={task.category || "General"}
          >
            // {task.category || "General"}
          </span>
          <div ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group-hover:text-neon-cyan transition-colors cursor-pointer font-bold text-sm border border-white/10 px-1 rounded leading-none"
            >
              <span className="-translate-y-0.75 inline-block font-bold">
                …
              </span>
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 flex flex-col gap-2 z-10 bg-black/95 border border-white/10 rounded p-1 items-start">
                <button
                  onClick={() => {
                    handleEditTask();
                  }}
                  className="hover:text-neon-cyan transition-colors cursor-pointer font-bold text-[10px] rounded leading-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (activeProjectId && taskId) {
                      deleteTask(activeProjectId, taskId);
                    }
                  }}
                  className="hover:text-neon-cyan transition-colors cursor-pointer font-bold text-[10px] rounded leading-none"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-1 min-h-10">
          <div className="flex flex-col items-start">
            {/* 2. Content: Title & Brief Description */}
            <h4 className="text-xs font-bold text-white/90 line-clamp-1 group-hover:text-neon-cyan transition-colors mb-1 leading-snug uppercase">
              {task.title}
            </h4>

            {task.description && (
              <p className="text-[8px] text-white/50 line-clamp-2 leading-relaxed mb-2 font-sans italic">
                {task.description.length > 30
                  ? `${task.description.slice(0, 30).trim()}...`
                  : task.description}
              </p>
            )}
          </div>
          <div className="flex items-end gap-2">
            <span
              className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Metadata: Dates, Metrics & Assignee */}
      <div>
        {/* Visual divider line */}
        <div className="w-full border-t border-dashed border-white/10 mb-2" />

        <div className="flex items-center justify-between text-white/40 text-[10px]">
          {/* Left section: Due Date & Comments Counter */}
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div
                className="flex items-center gap-1 text-[9px] font-medium text-white/70 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded"
                title="Due date"
              >
                <span>DUE: {formatDate(task.dueDate)?.toUpperCase()}</span>
              </div>
            )}

            {/* Strict comments counter */}
            {task.commentsCount > 0 && (
              <div
                className="flex items-center gap-1 text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 px-1.5 py-0.5 rounded text-[9px]"
                title={`${task.commentsCount} comments`}
              >
                <span>COMMS:</span>
                <span className="font-black">[{task.commentsCount}]</span>
              </div>
            )}
          </div>

          {/* Right section: Shortened ID & Assignee Initials */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[8px] text-white/20 tracking-tighter"
              title="Unique node ID"
            >
              #{(task.id || task._id)?.slice(0, 4).toUpperCase()}
            </span>

            {task.assignee ? (
              <div
                className="h-5 w-5 rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan flex items-center justify-center text-[9px] font-black shadow-sm"
                title={task.assignee.username}
              ></div>
            ) : (
              <div
                className="h-5 w-5 rounded border border-white/10 border-dashed flex items-center justify-center text-[9px] font-medium text-white/20"
                title="Unassigned"
              >
                N/A
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
