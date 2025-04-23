import React, { useState, useEffect } from "react";
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
  const [mainBranch, setMainBranch] = useState(null);
  const [otherBranches, setOtherBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("https://coffeehouse-4yii.onrender.com/api/admin/branches");
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

      {mainBranch && (
        <div className="mb-4">
          <h3>Main Branch</h3>
          <p>Location: {mainBranch.location}</p>
          <p>Email: {mainBranch.email}</p>
          <p>
            Facebook:{" "}
            {mainBranch.fbLink ? (
              <a href={mainBranch.fbLink} target="_blank" rel="noopener noreferrer">
                {mainBranch.fbLink}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            Instagram:{" "}
            {mainBranch.instaLink ? (
              <a href={mainBranch.instaLink} target="_blank" rel="noopener noreferrer">
                {mainBranch.instaLink}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            YouTube:{" "}
            {mainBranch.youtubeLink ? (
              <a href={mainBranch.youtubeLink} target="_blank" rel="noopener noreferrer">
                {mainBranch.youtubeLink}
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      )}

      {otherBranches.length > 0 && (
        <div className="mb-4">
          <h3>Other Branches</h3>
          {otherBranches.map((branch) => (
            <div key={branch._id} style={{ marginBottom: "15px" }}>
              <p>Location: {branch.location}</p>
              <p>Email: {branch.email}</p>
              <p>
                Facebook:{" "}
                {branch.fbLink ? (
                  <a href={branch.fbLink} target="_blank" rel="noopener noreferrer">
                    {branch.fbLink}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                Instagram:{" "}
                {branch.instaLink ? (
                  <a href={branch.instaLink} target="_blank" rel="noopener noreferrer">
                    {branch.instaLink}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                YouTube:{" "}
                {branch.youtubeLink ? (
                  <a href={branch.youtubeLink} target="_blank" rel="noopener noreferrer">
                    {branch.youtubeLink}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          ))}
        </div>
      )}

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
