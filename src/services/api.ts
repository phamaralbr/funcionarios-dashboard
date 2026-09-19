import axios from "axios";

// URL do json-server. Ajuste via .env (VITE_API_URL) se necessário.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
