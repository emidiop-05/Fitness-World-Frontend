// src/components/ChatWidget.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatWidget.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function ChatWidget({
  title = "Ask Fitness World",
  placeholder = "Type your question...",
  systemPrompt = "You are a helpful assistant for the Fitness World app.",
  pageContext = "",
  collapsedByDefault = true,
}) {
  const [open, setOpen] = useState(!collapsedByDefault);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: systemPrompt },
    ...(pageContext
      ? [{ role: "user", content: `Context: ${pageContext}` }]
      : []),
  ]);

  const scrollRef = useRef(null);

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, open]);

  async function sendMessage(e) {
    e?.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    const newMsgs = [...messages, { role: "user", content }];
    setMessages(newMsgs);
    setInput("");
    setSending(true);

    try {
      const url = `${API_BASE}/api/ai/chat`;
      console.log("AI POST →", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      const raw = await res.text();
      console.log("AI status:", res.status, "raw:", raw);

      if (!res.ok) {
        let problem = raw;
        try {
          const parsed = JSON.parse(raw);
          problem = parsed.details || parsed.error || raw;
        } catch {
          // keep raw
        }
        throw new Error(
          typeof problem === "string" ? problem : JSON.stringify(problem)
        );
      }

      // Accept either JSON { reply, model? } or plain text
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = { reply: raw };
      }

      let reply = (payload?.reply ?? "").toString().trim();
      if (!reply) reply = "I couldn't generate a response right now.";

      // (optional) show model used if backend sends it
      const modelUsed = payload?.model ? `\n\n_(model: ${payload.model})_` : "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply + modelUsed },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="fw-chatbox"
        title={open ? "Close chat" : "Open chat"}
      >
        💬
      </button>

      {open && (
        <div id="fw-chatbox" className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <button
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className={styles.body} ref={scrollRef}>
            {visibleMessages.length === 0 && (
              <div className={styles.tip}>Say hi! 👋</div>
            )}

            {visibleMessages.map((m, idx) => (
              <div
                key={idx}
                className={`${styles.msg} ${
                  m.role === "user" ? styles.user : styles.assistant
                }`}
              >
                {m.content}
              </div>
            ))}

            {sending && (
              <div className={`${styles.msg} ${styles.assistant}`}>…</div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              className={styles.input}
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button className={styles.send} disabled={sending || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
