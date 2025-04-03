import axios from "axios";
import { API_URL } from "@/src/constants/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
