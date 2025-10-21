import Logo from "../assets/Logo.png";
import styles from "../components/Navbar.module.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <img className={styles.Logo} src={Logo} alt="Logo" />

      <div className={styles.NavbarRoutes}>
        <Link to="/">
          <h1 className={styles.Home}>Home</h1>
        </Link>
        <Link to="/plans">
          <h1 className={styles.Plans}>Plans</h1>
        </Link>
      </div>
    </nav>
  );
}
export default Navbar;
