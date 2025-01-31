import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CandidateSection/shortlistedcandidate.css";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { toast } from "react-toastify";
import { Avatar, Card, List, Pagination, Skeleton } from "antd";
import axios from "axios";
import { highlightText } from "./HighlightTextHandlerFunc";
import FilterData from "../helper/filterData";
import convertToDocumentLink from "../helper/convertToDocumentLink";
import limitedOptions from "../helper/limitedOptions";
import { getUserImageFromApiForReport } from "../Reports/getUserImageFromApiForReport";
// SwapnilRokade_ShortListedCandidates_ModifyFilters_11/07

const ShortListedCandidates = ({
  loginEmployeeName,
  toggleShortListed /*Akash_Pawar_ShortListedCandidate_toggleShortListed(show interview candidate)_23/07_LineNo_12*/,
  onsuccessfulDataUpdation,
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
  const [filteredShortListed, setFilteredShortListed] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [isDataSending, setIsDataSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [displayModalContainer, setDisplayModalContainer] = useState(false);
  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const { employeeId, userType } = useParams();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // updated by sahil karnekar date 17-12-2024
  const [triggerFetch, setTriggerFetch] = useState(false);
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
  };

  useEffect(() => {
    fetchShortListedData(currentPage, pageSize);
  }, [currentPage, pageSize, triggerFetch, searchTerm]);
  //akash_pawar_ShortlistedCandidate_ShareFunctionality_18/07_116

  const fetchShortListedData = async (page, size) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shortListed-data/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
      );
      const data = await response.json();
      setShortListedData(data.content);
      setFilteredShortListed(data.content);
      setTotalRecords(data.totalElements);
      setSearchCount(data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shortlisted data:", error);
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetchShortListedData(currentPage, pageSize);
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

  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedRows([]);
  //   } else {
  //     const allRowIds = shortListedData.map((item) => item.candidateId);
  //     setSelectedRows(allRowIds);
  //   }
  //   setAllSelected(!allSelected);
  // };

 // Pranjali Raut_handleSelectAll (20-01-25)
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all rows
      setSelectedRows((prevSelectedRows) => 
        prevSelectedRows.filter((id) => !shortListedData.map((item) => item.candidateId).includes(id))
      );
    } else {
      // Select all rows on the current page
      const allRowIds = shortListedData.map((item) => item.candidateId);
      setSelectedRows((prevSelectedRows) => [...new Set([...prevSelectedRows, ...allRowIds])]);
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

  const handleShare = async () => {
    if (!selectedEmployeeId || selectedRows.length === 0) {
      toast.error("Please select a recruiter and at least one candidate.");
      return;
    }

    setIsDataSending(true);
    const url = `${API_BASE_URL}/share-candidate-data/${employeeId}/${userType}`;

    const requestData = {
      employeeId: parseInt(selectedEmployeeId),
      candidateIds: selectedRows,
      jobRole: selectedRole, // Dynamically pass the selected role
    };

    try {
      console.log(JSON.stringify(requestData, null, 2));
      const requestOptions = {
        method: "PUT",
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
      fetchShortListedData(currentPage, pageSize);
      setShowForwardPopup(false);
      setShowShareButton(true);
      setSelectedRows([]);
    } catch (error) {
      setIsDataSending(false);
      console.error("Error while forwarding candidates:", error);
    }
  };

  const resetSelections = () => {
    setSelectedEmployeeId(null); // Clear the selected recruiter ID
    setSelectedRole(""); // Clear the selected role
  };

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
    const filtered = FilterData(shortListedData, searchTerm);
    console.log(filtered);
    
    setFilteredShortListed(filtered);
    setSearchCount(filtered.length);
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
          return values.some(
            (value) => itemValue === value.toLowerCase() // exact match
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
  console.log(selectedRows);
  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
  };

  //Name:-Akash Pawar Component:-ShortListedCandidate Subcategory:-ResumeViewButton(added) start LineNo:-165 Date:-02/07

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

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
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
   setAllImagesForRecruiters([]);
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
    );
    setRecruitersList(response.data);
    console.log(response.data);
    setDisplayRecruiters(true);
  };

  console.log(
    recruitersList
  );
  
 const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([]); // Initialize as an object
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      const images = await Promise.all(
        recruitersList.map(async (message) => {
          return await getUserImageFromApiForReport(message.employeeId, message.jobRole);
        })
      );
      setAllImagesForRecruiters(images); // Set the array of image URLs
     
    };

    fetchAllImagesForRecruiters();
  }, [recruitersList]);

  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([]); // Initialize as an object

  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      const images = await Promise.all(
        teamLeadersList.map(async (message) => {
          return await getUserImageFromApiForReport(message.teamLeaderId, message.jobRole);
        })
      );
      setAllImagesForTeamLeaders(images); // Set the array of image URLs
    };

    fetchAllImagesForTeamLeaders();
  }, [teamLeadersList]);

  console.log(allImagesForTeamLeaders);
  
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
    (() => {
      // Determine which image array to use based on title
      const images =
        title === "Recruiters"
          ? allImagesForRecruiters
          : title === "Team Leaders"
          ? allImagesForTeamLeaders
          : [];

      // Determine the image source or fallback URL
      const avatarSrc =
        images.length > 0 && images[index]
          ? images[index]
          : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;

      // Render Avatar or Skeleton based on image array length
      return images.length === 0 ? (
        <Skeleton.Avatar active />
      ) : (
        <Avatar src={avatarSrc} />
      );
    })()
  }
  title={item.employeeName || item.teamLeaderName}
/>
            {
              title !== "Recruiters"  && (
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
              )
            }      
          
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <div style={{ paddingTop: "10px" }}>
      <div className="calling-list-container">
        {loading ? (
          <div className="register">
            <Loader></Loader>
          </div>
        ) : (
          // line 651 to 1777 updated by sahil karnekar date 17-12-2024
          <>
            {!showUpdateCallingTracker && (
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
                      style={{
                        margin: "10px",
                        width: "auto",
                        fontSize: "15px",
                      }}
                    ></i>
                    {/* line 581 to 590 updated by sahil karnekar date 24-10-2024 */}

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
                              onClick={() => setSearchTerm("")}
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
                            {(userType === "TeamLeader" ||
                              userType === "Manager") && (
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
                    <button
                      className="lineUp-share-btn"
                      onClick={toggleFilterSection}
                    >
                      Filter <i className="fa-solid fa-filter"></i>
                    </button>
                  </div>
                </div>
                {showFilterSection && (
                  <div className="filter-section">
                    {limitedOptions.map(([optionKey, optionLabel]) => {
                      const uniqueValues = Array.from(
                        new Set(
                          shortListedData
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
              </>
            )}

            {!showUpdateCallingTracker ? (
              <div>
                {/* updated this filter section by sahil karnekar date 22-10-2024 */}

                <div className="attendanceTableData">
                  <table id="shortlisted-table-id" className="attendance-table">
                    <thead>
                      <tr className="attendancerows-head">
                        {(!showShareButton && userType === "TeamLeader") ||
                        (!showShareButton && userType === "Manager") ? (
                          <th className="attendanceheading">
                            
                            {/* <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                selectedRows.length === shortListedData.length
                              }
                              name="selectAll"
                            /> */}

{/* updatesd shortListeddata by Pranjali Raut data 20-01-2025 */}
<input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  shortListedData.every((row) => selectedRows.includes(row.candidateId))
                                }
                                name="selectAll"
                              />
                          </th>
                        ) : null}
                        <th className="attendanceheading">Sr No.</th>

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
                        <th className="attendanceheading">
                          Communication Rating
                        </th>
                        <th className="attendanceheading">Current Location</th>
                        <th className="attendanceheading">Full Address</th>
                        <th className="attendanceheading">Calling Remark</th>
                        <th className="attendanceheading">
                          Recruiter's Incentive
                        </th>
                        <th className="attendanceheading">Interested or Not</th>
                        <th className="attendanceheading">Current Company</th>
                        <th className="attendanceheading">Total Experience</th>
                        <th className="attendanceheading">
                          Relevant Experience
                        </th>
                        <th className="attendanceheading">Current CTC</th>
                        <th className="attendanceheading">Expected CTC</th>
                        <th className="attendanceheading">Date Of Birth - </th>
                        <th className="attendanceheading">Gender</th>
                        <th className="attendanceheading">Education</th>
                        <th className="attendanceheading">Year Of Passing</th>
                        <th className="attendanceheading">
                          Extra Certification
                        </th>
                        {/* call summary */}
                        {/* <th className="attendanceheading">Feedback</th> */}
                        <th className="attendanceheading">Holding Any Offer</th>
                        <th className="attendanceheading">
                          Offer Letter Message
                        </th>
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

                        <th className="attendanceheading">Interview Date</th>
                        <th className="attendanceheading">Interview Time</th>
                        <th className="attendanceheading">Final Status</th>
                        <th className="attendanceheading">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShortListed.map((item, index) => (
                        <tr key={item.candidateId} className="attendancerows">
                          {(!showShareButton && userType === "TeamLeader") ||
                          (!showShareButton && userType === "Manager") ? (
                            <td className="tabledata">
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(
                                  item.candidateId
                                )}
                                onChange={() =>
                                  handleSelectRow(item.candidateId)
                                }
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
                            {highlightText(
                              item.candidateId.toString().toLowerCase() || "",
                              searchTerm
                            )}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(
                                  item.candidateId.toString().toLowerCase() ||
                                    "",
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
                            {highlightText(item.date || "", searchTerm)} -{" "}
                            {item.candidateAddedTime}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(
                                  item.date.toString().toLowerCase() || "",
                                  searchTerm
                                )}{" "}
                                - {item.candidateAddedTime}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(
                              item.recruiterName || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.candidateName || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.candidateEmail || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.contactNumber || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.alternateNumber || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.jobDesignation || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.requirementId || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.requirementCompany || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.communicationRating || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.callingFeedback || "",
                              searchTerm
                            )}
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
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(
                              item.incentive.toString().toLowerCase() || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.selectYesOrNo || "",
                              searchTerm
                            )}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(
                                  item.selectYesOrNo || "",
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
                            {item.experienceYear} Year {item.experienceMonth}{" "}
                            Month
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {item.experienceYear} Year{" "}
                                {item.experienceMonth} Month{" "}
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
                                {highlightText(item.gender || "", searchTerm)}
                              </span>
                            </div>
                          </td>

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(
                              item.qualification || "",
                              searchTerm
                            )}
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
                              item.yearOfPassing || "",
                              searchTerm
                            )}
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
                          {/* <td className="tabledata">{item.feedback}</td> */}
                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(
                              item.holdingAnyOffer || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.offerLetterMsg || "",
                              searchTerm
                            )}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(
                                  item.offerLetterMsg || "",
                                  searchTerm
                                )}
                              </span>
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

                          {userType === "TeamLeader" && (
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                item.msgForTeamLeader || "",
                                searchTerm
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    item.msgForTeamLeader || "",
                                    searchTerm
                                  )}
                                </span>
                              </div>
                            </td>
                          )}

                          {userType === "Recruiters" && (
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                item.msgForTeamLeader || "",
                                searchTerm
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    item.msgForTeamLeader || "",
                                    searchTerm
                                  )}
                                </span>
                              </div>
                            </td>
                          )}

                          <td
                            className="tabledata"
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                          >
                            {highlightText(
                              item.availabilityForInterview || "",
                              searchTerm
                            )}
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
                            {highlightText(
                              item.interviewTime || "",
                              searchTerm
                            )}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(
                                  item.interviewTime || "",
                                  searchTerm
                                )}
                              </span>
                            </div>
                          </td>
                          {/* <td className="tabledata">{item.finalStatus}</td> */}

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
                          <td className="tabledata">
                            <button className="table-icon-div">
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
                            <button
                              onClick={handleShare}
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

                {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeModel(added) End LineNo:-656 Date:-02/07 */}
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
                triggerFetch={handleTriggerFetch}
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
    </div>
  );
};

export default ShortListedCandidates;
