import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./holdCandidate.css";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { toast } from "react-toastify";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
import FilterData from "../helper/filterData";
import limitedOptions from "../helper/limitedOptions";
import convertToDocumentLink from "../helper/convertToDocumentLink";
import axios from "axios";
import {Alert, Modal as AntdModal, Badge, Empty} from "antd";
// added by sahil karnekar
import { Avatar, Card, List, Pagination } from "antd";


const HoldCandidate = ({
  updateState,
  funForGettingCandidateId,
  loginEmployeeName,
}) => {
  const [showHoldData, setShowHoldData] = useState([]);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [callingList, setCallingList] = useState([]);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [showCallingForm, setShowCallingForm] = useState(false);
  const [callingToUpdate, setCallingToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [fetchTeamleader, setFetchTeamleader] = useState([]); //akash_pawar_HoldCandidate_ShareFunctionality_16/07_30
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]); //akash_pawar_HoldCandidate_ShareFunctionality_16/07_31
  const [fetchAllManager, setFetchAllManager] = useState([]); //akash_pawar_HoldCandidate_ShareFunctionality_18/07_26
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false); // New state to track if all rows are selected
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffcb9b");
  const { employeeId, userType } = useParams();
  const newEmployeeId = parseInt(employeeId, 10);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const [isDataSending, setIsDataSending] = useState(false);
  const [errorForShare, setErrorForShare] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  // added by sahil karnekar to refresh useeffect added on date 17-12-2024
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [displayShareConfirm, setDisplayShareConfirm]= useState(false);
    const filterRef=useRef(null);

       const [isHorizontallyScrolling, setIsHorizontallyScrolling] = useState(false);
                const tableContainerRef = useRef(null);
              
                const handleScroll = () => {
                  if (!tableContainerRef.current) return;
                  setIsHorizontallyScrolling(tableContainerRef.current.scrollLeft > 0);
                };

  const fetchHoldCandidateData = async (page, size) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/hold-candidate/${employeeId}/${userType}?searchTerm=${searchTerm}&page=${page}&size=${size}`
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      setCallingList(data.content);
      setFilteredCallingList(data.content);
      setTotalRecords(data.totalElements);
      setSearchCount(data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hold candidate data:", error);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldCandidateData(currentPage, pageSize);
  }, [employeeId, currentPage, pageSize, triggerFetch]);

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
  // updated by sahil karnekar date 17-12-2024
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
  };

  // useEffect(() => {
  //   const filtered = FilterData(callingList, searchTerm);
  //   setFilteredCallingList(filtered);
  //   setSearchCount(filtered.length);
  // }, [ callingList]);

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
          return values.some(
            (value) => itemValue === value.toLowerCase() // exact match
          );
        });
      }
    });
    setFilteredCallingList(filteredData);
  };

  const handleSearchClick = (e)=>{
    e.preventDefault();
    setCurrentPage(1); 
    fetchHoldCandidateData(1, pageSize);
  }

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

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetchHoldCandidateData(currentPage, pageSize);
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

  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
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

  //akash_pawar_HoldCandidate_ShareFunctionality_18/07_408
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
  //akash_pawar_HoldCandidate_ShareFunctionality_18/07_490

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
  //Name:-Akash Pawar Component:-HoldCandidate Subcategory:-ResumeViewButton(added) End LineNo:-356 Date:-02/07

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

    XLSX.utils.book_append_sheet(wb, ws, "Hold List");
    XLSX.writeFile(wb, "Hold_list.xlsx");
  };
  const handleDisplayShareConfirmClick = ()=>{
    setDisplayShareConfirm(true);
  }
const handleCancelcloseshare = ()=>{
  setDisplayShareConfirm(false);
}
  const showPopup = () => {
    setShowExportConfirmation(true);

    document.querySelector(".App-after").classList.add("blurred");
  };

  const hidePopup = () => {
    setShowExportConfirmation(false);
    document.querySelector(".App-after").classList.remove("blurred");
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


  const [selectedRole, setSelectedRole] = useState("");
  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [displayModalContainer, setDisplayModalContainer] = useState(false);

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
      fetchHoldCandidateData(currentPage, pageSize);
      setShowForwardPopup(false);
      setShowShareButton(true);
      setSelectedRows([]);
    } catch (error) {
      setIsDataSending(false);
      console.error("Error while forwarding candidates:", error);
    }finally{
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
    <div className="App-after">
      {/* added by sahil karnekar date 17-12-2024 */}
      {!showUpdateCallingTracker && (
        <>
          <div className="search">
            {/* this line is added by sahil karnekar date 24-10-2024 */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ margin: "10px", width: "auto", fontSize: "15px" }}
              ></i>
              {/* line 711 to 720 added by sahil karnekar date 24-10-2024 */}

              <form onSubmit={(e) => handleSearchClick(e)}> 
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
                       onClick={() => {setSearchTerm("")
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
        className="search-btns lineUp-share-btn newSearchButtonMarginLeft"
    type="submit"
      >
        Search 
      </button>
      </form>
            </div>
            <h5 className="newclassnameforpageheader">Hold Candidates</h5>
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
                    <button onClick={confirmExport} className="buttoncss-ctn">
                      Yes
                    </button>
                    <button onClick={cancelExport} className="buttoncss-ctn">
                      No
                    </button>
                  </div>
                )}
              </div>
              {userType !== "Recruiters" && (
                <div>
                  {showShareButton ? (
                    <button
                      className="hold-share-btn"
                      onClick={() => setShowShareButton(false)}
                    >
                      Share
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        className="hold-share-close-btn"
                        onClick={() => {
                          setShowShareButton(true);
                          setSelectedRows([]);
                          setAllSelected(false);
                        }}
                      >
                        Close
                      </button>
                      {/* akash_pawar_HoldCandidate_ShareFunctionality_18/07_603 */}
                      {userType === "TeamLeader" && (
                        <button
                          className="lineUp-share-btn"
                          onClick={handleSelectAll}
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      )}
                      {/* akash_pawar_HoldCandidate_ShareFunctionality_18/07_611 */}
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

          {/* added by sahil karnekar date 22-10-2024 */}
          {/* {showFilterSection && (
            <div className="filter-section">
              {limitedOptions.map(([optionKey, optionLabel]) => {
                const uniqueValues = Array.from(
                  new Set(
                    callingList
                      .map((item) => item[optionKey]?.toString().toLowerCase())
                      .filter(
                        (value) =>
                          value &&
                          value !== "-" &&
                          !(optionKey === "alternateNumber" && value === "0")
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
          )} */}
          {showFilterSection && (
                  <div className="filter-section">
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
          {/* line 968 to 986 added by sahil karnekar date 17-12-2024 */}
        </>
      )}

      {loading ? (
        <div className="register">
          {/* <HashLoader
             color={`${localStorage.getItem("selectedColor")}`}
            aria-label="Loading Spinner"
            data-testid="loader"
          /> */}
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!showUpdateCallingTracker ? (
            <>
              <div className="attendanceTableData"
              onScroll={handleScroll}
              ref={tableContainerRef}
              >
                {
                  filteredCallingList.length === 0 ? (
<Empty/>
                  ):(
 <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      
                    {(!showShareButton && userType === "TeamLeader") ||
                      (!showShareButton && userType === "Manager") ? (  
                        
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

                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? 0 : "25px", zIndex: 10}}>Sr No.</th>
                      <th className="attendanceheading" style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 10}}>Candidate Id</th>

                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("date")}
                      >
                        Added Date Time
                      </th>
                      <th
                        className="attendanceheading"
                        onClick={() => handleSort("recruiterName")}
                        style={{ position: "sticky", left: showShareButton ? "140px" : "190px", zIndex: 10 }}
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
                        Working Status
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

                      {(userType === "Manager") && (
                        <th className="attendanceheading">Team Leader Id</th>
                      )}

                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((item, index) => (
                      <tr key={item.candidateId} className="attendancerows">

                          {!showShareButton && userType === "TeamLeader" ||
                             !showShareButton && userType === "Manager" ? (

                          <td className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`} style={{ position: "sticky",left:0, zIndex: 1 }}>
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
                          className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          style={{ position: "sticky", left: showShareButton ? "50px" : "75px", zIndex: 1}}
                        >
                          {highlightText(
                            item.candidateId.toString().toLowerCase() || "",
                            searchTerm
                          )}
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
                          {highlightText(item.date || "", searchTerm)} -{" "}
                          {item.candidateAddedTime || "-"}
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
                          className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          style={{ position: "sticky", left: showShareButton ? "140px" : "190px", zIndex: 1 }}
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
                              {highlightText(item.sourceName || "", searchTerm)}
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
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.feedBack || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(item.feedBack || "", searchTerm)}
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
                            {highlightText(item.empId || "", searchTerm)}
                            <div className="tooltip">
                              <span className="tooltiptext">
                                {highlightText(item.empId || "", searchTerm)}
                              </span>
                            </div>
                          </td>
                          {(userType === "Manager") && (
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                item.teamLeaderId || "",
                                searchTerm
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    item.teamLeaderId || "",
                                    searchTerm
                                  )}
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
                  )
                }
               

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

                {/* Name:-Akash Pawar Component:-HoldCandidate
          Subcategory:-ResumeModel(added) End LineNo:-1170 Date:-02/07 */}
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
                {/* Name:-Akash Pawar Component:-HoldCandidate
          Subcategory:-ResumeModel(added) End LineNo:-1199 Date:-02/07 */}
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
            </>
          ) : (
            <UpdateCallingTracker
              candidateId={selectedCandidateId}
              employeeId={employeeId}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateCallingTracker(false)}
              loginEmployeeName={loginEmployeeName}
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

export default HoldCandidate;
