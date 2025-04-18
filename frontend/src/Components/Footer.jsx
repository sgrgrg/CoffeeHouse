import React from "react";
import '../Css/Footer.css';

import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer container-fluid  py-4">
      <div className="container">
        <div className="row">
          {/* Left Side - Navigation Links */}
          <div className="col-md-3">
            <ul className="list-unstyled">
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Center - Contact Details */}
          <div className="col-md-5 text-center">
            <h5 className="tite-contact">Contact</h5>
            <p className="tite-contact-detail">Tridevi Marg, Thamel</p>
            <p className="tite-contact-detail">Kathmandu, Nepal</p>
            <p className="tite-contact-detail">Email: info@himalayanjava.com</p>
            <p className="tite-contact-detail">Phone: +977-(01)-4435171</p>
          </div>

          {/* Right Side - Google Maps */}
          <div className="col-md-4">
            <iframe
              title="Map"
              width="100%"
              height="250"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.65322787261!2d85.24373135767756!3d27.708935957714655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1738050874736!5m2!1sen!2snp"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="row mt-3 text-center">
          {/* Copyright & Social Icons */}
          <div className="col-md-5 text-start">
            <p>Copyright © 2021 Himalayan Java</p>
          </div>
          <div className="col-md-2 text-end">
            <FaFacebookF className="social-icon" />
            <FaYoutube className="social-icon" />
            <FaInstagram className="social-icon" />
          </div>
          <div className="col-md-5 text-end">
            <p>Created By Sagar Gurung</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

