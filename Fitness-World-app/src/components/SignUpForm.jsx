import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function SignUpForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    birthday: "",
    gender: "",
    countryCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const countries = [
    { code: "PT", name: "Portugal" },
    { code: "PL", name: "Poland" },
    { code: "US", name: "United States" },
    { code: "BR", name: "Brazil" },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      setMsg({ type: "success", text: `User created: ${data.email}` });
      setForm({
        email: "",
        password: "",
        birthday: "",
        gender: "",
        countryCode: "",
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <h2>Create account</h2>

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={onChange}
        required
      />

      <label>Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={onChange}
        required
        minLength={8}
      />

      <label>Birthday</label>
      <input
        name="birthday"
        type="date"
        value={form.birthday}
        onChange={onChange}
      />

      <label>Gender</label>
      <select name="gender" value={form.gender} onChange={onChange}>
        <option value="">Select…</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label>Country</label>
      <select name="countryCode" value={form.countryCode} onChange={onChange}>
        <option value="">Select…</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create account"}
      </button>

      {msg && (
        <p style={{ color: msg.type === "error" ? "crimson" : "green" }}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
