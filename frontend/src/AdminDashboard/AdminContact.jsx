import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [reply, setReply] = useState({ email: "", message: "" });
  const [branchForm, setBranchForm] = useState({});

  useEffect(() => {
    axios.get("https://coffeehouse-4yii.onrender.com/api/admin/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    axios.get("https://coffeehouse-4yii.onrender.com/api/admin/branches")
      .then((res) => setBranches(res.data.branch ? res.data.branch.branches : []))
      .catch((err) => console.error(err));
  }, []);

  const handleReply = (id) => {
    axios.patch(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}/reply`, reply)
      .then((res) => alert("Reply sent"))
      .catch((err) => console.error(err));

  };

  const handleDeleteMessage = (id) => {
    axios.delete(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}`)
      .then(() => setMessages(messages.filter((msg) => msg._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleBlockSender = (id, email) => {
    axios.patch(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}/block`)
      .then(() => alert(`Blocked ${email}`))
      .catch((err) => console.error(err));
  };

  const handleBranchForm = (e) => {
    const { name, value } = e.target;
    setBranchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchSubmit = () => {
    axios.post("https://coffeehouse-4yii.onrender.com/api/admin/branches/add", branchForm)
      .then((res) => setBranches([...branches, res.data.branch]))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Admin Contact Management</h2>
      <div>
        <h3>Messages</h3>
        {messages.map((msg) => (
          <div key={msg._id}>
            <p><strong>{msg.name} ({msg.email}):</strong> {msg.message}</p>
            <button onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
            <button onClick={() => handleBlockSender(msg.email)}>Block</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Branches</h3>
        <form onSubmit={handleBranchSubmit}>
          <input name="name" placeholder="Branch Name" onChange={handleBranchForm} />
          <input name="address" placeholder="Address" onChange={handleBranchForm} />
          <input name="phone" placeholder="Phone" onChange={handleBranchForm} />
          <button type="submit">Add Branch</button>
        </form>
        <div>
          <h4>Branch List</h4>
          {branches.length === 0 && <p>No branches available.</p>}
          {branches.map((branch, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {branch.location || branch.name || "N/A"}</p>
              <p><strong>Address:</strong> {branch.address || "N/A"}</p>
              <p><strong>Phone:</strong> {branch.phone || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
