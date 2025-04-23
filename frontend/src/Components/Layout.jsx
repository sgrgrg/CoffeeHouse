import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default Layout;
