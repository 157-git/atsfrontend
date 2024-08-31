import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LineupExcelData from "./lineupExcelData";
import "./callingExcel.css";
import CallingExcelList from "../Excel/callingExcelData";
import ResumeList from "./resumeList";
import { toast } from "react-toastify";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

const CallingExcel = ({ onClose, displayCandidateForm }) => {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadErrorLineUp, setUploadErrorLineUp] = useState(null);
  const [uploadErrorResume, setUploadErrorResume] = useState(null);
  const [activeTable, setActiveTable] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSuccessLineUp, setUploadSuccessLineUp] = useState(false);
  const [uploadSuccessResume, setUploadSuccessResume] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showCards, setShowCards] = useState(true);
  const [showCallingTrackerForm, setShowCallingTrackerForm] = useState(false);
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);
  const lineupFileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);
  const { employeeId, userType } = useParams();

  const handleTableChange = (tableName) => {
    setActiveTable(tableName);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  const handleResumeFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const hideSuccessMessage = () => {
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadSuccessLineUp(false);
      setUploadSuccessResume(false);
    }, 1);
  };

  const resetFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `${API_BASE_URL}/uploadData-calling-data/${employeeId}/${userType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadSuccess(true);
      toast.success("File Uploaded Successfully");
      setActiveTable("CallingExcelList");
      hideSuccessMessage();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      toast.error("Upload error:", error);
    }finally {
      setLoading(false); // Hide loader
    }
  };

  const handleUploadLineupFile = async () => {
    if (!file) {
      toast.error("Please select a file to upload."); //Swapnil Error&success message
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await axios.post(

        `${API_BASE_URL}/upload-calling-lineup-data/${employeeId}/${userType}`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadSuccessLineUp(true);
      toast.success("File Uploaded Successfully");
      setActiveTable("LineupExcelData");
      hideSuccessMessage();
      setFile(null);
      resetFileInput(lineupFileInputRef);
    } catch (error) {
      toast.error("Upload error:", error);
    }finally {
      setLoading(false); // Hide loader
    }
  };

  const handleUploadResume = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/add-multiple-resume/${employeeId}/${userType}`,

        formData
      );
      setUploadSuccessResume(true);
      toast.success("File Uploaded Successfully");
      setActiveTable("ResumeList");
      hideSuccessMessage();
      setSelectedFiles([]);
      resetFileInput(resumeFileInputRef);
    } catch (error) {
      toast.error("Error uploading files:", error);
    }finally {
      setLoading(false); // Hide loader
    }
  };

  const handleActionClick = () => {
    setShowCards(false);
    setShowCallingTrackerForm(true);  // Show CallingTrackerForm when action icon is clicked
  };

  if (showCallingTrackerForm) {
    return <CallingTrackerForm />; // Return CallingTrackerForm only when `showCallingTrackerForm` is true
  }


  return (

    <div
      className="callingfiel"
      style={{
        display: showCards ? "flex" : "none",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingTop: "15px",
        gap: "12px",
      }}
    >
      {showCards && (
        <div className="fileupload">
          <div>
            <div
              className="card fixed-card"
              style={{ width: "90%", border: "1px solid gray" }}
            >
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload Calling Excel </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {!uploadSuccess && (
                    <input
                      type="file"
                      className="form-control"
                      accept=".xls,.xlsx"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  )}
                </div>
                <div className="gap-2 d-grid">
                  <button onClick={handleUpload}>Upload</button>
                  <button onClick={() => handleTableChange("CallingExcelList")}>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              className="card fixed-card"
              style={{ width: "90%", border: "1px solid gray" }}
            >
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload LineUp Excel </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {!uploadSuccessLineUp && (
                    <input
                      type="file"
                      className="form-control"
                      accept=".xls,.xlsx"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  )}
                </div>
                <div className="gap-2 d-grid">
                  <button onClick={handleUploadLineupFile}>Upload</button>

                  <button onClick={() => handleTableChange("LineupExcelData")}>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              className="card fixed-card"
              style={{ width: "90%", border: "1px solid gray" }}
            >
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload Resume </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {!uploadSuccessResume && (
                    <input
                      type="file"
                      multiple
                      onChange={handleResumeFileChange}
                      className="form-control"
                      ref={fileInputRef}
                    />
                  )}
                </div>
                <div className="gap-2 d-grid">
                  <button onClick={handleUploadResume}>Upload</button>
                  <button onClick={() => handleTableChange("ResumeList")}>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    {loading && <Loader />} 
      {activeTable === "CallingExcelList" && (
        <CallingExcelList
          onCloseTable={() => setActiveTable("")}
          onActionClick={handleActionClick}
          onClick={displayCandidateForm}
        />
      )}

      {activeTable === "LineupExcelData" && (
        <LineupExcelData
          onCloseTable={() => setActiveTable("")}
          onActionClick={handleActionClick}  // Pass the handler to the table component
        />
      )}

      {activeTable === "ResumeList" && (
        <ResumeList
          onCloseTable={() => setActiveTable("")}
          onActionClick={handleActionClick}  // Pass the handler to the table component
        />
      )}
    </div>

  );
};

export default CallingExcel;
