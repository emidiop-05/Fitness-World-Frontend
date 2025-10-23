import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewPostModal.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function NewPostModal({ open, onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem("token"));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setBody("");
      setTags("");
      setImages("");
      setError("");
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token)
      return setError("Its mandatory to have an account to create a post.");
    if (!title.trim() || !body.trim()) {
      return setError("Title and content are mandatory.");
    }

    const payload = {
      title: title.trim(),
      body: body.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: images
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      onClose?.();
      navigate(`/blog/${created.slug}`);
    } catch (err) {
      console.error(err);
      setError("Was not possible to create the post.");
    } finally {
      setSaving(false);
    }
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={stop}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create new Post</h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {!isAuthed && (
          <div className={styles.guard}>
            <p className={styles.muted}>
              Its mandatory to have an account to create a Post.
            </p>
          </div>
        )}

        {isAuthed && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <label className={styles.label}>
              Title
              <input
                className={styles.input}
                placeholder="Ex.: How to get better in Taekwondo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={140}
              />
              <span className={styles.hint}>{title.length}/140</span>
            </label>

            <label className={styles.label}>
              Content
              <textarea
                className={styles.textarea}
                rows={8}
                placeholder="Write here your text..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>

            <div className={styles.row}>
              <label className={styles.label}>
                Tags (separated by commas)
                <input
                  className={styles.input}
                  placeholder="fitness, react, tips"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Images (URLs, separated by commas)
                <input
                  className={styles.input}
                  placeholder="https://..., https://..."
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={onClose}
              >
                Cancel
              </button>
              <button className={styles.button} type="submit" disabled={saving}>
                {saving ? "Publishing" : "Publish"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
