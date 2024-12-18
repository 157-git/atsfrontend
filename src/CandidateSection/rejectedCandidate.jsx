import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./rejectedcandidate.css";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
// SwapnilRokade_RejectedCandidate_ModifyFilters_11/07
const RejectedCandidate = ({ updateState, funForGettingCandidateId,loginEmployeeName, }) => {
  const [showRejectedData, setShowRejectedData] = useState([]);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showHoldData, setShowHoldData] = useState([]);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [callingList, setCallingList] = useState([]);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCallingForm, setShowCallingForm] = useState(false);
  const [callingToUpdate, setCallingToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_28
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_29
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_30
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  let [color, setColor] = useState("#ffcb9b");
  const [isDataSending, setIsDataSending] = useState(false);
  const [errorForShare, setErrorForShare] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  // added by sahil karnekar to refresh the useeffect on date 17-12-2024
    const [triggerFetch, setTriggerFetch] = useState(false);

  const { employeeId } = useParams();
  const newEmployeeId = parseInt(employeeId, 10);

  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_43
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
  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_65

  const navigator = useNavigate();

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
  ["currentCTCLakh", "Current CTC (Lakh)"],
  ["currentCTCThousand", "Current CTC (Thousand)"],
  ["currentLocation", "Current Location"],
  ["date", "Date"],
  ["dateOfBirth", "Date Of Birth"],
  ["empId", "Emp Id"],
  ["expectedCTCLakh", "Expected CTC (Lakh)"],
  ["expectedCTCThousand", "Expected CTC (Thousand)"],
  ["experienceMonth", "Experience Month"],
  ["experienceYear", "Experience Year"],
  ["extraCertification", "Extra Certification"],
  ["feedBack", "FeedBack"],
  ["finalStatus", "Final Status"],
  ["fullAddress", "Full Address"],
  ["gender", "Gender"],
  ["holdingAnyOffer", "Holding Any Offer"],
  ["incentive", "Incentive"],
  ["interviewTime", "Interview Time"],
  ["jobDesignation", "Job Designation"],
  ["msgForTeamLeader", "Message For Team Leader"],
  ["noticePeriod", "Notice Period"],
  ["offerLetterMsg", "Offer Letter Message"],
  ["oldEmployeeId", "Old Employee Id"],
  ["qualification", "Qualification"],
  ["recruiterName", "Recruiter Name"],
  ["relevantExperience", "Relevant Experience"],
  ["requirementCompany", "Applying Company"],
  ["requirementId", "Job Id"],
  ["selectYesOrNo", "Status"],
  ["sourceName", "Source Name"],
  ["yearOfPassing", "Year Of Passing"]
  ]
  const { userType } = useParams();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchRejectedData(currentPage, pageSize);
  }, [employeeId,currentPage, pageSize,triggerFetch,searchTerm]);

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredCallingList[0] || {}).includes(key)
      )
      .map(([key]) => key);
    setFilterOptions(options);
  }, [filteredCallingList]);
  
  

  const fetchRejectedData = async (page, size) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rejected-candidate/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
      );
      const data = await response.json();
      setCallingList(data.content);
      setFilteredCallingList(data.content);
      setTotalRecords(data.totalElements);
      setSearchCount(data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);


  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_144

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
      fetchRecruiters(employeeId);
    }
  }, []);
  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_188

  
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

  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_210
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
    if (userType === "TeamLeader") {
      if (selectedRecruiters.recruiterId === "") {
        setErrorForShare("Please Select A Recruiter ! ")
        return;
      }else{
        setErrorForShare("");
      }
    }
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
      toast.success("Candidates forwarded successfully!"); //Swapnil Error&success message
      fetchRejectedData();
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
      toast.error("Error while forwarding candidates"); //Swapnil Error&success message
      // Handle error scenarios or show error messages to the user
    }
  };
  //akash_pawar_RejectedCandidate_ShareFunctionality_18/07_294

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
          (item.jobDesignation &&
            item.jobDesignation.toString().toLowerCase().includes(searchTermLower)) ||
            (item.requirementId &&
              item.requirementId.toString().toLowerCase().includes(searchTermLower)) ||
              (item.fullAddress &&
                item.fullAddress.toString().toLowerCase().includes(searchTermLower)) ||
                (item.experienceYear &&
                  item.experienceYear.toString().toLowerCase().includes(searchTermLower)) ||
                  (item.experienceMonth &&
                    item.experienceMonth.toString().toLowerCase().includes(searchTermLower)) ||
                    (item.relevantExperience &&
                      item.relevantExperience.toString().toLowerCase().includes(searchTermLower)) ||
                      (item.currentCTCLakh &&
                        item.currentCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
                        (item.currentCTCThousand &&
                          item.currentCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
                          (item.expectedCTCLakh &&
                            item.expectedCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
                            (item.expectedCTCThousand &&
                              item.expectedCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
                              (item.yearOfPassing &&
                                item.yearOfPassing.toString().toLowerCase().includes(searchTermLower)) ||
                                (item.extraCertification &&
                                  item.extraCertification.toString().toLowerCase().includes(searchTermLower)) ||
                                  (item.holdingAnyOffer &&
                                    item.holdingAnyOffer.toString().toLowerCase().includes(searchTermLower)) ||
                                    (item.offerLetterMsg &&
                                      item.offerLetterMsg.toString().toLowerCase().includes(searchTermLower)) ||
                                      (item.noticePeriod &&
                                        item.noticePeriod.toString().toLowerCase().includes(searchTermLower)) ||
                                        (item.msgForTeamLeader &&
                                          item.msgForTeamLeader.toString().toLowerCase().includes(searchTermLower)) ||
                                          (item.availabilityForInterview &&
                                            item.availabilityForInterview.toString().toLowerCase().includes(searchTermLower)) ||
                                            (item.interviewTime &&
                                              item.interviewTime.toString().toLowerCase().includes(searchTermLower)) ||
                                              (item.finalStatus &&
                                                item.finalStatus.toString().toLowerCase().includes(searchTermLower)) ||
                                                (item.dateOfBirth &&
                                                  item.dateOfBirth.toString().toLowerCase().includes(searchTermLower)) ||
                                                  (item.gender &&
                                                    item.gender.toString().toLowerCase().includes(searchTermLower)) ||
                                                    (item.qualification &&
                                                      item.qualification.toString().toLowerCase().includes(searchTermLower)) ||
                                                      (item.incentive &&
                                                        item.incentive.toString().toLowerCase().includes(searchTermLower)) ||
                                                        (item.candidateId &&
                                                          item.candidateId.toString().toLowerCase().includes(searchTermLower)) ||
                                                          (item.empId &&
                                                            item.empId.toString().toLowerCase().includes(searchTermLower)) ||
                                                            (item.teamLeaderId &&
                                                              item.teamLeaderId.toString().toLowerCase().includes(searchTermLower)) ||
        (item.selectYesOrNo &&
          item.selectYesOrNo.toLowerCase().includes(searchTermLower))
      );
    });
    setFilteredCallingList(filtered);
    setSearchCount(filtered.length);
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

  // changed this function sahil karnekar date : 22-10-2024
  const filterData = () => {
    let filteredData = [...callingList];
  
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
    setFilteredCallingList(filteredData);
  };
// this function added by sahil karnekar on date 17-12-2024
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
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

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetchRejectedData();
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

  //Name:-Akash Pawar Component:-RejectedCandidate Subcategory:-ResumeViewButton(added) start LineNo:-326 Date:-02/07
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
  //Name:-Akash Pawar Component:-RejectedCandidate Subcategory:-ResumeViewButton(added) End LineNo:-356 Date:-02/07

  //Swapnil_Rokade_SelectedCandidate_columnsToInclude_columnsToExclude_17/07/2024//
  const handleExportToExcel = () => {
    // Define columns to include in export
    const columnsToInclude = [
      "No.",
      "Date",
      "Time",
      "Candidate's Id",
      "Recruiter's Name",
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
      "Recruiter's Incentive",
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
      "Call Summary",
      "Holding Any Offer",
      "Offer Letter Message",
      "Notice Period",
      "Message For Team Leader",
      "Availability For Interview",
      "Interview Time",
      "Final Status",
    ];

    // Clone the data and map to match columnsToInclude order
    const dataToExport = filteredCallingList.map((item, index) => {
      // Create a filtered item without the 'Resume' field
      const filteredItem = {
        "No.": index + 1,
        Date: item.date || "-",
        Time: item.candidateAddedTime || "-",
        "Candidate's Id": item.candidateId || "-",
        "Recruiter's Name": item.recruiterName || "-",
        "Candidate's Name": item.candidateName || "-",
        "Candidate's Email": item.candidateEmail || "-",
        "Contact Number": item.contactNumber || "-",
        "Whatsapp Number": item.alternateNumber || "-",
        "Source Name": item.sourceName || "-",
        "Job Designation": item.jobDesignation || "-",
        "Job Id": item.requirementId || "-",
        "Applying Company": item.requirementCompany || "-",
        "Communication Rating": item.communicationRating || "-",
        "Current Location": item.currentLocation || "-",
        "Full Address": item.fullAddress || "-",
        "Recruiter's Incentive": item.incentive || "-",

        "Interested or Not": item.selectYesOrNo || "-",
        "Current Company": item.companyName || "-",
        "Total Experience": item.experienceYear || "-",
        "Relevant Experience": item.relevantExperience || "-",
        "Current CTC": `${item.currentCTCLakh || "0"} Lakh ${
          item.currentCTCThousand || "0"
        } Thousand`,
        "Expected CTC": `${item.expectedCTCLakh || "0"} Lakh ${
          item.expectedCTCThousand || "0"
        } Thousand`,
        "Date Of Birth": item.dateOfBirth || "-",
        Gender: item.gender || "-",
        Education: item.qualification || "-",
        "Year Of Passing": item.yearOfPassing || "-",
        "Call Summary": item.feedBack || "-",
        "Holding Any Offer": item.holdingAnyOffer || "-",
        "Offer Letter Message": item.offerLetterMsg || "-",
        "Notice Period": item.noticePeriod || "-",
        "Message For Team Leader": item.msgForTeamLeader || "-",
        "Availability For Interview": item.availabilityForInterview || "-",
        "Interview Time": item.interviewTime || "-",
        "Final Status": item.finalStatus || "-",
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

    XLSX.utils.book_append_sheet(wb, ws, "RejectedCandidates List");
    XLSX.writeFile(wb, "RejectedCandidates_list.xlsx");
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
  //Swapnil_Rokade_SelectedCandidate_columnsToInclude_columnsToExclude_17/07/2024//

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
  
  return (
    <div className="calling-list-container">
{/* updated by sahil karnekar date 17-12-2024 */}
{
  !showUpdateCallingTracker && (
    <>

<div className="search">
                {/* this line is added by sahil karnekar date 24-10-2024 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa-solid fa-magnifying-glass"
                
                  style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                ></i>
                {/* line 707 to 716 added by sahil karnekar date 24-10-2024 */}

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
                    { searchTerm && (
                      <div className="svgimagesetinInput">
                    <svg onClick={(()=>setSearchTerm(""))} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                    )}
                    
                    </div>
                  </div>

        
              </div>
                <h5 style={{ color: "gray" }}>Rejected Data </h5>

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
                    {(userType === 'Manager' || userType === 'TeamLeader') && (
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
                          className="rejectedcan-share-btn"
                          onClick={() => setShowShareButton(false)}
                        >
                          Share
                        </button>
                      ) : (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            className="rejectedcan-share-close-btn"
                            onClick={() => {
                              setShowShareButton(true);
                              setSelectedRows([]);
                            }}
                          >
                            Close
                          </button>
                          {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_603 */}
                          {userType === "TeamLeader" && (
                            <button
                          className="lineUp-share-btn"
                              onClick={handleSelectAll}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          )}
                          {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_611 */}
                          <button
                            className="rejectedcan-forward-btn"
                            onClick={forwardSelectedCandidate}
                          >
                            Forward
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    className="rejectedcan-Filter-btn"
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
</div>
{/* added by sahil karnekar on date 17-12-2024 */}
    </>
  )
}

      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!showUpdateCallingTracker ? (
            <>
          
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
                      <th className="attendanceheading">Any Extra Certification</th>
                      {/* <th className="attendanceheading">Feedback</th> */}
                      <th className="attendanceheading">Holding Any Offer</th>
                      <th className="attendanceheading">Offer Letter Msg</th>
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
                      {userType === 'Manager' &&
                        <th className="attendanceheading">
                          Message For Super User
                        </th>}
                      <th className="attendanceheading">
                        Availability For Interview
                      </th>
                      <th className="attendanceheading">Interview Time</th>
                      <th className="attendanceheading">Interview Status</th>
                      <th className="attendanceheading">Employee ID</th>

                      {(userType === 'TeamLeader' || userType === 'Manager') && (
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
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                         {calculateRowIndex(index)}
                          <div className="tooltip">
                            <span className="tooltiptext">{calculateRowIndex(index)}</span>
                          </div>
                        </td>
                        
<td
  className="tabledata"
  onMouseOver={handleMouseOver}
  onMouseOut={handleMouseOut}
>
{highlightText(item.candidateId.toString().toLowerCase() || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.candidateId.toString().toLowerCase() || "",
                                searchTerm
                              )}
                            </span>
                          </div>
</td>

<td
  className="tabledata"
  onMouseOver={handleMouseOver}
  onMouseOut={handleMouseOut}
>
{ highlightText(item.date || "", searchTerm)  } - {item.candidateAddedTime || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">{highlightText(
                                item.date.toString().toLowerCase() || "",
                                searchTerm
                              )}  - {" "}  {item.candidateAddedTime}</span>
                          </div>
</td>



<td
  className="tabledata"
  onMouseOver={handleMouseOver}
  onMouseOut={handleMouseOut}
>
{highlightText(item.recruiterName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.recruiterName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
</td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.candidateName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.candidateName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                         {highlightText(item.candidateEmail || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.candidateEmail || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                           {highlightText(item.contactNumber || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.contactNumber || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.alternateNumber || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.alternateNumber || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                           {highlightText(item.sourceName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.sourceName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                         {highlightText(item.jobDesignation || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.jobDesignation || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.requirementId || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.requirementId || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                            {highlightText(item.requirementCompany || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.requirementCompany || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.communicationRating || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.communicationRating || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                           {highlightText(item.currentLocation || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.currentLocation || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                         {highlightText(item.fullAddress || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.fullAddress || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.callingFeedback || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.callingFeedback || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                       {highlightText(item.feedBack || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.feedBack || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                    </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.incentive.toString().toLowerCase() || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.incentive.toString().toLowerCase() || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                         {highlightText(item.selectYesOrNo || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.selectYesOrNo || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        <>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(item.companyName || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.companyName || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                         
                          <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}>
                          
                          {item.experienceYear} {" "} Year -  {item.experienceMonth} Month
                          <div className="tooltip">
                            <span className="tooltiptext">{item.experienceYear} {" "} Year {item.experienceMonth} Month</span>
                          </div>
                        </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                              {highlightText(item.relevantExperience || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.relevantExperience || "",
                                searchTerm
                              )}
                            </span>
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
                          
                        
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.dateOfBirth || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.dateOfBirth || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.gender || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.gender || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.qualification || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.qualification || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                              {highlightText(item.yearOfPassing || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.yearOfPassing || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                              {highlightText(item.extraCertification || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.extraCertification || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.holdingAnyOffer || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.holdingAnyOffer || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                           {highlightText(item.offerLetterMsg || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.offerLetterMsg || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          {/* <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {item.resume || "-"}
                            <div className="tooltip">
                              <span className="tooltiptext">{item.resume}</span>
                            </div>
                          </td> */}
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
                            {highlightText(item.noticePeriod || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.noticePeriod || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                               {highlightText(item.msgForTeamLeader || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.msgForTeamLeader || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.availabilityForInterview || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.availabilityForInterview || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                             {highlightText(item.interviewTime || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.interviewTime || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                               {highlightText(item.finalStatus || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.finalStatus || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                          </td>
                          <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.empId.toString().toLowerCase() || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.empId.toString().toLowerCase() || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

                        {(userType === 'TeamLeader' || userType === 'Manager') && (
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(item.teamLeaderId.toString().toLowerCase() || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.teamLeaderId.toString().toLowerCase() || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                            </td>
                          )}

                          <td className="tabledata">
                            <i
                              onClick={() => handleUpdate(item.candidateId)}
                              className="fa-regular fa-pen-to-square"
                            ></i>
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
                          {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_1339 */}
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
                                    {loginEmployeeName}
                                  </label>
                                </div>
                                <div className="accordion-content">
                                  <form>
                                    {recruiterUnderTeamLeader &&
                                      recruiterUnderTeamLeader.map(
                                        (recruiters) => (
                                          <div
                                            key={recruiters.recruiterId}
                                            className="form-group"
                                          >
                                            <label
                                              htmlFor={recruiters.employeeId}
                                            >
                                              <input
                                              style={{width:"auto"}}
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
                                        )
                                      )}
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* akash_pawar_RejectedCandidate_ShareFunctionality_18/07_1563 */}
                        </Modal.Body>
                        {
                         errorForShare && (
                          <div style={{textAlign:"center", color:"red"}}>{errorForShare}</div>
                         )
                        }
                        <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
                          <button
                            onClick={handleShare}
                            className="selectedcan-share-forward-popup-btn"
                          >
                            Share
                          </button>
                          <button
                            onClick={() => setShowForwardPopup(false)}
                            className="selectedcan-close-forward-popup-btn"
                          >
                            Close
                          </button>
                        </Modal.Footer>
                      </Modal.Dialog>
                    </div>
                  </>
                ) : null}
                {/* Name:-Akash Pawar Component:-RejectedCandidate
          Subcategory:-ResumeModel(added) End LineNo:-1176 Date:-02/07 */}
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
                {/* Name:-Akash Pawar Component:-RejectedCandidate
          Subcategory:-ResumeModel(added) End LineNo:-1203 Date:-02/07 */}
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
          justifyContent: 'center',
        }}
      />
            </>
          ) : (
            <UpdateCallingTracker
              candidateId={selectedCandidateId}
              employeeId={employeeId}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateCallingTracker(false)}
              triggerFetch={handleTriggerFetch}
            />
          )}
        </>
      )}
      {isDataSending && (
        <div className="ShareFunc_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}
       
    </div>
  );
};

export default RejectedCandidate;
