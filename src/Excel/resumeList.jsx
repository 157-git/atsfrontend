import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
import FilterData from "../helper/filterData";
import convertToDocumentLink from "../helper/convertToDocumentLink";
import { Avatar, Badge, Card, List, Pagination } from "antd";
import { Alert, Modal as AntdModal } from "antd";
{
  /* this line added by sahil date 22-10-2024 */
}
const ResumeList = ({
  loginEmployeeName,
  onsuccessfulDataAdditions,
  viewsSearchTerm,
  dataFromUploadResumes,
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
  console.log(dataFromUploadResumes);

  // Arshad Attar Added This Code On 03-12-2024
  // Added New Share Data Frontend Logic
  const [showShareButton, setShowShareButton] = useState(true);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [fetchAllManager, setFetchAllManager] = useState([]);
  const [fetchTeamleader, setFetchTeamleader] = useState([]);
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]);
  const [isDataSending, setIsDataSending] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [socket, setSocket] = useState(null);
  const [searchCount, setSearchCount] = useState(0);
  const [displayShareConfirm, setDisplayShareConfirm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const filterRef = useRef(null);
  const [isHorizontallyScrolling, setIsHorizontallyScrolling] = useState(false);
  const tableContainerRef = useRef(null);

  const handleScroll = () => {
    if (!tableContainerRef.current) return;
    setIsHorizontallyScrolling(tableContainerRef.current.scrollLeft > 0);
  };


  const fetchData = async (page, size) => {
    try {

      if (dataFromUploadResumes?.length > 0) {
        console.log("running");

        setData(dataFromUploadResumes);
        setFilteredData(dataFromUploadResumes);
        setTotalRecords(dataFromUploadResumes.length);
      } else {
        console.log("running Api");
        const response = await fetch(
          `${API_BASE_URL}/fetch-resumes-data/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.content);
        setFilteredData(result.content);
        setTotalRecords(result.totalElements);
        setSearchCount(result.length);
        console.log(filteredData);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [employeeId, currentPage, pageSize, triggerFetch, dataFromUploadResumes]);


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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest(".filter-option button") // Prevent closing when clicking inside the button
      ) {
        setActiveFilterOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
      "Working Status",
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
        "Working Status": item.extraCertification || "-",
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
  const handleDisplayShareConfirmClick = () => {
    setDisplayShareConfirm(true);
  }
  const handleCancelcloseshare = () => {
    setDisplayShareConfirm(false);
  }
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
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
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
    let filteredResults = (dataFromUploadResumes?.length > 0 ? dataFromUploadResumes : data).filter((item) => {
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
  }, [data, selectedFilters]);

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
  const handleSearchClick = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
    fetchData(1, pageSize);
  }


  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => !data.map((item) => item.candidateId).includes(id))
      );
    } else {
      const allRowIds = data.map((item) => item.candidateId);
      setSelectedRows((prevSelectedRows) => [...new Set([...prevSelectedRows, ...allRowIds])]);
    }
    setAllSelected(!allSelected);
  };

  const areAllRowsSelectedOnPage = data.every((item) =>
    selectedRows.includes(item.candidateId)
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
      const response = await axios.get(
        `${API_BASE_URL}/uploaded-resume-count`,
        {
          params: {
            employeeId: employeeId,
            jobRole: userType,
            dateRange: range,
          },
        }
      );
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



  const [selectedRole, setSelectedRole] = useState("");
  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [displayModalContainer, setDisplayModalContainer] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

const handleImportToCallingTracker = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/checkData/${employeeId}/${userType}`);

    if (response.status === 200) {
      toast.success("Data imported to calling tracker successfully!");

      // Ensure response.data is always treated as an array
      const importedData = Array.isArray(response.data)
        ? response.data
        : response.data.content || [];

      setData(importedData);
      setFilteredData(importedData);
      console.log("Imported Data:", importedData);
    } else {
      toast.error("Failed to import data");
    }
  } catch (error) {
    console.error("Error importing data:", error);
    toast.error("Something went wrong while importing data");
  }
};



  const handleShare = async () => {
    if (!selectedEmployeeId || selectedRows.length === 0) {
      toast.error("Please select a recruiter and at least one candidate.");
      return;
    }

    setIsDataSending(true);
    const url = `${API_BASE_URL}/share-resume-data/${employeeId}/${userType}`;

    const requestData = {
      employeeId: parseInt(selectedEmployeeId),
      candidateIds: selectedRows,
      jobRole: selectedRole, // Dynamically pass the selected role
    };

    try {
      console.log(JSON.stringify(requestData, null, 2));
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        setIsDataSending(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsDataSending(false);
      toast.success("Candidates forwarded successfully!");
      console.log("Candidates forwarded successfully!");
      resetSelections();
      fetchData(currentPage, pageSize);
      setShowForwardPopup(false);
      setShowShareButton(true);
      setSelectedRows([]);
    } catch (error) {
      setIsDataSending(false);
      console.error("Error while forwarding candidates:", error);
    } finally {
      setDisplayShareConfirm(false);
    }
  };

  const resetSelections = () => {
    setSelectedEmployeeId(null); // Clear the selected recruiter ID
    setSelectedRole(""); // Clear the selected role
  };

  useEffect(() => {
    handleDisplayManagers();
  }, []);

  const handleDisplayManagers = async () => {
    if (userType === "SuperUser") {
      const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
      setManagersList(response.data);
      setDisplayManagers(true);
    } else if (userType === "Manager") {
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${employeeId}`
      );
      setTeamLeadersList(response.data);
      setDisplayTeamLeaders(true);
    } else if (userType === "TeamLeader") {
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${employeeId}`
      );
      setRecruitersList(response.data);
      setDisplayRecruiters(true);
    }
    setDisplayModalContainer(true);
  };

  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId) => {
    setSelectedIds([]);
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
    );
    setRecruitersList(response.data);
    setDisplayRecruiters(true);
  };
  const handleClearAll = () => {
    setSelectedFilters({});
  };
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0;
  };
  const renderCard = (title, list) => (
    <Card
      hoverable
      style={{
        width: 380,
        height: 580,
        overflowY: "scroll",
      }}
      title={title}
    >
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item, index) => (
          <List.Item>
            <input
              style={{ width: "18px", height: "18px" }}
              type="radio"
              className="share-data-input-card"
              checked={
                selectedEmployeeId === (item.employeeId || item.teamLeaderId)
              }
              onChange={() => {
                setSelectedRole(
                  title === "Recruiters" ? "Recruiters" : "TeamLeader"
                );
                setSelectedEmployeeId(item.employeeId || item.teamLeaderId);
              }}
            />
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.profileImage
                      ? item.profileImage
                      : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                  }
                />
              }
              title={item.employeeName || item.teamLeaderName}
            />
            <svg
              onClick={() =>
                handleOpenDownArrowContentForRecruiters(
                  item.employeeId || item.teamLeaderId
                )
              }
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </List.Item>
        )}
      />
    </Card>
  );


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
                    <form onSubmit={(e) => handleSearchClick(e)} style={{
                      display: "flex"
                    }}>
                      <div
                        className="search-input-div"
                        style={{ width: `${calculateWidth()}px`, display: "flex" }}
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
                          style={{
                            border: "none"
                          }}
                        />
                        {searchTerm && (
                          // <div className="svgimagesetinInput">
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
                            style={{
                              margin: "2px"
                            }}
                          >
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                          </svg>
                          // </div>
                        )}
                      </div>
                      {
                        !dataFromUploadResumes && (
                          <button
                            className="search-btns lineUp-share-btn newSearchButtonMarginLeft"
                            type="submit"
                          >
                            Search
                          </button>
                        )
                      }

                    </form>
                  </div>
                  <h1 className="resume-data-heading newclassnameforpageheader">Resume Data </h1>
                  

                  {/* // Arshad Attar Added This Code On 03-12-2024
                  // Added New Share Data Frontend Logic line */}
                  <div className="rl-btn-div">
                    <button
                    className="lineUp-share-btn"
                    style={{marginLeft:"8px", marginRight:"8px" }}
                    onClick={handleImportToCallingTracker}
                    >Import</button>
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
                            {
                              !showShareButton && (
                                <Badge
                                  color="var(--notification-badge-background)"
                                  count={selectedRows.length}
                                  className="newBadgeselectedcandidatestyle"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M222-200 80-342l56-56 85 85 170-170 56 57-225 226Zm0-320L80-662l56-56 85 85 170-170 56 57-225 226Zm298 240v-80h360v80H520Zm0-320v-80h360v80H520Z" /></svg>
                                </Badge>
                              )
                            }
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
                    <div className="filter-section">
                      {limitedOptions.map(([optionKey, optionLabel]) => {

                        const uniqueValues = Array.from(
                          new Set(
                            data
                              .map((item) =>
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
                          <div>
                            {/* Rajlaxmi jagadle  Added countSelectedValues that code date 20-02-2025 line 987/1003 */}
                            <div key={optionKey} className="filter-option">
                              <button
                                className={`white-Btn ${(selectedFilters[optionKey] && selectedFilters[optionKey].length > 0) || activeFilterOption === optionKey
                                    ? "selected glow"
                                    : ""
                                  }`}
                                onClick={() => handleFilterOptionClick(optionKey)}
                              >
                                {optionLabel}
                                {selectedFilters[optionKey]?.length > 0 && (
                                  <span className="selected-count">
                                    ({countSelectedValues(optionKey)})
                                  </span>
                                )}
                                <span className="filter-icon">&#x25bc;</span>
                              </button>
                              {/* rajlaxmi Jagadle Changes That code date 20-02-2025 line 1003/1027 */}

                              {activeFilterOption === optionKey && (
                                <div ref={filterRef} className="city-filter">
                                  <div className="optionDiv">
                                    {uniqueValues.length > 0 ? (
                                      uniqueValues.map((value) => (
                                        <label key={value} className="selfcalling-filter-value">
                                          <input
                                            type="checkbox"
                                            checked={selectedFilters[optionKey]?.includes(value) || false}
                                            onChange={() => handleFilterSelect(optionKey, value)}
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


                          </div>
                        );
                      })}

                      <button className="clr-button lineUp-Filter-btn" onClick={handleClearAll}>Clear Filters</button>

                    </div>

                  )}
                </div>
              </div>

              <div className="attendanceTableData"
                onScroll={handleScroll}
                ref={tableContainerRef}
              >
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
                        <th className="attendanceheading" style={{ position: "sticky", left: 0, zIndex: 10 }}>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              filteredData.every((row) => selectedRows.includes(row.candidateId))
                            }
                            name="selectAll"
                          />
                        </th>
                      ) : null}
                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 10 }}>Sr No.</th>
                      <th className="attendanceheading"> Resume Upload Date</th>
                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 10 }}>Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Gender</th>
                      <th className="attendanceheading">Date Of Birth</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Job Designation</th>
                      <th className="attendanceheading">Last Company</th>
                      <th className="attendanceheading">Relevant Experience</th>
                      <th className="attendanceheading">Education</th>
                      <th className="attendanceheading">Working Status</th>
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
                          <td className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`} style={{ position: "sticky", left: 0, zIndex: 1 }}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.candidateId)}
                              onChange={() => handleSelectRow(item.candidateId)}
                            />
                          </td>
                        ) : null}

                        <td
                          className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 1, }}
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
                          className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 1 }}
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
                                color: item.resume
                                  ? "var(--active-icon)"
                                  : "inherit",
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

              <div className="search-count-last-div">
                Total Results : {dataFromUploadResumes?.length > 0 ? dataFromUploadResumes.length : totalRecords}
              </div>

              {
                !dataFromUploadResumes && (
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
                )
              }


              {/*Arshad Attar Added This Code On 20-01-205*/}
              {showForwardPopup ? (
                <>
                  <div className="custom-modal-overlay">
                    <div className="custom-modal-container">
                      <div className="custom-modal-dialog">
                        <div className="custom-modal-header">Forward To</div>
                        <div className="custom-modal-body">
                          <div className="custom-accordion">
                            {userType === "TeamLeader" && (
                              <div className="custom-main-list">
                                {displayRecruiters &&
                                  renderCard("Recruiters", recruitersList)}
                              </div>
                            )}

                            {userType === "Manager" && (
                              <div className="custom-main-list">
                                {displayTeamLeaders &&
                                  renderCard("Team Leaders", teamLeadersList)}
                                {displayRecruiters &&
                                  renderCard("Recruiters", recruitersList)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="custom-modal-footer">
                          <AntdModal title="Share Data" open={displayShareConfirm} onOk={handleShare} onCancel={handleCancelcloseshare}>
                            <Alert message="Are You Sure ? You Want To Send ?" type="info" showIcon />
                          </AntdModal>
                          <button
                            onClick={handleDisplayShareConfirmClick}
                            className="daily-tr-btn"
                          >
                            Share
                          </button>
                          <button
                            onClick={() => {
                              setShowForwardPopup(false);
                              resetSelections();
                            }}
                            className="daily-tr-btn"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}


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
    </div>
  );
};

export default ResumeList;
