import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./Components/Layout";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/ContactForm";
import SearchResult from "./Components/SearchResult";
import Trainings from "./Components/Trainings";
import Service from "./Components/Service";
import Admin from "./AdminDashboard/Admin";
import Menu from "./Components/Menu";
import CV from "./Components/CV";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserProfile from "./Components/UserProfile";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
