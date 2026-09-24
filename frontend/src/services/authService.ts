import api from "../api/axios";


export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateProfileData {
  username: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PasswordResetResponse {
  message: string;
}

// --- Authentication ---

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const requestPasswordResetApi = async (email: string): Promise<PasswordResetResponse> => {
  const response = await api.post<PasswordResetResponse>("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (
  token: string,
  password: string,
  confirmPassword: string,
): Promise<{ message: string }> => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", credentials);
  return response.data;
};

// --- Manage Profile ---

export const getProfileApi = async (): Promise<AuthResponse> => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfileApi = async (userData: UpdateProfileData): Promise<AuthResponse> => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

export const changePasswordApi = async (passwords: ChangePasswordData): Promise<{ message: string }> => {
  const response = await api.put("/users/profile/password", passwords);
  return response.data;
};

