import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../contexts/AuthContext';

const BASE_URL = 'https://coffeehouse-4yii.onrender.com/api/trainings';

const AdminTrainings = () => {
  const { authData } = useContext(AuthContext);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    fees: '',
    level: 'Beginner',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await axios.get(BASE_URL, {
        headers: {
          Authorization: authData ? `Bearer ${authData.token}` : '',
        },
      });
      setTrainings(res.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
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
        description: '',
        duration: '',
        fees: '',
        level: 'Beginner',
      });
      setEditingId(null);
      fetchTrainings();
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  const handleEdit = (training) => {
    setFormData({
      title: training.title,
      description: training.description,
      duration: training.duration,
      fees: training.fees,
      level: training.level,
    });
    setEditingId(training._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
        fetchTrainings();
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  return (
    <div className="admin-trainings-container">
      <h2>Manage Trainings</h2>
      <form onSubmit={handleSubmit} className="training-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="fees"
          placeholder="Fees"
          value={formData.fees}
          onChange={handleChange}
          required
        />
        <select name="level" value={formData.level} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Training</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              duration: '',
              fees: '',
              level: 'Beginner',
            });
          }}>Cancel</button>
        )}
      </form>

      <table className="trainings-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration</th>
            <th>Fees</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map(training => (
            <tr key={training._id}>
              <td>{training.title}</td>
              <td>{training.duration}</td>
              <td>${training.fees}</td>
              <td>{training.level}</td>
              <td>
                <button onClick={() => handleEdit(training)}>Edit</button>
                <button onClick={() => handleDelete(training._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTrainings;
