import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchEmployeeMasterSheet, fetchFile } from "../api/api";
import "./EmployeeMasterSheet.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

const EmployeeMasterSheet = () => {
  const [data, setData] = useState([]);
  // sahil karnekar line 16 to 111
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [uniqueValues, setUniqueValues] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    candidateId: [],
    alternateNumber: [],
    callingFeedback: [],
    candidateEmail: [],
    candidateName: [],
    communicationRating: [],
    contactNumber: [],
    currentLocation: [],
    date: [],
    jobDesignation: [],
    recruiterName: [],
    applyingCompany: [],
    jobId: [],
    interestedOrNot: [],
    sourceName: [],
    empId: [],
    lineupId: [],
    addedTime: [],
    fullAddress: [],
    incentive: [],
    oldEmployeeId: [],
    availabilityForInterview: [],
    companyName: [],
    DateOfBirth: [],
    extraCertification: [],
    feedBack: [],
    finalStatus: [],
    gender: [],
    holdingAnyOffer: [],
    messageForUser: [],
    noticePeriod: [],
    qualification: [],
    yearOfPassout: [],
    interviewTime: [],
    currentCtcLack: [],
    currentCtcThousand: [],
    expectedCtcLack: [],
    expectedCtcThousand: [],
    experienceInMonth: [],
    experienceInYear: [],
    offerLatterMessage: [],
    relevantExperience: []
  });

  const [expandedFilters, setExpandedFilters] = useState({});
  const fieldIndexMap = {
    candidateId: 0,
    alternateNumber: 1,
    callingFeedback: 2,
    candidateEmail: 3,
    candidateName: 4,
    communicationRating: 5,
    contactNumber: 6,
    currentLocation: 7,
    date: 8,
    jobDesignation: 9,
    recruiterName: 10,
    applyingCompany: 11,
    jobId: 12,
    interestedOrNot: 13,
    sourceName: 14,
    empId: 15,
    lineupId: 16,
    addedTime: 17,
    fullAddress: 18,
    incentive: 19,
    oldEmployeeId: 20,
    availabilityForInterview: 21,
    companyName: 22,
    DateOfBirth: 23,
    extraCertification: 24,
    feedBack: 25,
    finalStatus: 26,
    gender: 27,
    holdingAnyOffer: 28,
    messageForUser: 29,
    noticePeriod: 30,
    qualification: 31,
    yearOfPassout: 32,
    interviewTime: 33,
    currentCtcLack: 34,
    currentCtcThousand: 35,
    expectedCtcLack: 36,
    expectedCtcThousand: 37,
    experienceInMonth: 38,
    experienceInYear: 39,
    offerLatterMessage: 40,
    relevantExperience: 41
  };

  const displayNameMap = {
    candidateId: "Candidate Id",
    alternateNumber: "Alternate Number",
    callingFeedback: "Calling Feedback",
    candidateEmail: "Candidate Email",
    candidateName: "Candidate Name",
    communicationRating: "Communication Rating",
    contactNumber: "Contact Number",
    currentLocation: "Current Location",
    date: "Added Date",
    jobDesignation: "Job Designation",
    recruiterName: "Recruiter Name",
    applyingCompany: "Applying Company",
    jobId: "Job Id",
    interestedOrNot: "Status Type",
    sourceName: "Source Name",
    empId: "Employee Id",
    lineupId: "Lineup Id",
    addedTime: "Added Time",
    fullAddress: "Full Address",
    incentive: "Incentive",
    oldEmployeeId: "Old Employee Id",
    availabilityForInterview: "Availability For Interview",
    companyName: "Company Name",
    DateOfBirth: "Date Of Birth",
    extraCertification: "Extra Certification",
    feedBack: "Feedback",
    finalStatus: "Final Status",
    gender: "Gender",
    holdingAnyOffer: "Holding Any Offer",
    messageForUser: "Message For User",
    noticePeriod: "Notice Period",
    qualification: "Qualification",
    yearOfPassout: "Year Of Passout",
    interviewTime: "Interview Time",
    currentCtcLack: "Current CTC (Lack)",
    currentCtcThousand: "Current CTC (Thousand)",
    expectedCtcLack: "Expected CTC (Lack)",
    expectedCtcThousand: "Expected CTC (Thousand)",
    experienceInMonth: "Experience In Month",
    experienceInYear: "Experience In Year",
    offerLatterMessage: "Offer Letter Message",
    relevantExperience: "Relevant Experience"
  };
  

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const { employeeId } = useParams();
  const { userType } = useParams();
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_25
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_26
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_27
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [isDataSending, setIsDataSending] = useState(false);
  const [loading, setLoading] = useState(true);

  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_39
  const [oldselectedTeamLeader, setOldSelectedTeamLeader] = useState({
    oldTeamLeaderId: "",
    oldTeamLeaderJobRole: "",
  });
  const [newselectedTeamLeader, setNewSelectedTeamLeader] = useState({
    newTeamLeaderId: "",
    newTeamLeaderJobRole: "",
  });

  const [selectedRecruiters, setSelectedRecruiters] = useState({
    index: "",
    recruiterId: "",
    recruiterJobRole: "",
  });

  const [oldSelectedManager, setOldSelectedManager] = useState({
    oldManagerId: "",
    oldManagerJobRole: "",
  });
  const [newSelectedManager, setNewSelectedManager] = useState({
    newManagerId: "",
    newManagerJobRole: "",
  });
  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_46

  useEffect(() => {
    fetchData();
  }, []);

  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_54
  const fetchManager = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-all-managers`);
      const data = await response.json();
      setFetchAllManager(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchTeamLeader = async (empId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tl-namesIds/${empId}`);
      const data = await response.json();
      setFetchTeamleader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };
  const fetchRecruiters = async (teamLeaderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
      );
      const data = await response.json();
      setRecruiterUnderTeamLeader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };
  useEffect(() => {
    if (userType === "SuperUser") {
      fetchManager();
    } else if (userType === "Manager") {
      fetchTeamLeader(employeeId);
    } else {
      fetchRecruiters(employeeId);
    }
  }, []);
  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_98
  const fetchData = async () => {
    try {
      const response = await fetch(
        // sahil karnekar line 212 set employeeId and usertType in Api at the time of deployement this url is just for testing
        `${API_BASE_URL}/master-sheet/${employeeId}/${userType}`
      );
      const data = await response.json();
      setData(data);
      // sahil karnekar line 216
      extractUniqueValues(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
      setLoading(false);
    }
  };

  const handleViewFile = async (url) => {
    if (!url) {
      setError("Invalid file URL");
      return;
    }

    try {
      const fileData = await fetchFile(url);
      const file = new Blob([fileData], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      setFileUrl(fileURL);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching file:", error);
      setError("Error fetching file.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl("");
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = data.map((item) => item[0]); // Assuming candidateId is the first element
      setSelectedRows(allRowIds);
    }
    setAllSelected(!allSelected);
  };

  const handleSelectRow = (candidateId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(candidateId)) {
        return prevSelectedRows.filter((id) => id !== candidateId);
      } else {
        return [...prevSelectedRows, candidateId];
      }
    });
  };

  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_159
  const forwardSelectedCandidate = (e) => {
    e.preventDefault();
    if (selectedRows.length > 0 && userType === "TeamLeader") {
      setShowForwardPopup(true);
    }
    if (userType === "SuperUser") {
      setShowForwardPopup(true);
    }
    if (userType === "Manager") {
      setShowForwardPopup(true);
    }
  };

  const handleShare = async () => {
    setIsDataSending(true);
    let url = `${API_BASE_URL}/updateIds/${userType}`;
    let requestData;
    if (
      userType === "TeamLeader" &&
      selectedRecruiters.recruiterId != "" &&
      selectedRows.length > 0
    ) {
      requestData = {
        employeeId: parseInt(selectedRecruiters.recruiterId),
        candidateIds: selectedRows,
      };
    } else if (userType === "Manager") {
      requestData = {
        currentTeamLeaderId: parseInt(oldselectedTeamLeader.oldTeamLeaderId),
        newTeamLeaderId: parseInt(newselectedTeamLeader.newTeamLeaderId),
      };
    } else {
      requestData = {
        currentManagerId: parseInt(oldSelectedManager.oldManagerId),
        newManagerId: parseInt(newSelectedManager.newManagerId),
      };
    }
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers as needed
        },
        body: JSON.stringify(requestData),
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle success response
      setIsDataSending(false);
      toast.log("Candidates forwarded successfully!"); //Swapnil Error&success message
      fetchCallingTrackerData();
      onSuccessAdd(true);
      setShowForwardPopup(false); // Close the modal or handle any further UI updates
      setShowShareButton(true);
      setSelectedRows([]);
      setSelectedRecruiters({
        index: "",
        recruiterId: "",
        recruiterJobRole: "",
      });
      setOldSelectedTeamLeader({
        oldTeamLeaderId: "",
        oldTeamLeaderJobRole: "",
      });
      setNewSelectedTeamLeader({
        newTeamLeaderId: "",
        newTeamLeaderJobRole: "",
      });
      setOldSelectedManager({
        oldManagerId: "",
        oldManagerJobRole: "",
      });
      setNewSelectedManager({
        newManagerId: "",
        newManagerJobRole: "",
      });
      // fetchShortListedData(); // Uncomment this if you want to refresh the data after forwarding
    } catch (error) {
      setIsDataSending(false);
      setShowForwardPopup(false);
      toast.error("Error while forwarding candidates:", error); //Swapnil Error&success message
      // Handle error scenarios or show error messages to the user
    }
  };
  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_243

  //Name:-Akash Pawar Component:-EmployeeMarksheet Subcategory:-ResumeViewButton(added) start LineNo:-135 Date:-02/07
  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        // Detect file type based on file name extension or content
        const fileType = fileName.split(".").pop().toLowerCase();

        // Convert PDF
        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }

        // Convert Word document (assuming docx format)
        if (fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          return URL.createObjectURL(blob);
        }

        // Handle other document types here if needed

        // If file type is not supported
        console.error(`Unsupported document type: ${fileType}`);
        return "Unsupported Document";
      } catch (error) {
        console.error("Error converting byte code to document:", error);
        return "Invalid Document";
      }
    }
    return "Document Not Found";
  };

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedCandidateDocument, setSelectedCandidateDocument] =
    useState("");

  const openDocumentModal = (byteCode) => {
    setSelectedCandidateDocument(byteCode);
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setSelectedCandidateDocument("");
    setShowDocumentModal(false);
  };
  //Name:-Akash Pawar Component:-EmployeeMarksheet Subcategory:-ResumeViewButton(added) End LineNo:-167 Date:-02/07

  // sahil karnekar  line 422 to 471
  const extractUniqueValues = (data) => {
    const uniqueValuesMap = {};
    Object.keys(fieldIndexMap).forEach((field) => {
      const values = data.map((item) => item[fieldIndexMap[field]]);
      uniqueValuesMap[field] = [...new Set(values)];
    });
    setUniqueValues(uniqueValuesMap);
  };

  const handleFilterChange = (field, value) => {
    setSelectedFilters((prevFilters) => {
      const isValueSelected = prevFilters[field].includes(value);
      const updatedValues = isValueSelected
        ? prevFilters[field].filter((v) => v !== value)
        : [...prevFilters[field], value];

      return {
        ...prevFilters,
        [field]: updatedValues,
      };
    });
  };

  const toggleFilter = (field) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const applyFilters = (data) => {
    let filtered = data;

    Object.keys(selectedFilters).forEach((field) => {
      const fieldValues = selectedFilters[field];
      if (fieldValues.length > 0) {
        const fieldIndex = fieldIndexMap[field];
        filtered = filtered.filter((item) =>
          fieldValues.includes(item[fieldIndex])
        );
      }
    });

    return filtered;
  };

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  return (
    <div className="calling-list-container">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          <div className="search">
            <div className="master-sheet-header">
              <h3 style={{ color: "gray", fontSize: "18px" }}>
                Employee Master Sheet
              </h3>
            </div>

            <div
            className="master-sheet-share-btn"
            >

                {/* sahil karnekar line 526 to 536 */}
                {userType !== "Recruiters" && (
                  <div>
                    {showShareButton ? (
                      <button
                        className="EmployeeMasterSheet-share-btn"
                        onClick={() => setShowShareButton(false)}
                      >
                        Share
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          className="lineUp-share-close-btn"
                          onClick={() => setShowShareButton(true)}
                        >
                          Close
                        </button>
                        {/* akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_331 */}
                        {userType === "TeamLeader" && (
                          <button
                            className="lineUp-share-btn"
                            onClick={handleSelectAll}
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </button>
                        )}
                        {/* akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_339 */}
                        <button
                          className="lineUp-forward-btn"
                          onClick={forwardSelectedCandidate}
                        >
                          Forward
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button
                  className="master-sheet-filterbtn"
                  onClick={toggleFilterSection}
                >
                  Filter <i className="fa-solid fa-filter"></i>
                </button>
            
            </div>
          </div>

          {/* sahil karnekar line 541 to 573 */}
          <div className="filter-dropdowns">
  {showFilterSection && (
    <div className="filter-section">
      {Object.keys(uniqueValues).map((field) => (
        <div className="filter-option" key={field}>
          <button
            className="white-Btn"
            onClick={() => toggleFilter(field)}
            style={{ cursor: "pointer" }}
          >
            {displayNameMap[field] || field}
            <span className="filter-icon">&#x25bc;</span>
          </button>
          {expandedFilters[field] && (
            <div className="city-filter">
              <div className="optionDiv">
                {uniqueValues[field].map((value, index) => (
                  <label className="selfcalling-filter-value" key={index}>
                    <input
                      name="testName"
                      style={{ marginRight: "5px" }}
                      type="checkbox"
                      checked={selectedFilters[field].includes(value)}
                      onChange={() => handleFilterChange(field, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>


          {error && <div className="alert alert-danger">{error}</div>}
          <div className="attendanceTableData">
            <table className="attendance-table">
              <thead>
                <tr className="attendancerows-head">
                  {!showShareButton && userType === "TeamLeader" ? (
                    <th className="attendanceheading">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedRows.length === data.length}
                        name="selectAll"
                      />
                    </th>
                  ) : null}

                  <th className="attendanceheading">Emp ID</th>
                  {(userType === "TeamLeader" || userType === "Manager") && (
                    <th className="attendanceheading">Team Leader Id</th>
                  )}
                  <th className="attendanceheading">Candidate ID</th>
                  <th className="attendanceheading">Candidate Name</th>
                  <th className="attendanceheading">Candidate Email</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Alternate Number</th>
                  <th className="attendanceheading">Calling Feedback</th>
                  <th className="attendanceheading">Communication Rating</th>
                  <th className="attendanceheading">Current Location</th>
                  <th className="attendanceheading">Date</th>
                  <th className="attendanceheading">Job Designation</th>
                  <th className="attendanceheading">Recruiter Name</th>
                  <th className="attendanceheading">Applying Company</th>
                  <th className="attendanceheading">Job Id</th>
                  <th className="attendanceheading">Interested Or Not</th>
                  <th className="attendanceheading">Source Name</th>
                  <th className="attendanceheading">Line Up ID</th>
                  <th className="attendanceheading">Added Time</th>
                  <th className="attendanceheading">Full Address</th>
                  <th className="attendanceheading">Incentive</th>
                  <th className="attendanceheading">Old Employee Id</th>
                  <th className="attendanceheading">
                    Availability for Interview
                  </th>
                  <th className="attendanceheading">Company Name</th>
                  <th className="attendanceheading">Date of Birth</th>
                  <th className="attendanceheading">Extra Certification</th>
                  <th className="attendanceheading">Feedback</th>
                  <th className="attendanceheading">Final Status</th>
                  <th className="attendanceheading">Gender</th>
                  <th className="attendanceheading">Holding Any Offer</th>
                  {userType === "Recruiters" && (
                    <th className="attendanceheading">
                      Message For Team Leader
                    </th>
                  )}
                  {userType === "TeamLeader" && (
                    <th className="attendanceheading">Message For Manager</th>
                  )}
                  {userType === "Manager" && (
                    <th className="attendanceheading">
                      Message Form Team Leader
                    </th>
                  )}
                  <th className="attendanceheading">Notice Period</th>

                  <th className="attendanceheading">Qualification</th>
                  <th className="attendanceheading">Year of Passing</th>
                  <th className="attendanceheading">Interview Time</th>

                  <th className="attendanceheading">Current CTC Lakh</th>
                  <th className="attendanceheading">Current CTC Thousand</th>
                  <th className="attendanceheading">Expected CTC Lakh</th>
                  <th className="attendanceheading">Expected CTC Thousand</th>
                  <th className="attendanceheading">Experience In Month</th>
                  <th className="attendanceheading">Experience In Year</th>
                  <th className="attendanceheading">Offer Letter Msg</th>
                  <th className="attendanceheading">Relevant Experince</th>
                  <th className="attendanceheading">Link Verified Status</th>

                  <th className="attendanceheading">Response Update ID</th>
                  <th className="attendanceheading">Interview Response</th>
                  <th className="attendanceheading">Interview Round</th>
                  <th className="attendanceheading">Comment For TL</th>
                  <th className="attendanceheading">Next Interview Date</th>
                  <th className="attendanceheading">Response Updated Date</th>
                  <th className="attendanceheading">Next Interview Timing</th>

                  <th className="attendanceheading">Details ID</th>
                  <th className="attendanceheading">Mail Received</th>

                  <th className="attendanceheading">Resume</th>
                  <th className="attendanceheading">Aadhaar Card</th>
                  <th className="attendanceheading">PAN Card</th>
                  <th className="attendanceheading">Driving License</th>
                  <th className="attendanceheading">Degree Mark Sheet</th>
                  <th className="attendanceheading">HSC Mark Sheet</th>
                  <th className="attendanceheading">SSC Mark Sheet</th>

                  <th className="attendanceheading">Offer Letter Received</th>
                  <th className="attendanceheading">Offer Letter Accepted</th>
                  <th className="attendanceheading">
                    Reason for Rejection Offer Letter
                  </th>
                  <th className="attendanceheading">Join Status</th>
                  <th className="attendanceheading">Reason for Not Join</th>
                  <th className="attendanceheading">Join Date</th>
                  {/* <th className="attendanceheading">Interview History</th> */}
                  <th className="attendanceheading">Inquiry ID</th>
                  <th className="attendanceheading">Active Status</th>
                  <th className="attendanceheading">Any Problem</th>
                  <th className="attendanceheading">Call Date</th>
                  <th className="attendanceheading">Daily Impact</th>
                  <th className="attendanceheading">Inactive Reason</th>
                  <th className="attendanceheading">Office Environment</th>
                  <th className="attendanceheading">Staff Behavior</th>
                  {/* <th className="attendanceheading">FollowUp History</th> */}
                  {/* <th className="attendanceheading">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {/* sahil karnekar line 695 */}
                {applyFilters(data).map((entry, index) => (
                  <tr key={index} className="attendancerows">
                    {!showShareButton && userType === "TeamLeader" ? (
                      <td className="tabledata">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(entry[0])}
                          onChange={() => handleSelectRow(entry[0])}
                        />
                      </td>
                    ) : null}

                    <td className="tabledata">{entry[15]}</td>
                    {(userType === "TeamLeader" || userType === "Manager") && (
                      <td className="tabledata">{entry[73]}</td>
                    )}
                    <td className="tabledata">{entry[0]}</td>
                    <td className="tabledata">{entry[4]}</td>
                    <td className="tabledata">{entry[3]}</td>
                    <td className="tabledata">{entry[6]}</td>

                    <td className="tabledata">{entry[1]}</td>
                    <td className="tabledata">{entry[2]}</td>

                    <td className="tabledata">{entry[5]}</td>
                    <td className="tabledata">{entry[7]}</td>
                    <td className="tabledata">{entry[8]}</td>
                    <td className="tabledata">{entry[9]}</td>
                    <td className="tabledata">{entry[10]}</td>
                    <td className="tabledata">{entry[11]}</td>
                    <td className="tabledata">{entry[12]}</td>
                    <td className="tabledata">{entry[13]}</td>
                    <td className="tabledata">{entry[14]}</td>
                    <td className="tabledata">{entry[16]}</td>
                    <td className="tabledata">{entry[17]}</td>
                    <td className="tabledata">{entry[18]}</td>
                    <td className="tabledata">{entry[19]}</td>
                    <td className="tabledata">{entry[20]}</td>
                    <td className="tabledata">{entry[21]}</td>
                    <td className="tabledata">{entry[22]}</td>
                    <td className="tabledata">{entry[23]}</td>
                    <td className="tabledata">{entry[24]}</td>
                    <td className="tabledata">{entry[25]}</td>
                    <td className="tabledata">{entry[26]}</td>
                    <td className="tabledata">{entry[27]}</td>
                    <td className="tabledata">{entry[28]}</td>
                    <td className="tabledata">{entry[29]}</td>
                    <td className="tabledata">{entry[30]}</td>
                    <td className="tabledata">{entry[31]}</td>
                    <td className="tabledata">{entry[32]}</td>
                    <td className="tabledata">{entry[33]}</td>
                    <td className="tabledata">{entry[34]}</td>
                    <td className="tabledata">{entry[35]}</td>
                    <td className="tabledata">{entry[36]}</td>
                    <td className="tabledata">{entry[37]}</td>
                    <td className="tabledata">{entry[38]}</td>
                    <td className="tabledata">{entry[39]}</td>
                    <td className="tabledata">{entry[40]}</td>
                    <td className="tabledata">{entry[41]}</td>
                    <td className="tabledata">{entry[42]}</td>
                    <td className="tabledata">{entry[43]}</td>
                    <td className="tabledata">{entry[44]}</td>
                    <td className="tabledata">{entry[45]}</td>
                    <td className="tabledata">{entry[46]}</td>
                    <td className="tabledata">{entry[47]}</td>
                    <td className="tabledata">{entry[48]}</td>
                    <td className="tabledata">{entry[49]}</td>
                    <td className="tabledata">{entry[50]}</td>
                    <td className="tabledata">{entry[51]}</td>
                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-340
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[52])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-EmployeeMarkSheet
                  Subcategory:-ResumeViewButton(added) End LineNo:-354
                  Date:-02/07 */}
                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-378
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[53])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-Rejected
                  Subcategory:-ResumeViewButton(added) End LineNo:-389
                  Date:-02/07 */}

                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-391
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[54])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-Rejected
                  Subcategory:-ResumeViewButton(added) End LineNo:-403
                  Date:-02/07 */}

                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-407
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[55])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-EmployeeMarksheet
                  Subcategory:-ResumeViewButton(added) End LineNo:-418
                  Date:-02/07 */}

                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-422
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[56])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-EmployeeMarkSheet
                  Subcategory:-ResumeViewButton(added) End LineNo:-433
                  Date:-02/07 */}

                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-437
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[57])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-Rejected
                  Subcategory:-ResumeViewButton(added) End LineNo:-448
                  Date:-02/07 */}

                    {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                  Subcategory:-ResumeViewButton(added) start LineNo:-451
                  Date:-02/07 */}
                    <td className="tabledata">
                      <button
                        className="text-secondary"
                        onClick={() => openDocumentModal(entry[58])}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                    {/* Name:-Akash Pawar Component:-EmployeeMarksheet
                  Subcategory:-ResumeViewButton(added) End LineNo:-463
                  Date:-02/07 */}

                    <td className="tabledata">{entry[59]}</td>
                    <td className="tabledata">{entry[60]}</td>

                    <td className="tabledata">{entry[61]}</td>
                    <td className="tabledata">{entry[62]}</td>
                    <td className="tabledata">{entry[63]}</td>
                    <td className="tabledata">{entry[64]}</td>
                    {/* <td className="tabledata">
                  <button className="View-Interview-History">View</button>
                </td> */}
                    <td className="tabledata">{entry[65]}</td>
                    <td className="tabledata">{entry[66]}</td>
                    <td className="tabledata">{entry[67]}</td>
                    <td className="tabledata">{entry[68]}</td>
                    <td className="tabledata">{entry[69]}</td>
                    <td className="tabledata">{entry[70]}</td>
                    <td className="tabledata">{entry[71]}</td>
                    <td className="tabledata">{entry[72]}</td>

                    {/* <td className="tabledata">
                  <button className="FollowUp-History">View</button>
                </td> */}
                    {/* <td className="tabledata">
                  <i className="fa-regular fa-pen-to-square"></i>
                </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {showForwardPopup ? (
              <>
                <div
                  className="bg-black bg-opacity-50 modal show"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                  }}
                >
                  <Modal.Dialog
                    style={{
                      width: "500px",
                      height: "800px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "100px",
                    }}
                  >
                    <Modal.Header
                      style={{ fontSize: "18px", backgroundColor: "#f2f2f2" }}
                    >
                      Forward To
                    </Modal.Header>
                    <Modal.Body
                      style={{
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_1007 */}
                      <div className="accordion">
                        {fetchAllManager && userType === "SuperUser" && (
                          <div className="manager-data-transfer">
                            <div className="old-manager-data">
                              <center>
                                <h1>Old Managers</h1>
                              </center>
                              {fetchAllManager.map((managers) => (
                                <div
                                  className="accordion-item-SU"
                                  key={managers.managerId}
                                >
                                  <div className="accordion-header-SU">
                                    <label
                                      htmlFor={`old-${managers.managerId}`}
                                      className="accordion-title"
                                    >
                                      <input
                                        type="radio"
                                        name="oldmanagers"
                                        id={`old-${managers.managerId}`}
                                        value={managers.managerId}
                                        checked={
                                          oldSelectedManager.oldManagerId ===
                                          managers.managerId
                                        }
                                        onChange={() =>
                                          setOldSelectedManager({
                                            oldManagerId: managers.managerId,
                                            oldManagerJobRole:
                                              managers.managerJobRole,
                                          })
                                        }
                                      />{" "}
                                      {managers.managerName}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="new-manager-data">
                              <center>
                                <h1>New Managers</h1>
                              </center>
                              {fetchAllManager
                                .filter(
                                  (item) =>
                                    item.managerId !==
                                    oldSelectedManager.oldManagerId
                                )
                                .map((managers) => (
                                  <div
                                    className="accordion-item-SU"
                                    key={managers.managerId}
                                  >
                                    <div className="accordion-header-SU">
                                      <label
                                        htmlFor={`new-${managers.managerId}`}
                                        className="accordion-title"
                                      >
                                        <input
                                          type="radio"
                                          name="newmanagers"
                                          id={`new-${managers.managerId}`}
                                          value={managers.managerId}
                                          checked={
                                            newSelectedManager.newManagerId ===
                                            managers.managerId
                                          }
                                          onChange={() =>
                                            setNewSelectedManager({
                                              newManagerId: managers.managerId,
                                              newManagerJobRole:
                                                managers.managerJobRole,
                                            })
                                          }
                                        />{" "}
                                        {managers.managerName}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {fetchTeamleader && userType === "Manager" && (
                          <div className="teamleader-data-transfer">
                            <div className="old-teamleader-data">
                              <center>
                                <h1>Old Team Leaders</h1>
                              </center>
                              {fetchTeamleader.map((teamleaders) => (
                                <div
                                  className="accordion-item-M"
                                  key={teamleaders.teamLeaderId}
                                >
                                  <div className="accordion-header-M">
                                    <label
                                      htmlFor={`old-${teamleaders.teamLeaderId}`}
                                      className="accordion-title"
                                    >
                                      <input
                                        type="radio"
                                        name="oldteamleaders"
                                        id={`old-${teamleaders.teamLeaderId}`}
                                        value={teamleaders.teamLeaderId}
                                        checked={
                                          oldselectedTeamLeader.oldTeamLeaderId ===
                                          teamleaders.teamLeaderId
                                        }
                                        onChange={() =>
                                          setOldSelectedTeamLeader({
                                            oldTeamLeaderId:
                                              teamleaders.teamLeaderId,
                                            oldTeamLeaderJobRole:
                                              teamleaders.teamLeaderJobRole,
                                          })
                                        }
                                      />{" "}
                                      {teamleaders.teamLeaderName}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="new-teamleader-data">
                              <center>
                                <h1>New Team Leaders</h1>
                              </center>
                              {fetchTeamleader
                                .filter(
                                  (item) =>
                                    item.teamLeaderId !==
                                    oldselectedTeamLeader.oldTeamLeaderId
                                )
                                .map((teamleaders) => (
                                  <div
                                    className="accordion-item-M"
                                    key={teamleaders.managerId}
                                  >
                                    <div className="accordion-header-SU">
                                      <label
                                        htmlFor={`new-${teamleaders.teamLeaderId}`}
                                        className="accordion-title"
                                      >
                                        <input
                                          type="radio"
                                          name="newteamleaders"
                                          id={`new-${teamleaders.teamLeaderId}`}
                                          value={teamleaders.teamLeaderId}
                                          checked={
                                            newselectedTeamLeader.newTeamLeaderId ===
                                            teamleaders.teamLeaderId
                                          }
                                          onChange={() =>
                                            setNewSelectedTeamLeader({
                                              newTeamLeaderId:
                                                teamleaders.teamLeaderId,
                                              newTeamLeaderJobRole:
                                                teamleaders.teamLeaderJobRole,
                                            })
                                          }
                                        />{" "}
                                        {teamleaders.teamLeaderName}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        {userType === "TeamLeader" && (
                          <div className="accordion-item">
                            <div className="accordion-header">
                              <label className="accordion-title">
                                {loginEmployeeName}
                              </label>
                            </div>
                            <div className="accordion-content">
                              <form>
                                {recruiterUnderTeamLeader &&
                                  recruiterUnderTeamLeader.map((recruiters) => (
                                    <div
                                      key={recruiters.recruiterId}
                                      className="form-group"
                                    >
                                      <label htmlFor={recruiters.employeeId}>
                                        <input
                                          type="radio"
                                          id={recruiters.employeeId}
                                          name="recruiter"
                                          value={recruiters.employeeId}
                                          checked={
                                            selectedRecruiters.recruiterId ===
                                            recruiters.employeeId
                                          }
                                          onChange={() =>
                                            setSelectedRecruiters({
                                              index: 1,
                                              recruiterId:
                                                recruiters.employeeId,
                                              recruiterJobRole:
                                                recruiters.jobRole,
                                            })
                                          }
                                        />{" "}
                                        {recruiters.employeeName}
                                      </label>
                                    </div>
                                  ))}
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_1225 */}
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
                      <button
                        onClick={handleShare}
                        className="EmployeeMasterSheet-share-forward-popup-btn"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => setShowForwardPopup(false)}
                        className="EmployeeMasterSheet-close-forward-popup-btn"
                      >
                        Close
                      </button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </div>
              </>
            ) : null}
          </div>

          {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
          Subcategory:-ResumeModel(added) End LineNo:-567 Date:-02/07 */}
          <Modal show={showDocumentModal} onHide={closeDocumentModal} size="md">
            <Modal.Header closeButton>
              <Modal.Title>Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCandidateDocument ? (
                <iframe
                  src={convertToDocumentLink(
                    selectedCandidateDocument,
                    "Document.pdf"
                  )}
                  width="100%"
                  height="550px"
                  title="PDF Viewer"
                ></iframe>
              ) : (
                <p>No Document available</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeDocumentModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
          Subcategory:-ResumeModel(added) End LineNo:-592 Date:-02/07 */}
          {isDataSending && (
            <div className="ShareFunc_Loading_Animation">
              <ClipLoader size={50} color="#ffb281" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeMasterSheet;
