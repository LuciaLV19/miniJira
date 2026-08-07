import { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore";

function CreateProjectModal() {
  // Project Store Hooks
  const close = useProjectStore((state) => state.closeProjectModal);
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const projectToEdit = useProjectStore((state) => state.projectToEdit);

  // Derived state to determine form mode (create vs. edit)
  const isEditing = !!projectToEdit;

  // Form input and validation states
  const [name, setName] = useState(isEditing ? projectToEdit?.name : "");
  const [description, setDescription] = useState(
    isEditing ? projectToEdit?.description : "",
  );
  const [error, setError] = useState("");

  /**
   * Handles form submission for creating or updating a project.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameTrimmed = name.trim();
    const descriptionTrimmed = description.trim();

    // Basic client-side validation
    if (!nameTrimmed) return setError("Name is required");
    if (!descriptionTrimmed) return setError("Description is required");

    // Execute corresponding action based on mode
    if (isEditing) {
      updateProject(projectToEdit.id!, {
        name: nameTrimmed,
        description: descriptionTrimmed,
      });
    } else {
      createProject(name, description);
    }

    // Reset state and dismiss modal
    setError("");
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      {/* Terminal-themed Modal Container */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-black border border-neon-cyan/40 p-6 rounded shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-95 max-w-md w-full font-mono text-xs relative overflow-hidden"
      >
        {/* Top scanner decorative element */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-neon-cyan to-transparent animate-pulse" />

        {/* Dynamic Modal Header */}
        <div className="flex items-center justify-between border-b border-neon-cyan/20 pb-3">
          <h2 className="text-sm font-black text-neon-cyan tracking-widest uppercase">
            {isEditing
              ? "// EDIT_CONTRACT_PROTOCOL"
              : "// NEW_CONTRACT_PROTOCOL"}
          </h2>
          <span className="text-[9px] text-neon-cyan/40">
            {isEditing
              ? `ID: ${projectToEdit.id?.slice(0, 8)}...`
              : "STATUS: PENDING"}
          </span>
        </div>

        {/* Input Field: Project Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neon-cyan/60 uppercase tracking-wider text-[10px]">
            [01] Contract name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. OPERACION_GRID_RUNNER"
            className="w-full p-2.5 bg-neon-cyan/5 border border-neon-cyan/30 rounded text-white placeholder-neon-cyan/20 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all duration-200"
            type="text"
          />
        </div>

        {/* Input Field: Project Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-neon-cyan/60 uppercase tracking-wider text-[10px]">
            [02] Specifications / Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Inyectar detalles de los objetivos del nodo..."
            rows={3}
            className="w-full p-2.5 bg-neon-cyan/5 border border-neon-cyan/30 rounded text-white placeholder-neon-cyan/20 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all duration-200 resize-none"
          />
        </div>

        {/* Footer Area: Actions and Error Display */}
        <div className="flex flex-col gap-3 pt-2 border-t border-neon-cyan/10">
          {/* Cyber-styled Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-2 bg-neon-magenta/10 border border-neon-magenta/30 rounded animate-shake">
              <span className="text-neon-magenta font-black animate-pulse">
                ![ERR_PROTOCOL]:
              </span>
              <p className="text-neon-magenta text-[10px] uppercase tracking-wide">
                {error}
              </p>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={close}
              className="py-2 px-4 bg-transparent border border-neon-cyan/40 text-neon-cyan/60 hover:text-neon-cyan hover:border-neon-cyan transition-all duration-200 rounded uppercase tracking-wider text-[10px] cursor-pointer"
            >
              [CANCEL]
            </button>

            <button
              type="submit"
              className="py-2 px-5 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:bg-neon-cyan hover:text-black transition-all duration-300 rounded font-black uppercase tracking-widest text-[10px] cursor-pointer active:scale-[0.97]"
            >
              {isEditing ? "COMPILE_CHANGES" : "EXECUTE_CONTRACT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectModal;
