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
      <main className="flex-1 p-6 overflow-y-auto bg-cyber-bg/10 flex flex-col">
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

      <main className="flex-1 bg-black border-l border-neon-cyan/10 p-6 font-mono text-white overflow-y-auto overflow-hidden h-full min-w-0">
        {/* Project Header */}
        <div className="border-b border-neon-cyan/20 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neon-cyan/50 tracking-widest uppercase">
              // ACTIVE_CONTRACT
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-3 mt-1">
            <h1 className="text-2xl font-black text-neon-cyan uppercase tracking-wider">
              {projectSelected.name}
            </h1>

            <div className="flex-1 min-w-40 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full bg-black/50 border border-neon-cyan/20 rounded px-3 py-2 text-xs text-neon-cyan placeholder:text-neon-cyan/40 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="flex flex-col items-center gap-3 ml-auto">
              <span className="text-[10px] text-neon-cyan/60 bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded font-bold">
                TOTAL TASKS: [{totalTasksCount}]
              </span>
              <button
                onClick={openTaskModal}
                className="text-[9px] font-mono text-neon-magenta/60 hover:text-neon-magenta cursor-pointer uppercase tracking-tighter transition-colors"
              >
                [ NEW_TASK ]
              </button>
            </div>
          </div>

          <p className="text-xs text-neon-cyan/70 mt-2 bg-neon-cyan/5 border border-neon-cyan/10 p-3 rounded">
            {projectSelected.description ||
              "No mission specifications recorded."}
          </p>
        </div>

        {filteredTasks.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center p-8 border border-neon-cyan/20 bg-black/40 rounded text-center my-6">
            <p className="text-neon-cyan/60 font-mono text-xs uppercase tracking-widest">
              [ SYSTEM_LOG: NO_MATCHES_FOUND_FOR_"
              <span className="truncate max-w-md inline-block align-bottom">
                {searchQuery.toUpperCase()}
              </span>
              " ]
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-[10px] text-neon-magenta hover:underline font-mono uppercase"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Task Board Column View */}
        <div>
          <TaskBoard tasks={filteredTasks} />
        </div>
      </main>
    </>
  );
}

export default ProjectView;
