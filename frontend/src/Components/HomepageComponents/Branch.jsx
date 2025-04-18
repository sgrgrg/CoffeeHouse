import React, { useEffect, useState } from 'react';
import "../../Css/HomepageComponents/Branch.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const Branch = () => {
  const [featuredBranches, setFeaturedBranches] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Fetch branch details and featured branches from the backend
  useEffect(() => {
    AOS.init({
      duration: 1200, 
      easing: 'ease-in-out',
    });

    // Fetch the branches and title/description
    axios.get('http://localhost:5000/api/branch')
      .then((response) => {
        const allBranches = response.data.branch?.branches || [];
        const featured = allBranches.filter(branch => branch.featured);
        setFeaturedBranches(featured);
        
        // Set title and description
        setTitle(response.data.branch?.title || "Find Us");
        setDescription(response.data.branch?.description || "Himalayan Java outlets are available with the best coffee throughout the major cities of Nepal.");
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="branch-container py-5">
      <div className="container text-center">
        <h2 className="findus-title" data-aos="fade-up">{title}</h2>
        <p className="findus-description" data-aos="fade-up" data-aos-delay="200">
          {description}
        </p>

        <div className="row row-findus justify-content-center">
          {featuredBranches.length > 0 ? (
            featuredBranches.map((branch, index) => (
              <div key={branch._id} className="col-6 col-md-3 mb-4" data-aos="zoom-in" data-aos-delay={(index + 1) * 100}>
                <div className="branch">
                  <img
                    src={`http://localhost:5000/${branch.image}`} 
                    alt={branch.location} 
                    className="img-fluid branch-img"
                    onClick={() => openModal(`http://localhost:5000/${branch.image}`)} // Open modal with the clicked image
                  />
                  <p className="branch-location">{branch.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No featured branches available at the moment.</p>
          )}
        </div>
      </div>

      {/* Modal for full-screen image */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <img src={selectedImage} alt="Full screen" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;
