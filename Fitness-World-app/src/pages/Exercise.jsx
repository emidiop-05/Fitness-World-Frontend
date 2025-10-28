import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import style from "../pages/Exercise.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Exercise() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ex, setEx] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasErr, setAreasErr] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/api/exercises/exercise/${encodeURIComponent(id)}`
        );
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load exercise");
        const exercise = Array.isArray(data) ? data[0] : data;
        if (!exercise) throw new Error("Exercise not found");
        setEx(exercise);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setAreasLoading(true);
        setAreasErr("");
        const res = await fetch(`${API_BASE}/api/exercises/areas`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load areas");
        setAreas(Array.isArray(data) ? data : []);
      } catch (e) {
        setAreasErr(e.message || "Could not load body areas.");
      } finally {
        setAreasLoading(false);
      }
    })();
  }, []);

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    if (!area) return;
    const targetPath = `/plans/area/${encodeURIComponent(area)}`;
    try {
      navigate(targetPath);
    } catch {
      navigate(`/plans?area=${encodeURIComponent(area)}`);
    }
  };

  if (loading) return <div className={style.Loading}>Loading…</div>;
  if (err) return <div className={style.Error}>Error: {err}</div>;
  if (!ex) return null;

  const secondary =
    Array.isArray(ex.secondaryMuscles) && ex.secondaryMuscles.length > 0
      ? ex.secondaryMuscles.join(", ")
      : "-";
  const instructions =
    Array.isArray(ex.instructions) && ex.instructions.length > 0
      ? ex.instructions
      : null;

  const selectedMeta = areas.find((a) => a.area === selectedArea);

  return (
    <div className={style.Container}>
      <Link to="/plans" className={style.BackLink}>
        ← Back to Plans
      </Link>

      <h1 className={style.Title}>{ex.name}</h1>

      <div className={style.InfoSection}>
        <Badge label="Target" value={ex.target || "-"} />
        <Badge label="Body Part" value={ex.bodyPart || "-"} />
        <Badge label="Equipment" value={ex.equipment || "-"} />
        <Badge label="Secondary Muscles" value={secondary} />
      </div>

      <section className={style.Section}>
        {areasErr && (
          <p className={style.TextMuted}>Failed to load areas: {areasErr}</p>
        )}

        {!areasErr && !areasLoading && areas.length === 0 && (
          <p className={style.TextMuted}>No areas available.</p>
        )}

        {selectedArea && selectedMeta?.groups?.length > 0 && (
          <div className={style.AreaGroups}>
            <span className={style.BadgeLabel}>Includes groups:</span>{" "}
            <span className={style.BadgeValue}>
              {selectedMeta.groups.join(", ")}
            </span>
          </div>
        )}
      </section>

      {ex.description && (
        <section className={style.Section}>
          <h2 className={style.Subtitle}>Description</h2>
          <p className={style.Text}>{ex.description}</p>
        </section>
      )}

      <section className={style.Section}>
        <h2 className={style.Subtitle}>Execution</h2>
        {instructions ? (
          <ol className={style.List}>
            {instructions.map((step, i) => (
              <li key={i} className={style.ListItem}>
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <p className={style.TextMuted}>
            No step-by-step instructions available for this exercise.
          </p>
        )}
      </section>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <p className={style.BadgeRow}>
      <span className={style.BadgeLabel}>{label}:</span>{" "}
      <span className={style.BadgeValue}>{value}</span>
    </p>
  );
}
