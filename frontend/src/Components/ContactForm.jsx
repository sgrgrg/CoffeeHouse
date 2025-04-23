import React, { useState } from "react";
import axios from "axios";
import "../Css/ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const response = await axios.post("https://coffeehouse-4yii.onrender.com/api/admin/messages", formData);
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

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary">Contact Us</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Subject"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Message
          </label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Your Message"
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
