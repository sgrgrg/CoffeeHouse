import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Components/Layout";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/ContactForm";
import SearchResult from "./Components/SearchResult";
import Trainings from "./Components/Trainings";
import Service from "./Components/Service";
import Admin from "./AdminDashboard/Admin";
import Menu from "./Components/Menu";

import Login from "./Components/Login";
import Register from "./Components/Register";
import UserProfile from "./Components/UserProfile";
import Team from "./Components/Team";
import FAQs from "./Components/FAQs";
import Careers from "./Components/Careers";
import { AuthContext } from "./contexts/AuthContext";
import AdminRoute from "./Components/AdminRoute";

const ProtectedRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);
  if (!authData) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
    
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResult />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/team" element={<Team />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
