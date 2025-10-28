import { useState, useMemo } from "react";
import styles from "../pages/BmiCalc.module.css";

export default function BMICalc() {
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const { bmi, category } = useMemo(() => {
    const h = parseFloat(heightCm / 100);
    const w = parseFloat(weightKg);
    if (!h || !w || h <= 0 || w <= 0) return { bmi: null, category: "" };
    const value = +(w / (h * h)).toFixed(1);
    const cat =
      value < 18.5
        ? "Underweight"
        : value < 25
        ? "Normal"
        : value < 30
        ? "Overweight"
        : "Obesity";
    return { bmi: value, category: cat };
  }, [heightCm, weightKg]);

  return (
    <div className={styles.Container}>
      <h1 className={styles.Title}>Calculate your BMI/IMC:</h1>
      <div className={styles.DataContainer}>
        <label className={styles.Data}>
          Height (cm)
          <input
            type="number"
            inputMode="decimal"
            min="100"
            max="250"
            step="0.1"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </label>
        <label className={styles.Data}>
          Weight (kg)
          <input
            type="number"
            inputMode="decimal"
            min="20"
            max="250"
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.Result}>
        {bmi ? (
          <p>
            <strong>BMI:</strong> {bmi} — {category}
          </p>
        ) : (
          <p>Enter height and weight.</p>
        )}
      </div>
    </div>
  );
}
