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
  const [sideNavOpen, setSideNavOpen] = useState(false);

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

  const openSideNav = () => {
    setSideNavOpen(true);
  };

  const closeSideNav = () => {
    setSideNavOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light navbar-transparent fixed-top">
        <div className="container">
          <Link className="navbar-brand d-lg-none" to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>

          <button
            className="side-navbar-toggle-btn d-lg-none"
            aria-label="Open navigation menu"
            onClick={openSideNav}
          >
            &#9776;
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

      {/* Side Navbar for Mobile */}
      <div
        className={`side-navbar ${sideNavOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <button className="close-btn" aria-label="Close navigation menu" onClick={closeSideNav}>
          &times;
        </button>
        <ul className="navbar-nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={closeSideNav}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about" onClick={closeSideNav}>About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/service" onClick={closeSideNav}>Service</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trainings" onClick={closeSideNav}>Trainings</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact" onClick={closeSideNav}>Contact</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cv" onClick={closeSideNav}>CV</Link>
          </li>
          {!authData ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeSideNav}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register" onClick={closeSideNav}>Register</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile" onClick={closeSideNav}>Profile</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => { handleLogout(); closeSideNav(); }}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {sideNavOpen && <div className="side-navbar-overlay" onClick={closeSideNav} aria-hidden="true"></div>}
    </>
  );
};

export default Navbar;
