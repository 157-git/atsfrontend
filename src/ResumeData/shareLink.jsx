import React from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";
import "../ResumeData/shareLink.css";

const ShareLink = ({ toggleResumeLink }) => {
  const { employeeId, userType } = useParams();

  // Hardcoded base URL for sharing
  const shareUrl = `http://93.127.199.85/157industries/${employeeId}/${userType}/candidate-form`;

  const handleFallbackShare = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("The link has been copied to your clipboard. You can paste it to share.");
  };

  return (
    <div className="shareLink-mainDiv">
      {navigator.share ? (
        <RWebShare
          data={{
            url: shareUrl, // This will be shared and will open directly in the browser when clicked
            title: "Share Candidate Form",
            text: "Click the link to fill out the candidate form",
          }}
        >
          <div className="shareLink-share-btn-Div">
            <h1>Share Link To Candidate</h1>
            <button className="shareLink-share-btn">Share 🔗</button>
            <span style={{ color: "black", fontSize: "14px" }}>
              Share this link with the candidate so they can fill in their information through the link.
            </span>
          </div>
        </RWebShare>
      ) : (
        <div className="shareLink-share-btn-Div">
          <h1>Share Link To Candidate</h1>
          <button className="shareLink-share-btn" onClick={handleFallbackShare}>
            Copy Link 🔗
          </button>
          <span style={{ color: "black", fontSize: "14px" }}>
            Copy this link and send it to the candidate: {shareUrl}
          </span>
        </div>
      )}
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
