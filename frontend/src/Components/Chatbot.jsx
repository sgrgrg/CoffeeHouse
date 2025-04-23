import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../Css/Chatbot.css";
import { AuthContext } from "../contexts/AuthContext";

const socket = io("https://coffeehouse-4yii.onrender.com");

const Chatbot = () => {
  const { authData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages for the user
    axios
      .get("https://coffeehouse-4yii.onrender.com/api/admin/messages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.error(err));

    // Listen for new messages
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
    if (!authData) {
      setMessages([]);
    }
  }, [authData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (!input.trim()) {
      alert("Please enter your message.");
      return;
    }
    if (!authData) {
      alert("Please login to send messages.");
      return;
    }

    axios
      .post(
        "https://coffeehouse-4yii.onrender.com/api/admin/messages",
        {
          name: authData.user.username,
          email: authData.user.email,
          subject: "User message",
          content: input,
        },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      )
      .then(() => {
        setInput("");
        // message will be added through socket event
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
            {!authData ? (
              <p>Please login to send messages.</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;


