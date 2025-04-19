import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../Css/HomepageComponents/Menu.css";

const Menu = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [title, setTitle] = useState("Menu");
  const [description, setDescription] = useState(
    "While most of the food in our menu changes from kitchen to kitchen and from cook to cook, what remains the same is our product from the bakery."
  );

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 1000 });

    // Fetch menu title, description, and featured items from backend
    axios
      .get("https://coffeehouse-4yii.onrender.comapi/menu")
      .then((res) => {
        const { menuItems, titleDescribe } = res.data;
        const featured = Array.isArray(menuItems) ? menuItems.filter((item) => item.featured) : [];
        setFeaturedItems(featured);

        if (titleDescribe) {
          setTitle(titleDescribe.title || "Menu");
          setDescription(titleDescribe.description || "");
        }
      })
      .catch((err) => console.error("Failed to fetch menu data:", err));
  }, []);

  return (
    <div className="menu-container container">
      {/* Page Title */}
      <h2 className="text-center mb-3 menu-title" data-aos="fade-up">
        {title}
      </h2>

      {/* Page Description */}
      <p className="text-center mb-4 menu-describe" data-aos="fade-up" data-aos-delay="200">
        {description}
      </p>

      {/* Link to Full Menu */}
      <div className="text-end mt-4" data-aos="fade-up" data-aos-delay="400">
        <a href="/menu" className="view-all-link">
          View All
        </a>
      </div>

      {/* Featured Menu Items */}
      <div className="row menu-row">
        {featuredItems.length > 0 ? (
          featuredItems.map((item, index) => (
            <div
              key={index}
              className="col-md-4 col-sm-6 mb-3"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`} // Stagger animation
            >
              <div className="menu-item d-flex align-items-center">
                <img
                  src={`https://coffeehouse-4yii.onrender.com${item.image}`}
                  alt={item.name}
                  className="menu-img me-3"
                />
                <div>
                  <h5 className="menu-name">{item.name}</h5>
                  <p className="menu-price">Rs. {item.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center" data-aos="fade-up">
            No featured items available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
