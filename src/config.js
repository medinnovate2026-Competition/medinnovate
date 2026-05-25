export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function resolveAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/payments")) return `${API_BASE_URL}${path}`;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
