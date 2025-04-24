import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.add("admin-route");
    } else {
      document.body.classList.remove("admin-route");
    }
  }, [isAdminRoute]);

  return (
    <AuthProvider>
      {!isAdminRoute && <Navbar />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}
    </AuthProvider>
  );
};

export default Layout;
