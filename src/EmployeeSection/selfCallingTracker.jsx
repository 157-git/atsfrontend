import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../EmployeeSection/callingList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateCallingTracker from "./UpdateSelfCalling";
import Modal from "react-bootstrap/Modal";
import HashLoader from "react-spinners/HashLoader";
import * as XLSX from "xlsx";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";

const CallingList = ({
  updateState,
  funForGettingCandidateId,
  onSuccessAdd,
  loginEmployeeName,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  let [color, setColor] = useState("#ffcb9b");
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [callingList, setCallingList] = useState([]);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [showselectedFilters, setShowselectedFilters] = useState(false);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [showCallingForm, setShowCallingForm] = useState(false);
  const [callingToUpdate, setCallingToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const [selectedCandidateId, setSelectedCandidateId] = useState();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_selfCallingTracker_ShareFunctionality_16/07_32
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_selfCallingTracker_ShareFunctionality_16/07_33
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_34
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);

  const [showExportConfirmation, setShowExportConfirmation] = useState(false);

  const [isDataSending, setIsDataSending] = useState(false);

  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_41
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
  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_64

  const { employeeId } = useParams();
  const { userType } = useParams();
  const employeeIdw = parseInt(employeeId);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);

  const navigator = useNavigate();
  // SwapnilRokade_SelfCallingTracker_ModifyFilters_47to534_11/07
  // SwapnilRokade_SelfCallingTracker_Adding date and jobDescription filter option_18/07
  // SwapnilROkade_AddingErrorAndSuccessMessage_19/07
  const limitedOptions = [
    "date",
    "candidateId",
    "recruiterName",
    "candidateName",
    "candidateEmail",
    "contactNumber",
    "alternateNumber",
    "sourceName",
    "jobDesignation",
    "jobId",
    "applyingCompany",
    "communicationRating",
    "currentLocation",
    "callingFeedback",
    "selectYesOrNo",
  ];

  //akash_pawar_selfCallingTracker_ShareFunctionality_16/07_85
  const fetchCallingTrackerData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/callingData/${employeeId}/${userType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setCallingList(data);
      setFilteredCallingList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state or show an alert
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCallingTrackerData();
  }, [employeeId,showUpdateCallingTracker]);

  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_112
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
  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_123

  // akash_pawar_selfCallingTracker_ShareFunctionality_16/07_135
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
  // akash_pawar_selfCallingTracker_ShareFunctionality_16/07_140

  // SwapnilRokade_SelfCallingTracker_ModifyFilters_168to534_11/07
  useEffect(() => {
    const options = Object.keys(filteredCallingList[0] || {}).filter((key) =>
      limitedOptions.includes(key)
    );
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

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

  const filterData = () => {
    let filteredData = [...callingList];
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
    setFilteredCallingList(filteredData);
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

  const handleFilterOptionClick = (option) => {
    if (activeFilterOption === option) {
      setActiveFilterOption(null);
    } else {
      setActiveFilterOption(option);
    }
  };

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const handleUpdate = (candidateId) => {
    setSelectedCandidateId(candidateId); // Set candidateId for UpdateCallingTracker
    setShowUpdateCallingTracker(true); // Show UpdateCallingTracker
  };

  const handleUpdateSuccess = () => {
    fetch(
      `${API_BASE_URL}/callingData/${employeeId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data);
        setFilteredCallingList(data);
        setShowUpdateCallingTracker(false);
      })
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

  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
  };
  const toggleselectedFilters = () => {
    setShowselectedFilters(!showselectedFilters);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = callingList.map((item) => item.candidateId);
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

  //akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_422
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
  //akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_422

  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_435
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
      setIsDataSending(false);
      setShowForwardPopup(false);
      toast.error("Error while forwarding candidates:", error); //Swapnil Error&success message
      // Handle error scenarios or show error messages to the user
    }
  };
  //akash_pawar_selfCallingTracker_ShareFunctionality_17/07_505

  // neha
  // selfcalling tracker form and employee master sheet
  // After share btn click ->close ,select-all, and forword btn
  // 01/07/2024

  //Swapnil_Rokade_SelfCallingTracker_columnsToInclude_columnsToExclude_17/07/2024//
  const handleExportToExcel = () => {
    // Define columns to include in export
    const columnsToInclude = [
      "No.",
      "Date & Time",
      "Candidate's Id",
      "Recruiter's Name",
      "Candidate's Name",
      "Candidate's Email",
      "Contact Number",
      "Whatsapp Number",
      "Source Name",
      "Designation",
      "Job Id",
      "Applying Company",
      "Communication Rating",
      "Current Location",
      "Full Address",
      "Calling Remark",
      "Recruiter's Incentive",
      "Interested or Not",
    ];

    // Clone the data and map to match columnsToInclude order
    const dataToExport = filteredCallingList.map((item, index) => {
      // Create a filtered item without the 'Resume' field
      const filteredItem = {
        "No.": index + 1,
        "Date & Time": `${item.date} ${item.candidateAddedTime}` || "-",
        "Candidate's Id": item.candidateId || "-",
        "Recruiter's Name": item.recruiterName || "-",
        "Candidate's Name": item.candidateName || "-",
        "Candidate's Email": item.candidateEmail || "-",
        "Contact Number": item.contactNumber || "-",
        "Whatsapp Number": item.alternateNumber || "-",
        "Source Name": item.sourceName || "-",
        Designation: item.jobDesignation || "-",
        "Job Id": item.requirementId || "-",
        "Applying Company": item.requirementCompany || "-",
        "Communication Rating": item.communicationRating || "-",
        "Current Location": item.currentLocation || "-",
        "Full Address": item.fullAddress || "-",
        "Calling Remark": item.callingFeedback || "-",
        "Recruiter's Incentive": item.incentive || "-",
        "Interested or Not": item.selectYesOrNo || "-",
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
    XLSX.utils.book_append_sheet(wb, ws, "Calling List");
    XLSX.writeFile(wb, "calling_list.xlsx");
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
  //Swapnil_Rokade_SelfCallingTracker_columnsToInclude_columnsToExclude_17/07/2024//

  return (
    <div className="calling-list-container">
      {loading ? (
        <div className="register">
          <HashLoader
            color={`${localStorage.getItem("bgColor")}`}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {!showUpdateCallingTracker && !showCallingForm && (
            <>
              <div className="search">
                <i
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => {
                    setShowSearchBar(!showSearchBar);
                    setShowFilterSection(false);
                  }}
                  style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                ></i>
                <h5 style={{ color: "gray", paddingTop: "5px" }}>
                  Calling Tracker
                </h5>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  {/* Swapnil_Rokade_SelfCallingTracker_CreateExcel_17/07/2024 */}
                  <div>
                    <button className="lineUp-share-btn" onClick={showPopup}>
                      Create Excel
                    </button>

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
                          className="callingList-share-btn"
                          onClick={() => setShowShareButton(false)}
                        >
                          Share
                        </button>
                      ) : (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            className="callingList-share-btn"
                            onClick={() => {
                              setShowShareButton(true);
                              setSelectedRows([]);
                              setAllSelected(false);
                            }}
                          >
                            Close
                          </button>
                          {/* akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_570 */}
                          {userType === "TeamLeader" && (
                            <button
                              className="callingList-share-btn"
                              onClick={handleSelectAll}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          )}
                          {/* akash_pawar_SelfCallingTracker_ShareFunctionality_17/07_578 */}
                          <button
                            className="callingList-share-btn"
                            onClick={forwardSelectedCandidate}
                          >
                            Forward
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    className="callingList-share-btn"
                    onClick={toggleFilterSection}
                  >
                    Filter <i className="fa-solid fa-filter"></i>
                  </button>
                </div>
              </div>

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
                  <div className="filter-options-container">
                    {filterOptions.map((option) => {
                      const uniqueValues = Array.from(
                        new Set(callingList.map((item) => item[option]))
                      );
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

              <div className="attendanceTableData">
                <table className="selfcalling-table attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      {!showShareButton && userType === "TeamLeader" ? (
                        <th className="attendanceheading">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === callingList.length}
                            name="selectAll"
                          />
                        </th>
                      ) : null}
                      <th className="attendanceheading">No.</th>
                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("date")}
                      >
                        Date & Time {getSortIcon("date")}
                      </th>
                      <th className="attendanceheading">Candidate's Id</th>

                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("recruiterName")}
                      >
                        Recruiter's Name {getSortIcon("recruiterName")}
                      </th>
                      <th className="attendanceheading">Candidate's Name</th>
                      <th className="attendanceheading">Candidate's Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Whatsapp Number</th>
                      <th hidden className="attendanceheading">
                        Source Name
                      </th>

                      <th className="attendanceheading">Job Designation</th>
                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("requirementId")}
                      >
                        Job Id {getSortIcon("requirementId")}
                      </th>
                      <th className="attendanceheading">Applying Company</th>
                      <th className="attendanceheading">
                        Communication Rating
                      </th>
                      <th className="attendanceheading">Current Location</th>
                      <th className="attendanceheading">Full Address</th>
                      <th className="attendanceheading">Calling Remark</th>
                      <th className="attendanceheading">
                        Recruiter's Incentive
                      </th>
                      <th className="attendanceheading">
                        Interested and Eligible
                      </th>
                      <th className="attendanceheading">Employee Id</th>
                      {userType === 'TeamLeader' && (
                        <th  className="attendanceheading">Team Leader Id</th>
                      )}
                      {userType === 'Manager' && (
                        <>
                          <th  className="attendanceheading">Team Leader ID</th>
                          <th  className="attendanceheading">Manager ID</th>
                        </>
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
                          {" "}
                          {index + 1}
                        </td>

                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {" "}
                          {item.date}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.date}</span>
                          </div>
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {" "}
                              {item.candidateAddedTime}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateId}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateId}{" "}
                            </span>
                          </div>
                        </td>


                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.recruiterName}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.recruiterName}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateName}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateName}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.candidateEmail}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.candidateEmail}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.contactNumber}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.contactNumber}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.alternateNumber}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.alternateNumber}
                            </span>
                          </div>
                        </td>
                        <td
                          hidden
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.sourceName}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.sourceName}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.jobDesignation}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.jobDesignation}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.requirementId}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {" "}
                              {item.requirementId}{" "}
                            </span>
                          </div>{" "}
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.requirementCompany}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.requirementCompany}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.communicationRating}{" "}
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
                          {item.currentLocation}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.currentLocation}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.fullAddress}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.fullAddress}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.callingFeedback}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.callingFeedback}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.incentive}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.incentive}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.selectYesOrNo}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.selectYesOrNo}{" "}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.empId}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.empId}{" "}
                            </span>
                          </div>
                        </td>

                        {userType === 'TeamLeader' && (
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

                        {userType === 'Manager' && (
                          <>
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
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {item.managerId}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {item.managerId}
                                </span>
                              </div>
                            </td>
                          </>
                        )}

                        <td className="tabledata">
                          <i
                            onClick={() =>
                              handleUpdate(
                                item.candidateId,
                                item.employeeId,
                                item.userType
                              )
                            }
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
                          // marginTop: "50px",
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
                          {/* akash_pawar_selfCallingTracker_ShareFunctionality_17/07_993 */}
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
                          {/* akash_pawar_selfCallingTracker_ShareFunctionality_17/07_1218 */}
                        </Modal.Body>
                        <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
                          <button
                            onClick={handleShare}
                            className="callingList-share-forward-popup-btn"
                          >
                            Share
                          </button>
                          <button
                            onClick={() => setShowForwardPopup(false)}
                            className="callingList-close-forward-popup-btn"
                          >
                            Close
                          </button>
                        </Modal.Footer>
                      </Modal.Dialog>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}

          {showUpdateCallingTracker && (
            <UpdateCallingTracker
              candidateId={selectedCandidateId}
              employeeId={employeeId}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateCallingTracker(false)}
            />
          )}
        </>
      )}
      {isDataSending && (
        <div className="ShareFunc_Loading_Animation">
          <ClipLoader size={50} color="#ffb281" />
        </div>
      )}
    </div>
  );
};

export default CallingList;
