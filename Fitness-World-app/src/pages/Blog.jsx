import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// If you're using the shared api() helper:
//   import { api } from "../api/client";
// Or if you made posts.js:
//   import { getPosts } from "../api/posts";
import styles from "./Blog.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadPosts(p) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts?page=${p}&limit=10`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPosts((prev) => (p === 1 ? data.posts : [...prev, ...data.posts]));
      setTotal(data.total || 0);
      setErr("");
    } catch (e) {
      setErr("Falha ao carregar posts.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Últimos artigos da comunidade</p>
      </header>

      {!!err && <div className={styles.error}>{err}</div>}

      {/* Empty state */}
      {!loading && posts.length === 0 && !err && (
        <div className={styles.empty}>
          <h3>Ainda não há posts</h3>
          <p>Crie o primeiro post para começar a conversa.</p>
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
                      src={
                        post.author?.profileImage ||
                        "https://via.placeholder.com/48"
                      }
                      alt={post.author?.nickName || "Autor"}
                      loading="lazy"
                    />
                    <span className={styles.authorName}>
                      {post.author?.nickName ||
                        `${post.author?.firstName || ""} ${
                          post.author?.lastName || ""
                        }`.trim() ||
                        "Autor"}
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
                  <span>❤️ {post.likesCount ?? 0}</span>
                  <span>💬 {post.commentsCount ?? 0}</span>
                </div>
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
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}
