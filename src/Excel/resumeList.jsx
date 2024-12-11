import React, { useEffect, useState, useCallback } from "react";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import "../Excel/resumeList.css";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";
{
  /* this line added by sahil date 22-10-2024 */
}
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Loader from "../EmployeeSection/loader";
import { parse } from "date-fns";
import axios from "../api/api";
import { toast } from "react-toastify";
import { Pagination } from "antd";
{
  /* this line added by sahil date 22-10-2024 */
}
const ResumeList = ({
  loginEmployeeName,
  onsuccessfulDataAdditions,
  viewsSearchTerm,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [show, setShow] = useState(false);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [filteredData, setFilteredData] = useState([]); // To store filtered results
  const { employeeId, userType } = useParams();
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic
  const [showShareButton, setShowShareButton] = useState(true);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [fetchAllManager, setFetchAllManager] = useState([]);
  const [fetchTeamleader, setFetchTeamleader] = useState([]);
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]);
  const [isDataSending, setIsDataSending] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [employeeId, currentPage, pageSize]);

  const fetchData = async (page, size) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fetch-resumes-data/${employeeId}/${userType}?page=${page}&size=${size}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      setData(result.content);
      setFilteredData(result.content);
      setTotalRecords(result.totalElements);
      setSearchCount(result.length);
      console.log(filteredData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewsSearchTerm) {
      setSearchTerm(viewsSearchTerm); // Sync viewsSearchTerm to local searchTerm
      applyFilters(); // Re-trigger data filtering
    }
  }, [viewsSearchTerm]);

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

  //Swapnil_Rokade_ResumeList_columnsToInclude_columnsToExclude_18/07/2024//
  const handleExportToExcel = () => {
    const columnsToInclude = [
      "No.",
      "Uploaded Date",
      "Candidate's Name",
      "Candidate Email",
      "Contact Number",
      "Gender",
      "Date Of Birth",
      "job designation",
      "Last Company",
      "Education",
      "Relevant Experience",
      "Current Location",
      "Extra Certification",
    ];

    const dataToExport = data.map((item, index) => {
      const filteredItem = {
        "No.": index + 1,
        "Uploaded Date": item.resumeUploadDate || "-",
        "Candidate's Name": item.candidateName || "-",
        "Candidate Email": item.candidateEmail || "-",
        "Contact Number": item.contactNumber || "-",
        Gender: item.gender || "-",
        "Date Of Birth": item.dateOfBirth || "-",
        "job designation": item.jobDesignation || "-",
        "Last Company": item.companyName || "-",
        Education: item.qualification || "-",
        "Relevant Experience": item.relevantExperience || "-",
        "Current Location": item.currentLocation || "-",
        "Extra Certification": item.extraCertification || "-",
      };
      return filteredItem;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: columnsToInclude,
    });

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
    XLSX.utils.book_append_sheet(wb, ws, "Resume List");
    XLSX.writeFile(wb, "ResumeList.xlsx");
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

  const handleUpdate = (candidateData) => {
    setShow(true);
    setSelectedCandidate(candidateData); // Set candidate data for CallingTrackerForm
  };
  //Swapnil_Rokade_ResumeList_columnsToInclude_columnsToExclude_18/07/2024//
  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();

        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }

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

        console.error(`Unsupported document type: ${fileType}`);
        return "Unsupported Document";
      } catch (error) {
        console.error("Error converting byte code to document:", error);
        return "Invalid Document";
      }
    }
    return "Document Not Found";
  };

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const limitedOptions = [
    ["resumeUploadDate", "Date"],
    ["candidateName", "Candidate Name"],
    ["candidateEmail", "Candidate Email"],
    ["contactNumber", "Contact Number"],
    ["gender", "Gender"],
    ["dateOfBirth", "Date Of Birth"],
    ["currentLocation", "Current Location"],
    ["jobDesignation", "Job Designation"],
    ["companyName", "Last Company Name"],
    ["relevantExperience", "Relevant Experience"],
    ["qualification", "Qualification"],
    ["employeeId", "Employee Id"],
    ["employeeName", "Employee Name"],
  ];
  const handleFilterOptionClick = (key) => {
    if (activeFilterOption === key) {
      setActiveFilterOption(null); // Close the current filter
    } else {
      setActiveFilterOption(key); // Open a new filter section
    }

    // Initialize the selected filter array if it doesn't exist
    setSelectedFilters((prev) => {
      const newSelectedFilters = { ...prev };
      if (!newSelectedFilters[key]) {
        newSelectedFilters[key] = []; // Create an empty array for values
      }
      return newSelectedFilters;
    });
  };

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value) // Deselect the value
        : [...prev[key], value], // Select the value
    }));
  };

  const applyFilters = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    let filteredResults = data.filter((item) => {
      return (
        item.candidateName?.toLowerCase().includes(lowerSearchTerm) ||
        item.candidateEmail?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobDesignation?.toLowerCase().includes(lowerSearchTerm) ||
        item.currentLocation?.toLowerCase().includes(lowerSearchTerm) ||
        item.companyName?.toLowerCase().includes(lowerSearchTerm) ||
        item.contactNumber
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.dateOfBirth?.toLowerCase().includes(lowerSearchTerm) ||
        item.extraCertification?.toLowerCase().includes(lowerSearchTerm) ||
        item.gender?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobRole?.toLowerCase().includes(lowerSearchTerm) ||
        item.qualification?.toLowerCase().includes(lowerSearchTerm) ||
        item.relevantExperience?.toLowerCase().includes(lowerSearchTerm) ||
        item.resumeUploadDate?.toLowerCase().includes(viewsSearchTerm)
      );
    });

    // Apply selected filters
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        filteredResults = filteredResults.filter((item) =>
          values.some((value) =>
            item[option]
              ?.toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
          )
        );
      }
    });

    setFilteredData(filteredResults);
    setSearchCount(filteredResults.length);
  };

  const highlightText = (text, term) => {
    if (!term) return text;

    const textString = text?.toString() || ""; // Ensure text is a string or default to an empty string
    const parts = textString.split(new RegExp(`(${term})`, "gi")); // Split by the term, preserving matches

    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    applyFilters(); // Reapply filters whenever the data or selected filters change
  }, [searchTerm, data, selectedFilters]);

  const formatToIndianTime = (dateString) => {
    // Parse the custom format "dd-MM-yyyy h:mm a"
    const date = parse(dateString, "dd-MM-yyyy h:mm a", new Date());

    // Check if the parsed date is valid
    if (isNaN(date)) {
      return "Invalid Date";
    }

    // Format the date to Indian Time (IST)
    const indianOffset = 5.5 * 60; // IST offset in minutes
    const utcOffset = date.getTimezoneOffset();
    const istDate = new Date(
      date.getTime() + (indianOffset + utcOffset) * 60000
    );

    return istDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Force IST format
    });
  };

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
  };

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic line
  const [employeeCount, setEmployeeCount] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [expandedManagerId, setExpandedManagerId] = useState(null);
  const [expandedTeamLeaderId, setExpandedTeamLeaderId] = useState(null);
  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const fetchManagerNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching manager names:", error);
      }
    };

    if (userType === "SuperUser") {
      fetchManagerNames();
    } else if (userType === "Manager") {
      fetchTeamLeaderNames(employeeId);
    } else if (userType === "TeamLeader") {
      fetchRecruiterUnderTeamLeaderData(employeeId);
    }
  }, [userType, employeeId]);

  useEffect(() => {
    if (expandedManagerId != null) {
      fetchTeamLeaderNames(expandedManagerId);
    }
  }, [expandedManagerId]);

  useEffect(() => {
    if (expandedTeamLeaderId != null) {
      fetchRecruiterUnderTeamLeaderData(expandedTeamLeaderId);
    }
  }, [expandedTeamLeaderId]);

  const fetchTeamLeaderNames = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${id}`);
      setTeamLeaders(response.data);
    } catch (error) {
      console.error("Error fetching team leader names:", error);
    }
  };

  const fetchRecruiterUnderTeamLeaderData = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${id}`
      );
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  }, []);

  const toggleTeamLeaderExpand = (teamLeaderId) => {
    setExpandedTeamLeaderId(
      expandedTeamLeaderId === teamLeaderId ? null : teamLeaderId
    );
  };
  const handleManagerCheckboxChange = (manager) => {
    setSelectedManagers((prev) =>
      prev.some((item) => item.managerId === manager.managerId)
        ? prev.filter((item) => item.managerId !== manager.managerId)
        : [
            ...prev,
            {
              managerId: manager.managerId,
              managerJobRole: manager.jobRole,
            },
          ]
    );
  };

  const handleTeamLeaderCheckboxChange = (teamLeader) => {
    setSelectedTeamLeaders((prev) =>
      prev.some((item) => item.teamLeaderId === teamLeader.teamLeaderId)
        ? prev.filter((item) => item.teamLeaderId !== teamLeader.teamLeaderId)
        : [
            ...prev,
            {
              teamLeaderId: teamLeader.teamLeaderId,
              teamLeaderJobRole: teamLeader.jobRole,
            },
          ]
    );
    setSelectedRecruiters({
      employeeId: teamLeader.teamLeaderId,
      jobRole: teamLeader.jobRole,
    });
  };

  const handleRecruiterCheckboxChange = (recruiter) => {
    setSelectedRecruiters((prev) => {
      if (prev.some((item) => item.employeeId === recruiter.employeeId)) {
        // Remove the recruiter if already selected
        return prev.filter((item) => item.employeeId !== recruiter.employeeId);
      } else {
        // Add the recruiter to the selection
        return [...prev, recruiter];
      }
    });
  };

  const renderManagers = () => {
    return managers.map((manager) => (
      <div key={manager.managerId} className="dropdown-section">
        <div className="PI-dropdown-row">
          <input
            style={{
              transform: "scale(1.4)",
              margin: "5px",
            }}
            type="radio"
            checked={selectedManagers.some(
              (item) => item.managerId === manager.managerId
            )}
            onChange={() => handleManagerCheckboxChange(manager)}
          />
          <label
            className="clickable-label"
            onClick={() => toggleManagerExpand(manager.managerId)}
          >
            {manager.managerName}
            <i
              className={`fa-solid ${
                expandedManagerId === manager.managerId
                  ? "fa-angle-up"
                  : "fa-angle-down"
              }`}
            ></i>
          </label>
        </div>
        {expandedManagerId === manager.managerId && (
          <div className="PI-dropdown-column ">
            {renderTeamLeaders(manager.managerId)}
          </div>
        )}
      </div>
    ));
  };

  const renderTeamLeaders = (managerId) => {
    return teamLeaders.map((teamLeader) => (
      <div key={teamLeader.teamLeaderId} className="PI-dropdown-section">
        <div className="PI-dropdown-row">
          <input
            type="radio"
            checked={
              selectedRecruiters.employeeId === teamLeader.teamLeaderId &&
              selectedRecruiters.jobRole === teamLeader.jobRole
            }
            onChange={() =>
              setSelectedRecruiters({
                employeeId: teamLeader.teamLeaderId,
                jobRole: teamLeader.jobRole,
              })
            }
          />
          <label
            className="clickable-label"
            onClick={() => toggleTeamLeaderExpand(teamLeader.teamLeaderId)}
          >
            {teamLeader.teamLeaderName}
            <i
              className={`fa-solid ${
                expandedTeamLeaderId === teamLeader.teamLeaderId
                  ? "fa-angle-up"
                  : "fa-angle-down"
              }`}
            ></i>
          </label>
        </div>
        {expandedTeamLeaderId === teamLeader.teamLeaderId && (
          <div className="PI-dropdown-column">{renderRecruiters()}</div>
        )}
      </div>
    ));
  };

  const renderRecruiters = () => {
    return recruiters.map((recruiter) => (
      <div key={recruiter.employeeId} className="PI-dropdown-row">
        <input
          type="radio"
          name="recruiter" // Ensure only one recruiter can be selected
          checked={selectedRecruiters.employeeId === recruiter.employeeId}
          onChange={() =>
            setSelectedRecruiters({
              employeeId: recruiter.employeeId,
              jobRole: recruiter.jobRole,
            })
          }
        />
        <label>{recruiter.employeeName}</label>
      </div>
    ));
  };

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic,
  const [oldselectedTeamLeader, setOldSelectedTeamLeader] = useState({
    oldTeamLeaderId: "",
    oldTeamLeaderJobRole: "",
  });
  const [newselectedTeamLeader, setNewSelectedTeamLeader] = useState({
    newTeamLeaderId: "",
    newTeamLeaderJobRole: "",
  });

  const [selectedRecruiters, setSelectedRecruiters] = useState({
    employeeId: null,
    jobRole: "",
  });

  const [oldSelectedManager, setOldSelectedManager] = useState({
    oldManagerId: "",
    oldManagerJobRole: "",
  });
  const [newSelectedManager, setNewSelectedManager] = useState({
    newManagerId: "",
    newManagerJobRole: "",
  });

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = filteredData.map((item) => item.candidateId);
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

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic
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

  const fetchTeamLeader = async (empId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tl-namesIds/${empId}`);
      const data = await response.json();
      setFetchTeamleader(data);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
    }
  };

  const fetchManager = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-all-managers`);
      const data = await response.json();
      setFetchAllManager(data);
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
    if (!selectedRecruiters.employeeId || selectedRows.length === 0) {
      toast.error("Please select an employee and rows to share.");
      setIsDataSending(false);
      return;
    }

    const requestData = {
      candidateIds: selectedRows,
      employeeId: selectedRecruiters.employeeId,
      jobRole: selectedRecruiters.jobRole,
    };

    console.log("Request Data:", requestData);

    try {
      const requestOptions = {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      const url = `${API_BASE_URL}/share-resume-data`;
      const response = await fetch(url, requestOptions);

      const responseData = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success(responseData);
      fetchData(currentPage, pageSize);
      setShowForwardPopup(false); // Close the modal
      setShowShareButton(true); // Optional: Handle additional UI state
      setSelectedRows([]); // Reset selected rows
      setSelectedRecruiters({ employeeId: null, jobRole: "" });cal
      console.log("Data Shared Successfully.......");
    } catch (error) {
      console.error("Error while forwarding candidates:", error);
      setIsDataSending(false);
      toast.error("Failed to forward candidates. Please try again.");
    } finally {
      setIsDataSending(false);
    }
  };

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic
  const downloadResumeFileFromBytes = (
    byteArray,
    candidateName,
    fileExtension
  ) => {
    if (!byteArray) {
      console.error("No byte data available for the file.");
      return;
    }

    try {
      // Decode the byte array
      const binary = atob(byteArray);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      // Determine MIME type based on the file extension
      const mimeType =
        fileExtension === "pdf"
          ? "application/pdf"
          : fileExtension === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "";

      if (!mimeType) {
        console.error(`Unsupported file extension: ${fileExtension}`);
        return;
      }

      // Create a Blob object
      const blob = new Blob([array], { type: mimeType });

      // Generate a URL for the Blob
      const fileURL = URL.createObjectURL(blob);

      // Sanitize candidate name for filename
      const sanitizedCandidateName = candidateName
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "");

      // Construct the file name
      const fileName = `${sanitizedCandidateName}_resume.${fileExtension}`;

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const [uploadCountData, setUploadCountData] = useState({
    totalCount: 0,
    candidateIds: [],
  });
  const [sharedCountData, setSharedCountData] = useState({
    totalCount: 0,
    candidateIds: [],
  });
  
  const [uploadSelectedRange, setUploadSelectedRange] = useState("0 DAY"); // Default for upload
  const [sharedSelectedRange, setSharedSelectedRange] = useState("0 DAY"); // Default for shared
  
  const dateRanges = [
    { label: "Today", value: "0 DAY" },
    { label: "1 Week", value: "7 DAY" },
    { label: "15 Days", value: "15 DAY" },
    { label: "1 Month", value: "1 MONTH" },
    { label: "3 Months", value: "3 MONTH" },
    { label: "6 Months", value: "6 MONTH" },
  ];

  const fetchUploadCountData = async (range) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/uploaded-resume-count`, {
        params: {
          employeeId: employeeId,
          jobRole: userType,
          dateRange: range,
        },
      });
      setUploadCountData(response.data);
    } catch (error) {
      console.error("Error fetching upload count data:", error);
    }
  };
  
  // Fetch Shared Count Data
  const fetchSharedCountData = async (range) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resume-shared-count`, {
        params: {
          oldEmployeeId: employeeId,
          oldJobRole: userType,
          dateRange: range,
        },
      });
      setSharedCountData(response.data);
    } catch (error) {
      console.error("Error fetching shared count data:", error);
    }
  };
  

// Effect for Upload Count
useEffect(() => {
  fetchUploadCountData(uploadSelectedRange);
}, [uploadSelectedRange]);

// Effect for Shared Count
useEffect(() => {
  fetchSharedCountData(sharedSelectedRange);
}, [sharedSelectedRange]);

// Handlers for Dropdown Changes
const handleUploadRangeChange = (event) => {
  setUploadSelectedRange(event.target.value);
};

const handleSharedRangeChange = (event) => {
  setSharedSelectedRange(event.target.value);
};

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
    <div className="App-after1">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!selectedCandidate && (
            <>
              <div className="rl-filterSection">
                <div className="filterSection">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-magnifying-glass"
                      onClick={() => {
                        setShowSearchBar(!showSearchBar);
                        setShowFilterSection(false);
                      }}
                      style={{
                        margin: "10px",
                        width: "auto",
                        fontSize: "15px",
                      }}
                    ></i>
                    <div
                      className="search-input-div"
                      style={{ width: `${calculateWidth()}px` }}
                    >
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          applyFilters(); // Pass the search term
                        }}
                      />
                    </div>
                  </div>
                  <h1 className="resume-data-heading">Resume Data </h1>

                  {/* // Arshad Attar Added This Code On 03-12-2024
                  // Added New Share Data Frontend Logic line */}
                  <div className="rl-btn-div">
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
                            {(userType === "TeamLeader" ||
                              userType === "Manager") && (
                              <button
                                className="lineUp-share-btn"
                                onClick={handleSelectAll}
                              >
                                {allSelected ? "Deselect All" : "Select All"}
                              </button>
                            )}

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

                    <button
                      style={{ marginRight: "8px", marginLeft: "8px" }}
                      onClick={toggleFilterSection}
                      className="daily-tr-btn"
                    >
                      Filter <i className="fa-solid fa-filter"></i>
                    </button>
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
                </div>
                {/* Swapnil_Rokade_ResumeList_CreateExcel_18/07/2024 */}
                <div>
                  {showFilterSection && (
                    <>
                      <div className="filter-section">
                        {limitedOptions.map(([optionKey, optionLabel]) => {
                          const uniqueValues = Array.from(
                            new Set(
                              data
                                .map((item) => {
                                  const value = item[optionKey];
                                  // Ensure the value is a string before converting to lowercase
                                  return typeof value === "string"
                                    ? value.toLowerCase()
                                    : value;
                                })
                                .filter(
                                  (value) =>
                                    value !== undefined && value !== null
                                ) // Remove null or undefined values
                            )
                          );

                          return (
                            <div key={optionKey} className="filter-option">
                              <button
                                className="white-Btn"
                                onClick={() =>
                                  handleFilterOptionClick(optionKey)
                                }
                              >
                                {optionLabel}
                                <span className="filter-icon">&#x25bc;</span>
                              </button>
                              {activeFilterOption === optionKey && (
                                <div className="city-filter">
                                  <div className="optionDiv">
                                    {uniqueValues.filter(
                                      (value) =>
                                        value !== "" &&
                                        value !== "-" &&
                                        value !== undefined &&
                                        !(
                                          optionKey === "alternateNumber" &&
                                          value === 0
                                        )
                                    ).length > 0 ? (
                                      uniqueValues.map(
                                        (value) =>
                                          value !== "" &&
                                          value !== "-" &&
                                          value !== undefined &&
                                          !(
                                            optionKey === "alternateNumber" &&
                                            value === 0
                                          ) && (
                                            <label
                                              key={value}
                                              className="selfcalling-filter-value"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={
                                                  selectedFilters[
                                                    optionKey
                                                  ]?.includes(value) || false
                                                }
                                                onChange={() =>
                                                  handleFilterSelect(
                                                    optionKey,
                                                    value
                                                  )
                                                }
                                                style={{ marginRight: "5px" }}
                                              />
                                              {value}
                                            </label>
                                          )
                                      )
                                    ) : (
                                      <div>No values</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                  {/* this modal added by sahil date 22-10-2024 */}
                        })}
                      </div>
                      <hr style={{ padding: "2px" }} />
                      <div className="count-div-resumlist">
    {/* Upload Date Options */}
    <div className="count-div-resumlist-sub">
      <label htmlFor="uploadDateRange">Upload Date Options:</label>
      <select
        id="uploadDateRange"
        value={uploadSelectedRange}
        onChange={handleUploadRangeChange}
      >
        {dateRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
      <p>Total Upload Count: {uploadCountData.totalCount}</p>
    </div>

    {/* Share Date Options */}
    {(userType === "Manager" || userType === "TeamLeader") && (
      <div className="count-div-resumlist-sub">
        <label htmlFor="shareDateRange">Share Date Options:</label>
        <select
          id="shareDateRange"
          value={sharedSelectedRange}
          onChange={handleSharedRangeChange}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        <p>Shared Total Count: {sharedCountData.totalCount}</p>
      </div>
    )}
  </div>
                    </>
                  )}
                </div>
              </div>

              <div className="attendanceTableData">
                <table className="selfcalling-table attendance-table">
                  <thead>
                    {/* this line updated by sahil date 22-10-2024 */}
                    <tr
                      className="attendancerows-head"
                      style={{ position: "sticky" }}
                    >
                      {/* // Arshad Attar Added This Code On 03-12-2024
                     // Added New Share Data Frontend Logic  */}
                      {!showShareButton ? (
                        <th className="attendanceheading">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedRows.length === filteredData.length
                            }
                            name="selectAll"
                          />
                        </th>
                      ) : null}
                      <th className="attendanceheading">Sr No</th>
                      <th className="attendanceheading"> Resume Upload Date</th>
                      <th className="attendanceheading">Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Gender</th>
                      <th className="attendanceheading">Date Of Birth</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Job Designation</th>
                      <th className="attendanceheading">Last Company</th>
                      <th className="attendanceheading">Relevant Experience</th>
                      <th className="attendanceheading">Education</th>
                      <th className="attendanceheading">Extra Certification</th>
                      <th className="attendanceheading">Current Location</th>
                      <th className="attendanceheading">Resume</th>

                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.candidateId} className="attendancerows">
                        {/* // Arshad Attar Added This Code On 03-12-2024
                        // Added New Share Data Frontend Logic, */}
                        {!showShareButton ? (
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
                            <span className="tooltiptext">
                              {calculateRowIndex(index)}
                            </span>
                          </div>
                        </td>

                        <td
                          style={{ paddingLeft: "3px", position: "relative" }}
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {formatToIndianTime(item.resumeUploadDate)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {formatToIndianTime(item.resumeUploadDate)}
                            </span>
                          </div>
                        </td>

                        <td
                          hidden
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateId}{" "}
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
                          {highlightText(item.gender || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(item.gender || "", searchTerm)}
                            </span>
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

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(
                            item.relevantExperience || "",
                            searchTerm
                          )}

                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.relevantExperience || "",
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
                          {highlightText(
                            item.extraCertification || "",
                            searchTerm
                          )}
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
                          {highlightText(
                            item.currentLocation || "",
                            searchTerm
                          )}

                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.currentLocation || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>

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
                          {/*// Arshad Attar Added This Code On 03-12-2024
                          // when click on icon then download word file */}
                          <i
                            className="fa-regular fa-circle-down"
                            style={{ paddingLeft: "8px", cursor: "pointer" }}
                            onClick={() =>
                              downloadResumeFileFromBytes(
                                item.resume, // Replace with the actual byte array data
                                item.candidateName,
                                "pdf" // Replace with the actual extension, e.g., "pdf" or "docx"
                              )
                            }
                          />
                        </td>

                        <td
                          className="tabledata"
                          style={{ textAlign: "center" }}
                        >
                          <i
                            onClick={() => handleUpdate(item)}
                            className="fa-regular fa-pen-to-square"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*Arshad Attar Added This Code On 03-12-2024
               Added New Share Data Frontend Logic line 1444 to 1572 */}
              {showForwardPopup && (
                <div className="custom-modal-overlay">
                  <div className="custom-modal-container">
                    <div className="custom-modal-header">
                      <h2>Share To</h2>
                      <button
                        onClick={() => setShowForwardPopup(false)}
                        title="Cancel"
                      >
                        <i id="jd-cancel-btn" className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="custom-modal-body">
                      <div className="accordion">
                        <div className="share-data-name">
                          {userType === "Recruiters" && <span>Recruiter</span>}
                          {userType === "TeamLeader" && (
                            <span>Team Leader ( Select Recruiters )</span>
                          )}
                          {userType === "Manager" && (
                            <span>
                              Manager ( Select Team Leader OR Recruiters )
                            </span>
                          )}
                          {userType === "SuperUser" && <span>Super User</span>}
                        </div>
                        <hr />
                        <div className="PI-dropdown-container">
                          <div className="PI-dropdown-content">
                            {userType === "SuperUser" && renderManagers()}
                            {userType === "Manager" &&
                              renderTeamLeaders(employeeId)}
                            {userType === "TeamLeader" &&
                              renderRecruiters(employeeId)}
                            <div style={{ display: "flex", gap: "7px" }}>
                              <button
                                onClick={handleShare}
                                className="daily-tr-btn"
                              >
                                Share
                              </button>
                              <button
                                onClick={() => setShowForwardPopup(false)}
                                className="daily-tr-btn"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
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
              </div>
            </>
          )}

          <div className="callingExcelData-update-form">
            {selectedCandidate && (
              <CallingTrackerForm
                initialData={{
                  ...selectedCandidate,
                  sourceComponent: "ResumeList",
                }}
                loginEmployeeName={loginEmployeeName}
                onsuccessfulDataAdditions={onsuccessfulDataAdditions}
              />
            )}
          </div>
        </>
      )}
        <div className="search-count-last-div">
        Search Results : {searchCount}
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
      
    </div>
  );
};

export default ResumeList;
