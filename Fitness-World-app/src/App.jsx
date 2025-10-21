import Navbar from "./components/Navbar";
import SignUpForm from "./components/SignUpForm";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Plans from "./pages/Plans";
import About from "./pages/AboutUs";
import Blog from "./pages/Blog";
import OurTeam from "./pages/OurTeam";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/OurTeam" element={<OurTeam />} />
      </Routes>
    </>
  );
}
