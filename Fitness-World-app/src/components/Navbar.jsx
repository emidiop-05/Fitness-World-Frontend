import Logo from "../assets/Logo.png";
import styles from "../components/Navbar.module.css";
function Navbar() {
  return (
    <nav>
      <img id="logo" src={Logo} alt="Logo" />
    </nav>
  );
}

export default Navbar;
