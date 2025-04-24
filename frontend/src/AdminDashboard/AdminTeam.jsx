import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', photo: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get('https://coffeehouse-4yii.onrender.com//api/team');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    const data = new FormData();
    data.append('file', selectedFile);
    try {
      const res = await axios.post('https://coffeehouse-4yii.onrender.com//api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.filename; // Assuming backend returns { filename: 'uploadedfilename.ext' }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let photoFilename = formData.photo;
      if (selectedFile) {
        const uploadedFilename = await uploadImage();
        if (uploadedFilename) {
          photoFilename = uploadedFilename;
        }
      }
      const payload = { ...formData, photo: photoFilename };
      if (editingId) {
        await axios.put(`https://coffeehouse-4yii.onrender.com//api/team/${editingId}`, payload);
      } else {
        await axios.post('https://coffeehouse-4yii.onrender.com//api/team', payload);
      }
      setFormData({ name: '', position: '', bio: '', photo: '' });
      setSelectedFile(null);
      setEditingId(null);
      fetchTeam();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = member => {
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      photo: member.photo,
    });
    setEditingId(member._id);
    setSelectedFile(null);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://coffeehouse-4yii.onrender.com//api/team/${id}`);
      fetchTeam();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  return (
    <div className="admin-team-container">
      <h1>Manage Team Members</h1>
      <form onSubmit={handleSubmit} className="admin-team-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
        />
        {formData.photo && !selectedFile && (
          <div>
            <p>Current Photo:</p>
            <img
              src={`https://coffeehouse-4yii.onrender.com//uploads/${formData.photo}`}
              alt="Team Member"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
        )}
        <button type="submit">{editingId ? 'Update' : 'Add'} Team Member</button>
      </form>
      <div className="admin-team-list">
        {teamMembers.map(member => (
          <div key={member._id} className="admin-team-member">
            <h3>{member.name}</h3>
            <p>{member.position}</p>
            <button onClick={() => handleEdit(member)}>Edit</button>
            <button onClick={() => handleDelete(member._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeam;
