import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/AdminBranch.css";

const AdminBranch = () => {
  // State for branches data and UI controls
  const [branches, setBranches] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newBranch, setNewBranch] = useState({
    location: "",
    image: null,
    fbLink: "",
    instaLink: "",
    youtubeLink: "",
    emails: [""],
    phoneNumbers: [""],
    isMain: false,
    featured: false,
  });
  const [editingBranch, setEditingBranch] = useState(null);
  const [editFormData, setEditFormData] = useState({
    location: "",
    image: null,
    fbLink: "",
    instaLink: "",
    youtubeLink: "",
    emails: [""],
    phoneNumbers: [""],
    isMain: false,
    featured: false,
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [branchesPerPage] = useState(5);
  const [selectedBranches, setSelectedBranches] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Validation error states
  const [newBranchErrors, setNewBranchErrors] = useState({ emails: [], phoneNumbers: [] });
  const [editFormErrors, setEditFormErrors] = useState({ emails: [], phoneNumbers: [] });

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch branches from backend
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://coffeehouse-4yii.onrender.com/api/admin/branches");
      const branchData = res.data.branch;
      setBranches(branchData && Array.isArray(branchData.branches) ? branchData.branches : []);
      setTitle(branchData ? branchData.title : "");
      setDescription(branchData ? branchData.description : "");
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle title and description update
  const handleTitleDescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("https://coffeehouse-4yii.onrender.com/api/admin/branches/title-description", { title, description });
      setFeedbackMessage(res.data.message);
    } catch (error) {
      console.error("Error updating title and description:", error);
    }
  };

  // Handle image file change for new branch
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBranch((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle image file change for edit form
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setEditImagePreview(null);
    }
  };

  // Validate emails and phone numbers
  const validateContacts = (emails, phones) => {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    const emailErrors = emails.map(email => (emailRegex.test(email) ? "" : "Invalid email format"));
    const phoneErrors = phones.map(phone => (phoneRegex.test(phone) ? "" : "Invalid phone number format"));

    return { emailErrors, phoneErrors };
  };

  // Handle adding a new branch
  const handleBranchAdd = async (e) => {
    e.preventDefault();

    // Validate contacts
    const { emailErrors, phoneErrors } = validateContacts(newBranch.emails, newBranch.phoneNumbers);
    setNewBranchErrors({ emails: emailErrors, phoneNumbers: phoneErrors });

    if (emailErrors.some(err => err !== "") || phoneErrors.some(err => err !== "")) {
      return; // Stop if validation errors
    }

    if (!newBranch.location.trim()) {
      alert("Location is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("location", newBranch.location);
      formData.append("fbLink", newBranch.fbLink);
      formData.append("instaLink", newBranch.instaLink);
      formData.append("youtubeLink", newBranch.youtubeLink);
      newBranch.emails.forEach((email, index) => formData.append(`emails[${index}]`, email));
      newBranch.phoneNumbers.forEach((phone, index) => formData.append(`phoneNumbers[${index}]`, phone));
      formData.append("isMain", newBranch.isMain);
      formData.append("featured", newBranch.featured);
      if (newBranch.image) formData.append("image", newBranch.image);

      const res = await axios.post("https://coffeehouse-4yii.onrender.com/api/admin/branches/add", formData);
      setBranches(res.data.branch.branches);
      setFeedbackMessage(res.data.message);
      // Reset new branch form
      setNewBranch({
        location: "",
        image: null,
        fbLink: "",
        instaLink: "",
        youtubeLink: "",
        emails: [""],
        phoneNumbers: [""],
        isMain: false,
        featured: false,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding branch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a branch
  const handleBranchDelete = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    setLoading(true);
    try {
      const res = await axios.delete(`https://coffeehouse-4yii.onrender.com/api/admin/branches/delete/${branchId}`);
      setBranches(res.data.branch.branches);
      setFeedbackMessage(res.data.message);
    } catch (error) {
      console.error("Error deleting branch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a branch
  const handleEditButtonClick = (branch) => {
    setEditingBranch(branch._id);
    setEditFormData({
      location: branch.location,
      image: null,
      fbLink: branch.fbLink || "",
      instaLink: branch.instaLink || "",
      youtubeLink: branch.youtubeLink || "",
      emails: branch.emails && branch.emails.length > 0 ? branch.emails : [""],
      phoneNumbers: branch.phoneNumbers && branch.phoneNumbers.length > 0 ? branch.phoneNumbers : [""],
      isMain: branch.isMain || false,
      featured: branch.featured || false,
    });
    setEditImagePreview(null);
  };

  // Enforce only one main branch in new branch form
  const handleNewBranchIsMainChange = (e) => {
    const isMain = e.target.checked;
    if (isMain) {
      const updatedBranches = branches.map((b) => ({ ...b, isMain: false }));
      setBranches(updatedBranches);
    }
    setNewBranch({ ...newBranch, isMain });
  };

  // Enforce only one main branch in edit form
  const handleEditBranchIsMainChange = (e) => {
    const isMain = e.target.checked;
    if (isMain) {
      const updatedBranches = branches.map((b) =>
        b._id === editingBranch ? { ...b, isMain: true } : { ...b, isMain: false }
      );
      setBranches(updatedBranches);
    }
    setEditFormData({ ...editFormData, isMain });
  };

  // Handle submitting edited branch
  const handleBranchEditSubmit = async (e, branchId) => {
    e.preventDefault();

    // Validate contacts
    const { emailErrors, phoneErrors } = validateContacts(editFormData.emails, editFormData.phoneNumbers);
    setEditFormErrors({ emails: emailErrors, phoneNumbers: phoneErrors });

    if (emailErrors.some(err => err !== "") || phoneErrors.some(err => err !== "")) {
      return; // Stop if validation errors
    }

    if (!editFormData.location.trim()) {
      alert("Location is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("location", editFormData.location);
      formData.append("fbLink", editFormData.fbLink);
      formData.append("instaLink", editFormData.instaLink);
      formData.append("youtubeLink", editFormData.youtubeLink);
      editFormData.emails.forEach((email, index) => formData.append(`emails[${index}]`, email));
      editFormData.phoneNumbers.forEach((phone, index) => formData.append(`phoneNumbers[${index}]`, phone));
      formData.append("isMain", editFormData.isMain);
      formData.append("featured", editFormData.featured);
      if (editFormData.image) formData.append("image", editFormData.image);

      const res = await axios.put(`https://coffeehouse-4yii.onrender.com/api/admin/branches/edit/${branchId}`, formData);
      setBranches(res.data.branch.branches);
      setEditingBranch(null);
      setFeedbackMessage(res.data.message);
    } catch (error) {
      console.error("Error editing branch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting/deselecting a branch for bulk actions
  const handleSelectBranch = (branchId) => {
    const newSelected = new Set(selectedBranches);
    if (newSelected.has(branchId)) {
      newSelected.delete(branchId);
    } else {
      newSelected.add(branchId);
    }
    setSelectedBranches(newSelected);
  };

  // Select or deselect all branches on current page
  const handleSelectAll = () => {
    if (selectedBranches.size === currentBranches.length) {
      setSelectedBranches(new Set());
    } else {
      setSelectedBranches(new Set(currentBranches.map((b) => b._id)));
    }
  };

  // Bulk delete selected branches
  const handleBulkDelete = async () => {
    if (selectedBranches.size === 0) {
      alert("No branches selected for deletion.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedBranches.size} selected branches?`)) return;
    setLoading(true);
    try {
      await Promise.all(
        Array.from(selectedBranches).map((branchId) =>
          axios.delete(`https://coffeehouse-4yii.onrender.com/api/admin/branches/delete/${branchId}`)
        )
      );
      alert("Selected branches deleted successfully.");
      setSelectedBranches(new Set());
      await fetchBranches();
    } catch (error) {
      console.error("Error deleting selected branches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter branches by search term
  const filteredBranches = branches.filter((branch) =>
    branch.location && branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = filteredBranches.slice(indexOfFirstBranch, indexOfLastBranch);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle featured status of a branch
  const toggleFeatured = async (branchId) => {
    setLoading(true);
    try {
      const res = await axios.put(`https://coffeehouse-4yii.onrender.com/api/admin/branches/toggle-featured/${branchId}`);
      setBranches(res.data.branch.branches);
    } catch (error) {
      console.error("Error toggling featured status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-branch">
      {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

      <input
        type="text"
        placeholder="Search branches..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      <h2>Edit Find Us Section</h2>
      <form onSubmit={handleTitleDescriptionSubmit}>
        <label>
          Title:
          <input type="text" value={title || ""} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description || ""} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Save</button>
      </form>

      <h3>Add New Branch</h3>
      <form onSubmit={handleBranchAdd} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <label>
          Location:
          <input
            type="text"
            value={newBranch.location}
            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
            required
          />
        </label>
        <label>
          Facebook Link:
          <input
            type="text"
            value={newBranch.fbLink}
            onChange={(e) => setNewBranch({ ...newBranch, fbLink: e.target.value })}
          />
        </label>
        <label>
          Instagram Link:
          <input
            type="text"
            value={newBranch.instaLink}
            onChange={(e) => setNewBranch({ ...newBranch, instaLink: e.target.value })}
          />
        </label>
        <label>
          YouTube Link:
          <input
            type="text"
            value={newBranch.youtubeLink}
            onChange={(e) => setNewBranch({ ...newBranch, youtubeLink: e.target.value })}
          />
        </label>
        <label>
          Emails:
          {newBranch.emails.map((email, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const newEmails = [...newBranch.emails];
                  newEmails[index] = e.target.value;
                  setNewBranch({ ...newBranch, emails: newEmails });
                }}
                style={{ flex: 1 }}
              />
              {newBranch.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newEmails = newBranch.emails.filter((_, i) => i !== index);
                    setNewBranch({ ...newBranch, emails: newEmails });
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewBranch({ ...newBranch, emails: [...newBranch.emails, ""] })}
          >
            Add Email
          </button>
        </label>
        <label>
          Phone Numbers:
          {newBranch.phoneNumbers.map((phone, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const newPhones = [...newBranch.phoneNumbers];
                  newPhones[index] = e.target.value;
                  setNewBranch({ ...newBranch, phoneNumbers: newPhones });
                }}
                style={{ flex: 1 }}
              />
              {newBranch.phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newPhones = newBranch.phoneNumbers.filter((_, i) => i !== index);
                    setNewBranch({ ...newBranch, phoneNumbers: newPhones });
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewBranch({ ...newBranch, phoneNumbers: [...newBranch.phoneNumbers, ""] })}
          >
            Add Phone Number
          </button>
        </label>
        <label>
          Image:
          <input type="file" onChange={handleImageChange} />
        </label>
        {imagePreview && <img src={imagePreview} alt="Preview" width="100" style={{ marginTop: "10px" }} />}
        <label>
          Is Main Branch:
          <input
            type="checkbox"
            checked={newBranch.isMain}
            onChange={handleNewBranchIsMainChange}
          />
        </label>
        <label>
          Featured Branch:
          <input
            type="checkbox"
            checked={newBranch.featured}
            onChange={(e) => setNewBranch({ ...newBranch, featured: e.target.checked })}
          />
        </label>
        <button type="submit" disabled={loading}>Add Branch</button>
      </form>

      <h3>Branches</h3>
      <button onClick={handleSelectAll}>
        {selectedBranches.size === currentBranches.length ? "Deselect All" : "Select All"}
      </button>
      <button onClick={handleBulkDelete} disabled={loading || selectedBranches.size === 0}>
        {loading ? "Deleting..." : "Delete Selected"}
      </button>

      {loading && <p>Loading branches...</p>}

      {currentBranches && currentBranches.length > 0 ? (
        currentBranches.map((branch) => (
          <div key={branch._id} style={{ marginBottom: "20px" }}>
            <input
              type="checkbox"
              checked={selectedBranches.has(branch._id)}
              onChange={() => handleSelectBranch(branch._id)}
            />
            <p>Location: {branch.location}</p>
            <p>Emails: {branch.emails ? branch.emails.join(", ") : branch.email}</p>
            <p>Phone Numbers: {branch.phoneNumbers && branch.phoneNumbers.length > 0 && branch.phoneNumbers.some(p => p.trim() !== "") ? branch.phoneNumbers.join(", ") : "N/A"}</p>
            <p>Facebook Link: {branch.fbLink}</p>
            <p>Instagram Link: {branch.instaLink}</p>
            <p>YouTube Link: {branch.youtubeLink}</p>
            <p>Is Main Branch: {branch.isMain ? "Yes" : "No"}</p>
            <p>Featured Branch: {branch.featured ? "Yes" : "No"}</p>

            <img
              src={`https://coffeehouse-4yii.onrender.com/${branch.image}`}
              alt={branch.location}
              width="100"
              style={{ marginBottom: "10px" }}
            />

            <button onClick={() => handleEditButtonClick(branch)}>Edit</button>
            <button onClick={() => handleBranchDelete(branch._id)} disabled={loading}>
              Delete
            </button>
            <button
              onClick={() => toggleFeatured(branch._id)}
              disabled={loading}
              style={{ marginLeft: "10px" }}
            >
              {branch.featured ? "Unfeature" : "Feature"}
            </button>

            {editingBranch === branch._id && (
              <form onSubmit={(e) => handleBranchEditSubmit(e, branch._id)} style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
                <label>
                  New Location:
                  <input
                    type="text"
                    value={editFormData.location || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  />
                </label>
                <label>
                  Emails:
                  {editFormData.emails.map((email, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...editFormData.emails];
                          newEmails[index] = e.target.value;
                          setEditFormData({ ...editFormData, emails: newEmails });
                        }}
                        style={{ flex: 1 }}
                      />
                      {editFormData.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newEmails = editFormData.emails.filter((_, i) => i !== index);
                            setEditFormData({ ...editFormData, emails: newEmails });
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, emails: [...editFormData.emails, ""] })}
                  >
                    Add Email
                  </button>
                </label>
                <label>
                  New Facebook Link:
                  <input
                    type="text"
                    value={editFormData.fbLink || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, fbLink: e.target.value })}
                  />
                </label>
                <label>
                  New Instagram Link:
                  <input
                    type="text"
                    value={editFormData.instaLink || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, instaLink: e.target.value })}
                  />
                </label>
                <label>
                  New YouTube Link:
                  <input
                    type="text"
                    value={editFormData.youtubeLink || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, youtubeLink: e.target.value })}
                  />
                </label>
                <label>
                  Phone Numbers:
                  {editFormData.phoneNumbers.map((phone, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...editFormData.phoneNumbers];
                          newPhones[index] = e.target.value;
                          setEditFormData({ ...editFormData, phoneNumbers: newPhones });
                        }}
                        style={{ flex: 1 }}
                      />
                      {editFormData.phoneNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = editFormData.phoneNumbers.filter((_, i) => i !== index);
                            setEditFormData({ ...editFormData, phoneNumbers: newPhones });
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, phoneNumbers: [...editFormData.phoneNumbers, ""] })}
                  >
                    Add Phone Number
                  </button>
                </label>
                <label>
                  New Image:
                  <input type="file" onChange={handleEditImageChange} />
                </label>
                {editImagePreview && <img src={editImagePreview} alt="Edit Preview" width="100" style={{ marginTop: "10px" }} />}
                <label>
                  Is Main Branch:
                  <input
                    type="checkbox"
                    checked={editFormData.isMain || false}
                    onChange={handleEditBranchIsMainChange}
                  />
                </label>
                <label>
                  Featured Branch:
                  <input
                    type="checkbox"
                    checked={editFormData.featured || false}
                    onChange={(e) => setEditFormData({ ...editFormData, featured: e.target.checked })}
                  />
                </label>
                <button type="submit" disabled={loading}>Save Changes</button>
                <button type="button" onClick={() => { setEditingBranch(null); setEditImagePreview(null); }} disabled={loading}>Cancel</button>
              </form>
            )}
          </div>
        ))
      ) : (
        <p>No branches found.</p>
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredBranches.length / branchesPerPage) }, (_, i) => (
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

export default AdminBranch;
