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
import * as XLSX from "xlsx";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal, Progress, Spin } from "antd";
import staticvector1 from "../assets/uploadingvectorhuman.svg"

const CallingExcel = ({ onClose, displayCandidateForm, loginEmployeeName , onsuccessfulDataAdditions}) => {
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

  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheets, setSelectedSheets] = useState({});
  const [displayLoader, setDisplayLoader] = useState(false);
  const [displayUploadButton, setDisplayUploadButton] = useState(false);
  const [viewsSearchTerm, setSearchTerm] = useState();
  // State for jobDesignation
  const [resumeJobDesignation, setResumeJobDesignation] = useState("");
  const [excelJobDesignation, setexcelJobDesignation] = useState("");
  const [loadingProgressBar,setLoadingProgressBar]= useState(false);
  const [progressLength, setprogressLength] = useState(0);

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

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadSuccess(false);

    if (selectedFile) {
      setDisplayLoader(true);
      setHasErrorCalling(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetNamesList = workbook.SheetNames.map((name, index) => ({
          name,
          index: index + 1, // Index starts at 1
        }));
        setSheetNames(sheetNamesList);

        // Initialize selection state for checkboxes
        const initialSelectedSheets = sheetNamesList.reduce((acc, sheet) => {
          acc[sheet.index] = false;
          return acc;
        }, {});
        setSelectedSheets(initialSelectedSheets);
        setDisplayLoader(false);
        setDisplayUploadButton(true);
        const uploadButton = document.getElementById("buttonUploadDynamic");
        uploadButton.classList.add("newUploadStyle");
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelectedSheets((prevSelected) => ({
      ...prevSelected,
      [index]: !prevSelected[index],
    }));
  };

  const handleUpload = async () => {
    setActiveTable("");
    setLoading(true);

    // Check if a file is selected
    if (!file) {
      setHasErrorResume(false);
      setHasErrorCalling(true);
      toast.error("Please select a file to upload.");
      setLoading(false);
      return;
    }

    // Get selected indices for sheets to upload
    const selectedIndices = Object.keys(selectedSheets)
      .filter((index) => selectedSheets[index])
      .join(",");

    if (!selectedIndices) {
      toast.error("Please select at least one sheet.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetIndices", selectedIndices);

    // Add jobDesignation to the form data
    formData.append(
      "jobDesignation",
      excelJobDesignation.trim() || "DEFAULT_JOB_DESIGNATION"
    );

    try {
      // Upload file to API
      console.log("Link come here 001");
      await axios.post(
        `${API_BASE_URL}/upload-excel-files/${employeeId}/${userType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Success: reset states and show success toast
      console.log("Link come here 002");

      setUploadSuccess(true);
      setexcelJobDesignation("");
      toast.success("File Uploaded Successfully");

      const currentTime = getCurrentIndianTime();
      setSearchTerm(currentTime);
      handleTableChange("CallingExcelList");

      // Reset file input and related state
      setFile(null);
      // setSheetNames([]);
      // setSelectedSheets({});

      // if (fileInputRef.current) {
      //   fileInputRef.current.value = "";
      // }
    } catch (error) {
      // Error: show error toast but keep the file selected
      toast.error(`Upload error 009 : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async () => {
    setActiveTable("");
    var openTable = "ResumeList";
    if (!selectedFiles.length) {
      // Set error for resume if no files are selected
      setHasErrorCalling(false);
      setHasErrorLineup(false);
      setHasErrorResume(true); // Error for third input
      toast.error("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    // Add jobDesignation to the form data
    formData.append(
      "jobDesignation",
      resumeJobDesignation.trim() || "DEFAULT_JOB_DESIGNATION"
    );

    setLoadingProgressBar(true);
    try {
      setprogressLength(0);

      for (let i = 20; i <= 60; i += 20) {
        setprogressLength(i);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated delay
      }
      // Make the POST request
      const response = await axios.post(
        `${API_BASE_URL}/add-multiple-resume/${employeeId}/${userType}`,
        formData
      );
      setprogressLength(80)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay

      if (response.status === 200) {
        const responseData = response.data;

        const uploadedCount = responseData["Uploaded Resume Count"] || 0;
        const replacedCount = responseData["Replaced Resume Count"] || 0;
        const problematicCount = responseData["Problematic Resume Count"] || 0;
        const totalProcessed = responseData["Total Files Processed"] || 0;

        toast.success(
          ` Total Files Processed  :  ${totalProcessed}\n` +
            ` Uploaded Resumes Count :  ${uploadedCount}\n` +
            ` Replaced Resumes Count :  ${replacedCount}\n` +
            ` Problematic Resumes    :  ${problematicCount}`
        );

        setUploadSuccessResume(true);
        handleTableChange("ResumeList");
        hideSuccessMessage();
        setSelectedFiles([]);
        setResumeJobDesignation("");
        resetFileInput(resumeFileInputRef);
        setHasErrorResume(false);
      }
      setprogressLength(100);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulated delay
    } catch (error) {
      console.log(error);
      
      toast.error("Error uploading files.");
    } finally {
      setLoadingProgressBar(false); // Hide loader
    }
  };

  const getCurrentIndianTimeForResume = () => {
    const date = new Date();

    // Format day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Format hour and minute
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
  };

  const getCurrentIndianTime = () => {
    const date = new Date();

    // Format day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Format hour and minute
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";

    // Convert 24-hour to 12-hour format
    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
  };

  const truncateMinutes = (timeString) => {
    // Split the time string into parts
    const [date, timePeriod] = timeString.split(" ");
    const [time, period] = timePeriod.split(" ");
    const [hours, minutes] = time.split(":");
    const truncatedMinutes = minutes.charAt(0);
    return `${date} ${hours}:${truncatedMinutes}`;
  };

  const handleTableChange = (tableName) => {
    setActiveTable(tableName);
    if (tableName === "CallingExcelList") {
      const currentTime = getCurrentIndianTime();
      const truncatedTime = truncateMinutes(currentTime);
      setSearchTerm(truncatedTime); // Set the truncated time as the search term
    }
    if (tableName === "ResumeList") {
      const currentTime = getCurrentIndianTimeForResume();
      setSearchTerm(currentTime); // Set the truncated time as the search term
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

  const [sheetNamesCalling, setSheetNamesCalling] = useState([]);
  const [selectedSheetsCalling, setSelectedSheetsCalling] = useState({});

  const handleFileUploadCalling = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetNamesCalling = workbook.SheetNames;
        setSheetNamesCalling(sheetNamesCalling);

        // Initialize selected sheets with all sheets set to false
        const initialSelectedSheets = sheetNamesCalling.reduce(
          (acc, sheetName) => {
            acc[sheetName] = false;
            return acc;
          },
          {}
        );
        setSelectedSheetsCalling(initialSelectedSheets);
      };

      reader.readAsArrayBuffer(file);
    }
    console.log(sheetNamesCalling);
  };

  const handleCheckboxChangeCalling = (sheetName) => {
    setSelectedSheetsCalling((prevSelectedSheets) => ({
      ...prevSelectedSheets,
      [sheetName]: !prevSelectedSheets[sheetName],
    }));
  };

  const printSelectedSheetsCalling = () => {
    // Get indices (1-based) of selected sheets instead of names
    const selectedIndices = sheetNamesCalling
      .map((sheetName, index) =>
        selectedSheetsCalling[sheetName] ? index + 1 : null
      )
      .filter((index) => index !== null);

    if (sheetNamesCalling.length === 0) {
      alert("Please select at least one File.");
      return;
    }

    if (selectedIndices.length === 0) {
      alert("Please select at least one sheet.");
      return;
    }
    console.log("Selected Sheets by Index:", selectedIndices);
  };

  return (
    <div className="callingfiel">
      {showCards && (
        //  {/* this line added by sahil date 22-10-2024 */}
        <div className="fileupload" style={{ position: "sticky" }}>
          <div className="upload-data-cards">
            <div
              className="card fixed-card"
              style={{
                width: "100%",
                border: "1px solid gray",
                backgroundColor: "#f2f2f2",
              }}
            >
              {/* sahil date 8-11-2024 */}
              <div className="card-header">
                <h5 className="mb-0 card-title">Upload Excel File </h5>
              </div>

              <div className="card-body">
                <div className="mb-3 setDisplayLoader">
                  {displayLoader && <ClipLoader color={"#34D1B2"} />}

                  <input
                    ref={fileInputRef} // Attach the ref here
                    type="file"
                    accept=".xlsx, .xls, .xlsm, .xlsb, .xltx, .xlt"
                    onChange={handleFileUpload}
                    className="form-control"
                    style={
                      // this is updated by sahil karnekar
                      hasErrorCalling
                        ? {
                            border: "1px solid red",
                            borderRadius: "15px",
                            boxShadow: "0 0 2px 1px rgba(255, 0, 0, 0.7)",
                          }
                        : {}
                    }
                  />
                </div>
                <div>
                  {sheetNames.length > 0 ? (
                    <ul>
                      <p>Please Select Sheet</p>
                      {sheetNames.map(({ name, index }) => (
                        <li key={index}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedSheets[index] || false}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <span> {name} </span>
                            {/* (Sheet {index}) */}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    !sheetNames && <p>No sheets found in the selected file.</p>
                  )}
                </div>
                <span style={{ color: "black", fontSize: "13px" }}>
                  If you know the job designations of all candidates in the
                  Excel sheet, please mention them below
                </span>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter Designation (Optional)"
                    value={excelJobDesignation}
                    onChange={(e) => setexcelJobDesignation(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="gap-2 d-grid">
                  {/* updated by sahil karnekar */}
                  {/* {
                    displayUploadButton && ( */}
                  <button
                    // style={{
                    //   backgroundColor: !displayUploadButton ? "gray" : ""
                    // }}
                    id="buttonUploadDynamic"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                  {/* )
                  } */}

                  {/* download added by sahil karnekar line 275 to 277 */}
                  {/* <button
                    onClick={() =>
                      handleDownloadButton("/files/Calling_Tracker_Format.xlsx")
                    }
                    title="To upload the data, download Excel format"
                  >
                    Download Excel Format
                  </button> */}
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
              style={{
                width: "100%",
                border: "1px solid gray",
                backgroundColor: "#f2f2f2",
              }}
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
                <span style={{ color: "black", fontSize: "13px" }}>
                  If you know the job designations of all the CVs, please
                  mention them below.
                </span>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter Designation (Optional)"
                    value={resumeJobDesignation}
                    onChange={(e) => setResumeJobDesignation(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="gap-2 d-grid">
                  <button onClick={handleUploadResume}>Upload Resumes</button>
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
        {loadingProgressBar &&
        <Modal open={loadingProgressBar} closable={false}
        footer={null}
        maskClosable={false}
        width={600} >
       <>
       <img src={staticvector1} alt="hvhg" />
       <div className="wraploadersandprogress">
       <Spin />
        <Progress percent={progressLength} style={{
          marginLeft:"20px"
        }} />
       </div>
       
       
       </>
      </Modal>
        }
        {activeTable === "CallingExcelList" && (
          <CallingExcelList
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick}
            onClick={displayCandidateForm}
            toggleSection={toggleSection}
            loginEmployeeName={loginEmployeeName}
            onsuccessfulDataAdditions={onsuccessfulDataAdditions}
            // viewsSearchTerm={viewsSearchTerm}
            // this line added by sahil karnekar line 302
          />
        )}

        {activeTable === "LineupExcelData" && (
          <LineupExcelData
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick} // Pass the handler to the table component
            toggleSection={toggleSection} // this line added by sahil karnekar line 302
            loginEmployeeName={loginEmployeeName}
            onsuccessfulDataAdditions={onsuccessfulDataAdditions}
          />
        )}

        {activeTable === "ResumeList" && (
          <ResumeList
            onCloseTable={() => setActiveTable("")}
            onActionClick={handleActionClick} // Pass the handler to the table component
            loginEmployeeName={loginEmployeeName}
            onsuccessfulDataAdditions={onsuccessfulDataAdditions}
            // viewsSearchTerm={viewsSearchTerm}
          />
        )}
      </div>
    </div>
  );
};

export default CallingExcel;
