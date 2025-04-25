import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const ServiceTable = ({
  services,
  selectedServices,
  onSelectService,
  onEdit,
  onDelete,
  onFeature,
  sortConfig,
  onSort,
  loading,
}) => {
  const getSortIcon = (key) => {
    if (!sortConfig) return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return null;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    onSort({ key, direction });
  };

  return (
    <table className="service-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={services.length > 0 && selectedServices.size === services.length}
              onChange={() => {
                if (selectedServices.size === services.length) {
                  onSelectService(new Set());
                } else {
                  onSelectService(new Set(services.map(s => s._id)));
                }
              }}
            />
          </th>
          <th className="sortable" onClick={() => handleSort('title')}>
            Title {getSortIcon('title')}
          </th>
          <th>Description</th>
          <th>Image</th>
          <th className="sortable" onClick={() => handleSort('isFeatured')}>
            Featured {getSortIcon('isFeatured')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {services.length === 0 && (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>
              {loading ? 'Loading...' : 'No services found.'}
            </td>
          </tr>
        )}
        {services.map(service => (
          <tr key={service._id} className={service.isFeatured ? 'featured-row' : ''}>
            <td>
              <input
                type="checkbox"
                checked={selectedServices.has(service._id)}
                onChange={() => {
                  const newSelected = new Set(selectedServices);
                  if (newSelected.has(service._id)) {
                    newSelected.delete(service._id);
                  } else {
                    newSelected.add(service._id);
                  }
                  onSelectService(newSelected);
                }}
              />
            </td>
            <td>{service.title}</td>
            <td>{service.description}</td>
            <td>
              <img
                src={`https://coffeehouse-4yii.onrender.com${service.image}`}
                alt={service.title}
                className="service-image"
              />
            </td>
            <td>{service.isFeatured ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(service)}>Edit</button>
              <button onClick={() => onDelete(service._id)}>Delete</button>
              <button onClick={() => onFeature(service._id)}>
                {service.isFeatured ? 'Unfeature' : 'Feature'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', image: null });
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);

  const maxTitleLength = 50;
  const maxDescriptionLength = 200;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://coffeehouse-4yii.onrender.com/api/service');
      setServices(response.data);
      setFeaturedServices(response.data.filter(service => service.isFeatured).slice(0, 4));
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (isEdit) {
      setEditImagePreview(file ? URL.createObjectURL(file) : null);
      setNewService(prev => ({ ...prev, image: file }));
    } else {
      setImagePreview(file ? URL.createObjectURL(file) : null);
      setNewService(prev => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditingService(prev => ({ ...prev, [name]: value }));
    } else {
      setNewService(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.description.trim()) {
      alert('Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      if (newService.image) formData.append('image', newService.image);

      const response = await axios.post('https://coffeehouse-4yii.onrender.com/api/service', formData);
      alert(response.data.message);
      setNewService({ title: '', description: '', image: null });
      setImagePreview(null);
      document.getElementById('image-input').value = '';
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingService.title.trim() || !editingService.description.trim()) {
      alert('Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editingService.title);
      formData.append('description', editingService.description);
      if (newService.image) formData.append('image', newService.image);

      const response = await axios.put(`https://coffeehouse-4yii.onrender.com/api/service/${editingService._id}`, formData);
      alert(response.data.message);
      setEditingService(null);
      setEditImagePreview(null);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    try {
      const response = await axios.delete(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`);
      alert(response.data.message);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureService = async (serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;
    const isAddingToFeatured = !service.isFeatured;
    if (isAddingToFeatured && featuredServices.length >= 4) {
      alert('Only 4 services can be featured at a time.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`, { isFeatured: isAddingToFeatured });
      alert(response.data.message);
      fetchServices();
    } catch (error) {
      console.error('Error updating featured status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (newSelected) => {
    setSelectedServices(newSelected);
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortConfig !== null) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [services, searchTerm, sortConfig]);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showEditModal, setShowEditModal] = useState(false);

  const openEditModal = (service) => {
    setEditingService(service);
    setEditImagePreview(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingService(null);
    setEditImagePreview(null);
    setShowEditModal(false);
  };

  return (
    <div className="admin-service">
      <h1>Admin Service Management</h1>

      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="service-form">
        <h3>Add New Service</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newService.title}
          onChange={e => handleInputChange(e)}
          maxLength={maxTitleLength}
          required
        />
        <div className="character-count">{newService.title.length}/{maxTitleLength}</div>

        <textarea
          name="description"
          placeholder="Description"
          value={newService.description}
          onChange={e => handleInputChange(e)}
          maxLength={maxDescriptionLength}
          required
        />
        <div className="character-count">{newService.description.length}/{maxDescriptionLength}</div>

        <input id="image-input" type="file" accept="image/*" onChange={e => handleImageChange(e)} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</button>
      </form>

      <div className="bulk-actions">
        <button
          onClick={() => {
            if (selectedServices.size === currentServices.length) {
              handleSelectService(new Set());
            } else {
              handleSelectService(new Set(currentServices.map(s => s._id)));
            }
          }}
        >
          {selectedServices.size === currentServices.length ? 'Deselect All' : 'Select All'}
        </button>
        <button onClick={async () => {
          if (selectedServices.size === 0) {
            alert('No services selected for deletion.');
            return;
          }
          if (!window.confirm(`Are you sure you want to delete ${selectedServices.size} selected services?`)) return;
          setLoading(true);
          try {
            await Promise.all(Array.from(selectedServices).map(serviceId =>
              axios.delete(`https://coffeehouse-4yii.onrender.com/api/service/${serviceId}`)
            ));
            alert('Selected services deleted successfully.');
            handleSelectService(new Set());
            fetchServices();
          } catch (error) {
            console.error('Error deleting selected services:', error);
          } finally {
            setLoading(false);
          }
        }} disabled={loading || selectedServices.size === 0}>
          {loading ? 'Deleting...' : 'Delete Selected'}
        </button>
      </div>

      <ServiceTable
        services={currentServices}
        selectedServices={selectedServices}
        onSelectService={handleSelectService}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onFeature={handleFeatureService}
        sortConfig={sortConfig}
        onSort={handleSort}
        loading={loading}
      />

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

      {showEditModal && (
        <div className="edit-service-modal">
          <h3>Edit Service</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="title"
              value={editingService.title}
              onChange={e => handleInputChange(e, true)}
              maxLength={maxTitleLength}
              required
            />
            <div className="character-count">{editingService.title.length}/{maxTitleLength}</div>

            <textarea
              name="description"
              value={editingService.description}
              onChange={e => handleInputChange(e, true)}
              maxLength={maxDescriptionLength}
              required
            />
            <div className="character-count">{editingService.description.length}/{maxDescriptionLength}</div>

            <input type="file" accept="image/*" onChange={e => handleImageChange(e, true)} />
            {editImagePreview && <img src={editImagePreview} alt="Edit Preview" className="image-preview" />}

            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Updating...' : 'Update Service'}</button>
            <button type="button" className="cancel-btn" onClick={closeEditModal} disabled={loading}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminService;
