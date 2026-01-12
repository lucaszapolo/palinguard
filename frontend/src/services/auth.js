import { apiRequest } from "./api.js";

const TOKEN_KEY = "pg-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginUser({ login, password }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, password })
  });
  setToken(data.accessToken);
  return data.user;
}

export async function registerUser(payload) {
  return apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
