import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const maxTitleLength = 50;
  const maxDescriptionLength = 200;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    axios
      .get('https://coffeehouse-4yii.onrender.com/api/service')
      .then((response) => {
        setServices(response.data);
        setFeaturedServices(response.data.filter((service) => service.isFeatured).slice(0, 4));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewService((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setNewService((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEditImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.description.trim()) {
      alert('Title and description are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    formData.append('image', newService.image);

    axios
      .post('https://coffeehouse-4yii.onrender.com/api/service', formData)
      .then((response) => {
        alert(response.data.message);
        setNewService({ title: '', description: '', image: '' });
        setImagePreview(null);
        document.getElementById('image-input').value = '';
        fetchServices();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating service:', error);
        setLoading(false);
      });
  };

  const handleFeatureService = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    if (!service) return;

    const isAddingToFeatured = !service.isFeatured;
    if (isAddingToFeatured && featuredServices.length >= 4) {
      alert('Only 4 services can be featured at a time.');
      return;
    }

    setLoading(true);
    axios
      .put(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`, { isFeatured: isAddingToFeatured })
      .then((response) => {
        alert(response.data.message);
        fetchServices();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error updating featured status:', error);
        setLoading(false);
      });
  };

  const handleUpdate = (e, serviceId) => {
    e.preventDefault();
    if (!editingService.title.trim() || !editingService.description.trim()) {
      alert('Title and description are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', editingService.title);
    formData.append('description', editingService.description);

    if (newService.image) {
      formData.append('image', newService.image);
    }

    axios
      .put(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`, formData)
      .then((response) => {
        alert(response.data.message);
        setEditingService(null);
        setEditImagePreview(null);
        fetchServices();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error updating service:', error);
        setLoading(false);
      });
  };

  const handleDelete = (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    axios
      .delete(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`)
      .then((response) => {
        alert(response.data.message);
        fetchServices();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting service:', error);
        setLoading(false);
      });
  };

  const handleSelectService = (serviceId) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedServices.size === currentServices.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(currentServices.map((s) => s._id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedServices.size === 0) {
      alert('No services selected for deletion.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedServices.size} selected services?`)) return;
    setLoading(true);
    Promise.all(
      Array.from(selectedServices).map((serviceId) =>
        axios.delete(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`)
      )
    )
      .then(() => {
        alert('Selected services deleted successfully.');
        setSelectedServices(new Set());
        fetchServices();
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting selected services:', error);
        setLoading(false);
      });
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-service-container">
      <h1>Admin Service Management</h1>

      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

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
        {imagePreview && <img src={imagePreview} alt="Preview" width="100" style={{ marginTop: '10px' }} />}
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</button>
      </form>

      <h3>All Services</h3>
      <button onClick={handleSelectAll}>
        {selectedServices.size === currentServices.length ? 'Deselect All' : 'Select All'}
      </button>
      <button onClick={handleBulkDelete} disabled={loading || selectedServices.size === 0}>
        {loading ? 'Deleting...' : 'Delete Selected'}
      </button>

      {loading && <p>Loading services...</p>}

      <div className="services-list">
        {currentServices.map((service) => (
          <div key={service._id} className="service-item">
            <input
              type="checkbox"
              checked={selectedServices.has(service._id)}
              onChange={() => handleSelectService(service._id)}
            />
            <img src={`https://coffeehouse-4yii.onrender.com${service.image}`} alt={service.title} width="100" />
            <h4>{service.title}</h4>
            <p>{service.description}</p>
            <button onClick={() => setEditingService(service)}>Edit</button>
            <button onClick={() => handleDelete(service._id)} disabled={loading}>Delete</button>
            <button onClick={() => handleFeatureService(service._id)} disabled={loading}>
              {service.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredServices.length / servicesPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
            disabled={loading}
          >
            {i + 1}
          </button>
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

          <input type="file" onChange={handleEditImageChange} />
          {editImagePreview && <img src={editImagePreview} alt="Edit Preview" width="100" style={{ marginTop: '10px' }} />}
          <button onClick={(e) => handleUpdate(e, editingService._id)} disabled={loading}>
            {loading ? 'Updating...' : 'Update Service'}
          </button>
          <button onClick={() => { setEditingService(null); setEditImagePreview(null); }} disabled={loading}>
            Cancel
          </button>
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
