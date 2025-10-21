import Styles from "../pages/Home.module.css";
import BackgroundImg from "../assets/backgroundImg.png";
export default function Home() {
  return (
    <div>
      <h1 className={Styles.Tittle}>Train For Your Body And Your Mind</h1>
      <p className={Styles.SubTittle}>
        “Where fitness meets mindfulness — build power, precision, and purpose.”
      </p>
      <img className={Styles.BackgroundImg} src={BackgroundImg} />
    </div>
  );
}
