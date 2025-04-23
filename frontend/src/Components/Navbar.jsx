import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import '../Css/Navbar.css';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { authData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 0) {
        navbar.classList.add('bg-white', 'shadow-sm');
        navbar.classList.remove('navbar-transparent');
      } else {
        navbar.classList.remove('bg-white', 'shadow-sm');
        navbar.classList.add('navbar-transparent');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchVisible(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-transparent fixed-top">
      <div className="container">
        <Link className="navbar-brand d-lg-none" to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/service">Service</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trainings">Trainings</Link>
            </li>
          </ul>

          <Link className="navbar-brand d-none d-lg-block mx-5" to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>

          <ul className="navbar-nav  align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cv">CV</Link>
            </li>
            {!authData ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
            <li className="nav-item search-container">
              <button
                className="btn btn-link search-btn"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <i className="bi bi-search"></i>
              </button>
              {searchVisible && (
                <form className="search-form" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                </form>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
