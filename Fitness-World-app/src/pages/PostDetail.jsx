import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./PostDetail.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [liking, setLiking] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const pRes = await fetch(`${API_BASE}/api/posts/${slug}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!pRes.ok) throw new Error(await pRes.text());
        const pData = await pRes.json();
        setPost({ likedByMe: false, ...pData });

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
  }, [slug, token]);

  async function handleLike() {
    if (!token) {
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
        headers: { Authorization: `Bearer ${token}` },
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
    if (!token) {
      setError("Its mandatory to have an account to comment.");
      return;
    }
    try {
      setSending(true);
      const res = await fetch(`${API_BASE}/api/comments/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
              src={
                post.author?.profileImage || "https://via.placeholder.com/48"
              }
              alt={post.author?.nickName || "Autor"}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>
                {post.author?.nickName ||
                  `${post.author?.firstName || ""} ${
                    post.author?.lastName || ""
                  }`.trim() ||
                  "Autor"}
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
