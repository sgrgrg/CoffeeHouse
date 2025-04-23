import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [branchForm, setBranchForm] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    axios.get("http://localhost:5000/api/admin/branches")
      .then((res) => {
        const branchData = res.data.branch;
        setBranches(branchData && Array.isArray(branchData.branches) ? branchData.branches : []);
      })
      .catch((err) => console.error(err));

    // Socket event listeners
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("messageReply", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageReply");
    };
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyContent((prev) => ({ ...prev, [id]: value }));
  };

  const handleReply = (id) => {
    const content = replyContent[id];
    if (!content) {
      alert("Reply content cannot be empty.");
      return;
    }
    axios.patch(`http://localhost:5000/api/admin/messages/${id}/reply`, { replyContent: content })
      .then((res) => {
        alert("Reply sent");
        setReplyContent((prev) => {
          const newReply = { ...prev };
          delete newReply[id];
          return newReply;
        });
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteMessage = (id) => {
    axios.delete(`http://localhost:5000/api/admin/messages/${id}`)
      .then(() => setMessages(messages.filter((msg) => msg._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleBlockSender = (id, email) => {
    axios.patch(`http://localhost:5000/api/admin/messages/${id}/block`)
      .then(() => alert(`Blocked ${email}`))
      .catch((err) => console.error(err));
  };

  const handleBranchForm = (e) => {
    const { name, value } = e.target;
    setBranchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/admin/branches/add", branchForm)
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
          <p><strong>{msg.name} ({msg.email}):</strong> {msg.content}</p>
            <textarea
              placeholder="Type your reply here"
              value={replyContent[msg._id] || ""}
              onChange={(e) => handleReplyChange(msg._id, e.target.value)}
            />
            <button onClick={() => handleReply(msg._id)}>Send Reply</button>
            <button onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
            <button onClick={() => handleBlockSender(msg._id, msg.email)}>Block</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Branches</h3>
        <form onSubmit={handleBranchSubmit}>
          <input name="name" placeholder="Branch Name" value={branchForm.name || ""} onChange={handleBranchForm} />
          <input name="address" placeholder="Address" value={branchForm.address || ""} onChange={handleBranchForm} />
          <input name="phone" placeholder="Phone" value={branchForm.phone || ""} onChange={handleBranchForm} />
          <button type="submit">Add Branch</button>
        </form>
        <div>
          <h4>Branch List</h4>
          {branches.length === 0 && <p>No branches available.</p>}
          {branches.map((branch, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {branch.name || branch.location || "N/A"}</p>
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
