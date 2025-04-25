import React, { useState, useEffect } from "react";
import "../../Css/HomepageComponents/Banner.css";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import axios from "axios";
import AOS from "aos"; 
import "aos/dist/aos.css"; 
import bannerSvg from "../../assets/images/banner.svg";

const Banner = () => {
  const [bannerData, setBannerData] = useState({
    title: "",
    description: "",
    image: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    // Fetch banner data from backend
    axios.get("https://coffeehouse-4yii.onrender.com/api/banner")
      .then((res) => setBannerData(res.data || {}))
      .catch((err) => console.error(err));

    // Initialize AOS
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container">
      <div className="row">
        {/* Left Side */}
        <div className="banner-text" data-aos="fade-right"> 
          <h1 className="banner-title" data-aos="fade-up">{bannerData.title || "From Crop to Cup"}</h1> 
          <p className="banner-describe" data-aos="fade-up">{bannerData.description || "Himalayan Java Coffee Beans are grown locally and are roasted to perfection in the ideal Himalayan air. It is then packaged immediately and rushed off to our outlets, ensuring we deliver the best coffee experience possible for all of our customers."}</p> {/* AOS fade-up */}
          <a href="/menu" className="btn see-menu" data-aos="zoom-in">See Menu</a> 
          <div className="social-icons" data-aos="fade-left">
            {bannerData.facebook && (
              <a href={bannerData.facebook} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
            )}
            {bannerData.instagram && (
              <a href={bannerData.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
            )}
            {bannerData.youtube && (
              <a href={bannerData.youtube} className="social-link" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="banner-image" data-aos="fade-left"> 
          {bannerData.image ? (
            <img
              src={`https://coffeehouse-4yii.onrender.com/${bannerData.image}`}
              alt={bannerData.title || "Banner Image"}
              className="img-fluid animated-img"
            />
          ) : (
            <img
              src={bannerSvg}
              alt="Default Banner"
              className="img-fluid animated-img"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;