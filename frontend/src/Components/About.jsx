import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/About.css";

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get("https://coffeehouse-4yii.onrender.com//api/about");
      setAboutData(response.data);
    } catch (error) {
      console.error("Error fetching About data:", error);
    }
  };

  if (!aboutData) {
    return <div className="about-loading">Loading...</div>;
  }

  return (
    <div className="about-about-container">
      {Object.entries(aboutData).map(([key, section]) => {
        if (key === "meetTheTeam" && Array.isArray(section)) {
          if (section.length === 0) return null;
          return (
            <section key={key} className="about-about-section">
              <h2 className="about-section-title">Meet the Team / Our Culture</h2>
              <div className="about-team-members">
                {section.map((member, index) => {
                  if (!member.title && !member.content && !member.image) return null;
                  return (
                    <div key={index} className="about-team-member-card">
                      {member.image && (
                        <img
                          src={
                            member.image.startsWith("/uploads/")
                              ? `https://coffeehouse-4yii.onrender.com/${member.image}`
                              : member.image
                          }
                          alt={member.title}
                          className="about-team-member-image"
                        />
                      )}
                      <h3 className="about-team-member-title">{member.title}</h3>
                      <p className="about-team-member-content">{member.content}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        } else {
          if (!section.content && !section.image) return null;
          return (
            <section key={key} className="about-about-section">
              <h2 className="about-section-title">{section.title}</h2>
              {section.image && (
                <div className="about-image-wrapper">
                  <img
                    src={
                      section.image.startsWith("/uploads/")
                        ? `https://coffeehouse-4yii.onrender.com/${section.image}`
                        : section.image
                    }
                    alt={section.title}
                    className="about-section-image"
                  />
                </div>
              )}
              <p className="about-section-content">{section.content}</p>
              {key === "whyChooseUs" && section.testimonials && section.testimonials.length > 0 && (
                <div className="about-testimonials-container">
                  <h3 className="about-testimonials-title">Testimonials</h3>
                  <div className="about-testimonials-list">
                    {section.testimonials.map((test, index) => (
                      <div key={index} className="about-testimonial-card">
                        <p className="about-testimonial-text">"{test.text}"</p>
                        <p className="about-testimonial-author">- {test.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        }
      })}
    </div>
  );
};

export default About;
