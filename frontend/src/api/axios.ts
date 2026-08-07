import axios from "axios";

// 1. Creación de la instancia con la URL base de tu backend Express
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor de Peticiones (Request Interceptor)
// Antes de que salgan las llamadas al servidor, Axios ejecuta este código
api.interceptors.request.use(
  (config) => {
    // Busca si tenemos un Token guardado tras hacer Login
    const token = localStorage.getItem("token");

    // Si existe el token, se lo añade al encabezado Authorization
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
