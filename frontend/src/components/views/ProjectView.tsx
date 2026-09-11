import { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import CreateTaskModal from "../tasks/CreateTaskModal";
import TaskBoard from "../tasks/TaskBoard";

/**
 * ProjectView component serves as the primary view for displaying selected project details,
 * task management board, and initiating task creation/editing.
 */
function ProjectView() {
  const {
    activeProjectId,
    projects,
    openTaskModal,
    taskToEdit,
    isOpenModalTask,
  } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");

  const projectSelected = projects.find((p) => p.id === activeProjectId);

  // Fallback empty state when no active project is selected
  if (!projectSelected) {
    return (
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-cyber-bg/10 flex flex-col min-w-0">
        {/* Operations Panel Standby Header */}
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded m-4 bg-cyber-card/10">
          <div className="text-center max-w-sm px-4">
            <p className="text-neon-cyan/40 text-xs uppercase tracking-widest mb-2 font-bold animate-pulse">
              [ SYSTEM_STANDBY ]
            </p>
            <p className="text-white/30 text-sm italic font-sans">
              Select a contract from the left panel to synchronize network
              sub-nodes and manage operational tasks.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalTasksCount = projectSelected.tasks?.length || 0;
  const filteredTasks =
    projectSelected.tasks?.filter((task) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      return [
        task.title,
        task.description,
        task.category,
        task.priority,
        task.status,
        task.assignee?.name,
      ]
        .filter(Boolean)
        .some((value) => value?.toString().toLowerCase().includes(query));
    }) || [];

  return (
    <>
      {/* Create/Edit Task Modal */}
      {isOpenModalTask && (
        <CreateTaskModal key={taskToEdit?.id || "new-task"} />
      )}

      <main className="flex-1 h-full overflow-y-auto bg-black border-l border-neon-cyan/10 p-4 md:p-6 font-mono text-white min-w-0 w-full">
        {/* Project Header */}
        <div className="max-w-7xl mx-auto space-y-6 border-b border-neon-cyan/20 pb-6 min-w-0">
          <header className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-[#0d111a] border border-cyan-500/20 rounded-xl min-w-0">
            {/* Column 1: Project Title */}
            <div className="flex flex-col items-start min-w-0 w-full overflow-hidden">
              {/* 1. ACTIVE_CONTRACT CORREGIDO */}
              <span className="text-[10px] text-neon-cyan/50 uppercase truncate w-full whitespace-nowrap block">
                // ACTIVE_CONTRACT
              </span>
              <h1 className="text-2xl font-black text-neon-cyan uppercase tracking-wider truncate w-full">
                {projectSelected.name}
              </h1>
            </div>

            {/* Column 2: Search Input */}
            <div className="w-full min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full bg-black/50 border border-neon-cyan/20 rounded px-3 py-2 text-xs text-neon-cyan placeholder:text-neon-cyan/40 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            {/* Column 3: Total Tasks and New Task Button */}
            <div className="flex flex-col items-end gap-2 min-w-0 w-full overflow-hidden">
              {/* 2. TOTAL TASKS CORREGIDO */}
              <span className="text-[10px] text-neon-cyan/60 bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded font-bold whitespace-nowrap truncate max-w-full">
                TOTAL TASKS: [{totalTasksCount}]
              </span>

              {/* 3. NEW_TASK BUTTON CORREGIDO */}
              <button
                onClick={openTaskModal}
                className="text-[9px] font-mono text-neon-magenta/60 hover:text-neon-magenta cursor-pointer uppercase transition-colors whitespace-nowrap truncate max-w-full"
              >
                [ NEW_TASK ]
              </button>
            </div>
          </header>

          <p className="text-xs text-neon-cyan/70 mt-2 bg-neon-cyan/5 border border-neon-cyan/10 p-3 rounded break-words">
            {projectSelected.description ||
              "No mission specifications recorded."}
          </p>
        </div>

        {/* Search empty state */}
        {filteredTasks.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center p-8 border border-neon-cyan/20 bg-black/40 rounded text-center my-6">
            <p className="text-neon-cyan/60 font-mono text-xs uppercase tracking-widest flex flex-wrap justify-center items-center gap-1">
              <span>[ SYSTEM_LOG: NO_MATCHES_FOUND_FOR "</span>
              <span className="truncate max-w-xs inline-block text-neon-cyan font-bold">
                {searchQuery.toUpperCase()}
              </span>
              <span>" ]</span>
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-[10px] text-neon-magenta hover:underline font-mono uppercase cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Task Board Column View */}
        <div className="w-full overflow-x-auto pt-6">
          <TaskBoard tasks={filteredTasks} />
        </div>
      </main>
    </>
  );
}

export default ProjectView;
