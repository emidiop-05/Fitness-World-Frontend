import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./PostDetail.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";
const AVATAR_PLACEHOLDER = "https://via.placeholder.com/48";

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [liking, setLiking] = useState(false);

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
    (async () => {
      try {
        setLoading(true);
        const pRes = await fetch(`${API_BASE}/api/posts/${slug}`, {
          headers: {
            "Content-Type": "application/json",
            ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
          },
        });
        if (!pRes.ok) throw new Error(await pRes.text());
        const pData = await pRes.json();
        setPost({ likedByMe: false, canDelete: false, ...pData });

        const cRes = await fetch(`${API_BASE}/api/comments/${pData._id}`);
        if (!cRes.ok) throw new Error(await cRes.text());
        setComments(await cRes.json());
        setError("");
      } catch (e) {
        console.error(e);
        setError("Error loading the post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, auth.token]);

  async function handleLike() {
    if (!auth.token) {
      alert("Its mandatory to have an account to like the post.");
      return;
    }
    try {
      setLiking(true);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likedByMe: !prev.likedByMe,
              likesCount: (prev.likesCount ?? 0) + (prev.likedByMe ? -1 : 1),
            }
          : prev
      );
      const res = await fetch(`${API_BASE}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const { liked, likesCount } = await res.json();
      setPost((prev) =>
        prev ? { ...prev, likedByMe: liked, likesCount } : prev
      );
    } catch (e) {
      console.error(e);
      setError("Was not possible to update the like.");
    } finally {
      setLiking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!auth.token) {
      setError("Its mandatory to have an account to comment.");
      return;
    }
    try {
      setSending(true);
      const res = await fetch(`${API_BASE}/api/comments/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
      setError("");
    } catch (e) {
      console.error(e);
      setError("Was not possible to send the comment.");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    if (!auth.token) return alert("You must be logged in.");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.status === 204) {
        navigate("/blog");
        return;
      }
      const data = await res.json();
      alert(data.error || "Failed to delete post");
    } catch (e) {
      console.error(e);
      alert("Something went wrong deleting the post.");
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skelTitle} />
        <div className={styles.skelMeta} />
        <div className={styles.skelBlock} />
        <div className={styles.skelBlock} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Post not found.</p>
        <Link to="/blog" className={styles.backLink}>
          ← Return to Blog
        </Link>
      </div>
    );
  }

  // prefer server-provided, fallback to local compare
  const currentUserId = auth.user?._id || null;
  const authorId =
    post.author && typeof post.author === "object"
      ? post.author._id
      : post.author;
  const fallbackCanDelete =
    currentUserId && String(authorId) === String(currentUserId);
  const canDelete = post.canDelete ?? fallbackCanDelete;

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link to="/blog" className={styles.backLink}>
          ← Blog
        </Link>
      </nav>

      {error && <div className={styles.error}>{error}</div>}

      <article className={styles.post}>
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          <div className={styles.authorBox}>
            <img
              className={styles.avatar}
              src={post.author?.profileImage || AVATAR_PLACEHOLDER}
              alt={post.author?.nickName || "Author"}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>
                {post.author?.nickName ||
                  `${post.author?.firstName || ""} ${
                    post.author?.lastName || ""
                  }`.trim() ||
                  "Author"}
              </span>
              <time className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>

          <div className={styles.counters}>
            <button
              onClick={handleLike}
              className={`${styles.likeButton} ${
                post.likedByMe ? styles.likeActive : ""
              }`}
              disabled={liking}
              aria-pressed={post.likedByMe}
              aria-label={post.likedByMe ? "Remove like" : "Like"}
              title={post.likedByMe ? "Remove like" : "Like"}
            >
              <span className={styles.heart}>❤️</span> {post.likesCount ?? 0}
            </button>
            <span>💬 {post.commentsCount ?? comments.length}</span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.paragraph}>{post.body}</p>
        </div>

        {post.tags?.length > 0 && (
          <ul className={styles.tags}>
            {post.tags.map((t) => (
              <li key={t} className={styles.tag}>
                #{t}
              </li>
            ))}
          </ul>
        )}

        {canDelete && (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            🗑️ Delete
          </button>
        )}
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comentários</h2>

        {comments.length === 0 && (
          <div className={styles.empty}>Ainda não há comentários.</div>
        )}

        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c._id} className={styles.commentItem}>
              <img
                className={styles.commentAvatar}
                src={c.author?.profileImage || "https://via.placeholder.com/40"}
                alt={c.author?.nickName || "Usuário"}
              />
              <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    {c.author?.nickName ||
                      `${c.author?.firstName || ""} ${
                        c.author?.lastName || ""
                      }`.trim() ||
                      "Usuário"}
                  </span>
                  <time className={styles.commentDate}>
                    {new Date(c.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className={styles.commentText}>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            placeholder="Escreva um comentário…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className={styles.formActions}>
            <button className={styles.button} disabled={sending}>
              {sending ? "Enviando…" : "Publicar"}
            </button>
          </div>
        </form>
      </section>
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
