import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.show : ""}`}
        onClick={onClose}
      />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          className={styles.close}
          aria-label="Close menu"
          onClick={onClose}
        >
          ×
        </button>

        <nav className={styles.menu}>
          <NavLink to="/profile" onClick={onClose}>
            <p className={styles.Profile}>Profile</p>
          </NavLink>
          <NavLink to="/blog" onClick={onClose}>
            <p className={styles.Blog}>Blog</p>
          </NavLink>
          <NavLink to="/plans" onClick={onClose}>
            <p className={styles.Plans}>Plans</p>
          </NavLink>
          <NavLink to="/BMICalc" onClick={onClose}>
            <p className={styles.BMICalc}>BMI Calculator</p>
          </NavLink>
          <NavLink to="/OurTeam" onClick={onClose}>
            <p className={styles.OurTeam}>Our Team</p>
          </NavLink>
          <NavLink to="/about" onClick={onClose}>
            <p className={styles.About}>About</p>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
