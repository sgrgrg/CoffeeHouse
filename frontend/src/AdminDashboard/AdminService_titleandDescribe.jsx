import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminServiceTitleAndDescribe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);

  // Set max character limits
  const maxTitleLength = 50; // Example: 50 characters for the title
  const maxDescriptionLength = 200; // Example: 200 characters for the description

  // Fetch the current title and description from the database
  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/service/title-describe");
      setServices(response.data);
      if (response.data.length > 0) {
        setTitle(response.data[0].title);
        setDescription(response.data[0].description);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the updated title and description to the server
      await axios.post("http://localhost:5000/api/service/title-describe", {
        title,
        description,
      });
      alert("Service details updated successfully!");

      // Re-fetch to get the updated values from the database
      fetchServices();
    } catch (error) {
      console.error("Error updating service details:", error);
    }
  };

  return (
    <div className="admin-service-container">
      <h2>Edit Service Title and Description</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            maxLength={maxTitleLength} // Limit the number of characters in the title
          />
          <div className="character-count">Characters: {title.length}/{maxTitleLength}</div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
            maxLength={maxDescriptionLength} // Limit the number of characters in the description
          ></textarea>
          <div className="character-count">Characters: {description.length}/{maxDescriptionLength}</div>
        </div>
        <button type="submit" className="btn-submit">Save Changes</button>
      </form>

      <h3>Current Service Title and Description</h3>
      {services.length > 0 && (
        <div className="service-info">
          <h4>{services[0].title}</h4>
          <p>{services[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default AdminServiceTitleAndDescribe;
