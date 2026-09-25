import { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import CreateTaskModal from "../tasks/CreateTaskModal";
import TaskBoard from "../tasks/TaskBoard";
import { ListPlus, UsersRound } from "lucide-react";
import { InviteModal } from "../projects/InviteModal";

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
    fetchProjects,
  } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
  const activeMembers = (projectSelected.members || [])
    .filter(Boolean)
    .map((member) => ({
      id: member._id || member.id || "",
      email: member.email || "",
      username: member.username || "Unknown user",
    }))
    .filter((member) => member.email || member.username);
  const pendingInvitations = projectSelected.pendingInvitations || [];
  const invitedEmails = [
    ...activeMembers.map((member) => member.email.toLowerCase()),
    ...pendingInvitations.map((invitation) => invitation.email.toLowerCase()),
  ].filter(Boolean);
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
        task.assignee?.username,
      ]
        .filter(Boolean)
        .some((value) => value?.toString().toLowerCase().includes(query));
    }) || [];

  {
    return (
      <>
        {/* Invite Member Modal */}
        {isInviteModalOpen && projectSelected?.id && (
          <InviteModal
            projectId={projectSelected.id}
            onClose={() => setIsInviteModalOpen(false)}
            isOpen={isInviteModalOpen}
            existingEmails={invitedEmails}
            onMemberAdded={() => fetchProjects()}
          />
        )}
        {/* Create/Edit Task Modal */}
        {isOpenModalTask && (
          <CreateTaskModal key={taskToEdit?.id || "new-task"} />
        )}

        <main className="flex-1 h-full overflow-y-auto bg-black border-l border-neon-cyan/10 p-4 md:p-6 font-mono text-white min-w-0 w-full">
          {/* Project Header */}
          <div className="max-w-7xl mx-auto space-y-6 border-b border-neon-cyan/20 pb-6 min-w-0">
            <header className="grid grid-cols-1 gap-4 items-center p-4 bg-[#0d111a] border border-cyan-500/20 rounded-xl min-w-0 md:grid-cols-[minmax(170px,1fr)_minmax(130px,280px)_auto]">
              {/* Column 1 (Phone}): Project Title and Task Counter */}
              <div className="flex items-start justify-between min-w-0 gap-2">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="text-[10px] text-neon-cyan/50 uppercase truncate w-full whitespace-nowrap block">
                    // ACTIVE_CONTRACT
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-neon-cyan uppercase wrap-break-word w-full">
                    {projectSelected.name}
                  </h1>
                </div>
              </div>
              {/* Column 2 (Phone}): Search Input */}
              <div className="w-full min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tareas..."
                  className="w-full bg-black/50 border border-neon-cyan/20 rounded px-3 py-2 text-xs text-neon-cyan placeholder:text-neon-cyan/40 focus:outline-none focus:border-neon-cyan"
                />
              </div>
              {/* Project actions */}
              <div
                aria-label="Project actions"
                className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 rounded-lg border border-white/10 bg-black/30 p-1.5 md:w-auto md:flex-nowrap"
              >
                <div className="flex shrink-0 items-center gap-2 px-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    Task control
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-neon-cyan">
                    {totalTasksCount}
                  </span>
                </div>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  aria-label="Invite member"
                  title="Invite member"
                  className="flex shrink-0 items-center gap-1.5 rounded border border-neon-cyan/30 px-2.5 py-1.5 text-[9px] font-mono font-bold uppercase text-neon-cyan/80 transition-colors hover:border-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan cursor-pointer whitespace-nowrap"
                >
                  <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Invite</span>
                </button>

                <button
                  onClick={openTaskModal}
                  aria-label="Create new task"
                  title="Create new task"
                  className="flex shrink-0 items-center gap-1.5 rounded bg-neon-magenta px-2.5 py-1.5 text-[9px] font-mono font-bold uppercase text-black transition-colors hover:bg-neon-magenta/80 cursor-pointer whitespace-nowrap"
                >
                  <ListPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">New task</span>
                </button>
              </div>
            </header>

            <p className="text-xs text-neon-cyan/70 mt-2 bg-neon-cyan/5 border border-neon-cyan/10 p-3 rounded wrap-break">
              {projectSelected.description ||
                "No mission specifications recorded."}
            </p>
          </div>

          <div className="max-w-7xl mx-auto w-full pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-neon-cyan/20 bg-[#0d111a] p-4 shadow-[0_0_18px_rgba(6,182,212,0.08)]">
                <div className="mb-3 flex items-center justify-between border-b border-neon-cyan/10 pb-2">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] text-neon-cyan/70">
                    Members
                  </h2>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] uppercase text-emerald-300">
                    {activeMembers.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {activeMembers.length > 0 ? (
                    activeMembers.map((member) => (
                      <div
                        key={member.id || member.email}
                        className="flex items-center justify-between rounded border border-white/5 bg-black/20 px-3 py-2 transition-colors hover:border-neon-cyan/30"
                      >
                        <div>
                          <p className="text-xs text-white">
                            {member.username}
                          </p>
                          <p className="text-[10px] text-white/50">
                            {member.email}
                          </p>
                        </div>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] uppercase text-emerald-300">
                          Joined
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-white/40">No members yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-[#0d111a] p-4 shadow-[0_0_18px_rgba(245,158,11,0.06)]">
                <div className="mb-3 flex items-center justify-between border-b border-amber-500/10 pb-2">
                  <h2 className="text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
                    Pending invites
                  </h2>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] uppercase text-amber-300">
                    {pendingInvitations.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {pendingInvitations.length > 0 ? (
                    pendingInvitations.map((invitation, index) => (
                      <div
                        key={`${invitation.email}-${index}`}
                        className="flex items-center justify-between rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 transition-colors hover:border-amber-400/40"
                      >
                        <div>
                          <p className="text-xs text-white">
                            {invitation.email}
                          </p>
                          <p className="text-[10px] text-amber-200/80">
                            Awaiting confirmation
                          </p>
                        </div>
                        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] uppercase text-amber-300">
                          Pending
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-white/40">
                      No pending invites.
                    </p>
                  )}
                </div>
              </div>
            </div>
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
          <div className="max-w-7xl mx-auto w-full overflow-x-auto pt-6">
            <TaskBoard tasks={filteredTasks} />
          </div>
        </main>
      </>
    );
  }
}

export default ProjectView;
