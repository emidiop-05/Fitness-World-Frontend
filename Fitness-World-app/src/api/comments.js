const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export async function getComments(postId) {
  const res = await fetch(`${API_BASE}/api/comments/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(postId, body, token) {
  const res = await fetch(`${API_BASE}/api/comments/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}
