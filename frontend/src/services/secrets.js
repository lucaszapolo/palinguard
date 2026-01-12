import { apiRequest } from "./api.js";
import { getToken } from "./auth.js";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listSecrets() {
  return apiRequest("/secrets", { headers: authHeaders() });
}

export async function revealSecret(id) {
  return apiRequest(`/secrets/${id}/reveal`, {
    method: "POST",
    headers: authHeaders()
  });
}

export async function createSecret(payload) {
  return apiRequest("/secrets", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
}
