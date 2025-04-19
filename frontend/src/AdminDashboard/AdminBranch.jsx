import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBranch = () => {
  const [branches, setBranches] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newBranch, setNewBranch] = useState({ location: "", image: null });
  const [editingBranch, setEditingBranch] = useState(null);
  const [editFormData, setEditFormData] = useState({ location: "", image: null });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    axios
      .get("backend-production-402e.up.railway.app/api/admin/branches")
      .then((res) => {
        setBranches(res.data.branch ? res.data.branch.branches : []);
        setTitle(res.data.branch ? res.data.branch.title : "");
        setDescription(res.data.branch ? res.data.branch.description : "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTitleDescriptionSubmit = (e) => {
    e.preventDefault();
    axios
      .put("backend-production-402e.up.railway.app/api/admin/branches/title-description", { title, description })
      .then((res) => setFeedbackMessage(res.data.message))
      .catch((err) => console.error(err));
  };

  const handleBranchAdd = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", newBranch.location);
    formData.append("image", newBranch.image);

    axios
      .post("backend-production-402e.up.railway.app/api/admin/branches/add", formData)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  const handleBranchDelete = (branchId) => {
    axios
      .delete(`backend-production-402e.up.railway.app/api/admin/branches/delete/${branchId}`)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  const handleEditButtonClick = (branch) => {
    setEditingBranch(branch._id);
    setEditFormData({ location: branch.location, image: null });
  };

  const handleBranchEditSubmit = (e, branchId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("location", editFormData.location);
    if (editFormData.image) formData.append("image", editFormData.image);

    axios
      .put(`backend-production-402e.up.railway.app/api/admin/branches/edit/${branchId}`, formData)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setEditingBranch(null); // Close the editing form
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  const handleToggleFeatured = (branchId) => {
    axios
      .put(`backend-production-402e.up.railway.app/api/admin/branches/toggle-featured/${branchId}`)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => {
        alert(err.response?.data?.error || "An error occurred");
      });
  };

  return (
    <div className="admin-branch">
      {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

      <h2>Edit Find Us Section</h2>
      <form onSubmit={handleTitleDescriptionSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Save</button>
      </form>

      <h3>Branches</h3>
      {branches.map((branch) => (
        <div key={branch._id} style={{ marginBottom: "20px" }}>
          <p>Location: {branch.location}</p>
          <p>Featured: {branch.featured ? "Yes" : "No"}</p>
          
          <img 
            src={`backend-production-402e.up.railway.app/${branch.image}`} 
            alt={branch.location} 
            width="100" 
            style={{ marginBottom: '10px' }}
          />
          
          <button onClick={() => handleToggleFeatured(branch._id)}>
            {branch.featured ? "Unfeature" : "Feature"}
          </button>

          <button onClick={() => handleEditButtonClick(branch)}>
            Edit
          </button>
          <button onClick={() => handleBranchDelete(branch._id)}>
            Delete
          </button>

          {editingBranch === branch._id && (
            <form onSubmit={(e) => handleBranchEditSubmit(e, branch._id)}>
              <label>
                New Location:
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                />
              </label>
              <label>
                New Image:
                <input
                  type="file"
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.files[0] })}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          )}
        </div>
      ))}
      
      <h3>Add New Branch</h3>
      <form onSubmit={handleBranchAdd}>
        <label>
          Location:
          <input
            type="text"
            value={newBranch.location}
            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            onChange={(e) => setNewBranch({ ...newBranch, image: e.target.files[0] })}
          />
        </label>
        <button type="submit">Add Branch</button>
      </form>
    </div>
  );
};

export default AdminBranch;
