export default async function handleDelete(API_BASE, token, postId, setPosts) {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 204) {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete post");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}
