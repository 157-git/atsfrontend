import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CandidateSection/shortlistedcandidate.css";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import InterviewDates from "../EmployeeSection/interviewDate";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { toast } from "react-toastify";
// SwapnilRokade_ShortListedCandidates_ModifyFilters_11/07

const ShortListedCandidates = ({
  loginEmployeeName,
  toggleShortListed, /*Akash_Pawar_ShortListedCandidate_toggleShortListed(show interview candidate)_23/07_LineNo_12*/
  onsuccessfulDataUpdation
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
  const [loading, setLoading] = useState(true);

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


  //prachi shortlisted Candidate->filter->10/9
  const limitedOptions = [
    ["alternateNumber", "Alternate Number"],
    ["availabilityForInterview", "Availability For Interview"],
    ["callingFeedback", "Calling Feedback"],
    ["candidateAddedTime", "Candidate Added Time"],
    ["candidateEmail", "Candidate Email"],
    ["candidateId", "Candidate Id"],
    ["candidateName", "Candidate Name"],
    ["communicationRating", "Communication Rating"],
    ["companyName", "Company Name"],
    ["contactNumber", "Contact Number"],
    ["currentCtcLakh", "Current CTC Lakh"],
    ["currentCtcThousand", "Current CTC Thousand"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["dateOfBirth", "Date Of Birth"],
    ["empId", "Employee Id"],
    ["expectedCtcLakh", "Expected CTC (Lakh)"],
    ["expectedCtcThousand", "Expected CTC (Thousand)"],
    ["experienceMonth", "Experience Month"],
    ["experienceYear", "Experience Year"],
    ["extraCertification", "Extra Certification"],
    ["feedBack", "Feed Back"],
    ["finalStatus", "Final Status"],
    ["fullAddress", "Full Address"],
    ["gender", "Gender"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["incentive", "Incentive"],
    ["interviewTime", "Interview Time"],
    ["jobDesignation", "Job Designation"],
    ["noticePeriod", "Notice Period"],
    ["offerLetterMsg", "Offer Letter Message"],
    ["oldEmployeeId", "Old Employee Id"],
    ["qualification", "Qualification"],
    ["recruiterName", "Recruiter Name"],
    ["relevantExperience", "Relevant Experience"],
    ["requirementCompany", "Applying Company"],
    ["requirementId", "Job ID"],
    ["selectYesOrNo", "Status"],
    ["sourceName", "Source Name"],
    ["yearOfPassing", "Year Of Passing"]
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
      setLoading(false);
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
      toast.success("Candidates forwarded successfully!");
      console.log("Candidates forwarded successfully!");
      fetchShortListedData();
      // onSuccessAdd(true);
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
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredShortListed[0] || {}).includes(key)
      )
      .map(([key]) => key);
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

  //  filter problem solved updated by sahil karnekar date 23-10-2024 complete  handleFilterOptionClick method
  const handleFilterOptionClick = (key) => {
    if (activeFilterOption === key) {
      
      setActiveFilterOption(null);
    } else {
      
      setActiveFilterOption(key);
    }
    
    
    setSelectedFilters((prev) => {
      const newSelectedFilters = { ...prev };
  
      if (key in newSelectedFilters) {
       
      } else {
       
        newSelectedFilters[key] = []; 
      }
  
      return newSelectedFilters;
    });
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

 // changed this function sahil karnekar date : 22-10-2024
 const filterData = () => {
  let filteredData = [...shortListedData];

  Object.entries(selectedFilters).forEach(([option, values]) => {
    if (values.length > 0) {
      filteredData = filteredData.filter((item) => {
        const itemValue = item[option]?.toString().toLowerCase(); // normalize the field value to lowercase
        return values.some((value) =>
          itemValue === value.toLowerCase() // exact match
        );
      });
    }
  });
  setFilteredShortListed(filteredData);
};

// updated this function sahil karnekar date : 22-10-2024
const handleFilterSelect = (key, value) => {
  setSelectedFilters((prev) => ({
    ...prev,
    [key]: prev[key].includes(value)
      ? prev[key].filter((item) => item !== value.toLowerCase())
      : [...prev[key], value.toLowerCase()], // store filter values in lowercase
  }));
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
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
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
              {/* line 565 to 571 added by sahil karnekar date 24-10-2024 */}
              <i
                style={{ fontSize: "22px" }}
                onClick={
                  toggleShortListed
                } /*Akash_Pawar_ShortlistedCandidate_toggleShortListed(show interview candidate)_23/07_LineNo_591*/
                className="fa-regular fa-calendar"
              ></i>
              <i
                className="fa-solid fa-magnifying-glass"
                onClick={() => {
                  setShowSearchBar(!showSearchBar);
                  setShowFilterSection(false);
                }}
                style={{ margin: "10px", width: "auto", fontSize: "15px" }}
              ></i>
              {/* line 581 to 590 updated by sahil karnekar date 24-10-2024 */}
               {showSearchBar && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search here..."
                  value={searchTerm}
                  
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              )}
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
                          className="lineUp-share-btn"
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
            <div>
                        

               {/* updated this filter section by sahil karnekar date 22-10-2024 */}
               {showFilterSection && (
  <div className="filter-section">
    {limitedOptions.map(([optionKey, optionLabel]) => {
      const uniqueValues = Array.from(
        new Set(
          shortListedData
            .map((item) => item[optionKey]?.toString().toLowerCase())
            .filter((value) => value && value !== '-' && !(optionKey === 'alternateNumber' && value === '0'))
        )
      );

      return (
        <div key={optionKey} className="filter-option">
          <button
            className="white-Btn"
            onClick={() => handleFilterOptionClick(optionKey)}
          >
            {optionLabel}
            <span className="filter-icon">&#x25bc;</span>
          </button>

          {activeFilterOption === optionKey && (
            <div className="city-filter">
              <div className="optionDiv">
                {uniqueValues.length > 0 ? (
                  uniqueValues.map((value) => (
                    <label key={value} className="selfcalling-filter-value">
                      <input
                        type="checkbox"
                        checked={selectedFilters[optionKey]?.includes(value) || false}
                        onChange={() => handleFilterSelect(optionKey, value)}
                        style={{ marginRight: '5px' }}
                      />
                      {value}
                    </label>
                  ))
                ) : (
                  <div>No values</div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
)}
              <div className="attendanceTableData">
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
                      <th className="attendanceheading">Sr  No.</th>

                      <th className="attendanceheading">Candidate Id</th>
                      <th className="attendanceheading">Added Date Time</th>
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
                      <th className="attendanceheading">Date Of Birth  - {" "}</th>
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

                      {userType === 'TeamLeader' &&
                        <th className="attendanceheading">
                          Message For Manager
                        </th>}
                      {userType === 'Recruiters' &&
                        <th className="attendanceheading">
                          Message For Team Leader
                        </th>}

                      <th className="attendanceheading">Interview Date</th>
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
                          {item.date} -  {" "}  {item.candidateAddedTime}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.date}  - {" "}  {item.candidateAddedTime}</span>
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
                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.callingFeedback}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.callingFeedback}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.incentive}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.incentive}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.selectYesOrNo}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.selectYesOrNo}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.companyName}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.companyName}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          >
                          {item.experienceYear} {" "} Year {item.experienceMonth}  {" "}  Month
                          <div className="tooltip">
                            <span className="tooltiptext">{item.experienceYear}  Year  {" "} {item.experienceMonth}{" "} Month </span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.relevantExperience}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.companyName}</span>
                          </div>
                        </td>


                        <td className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}>

                            {item.currentCTCLakh} {" "} Lakh {item.currentCTCThousand}   {" "} Thousand
                            <div className="tooltip">
                              <span className="tooltiptext">{item.currentCTCLakh} {" "} Lakh {item.currentCTCThousand}   {" "} Thousand</span>
                            </div>
                          </td>

                          <td className="tabledata" onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}>
                            {item.expectedCTCLakh}  {" "} Lakh {item.expectedCTCThousand} {" "} Thousand
                            <div className="tooltip">
                              <span className="tooltiptext">{item.expectedCTCLakh}  {" "} Lakh {item.expectedCTCThousand}  {" "} Thousand</span>
                            </div>
                          </td>


                        <td className="tabledata" onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.dateOfBirth}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.dateOfBirth}</span>
                          </div>
                        </td>

                        <td className="tabledata" onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.gender}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.gender}</span>
                          </div>
                        </td>

                        <td className="tabledata" onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.qualification}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.qualification}</span>
                          </div>
                        </td>

                        <td className="tabledata" onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.yearOfPassing}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.yearOfPassing}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.extraCertification}
                          <div className="tooltip">
                            <span className="tooltiptext"> {item.extraCertification}</span>
                          </div>
                        </td>
                        {/* <td className="tabledata">{item.feedback}</td> */}
                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>{item.holdingAnyOffer}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.holdingAnyOffer}</span>
                          </div>
                        </td>


                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.offerLetterMsg}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.offerLetterMsg}</span>
                          </div>
                        </td>
                        {/* <td className="tabledata">{item.lineUp.resume}</td> */}
                        {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) start LineNo:-546
                  Date:-02/07 */}
                        <td className="tabledata">
                          <button
                            onClick={() => openResumeModal(item.resume)}
                            style={{ background: "none", border: "none" }}
                          >
                            <i
                              className="fas fa-eye"
                              style={{
                                color: item.resume ? "green" : "inherit",
                              }}
                            ></i>
                          </button>
                        </td>
                        {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) End LineNo:-558
                  Date:-02/07 */}
                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.noticePeriod}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.noticePeriod}</span>
                          </div>
                        </td>


                        {userType === 'TeamLeader' &&


                          <td className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}>
                            {item.msgForTeamLeader}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.msgForTeamLeader}</span>
                            </div>
                          </td>

                        }

                        {userType === 'Recruiters' &&

                          <td className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}>
                            {item.msgForTeamLeader}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.msgForTeamLeader}</span>
                            </div>
                          </td>

                        }



                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.availabilityForInterview}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.availabilityForInterview}</span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          {item.interviewTime}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.interviewTime}</span>
                          </div>
                        </td>
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
                        <td className="tabledata" >
                          <button className="table-icon-div" >
                            <i
                              onClick={() => handleUpdate(item.candidateId)}
                              className="fa-regular fa-pen-to-square"
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                                 <strong>TL - {loginEmployeeName} </strong>
                                </label>
                              </div>
                              <div className="accordion-content">
                                <form>
                                  {recruiterUnderTeamLeader &&
                                    recruiterUnderTeamLeader.map((recruiters) => (
                                      <div
                                        key={recruiters.recruiterId}
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
                                          />{" "} - {" "}
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
              employeeId={employeeId}
              onsuccessfulDataUpdation={onsuccessfulDataUpdation}
              onCancel={() => setShowUpdateCallingTracker(false)}
              loginEmployeeName={loginEmployeeName}
              onSuccess={handleUpdateSuccess}
              // updateSuccess={handleUpdateSuccess}
              // onCancel={() => setShowUpdateCallingTracker(false)}

            />
          )}
        </>
      )}

      {isDataSending && (
        <div className="ShareFunc_Loading_Animation">
          <Loader />
        </div>
      )}

    </div>
  );
};

export default ShortListedCandidates;
