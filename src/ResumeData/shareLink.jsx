import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../ResumeData/shareLink.css";

const ShareLink = ({ toggleResumeLink }) => {
  const { employeeId, userType } = useParams();
  const [copyMessage, setCopyMessage] = useState("");

  // Encoding logic to obscure employeeId, userType, and add randomness
  const encodeParams = (id, type) => {
    const randomString = Math.random().toString(36).substring(2, 8); // Random 6-character string
    const timestamp = Date.now(); // Current timestamp
    const combinedString = `${id}:${type}:${randomString}:${timestamp}`;
    const encoded = btoa(combinedString); // Base64 encoding
    return encoded;
  };

  // Decoding logic (for use when the form is accessed)
  const decodeParams = (encoded) => {
    const decoded = atob(encoded);
    const [id, type] = decoded.split(":"); // Use only the first two parts
    return { id, type };
  };

  const encodedParams = encodeParams(employeeId, userType);
  const shareUrl = `http://rg.157careers.in/157industries/${encodedParams}/candidate-form`;

  // Share using Web Share API
  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Candidate Form",
          text: "Click the link to fill out the candidate form",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        alert("Failed to share. Please try again.");
      }
    } else {
      alert("Sharing is not supported on this device or browser.");
    }
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopyMessage("The link has been copied to your clipboard.");
          setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
        })
        .catch((err) => {
          console.error("Copy failed: ", err);
          setCopyMessage("Failed to copy the link. Please try again.");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopyMessage("The link has been copied to your clipboard.");
      } catch (err) {
        console.error("Fallback copy failed: ", err);
        setCopyMessage("Failed to copy the link. Please try again.");
      } finally {
        document.body.removeChild(textArea);
        setTimeout(() => setCopyMessage(""), 3000);
      }
    }
  };

  return (
    <div className="shareLink-mainDiv">
      <div className="shareLink-share-btn-Div">
        <h1>Share Link To Candidate</h1>
        <div className="share-copy-div">
          <button className="shareLink-share-btn" onClick={handleShareLink}>
            Share 🔗
          </button>
          <button className="shareLink-share-btn" onClick={handleCopyLink}>
            Copy Link 🔗
          </button>
        </div>
        <span style={{ color: "black", fontSize: "14px" }}>
          Share this link with the candidate so they can fill in their information through the link.
        </span>
        {copyMessage && (
          <div className="copyMessage">
            <span style={{ color: "green", fontSize: "14px" }}>{copyMessage}</span>
          </div>
        )}
      </div>

      <div className="shareLink-view-btn-Div">
        <h1>Resume Builder</h1>
        <button className="shareLink-view-btn" onClick={toggleResumeLink}>
          Create
        </button>
        <span style={{ color: "black", fontSize: "14px" }}>
          If the candidate doesn't have a resume, they can create one here.
        </span>
      </div>
    </div>
  );
};

export default ShareLink;
