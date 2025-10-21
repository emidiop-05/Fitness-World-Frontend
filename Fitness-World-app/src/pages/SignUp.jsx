import SignUpForm from "../components/SignUpForm";
import style from "../pages/SignUp.module.css";
export default function SignUp() {
  return (
    <div>
      <SignUpForm className={style.SignUpForm}></SignUpForm>
    </div>
  );
}
