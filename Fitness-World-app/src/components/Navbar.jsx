import Logo from "../assets/Logo.png";
import styles from "../components/Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "../assets/Hamburger_Menu-removebg-preview.png";
import { useState, useEffect } from "react";

function Navbar({ toggleSidebar }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // check on load
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className={styles.Navbar}>
      <img className={styles.Logo} src={Logo} alt="Logo" />

      <button className={styles.HamburgerBtn} onClick={toggleSidebar}>
        <img className={styles.Hamburger} src={HamburgerMenu} alt="menu" />
      </button>

      <div className={styles.NavbarRoutes}>
        <Link to="/">
          <h1 className={styles.Home}>Home</h1>
        </Link>
        <Link to="/plans">
          <h1 className={styles.Plans}>Plans</h1>
        </Link>
        <Link to="/about">
          <h1 className={styles.About}>About</h1>
        </Link>
        <Link to="/blog">
          <h1 className={styles.Blog}>Blog</h1>
        </Link>
        <Link to="/OurTeam">
          <h1 className={styles.OurTeam}>Our Team</h1>
        </Link>

        {/* 🔹 Login/Logout section */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <h1 className={styles.Login}>Login</h1>
            </Link>
            <Link to="/signup">
              <h1 className={styles.SignUp}>Sign up</h1>
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className={styles.LogoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
