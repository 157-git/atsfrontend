import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../EmployeeSection/LineUpList.css";
import UpdateCallingTracker from "./UpdateSelfCalling";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import HashLoader from "react-spinners/HashLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "./loader";

// SwapnilRokade_lineUpList_ModifyFilters_47to534_11/07
const LineUpList = ({
  updateState,
  funForGettingCandidateId,
  loginEmployeeName,
}) => {
  const [callingList, setCallingList] = useState([]);
  const { employeeId } = useParams();
  const employeeIdnew = parseInt(employeeId);

  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [shortListedData, setShortListedData] = useState([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_LineUpList_ShareFunctionality_16/07_36
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_LineUpList_ShareFunctionality_16/07_37
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_34
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [count, setCount] = useState(0);
  const navigator = useNavigate();
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const [isDataSending, setIsDataSending] = useState(false);
  const [errorForShare, setErrorForShare] = useState("");

  //akash_pawar_LineUpList_ShareFunctionality_17/07_48
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
  //akash_pawar_LineUpList_ShareFunctionality_17/07_71

  const limitedOptions = [
    // line number 79 edited by sahil karnekar according to tester suggestion date 14-10-2024
    ["alternateNumber", "WhatsApp Number"],
    ["availabilityForInterview", "Availability For Interview"],
    ["callingFeedback", "Calling Feedback"],
    ["candidateAddedTime", "Candidate Added Time"],
    ["candidateEmail", "Candidate Email"],
    ["candidateId", "Candidate Id"],
    ["candidateName", "Candidate Name"],
    ["communicationRating", "Communication Rating"],
    ["companyName", "Company Name"],
    ["contactNumber", "Contact Number"],
    ["currentCTCLakh", "Current CTC (Lakh)"],
    ["currentCTCThousand", "Current CTC (Thousand)"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["dateOfBirth", "Date of Birth"],
    ["empId", "Employee ID"],
    ["expectedCTCLakh", "Expected CTC (Lakh)"],
    ["expectedCTCThousand", "Expected CTC (Thousand)"],
    ["experienceMonth", "Experience (Month)"],
    ["experienceYear", "Experience (Year)"],
    ["extraCertification", "Extra Certification"],
    ["feedBack", "Feedback"],
    ["finalStatus", "Final Status"],
    ["fullAddress", "Full Address"],
    ["gender", "Gender"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["incentive", "Incentive"],
    ["interviewTime", "Interview Time"],
    ["jobDesignation", "Job Designation"],
    ["msgForTeamLeader", "Message for Team Leader"],
    ["noticePeriod", "Notice Period"],
    ["offerLetterMsg", "Offer Letter Message"],
    ["oldEmployeeId", "Old Employee Id"],
    ["qualification", "Qualification"],
    ["recruiterName", "Recruiter Name"],
    ["relevantExperience", "Relevant Experience"],
    ["requirementCompany", "Applied Company"],
    ["requirementId", "Job Id"],
    ["selectYesOrNo", "Status"],
    ["sourceName", "Source Name"],
    ["yearOfPassing", "Year of Passing"],
  ];

  const { userType } = useParams();

  //akash_pawar_LineUpList_ShareFunctionality_16/07_128
  const fetchCallingTrackerData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calling-lineup/${employeeIdnew}/${userType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Full response object:", response); // Log full response

      const data = await response.json();
      console.log("Response data:", data); // Log the parsed JSON data

      setCallingList(data);
      setFilteredCallingList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallingTrackerData();
  }, [employeeIdnew]);
  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_171

  //akash_pawar_LineUpList_ShareFunctionality_17/07_144
  const fetchManager = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-all-managers`);
      const data = await response.json();
      setFetchAllManager(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };
  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_183

  //akash_pawar_LineUpList_ShareFunctionality_17/07_156

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
  //akash_pawar_LineUpList_ShareFunctionality_16/07_202

  //prachi Parab lineup filterFunctionality_11-09

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredCallingList[0] || {}).includes(key)
      )
      .map(([key]) => key);
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  const handleUpdate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setShowUpdateCallingTracker(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetch(`${API_BASE_URL}/calling-lineup/${employeeIdnew}/${userType}`)
      .then((response) => response.json())
      .then((data) => setCallingList(data))

      .catch((error) => console.error("Error fetching data:", error));
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

  useEffect(() => {
    const filtered = callingList.filter((item) => {
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
        (item.alternateNumber &&
          item.alternateNumber.toString().includes(searchTermLower)) ||
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
          item.selectYesOrNo.toLowerCase().includes(searchTermLower))
      );
    });
    setFilteredCallingList(filtered);
  }, [searchTerm, callingList]);

  useEffect(() => {
    if (sortCriteria) {
      const sortedList = [...filteredCallingList].sort((a, b) => {
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
      setFilteredCallingList(sortedList);
    }
  }, [sortCriteria, sortOrder]);
  // updated by sahil karnekar date 22-10-2024
  const filterData = () => {
    let filteredData = [...callingList];

    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        filteredData = filteredData.filter((item) => {
          const itemValue = item[option]?.toString().toLowerCase(); // normalize the field value to lowercase
          return values.some(
            (value) => itemValue === value.toLowerCase() // exact match
          );
        });
      }
    });
    setFilteredCallingList(filteredData);
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

  //  filter problem solved updated by sahil karnekar date 21-10-2024 complete  handleFilterOptionClick method
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

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
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
      const allRowIds = filteredCallingList.map((item) => item.candidateId);
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

  //akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_460
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
  //akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_472

  //akash_pawar_LineUpList_ShareFunctionality_17/07_475
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
    let url = `${API_BASE_URL}/updateIds/${userType}`;
    let requestData;
    if (
      userType === "TeamLeader" &&
      selectedRecruiters.recruiterId !== "" &&
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
      toast.success("Candidates forwarded successfully!"); //Swapnil Error&success message
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
      console.error("Error while forwarding candidates:", error);

      setIsDataSending(false);
      setShowForwardPopup(false); //Swapnil Error&success message
      toast.error("Error while forwarding candidates:"); //Swapnil Error&success message
      // Handle error scenarios or show error messages to the user
    }
  };
  //akash_pawar_LineUpList_ShareFunctionality_17/07_546

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
  const onClose = () => {};
  //Name:-Akash Pawar Component:-ShortListedCandidate Subcategory:-ResumeViewButton(added) End LineNo:-196 Date:-02/07

  //Mohini_Raut_LineUpList_columnsToInclude_columnsToExclude_16/07/2024//
  const handleExportToExcel = () => {
    // Define columns to include in export
    const columnsToInclude = [
      "No.",
      "Date",
      "Time",
      "Candidate Id",
      "Recruiter Name",
      "Candidate's Name",
      "Candidate's Email",
      "Contact Number",
      "Whatsapp Number",
      "Source Name",
      "Job Designation",
      "Job Id",
      "Applying Company",
      "Communication Rating",
      "Current Location",
      "Full Address",
      "Calling Feedback",
      "Recruiter Incentive",
      "Interested or Not",
      "Current Company",
      "Total Experience",
      "Relevant Experience",
      "Current CTC",
      "Expected CTC",
      "Date Of Birth",
      "Gender",
      "Education",
      "Year Of Passing",
      "Any Extra Certification",
      "Holding Any Offer",
      "Offer Letter Msg",
      "Notice Period",
      "Message For Team Leader",
      "Availability For Interview",
      "Interview Time",
      "Interview Status",
    ];

    // Filter out columns to exclude from export
    const columnsToExclude = ["Resume", "Action"];

    // Clone the data and map to match columnsToInclude order
    const dataToExport = filteredCallingList.map((item, index) => {
      // Create a filtered item without the 'Resume' field
      const filteredItem = {
        "No.": index + 1,
        Date: item.date || "-",
        Time: item.candidateAddedTime || "-",
        "Candidate Id": item.candidateId || "-",
        "Recruiter Name": item.recruiterName || "-",
        "Candidate's Name": item.candidateName || "-",
        "Candidate's Email": item.candidateEmail || "-",
        "Contact Number": item.contactNumber || "-",
        "Whatsapp Number": item.alternateNumber || 0,
        "Source Name": item.sourceName || "-",
        "Job Designation": item.jobDesignation || "-",
        "Job Id": item.requirementId || "-",
        "Applying Company": item.requirementCompany || "-",
        "Communication Rating": item.communicationRating || "-",
        "Current Location": item.currentLocation || "-",
        "Full Address": item.fullAddress || "-",
        "Calling Feedback": item.callingFeedback || "-",
        "Recruiter Incentive": item.incentive || "-",
        "Interested or Not": item.selectYesOrNo || "-",
        "Current Company": item.companyName || "-",
        "Total Experience": `${item.experienceYear || 0} Years ${
          item.experienceMonth || 0
        } Months`,
        "Relevant Experience": item.relevantExperience || "-",
        "Current CTC": `${item.currentCtcLakh || 0} Lakh ${
          item.currentCtcThousand || 0
        } Thousand`,
        "Expected CTC": `${item.expectedCtcLakh || 0} Lakh ${
          item.expectedCtcThousand || 0
        } Thousand`,
        "Date Of Birth": item.dateOfBirth || "-",
        Gender: item.gender || "-",
        Education: item.qualification || "-",
        "Year Of Passing": item.yearOfPassing || "-",
        "Any Extra Certification": item.extraCertification || "-",
        "Holding Any Offer": item.holdingAnyOffer || "-",
        "Offer Letter Msg": item.offerLetterMsg || "-",
        "Notice Period": item.noticePeriod || "-",
        "Message For Team Leader": item.msgForTeamLeader || "-",
        "Availability For Interview": item.availabilityForInterview || "-",
        "Interview Time": item.interviewTime || "-",
        "Interview Status": item.finalStatus || "-",
      };

      return filteredItem;
    });

    // Define sheet name and create worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: columnsToInclude,
    });

    // Add conditional formatting for header row
    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRange.s.r, c: C })];
      if (cell) {
        cell.s = {
          font: {
            bold: true,
            color: { rgb: "000000" },
            sz: 20,
          },
          fill: {
            patternType: "solid",
            fgColor: { rgb: "FF0000" }, // Red background
          },
        };
      }
    }

    // Save the Excel file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LineUp List");
    XLSX.writeFile(wb, "LineUp_list.xlsx");
  };
  const showPopup = () => {
    setShowExportConfirmation(true);
    document.querySelector(".calling-list-container").classList.add("blurred");
  };

  const hidePopup = () => {
    setShowExportConfirmation(false);
    document
      .querySelector(".calling-list-container")
      .classList.remove("blurred");
  };

  const confirmExport = () => {
    setShowExportConfirmation(false);
    handleExportToExcel();
    hidePopup();
  };

  const cancelExport = () => {
    hidePopup();
  };
  //Mohini_Raut_LineUpList_columnsToInclude_columnsToExclude_16/07/2024//

  return (
    <div className="calling-list-container">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!showUpdateCallingTracker ? (
            <>
              <div className="search">
                {/* this line is added by sahil karnekar date 24-10-2024 */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                   
                    style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                  ></i>
                  {/* line 727 to 736 added by sahil karnekar date 24-10-2024 */}

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>
                <h5 style={{ color: "gray" }}>Lineup Tracker</h5>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <div>
                    {(userType === "Manager" || userType === "TeamLeader") && (
                      <button className="lineUp-share-btn" onClick={showPopup}>
                        Create Excel
                      </button>
                    )}

                    {showExportConfirmation && (
                      <div className="popup-containers">
                        <p className="confirmation-texts">
                          Are you sure you want to generate the Excel file?
                        </p>
                        <button
                          onClick={confirmExport}
                          className="buttoncss-ctn"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelExport}
                          className="buttoncss-ctn"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>

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
                            className="lineUp-share-close-btn"
                            onClick={() => {
                              setShowShareButton(true);
                              setSelectedRows([]);
                              setAllSelected(false);
                            }}
                          >
                            Close
                          </button>
                          {/* akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_793 */}
                          {userType === "TeamLeader" && (
                            <button
                              className="lineUp-share-btn"
                              onClick={handleSelectAll}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          )}
                          {/* akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_801 */}
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
                    className="lineUp-Filter-btn"
                    onClick={toggleFilterSection}
                  >
                    Filter <i className="fa-solid fa-filter"></i>
                  </button>
                </div>
              </div>

              <div className="filter-dropdowns">
                {/* updated this filter section by sahil karnekar date 22-10-2024 */}
                {showFilterSection && (
                  <div className="filter-section">
                    {limitedOptions.map(([optionKey, optionLabel]) => {
                      const uniqueValues = Array.from(
                        new Set(
                          callingList
                            .map((item) =>
                              // console.log(item, item[optionKey]),
                              item[optionKey]?.toString().toLowerCase()
                              
                            )
                            .filter(
                              (value) =>
                                value &&
                                value !== "-" &&
                                !(
                                  optionKey === "alternateNumber" &&
                                  value === "0"
                                )
                            )
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
                                  console.log(uniqueValues),
                                  uniqueValues.map((value) => (
                                    <label
                                      key={value}
                                      className="selfcalling-filter-value"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedFilters[optionKey]?.includes(
                                            value
                                          ) || false
                                        }
                                        onChange={() =>
                                          handleFilterSelect(optionKey, value)
                                        }
                                        style={{ marginRight: "5px" }}
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
              </div>

              <div className="attendanceTableData">
                <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      {!showShareButton && userType === "TeamLeader" ? (
                        <th className="attendanceheading">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedRows.length === filteredCallingList.length
                            }
                            name="selectAll"
                          />
                        </th>
                      ) : null}

                      <th className="attendanceheading">Sr No.</th>
                      <th className="attendanceheading">Candidate Id</th>

                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("date")}
                      >
                        Added Date Time
                      </th>
                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("recruiterName")}
                      >
                        Recruiter's Name
                      </th>
                      <th className="attendanceheading">Candidate's Name</th>
                      <th className="attendanceheading">Candidate's Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Whatsapp Number</th>
                      <th className="attendanceheading">Source Name</th>
                      <th className="attendanceheading">Job Designation</th>
                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("requirementId")}
                      >
                        Job Id
                      </th>
                      <th className="attendanceheading">Applying Company</th>
                      <th className="attendanceheading">
                        Communication Rating
                      </th>
                      <th className="attendanceheading">Current Location</th>
                      <th className="attendanceheading">Full Address</th>

                      <th className="attendanceheading">Calling Remark</th>
                      <th className="attendanceheading">Call Summary</th>
                      <th className="attendanceheading">
                        Recruiter's Incentive
                      </th>
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
                      <th className="attendanceheading">
                        Any Extra Certification
                      </th>
                      {/* <th className="attendanceheading">Feedback</th> */}
                      <th className="attendanceheading">Holding Any Offer</th>
                      <th className="attendanceheading">Offer Letter Msg</th>
                      <th className="attendanceheading">Resume</th>
                      <th className="attendanceheading">Notice Period</th>
                      {userType === "TeamLeader" && (
                        <th className="attendanceheading">
                          Message For Manager
                        </th>
                      )}
                      {userType === "Recruiters" && (
                        <th className="attendanceheading">
                          Message For Team Leader
                        </th>
                      )}
                      {userType === "Manager" && (
                        <th className="attendanceheading">
                          Message For Super User
                        </th>
                      )}
                      <th className="attendanceheading">
                        Availability For Interview
                      </th>
                      <th className="attendanceheading">Interview Time</th>
                      <th className="attendanceheading">Interview Status</th>
                      <th className="attendanceheading">Employee ID</th>

                      {(userType === "TeamLeader" ||
                        userType === "Manager") && (
                        <th className="attendanceheading">Team Leader Id</th>
                      )}

                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((item, index) => (
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
                            <span className="tooltiptext">
                              {item.candidateId}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.date} - {item.candidateAddedTime || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.date} - {item.candidateAddedTime}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.recruiterName}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.recruiterName}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateName}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateEmail || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateEmail}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.contactNumber || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.contactNumber}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.alternateNumber || 0}
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
                          {item.sourceName || 0}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.sourceName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.jobDesignation || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.jobDesignation}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.requirementId || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.requirementId}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.requirementCompany || "-"}
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
                          {item.communicationRating || "-"}
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
                          {item.currentLocation || "-"}
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
                          {item.fullAddress || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.fullAddress}{" "}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.callingFeedback || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.callingFeedback}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.feedBack || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.feedBack}</span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.incentive || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.incentive}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.selectYesOrNo || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.selectYesOrNo}
                            </span>
                          </div>
                        </td>

                        <>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.companyName || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.companyName}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.experienceYear} Year - {item.experienceMonth}{" "}
                            Month
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.experienceYear} Year{" "}
                                {item.experienceMonth} Month
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.relevantExperience || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.relevantExperience}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.currentCTCLakh} Lakh {item.currentCTCThousand}{" "}
                            Thousand
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.currentCTCLakh} Lakh{" "}
                                {item.currentCTCThousand} Thousand
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.expectedCTCLakh} Lakh{" "}
                            {item.expectedCTCThousand} Thousand
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.expectedCTCLakh} Lakh{" "}
                                {item.expectedCTCThousand} Thousand
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.dateOfBirth || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.dateOfBirth}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.gender || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.gender}</span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.qualification || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.qualification}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.yearOfPassing || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.yearOfPassing}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.extraCertification || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.extraCertification}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.holdingAnyOffer || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.holdingAnyOffer}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.offerLetterMsg || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.offerLetterMsg}
                              </span>
                            </div>
                          </td>

                          {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) start LineNo:-993
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

                          {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) End LineNo:-1005
                  Date:-02/07 */}

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.noticePeriod || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.noticePeriod}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.msgForTeamLeader || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.msgForTeamLeader}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.availabilityForInterview || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.availabilityForInterview}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.interviewTime || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.interviewTime}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.finalStatus || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.finalStatus}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.empId || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.empId}</span>
                            </div>
                          </td>

                          {(userType === "TeamLeader" ||
                            userType === "Manager") && (
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {item.teamLeaderId}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {item.teamLeaderId}
                                </span>
                              </div>
                            </td>
                          )}

                          <td className="tabledata">
                            <button className="table-icon-div">
                              <i
                                onClick={() => handleUpdate(item.candidateId)}
                                className="fa-regular fa-pen-to-square"
                              ></i>
                            </button>
                          </td>
                        </>
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
                          style={{
                            fontSize: "18px",
                            backgroundColor: "#f2f2f2",
                          }}
                        >
                          Forward To
                        </Modal.Header>
                        <Modal.Body
                          style={{
                            backgroundColor: "#f2f2f2",
                          }}
                        >
                          {/* akash_pawar_LineUpList_ShareFunctionality_17/07_1524 */}
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
                                                oldManagerId:
                                                  managers.managerId,
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
                                                  newManagerId:
                                                    managers.managerId,
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
                                      recruiterUnderTeamLeader.map(
                                        (recruiters) => (
                                          <div key={recruiters.recruiterId}>
                                            <label
                                              htmlFor={recruiters.employeeId}
                                            >
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
                                              - {recruiters.employeeName}
                                            </label>
                                          </div>
                                        )
                                      )}
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* akash_pawar_LineUpList_ShareFunctionality_17/07_1747 */}
                        </Modal.Body>
                        {errorForShare && (
                          <div style={{ textAlign: "center", color: "red" }}>
                            {errorForShare}
                          </div>
                        )}
                        <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
                          <button
                            onClick={handleShare}
                            className="lineUp-share-forward-popup-btn"
                          >
                            Share
                          </button>
                          <button
                            onClick={() => setShowForwardPopup(false)}
                            className="lineUp-close-forward-popup-btn"
                          >
                            Close
                          </button>
                        </Modal.Footer>
                      </Modal.Dialog>
                    </div>
                  </>
                ) : null}
                {/* Name:-Akash Pawar Component:-LineUpList
                Subcategory:-ResumeModel(added) End LineNo:-1153 Date:-02/07 */}
                <Modal
                  show={showResumeModal}
                  onHide={closeResumeModal}
                  size="md"
                >
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
                {/* Name:-Akash Pawar Component:-LineUpList
                     Subcategory:-ResumeModel(added) End LineNo:-1184 Date:-02/07 */}
              </div>
            </>
          ) : (
            <UpdateCallingTracker
              candidateId={selectedCandidateId}
              employeeId={employeeId}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateCallingTracker(false)}
              loginEmployeeName={loginEmployeeName}
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

export default LineUpList;
