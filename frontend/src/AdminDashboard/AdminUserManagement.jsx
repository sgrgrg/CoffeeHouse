import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/AdminDashboard.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    isBlocked: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://coffeehouse-4yii.onrender.com/api/user/admin/users");
      // Ensure res.data is an array before setting users state
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error("Unexpected data format for users:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditFormData({
      name: user.name || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      isBlocked: user.isBlocked || false,
    });
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveClick = async (userId) => {
    try {
      await axios.put(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}`, editFormData);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleBlockToggle = async (userId, block) => {
    try {
      await axios.put(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}/block`, { block });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update block status", err);
    }
  };

  return (
    <div className="admin-user-management">
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editingUserId === user._id ? (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="isBlocked"
                    checked={editFormData.isBlocked}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveClick(user._id)}>Save</button>
                  <button onClick={handleCancelClick}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.email}</td>
                <td>{user.isBlocked ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleDeleteClick(user._id)}>Delete</button>
                  <button
                    onClick={() =>
                      handleBlockToggle(user._id, !user.isBlocked)
                    }
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
