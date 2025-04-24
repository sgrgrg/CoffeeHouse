import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResult = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("https://coffeehouse-4yii.onrender.com//api/menu").then((res) => {
      const { menuItems } = res.data;
      setMenuItems(menuItems);
    });
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [menuItems, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container menu-container" style={{ padding: '20px' }}>
      <h2>Search Results for: "{searchTerm}"</h2>
      {filteredItems.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          <div className="row">
            {displayedItems.map((item) => (
              <div className="col-md-4 mb-3" key={item._id}>
                <div className="card">
                  <img
                    src={`https://coffeehouse-4yii.onrender.com//${item.image}`}
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
        </>
      )}
    </div>
  );
};

export default SearchResult;
