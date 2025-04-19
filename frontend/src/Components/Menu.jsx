import React, { useState, useEffect } from "react";
import axios from "axios";

import '../Css/Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState("Menu");
    const [description, setDescription] = useState(
      "While most of the food in our menu changes from kitchen to kitchen and from cook to cook, what remains the same is our product from the bakery."
    );
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("https:/coffeehouse-4yii.onrender.com/api/menu").then((res) => {
      const { menuItems , titleDescribe } = res.data;
      setMenuItems(menuItems);
      setFeaturedItems(menuItems.filter((item) => item.featured));
      if (titleDescribe) {
        setTitle(titleDescribe.title || "Menu");
        setDescription(titleDescribe.description || "");
      }
    });
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const displayedItems = filteredMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container menu-container">
    {/* Page Title */}
    <h2 className="text-center mb-3 menu-title">
        {title}
      </h2>

      {/* Page Description */}
      <p className="text-center mb-4 menu-describe" >
        {description}
      </p>


      <h2 style={{ color: "#6A3D2A" }}>Featured Items</h2>
      <div className="row">
        {featuredItems.map((item) => (
          <div className="col-md-4 mb-3" key={item._id}>
            <div className="card">
              <img
                src={`https:/coffeehouse-4yii.onrender.com/${item.image}`}
                alt={item.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Rs. {item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5" style={{ color: "#6A3D2A" }}>All Items</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {displayedItems.map((item) => (
          <div className="col-md-4 mb-3" key={item._id}>
            <div className="card">
              <img
                src={`https:/coffeehouse-4yii.onrender.com/${item.image}`}
                alt={item.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Rs. {item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
