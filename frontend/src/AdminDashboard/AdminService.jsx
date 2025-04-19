import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });
  const [editingService, setEditingService] = useState(null);

  const maxTitleLength = 50;
  const maxDescriptionLength = 200;

  useEffect(() => {
    axios
      .get('https://coffeehouse-4yii.onrender.comapi/service')
      .then((response) => {
        setServices(response.data);
        setFeaturedServices(response.data.filter((service) => service.isFeatured).slice(0, 4));
      })
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewService((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    formData.append('image', newService.image);

    axios
      .post('https://coffeehouse-4yii.onrender.comapi/service', formData)
      .then((response) => {
        alert(response.data.message);
        setNewService({ title: '', description: '', image: '' });
        document.getElementById('image-input').value = '';
        setServices((prev) => [...prev, response.data.service]);
      })
      .catch((error) => console.error('Error creating service:', error));
  };

  const handleFeatureService = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    if (!service) return;

    const isAddingToFeatured = !service.isFeatured;
    if (isAddingToFeatured && featuredServices.length >= 4) {
      alert('Only 4 services can be featured at a time.');
      return;
    }

    axios
      .put(`https://coffeehouse-4yii.onrender.comapi/service/${serviceId}`, { isFeatured: isAddingToFeatured })
      .then((response) => {
        alert(response.data.message);
        setServices((prev) =>
          prev.map((s) =>
            s._id === serviceId ? { ...s, isFeatured: isAddingToFeatured } : s
          )
        );
        setFeaturedServices((prev) =>
          isAddingToFeatured
            ? [response.data.service, ...prev].slice(0, 4)
            : prev.filter((s) => s._id !== serviceId)
        );
      })
      .catch((error) => console.error('Error updating featured status:', error));
  };

  const handleUpdate = (e, serviceId) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', editingService.title);
    formData.append('description', editingService.description);

    if (newService.image) {
      formData.append('image', newService.image);
    }

    axios
      .put(`https://coffeehouse-4yii.onrender.comapi/service/${serviceId}`, formData)
      .then((response) => {
        alert(response.data.message);
        setEditingService(null);
        setServices((prev) =>
          prev.map((service) =>
            service._id === serviceId ? response.data.service : service
          )
        );
      })
      .catch((error) => console.error('Error updating service:', error));
  };

  const handleDelete = (serviceId) => {
    axios
      .delete(`https://coffeehouse-4yii.onrender.comapi/service/${serviceId}`)
      .then((response) => {
        alert(response.data.message);
        setServices((prev) => prev.filter((service) => service._id !== serviceId));
        setFeaturedServices((prev) =>
          prev.filter((service) => service._id !== serviceId)
        );
      })
      .catch((error) => console.error('Error deleting service:', error));
  };

  return (
    <div className="admin-service-container">
      <h1>Admin Service Management</h1>

      <form onSubmit={handleSubmit}>
        <h3>Add New Service</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
          maxLength={maxTitleLength}
        />
        <div className="character-count">
          Characters: {newService.title.length}/{maxTitleLength}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          maxLength={maxDescriptionLength}
        />
        <div className="character-count">
          Characters: {newService.description.length}/{maxDescriptionLength}
        </div>

        <input id="image-input" type="file" onChange={handleImageChange} />
        <button type="submit">Add Service</button>
      </form>

      <h3>All Services</h3>
      <div className="services-list">
        {services.map((service) => (
          <div key={service._id} className="service-item">
            <img src={`https://coffeehouse-4yii.onrender.com${service.image}`} alt={service.title} width="100" />
            <h4>{service.title}</h4>
            <p>{service.description}</p>
            <button onClick={() => setEditingService(service)}>Edit</button>
            <button onClick={() => handleDelete(service._id)}>Delete</button>
            <button onClick={() => handleFeatureService(service._id)}>
              {service.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="edit-service-form">
          <h3>Edit Service</h3>
          <input
            type="text"
            value={editingService.title}
            onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
            maxLength={maxTitleLength}
          />
          <div className="character-count">
            Characters: {editingService.title.length}/{maxTitleLength}
          </div>

          <textarea
            value={editingService.description}
            onChange={(e) =>
              setEditingService({ ...editingService, description: e.target.value })
            }
            maxLength={maxDescriptionLength}
          />
          <div className="character-count">
            Characters: {editingService.description.length}/{maxDescriptionLength}
          </div>

          <input type="file" onChange={handleImageChange} />
          <button onClick={(e) => handleUpdate(e, editingService._id)}>Update Service</button>
        </div>
      )}

      <h3>Featured Services</h3>
      <div className="featured-services">
        {featuredServices.map((service) => (
          <div key={service._id} className="service-item">
            <img src={`https://coffeehouse-4yii.onrender.com${service.image}`} alt={service.title} width="100" />
            <h4>{service.title}</h4>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminService;
