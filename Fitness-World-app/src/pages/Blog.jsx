import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostModal from "../components/NewPostModal";
import styles from "./Blog.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";
const AVATAR_PLACEHOLDER = "https://placehold.co/48x48/png";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [likingId, setLikingId] = useState(null);

  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("token"),
    user: safeParse(localStorage.getItem("user")),
  }));

  useEffect(() => {
    const onAuth = () =>
      setAuth({
        token: localStorage.getItem("token"),
        user: safeParse(localStorage.getItem("user")),
      });
    window.addEventListener("auth", onAuth);
    return () => window.removeEventListener("auth", onAuth);
  }, []);

  useEffect(() => {
    loadPosts(page);
  }, [page, auth.token]);

  async function loadPosts(p) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts?page=${p}&limit=10`, {
        headers: {
          "Content-Type": "application/json",
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const withDefaults = (data.posts || []).map((post) => ({
        likedByMe: false,
        canDelete: false,
        ...post,
      }));

      setPosts((prev) => (p === 1 ? withDefaults : [...prev, ...withDefaults]));
      setTotal(data.total || 0);
      setErr("");
    } catch (e) {
      console.error("Error loading posts:", e);
      setErr("Error Loading Posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(e, postId) {
    e.preventDefault();
    if (!auth.token) {
      alert("You must be logged in to like posts.");
      return;
    }
    try {
      setLikingId(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likedByMe: !p.likedByMe,
                likesCount: (p.likesCount ?? 0) + (p.likedByMe ? -1 : 1),
              }
            : p
        )
      );

      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const { liked, likesCount } = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likedByMe: liked, likesCount } : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
      loadPosts(page);
    } finally {
      setLikingId(null);
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (res.status === 204) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong deleting the post.");
    }
  }

  const currentUserId = auth.user?._id || null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>Last Posts:</p>
        </div>

        {auth.token && (
          <button
            type="button"
            className={styles.loadMore}
            onClick={() => setOpenNew(true)}
          >
            Create Post
          </button>
        )}
      </header>

      {!!err && <div className={styles.error}>{err}</div>}

      {!loading && posts.length === 0 && !err && (
        <div className={styles.empty}>
          <h3>There are no posts yet</h3>
          <p>Create the first post of the conversation.</p>
        </div>
      )}

      <section className={styles.list}>
        {loading && posts.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <article key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
              </article>
            ))
          : posts.map((post) => {
              const authorId =
                post.author && typeof post.author === "object"
                  ? post.author._id
                  : post.author;

              const canDelete =
                post.canDelete === true ||
                (currentUserId && String(authorId) === String(currentUserId));

              return (
                <article key={post._id} className={styles.card}>
                  <Link className={styles.cardLink} to={`/blog/${post.slug}`}>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                  </Link>

                  <div className={styles.meta}>
                    <div className={styles.author}>
                      <img
                        className={styles.avatar}
                        src={post.author?.profileImage || AVATAR_PLACEHOLDER}
                        alt={post.author?.nickName || "Author"}
                        width={48}
                        height={48}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = AVATAR_PLACEHOLDER;
                        }}
                      />
                      <span className={styles.authorName}>
                        {post.author?.nickName ||
                          `${post.author?.firstName || ""} ${
                            post.author?.lastName || ""
                          }`.trim() ||
                          "Author"}
                      </span>
                    </div>
                    <time className={styles.date}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                  </div>

                  <p className={styles.excerpt}>{post.body}</p>

                  {post.tags?.length > 0 && (
                    <ul className={styles.tags}>
                      {post.tags.slice(0, 4).map((t) => (
                        <li key={t} className={styles.tag}>
                          #{t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.stats}>
                    <button
                      onClick={(e) => handleLike(e, post._id)}
                      className={`${styles.likeButton} ${
                        post.likedByMe ? styles.likeActive : ""
                      }`}
                      disabled={likingId === post._id}
                      aria-pressed={post.likedByMe}
                      aria-label={post.likedByMe ? "Unlike" : "Like"}
                      title={post.likedByMe ? "Unlike" : "Like"}
                    >
                      <span className={styles.heart}>❤️</span>{" "}
                      {post.likesCount ?? 0}
                    </button>

                    <span>💬 {post.commentsCount ?? 0}</span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </article>
              );
            })}
      </section>

      {posts.length < total && (
        <div className={styles.loadMoreWrap}>
          <button
            className={styles.loadMore}
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "loading..." : "Load More"}
          </button>
        </div>
      )}

      <NewPostModal open={openNew} onClose={() => setOpenNew(false)} />
    </div>
  );
}

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
