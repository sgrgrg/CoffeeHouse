import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Css/HomepageComponents/Review.css";

import "aos/dist/aos.css"; 
import AOS from "aos";

const Review = () => {
  const [featuredReviews, setFeaturedReviews] = useState([]);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1200, // Animation duration (in milliseconds)
      easing: "ease-in-out", // Animation easing
   
    
    });

    // Fetch featured reviews
    const fetchFeaturedReviews = async () => {
      try {
        const { data } = await axios.get("https://coffeehouse-4yii.onrender.com//api/reviews");
        // Filter for featured reviews
        const filteredReviews = Array.isArray(data) ? data.filter((review) => review.isFeatured) : [];
        setFeaturedReviews(filteredReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchFeaturedReviews();
  }, []);

  return (
    <div className="container mt-5" data-aos="fade-up">
      <div
        id="reviewCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {featuredReviews.length > 0 ? (
            featuredReviews.map((review, index) => (
              <div
                key={review._id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div
                  className="review-card d-flex flex-column flex-lg-row align-items-center"
                  data-aos="zoom-in" // Animation for the entire card
                  data-aos-delay="200" // Adds a delay for staggered effect
                >
                  <div
                    className="reviewer-container text-center"
                    data-aos="fade-right" // Animation for the reviewer section
                    data-aos-delay="400"
                  >
                    <div className="reviewer-img-container">
                      <img
                        src={`https://coffeehouse-4yii.onrender.com//${review.image}`}
                        alt="Reviewer"
                        className="reviewer-img"
                        data-aos="flip-right" // Animation for the image
                        data-aos-delay="600"
                      />
                    </div>
                    <h5 className="reviewer-name">{review.name}</h5>
                    <p className="reviewer-rating">
                      {"⭐".repeat(review.rating)}
                    </p>
                  </div>
                  <div
                    className="review-content ms-lg-4 text-center text-lg-start"
                    data-aos="fade-left" // Animation for the content
                    data-aos-delay="800"
                  >
                    <span className="quote-mark">“</span>
                    <p>{review.comment}</p>
                    <span className="quote-mark1">”</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center" data-aos="fade-up">
              No featured reviews available
            </div>
          )}
        </div>

        {/* Carousel Controls */}
        {featuredReviews.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="prev"
              data-aos="fade-right"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="next"
              data-aos="fade-left"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
