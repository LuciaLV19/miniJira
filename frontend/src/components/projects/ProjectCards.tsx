import swal from "sweetalert2";
import { useProjectStore } from "../../store/useProjectStore";
import type { Project } from "../../types/Project";

export default function ProjectCards({ project }: { project: Project }) {
  // Zustand Store Actions & State
  const favoriteProject = useProjectStore(
    (state) => state.toggleFavoriteProject,
  );
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const editProject = useProjectStore((state) => state.editProject);
  const setActiveProjectId = useProjectStore(
    (state) => state.setActiveProjectId,
  );
  const projectId = project.id;
  const projectTasks = project.tasks;
  const isActive =
    projectId === useProjectStore((state) => state.activeProjectId);

  // Task filtering and completion metrics calculation
  const doneTasks = projectTasks.filter((t) => t.status === "compiled").length;
  const progressBar =
    projectTasks.length > 0
      ? Math.floor((doneTasks / projectTasks.length) * 100)
      : 0;
  const isFinished =
    projectTasks.length > 0 && doneTasks === projectTasks.length;

  /**
   * Prompts user with a customized SweetAlert2 dialog to confirm project deletion.
   */
  const handleAbortProject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await swal.fire({
      title: "VERIFYING_CREDENTIALS",
      text: ` Are you sure you want to purge the project [${project.name}]?`,
      showCancelButton: true,
      confirmButtonText: "YES, DELETE",
      cancelButtonText: "CANCEL",
      buttonsStyling: false,
      customClass: {
        popup:
          "!bg-black !border !border-neon-magenta !text-white !font-mono !rounded",
        title:
          "!uppercase !text-sm !font-black !text-neon-magenta !border-b !border-neon-magenta/20 !pb-2",
        htmlContainer: "!text-white/80 !font-mono text-xs pt-4",
        confirmButton:
          "!bg-neon-magenta !text-black !px-4 !py-2 !mx-2 !cursor-pointer",
        cancelButton:
          "!bg-gray-800 !text-white !px-4 !py-2 !mx-2 !cursor-pointer",
      },
    });
    if (result.isConfirmed && projectId) {
      deleteProject(projectId);
    }
  };

  return (
    <div
      onClick={() => {
        if (projectId) setActiveProjectId(projectId);
      }}
      className={`p-4 border font-mono cursor-pointer transition-all duration-300 rounded relative overflow-hidden group ${
        isActive
          ? "bg-neon-cyan/10 border-neon-cyan shadow-[0_0_12px_rgba(6,182,212,0.2)] text-white"
          : "bg-black border-neon-cyan/20 text-neon-cyan/60 hover:border-neon-cyan/50 hover:text-neon-cyan"
      } ${
        isFinished
          ? "border-neon-green/30 bg-neon-green/5"
          : "border-neon-cyan/20 bg-cyber-bg/40 hover:border-neon-cyan/70 hover:shadow-neon-cyan"
      }`}
    >
      {/* Reactive side accent bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${
          project.isFavorite
            ? "bg-neon-magenta shadow-[0_0_8px_#ff007f]"
            : "bg-neon-cyan/30 group-hover:bg-neon-cyan"
        }`}
      />
      <div className="pl-2 flex flex-col gap-1.5">
        {/* Top Row: Project Name and Favorite Toggle */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs font-bold tracking-wide truncate max-w-40font-mono text-white group-hover:text-neon-cyan transition-colors">
            {project.name}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (projectId) favoriteProject(projectId);
            }}
            className={`text-xs cursor-pointer transition-all duration-200 hover:scale-125 ${
              project.isFavorite
                ? "text-neon-magenta drop-shadow-text-magenta"
                : "text-white/20 hover:text-neon-magenta"
            }`}
          >
            {project.isFavorite ? "★" : "☆"}
          </button>
        </div>

        {/* Project Metadata: Key and Creation Date */}
        <div className="flex items-center gap-2">
          {project.key ? (
            <span className="bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 border border-neon-cyan/30 rounded text-[9px] font-bold font-mono">
              {project.key}
            </span>
          ) : (
            <span className="text-white/20 italic text-[9px] font-mono">
              [NO_KEY]
            </span>
          )}
          <span className="text-[10px] text-white/40 font-sans line-clamp-1">
            {project.createdAt}
          </span>
        </div>

        {/* Dynamic Task Progress Bar and Counter */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-cyber-bg h-1 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-500 ${
                isFinished ? "bg-neon-green" : "bg-neon-cyan"
              }`}
              style={{ width: `${progressBar}%` }}
            />
          </div>
          <span
            className={`text-[9px] font-mono shrink-0 ${
              isFinished ? "text-neon-green" : "text-white/40"
            }`}
          >
            {doneTasks}/{projectTasks.length}
          </span>
        </div>

        {/* Action Controls: Hover-revealed edit and delete options */}
        <div className="flex justify-end gap-3 mt-2 pt-1 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              editProject(project);
            }}
            className="text-[9px] font-mono text-neon-cyan/60 hover:text-neon-cyan cursor-pointer uppercase tracking-tighter"
          >
            [edit]
          </button>
          <button
            onClick={(e) => {
              handleAbortProject(e);
            }}
            className="text-[9px] font-mono text-neon-magenta/60 hover:text-neon-magenta cursor-pointer uppercase tracking-tighter"
          >
            [abort]
          </button>
        </div>
      </div>
    </div>
  );
}
