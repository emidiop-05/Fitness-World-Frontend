import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SignUpForm from "./components/SignUpForm";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useState } from "react";

import Home from "./pages/Home";
import Plans from "./pages/Plans";
import About from "./pages/AboutUs";
import Blog from "./pages/Blog";
import OurTeam from "./pages/OurTeam";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/OurTeam" element={<OurTeam />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}
