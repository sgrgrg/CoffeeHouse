import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newItem, setNewItem] = useState({ name: "", price: "", image: null });
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", price: "", image: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = () => {
    setLoading(true);
    axios.get("https://coffeehouse-4yii.onrender.com//api/menu")
      .then((res) => {
        setMenuItems(res.data.menuItems || []);
        setTitle(res.data.titleDescribe?.title || "");
        setDescription(res.data.titleDescribe?.description || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleTitleDescriptionSubmit = (e) => {
    e.preventDefault();
    axios
      .put("https://coffeehouse-4yii.onrender.com//api/menu/title-describe", { title, description })
      .then((res) => alert(res.data.message))
      .catch((err) => console.error(err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItem((prev) => ({ ...prev, image: file }));
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
    setEditFormData((prev) => ({ ...prev, image: file }));
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

  const handleAddMenuItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.price.trim()) {
      alert("Name and price are required.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("image", newItem.image);

    axios.post("https://coffeehouse-4yii.onrender.com//api/menu/add", formData)
      .then((res) => {
        setMenuItems(res.data.menuItems);
        setNewItem({ name: "", price: "", image: null });
        setImagePreview(null);
        alert(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEditMenuItem = (e, id) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.price.trim()) {
      alert("Name and price are required.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("price", editFormData.price);
    if (editFormData.image) formData.append("image", editFormData.image);

    axios.put(`https://coffeehouse-4yii.onrender.com//api/menu/edit/${id}`, formData)
      .then((res) => {
        setMenuItems(res.data.menuItems);
        setEditingItem(null);
        setEditImagePreview(null);
        alert(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteMenuItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    setLoading(true);
    axios.delete(`https://coffeehouse-4yii.onrender.com//api/menu/delete/${id}`)
      .then((res) => {
        setMenuItems(res.data.menuItems);
        alert(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleToggleFeatured = (id) => {
    setLoading(true);
    axios.put(`https://coffeehouse-4yii.onrender.com//api/menu/toggle-featured/${id}`)
      .then((res) => {
        setMenuItems(res.data.menuItems);
        alert(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response?.data?.error || "An error occurred");
        setLoading(false);
      });
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === currentItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentItems.map((item) => item._id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) {
      alert("No menu items selected for deletion.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} selected menu items?`)) return;
    setLoading(true);
    Promise.all(
      Array.from(selectedItems).map((id) =>
        axios.delete(`https://coffeehouse-4yii.onrender.com//api/menu/delete/${id}`)
      )
    )
      .then(() => {
        alert("Selected menu items deleted successfully.");
        setSelectedItems(new Set());
        fetchMenuItems();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenuItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-menu">
      <h2>Edit Menu Section</h2>
      <form onSubmit={handleTitleDescriptionSubmit}>
        <label>
          Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description: <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>
          Save
        </button>
      </form>

      <h3>Menu Items</h3>
      <button onClick={handleSelectAll}>
        {selectedItems.size === currentItems.length ? "Deselect All" : "Select All"}
      </button>
      <button onClick={handleBulkDelete} disabled={loading || selectedItems.size === 0}>
        {loading ? "Deleting..." : "Delete Selected"}
      </button>

      {loading && <p>Loading menu items...</p>}

      {currentItems.map((item) => (
        <div key={item._id}>
          <input
            type="checkbox"
            checked={selectedItems.has(item._id)}
            onChange={() => handleSelectItem(item._id)}
          />
          <p>
            {item.name} - {item.price}
          </p>
          <img src={`https://coffeehouse-4yii.onrender.com//${item.image}`} alt={item.name} width="100" />
          <p>Featured: {item.featured ? "Yes" : "No"}</p>
          <button onClick={() => handleToggleFeatured(item._id)} disabled={loading}>
            {item.featured ? "Unfeature" : "Feature"}
          </button>
          <button onClick={() => {
            setEditingItem(item);
            setEditFormData({ name: item.name, price: item.price, image: null });
            setEditImagePreview(null);
          }} disabled={loading}>
            Edit
          </button>
          <button onClick={() => handleDeleteMenuItem(item._id)} disabled={loading}>
            Delete
          </button>
          {editingItem && editingItem._id === item._id && (
            <form onSubmit={(e) => handleEditMenuItem(e, item._id)}>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
              <input
                type="text"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
              />
              <input type="file" onChange={handleEditImageChange} />
              {editImagePreview && <img src={editImagePreview} alt="Edit Preview" width="100" style={{ marginTop: "10px" }} />}
              <button type="submit" disabled={loading}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setEditImagePreview(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}

      <h3>Add New Item</h3>
      <form onSubmit={handleAddMenuItem}>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          placeholder="Price"
        />
        <input type="file" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" width="100" style={{ marginTop: "10px" }} />}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredMenuItems.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
            disabled={loading}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
