import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;

  const localStorageToken = localStorage.getItem("token");
  if (localStorageToken) return localStorageToken;

  return useAuthStore.getState().token;
};

// 1. Create an Axios instance to set the base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor de Peticiones (Request Interceptor)
// Antes de que salgan las llamadas al servidor, Axios ejecuta este código
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
