import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import '../Css/AdminDashboard.css';
import { AuthContext } from '../contexts/AuthContext';

const BASE_URL = 'https://coffeehouse-4yii.onrender.com/api/student-success-stories';

const AdminStudentSuccessStories = () => {
  const { authData } = useContext(AuthContext);
  const fileInputRef = useRef(null); // ✅ Reference to the file input
  const [stories, setStories] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    quote: '',
    rating: 5,
    courseTaken: '',
    photo: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setStories(res.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('studentName', formData.studentName);
      data.append('quote', formData.quote);
      data.append('rating', formData.rating);
      data.append('courseTaken', formData.courseTaken);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
      } else {
        await axios.post(BASE_URL, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
      }

      setFormData({
        studentName: '',
        quote: '',
        rating: 5,
        courseTaken: '',
        photo: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // ✅ Clear file input
      }

      setEditingId(null);
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleEdit = (story) => {
    setFormData({
      studentName: story.studentName,
      quote: story.quote,
      rating: story.rating,
      courseTaken: story.courseTaken,
      photo: null,
    });
    setEditingId(story._id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: authData ? `Bearer ${authData.token}` : '',
          },
        });
        fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  return (
    <div className="admin-stories-container">
      <h2>Manage Student Success Stories</h2>
      <form onSubmit={handleSubmit} className="story-form">
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          required
        />
        <textarea
          name="quote"
          placeholder="Quote"
          value={formData.quote}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={formData.rating}
          min="1"
          max="5"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="courseTaken"
          placeholder="Course Taken"
          value={formData.courseTaken}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef} // ✅ Assign ref to file input
          required={!editingId}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Story</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({
              studentName: '',
              quote: '',
              rating: 5,
              courseTaken: '',
              photo: null,
            });
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}>Cancel</button>
        )}
      </form>

      <table className="stories-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Quote</th>
            <th>Rating</th>
            <th>Course Taken</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map(story => (
            <tr key={story._id}>
              <td>{story.studentName}</td>
              <td>{story.quote}</td>
              <td>{'⭐'.repeat(story.rating)}</td>
              <td>{story.courseTaken}</td>
              <td>
                {story.photo && <img src={`https://coffeehouse-4yii.onrender.com${story.photo}`} alt={story.studentName} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />}
              </td>
              <td>
                <button onClick={() => handleEdit(story)}>Edit</button>
                <button onClick={() => handleDelete(story._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStudentSuccessStories;
