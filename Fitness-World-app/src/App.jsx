import Navbar from "./components/Navbar";
import SignUpForm from "./components/SignUpForm";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function Home() {
  return <h1>Home</h1>;
}
function About() {
  return <h1>About</h1>;
}

export default function App() {
  return (
    <div>
      <Navbar />
      <nav style={{ padding: "1rem" }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>
        <Link to="/signup" style={{ marginRight: 12 }}>
          Sign up
        </Link>
        <Link to="/about">About</Link>
      </nav>

      <main style={{ padding: "1rem 2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </main>
    </div>
  );
}
