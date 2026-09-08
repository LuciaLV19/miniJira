import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../services/authService";
import { toast } from "sonner";
import { isAxiosError } from "axios";


import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  UpdateProfileData, 
  ChangePasswordData 
} from "../services/authService";

interface AuthState {
  user: AuthResponse | null;
  token: string | null;

  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;

  // Management methods
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (passwords: ChangePasswordData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (credentials) => {
        const data = await authApi.loginApi(credentials);
        set({ user: data, token: data.token });
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      },

      register: async (credentials) => {
        const data = await authApi.registerApi(credentials);
        set({ user: data, token: data.token });
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
      },

      updateProfile: async (userData) => {
        try{
        const updatedUser = await authApi.updateProfileApi(userData);
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
        }));
        toast.success("Profile updated successfully");
        } catch (error) {
        let errorMessage = "Failed to update profile";
         if (isAxiosError(error)) {
        errorMessage = error?.response?.data?.message || errorMessage;      
        } else if (error instanceof Error) {
        errorMessage = error.message
      }
        toast.error(errorMessage);
      }
      },

      changePassword: async (passwords) => {
          await authApi.changePasswordApi(passwords);
          toast.success("Password changed successfully");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);