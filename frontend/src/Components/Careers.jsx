import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Careers.css';

const Careers = () => {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get('https://coffeehouse-4yii.onrender.com/api/careers');
        setCareers(response.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };
    fetchCareers();
  }, []);

  const handleApply = (title) => {
    alert(`Apply for ${title}`);
  };

  return (
    <div className="careers-container">
      <h1>Careers</h1>
      <div className="careers-list">
        {careers.map(career => (
          <div key={career._id} className="career-item">
            <h3 className="career-title">{career.title}</h3>
            <p className="career-description">{career.description}</p>
            <p className="career-requirements"><strong>Requirements:</strong> {career.requirements}</p>
            <p className="career-location"><strong>Location:</strong> {career.location}</p>
            <p className="career-type"><strong>Type:</strong> {career.type}</p>
            <p className="career-postedDate"><strong>Posted on:</strong> {new Date(career.postedDate).toLocaleDateString()}</p>
            <button className="apply-button" onClick={() => handleApply(career.title)}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Careers;
