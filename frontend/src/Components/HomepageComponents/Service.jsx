// Components/HomepageComponents/Service.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Css/HomepageComponents/Service.css";
import AOS from "aos";
import "aos/dist/aos.css"; 

const Service = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS animations

    // Fetch the title and description from the API
    const fetchTitleDescribeService = async () => {
      try {
        const response = await axios.get("https://coffeehouse-4yii.onrender.com/api/service/title-describe");
        if (response.data.length > 0) {
          setTitle(response.data[0].title);
          setDescription(response.data[0].description);
        }
      } catch (error) {
        console.error("Error fetching title and description:", error);
      }
    };

    // Fetch only featured services
    const fetchFeaturedServices = async () => {
      try {
        const response = await axios.get("https://coffeehouse-4yii.onrender.com/api/service/featured");
        setFeaturedServices(response.data);
      } catch (error) {
        console.error("Error fetching featured services:", error);
      }
    };

    fetchTitleDescribeService();
    fetchFeaturedServices();
  }, []);

  return (
    <div className="container service-box">
      <div className="row">
        {/* Left Side: Service Introduction */}
        <div className="col-md-6">
          <h2 className="mb-4 home-title" data-aos="fade-up">
            {title || "Our Services"}
          </h2>
          <p className="service-describe" data-aos="fade-up">
            {description || "Explore the services we offer to meet your needs."}
          </p>
          <button className="btn service-button" data-aos="fade-up">
           <a href="/contact" >Contact Us</a>
          </button>
        </div>

        {/* Right Side: Featured Services */}
        <div className="col-md-6">
          <div className="row">
            {featuredServices.length > 0 ? (
              featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="col-md-6 mb-4 text-center"
                  data-aos="fade-up"
                >
                  <img
                    src={`https://coffeehouse-4yii.onrender.com${service.image}`}
                    alt={service.title}
                    className="service-icon mb-3"
                    width="80"
                    height="80"
                  />
                  <h5 className="mb-2 service-icon-title">{service.title}</h5>
                  <p className="service-icon-describe">{service.description}</p>
                </div>
              ))
            ) : (
              <p className="text-center" data-aos="fade-up">
                No featured services available at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
