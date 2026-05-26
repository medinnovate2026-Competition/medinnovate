import { API_BASE_URL } from "../../config";

export class CmsApiUnavailableError extends Error {
  constructor(path) {
    super(`Production CMS API route is unavailable: ${API_BASE_URL}${path}`);
    this.name = "CmsApiUnavailableError";
  }
}

export async function cmsFetchJson(path, options) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new CmsApiUnavailableError(path);
  }

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new CmsApiUnavailableError(path);
  }

  if (response.status === 404 || response.status === 405) {
    throw new CmsApiUnavailableError(path);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `CMS request failed: ${path}`);
  }

  return data;
}

export function readLocalCms(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalCms(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function isCmsApiUnavailable(error) {
  return error instanceof CmsApiUnavailableError;
}
