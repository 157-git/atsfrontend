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

const CallingExcel = ({ onClose, displayCandidateForm, loginEmployeeName }) => {
  const [file, setFile] = useState(null);
  // line number 16 added by sahil karnekar for manage input state for lineup file input
  const [lineupFile, setLineupFile] = useState(null);
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
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const lineupFileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);
  const { employeeId, userType } = useParams();
  // Separate error states for each file input
  // line number 34 to 36 added by sahil karnekar for manage error state
  const [hasErrorCalling, setHasErrorCalling] = useState(false);
  const [hasErrorLineup, setHasErrorLineup] = useState(false);
  const [hasErrorResume, setHasErrorResume] = useState(false);

  const handleTableChange = (tableName) => {
    setActiveTable(tableName);
  };

  // this code from line number 43 to 59 added by sahil karnekar methods are same as previous just added new code but all three methods complete code is required
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
    setHasErrorCalling(false); // Reset error when file is selected
  };

  const handleLineupFileChange = (e) => {
    setLineupFile(e.target.files[0]);
    setUploadSuccessLineUp(false);
    setHasErrorLineup(false); // Reset error when file is selected
  };

  const handleResumeFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setUploadSuccessResume(false);
    setHasErrorResume(false); // Reset error when files are selected
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
      // line number 95to 97 added by sahil karnekar
      setHasErrorLineup(false);
      setHasErrorResume(false);
      setHasErrorCalling(true);
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/upload-calling-tracker/${employeeId}/${userType}`,
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
      // line number 123 added by sahil karnekar
      setHasErrorCalling(false);
    } catch (error) {
      toast.error("Upload error:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleUploadLineupFile = async () => {
    // this variable should be changed in if condition added by sahil karnekar, previous variable file new variable lineupFile
    if (!lineupFile) {
      // line number 135 to 137 added by sahil karnekar
      setHasErrorCalling(false);
      setHasErrorResume(false);
      setHasErrorLineup(true);
      toast.error("Please select a file to upload."); //Swapnil Error&success message
      return;
    }
    const formData = new FormData();
    // this variable should be changed in formData.append("file", lineupFile); added by sahil karnekar, previous variable name file new variable lineupFile
    formData.append("file", lineupFile);
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/upload-lineup-tracker/${employeeId}/${userType}`,

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
      setLineupFile(null);
      resetFileInput(lineupFileInputRef);
      // this line number 166 added by sahil karnekar
      setHasErrorLineup(false);
    } catch (error) {
      toast.error("Upload error:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFiles.length) {
      // this line number 178 to 180  added by sahil karnekar
      setHasErrorCalling(false);
      setHasErrorLineup(false);
      setHasErrorResume(true); // Set error only for the third input
      toast.error("Please select files to upload.");
      return;
    }

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
      // line number 204 added by sahil karnekar
      setHasErrorResume(false);
    } catch (error) {
      toast.error("Error uploading files:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleActionClick = () => {
    setShowCards(false);
    setShowCallingTrackerForm(true); // Show CallingTrackerForm when action icon is clicked
  };

  if (showCallingTrackerForm) {
    return <CallingTrackerForm />; // Return CallingTrackerForm only when `showCallingTrackerForm` is true
  }

  // download function added by sahil karnekar line 222 to 230
  const handleDownloadButton = (fileLocation) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to download this file?"
    );
    if (userConfirmed) {
      window.location.href = fileLocation;
    }
  };

  // line nummber 177 to 179 added by sahil karnekar toggleSection
  const toggleSection = (value) => {
    setShowCards(value);
  };

  return (
    <div className="callingfiel">
      {showCards && (
        //  {/* this line added by sahil date 22-10-2024 */}
        <div className="fileupload" style={{position:"sticky"}}>
          <div className="upload-data-cards">
            <div
              className="card fixed-card"
              style={{ width: "90%", border: "1px solid gray" }}
            >
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload Calling Tracker</h5>
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
                      // this code line 264 to line 268 added by sahil karnekar
                      style={
                        hasErrorCalling
                          ? {
                              border: "1px solid red",
                              borderRadius: "15px",
                              boxShadow: "0 0 2px 1px rgba(255, 0, 0, 0.7)",
                            }
                          : {}
                      }
                    />
                  )}
                </div>
                <div className="gap-2 d-grid">
                  <button onClick={handleUpload}>Upload</button>
                  {/* download added by sahil karnekar line 275 to 277 */}
                  <button
                    onClick={() =>
                      handleDownloadButton("/files/Calling_Tracker_Format.xlsx")
                    }
                    title="To upload the data, download Excel format"
                  >
                    Download
                  </button>
                  <button onClick={() => handleTableChange("CallingExcelList")}>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="upload-data-cards">
            <div
              className="card fixed-card"
              style={{ width: "90%", border: "1px solid gray" }}
            >
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload LineUp Tracker </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {!uploadSuccessLineUp && (
                    <input
                      type="file"
                      className="form-control"
                      accept=".xls,.xlsx"
                      // this code line 303 to 309 added by sahil karnekar
                      onChange={handleLineupFileChange}
                      ref={lineupFileInputRef}
                      style={
                        hasErrorLineup
                          ? {
                              border: "1px solid red",
                              borderRadius: "15px",
                              boxShadow: "0 0 2px 1px rgba(255, 0, 0, 0.7)",
                            }
                          : {}
                      }
                    />
                  )}
                </div>
                <div className="gap-2 d-grid">
                  {/* this line 315 added by sahil karnekar */}
                  <button onClick={handleUploadLineupFile}>Upload</button>
                  {/* download added by sahil karnekar line 317 to 319 */}
                  <button
                    onClick={() =>
                      handleDownloadButton("/files/Lineup_Tracker_Format.xlsx")
                    }
                  >
                    Download
                  </button>
                  <button onClick={() => handleTableChange("LineupExcelData")}>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="upload-data-cards">
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
                      ref={resumeFileInputRef}
                      // line 347 to 351 added by sahil karnekar
                      style={
                        hasErrorResume
                          ? {
                              border: "1px solid red",
                              borderRadius: "15px",
                              boxShadow: "0 0 2px 1px rgba(255, 0, 0, 0.7)",
                            }
                          : {}
                      }
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

      <div className="upload-tables-section">
        {loading && <Loader />}
        {activeTable === "CallingExcelList" && (
          <CallingExcelList
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick}
            onClick={displayCandidateForm}
            toggleSection={toggleSection}
            loginEmployeeName={loginEmployeeName}
            // this line added by sahil karnekar line 302
          />
        )}

        {activeTable === "LineupExcelData" && (
          <LineupExcelData
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick} // Pass the handler to the table component
            toggleSection={toggleSection} // this line added by sahil karnekar line 302
            loginEmployeeName={loginEmployeeName}
          />
        )}

        {activeTable === "ResumeList" && (
          <ResumeList
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick} // Pass the handler to the table component
            loginEmployeeName={loginEmployeeName}
          />
        )}
      </div>
    </div>
  );
};

export default CallingExcel;
