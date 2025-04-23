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

  useEffect(() => {
    axios
      .get("https://coffeehouse-4yii.onrender.com/api/admin/branches")
      .then((res) => {
        const branchData = res.data.branch;
        setBranches(branchData && Array.isArray(branchData.branches) ? branchData.branches : []);
        setTitle(branchData ? branchData.title : "");
        setDescription(branchData ? branchData.description : "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTitleDescriptionSubmit = (e) => {
    e.preventDefault();
    axios
      .put("https://coffeehouse-4yii.onrender.com/api/admin/branches/title-description", { title, description })
      .then((res) => setFeedbackMessage(res.data.message))
      .catch((err) => console.error(err));
  };

  const handleBranchAdd = (e) => {
    e.preventDefault();
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
      })
      .catch((err) => console.error(err));
  };

  const handleBranchDelete = (branchId) => {
    axios
      .delete(`https://coffeehouse-4yii.onrender.com/api/admin/branches/delete/${branchId}`)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => console.error(err));
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
    const formData = new FormData();
    formData.append("location", editFormData.location);
    formData.append("fbLink", editFormData.fbLink);
    formData.append("instaLink", editFormData.instaLink);
    formData.append("youtubeLink", editFormData.youtubeLink);
    formData.append("email", editFormData.email);
    formData.append("isMain", editFormData.isMain);
    if (editFormData.image) formData.append("image", editFormData.image);

    axios
      .put(`https://coffeehouse-4yii.onrender.com/api/admin/branches/edit/${branchId}`, formData)
      .then((res) => {
        setBranches(res.data.branch.branches);
        setEditingBranch(null);
        setFeedbackMessage(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-branch">
      {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

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
      {branches && Array.isArray(branches) && branches.map((branch) => (
        <div key={branch._id} style={{ marginBottom: "20px" }}>
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
            style={{ marginBottom: '10px' }}
          />
          
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
                <input
                  type="file"
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.files[0] })}
                />
              </label>
              <label>
                Is Main Branch:
                <input
                  type="checkbox"
                  checked={editFormData.isMain || false}
                  onChange={handleEditBranchIsMainChange}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminBranch;
