import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/protected/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setMe(data.user);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  if (err) return <div style={{ padding: 24 }}>Error: {err}</div>;
  if (!me) return <div style={{ padding: 24 }}>Loading profile…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>My Profile</h1>
      <p>
        <strong>ID:</strong> {me.id}
      </p>
      <p>
        <strong>Email:</strong> {me.email}
      </p>
    </div>
  );
}
