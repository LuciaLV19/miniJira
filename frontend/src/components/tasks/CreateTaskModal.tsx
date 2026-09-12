import { useState, useEffect } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import type { Priority } from "../../types/Task";
import { useParams } from "react-router-dom";
import { getProjectMembersApi } from "../../services/projectService";

/**
 * Modal component responsible for creating new tasks or editing existing ones
 * within the active project workspace.
 */
export default function CreateTaskModal() {
  // Zustand store state actions and selectors
  const closeModal = useProjectStore((state) => state.closeTaskModal);
  const addTask = useProjectStore((state) => state.createTask);
  const updateTask = useProjectStore((state) => state.updateTask);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const taskToEdit = useProjectStore((state) => state.taskToEdit);
  const isEditMode = !!taskToEdit;
  const isOpen = useProjectStore((state) => state.isOpenModalTask);
  const { projectId } = useParams<{ projectId: string }>();
  const taskId = taskToEdit?.id || taskToEdit?._id;

  // Mocked list of available team members for task assignment
  const [members, setMembers] = useState<
    { _id: string; username: string; email: string }[]
  >([]);

  // Local state initialized with task data if in edit mode, or default empty values
  const [error, setError] = useState("");
  const [taskName, setTaskName] = useState(taskToEdit?.title ?? "");
  const [taskDescription, setTaskDescription] = useState(
    taskToEdit?.description ?? "",
  );
  const [taskPriority, setTaskPriority] = useState<Priority>(
    taskToEdit?.priority ?? "LOW",
  );
  const [taskCategory, setTaskCategory] = useState(taskToEdit?.category ?? "");
  const [taskDueDate, setTaskDueDate] = useState(taskToEdit?.dueDate ?? "");
  const [taskAssignee, setTaskAssignee] = useState(taskToEdit?.assignee);

  useEffect(() => {
    const fetchMembers = async () => {
      if (projectId || isOpen) {
        try {
          const memberData = await getProjectMembersApi(
            projectId || activeProjectId!,
          );
          setMembers(memberData);
        } catch (err) {
          console.error("Error fetching project members:", err);
        }
      }
    };

    fetchMembers();
  }, [projectId, isOpen, activeProjectId]);

  /**
   * Handles form validation, task creation or update dispatch, and modal dismissal.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskNameTrimmed = taskName.trim();
    const taskDescriptionTrimmed = taskDescription.trim();

    // Validation check
    if (!taskNameTrimmed) return setError("Task name is required");
    setError("");

    if (isEditMode) {
      if ((!projectId && !activeProjectId) || !taskId) {
        setError("Unable to resolve the current task or project ID.");
        return;
      }

      // Update existing task
      updateTask(projectId || activeProjectId!, taskId, {
        title: taskNameTrimmed,
        description: taskDescriptionTrimmed,
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate,
        assignee: taskAssignee,
      });
    } else {
      if (!projectId && !activeProjectId) {
        setError("No active project selected.");
        return;
      }

      // Create new task
      addTask(projectId || activeProjectId!, {
        title: taskNameTrimmed,
        description: taskDescriptionTrimmed,
        status: "BACKLOG",
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate,
        assignee: taskAssignee,
      });
    }
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-black border border-neon-cyan/40 p-6 rounded shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-95 max-w-md w-full font-mono text-xs relative overflow-hidden">
        <h2 className="text-sm font-black text-neon-cyan tracking-widest uppercase mb-4">
          {isEditMode ? "Edit Task" : "New Task"}
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Task Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
            >
              Task Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white placeholder:text-neon-magenta/30 focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          {/* Task Description Textarea */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
            >
              Task Description
            </label>
            <textarea
              id="description"
              className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white placeholder:text-neon-magenta/30 focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200 resize-none"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>

          {/* Grid section for Priority, Assignee, Category, Due Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="priority"
                className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
              >
                Task Priority
              </label>
              <select
                id="priority"
                className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as Priority)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>

              <label
                htmlFor="assignee"
                className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
              >
                Task Assignee
              </label>
              <select
                id="assignee"
                className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200"
                value={taskAssignee?.id || taskAssignee?._id || ""}
                onChange={(e) => {
                  const selectedMember = members.find(
                    (member) => member._id === e.target.value,
                  );
                  setTaskAssignee(selectedMember);
                }}
              >
                <option value="">Select Assignee</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
              >
                Task Category
              </label>
              <input
                type="text"
                id="category"
                className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white placeholder:text-neon-magenta/30 focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
              />

              <label
                htmlFor="dueDate"
                className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70 font-bold"
              >
                Task Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full bg-black border border-neon-magenta/60 p-2 rounded text-white focus:outline-none focus:border-neon-magenta focus:shadow-[0_0_8px_rgba(236,72,153,0.25)] transition-all duration-200"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Controls & Error Display */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-red-500">{error}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="py-2 px-4 bg-transparent border border-neon-cyan/40 text-neon-cyan/60 hover:text-neon-cyan hover:border-neon-cyan transition-all duration-200 rounded uppercase tracking-wider text-[10px] cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:bg-neon-cyan hover:text-black transition-all duration-300 rounded font-black uppercase tracking-widest text-[10px] cursor-pointer active:scale-[0.97]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
