import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../Css/AdminDashboard.css';
import { AuthContext } from '../contexts/AuthContext';

const BASE_URL = 'https://coffeehouse-4yii.onrender.com//api/events';

const AdminEvents = () => {
  const { authData } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData, {
          headers: {
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
      } else {
        await axios.post(BASE_URL, formData, {
          headers: {
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
      }
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      date: event.date ? event.date.substring(0,10) : '',
      time: event.time,
      location: event.location,
    });
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="admin-events-container">
      <h2>Manage Upcoming Events & Workshops</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          name="title"
          placeholder="Title (optional)"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Event</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              date: '',
              time: '',
              location: '',
            });
          }}>Cancel</button>
        )}
      </form>

      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.date ? event.date.substring(0,10) : ''}</td>
              <td>{event.time}</td>
              <td>{event.location}</td>
              <td>
                <button onClick={() => handleEdit(event)}>Edit</button>
                <button onClick={() => handleDelete(event._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEvents;
