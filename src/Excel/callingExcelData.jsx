import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Excel/callingExcelData.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "../api/api";
import { toast } from "react-toastify";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
import limitedOptions from "../helper/limitedOptions";
import FilterData from "../helper/filterData";
import convertToDocumentLink from "../helper/convertToDocumentLink";
import { Avatar, Badge, Card, List, Pagination } from "antd";
import {Alert, Modal as AntdModal} from "antd";

const CallingExcelList = ({
  updateState,
  funForGettingCandidateId,
  onCloseTable,
  loginEmployeeName,
  // updated by sahil karnekar
  toggleSection,
  onsuccessfulDataAdditions,
  // toggleSection,
  viewsSearchTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [callingList, setCallingList] = useState([]);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [showCallingForm, setShowCallingForm] = useState(false);
  const [callingToUpdate, setCallingToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState();
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  // Arshad Attar Added This Code On 18-11-2024
  // Added New Share Data Frontend Logic line 44 to 50
  const [showShareButton, setShowShareButton] = useState(true);
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const { employeeId, userType } = useParams();
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [socket, setSocket] = useState(null);
  const [displayShareConfirm, setDisplayShareConfirm]= useState(false);
  const filterRef=useRef(null);

  const fetchUpdatedData = (page, size) => {
    fetch(
      `${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCallingList(data.content);
        setFilteredCallingList(data.content);
        setTotalRecords(data.totalElements);
        setSearchCount(data.length);
        setLoading(false); // Set loading to false when data is successfully fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    fetchUpdatedData(currentPage, pageSize);
  }, [employeeId, userType, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    const options = Object.keys(filteredCallingList[0] || {}).filter(
      (key) => key !== "candidateId"
    );
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {}, [selectedFilters]);
  useEffect(() => {}, [filteredCallingList]);

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) => Object.keys(callingList[0] || {}).includes(key))
      .map(([key]) => key);

    setFilterOptions(options);
  }, [callingList]);

  //  filter problem solved updated by sahil karnekar date 22-10-2024 complete  handleFilterOptionClick method
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

  // useEffect(() => {
  //   if (viewsSearchTerm) {
  //     setSearchTerm(viewsSearchTerm); // Sync viewsSearchTerm to local searchTerm
  //     filterData(); // Re-trigger data filtering
  //   }
  // }, [viewsSearchTerm]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  useEffect(() => {
    const filtered = FilterData(callingList, searchTerm);
    setFilteredCallingList(filtered);
    setSearchCount(filtered.length);
  }, [searchTerm, callingList]);
  const handleDisplayShareConfirmClick = () => {
    setDisplayShareConfirm(true);
  };
  const handleCancelcloseshare = () => {
    setDisplayShareConfirm(false);
  };
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
        } else if (option === "currentCTCLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "currentCTCThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "empId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "expectedCTCLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "expectedCTCThousand") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "experienceMonth") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "experienceYear") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "oldEmployeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "availabilityForInterview") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "candidateAddedTime") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "date") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "dateOfBirth") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "incentive") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "interviewTime") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "selectYesOrNo") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
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

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handleUpdateSuccess = (page, size) => {
    fetch(
      `${API_BASE_URL}/fetch-excel-data/${employeeId}/${userType}?page=${page}&size=${size}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data.content);
        setFilteredCallingList(data.content);
        setTotalRecords(data.totalElements);
        setShowUpdateCallingTracker(false);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
    setLoading(false);
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
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
          setActiveFilterOption(null); // Close filter dropdown when clicking outside
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

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prevSelectedRows) => 
        prevSelectedRows.filter((id) => !callingList.map((item) => item.candidateId).includes(id))
      );
    } else {
      const allRowIds = callingList.map((item) => item.candidateId);
      setSelectedRows((prevSelectedRows) => [...new Set([...prevSelectedRows, ...allRowIds])]);
    }
    setAllSelected(!allSelected);
  };

     const areAllRowsSelectedOnPage = callingList.every((item) =>
          selectedRows.includes(item.candidateId)
        );
      
        useEffect(() => {
          setAllSelected(areAllRowsSelectedOnPage);
        }, [callingList, selectedRows]); 

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

  const openCallingExcelList = (candidateData) => {
    console.log("Link Come here....");
    setSelectedCandidate(candidateData);
    // updated by sahil karnekar
    toggleSection(false);
  };

  const openModal = (candidate) => {
    setShowModal(candidate);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalIsOpen(false);
    setSelectedCandidate(null);
  };

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };

  const handleMergeResumes = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/merge-resumes`);
      if (response.status === 200) {
        const formattedMessage = response.data.replace(/\n/g, "<br>");
        toast.success(
          <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />
        );

        fetchUpdatedData(currentPage, pageSize);
      } else {
        toast.error("Error merging resumes: " + response.statusText);
      }
    } catch (error) {
      console.error("Error merging resumes:", error);
      toast.error("Error merging resumes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
  };

  // Ensure validation for custom inputs
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
  const [isDataSending, setIsDataSending] = useState(false);

  const handleShare = async () => {
    if (!selectedEmployeeId || selectedRows.length === 0) {
      toast.error("Please select a recruiter and at least one candidate.");
      return;
    }

    setIsDataSending(true);
    const url = `${API_BASE_URL}/share-excel-data/${employeeId}/${userType}`;

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
      fetchUpdatedData(currentPage, pageSize);
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
            <div className="table-container">
              {/* this line462 to 485 added by sahil karnekar date 24-10-2024 */}
              <div className="search">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                    onClick={() => {
                      setShowSearchBar(!showSearchBar);
                      setShowFilterSection(false);
                    }}
                    style={{ margin: "10px", width: "auto", fontSize: "15px" }}
                  ></i>
                  {/* Arshad Comments This On 15-11-2024 */}
                  {/* {showSearchBar && ( */}
                  <div
                    className="search-input-div"
                    style={{ width: `${calculateWidth()}px` }}
                  >
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search here..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* )} */}
                </div>
                <h1 className="excel-calling-data-heading newclassnameforpageheader">Excel Data</h1>

                <div style={{ display: "flex", gap: "5px" }}>
                  {/* // Arshad Attar Added This Code On 18-11-2024
                    // Added New Share Data Frontend Logic line 1104 to 1144 */}
                      {
                    !showShareButton && (
                      <Badge
                  color="var(--notification-badge-background)"
                  count={selectedRows.length}
                  className="newBadgeselectedcandidatestyle"
                >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M222-200 80-342l56-56 85 85 170-170 56 57-225 226Zm0-320L80-662l56-56 85 85 170-170 56 57-225 226Zm298 240v-80h360v80H520Zm0-320v-80h360v80H520Z"/></svg>
                </Badge>
                    )
                  }
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
                    onClick={toggleFilterSection}
                    className="daily-tr-btn"
                  >
                    Filter <i className="fa-solid fa-filter"></i>
                  </button>
                  <button className="daily-tr-btn" onClick={handleMergeResumes}>
                    Merge Resumes
                  </button>
                </div>
              </div>

              {showFilterSection && (
                <div className="filter-section">
                  <div className="filter-dropdowns">
                  {showFilterSection && (
                  <div ref={filterRef} className="filter-section">
                    {limitedOptions.map(([optionKey, optionLabel]) => {
                      
                      const uniqueValues = Array.from(
                        new Set(
                          callingList
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
    className={`white-Btn ${
      (selectedFilters[optionKey] && selectedFilters[optionKey].length > 0) || activeFilterOption === optionKey
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
    <div className="city-filter">
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
              )}
              <div className="attendanceTableData">
                <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      {/* // Arshad Attar Added This Code On 18-11-2024
                     // Added New Share Data Frontend Logic line 1258 to 1268 */}

                      {!showShareButton ? (
                        <th className="attendanceheading" style={{ position: "sticky",left:0, zIndex: 10 }}>
                           <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              filteredCallingList.every((row) => selectedRows.includes(row.candidateId))
                            }
                            name="selectAll"
                          />
                        </th>
                      ) : null}

                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 10}}>No.</th>
                      <th className="attendanceheading">Excel Upload Date</th>
                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 10}}>Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Designation</th>
                      <th className="attendanceheading">Experience</th>
                      <th className="attendanceheading">Company Name</th>
                      <th className="attendanceheading">Notice Period</th>
                      <th className="attendanceheading">Resume</th>
                      <th className="attendanceheading">Full Data</th>
                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((item, index) => (
                      // Arshad Attar Added This Code On 18-11-2024
                      // Added New Share Data Frontend Logic line 1286 to 1297 */}
                      <tr key={item.candidateId} className="attendancerows">
                        {!showShareButton ? (
                          <td className="tabledata" style={{ position: "sticky",left:0, zIndex: 1 }}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.candidateId)}
                              onChange={() => handleSelectRow(item.candidateId)}
                            />
                          </td>
                        ) : null}
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 1 }}
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
                            item.excelFileUploadDate || "",
                            searchTerm
                          )}{" "}
                          -{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.excelFileUploadDate || "",
                                searchTerm
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
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
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.experienceYear} Years {item.experienceMonth}{" "}
                          Months{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.experienceYear} Years {item.experienceMonth}{" "}
                              Months{" "}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata "
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
                          className="tabledata "
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
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          onClick={() => openModal(item)}
                        >
                          <i className="fa-solid fa-database"></i>
                        </td>
                        <td
                          className="tabledata"
                          style={{ textAlign: "center" }}
                        >
                          <i
                            onClick={() => openCallingExcelList(item)}
                            className="fa-regular fa-pen-to-square"
                          ></i>
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
                          <AntdModal
                            title="Share Data"
                            open={displayShareConfirm}
                            onOk={handleShare}
                            onCancel={handleCancelcloseshare}
                          >
                            <Alert
                              message="Are You Sure ? You Want To Send ?"
                              type="info"
                              showIcon
                            />
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
            </div>
          )}

          {showModal && (
            <div className="popup-container">
              <div className="popup-content">
                <h2>Candidate Details</h2>

                <div className="excel-data-content-div">
                  <div className="popup-section">
                    <p>
                      <strong>Recruiter Name: </strong>
                      {showModal?.recruiterName || "-"}
                    </p>
                    <p>
                      <strong>Candidate Alternate No: </strong>
                      {showModal?.alternateNumber}
                    </p>
                    <p>
                      <strong>Source Name: </strong>
                      {showModal?.sourceName || "-"}
                    </p>
                    <p>
                      <strong>Applying Company: </strong>
                      {showModal?.requirementCompany || "-"}
                    </p>
                    <p>
                      <strong>Date of Birth: </strong>
                      {showModal?.dateOfBirth || "-"}
                    </p>
                    <p>
                      <strong>Communication Rating: </strong>
                      {showModal?.communicationRating}
                    </p>
                    <p>
                      <strong>Current Location: </strong>
                      {showModal?.currentLocation || "-"}
                    </p>
                    <p>
                      <strong>Full Address: </strong>
                      {showModal?.fullAddress || "-"}
                    </p>
                    <p>
                      <strong>Calling Feedback: </strong>
                      {showModal?.callingFeedback || "-"}
                    </p>
                    <p>
                      <strong>Incentive: </strong>
                      {showModal?.incentive || "-"}
                    </p>
                    <p>
                      <strong>Old Employee Id: </strong>
                      {showModal?.oldEmployeeId || "-"}
                    </p>
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Distance: </strong>
                      {showModal?.distance || "-"}
                    </p>
                    <p>
                      <strong>Current CTC: </strong>
                      {showModal?.currentCTCLakh || "0"} Lakh{" "}
                      {showModal?.currentCTCThousand || "0"} Thousand
                    </p>
                    <p>
                      <strong>Expected CTC: </strong>
                      {showModal?.expectedCTCLakh || "0"} Lakh{" "}
                      {showModal?.expectedCTCThousand || "0"} Thousand
                    </p>
                    <p>
                      <strong>Holding Any Offer: </strong>
                      {showModal?.holdingAnyOffer || "-"}
                    </p>
                    <p>
                      <strong>Final Status: </strong>
                      {showModal?.finalStatus || "-"}
                    </p>
                    <p>
                      <strong>Relevant Experience: </strong>
                      {showModal?.relevantExperience || "-"}
                    </p>
                    <p>
                      <strong>Gender: </strong>
                      {showModal?.gender || "-"}
                    </p>
                    <p>
                      <strong>Qualification: </strong>
                      {showModal?.qualification || "-"}
                    </p>
                    <p>
                      <strong>Year of Passing: </strong>
                      {showModal?.yearOfPassing || "-"}
                    </p>
                    <p>
                      <strong>Interview Time: </strong>
                      {showModal?.interviewTime || "-"}
                    </p>
                    <p>
                      <strong>Preferred Location: </strong>
                      {showModal?.preferredLocation || "-"}
                    </p>
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Feedback: </strong>
                      {showModal?.feedBack || "-"}
                    </p>
                    <p>
                      <strong>Offer Letter Msg: </strong>
                      {showModal?.offerLetterMsg || "-"}
                    </p>
                    <p>
                      <strong>Marital Status: </strong>
                      {showModal?.maritalStatus || "-"}
                    </p>
                    <p>
                      <strong>Pick Up and Drop: </strong>
                      {showModal?.pickUpAndDrop || "-"}
                    </p>
                    <p>
                      <strong>Message for Team Leader: </strong>
                      {showModal?.msgForTeamLeader || "-"}
                    </p>
                    <p>
                      <strong>Availability for Interview: </strong>
                      {showModal?.availabilityForInterview || "-"}
                    </p>
                  </div>

                  <div className="popup-section">
                    <p>
                      <strong>Candidate Added Date: </strong>
                      {showModal?.date || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 1: </strong>
                      {showModal?.extra1 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 2: </strong>
                      {showModal?.extra2 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 3: </strong>
                      {showModal?.extra3 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 4: </strong>
                      {showModal?.extra4 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 5: </strong>
                      {showModal?.extra5 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 6: </strong>
                      {showModal?.extra6 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 7: </strong>
                      {showModal?.extra7 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 8: </strong>
                      {showModal?.extra8 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 9: </strong>
                      {showModal?.extra9 || "-"}
                    </p>
                    <p>
                      <strong>Extra Columns 10: </strong>
                      {showModal?.extra10 || "-"}
                    </p>
                  </div>
                </div>

                <center>
                  <p>
                    <strong> Shared Status : </strong>
                    {showModal?.sharedStatus || "-"} By{" "}
                    {showModal?.oldRecruiterName || "-"} ({" "}
                    {showModal?.oldJobRole === "TeamLeader"
                      ? "Team Leader"
                      : showModal?.oldJobRole}{" "}
                    )
                  </p>
                  <button className="daily-tr-btn" onClick={closeModal}>
                    Close
                  </button>
                </center>
              </div>
            </div>
          )}

          {selectedCandidate && (
            <CallingTrackerForm
              initialData={{
                ...selectedCandidate,
                sourceComponent: "CallingExcelList",
              }}
              loginEmployeeName={loginEmployeeName}
              onClose={() => setSelectedCandidate(null)}
              onSuccess={handleUpdateSuccess}
              onsuccessfulDataAdditions={onsuccessfulDataAdditions}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CallingExcelList;
