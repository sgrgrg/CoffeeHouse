import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/AdminUserManagement.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    isBlocked: false,
    isAdmin: false,  // Added isAdmin field
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authData") ? JSON.parse(localStorage.getItem("authData")).token : null;
      const res = await axios.get("https://coffeehouse-4yii.onrender.com/api/user/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    if (user.username === "admin") return; // Prevent editing real admin user
    setEditingUserId(user._id);
    setEditFormData({
      name: user.name || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      isBlocked: user.isBlocked || false,
      isAdmin: user.isAdmin || false,  // Added isAdmin to edit form data
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
      const token = localStorage.getItem("authData") ? JSON.parse(localStorage.getItem("authData")).token : null;
      await axios.put(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteClick = async (userId, username) => {
    if (username === "admin") {
      alert("Cannot delete the real admin user.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("authData") ? JSON.parse(localStorage.getItem("authData")).token : null;
      await axios.delete(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleBlockToggle = async (userId, block, username) => {
    if (username === "admin") {
      alert("Cannot block/unblock the real admin user.");
      return;
    }
    try {
      const token = localStorage.getItem("authData") ? JSON.parse(localStorage.getItem("authData")).token : null;
      await axios.put(`https://coffeehouse-4yii.onrender.com/api/user/admin/users/${userId}/block`, { block }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editingUserId === user._id ? (
            <tr key={user._id} className={user.username === "admin" ? "real-admin" : ""}>
              <td>{user.username}</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="isBlocked"
                  checked={editFormData.isBlocked}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={editFormData.isAdmin}
                  onChange={handleInputChange}
                  disabled={user.username === "admin"}
                />
              </td>
              <td>
                <button onClick={() => handleSaveClick(user._id)} disabled={user.username === "admin"}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </td>
            </tr>
            ) : (
          <tr key={user._id} className={user.username === "admin" ? "real-admin" : ""}>
            <td>{user.username}</td>
            <td>{user.name}</td>
            <td>{user.address}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.email}</td>
            <td>{user.isBlocked ? "Yes" : "No"}</td>
            <td>{user.isAdmin ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => handleEditClick(user)} disabled={user.username === "admin"}>Edit</button>
              <button onClick={() => handleDeleteClick(user._id, user.username)} disabled={user.username === "admin"}>Delete</button>
              <button
                onClick={() =>
                  handleBlockToggle(user._id, !user.isBlocked, user.username)
                }
                disabled={user.username === "admin"}
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
