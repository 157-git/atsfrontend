  import React, { useState } from "react";
import axios from "axios";
import "./AddResumes.css"; // Import the CSS file
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";


const AddResumes = ({ show }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {employeeId,userType} = useParams();

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    axios
      .post(
        `${API_BASE_URL}/add-multiple-resume/${employeeId}/${userType}`,
        formData
      )

      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading files: ", error);
      });
  };

  if (show) {
    // Conditionally render based on the show prop
    return null; // Return null if show is true (to hide component)
  }

  return (
    <div className="main-container" style={{ width: "400px" }}>
      <div className="upload-container">
        <h2 className="upload-title">Upload Resume</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>
    </div>
  );
};

export default AddResumes;
