import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../Css/Footer.css';

import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const [mainBranch, setMainBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMainBranch = async () => {
      try {
        const res = await axios.get("https://coffeehouse-4yii.onrender.com//api/admin/branches");
        const branches = res.data.branch.branches;
        const main = branches.find(branch => branch.isMain);
        setMainBranch(main);
      } catch (err) {
        setError("Failed to load contact details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMainBranch();
  }, []);

  if (loading) {
    return (
      <footer className="footer container-fluid py-4">
        <div className="container text-center">Loading contact details...</div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="footer container-fluid py-4">
        <div className="container text-center text-danger">{error}</div>
      </footer>
    );
  }

  if (!mainBranch) {
    return (
      <footer className="footer container-fluid py-4">
        <div className="container text-center">No main branch contact details available.</div>
      </footer>
    );
  }

  return (
    <footer className="footer container-fluid py-4">
      <div className="container">
        <div className="row">
          {/* Left Side - Navigation Links */}
          <div className="col-md-3">
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/service">Services</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Center - Contact Details */}
          <div className="col-md-5 text-center">
            <h5 className="tite-contact">Contact</h5>
            <p className="tite-contact-detail">{mainBranch.location}</p>
            {mainBranch.emails && mainBranch.emails.map((email, idx) => (
              <p key={idx} className="tite-contact-detail">Email: {email}</p>
            ))}
            {mainBranch.phoneNumbers && mainBranch.phoneNumbers.map((phone, idx) => (
              <p key={idx} className="tite-contact-detail">Phone: {phone}</p>
            ))}
          </div>

          {/* Right Side - Google Maps */}
          <div className="col-md-4">
            <iframe
              title="Map"
              width="100%"
              height="250"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.65322787261!2d85.24373135767756!3d27.708935957714655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1738050874736!5m2!1sen!2snp`}
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
            {mainBranch.fbLink && (
              <a href={mainBranch.fbLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="social-icon" />
              </a>
            )}
            {mainBranch.youtubeLink && (
              <a href={mainBranch.youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube className="social-icon" />
              </a>
            )}
            {mainBranch.instaLink && (
              <a href={mainBranch.instaLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>
            )}
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

