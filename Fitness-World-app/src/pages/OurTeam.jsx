import style from "../pages/OurTeam.module.css";
import stockImg3 from "../assets/stockImg3.jpeg";

export default function OurTeam() {
  return (
    <div className={style.AboutUs}>
      <h1 className={style.Title}>Our Team at Fitness World</h1>
      <h2 className={style.SubTitle}>
        Meet the dedicated minds and athletes behind Fitness World — united by
        passion, discipline, and the goal of helping you become your strongest
        self.
      </h2>
      <p className={style.FirstPara}>
        At Fitness World, our team is made up of passionate athletes,
        developers, and trainers who believe fitness should be accessible,
        engaging, and personal. Each member brings a unique skill set, combining
        sports knowledge with technology to help you achieve your goals
        efficiently.
      </p>
      <img className={style.StockImg3} src={stockImg3} alt="" />

      <div className={style.LastMsg}>
        <p>Here, every rep counts — and every voice matters.</p>
        <p>Join the movement. Join the community.</p>
        <p>Welcome to Fitness World.</p>
      </div>
    </div>
  );
}
