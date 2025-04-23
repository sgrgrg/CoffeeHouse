import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </AuthProvider>
  );
};

export default Layout;
