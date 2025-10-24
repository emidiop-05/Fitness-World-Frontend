import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostModal from "../components/NewPostModal";
import styles from "./Blog.module.css";
const PLACEHOLDER = "../assets/placeholderPf.svg";

console.log("API_BASE:", import.meta.env.VITE_API_BASE);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [likingId, setLikingId] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?._id;

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  async function loadPosts(p) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts?page=${p}&limit=10`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const withDefaults = data.posts.map((post) => ({
        likedByMe: false,
        ...post,
      }));
      setPosts((prev) => (p === 1 ? withDefaults : [...prev, ...withDefaults]));
      setTotal(data.total || 0);
      setErr("");
    } catch (e) {
      setErr("Error Loading Posts");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(e, postId) {
    e.preventDefault();
    if (!token) {
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong deleting the post.");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>Last Posts:</p>
        </div>

        {isLoggedIn && (
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
          : posts.map((post) => (
              <article key={post._id} className={styles.card}>
                <Link className={styles.cardLink} to={`/blog/${post.slug}`}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                </Link>

                <div className={styles.meta}>
                  <div className={styles.author}>
                    <img
                      className={styles.avatar}
                      src={post.author?.profileImage || PLACEHOLDER}
                      alt={post.author?.nickName || "Author"}
                      width={48}
                      height={48}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
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

                {isLoggedIn && post.author?._id === currentUserId && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                )}
              </article>
            ))}
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
