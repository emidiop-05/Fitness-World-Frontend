import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../pages/Plans.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Plans() {
  const [groups, setGroups] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [areasErr, setAreasErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const gRes = await fetch(`${API_BASE}/api/exercises/groups`);
        const gJson = await gRes.json().catch(() => []);
        setGroups(Array.isArray(gJson) ? gJson : []);

        let a = [];
        try {
          const aRes = await fetch(`${API_BASE}/api/exercises/areas`);
          if (aRes.ok) {
            const aJson = await aRes.json();
            a = Array.isArray(aJson) ? aJson : [];
          } else {
            setAreasErr("Body areas endpoint not available on the server.");
          }
        } catch {
          setAreasErr("Could not load body areas.");
        }
        setAreas(a);
      } catch (e) {
        setErr("Could not load initial data.");
        console.error(e);
      }
    })();
  }, []);

  async function generateGroupPlan() {
    if (!selectedGroup) return;
    setLoading(true);
    setErr(null);
    setPlan(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/exercises/plans/group/${encodeURIComponent(
          selectedGroup
        )}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch plan");
      setPlan(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateAreaPlan() {
    if (!selectedArea) return;
    setLoading(true);
    setErr(null);
    setPlan(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/exercises/plans/area/${encodeURIComponent(
          selectedArea
        )}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch area plan");
      setPlan(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={style.Container}>
      <h1 className={style.Title}>Training Plans</h1>

      <div className={style.SelectRow}>
        <select
          className={style.Select}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Select muscle group…</option>
          {Array.isArray(groups) &&
            groups.map((g) => (
              <option key={g.group} value={g.group}>
                {g.group}
              </option>
            ))}
        </select>

        <button
          className={style.Btn}
          disabled={!selectedGroup || loading}
          onClick={generateGroupPlan}
        >
          {loading && selectedGroup ? "Loading…" : "Generate Group Plan"}
        </button>
      </div>

      <div className={style.SelectRow}>
        <select
          className={style.Select}
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={areasErr !== "" || areas.length === 0}
        >
          <option value="">
            {areasErr ? "Areas unavailable" : "Select body area…"}
          </option>
          {Array.isArray(areas) &&
            areas.map((a) => (
              <option key={a.area} value={a.area}>
                {a.area}
              </option>
            ))}
        </select>

        <button
          className={style.Btn}
          disabled={!selectedArea || loading || areasErr !== ""}
          onClick={generateAreaPlan}
        >
          {loading && selectedArea ? "Loading…" : "Generate Area Plan"}
        </button>
      </div>

      {areasErr && (
        <div className={style.Error}>
          {areasErr} (Ask backend to deploy `/api/exercises/areas`)
        </div>
      )}
      {err && <div className={style.Error}>{err}</div>}

      {plan && (
        <section className={style.PlanSection}>
          <h2 className={style.Subtitle}>
            {plan.group
              ? `Plan for ${plan.group}`
              : plan.area
              ? `Plan for ${plan.area}`
              : "Training Plan"}
          </h2>

          {plan.days?.map((day) => (
            <div key={day.name} className={style.DayCard}>
              <h3 className={style.DayTitle}>{day.name}</h3>
              <ul className={style.ExerciseList}>
                {day.blocks.map((ex) => (
                  <li key={ex.id} className={style.ExerciseItem}>
                    <Link
                      to={`/exercise/${encodeURIComponent(ex.id)}`}
                      className={style.ExLink}
                    >
                      {ex.name}
                    </Link>{" "}
                    — {ex.equipment} ({ex.sets}×{ex.reps})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
