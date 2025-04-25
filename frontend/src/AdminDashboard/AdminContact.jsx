import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://coffeehouse-4yii.onrender.com");

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    axios.get("https://coffeehouse-4yii.onrender.com/api/admin/messages")
      .then((res) => setMessages(res.data))
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
    axios.patch(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}/reply`, { replyContent: content })
      .then(() => {
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
    axios.delete(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}`)
      .then(() => setMessages(messages.filter((msg) => msg._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleBlockSender = (id, email) => {
    axios.patch(`https://coffeehouse-4yii.onrender.com/api/admin/messages/${id}/block`)
      .then(() => alert(`Blocked ${email}`))
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
    </div>
  );
};

export default AdminContact;
