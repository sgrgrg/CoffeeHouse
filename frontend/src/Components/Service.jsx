// Components/Service.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Css/Service.css";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles

const Service = () => {
  const [services, setServices] = useState([]); // State to hold services
  const [error, setError] = useState(""); // State to track errors
  const [loading, setLoading] = useState(true); // State to show loading state
  const [title, setTitle] = useState(""); // State for title
  const [description, setDescription] = useState(""); // State for description

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("backend-production-402e.up.railway.app/api/service");
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTitleDescribeService = async () => {
      try {
        const response = await axios.get("backend-production-402e.up.railway.app/api/service/title-describe");
        if (response.data.length > 0) {
          setTitle(response.data[0].title);
          setDescription(response.data[0].description);
        }
      } catch (error) {
        console.error("Error fetching title and description:", error);
      }
    };

    fetchServices();
    fetchTitleDescribeService();
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, []);

  return (
    <div className="container my-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="service-title1" data-aos="fade-down">
          {title || "Our Services"}
        </h1>
        <p className="service-describe1" data-aos="fade-up">
          {description || "Explore our range of premium services designed to meet your needs."}
        </p>
      </div>

      {/* Error Message */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Loading Indicator */}
      {loading && <p className="text-center">Loading services...</p>}

      {/* Services Section */}
      <div className="row">
        {!loading &&
          services.map((service, index) => (
            <div
              key={service._id}
              className="col-md-4 mb-4"
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              <div className="service-card text-center p-4">
                {service.image && (
                  <img
                    src={`backend-production-402e.up.railway.app${service.image}`}
                    alt={service.title}
                    className="service-image mb-3"
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                )}
                <h5 className="service-card-title1">{service.title}</h5>
                <p className="service-card-describe1">{service.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Service;
