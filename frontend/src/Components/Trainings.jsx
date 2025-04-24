import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../Css/Trainings.css';
import { AuthContext } from '../contexts/AuthContext';

const Trainings = () => {
  const { authData } = useContext(AuthContext);
  const [trainings, setTrainings] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [enrollMessage, setEnrollMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingsRes, successStoriesRes, eventsRes] = await Promise.all([
          axios.get('https://coffeehouse-4yii.onrender.com//api/trainings'),
          axios.get('https://coffeehouse-4yii.onrender.com//api/student-success-stories'),
          axios.get('https://coffeehouse-4yii.onrender.com//api/events'),
        ]);
        setTrainings(trainingsRes.data);
        setSuccessStories(successStoriesRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (trainingId) => {
    try {
      const userId = authData ? authData.user.id : null;
      if (!userId) {
        setEnrollMessage('Please log in to enroll.');
        return;
      }
      const response = await axios.post('https://coffeehouse-4yii.onrender.com//api/trainings/enrollments/enroll', {
        userId,
        trainingId,
      }, {
        headers: {
          Authorization: `Bearer ${authData.token}`
        }
      });
      setEnrollMessage('Enrollment successful!');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setEnrollMessage(`Enrollment failed: ${error.response.data.message}`);
      } else {
        setEnrollMessage('Enrollment failed: Unknown error');
      }
    }
  };

  return (
    <div className="trainings-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Trainings</h1>
          <p>Enhance your skills with our expert-led training programs.</p>
          <button className="cta-button">Enroll Now</button>
        </div>
      </section>

      {/* Enrollment message */}
      {enrollMessage && <p className="enroll-message">{enrollMessage}</p>}

      {/* Trainings List */}
      <section className="programs-section" aria-label="Available Trainings">
        <h2>Available Trainings</h2>
        {trainings.length === 0 ? (
          <p>No trainings available at the moment.</p>
        ) : (
          <div className="programs-grid">
            {trainings.map(({ _id, title, description }) => (
              <div key={_id} className="program-card">
                <h3>{title}</h3>
                <p>{description}</p>
                <button className="enroll-button" onClick={() => handleEnroll(_id)}>Enroll</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <h2>Why Choose Us?</h2>
        <div className="highlights-grid">
          <div className="highlight-item">
            <span>🎓</span>
            <p>Expert Instructors</p>
          </div>
          <div className="highlight-item">
            <span>📚</span>
            <p>Comprehensive Curriculum</p>
          </div>
          <div className="highlight-item">
            <span>💼</span>
            <p>Career Support</p>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="testimonials-section" aria-label="Student Success Stories">
        <h2>Student Success Stories</h2>
        {successStories.length === 0 ? (
          <p>No success stories available.</p>
        ) : (
          <div className="testimonials-grid">
            {successStories.map(({ _id, photo, studentName, quote, rating, courseTaken }) => (
              <div key={_id} className="testimonial-card">
                <img
                  src={`https://coffeehouse-4yii.onrender.com/${photo}`}
                  alt={`Photo of ${studentName}`}
                />
                <p><strong>{studentName}</strong></p>
                <p>{quote}</p>
                <p>{'⭐'.repeat(rating)}</p>
                <p><em>{courseTaken}</em></p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events */}
      <section className="events-section" aria-label="Upcoming Events and Workshops">
        <h2>Upcoming Events & Workshops</h2>
        {events.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul className="events-list">
            {events.map(({ _id, date, time, location, title }) => (
              <li key={_id}>
                <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Location:</strong> {location}</p>
                {title && <p><strong>Title:</strong> {title}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Trainings;
