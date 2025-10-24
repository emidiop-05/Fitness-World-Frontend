import style from "../pages/Home.module.css";
import BackgroundImg from "../assets/BackgroundImg.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className={style.Tittle}>Train For Your Body And Your Mind</h1>
      <p className={style.SubTittle}>
        “Where fitness meets mindfulness — build power, precision, and purpose.”
      </p>
      <img className={style.BackgroundImg} src={BackgroundImg} />
      <nav className={style.Btns}>
        <Link to="/OurTeam">
          <h1 className={style.OurTeam}>Our Team</h1>
        </Link>
        <Link to="/about">
          <h1 className={style.About}>About Us</h1>
        </Link>
      </nav>
    </div>
  );
}
