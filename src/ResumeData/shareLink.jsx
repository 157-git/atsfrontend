import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../ResumeData/shareLink.css";
import CryptoJS from "crypto-js";
import { Tag } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import CvTemplate from "./cv";
import ResumeCopy from "./resumecopy";
import cv3 from "../photos/cv3.jpeg";
import resumecopy2 from "../photos/resumecopy2.jpeg";

const ShareLink = ({ toggleResumeLink, loginEmployeeName }) => {
  const { employeeId, userType } = useParams();
  const [copyMessage, setCopyMessage] = useState("");
  const [userUrlString, setUserUrlString] = useState("");
  const [displayCopyBtn, setDisplayCopyBtn] = useState(false);
  const [activeComponent, setActiveComponent] = useState("main");

  const getFirstName = () => {
    // If the string is empty, generate a random 3-character string
    if (!loginEmployeeName) {
      const randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let randomString = "";
      for (let i = 0; i < 3; i++) {
        randomString +=
          randomChars[Math.floor(Math.random() * randomChars.length)];
      }
      return randomString;
    }
    // Check if there's a space before the 3rd character
    const spaceIndex = loginEmployeeName.indexOf(" ");
    if (spaceIndex !== -1 && spaceIndex < 3) {
      // Split by space and return the first part
      return loginEmployeeName.split(" ")[0];
    } else {
      // Otherwise, split at the 3rd character
      return loginEmployeeName.substring(0, 3);
    }
  };
  const firstName = getFirstName(loginEmployeeName);

  const getEncodeUrlString = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/save-shorten-url`, {
        employeeId: employeeId,
        userType: `${userType}`,
      });
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

  const shareUrl = `https://rg.157careers.in/applicant-form/${firstName}+${userUrlString}`;

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

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopyMessage("The link has been copied to your clipboard.");
          setTimeout(() => setCopyMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Copy failed: ", err);
          setCopyMessage("Failed to copy the link. Please try again.");
        });
    } else {
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

  const handleBackToMain = () => {
    setActiveComponent("main");
  };

  return (
    <div className="shareLink-mainDiv">
      {displayCopyBtn && activeComponent === "main" && (
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

      <div className="shareLink-url-div-top-div">
        {activeComponent === "main" && (
          <div className="maincontainercvredisplay">
            <h2 className="resumebuilderheadingdisplay">Resume Builder</h2>
            <div className="gridcomponentdisplay">
              <div className="cardcomponentdisplay">
                <img src={cv3} alt="Resume" className="preview-imgdisplay" />
                <button
                  className="buttonmaincomponentdisplay"
                  onClick={() => setActiveComponent("cv")}
                >
                  Create CV
                </button>
              </div>
              <div className="cardcomponentdisplay">
                <img
                  src={resumecopy2}
                  alt="CV"
                  className="preview-imgdisplay"
                />
                <button
                  className="buttonmaincomponentdisplay"
                  onClick={() => setActiveComponent("resume")}
                >
                  Create Resume
                </button>
              </div>
            </div>
            <p className="textresumebulderdisplay">
              If the candidate doesn't have a resume, they can create one here.
            </p>
          </div>
        )}

        {activeComponent === "cv" && <CvTemplate onClose={handleBackToMain} />}
        {activeComponent === "resume" && (
          <ResumeCopy onClose={handleBackToMain} />
        )}
      </div>
    </div>
  );
};

export default ShareLink;
