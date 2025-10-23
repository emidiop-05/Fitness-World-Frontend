const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export async function getPosts(page = 1) {
  const res = await fetch(`${API_BASE}/api/posts?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug) {
  const res = await fetch(`${API_BASE}/api/posts/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(post, token) {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function toggleLike(postId, token) {
  const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to toggle like");
  return res.json();
}
