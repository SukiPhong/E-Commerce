import React, { useState } from "react";
import "./ChatBox.css";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import { Avatar } from "@mui/material";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    setMessages([...messages, { text: inputText, sender: "user" }]);
    setInputText("");
  };

  return (
    <div>
      <div
        className={`chat-toggle-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HelpIcon
          className="iconChatbox"
          sx={{ width: "40px", height: "60px" }}
          aria-label="Toggle Chatbox"
        />
      </div>
      {isOpen && (
        <div className="chat-box">
          <div className="chat-container">
            <div className="chat-header">
              <img src="/Logo.png" alt="Logo" className="logochatbox" />
              <button
                className="btnchatboxclose"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-container ${message.sender}`}
                >
                  {message.sender === "bot" && (
                    <Avatar sx={{ width: "15px", height: "15px" }} />
                  )}
                  <div
                    className={`${message.sender === "user" ? "user" : "bot"}`}
                  >
                    <p
                      style={{ margin: "5px" }}
                      className={`${message.sender}Mess`}
                    >
                      {message.text}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar sx={{ width: "15px", height: "15px" }} />
                  )}
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button className="btnchatbox" onClick={handleSendMessage}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
