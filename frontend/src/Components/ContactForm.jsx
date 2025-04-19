import React, { useState } from "react";
import axios from "axios";

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
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Subject:
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </label>
        <label>
          Message:
          <textarea name="content" value={formData.content} onChange={handleChange} required />
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;
