import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: '',
    postedDate: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await axios.get('https://coffeehouse-4yii.onrender.com/api/careers');
      setCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://coffeehouse-4yii.onrender.com/api/careers/${editingId}`, formData);
      } else {
        await axios.post('https://coffeehouse-4yii.onrender.com/api/careers', formData);
      }
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: '',
        postedDate: '',
      });
      setEditingId(null);
      fetchCareers();
    } catch (error) {
      console.error('Error saving career:', error);
    }
  };

  const handleEdit = career => {
    setFormData({
      title: career.title,
      description: career.description,
      requirements: career.requirements,
      location: career.location,
      type: career.type,
      postedDate: career.postedDate ? new Date(career.postedDate).toISOString().substr(0, 10) : '',
    });
    setEditingId(career._id);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://coffeehouse-4yii.onrender.com/api/careers/${id}`);
      fetchCareers();
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  return (
    <div className="admin-careers-container">
      <h1>Manage Careers</h1>
      <form onSubmit={handleSubmit} className="admin-careers-form">
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
        <textarea
          name="requirements"
          placeholder="Requirements"
          value={formData.requirements}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g., Full-time)"
          value={formData.type}
          onChange={handleChange}
        />
        <input
          type="date"
          name="postedDate"
          placeholder="Posted Date"
          value={formData.postedDate}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Career</button>
      </form>
      <div className="admin-careers-list">
        {careers.map(career => (
          <div key={career._id} className="admin-career-item">
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <button onClick={() => handleEdit(career)}>Edit</button>
            <button onClick={() => handleDelete(career._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCareers;
