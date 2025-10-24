import { useState } from "react";
import style from "../components/SignUpForm.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5005";
const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function SignUpForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
    countryCode: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [imgError, setImgError] = useState(false);

  const countries = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CV", name: "Cape Verde" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo (Democratic Republic)" },
    { code: "CR", name: "Costa Rica" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "EE", name: "Estonia" },
    { code: "ET", name: "Ethiopia" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GR", name: "Greece" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KR", name: "South Korea" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MX", name: "Mexico" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NA", name: "Namibia" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PA", name: "Panama" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "QA", name: "Qatar" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "RW", name: "Rwanda" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "ZA", name: "South Africa" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "TH", name: "Thailand" },
    { code: "TR", name: "Turkey" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" },
  ];

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");

      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || "Auto-login failed");

      localStorage.setItem("token", loginData.token);
      window.dispatchEvent(new Event("auth"));

      setMsg({
        type: "success",
        text: `Welcome, ${
          loginData.user?.firstName || data.firstName || "user"
        }!`,
      });

      // Reset
      setForm({
        firstName: "",
        lastName: "",
        nickName: "",
        email: "",
        password: "",
        birthday: "",
        gender: "",
        countryCode: "",
        profileImage: "",
      });
      setImgError(false);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.FormContainer}>
      <form onSubmit={onSubmit} className={style.Form}>
        <h2 className={style.Title}>Create account</h2>

        <div className={style.Field}>
          <label htmlFor="nickName">Nick Name</label>
          <input
            id="nickName"
            name="nickName"
            type="text"
            value={form.nickName}
            onChange={onChange}
            required
          />
        </div>

        <div className={style.Field}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={onChange}
            required
          />
        </div>

        <div className={style.Field}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={onChange}
            required
          />
        </div>

        <div className={style.Field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className={style.Field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={8}
          />
        </div>

        <div className={style.Row}>
          <div className={style.Field}>
            <label htmlFor="birthday">Birthday</label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={onChange}
              required
            />
          </div>

          <div className={style.Field}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={onChange}
              required
            >
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={style.Field}>
          <label htmlFor="countryCode">Country</label>
          <select
            id="countryCode"
            name="countryCode"
            value={form.countryCode}
            onChange={onChange}
            required
          >
            <option value="">Select…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={style.Submit} disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>

        {msg && (
          <p className={msg.type === "error" ? style.MsgError : style.MsgOk}>
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}
