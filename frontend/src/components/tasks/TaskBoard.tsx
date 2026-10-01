import Column from "../projects/Column";
import type { Task } from "../../types/Task";

interface TaskBoardProps {
  tasks: Task[];
  readOnly?: boolean;
}

/**
 * TaskBoard component renders a Kanban-style layout divided into status columns.
 * Displays real-time task counts for each board column.
 */
export default function TaskBoard({ tasks, readOnly = false }: TaskBoardProps) {
  // Filter tasks into respective status groups
  const backlogTasks = tasks.filter((t) => t.status === "BACKLOG");
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const testingTasks = tasks.filter((t) => t.status === "TESTING");
  const doneTasks = tasks.filter((t) => t.status === "COMPILED");

  return (
    <div className="flex w-max min-w-full gap-4 pb-4 min-h-0 select-none">
      <Column
        title={`BACKLOG`}
        tasks={backlogTasks}
        status="BACKLOG"
        readOnly={readOnly}
      />
      <Column
        title={`TO DO`}
        tasks={todoTasks}
        status="TODO"
        readOnly={readOnly}
      />
      <Column
        title={`IN PROGRESS`}
        tasks={inProgressTasks}
        status="IN_PROGRESS"
        readOnly={readOnly}
      />
      <Column
        title={`TESTING`}
        tasks={testingTasks}
        status="TESTING"
        readOnly={readOnly}
      />
      <Column
        title={`DONE`}
        tasks={doneTasks}
        status="COMPILED"
        readOnly={readOnly}
      />
    </div>
  );
}
