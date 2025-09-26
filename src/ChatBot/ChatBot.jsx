import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css";
import { API_BASE_URL } from "../api/api";

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");          // current question
  const [response, setResponse] = useState("");      // bot's answer
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    console.log("Question:", prompt); // log question
    try {
      const res = await axios.post(`${API_BASE_URL}/ask`, { prompt });
      const answer = res.data.message;
      console.log("Answer:", answer);

      setResponse(answer);    // only bot answer in response box
      // prompt stays in input box
    } catch (err) {
      console.error(err);
    }
  };

  const handleBotClick = () => {
    if (!showChat) {
      setShowChat(true);
      setMinimized(false);
    } else if (minimized) {
      setMinimized(false);
    }
  };

  const handleMinimize = () => setMinimized(true);

  const handleClose = () => {
    setShowChat(false);
    setMinimized(false);
    setPrompt("");       // clear question
    setResponse("");     // clear answer
  };

  return (
    <div>
      {/* Bot Icon */}
      <div className="bot-container" onClick={handleBotClick}>
        <img src="/rgLogo.png" alt="bot" className="bot-image" />
        <div className="ai-label">ASK ME</div>
      </div>

      {/* Chatbox */}
      {showChat && !minimized && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <span className="chatbox-title">Chat</span>
            <div className="chatbox-icons">
              <button style={{ color: "white" }} onClick={handleMinimize}>_</button>
              <button className="chatbox-close-all" style={{ color: "white" }} onClick={handleClose}>🗙</button>   {/* close symbol */}
            </div>
          </div>

          {/* Input at top */}
          <textarea
            className="chatbox-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Anything..."
          />
          <button className="chatbox-send" onClick={sendPrompt}>Send</button>

          {/* Response below input */}
          <div className="chatbox-response">
            {response && <div className="chatbox-response-text"><strong>Bot:</strong> {response}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
