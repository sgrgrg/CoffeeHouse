import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newItem, setNewItem] = useState({ name: "", price: "", image: null });
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", price: "", image: null });

  useEffect(() => {
    axios.get("http://localhost:5000/api/menu").then((res) => {
      setMenuItems(res.data.menuItems || []);
      setTitle(res.data.titleDescribe?.title || "");
      setDescription(res.data.titleDescribe?.description || "");
    });
  }, []);

  const handleTitleDescriptionSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/api/menu/title-describe", { title, description })
      .then((res) => alert(res.data.message));
  };

  const handleAddMenuItem = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("image", newItem.image);

    axios.post("http://localhost:5000/api/menu/add", formData).then((res) => {
      setMenuItems(res.data.menuItems);
      setNewItem({ name: "", price: "", image: null });
      alert(res.data.message);
    });
  };

  const handleEditMenuItem = (e, id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("price", editFormData.price);
    if (editFormData.image) formData.append("image", editFormData.image);

    axios.put(`http://localhost:5000/api/menu/edit/${id}`, formData).then((res) => {
      setMenuItems(res.data.menuItems);
      setEditingItem(null);
      alert(res.data.message);
    });
  };

  const handleDeleteMenuItem = (id) => {
    axios.delete(`http://localhost:5000/api/menu/delete/${id}`).then((res) => {
      setMenuItems(res.data.menuItems);
      alert(res.data.message);
    });
  };

  const handleToggleFeatured = (id) => {
    axios.put(`http://localhost:5000/api/menu/toggle-featured/${id}`).then((res) => {
      setMenuItems(res.data.menuItems);
      alert(res.data.message);
    }).catch((err) => {
      alert(err.response?.data?.error || "An error occurred");
    });
  };

  return (
    <div>
      <h2>Edit Menu Section</h2>
      <form onSubmit={handleTitleDescriptionSubmit}>
        <label>Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Description: <textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <button type="submit">Save</button>
      </form>

      <h3>Menu Items</h3>
      {menuItems.map((item) => (
        <div key={item._id}>
          <p>{item.name} - {item.price}</p>
          <img src={`http://localhost:5000/${item.image}`} alt={item.name} width="100" />
          <p>Featured: {item.featured ? "Yes" : "No"}</p>
          <button onClick={() => handleToggleFeatured(item._id)}>
            {item.featured ? "Unfeature" : "Feature"}
          </button>
          <button onClick={() => setEditingItem(item)}>Edit</button>
          <button onClick={() => handleDeleteMenuItem(item._id)}>Delete</button>
          {editingItem && editingItem._id === item._id && (
            <form onSubmit={(e) => handleEditMenuItem(e, item._id)}>
              <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
              <input type="text" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} />
              <input type="file" onChange={(e) => setEditFormData({ ...editFormData, image: e.target.files[0] })} />
              <button type="submit">Save</button>
            </form>
          )}
        </div>
      ))}

      <h3>Add New Item</h3>
      <form onSubmit={handleAddMenuItem}>
        <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Name" />
        <input type="text" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price" />
        <input type="file" onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })} />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AdminMenu;
