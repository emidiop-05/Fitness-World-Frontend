const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
