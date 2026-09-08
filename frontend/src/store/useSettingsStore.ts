import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner"; 

interface SettingsState {
  emailNotifications: boolean;
  compactKanban: boolean;
  setPreferences: (newPrefs: Partial<Omit<SettingsState, "setPreferences">>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      compactKanban: false,

      setPreferences: (newPrefs) => {
        set((state) => ({ ...state, ...newPrefs }));
        toast.success("Preference updated");
      },
    }),
    {
      name: "preferences_store",
    }
  )
);