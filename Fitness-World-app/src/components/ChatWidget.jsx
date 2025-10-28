import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import styles from "./ChatWidget.module.css";

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";
const FRONT_MODEL = import.meta.env.VITE_HF_MODEL;

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

    const sys = messages.filter((m) => m.role === "system");
    const nonSys = messages.filter((m) => m.role !== "system");
    const MAX_TURNS = 10;
    const trimmed = nonSys.slice(-MAX_TURNS);

    const nextMsgs = [...sys, ...trimmed, { role: "user", content }];
    setMessages(nextMsgs);
    setInput("");
    setSending(true);

    try {
      const url = `${API_BASE}/api/ai/chat`;
      const payload = {
        messages: nextMsgs,
        model: FRONT_MODEL || undefined,
        max_tokens: 256,
        temperature: 0.7,
        top_p: 1,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      if (!res.ok) {
        let problem = raw;
        try {
          const parsed = JSON.parse(raw);
          problem = parsed.details || parsed.error || raw;
        } catch {}

        const hint =
          res.status === 401
            ? " (check your HF token permissions for Inference Providers)"
            : res.status === 429
            ? " (rate limit—slow down requests or try another provider)"
            : "";
        throw new Error(
          `[${res.status}] ${
            typeof problem === "string" ? problem : JSON.stringify(problem)
          }${hint}`
        );
      }

      let payloadOut;
      try {
        payloadOut = JSON.parse(raw);
      } catch {
        payloadOut = { reply: raw };
      }

      let reply = (payloadOut?.reply ?? "").toString().trim();
      if (!reply) reply = "I couldn't generate a response right now.";

      const modelUsed = payloadOut?.model
        ? `\n\n*(model: ${payloadOut.model})*`
        : "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply + modelUsed },
      ]);
    } catch (err) {
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
                {m.role === "assistant" ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(m.content),
                    }}
                  />
                ) : (
                  m.content
                )}
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
