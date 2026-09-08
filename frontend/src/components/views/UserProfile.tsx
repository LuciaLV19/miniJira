import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  ShieldCheck,
  Bell,
  Save,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useSettingsStore } from "../../store/useSettingsStore";

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-[11px] font-mono transition-colors ${
        valid ? "text-emerald-400" : "text-slate-500"
      }`}
    >
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] border ${
          valid
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-slate-700 bg-slate-800/50"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      {text}
    </div>
  );
}

export default function UserProfile() {
  const { user, logout, updateProfile, changePassword } = useAuthStore();
  const { emailNotifications, compactKanban, setPreferences } =
    useSettingsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "settings"
  >("general");

  // Form states
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  //Password requirements
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await updateProfile({ username, email });
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "New password and confirmation do not match",
      });
      return;
    }
    if (!isPasswordValid) {
      setStatusMessage({
        type: "error",
        text: "Please meet all password requirements",
      });
      return;
    }
    setLoading(true);
    setStatusMessage(null);

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        const errors = error.response?.data?.errors;
        if (message === "Current password is incorrect") {
          setStatusMessage({
            type: "error",
            text: "Current password is incorrect",
          });
        }
        if (errors && errors.length > 0) {
          setStatusMessage({
            type: "error",
            text: errors[0].message,
          });
        } else {
          setStatusMessage({
            type: "error",
            text: error.response?.data?.message || "Failed to change password",
          });
        }
      } else {
        setStatusMessage({
          type: "error",
          text: "An unexpected error occurred",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen pb-12">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-6 bg-[#0d111a] border border-cyan-500/20 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-2xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-wide">
              {user?.username || "Developer"}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-3 h-3" /> Verified User
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/40 hover:border-red-500 text-xs font-mono rounded-lg transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("general");
          }}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "general"
              ? "border-cyan-400 text-cyan-400 font-semibold bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <User className="w-4 h-4" /> General Info
        </button>

        <button
          onClick={() => {
            setActiveTab("security");
          }}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "security"
              ? "border-cyan-400 text-cyan-400 font-semibold bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lock className="w-4 h-4" /> Security
        </button>

        <button
          onClick={() => {
            setActiveTab("settings");
          }}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === "settings"
              ? "border-cyan-400 text-cyan-400 font-semibold bg-cyan-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bell className="w-4 h-4" /> Preferences
        </button>
      </div>

      {/* TAB 1: General Info */}
      {activeTab === "general" && (
        <form
          onSubmit={handleSaveProfile}
          className="space-y-4 p-6 bg-[#0d111a] border border-slate-800 rounded-xl"
        >
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-wider mb-4">
            Personal Information
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0a0d14] border border-cyan-500/20 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0d14] border border-cyan-500/20 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </form>
      )}

      {/* TAB 2: Security */}
      {activeTab === "security" && (
        <form
          onSubmit={handleChangePassword}
          className="space-y-4 p-6 bg-[#0d111a] border border-slate-800 rounded-xl"
        >
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-wider mb-4">
            Change Password
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">
              Current Password
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0a0d14] border border-cyan-500/20 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-0 inset-y-0 px-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">
              New Password
            </label>

            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500" />

              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0a0d14] border border-cyan-500/20 rounded-lg pl-9 pr-12 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-0 inset-y-0 px-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password requirements */}
            {newPassword.length > 0 && (
              <div className="mt-2 p-3 rounded-lg bg-[#0a0d14] border border-slate-800">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                  Password requirements
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <PasswordRequirement
                    valid={passwordRequirements.minLength}
                    text="At least 8 characters"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.uppercase}
                    text="One uppercase letter"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.lowercase}
                    text="One lowercase letter"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.number}
                    text="One number"
                  />

                  <PasswordRequirement
                    valid={passwordRequirements.special}
                    text="One special character"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-400">
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a0d14] border border-cyan-500/20 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 inset-y-0 px-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0d14] font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
            {statusMessage && (
              <span className={`text-xs font-mono text-red-500 mt-4`}>
                {statusMessage.text}
              </span>
            )}
          </div>
        </form>
      )}

      {/* TAB 3: Preferences */}
      {activeTab === "settings" && (
        <div className="p-6 bg-[#0d111a] border border-slate-800 rounded-xl space-y-4 font-mono">
          <h2 className="text-sm text-cyan-400 uppercase tracking-wider mb-4">
            Preferences & Notifications
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <div>
              <p className="text-xs text-slate-200">Email Notifications</p>
              <p className="text-[10px] text-slate-500">
                Receive emails about task updates and mentions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) =>
                setPreferences({ emailNotifications: e.target.checked })
              }
              defaultChecked
              className="accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <div>
              <p className="text-xs text-slate-200">Compact Kanban View</p>
              <p className="text-[10px] text-slate-500">
                Show cards in a smaller format to fit more on screen.
              </p>
            </div>
            <input
              type="checkbox"
              checked={compactKanban}
              onChange={(e) =>
                setPreferences({ compactKanban: e.target.checked })
              }
              className="accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
