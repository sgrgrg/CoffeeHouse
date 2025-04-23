import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBranch = () => {
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
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [branchesPerPage] = useState(5);
  const [selectedBranches, setSelectedBranches] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    setLoading(true);
    axios
      .get("https://coffeehouse-4yii.onrender.com/api/admin/branches")
      .then((res) => {
        const branchData = res.data.branch;
        setBranches(branchData && Array.isArray(branchData.branches) ? branchData.branches : []);
        setTitle(branchData ? branchData.title : "");
        setDescription(branchData ? branchData.description : "");
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
      .put("https://coffeehouse-4yii.onrender.com/api/admin/branches/title-description", { title, description })
      .then((res) => setFeedbackMessage(res.data.message))
      .catch((err) => console.error(err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBranch((prev) => ({ ...prev, image: file }));
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

  const handleBranchAdd = (e) => {
    e.preventDefault();
    if (!newBranch.location.trim()) {
      alert("Location is required.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("location", newBranch.location);
    formData.append("fbLink", newBranch.fbLink);
    formData.append("instaLink", newBranch.instaLink);
    formData.append("youtubeLink", newBranch.youtubeLink);
    newBranch.emails.forEach((email, index) => {
      formData.append(`emails[${index}]`, email);
    });
    newBranch.phoneNumbers.forEach((phone, index) => {
      formData.append(`phoneNumbers[${index}]`, phone);
    });
    formData.append("isMain", newBranch.isMain);
    if (newBranch.image) formData.append("image", newBranch.image);

    axios
      .post("https://coffeehouse-4yii.onrender.com/api/admin/branches/add", formData)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
        setNewBranch({
          location: "",
          image: null,
          fbLink: "",
          instaLink: "",
          youtubeLink: "",
          emails: [""],
          phoneNumbers: [""],
          isMain: false,
        });
        setImagePreview(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleBranchDelete = (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    setLoading(true);
    axios
      .delete(`https://coffeehouse-4yii.onrender.com/api/admin/branches/delete/${branchId}`)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

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
    });
    setEditImagePreview(null);
  };

  // Enforce only one main branch in new branch form
  const handleNewBranchIsMainChange = (e) => {
    const isMain = e.target.checked;
    if (isMain) {
      // Unset isMain for all other branches in state
      const updatedBranches = branches.map((b) => ({ ...b, isMain: false }));
      setBranches(updatedBranches);
    }
    setNewBranch({ ...newBranch, isMain });
  };

  // Enforce only one main branch in edit form
  const handleEditBranchIsMainChange = (e) => {
    const isMain = e.target.checked;
    if (isMain) {
      // Unset isMain for all other branches in state
      const updatedBranches = branches.map((b) =>
        b._id === editingBranch ? { ...b, isMain: true } : { ...b, isMain: false }
      );
      setBranches(updatedBranches);
    }
    setEditFormData({ ...editFormData, isMain });
  };

  const handleBranchEditSubmit = (e, branchId) => {
    e.preventDefault();
    if (!editFormData.location.trim()) {
      alert("Location is required.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("location", editFormData.location);
    formData.append("fbLink", editFormData.fbLink);
    formData.append("instaLink", editFormData.instaLink);
    formData.append("youtubeLink", editFormData.youtubeLink);
    editFormData.emails.forEach((email, index) => {
      formData.append(`emails[${index}]`, email);
    });
    editFormData.phoneNumbers.forEach((phone, index) => {
      formData.append(`phoneNumbers[${index}]`, phone);
    });
    formData.append("isMain", editFormData.isMain);
    if (editFormData.image) formData.append("image", editFormData.image);

    axios
      .put(`https://coffeehouse-4yii.onrender.com/api/admin/branches/edit/${branchId}`, formData)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setEditingBranch(null);
        setFeedbackMessage(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSelectBranch = (branchId) => {
    const newSelected = new Set(selectedBranches);
    if (newSelected.has(branchId)) {
      newSelected.delete(branchId);
    } else {
      newSelected.add(branchId);
    }
    setSelectedBranches(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBranches.size === currentBranches.length) {
      setSelectedBranches(new Set());
    } else {
      setSelectedBranches(new Set(currentBranches.map((b) => b._id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBranches.size === 0) {
      alert("No branches selected for deletion.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedBranches.size} selected branches?`)) return;
    setLoading(true);
    Promise.all(
      Array.from(selectedBranches).map((branchId) =>
        axios.delete(`https://coffeehouse-4yii.onrender.com/api/admin/branches/delete/${branchId}`)
      )
    )
      .then(() => {
        alert("Selected branches deleted successfully.");
        setSelectedBranches(new Set());
        fetchBranches();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredBranches = branches.filter((branch) =>
    branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = filteredBranches.slice(indexOfFirstBranch, indexOfLastBranch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            <p>Phone Numbers: {branch.phoneNumbers ? branch.phoneNumbers.join(", ") : "N/A"}</p>
            <p>Facebook Link: {branch.fbLink}</p>
            <p>Instagram Link: {branch.instaLink}</p>
            <p>YouTube Link: {branch.youtubeLink}</p>
            <p>Is Main Branch: {branch.isMain ? "Yes" : "No"}</p>

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

            {editingBranch === branch._id && (
              <form onSubmit={(e) => handleBranchEditSubmit(e, branch._id)}>
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
                    <input
                      key={index}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...editFormData.emails];
                        newEmails[index] = e.target.value;
                        setEditFormData({ ...editFormData, emails: newEmails });
                      }}
                      style={{ display: "block", marginBottom: "5px" }}
                    />
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
                    <input
                      key={index}
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...editFormData.phoneNumbers];
                        newPhones[index] = e.target.value;
                        setEditFormData({ ...editFormData, phoneNumbers: newPhones });
                      }}
                      style={{ display: "block", marginBottom: "5px" }}
                    />
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
