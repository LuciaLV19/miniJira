import { useState } from "react";
import { inviteMemberApi } from "../../services/projectService";
import { toast } from "sonner";
import axios from "axios";

interface InviteModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: () => void;
}

export const InviteModal = ({
  projectId,
  isOpen,
  onClose,
  onMemberAdded,
}: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await inviteMemberApi(projectId, email);

      toast.success(response.message || "Member added successfully");
      setEmail("");

      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err) {
      const axiosError = axios.isAxiosError(err)
        ? err.response?.data?.message
        : (err as Error).message;
      setError(axiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessMessage(null);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0a0d14] border border-cyan-900/50 p-6 rounded-lg w-full max-w-md text-cyan-100 shadow-xl shadow-cyan-950/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-900/30">
          <h3 className="text-cyan-400 font-mono text-lg font-bold">
            INVITE_MEMBER
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-cyan-300 transition-colors font-mono"
          >
            ✕
          </button>
        </div>

        {/* Mensajes de Feedback */}
        {error && (
          <div className="mb-4 p-2 bg-red-950/40 border border-red-500/50 rounded text-red-300 text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-emerald-950/40 border border-emerald-500/50 rounded text-emerald-300 text-xs font-mono">
            ✓ {successMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-cyan-300 block mb-1">
              USER_EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111622] border border-cyan-900/50 rounded p-2.5 text-sm text-cyan-100 placeholder-gray-600 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !email}
              className="px-4 py-2 text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 rounded hover:bg-cyan-500/30 active:bg-cyan-500/40 disabled:opacity-50 transition-colors"
            >
              {loading ? "INVITING..." : "SEND_INVITE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
