import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../Css/Chatbot.css";

const socket = io("https://coffeehouse-4yii.onrender.com");

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages for the user
    axios
      .get("https://coffeehouse-4yii.onrender.com/api/admin/messages") // Correct API endpoint from backend
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.error(err));

    // Listen for new messages from admin or user
    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("messageReply", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageReply");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!input.trim() || !name.trim() || !email.trim()) {
      alert("Please enter your name, email, and message.");
      return;
    }

    // Send message to backend
    axios
      .post("https://coffeehouse-4yii.onrender.com/api/admin/messages", {
        name,
        email,
        subject: "User message",
        content: input,
      })
      .then((res) => {
        setInput("");
        // The new message will be added via socket event
      })
      .catch((err) => console.error(err));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-icon" onClick={toggleChat} aria-label="Chatbot">
        💬
        {messages.some((msg) => !msg.read && msg.from === "admin") && (
          <span className="chatbot-badge" />
        )}
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Chat with Admin</h4>
            <button className="close-btn" onClick={toggleChat} aria-label="Close chat">
              &times;
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 && <p className="no-messages">No messages yet.</p>}
            {messages.map((msg) => (
              <div key={msg._id} className="chatbot-message user-message">
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {msg.replyContent && (
                  <div className="chatbot-message admin-message reply-message">
                    <div className="message-content">{msg.replyContent}</div>
                    <div className="message-time">
                      {new Date(msg.updatedAt || msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
          <input
            className="chatbot-input-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="chatbot-input-email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="chatbot-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={2}
          />
          <button className="send-btn" onClick={handleSend} aria-label="Send message">
            Send
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
