import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../ResumeData/shareLink.css";
import CryptoJS from "crypto-js";
import { Tag } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

const ShareLink = ({ toggleResumeLink, loginEmployeeName }) => {
  const { employeeId, userType } = useParams();
  const [copyMessage, setCopyMessage] = useState("");
  const [userUrlString, setUserUrlString] = useState("");
  const firstName = loginEmployeeName.split(" ")[0];
  const [displayCopyBtn, setDisplayCopyBtn] = useState(false);

  const getEncodeUrlString = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/save-shorten-url`, {
        employeeId: employeeId,
        userType: `${userType}`,
      });
      console.log(response);
      setUserUrlString(response.data.shortenUrl);
      setDisplayCopyBtn(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEncodeUrlString();
  }, []);

  // updated code for strong encryption according to requirments
  // exposing directly in file just for testing and normal use purpose, please set this secreat key in env file while deploying on server
  const secretKey = "157industries_pvt_ltd"; // Use a consistent key across components

  const shareUrl = `https://rg.157careers.in/application-form/${firstName}+${userUrlString}`;

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
      {displayCopyBtn && (
        <div className="shareLink-share-btn-Div">
          <h1
            style={{
              color: "var(--sidebar-txt)",
            }}
          >
            Share Link To Candidate
          </h1>
          <div className="share-copy-div">
            <button className="shareLink-share-btn" onClick={handleShareLink}>
              Share 🔗
            </button>
            <button className="shareLink-share-btn" onClick={handleCopyLink}>
              Copy Link 🔗
            </button>
          </div>
          <span style={{ color: "var(--sidebar-txt)", fontSize: "14px" }}>
            Share this link with the candidate so they can fill in their
            information through the link.
          </span>
          {copyMessage && (
            <div className="copyMessage">
              <Tag color="#87d068">{copyMessage}</Tag>
            </div>
          )}
        </div>
      )}

      <div className="shareLink-view-btn-Div">
        <h1
          style={{
            color: "var(--sidebar-txt)",
          }}
        >
          Resume Builder
        </h1>
        <button className="shareLink-view-btn" onClick={toggleResumeLink}>
          Create
        </button>
        <span style={{ color: "var(--sidebar-txt)", fontSize: "14px" }}>
          If the candidate doesn't have a resume, they can create one here.
        </span>
      </div>
    </div>
  );
};

export default ShareLink;
