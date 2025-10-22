import { useEffect, useRef, useState } from "react";
import style from "../pages/Profile.module.css";
import changePic from "../assets/change-2.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";
const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("You’re not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/protected/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            throw new Error(
              "Session expired or invalid token. Please log in again."
            );
          }
          throw new Error(data.error || "Failed to load profile");
        }

        setMe(data.user ?? data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    setUploadErr(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadErr("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr("Max file size is 5MB.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUploadErr("Not logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/uploads/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // NOTE: no Content-Type
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Update UI with new image URL
      setMe((prev) => ({ ...(prev || {}), profileImage: data.url }));
    } catch (e) {
      setUploadErr(e.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading profile…</div>;
  if (err) return <div style={{ padding: 24 }}>Error: {err}</div>;
  if (!me) return null;

  return (
    <div className={style.ProfileContainer}>
      <h1 className={style.Title}>My Profile</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <img
          src={me.profileImage || PLACEHOLDER}
          alt={`${me.firstName || "User"} profile`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />

        <div>
          <button
            className={style.BtnPic}
            type="button"
            onClick={handleChooseFile}
            disabled={uploading}
          >
            <img
              className={style.changePic}
              src={uploading ? img : changePic}
              alt="Change profile"
            />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {uploadErr && (
            <div style={{ marginTop: 8, color: "#b91c1c", fontSize: 13 }}>
              {uploadErr}
            </div>
          )}
        </div>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Nick:</span>
        <span className={style.Value}>{me.nickName}</span>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Gender:</span>
        <span className={style.Value}>{me.gender || "-"}</span>
      </div>

      <h1 className={style.PerInfo}>Personal Information</h1>

      <div className={style.InfoRow}>
        <span className={style.Label}>First Name:</span>
        <span className={style.Value}>{me.firstName}</span>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Last Name:</span>
        <span className={style.Value}>{me.lastName}</span>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Email:</span>
        <span className={style.Value}>{me.email}</span>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Birthday:</span>
        <span className={style.Value}>
          {me.birthday ? String(me.birthday).slice(0, 10) : "-"}
        </span>
      </div>

      <div className={style.InfoRow}>
        <span className={style.Label}>Country:</span>
        <span className={style.Value}>{me.countryCode || "-"}</span>
      </div>

      <p className={style.Footer}>
        Account created:{" "}
        {me.createdAt ? new Date(me.createdAt).toLocaleString() : "-"}
      </p>
    </div>
  );
}
