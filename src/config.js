import { API_BASE } from "./config/api";

export const API_BASE_URL = API_BASE;

export function resolveAssetUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:)/i.test(path)) return path;
  if (path.startsWith(import.meta.env.BASE_URL)) return path;
  if (path.startsWith("/payments") || path.startsWith("/media")) return `${API_BASE}${path}`;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
