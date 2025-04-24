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
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [events, setEvents] = useState([]);

  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("https://coffeehouse-4yii.onrender.com/api/menu").then((res) => {
      const { menuItems } = res.data;
      setMenuItems(menuItems);
    });
    axios.get("https://coffeehouse-4yii.onrender.com/api/service").then((res) => {
      setServices(res.data);
    });
    axios.get("https://coffeehouse-4yii.onrender.com/api/branch").then((res) => {
      if (res.data && res.data.branch && Array.isArray(res.data.branch.branches)) {
        setBranches(res.data.branch.branches);
      }
    });
    axios.get("https://coffeehouse-4yii.onrender.com/api/training").then((res) => {
      setTrainings(res.data);
    });
    axios.get("https://coffeehouse-4yii.onrender.com/api/event").then((res) => {
      setEvents(res.data);
    });
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filteredMenu = menuItems.filter((item) =>
      item.name.toLowerCase().includes(lowerSearchTerm)
    );
    const filteredServ = services.filter((service) =>
      service.title.toLowerCase().includes(lowerSearchTerm)
    );
    const filteredBranch = branches.filter((branch) =>
      branch.location.toLowerCase().includes(lowerSearchTerm)
    );
    const filteredTrain = trainings.filter((training) =>
      training.title.toLowerCase().includes(lowerSearchTerm)
    );
    const filteredEvent = events.filter((event) =>
      event.title.toLowerCase().includes(lowerSearchTerm)
    );

    setFilteredMenuItems(filteredMenu);
    setFilteredServices(filteredServ);
    setFilteredBranches(filteredBranch);
    setFilteredTrainings(filteredTrain);
    setFilteredEvents(filteredEvent);

    setCurrentPage(1); // Reset to first page on new search
  }, [menuItems, services, branches, trainings, events, searchTerm]);

  const totalMenuPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const totalServicePages = Math.ceil(filteredServices.length / itemsPerPage);
  const totalBranchPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const totalTrainingPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const totalEventPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const displayedMenuItems = filteredMenuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const displayedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const displayedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const displayedTrainings = filteredTrainings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container menu-container" style={{ padding: '20px' }}>
      <h2>Search Results for: "{searchTerm}"</h2>
      {filteredMenuItems.length === 0 &&
      filteredServices.length === 0 &&
      filteredBranches.length === 0 &&
      filteredTrainings.length === 0 &&
      filteredEvents.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          {filteredMenuItems.length > 0 && (
            <>
              <h3>Menu Items</h3>
              <div className="row">
                {displayedMenuItems.map((item) => (
                  <div className="col-md-4 mb-3" key={item._id}>
                    <div className="card">
                      <img
                        src={`https://coffeehouse-4yii.onrender.com/${item.image}`}
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
                  {Array.from({ length: totalMenuPages }, (_, index) => (
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
          {filteredServices.length > 0 && (
            <>
              <h3>Services</h3>
              <div className="row">
                {displayedServices.map((service) => (
                  <div className="col-md-4 mb-3" key={service._id}>
                    <div className="card">
                      <img
                        src={`https://coffeehouse-4yii.onrender.com${service.image}`}
                        style={{ width: "100%", height: "150px", objectFit: "contain" }}
                        alt={service.title}
                        className="card-img-top"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{service.title}</h5>
                        <p className="card-text">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalServicePages }, (_, index) => (
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
          {filteredBranches.length > 0 && (
            <>
              <h3>Branches</h3>
              <div className="row">
                {displayedBranches.map((branch) => (
                  <div className="col-md-4 mb-3" key={branch._id}>
                    <div className="card">
                      {branch.image && (
                        <img
                          src={`https://coffeehouse-4yii.onrender.com/${branch.image}`}
                          alt={branch.location}
                          className="card-img-top"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{branch.location}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalBranchPages }, (_, index) => (
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
          {filteredTrainings.length > 0 && (
            <>
              <h3>Trainings</h3>
              <div className="row">
                {displayedTrainings.map((training) => (
                  <div className="col-md-4 mb-3" key={training._id}>
                    <div className="card">
                      {training.image && (
                        <img
                          src={`https://coffeehouse-4yii.onrender.com/${training.image}`}
                          alt={training.title}
                          className="card-img-top"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{training.title}</h5>
                        <p className="card-text">{training.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalTrainingPages }, (_, index) => (
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
          {filteredEvents.length > 0 && (
            <>
              <h3>Upcoming Events & Workshops</h3>
              <div className="row">
                {displayedEvents.map((event) => (
                  <div className="col-md-4 mb-3" key={event._id}>
                    <div className="card">
                      {event.image && (
                        <img
                          src={`https://coffeehouse-4yii.onrender.com/${event.image}`}
                          alt={event.title}
                          className="card-img-top"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalEventPages }, (_, index) => (
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
        </>
      )}
    </div>
  );
};

export default SearchResult;
