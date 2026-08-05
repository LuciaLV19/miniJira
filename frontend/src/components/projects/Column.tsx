import { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import TaskCard from "../tasks/TaskCard";
import type { Status, Task } from "../../types/Task";

export default function Column({
  title,
  tasks,
  status,
}: {
  title: string;
  tasks: Task[];
  status: Status;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const updateColumn = useProjectStore((state) => state.updateColumn);

  // Drag over handler to allow dropping and trigger visual hover state
  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  // Drag leave handler to reset visual hover state
  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  // Drop handler to retrieve task ID and update its column status
  const onDropTask = (
    e: React.DragEvent<HTMLDivElement>,
    newColumn: Status,
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    setIsDraggingOver(false);
    updateColumn(taskId, newColumn);
  };

  return (
    <div
      onDragOver={(e) => dragOver(e)}
      onDragLeave={(e) => dragLeave(e)}
      onDrop={(e) => onDropTask(e, status)}
      className={`flex-1 min-w-50 shrink-0 rounded border border-neon-cyan/10 p-2 bg-cyber-bg/20 font-mono flex flex-col ${isDraggingOver ? "border-neon-cyan/70" : ""}`}
    >
      {/* Column header with total items counter */}
      <div className="flex items-center justify-between mb-4 border-b border-neon-cyan/10 pb-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black text-neon-cyan tracking-wider uppercase">
            {title}
          </h3>
          <span className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[11px] font-bold px-2 py-0.5 rounded text-center">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task list container */}
      <div className="flex flex-col flex-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {tasks.length > 0 ? (
          tasks.map((t) => <TaskCard key={t.id || t._id || ""} {...t} />)
        ) : (
          /* Clean visual empty state */
          <div className="h-24 border border-dashed border-white/5 rounded flex items-center justify-center text-[10px] bg-black text-white/30 uppercase tracking-widest">
            [ SUB_NODE_EMPTY ]
          </div>
        )}
      </div>
    </div>
  );
}
