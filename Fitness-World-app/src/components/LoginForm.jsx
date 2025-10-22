import { useState } from "react";
import style from "../components/SignUpForm.module.css";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      setMsg({ type: "success", text: "Logged in!" });

      navigate("/");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.FormContainer}>
      <form onSubmit={onSubmit} className={style.Form}>
        <h2 className={style.Title}>Log in</h2>

        <div className={style.Field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className={style.Field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className={style.Submit} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {msg && (
          <p className={msg.type === "error" ? style.MsgError : style.MsgOk}>
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}
