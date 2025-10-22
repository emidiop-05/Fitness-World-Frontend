import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../pages/Plans.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";

export default function Plans() {
  const [targets, setTargets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [muscle, setMuscle] = useState("");
  const [group, setGroup] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, gRes] = await Promise.all([
          fetch(`${API_BASE}/api/exercises/targets`),
          fetch(`${API_BASE}/api/exercises/groups`),
        ]);
        const tData = await tRes.json();
        const gData = await gRes.json();
        if (!tRes.ok) throw new Error(tData.error || "Failed to load targets");
        if (!gRes.ok) throw new Error(gData.error || "Failed to load groups");
        setTargets(Array.isArray(tData) ? tData : []);
        setGroups(Array.isArray(gData) ? gData : []);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  const loadTargetPlan = async () => {
    if (!muscle) return;
    setLoading(true);
    setErr(null);
    setPlan(null);
    try {
      const r = await fetch(
        `${API_BASE}/api/exercises/plans/${encodeURIComponent(muscle)}`
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to load plan");
      setPlan(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupPlan = async () => {
    if (!group) return;
    setLoading(true);
    setErr(null);
    setPlan(null);
    try {
      const r = await fetch(
        `${API_BASE}/api/exercises/plans/group/${encodeURIComponent(group)}`
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to load group plan");
      setPlan(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.Container}>
      <h1 className={style.Title}>Training Plans</h1>

      <div className={style.Controls}>
        <select
          className={style.Select}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">Select muscle group…</option>
          {groups.map((g) => (
            <option key={g.group} value={g.group}>
              {g.group}
            </option>
          ))}
        </select>
        <button
          className={style.Button}
          onClick={loadGroupPlan}
          disabled={!group || loading}
        >
          {loading ? "Loading…" : "Generate Group Plan"}
        </button>
      </div>

      {err && <p className={style.Error}>{err}</p>}

      {plan && (
        <div className={style.PlanContainer}>
          <h2 className={style.PlanTitle}>
            {(plan.group || plan.muscle)?.toUpperCase()} • 3-Day Plan
          </h2>

          {plan.days?.map((day) => (
            <div key={day.name} className={style.DayCard}>
              <h3 className={style.DayTitle}>{day.name}</h3>

              {day.blocks?.map((ex) => (
                <Link
                  to={`/exercise/${encodeURIComponent(ex.id)}`}
                  key={ex.id}
                  className={style.ExerciseRowLink}
                >
                  <div className={style.ExerciseRow}>
                    <div className={style.ExerciseInfo}>
                      <div className={style.ExerciseName}>{ex.name}</div>
                      <div className={style.ExerciseDetails}>
                        {ex.equipment} • {ex.target}
                      </div>
                    </div>
                    <div className={style.ExerciseMeta}>
                      {ex.sets} x {ex.reps} • Rest {ex.restSec}s
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
