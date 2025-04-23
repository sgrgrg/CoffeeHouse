import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../Css/ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const [status, setStatus] = useState("");
  const [mainBranch, setMainBranch] = useState(null);
  const [otherBranches, setOtherBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/branches");
        if (response.data && response.data.branch && response.data.branch.branches) {
          const branches = response.data.branch.branches;
          const main = branches.find((b) => b.isMain);
          const others = branches.filter((b) => !b.isMain);
          setMainBranch(main);
          setOtherBranches(others);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const response = await axios.post("http://localhost:5000/api/admin/messages", formData);
      if (response.status === 201) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", content: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      setStatus("Error sending message.");
      console.error(error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) return imagePath;
    return `http://localhost:5000/${imagePath}`;
  };

  return (
    <>
      <div className="contactform-container">
        <div className="contactform-left">
          <h2 className="mb-4 contactform-text-primary">Contact Us</h2>
          {status && <p className="contactform-status-message">{status}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="contactform-form-label">
                Name
              </label>
              <input
                type="text"
                className="contactform-form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="contactform-form-label">
                Email
              </label>
              <input
                type="email"
                className="contactform-form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="subject" className="contactform-form-label">
                Subject
              </label>
              <input
                type="text"
                className="contactform-form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
              />
            </div>
            <div>
              <label htmlFor="content" className="contactform-form-label">
                Message
              </label>
              <textarea
                className="contactform-form-control"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Your Message"
                rows="4"
              />
            </div>
            <button type="submit" className="contactform-btn-primary">
              Send Message
            </button>
          </form>
        </div>

        <div className="contactform-right">
          <h3 className="contactform-text-primary">Main Branch Details</h3>
          {mainBranch ? (
            <div className="contactform-branch-details">
              {mainBranch.image && (
                <img
                  src={getImageUrl(mainBranch.image)}
                  alt={mainBranch.location}
                  className="contactform-branch-image"
                />
              )}
              <div className="contactform-branch-info">
                <p><strong>Location:</strong> {mainBranch.location}</p>
                <p><strong>Emails:</strong> {mainBranch.emails ? mainBranch.emails.join(", ") : mainBranch.email}</p>
                <p><strong>Phone Numbers:</strong> {mainBranch.phoneNumbers ? mainBranch.phoneNumbers.join(", ") : "N/A"}</p>
                <div className="contactform-branch-social">
                  {mainBranch.fbLink && (
                    <a href={mainBranch.fbLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <FaFacebookF className="contactform-social-icon" />
                    </a>
                  )}
                  {mainBranch.instaLink && (
                    <a href={mainBranch.instaLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <FaInstagram className="contactform-social-icon" />
                    </a>
                  )}
                  {mainBranch.youtubeLink && (
                    <a href={mainBranch.youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <FaYoutube className="contactform-social-icon" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>No main branch details available.</p>
          )}
        </div>
      </div>

      <div className="container my-4">
        <h3 className="contactform-text-primary">Other Branches</h3>
        {otherBranches.length > 0 ? (
          otherBranches.map((branch) => (
            <div key={branch._id} className="contactform-branch-details" style={{ marginBottom: "15px" }}>
              {branch.image && (
                <img
                  src={getImageUrl(branch.image)}
                  alt={branch.location}
                  className="contactform-branch-image"
                />
              )}
              <div className="contactform-branch-info">
                <p><strong>Location:</strong> {branch.location}</p>
                <p><strong>Emails:</strong> {branch.emails ? branch.emails.join(", ") : branch.email}</p>
                <p><strong>Phone Numbers:</strong> {branch.phoneNumbers ? branch.phoneNumbers.join(", ") : "N/A"}</p>
                <div className="contactform-branch-social">
                  {branch.fbLink && (
                    <a href={branch.fbLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <FaFacebookF className="contactform-social-icon" />
                    </a>
                  )}
                  {branch.instaLink && (
                    <a href={branch.instaLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <FaInstagram className="contactform-social-icon" />
                    </a>
                  )}
                  {branch.youtubeLink && (
                    <a href={branch.youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <FaYoutube className="contactform-social-icon" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No other branches available.</p>
        )}
      </div>
    </>
  );
};

export default ContactForm;
