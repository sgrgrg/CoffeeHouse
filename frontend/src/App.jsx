import React from "react";


import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Trainings from "./Components/Trainings";
import Service from "./Components/Service";
import Admin from "./AdminDashboard/Admin";
import Footer from "./Components/Footer";
import Menu from "./Components/Menu";
import CV from "./Components/CV";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service/>}/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/menu" element={<Menu/>} />
        <Route path="/cv" element={<CV/>} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
