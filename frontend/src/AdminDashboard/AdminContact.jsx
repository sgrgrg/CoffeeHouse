import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [reply, setReply] = useState({ email: "", message: "" });
  const [branchForm, setBranchForm] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    axios.get("http://localhost:5000/api/admin/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleReply = (id) => {
    axios.post(`http://localhost:5000/api/admin/messages/reply/${id}`, reply)
      .then((res) => alert("Reply sent"))
      .catch((err) => console.error(err));
  };

  const handleDeleteMessage = (id) => {
    axios.delete(`http://localhost:5000/api/admin/messages/${id}`)
      .then(() => setMessages(messages.filter((msg) => msg._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleBlockSender = (email) => {
    axios.patch(`http://localhost:5000/api/admin/messages/block/${email}`)
      .then(() => alert(`Blocked ${email}`))
      .catch((err) => console.error(err));
  };

  const handleBranchForm = (e) => {
    const { name, value } = e.target;
    setBranchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchSubmit = () => {
    axios.post("http://localhost:5000/api/admin/branches", branchForm)
      .then((res) => setBranches([...branches, res.data]))
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
      </div>
    </div>
  );
};

export default AdminContact;
