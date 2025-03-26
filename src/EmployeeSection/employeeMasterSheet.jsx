import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchEmployeeMasterSheet, fetchFile } from "../api/api";
import "./EmployeeMasterSheet.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import { Alert, Modal as AntdModal } from "antd";
import Loader from "../EmployeeSection/loader";
import { Pagination } from "antd";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";

const EmployeeMasterSheet = ({ loginEmployeeName }) => {
  const [data, setData] = useState([]);
  // sahil karnekar line 14 to 111
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [uniqueValues, setUniqueValues] = useState({});
  const [searchCount, setSearchCount] = useState(0);
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
    relevantExperience: [],
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
    relevantExperience: 41,
  };

  const displayNameMap = {
    candidateId: "Candidate Id",
    // line number 111 edited by sahil karnekar according to tester suggestion date 14-10-2024
    alternateNumber: "WhatsApp Number",
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
    extraCertification: "Working Status",
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
    relevantExperience: "Relevant Experience",
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
  const [errorForShare, setErrorForShare] = useState("");
  // this states created by sahil karnekar  line 172 and 173 date 30-10-2024
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayShareConfirm, setDisplayShareConfirm] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const filterRef = useRef(null);


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

  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_46

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [employeeId, currentPage, pageSize, triggerFetch]);

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
  const fetchData = async (page, size) => {
    try {
      const response = await fetch(
        // sahil karnekar line 244 set employeeId and usertType in Api at the time of deployement this url is just for testing
        `${API_BASE_URL}/master-sheet/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
      );
      const data = await response.json();
      setData(data.content);
      // sahil karnekar line 249
      extractUniqueValues(data.content);
      setTotalRecords(data.totalElements);
      setSearchCount(Object.keys(data.content).length);
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

  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedRows([]);
  //   } else {
  //     const allRowIds = data.map((item) => item[0]); // Assuming candidateId is the first element
  //     setSelectedRows(allRowIds);
  //   }
  //   setAllSelected(!allSelected);
  // };

    const handleSelectAll = () => {
      if (allSelected) {
        setSelectedRows((prevSelectedRows) => 
          prevSelectedRows.filter((id) => !data.map((item) => item[0]).includes(id))
        );
      } else {
        const allRowIds = data.map((item) => item[0]);
        setSelectedRows((prevSelectedRows) => [...new Set([...prevSelectedRows, ...allRowIds])]);
      }
      setAllSelected(!allSelected);
    };
  
      const areAllRowsSelectedOnPage = data.every((item) =>
          selectedRows.includes(item[0])
        );
      
        useEffect(() => {
          setAllSelected(areAllRowsSelectedOnPage);
        }, [data, selectedRows]);  

  const handleSelectRow = (candidateId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(candidateId)) {
        return prevSelectedRows.filter((id) => id !== candidateId);
      } else {
        return [...prevSelectedRows, candidateId];
      }
    });
  };
  const handleDisplayShareConfirmClick = () => {
    setDisplayShareConfirm(true);
  }
  const handleCancelcloseshare = () => {
    setDisplayShareConfirm(false);
  }
  const forwardSelectedCandidate = (e) => {
    e.preventDefault();
    if (selectedRows.length >= 1) {
      if (userType === "TeamLeader") {
        setShowForwardPopup(true);
      } else if (userType === "SuperUser") {
        setShowForwardPopup(true);
      } else if (userType === "Manager") {
        setShowForwardPopup(true);
      } else {
        toast.error("Invalid user type. Cannot proceed.");
      }
    } else {
      toast.error("Please select at least one Candidate to proceed.");
    }
  };

  const handleSearchClick = () => {
    fetchData(currentPage, pageSize);
  }

  const handleShare = async () => {
    if (userType === "TeamLeader") {
      if (selectedRecruiters.recruiterId === "") {
        setErrorForShare("Please Select A Recruiter ! ");
        return;
      } else {
        setErrorForShare("");
      }
    }
    setIsDataSending(true);
    let url = `${API_BASE_URL}/share-candidate-data/${employeeId}/${userType}`;
    let requestData;
    if (
      userType === "TeamLeader" &&
      selectedRecruiters.recruiterId != "" &&
      selectedRows.length > 0
    ) {
      requestData = {
        employeeId: parseInt(selectedRecruiters.recruiterId),
        candidateIds: selectedRows,
        jobRole: "Recruiters"
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
      toast.success("Candidates forwarded successfully!");
      fetchData(currentPage, pageSize);
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
      setShowForwardPopup(false);
      toast.error("Error while forwarding candidates:", error); //Swapnil Error&success message
      // Handle error scenarios or show error messages to the user
    } finally {
      setDisplayShareConfirm(false);
    }
  };
  //akash_pawar_EmployeeMasterSheet_ShareFunctionality_18/07_243
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
  };
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

  // sahil karnekar  line 451 to 471
  {
    /* this extractUniqueValues method updated by sahil date 22-10-2024 */
  }
  const extractUniqueValues = (data) => {
    const uniqueValuesMap = {};

    Object.keys(fieldIndexMap).forEach((field) => {
      const values = data.map((item) => item[fieldIndexMap[field]]);

      // Create a map to store unique lowercase values, but keep the original case for display
      const uniqueValues = new Map();

      values.forEach((value) => {
        const lowerCaseValue = String(value).toLowerCase();

        // Add only the first occurrence of each unique lowercase value
        if (!uniqueValues.has(lowerCaseValue)) {
          uniqueValues.set(lowerCaseValue, value); // Store original case for display
        }
      });

      // Convert the map values back to an array and store in the uniqueValuesMap
      uniqueValuesMap[field] = Array.from(uniqueValues.values());
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


  const clearAllFilters = () => {
    setSelectedFilters({
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
      relevantExperience: [],
    });
    applyFilters(); // Reapply filters to reset the list
  };
  // sahil karnekar added line 478 to 489 date 11-10-2024
  const toggleFilter = (field) => {
    setExpandedFilters((prev) => {
      const newExpanded = {};
      newExpanded[field] = !prev[field];
      Object.keys(prev).forEach((key) => {
        if (key !== field) {
          newExpanded[key] = false;
        }
      });
      return newExpanded;
    });
  };

   useEffect(() => {
     const handleClickOutside = (event) => {
       if (
         filterRef.current &&
         !filterRef.current.contains(event.target) &&
         !event.target.closest(".filter-option button") // Prevent closing when clicking inside the button
       ) {
         setExpandedFilters({});
       }
     };
   
     document.addEventListener("mousedown", handleClickOutside);
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, []);

  // this applyFilters method updated by sahil karnekar date 22-10-2024
  const applyFilters = (data) => {
    let filtered = data;
    // line 525 to 535 added by sahil karnekar date 30-10-2024
    // if (searchTerm.trim()) {
    //   const lowerCaseSearchTerm = searchTerm.toLowerCase();

    //   filtered = filtered.filter((item) => {
    //     return Object.keys(fieldIndexMap).some((field) => {
    //       const fieldIndex = fieldIndexMap[field];
    //       return String(item[fieldIndex])
    //         .toLowerCase()
    //         .includes(lowerCaseSearchTerm);
    //     });
    //   });
    // }

    Object.keys(selectedFilters).forEach((field) => {
      const fieldValues = selectedFilters[field];
      if (fieldValues.length > 0) {
        const fieldIndex = fieldIndexMap[field];

        filtered = filtered.filter((item) => {
          const dataValueLowerCase = String(item[fieldIndex]).toLowerCase();
          const selectedValuesLowerCase = fieldValues.map((v) =>
            String(v).toLowerCase()
          );
          return selectedValuesLowerCase.includes(dataValueLowerCase);
        });
      }
    });

    return filtered;
  };

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
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

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
  };

  // added by sahil karnekar date 4-12-2024
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setPageSize(size); // Update the page size
    setCurrentPage(1); // Reset to the first page after page size changes
  };

  const calculateRowIndex = (index) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  useEffect(() => {
    if (applyFilters) {
      setSearchCount(applyFilters(data).length);
    }
  }, [applyFilters]);

  return (
    <>
      <div className="calling-list-container">
        {loading ? (
          <div className="register">
            <Loader></Loader>
          </div>
        ) : (
          <>
            <div className="search newaddforalignheaderofemployeermastersheet">
              {/* line 590 to 610 added by sahil karnekar date 30-10-2024 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                ></i>
                {/* line 727 to 736 added by sahil karnekar date 24-10-2024 */}

                <div
                  className="search-input-div"
                  style={{ width: `${calculateWidth()}px` }}
                >
                  <div className="forxmarkdiv">
                    <input
                      type="text"
                      className="search-input removeBorderForSearchInput"
                      placeholder="Search here..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <div className="svgimagesetinInput">
                        <svg
                          onClick={() => {
                            setSearchTerm("")
                            handleTriggerFetch();
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                        >
                          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="search-btns lineUp-share-btn"
                  onClick={() => handleSearchClick()}
                >
                  Search
                </button>
              </div>

              <div className="master-sheet-header">
                <h3 style={{ color: "gray", fontSize: "18px" }}>
                  Employee Master Sheet
                </h3>
              </div>

              <div className="master-sheet-share-btn">
                {/* sahil karnekar line 526 to 536 */}
                {userType !== "Recruiters" && (
                  <div>
                    {showShareButton ? (
                      <button
                        className="lineUp-Filter-btn"
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
                {/* sahil karnekar line 531 to 536 */}
                <button
                  className="lineUp-Filter-btn"
                  onClick={toggleFilterSection}
                >
                  Filter <i className="fa-solid fa-filter"></i>
                </button>
              </div>
            </div>

            {/* sahil karnekar line 593 to 573 */}
            <div className="filter-dropdowns">
              {showFilterSection && (
                <div className="filter-section">
                  {Object.keys(uniqueValues).map((field) => (
                    <div className="filter-option" key={field}>
                      <button
                        className="white-Btn"
                        onClick={() => toggleFilter(field)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedFilters[field]?.length > 0 ? "gray" : "transparent",
                        }}
                      >
                        {displayNameMap[field] || field}
                        <span className="filter-icon">&#x25bc;</span>
                        {selectedFilters[field]?.length > 0 ? ` ${selectedFilters[field].length}` : ""}
                      </button>

                      {expandedFilters[field] && (
                        <div className="city-filter" ref={filterRef}>
                          {/* sahil karnekar filter edition line 552 to 567 date : 10-10-2024 */}
                          {/* this complete optiondiv is updated by sahil karnekar date 22-10-2024 */}
                          <div className="optionDiv">
                            {uniqueValues[field] &&
                              uniqueValues[field].map((value, index) => {
                                // Check if the field is "alternateNumber" and value is 0, or if value is falsy (null, undefined)
                                if (
                                  (field === "alternateNumber" && value === 0) ||
                                  value === null ||
                                  value === undefined ||
                                  value === ""
                                ) {
                                  return null; // Skip rendering for this value
                                }

                                return (
                                  <label
                                    className="selfcalling-filter-value"
                                    key={index}
                                  >
                                    <input
                                      name="testName"
                                      style={{ marginRight: "5px" }}
                                      type="checkbox"
                                      checked={selectedFilters[field].includes(
                                        value
                                      )}
                                      onChange={() =>
                                        handleFilterChange(field, value)
                                      }
                                    />
                                    {value}
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
      className="lineUp-Filter-btn" 
      onClick={clearAllFilters} 
  
    >
      Clear Filters
    </button>
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
                        {/* <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedRows.length === data.length}
                          name="selectAll"
                        /> */}
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              data.every((row) => selectedRows.includes(row[0]))
                            }
                            name="selectAll"
                          />

                      </th>
                    ) : null}
                    <th className="attendanceheading">Sr No.</th>

                    <th className="attendanceheading">Candidate ID</th>
                    <th className="attendanceheading">Candidate Name</th>
                    <th className="attendanceheading">Candidate Email</th>
                    <th className="attendanceheading">Contact Number</th>
                    <th className="attendanceheading">Alternate Number</th>
                    <th className="attendanceheading">Calling Feedback</th>
                    <th className="attendanceheading">Communication Rating</th>
                    <th className="attendanceheading">Current Location</th>
                    <th className="attendanceheading">Added Date & time </th>
                    <th className="attendanceheading">Job Designation</th>
                    {(userType === "TeamLeader" || userType === "Manager") && (
                      <th className="attendanceheading">Team Leader Id</th>
                    )}
                    <th className="attendanceheading">Emp ID</th>
                    <th className="attendanceheading">Recruiter Name</th>
                    <th className="attendanceheading">Applying Company</th>
                    <th className="attendanceheading">Job Id</th>
                    <th className="attendanceheading">Interested Or Not</th>
                    <th className="attendanceheading">Source Name</th>
                    <th className="attendanceheading">Line Up ID</th>

                    <th className="attendanceheading">Full Address</th>
                    <th className="attendanceheading">Incentive</th>
                    <th className="attendanceheading">Old Employee Id</th>
                    <th className="attendanceheading">
                      Availability for Interview
                    </th>
                    <th className="attendanceheading">Company Name</th>
                    <th className="attendanceheading">Date of Birth</th>
                    <th className="attendanceheading">Working Status</th>
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
                      <td
                        className="tabledata "
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {calculateRowIndex(index)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {calculateRowIndex(index)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[0], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[0], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[4], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[4], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[3], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[3], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[6], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[6], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[1], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[1], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[2], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[2], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[5], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[5], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[7], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[7], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[8], searchTerm)}{" "}
                        {highlightText(entry[17], searchTerm)}
                        {/* {entry[8]} {""} {entry[17]} */}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[8], searchTerm)}{" "}
                            {highlightText(entry[17], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[9], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[9], searchTerm)}
                          </span>
                        </div>
                      </td>
                      {(userType === "TeamLeader" || userType === "Manager") && (
                        <td className="tabledata">{entry[73]}</td>
                      )}

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {entry[15]}
                        <div className="tooltip">
                          <span className="tooltiptext">{entry[15]}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[10], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[10], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}

                      >
                        {highlightText(entry[11], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[11], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[12], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[12], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[13], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[13], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[14], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[14], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[16], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[16], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[18], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[18], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[19], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[19], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[20], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[20], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[21], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[21], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[22], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[22], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[23], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[23], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[24], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[24], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[25], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[25], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[26], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[26], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[27], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[27], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[28], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[28], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[29], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[29], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[30], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[30], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[31], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[31], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[32], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[32], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[33], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[33], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[34], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[34], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[35], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[35], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[36], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[36], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[37], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[37], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[38], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[38], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[39], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[39], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[40], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[40], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[41], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[41], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[42], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[42], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[43], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[43], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[44], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[44], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[45], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[45], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[46], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[46], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[47], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[47], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[48], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[48], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[49], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[49], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[50], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[50], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[51], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[51], searchTerm)}
                          </span>
                        </div>
                      </td>
                      {/* Name:-Akash Pawar Component:-EmployeeMasterSheet
                 Subcategory:-ResumeViewButton(added) start LineNo:-340
                 Date:-02/07 */}
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[52] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[53] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[54] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[55] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[56] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[57] ? "#80ff80" : "transparent",
                        }}
                      >
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
                      <td
                        className="tabledata"
                        style={{
                          backgroundColor: entry[58] ? "#80ff80" : "transparent",
                        }}
                      >
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

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[59], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[59], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[60], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[60], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[61], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[61], searchTerm)}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[62], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[62], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[63], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[63], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[64], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[64], searchTerm)}
                          </span>
                        </div>
                      </td>
                      {/* <td className="tabledata">
                 <button className="View-Interview-History">View</button>
               </td> */}
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[65], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[65], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[66], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[66], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[67], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[67], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[68], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[68], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[69], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[69], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[70], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[70], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[71], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[71], searchTerm)}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {highlightText(entry[72], searchTerm)}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {highlightText(entry[72], searchTerm)}
                          </span>
                        </div>
                      </td>

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
                  <AntdModal
                    className="newclassforantdAlignFront"
                    title="Share Data" open={displayShareConfirm} onOk={handleShare} onCancel={handleCancelcloseshare}>
                    <Alert message="Are You Sure ? You Want To Send ?" type="info" showIcon />
                  </AntdModal>
                  <div
                    className="bg-black bg-opacity-50 modal show newclassforsendback"
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
                              <div className="accordion-content newHegightSetForAlignment">
                                <form>
                                  {recruiterUnderTeamLeader &&
                                    recruiterUnderTeamLeader.map((recruiters) => (
                                      <div
                                        key={recruiters.recruiterId}
                                        className="form-group"
                                      >
                                        <label htmlFor={recruiters.employeeId}>
                                          <input
                                            style={{ width: "auto" }}
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
                      {errorForShare && (
                        <div style={{ textAlign: "center", color: "red" }}>
                          {errorForShare}
                        </div>
                      )}

                      <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>

                        <button
                          onClick={handleDisplayShareConfirmClick}
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

            <div className="search-count-last-div">
              Total Results : {totalRecords}
            </div>

            <Pagination
              current={currentPage}
              total={totalRecords}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={handleSizeChange}
              onChange={handlePageChange}
              style={{
                justifyContent: "center",
              }}
            />
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
    </>
  );
};

export default EmployeeMasterSheet;