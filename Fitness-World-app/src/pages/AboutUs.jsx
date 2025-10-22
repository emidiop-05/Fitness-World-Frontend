import style from "../pages/AboutUs.module.css";
import StockImg1 from "../assets/stockimg1.jpg";
import StockImg2 from "../assets/stockImg2.jpg";
export default function AboutUs() {
  return (
    <div className={style.AboutUs}>
      <h1 className={style.Title}>About Fitness World</h1>
      <h2 className={style.SubTitle}>
        Welcome to Fitness World — your space to grow stronger, smarter, and
        more connected.
      </h2>
      <p className={style.FirstPara}>
        At Fitness World, we believe that fitness is more than just workouts —
        it’s a community. Our mission is to bring people together in a single
        platform where everyone can share their experiences, learn from each
        other, and achieve their personal goals.
      </p>
      <img className={style.StockImg1} src={StockImg1} alt="" />
      <p className={style.SecondPara}>
        Whether you’re just starting your fitness journey or already an
        experienced athlete, Fitness World helps you find training plans
        tailored to your needs — built around your goals, equipment, and
        lifestyle.
      </p>
      <p className={style.ThirdPara}>
        But we go beyond training. With our interactive blog, you can connect
        with others, share tips, discuss challenges, and celebrate progress as
        one big team.
      </p>
      <img className={style.StockImg2} src={StockImg2} alt="" />
      <div className={style.LastMsg}>
        <p>Here, every rep counts — and every voice matters.</p>
        <p>Join the movement. Join the community.</p>
        <p>Welcome to Fitness World.</p>
      </div>
    </div>
  );
}
