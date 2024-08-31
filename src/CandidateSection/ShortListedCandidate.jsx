import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CandidateSection/shortlistedcandidate.css";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import InterviewDates from "../EmployeeSection/interviewDate";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { API_BASE_URL } from "../api/api";
// SwapnilRokade_ShortListedCandidates_ModifyFilters_11/07

const ShortListedCandidates = ({
  loginEmployeeName,
  toggleShortListed /*Akash_Pawar_ShortListedCandidate_toggleShortListed(show interview candidate)_23/07_LineNo_12*/,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);

  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [shortListedData, setShortListedData] = useState([]);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [showselectedFilters, setShowselectedFilters] = useState(false);
  const [filteredShortListed, setFilteredShortListed] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_25
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_26
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_27
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [isDataSending, setIsDataSending] = useState(false);

  const { employeeId } = useParams();
  const newEmployeeId = parseInt(employeeId, 10);
  const navigator = useNavigate();

  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_39
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
  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_62

  const limitedOptions = [
    "alternateNumber",
    "availabilityForInterview",
    "callingFeedback",
    "callingTrackerId",
    "candidateAddedTime",
    "candidateEmail",
    "candidateId",
    "candidateName",
    "communicationRating",
    "companyName",
    "contactNumber",
    "currentCtcLakh",
    "currentCtcThousand",
    "currentLocation",
    "date",
    "dateOfBirth",
    "empId",
    "expectedCtcLakh",
    "expectedCtcThousand",
    "experienceMonth",
    "experienceYear",
    "extraCertification",
    "feedBack",
    "finalStatus",
    "fullAddress",
    "gender",
    "holdingAnyOffer",
    "incentive",
    "interviewTime",
    "jobDesignation",
    "msgForTeamLeader",
    "noticePeriod",
    "offerLetterMsg",
    "oldEmployeeId",
    "qualification",
    "recruiterName",
    "relevantExperience",
    "requirementCompany",
    "requirementId",
    "selectYesOrNo",
    "sourceName",
    "yearOfPassing",
  ];

  const { userType } = useParams();

  useEffect(() => {
    fetchShortListedData();
  }, []);

  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_116
  const fetchManager = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/get-all-managers`
      );
      const data = await response.json();
      setFetchAllManager(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchTeamLeader = async (empId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tl-namesIds/${empId}`
      );
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
      fetchRecruiters(newEmployeeId);
    }
  }, []);
  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_160

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const fetchShortListedData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shortListed-date/${newEmployeeId}/${userType}`
      );
      const data = await response.json();
      setShortListedData(data);
      setFilteredShortListed(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetchShortListedData(); // Corrected from fetchRejectedData to fetchShortListedData
  };

  const handleUpdate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setShowUpdateCallingTracker(true);
  };

  const handleMouseOver = (event) => {
    const tableData = event.currentTarget;
    const tooltip = tableData.querySelector(".tooltip");
    const tooltiptext = tableData.querySelector(".tooltiptext");

    if (tooltip && tooltiptext) {
      const textOverflowing =
        tableData.offsetWidth < tableData.scrollWidth ||
        tableData.offsetHeight < tableData.scrollHeight;
      if (textOverflowing) {
        const rect = tableData.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 100}px`;
        tooltip.style.visibility = "visible";
      } else {
        tooltip.style.visibility = "hidden";
      }
    }
  };

  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
  };

  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return sortOrder === "asc" ? (
        <i className="fa-solid fa-arrow-up"></i>
      ) : (
        <i className="fa-solid fa-arrow-down"></i>
      );
    }
    return null;
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = shortListedData.map((item) => item.candidateId);
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

  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_252
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
        setIsDataSending(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle success response
      setIsDataSending(false);
      console.log("Candidates forwarded successfully!");
      fetchShortListedData();
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
      console.error("Error while forwarding candidates:", error);
      // Handle error scenarios or show error messages to the user
    }
  };
  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_336

  useEffect(() => {
    const options = Object.keys(filteredShortListed[0] || {}).filter((key) =>
      limitedOptions.includes(key)
    );
    setFilterOptions(options);
  }, [filteredShortListed]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, shortListedData]);

  useEffect(() => {
    const filtered = shortListedData.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (item.date && item.date.toLowerCase().includes(searchTermLower)) ||
        (item.recruiterName &&
          item.recruiterName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateName &&
          item.candidateName.toLowerCase().includes(searchTermLower)) ||
        (item.candidateEmail &&
          item.candidateEmail.toLowerCase().includes(searchTermLower)) ||
        (item.contactNumber &&
          item.contactNumber.toString().includes(searchTermLower)) ||
        (item.sourceName &&
          item.sourceName.toLowerCase().includes(searchTermLower)) ||
        (item.requirementId &&
          item.requirementId
            .toString()
            .toLowerCase()
            .includes(searchTermLower)) ||
        (item.requirementCompany &&
          item.requirementCompany.toLowerCase().includes(searchTermLower)) ||
        (item.communicationRating &&
          item.communicationRating.toLowerCase().includes(searchTermLower)) ||
        (item.currentLocation &&
          item.currentLocation.toLowerCase().includes(searchTermLower)) ||
        (item.personalFeedback &&
          item.personalFeedback.toLowerCase().includes(searchTermLower)) ||
        (item.callingFeedback &&
          item.callingFeedback.toLowerCase().includes(searchTermLower)) ||
        (item.selectYesOrNo &&
          item.selectYesOrNo.toLowerCase().includes(searchTermLower)) ||
        (item.experienceYear &&
          item.experienceYear.toLowerCase().includes(searchTermLower)) ||
        (item.dateOfBirth &&
          item.dateOfBirth.toLowerCase().includes(searchTermLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchTermLower)) ||
        (item.qualification &&
          item.qualification.toLowerCase().includes(searchTermLower)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchTermLower))
      );
    });
    setFilteredShortListed(filtered);
  }, [searchTerm, shortListedData]);

  const handleFilterOptionClick = (option) => {
    if (activeFilterOption === option) {
      setActiveFilterOption(null);
    } else {
      setActiveFilterOption(option);
    }
  };

  useEffect(() => {
    if (sortCriteria) {
      const sortedList = [...filteredShortListed].sort((a, b) => {
        const aValue = a[sortCriteria];
        const bValue = b[sortCriteria];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return 0;
        }
      });
      setFilteredShortListed(sortedList);
    }
  }, [sortCriteria, sortOrder]);

  const filterData = () => {
    let filteredData = [...shortListedData];
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "candidateId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "requirementId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "employeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "contactNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "alternateNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            )
          );
        }
      }
    });
    setFilteredShortListed(filteredData);
  };

  const handleFilterSelect = (option, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[option]) {
        updatedFilters[option] = [];
      }

      const index = updatedFilters[option].indexOf(value);
      if (index === -1) {
        updatedFilters[option] = [...updatedFilters[option], value];
      } else {
        updatedFilters[option] = updatedFilters[option].filter(
          (item) => item !== value
        );
      }

      return updatedFilters;
    });
  };

  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
  };
  const toggleselectedFilters = () => {
    setShowselectedFilters(!showselectedFilters);
  };

  //Name:-Akash Pawar Component:-ShortListedCandidate Subcategory:-ResumeViewButton(added) start LineNo:-165 Date:-02/07
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
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };
  //Name:-Akash Pawar Component:-ShortListedCandidate Subcategory:-ResumeViewButton(added) End LineNo:-196 Date:-02/07

  return (
    <div className="calling-list-container">
      <div className="search">
        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "3px",
          }}
        >
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              setShowFilterSection(false);
            }}
            style={{ margin: "10px", width: "auto", fontSize: "15px" }}
          ></i>
          <i
            style={{ fontSize: "22px" }}
            onClick={
              toggleShortListed
            } /*Akash_Pawar_ShortlistedCandidate_toggleShortListed(show interview candidate)_23/07_LineNo_591*/
            className="fa-regular fa-calendar"
          ></i>
        </div>
        <h5 style={{ color: "gray", paddingTop: "5px" }}>
          Shortlisted Candidate
        </h5>

        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "3px",
          }}
        >
          {userType !== "Recruiters" && (
            <div>
              {showShareButton ? (
                <button
                  className="lineUp-share-btn"
                  onClick={() => setShowShareButton(false)}
                >
                  Share
                </button>
              ) : (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    className="lineUp-share-btn"
                    onClick={() => {
                      setShowShareButton(true);
                      setSelectedRows([]);
                    }}
                  >
                    Close
                  </button>
                  {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_602 */}
                  {userType === "TeamLeader" && (
                    <button
                      className="callingList-share-btn"
                      onClick={handleSelectAll}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  )}
                  {/* akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_609 */}
                  <button
                    className="lineUp-share-btn"
                    onClick={forwardSelectedCandidate}
                  >
                    Forward
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="lineUp-share-btn" onClick={toggleFilterSection}>
            Filter <i className="fa-solid fa-filter"></i>
          </button>
        </div>
      </div>
      {!showUpdateCallingTracker ? (
        <div className="attendanceTableData">
          {showSearchBar && (
            <input
              type="text"
              className="form-control"
              placeholder="Search here..."
              value={searchTerm}
              style={{ marginBottom: "10px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {showFilterSection && (
            <div className="filter-section">
              <div className="filter-dropdowns">
                {showFilterSection && (
                  <div className="filter-section">
                    <div className="filter-options-container">
                      {filterOptions.map((option) => {
                        const uniqueValues = Array.from(
                          new Set(shortListedData.map((item) => item[option]))
                        );
                        console.log(uniqueValues);
                        return (
                          <div key={option} className="filter-option">
                            <button
                              className="white-Btn"
                              onClick={() => handleFilterOptionClick(option)}
                            >
                              {option}
                              <span className="filter-icon">&#x25bc;</span>
                            </button>
                            {activeFilterOption === option && (
                              <div className="city-filter">
                                <div className="optionDiv">
                                  {uniqueValues.map((value) => (
                                    <label
                                      key={value}
                                      className="selfcalling-filter-value"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedFilters[option]?.includes(
                                            value
                                          ) || false
                                        }
                                        onChange={() =>
                                          handleFilterSelect(option, value)
                                        }
                                      />
                                      {value}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <table id="shortlisted-table-id" className="attendance-table">
            <thead>
              <tr className="attendancerows-head">
                {!showShareButton && userType === "TeamLeader" ? (
                  <th className="attendanceheading">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.length === shortListedData.length}
                      name="selectAll"
                    />
                  </th>
                ) : null}
                <th className="attendanceheading">Sr No.</th>
                <th className="attendanceheading">Date & Time</th>
                <th className="attendanceheading">Candidate's Id</th>
                <th className="attendanceheading">Recruiter's Name</th>
                <th className="attendanceheading">Candidate's Name</th>
                <th className="attendanceheading">Candidate's Email</th>
                <th className="attendanceheading">Contact Number</th>
                <th className="attendanceheading">Whatsapp Number</th>
                <th className="attendanceheading">Source Name</th>
                <th className="attendanceheading">Job Designation</th>
                <th className="attendanceheading">Job Id</th>
                <th className="attendanceheading">Applying Company</th>
                <th className="attendanceheading">Communication Rating</th>
                <th className="attendanceheading">Current Location</th>
                <th className="attendanceheading">Full Address</th>
                <th className="attendanceheading">Calling Remark</th>
                <th className="attendanceheading">Recruiter's Incentive</th>
                <th className="attendanceheading">Interested or Not</th>
                <th className="attendanceheading">Current Company</th>
                <th className="attendanceheading">Total Experience</th>
                <th className="attendanceheading">Relevant Experience</th>
                <th className="attendanceheading">Current CTC</th>
                <th className="attendanceheading">Expected CTC</th>
                <th className="attendanceheading">Date Of Birth</th>
                <th className="attendanceheading">Gender</th>
                <th className="attendanceheading">Education</th>
                <th className="attendanceheading">Year Of Passing</th>
                <th className="attendanceheading">Extra Certification</th>
                {/* call summary */}
                {/* <th className="attendanceheading">Feedback</th> */}
                <th className="attendanceheading">Holding Any Offer</th>
                <th className="attendanceheading">Offer Letter Message</th>
                <th className="attendanceheading">Resume</th>
                <th className="attendanceheading">Notice Period</th>
                {userType ==='TeamLeader' && 
                      <th className="attendanceheading">
                      Message For Manager
                    </th>}
                    {userType ==='Recruiters' && 
                      <th className="attendanceheading">
                      Message For Team Leader
                    </th>}
                <th className="attendanceheading">Interview Slot</th>
                <th className="attendanceheading">Interview Time</th>
                <th className="attendanceheading">Final Status</th>
                <th className="attendanceheading">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortListed.map((item, index) => (
                <tr key={item.candidateId} className="attendancerows">
                  {!showShareButton && userType === "TeamLeader" ? (
                    <td className="tabledata">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.candidateId)}
                        onChange={() => handleSelectRow(item.candidateId)}
                      />
                    </td>
                  ) : null}
                  <td className="tabledata">{index + 1}</td>

                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.date}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.date}</span>
                      --
                      <span className="tooltiptext">
                        {item.candidateAddedTime}
                      </span>
                    </div>
                    </td>
                  
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.candidateId}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.candidateId}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.recruiterName}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.recruiterName}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.candidateName}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.candidateName}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.candidateEmail}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.candidateEmail}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.contactNumber}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.contactNumber}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.alternateNumber}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {item.alternateNumber}
                      </span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.sourceName}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.sourceName}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.jobDesignation}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.jobDesignation}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.requirementId}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.requirementId}</span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.requirementCompany}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {item.requirementCompany}
                      </span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.communicationRating}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {item.communicationRating}
                      </span>
                    </div>
                  </td>
                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.currentLocation}
                    <div className="tooltip">
                      <span className="tooltiptext">
                        {item.currentLocation}
                      </span>
                    </div>
                  </td>

                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.fullAddress}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.fullAddress}</span>
                    </div>
                  </td>

                  <td className="tabledata">{item.callingFeedback}</td>
                  <td className="tabledata">{item.incentive}</td>
                  <td className="tabledata">{item.selectYesOrNo}</td>
                  <td className="tabledata">{item.companyName}</td>
                  <td className="tabledata">{item.experienceYear} Year {item.experienceMonth} Month</td>
                  <td className="tabledata">{item.relevantExperience}</td>
                  <td className="tabledata">{item.currentCtcLakh} Lakh {item.currentCtcThousand} Thousand</td>
                  <td className="tabledata">{item.expectedCtcLakh} Lakh {item.expectedCtcThousand} Thousand </td>
                  <td className="tabledata">{item.dateOfBirth}</td>
                  <td className="tabledata">{item.gender}</td>
                  <td className="tabledata">{item.qualification}</td>
                  <td className="tabledata">{item.yearOfPassing}</td>
                  <td className="tabledata">
                    {item.extraCertification}
                  </td>
                  {/* <td className="tabledata">{item.feedback}</td> */}
                  <td className="tabledata">{item.holdingAnyOffer}</td>
                  <td className="tabledata">{item.offerLetterMsg}</td>
                  {/* <td className="tabledata">{item.lineUp.resume}</td> */}
                  {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) start LineNo:-546
                  Date:-02/07 */}
                  <td className="tabledata">
                    <button
                      className="text-secondary"
                      onClick={() => openResumeModal(item.resume)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                  {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) End LineNo:-558
                  Date:-02/07 */}
                  <td className="tabledata">{item.noticePeriod}</td>
                  <td className="tabledata">{item.msgForTeamLeader}</td>
                  <td className="tabledata">{item.availabilityForInterview}</td>
                  <td className="tabledata">{item.interviewTime}</td>
                  {/* <td className="tabledata">{item.finalStatus}</td> */}

                  <td
                    className="tabledata"
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {item.finalStatus}
                    <div className="tooltip">
                      <span className="tooltiptext">{item.finalStatus}</span>
                    </div>
                  </td>
                  <td className="tabledata">
                  
                    <i
                      onClick={() => handleUpdate(item.candidateId)}
                      className="fa-regular fa-pen-to-square"
                    ></i>
                  </td>
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
                                            recruiterId: recruiters.employeeId,
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
                      className="shortlistedcan-share-forward-popup-btn"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => setShowForwardPopup(false)}
                      className="shortlistedcan-close-forward-popup-btn"
                    >
                      Close
                    </button>
                  </Modal.Footer>
                </Modal.Dialog>
              </div>
            </>
          ) : null}
          {/* Name:-Akash Pawar Component:-ShortListedCandidate
          Subcategory:-ResumeModel(added) End LineNo:-656 Date:-02/07 */}
          <Modal show={showResumeModal} onHide={closeResumeModal} size="md">
            <Modal.Header closeButton>
              <Modal.Title>Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedCandidateResume ? (
                <iframe
                  src={convertToDocumentLink(
                    selectedCandidateResume,
                    "Resume.pdf"
                  )}
                  width="100%"
                  height="550px"
                  title="PDF Viewer"
                ></iframe>
              ) : (
                <p>No resume available</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeResumeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Name:-Akash Pawar Component:-ShortListedCandidate
          Subcategory:-ResumeModel(added) End LineNo:-681 Date:-02/07 */}
        </div>
      ) : (
        <UpdateCallingTracker
          candidateId={selectedCandidateId}
          closeComponent={() => setShowUpdateCallingTracker(false)}
          updateSuccess={handleUpdateSuccess}
        />
      )}
      {isDataSending && (
        <div className="ShareFunc_Loading_Animation">
          <ClipLoader size={50} color="#ffb281" />
        </div>
      )}
    </div>
  );
};

export default ShortListedCandidates;
