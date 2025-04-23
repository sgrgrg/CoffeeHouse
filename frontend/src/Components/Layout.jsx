import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  useEffect(() => {
    // Remove all classes from SVG elements and their parents, then add specific classes to fix visibility and styling
    const elements = document.querySelectorAll('svg');
    elements.forEach((el) => {
      // Remove all classes from SVG element
      el.className.baseVal.split(' ').forEach(cls => el.classList.remove(cls));
      // Add desired classes to SVG element
      el.classList.add('img-fluid', 'animated-img');

      const parent = el.parentElement;
      if (parent) {
        // Remove all classes from parent element
        parent.className.split(' ').forEach(cls => parent.classList.remove(cls));
        // Add desired class to parent element
        parent.classList.add('banner-image');
      }
    });
  }, []);

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
