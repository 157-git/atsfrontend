import React, { useEffect, useRef, useState } from "react";
import "./UpdateResponse.css";
import { Button, Modal } from "react-bootstrap";
import UpdateResponseFrom from "./UpdateResponseFrom";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
import { Pagination } from "antd";
import { set } from "date-fns";
import {Modal as AntdModal} from "antd";
import limitedOptions from "../helper/limitedOptions";

const UpdateResponse = ({ onSuccessAdd, date }) => {
  const [updateResponseList, setUpdateResponseList] = useState([]);
  const [showUpdateResponseForm, setShowUpdateResponseForm] = useState(false);
  const [showUpdateResponseID, setShowUpdateResponseID] = useState();
  const [showEmployeeId, setShowEmployeeId] = useState();
  const [showRequirementId, setShowRequirementId] = useState();
  const [showCandidateName, setShowCandidateName] = useState();
  const [showEmployeeName, setShowEmployeeName] = useState();
  const [showSearch, setShowSearch] = useState(false);
  let [color, setColor] = useState("#ffcb9b");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [callingList, setCallingList] = useState([]);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [formClosed, setFormClosed] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [showJobRole, setShowJobRole] = useState();
  const filterRef=useRef(null);
    const [triggerFetch, setTriggerFetch] = useState(false);

        const [isHorizontallyScrolling, setIsHorizontallyScrolling] = useState(false);
       const tableContainerRef = useRef(null);
     
       const handleScroll = () => {
         if (!tableContainerRef.current) return;
         setIsHorizontallyScrolling(tableContainerRef.current.scrollLeft > 0);
       };


  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredCallingList[0] || {}).includes(key)
      )
      .map(([key]) => key);

    setFilterOptions(options);
  }, [filteredCallingList]);

  const { userType } = useParams();
  const { employeeId } = useParams();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    fetchUpdateResponseList(currentPage, pageSize);
    setFormClosed(false);
  }, [formClosed, currentPage, pageSize, triggerFetch]);

  useEffect(() => {
    applyFilters();
  }, [filterType, callingList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  const fetchUpdateResponseList = async (page, size) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/update-response-data/${employeeId}/${userType}?searchTerm=${filterValue}&page=${page}&size=${size}`
      );
      const data = await res.json();
      setCallingList(data.content);
      setFilteredCallingList(data.content);
      setUpdateResponseList(data.content);
      setSearchCount(data.length);
      setTotalRecords(data.totalElements);
      setFormClosed(false);
      // setLoading(false);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching shortlisted data:", err);
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };
  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
  };

  const applyFilters = () => {
    const lowerSearchTerm = filterValue.toLowerCase();
    let filteredResults = updateResponseList.filter((item) => {
      return (
        item.candidateName?.toLowerCase().includes(lowerSearchTerm) ||
        item.candidateEmail?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobDesignation?.toLowerCase().includes(lowerSearchTerm) ||
        // this is not found in data but it is not affecting other code so keep this for future purpose added by sahil karnekar date 25-11-2024
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
        item.candidateId?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.commentForTL?.toLowerCase().includes(lowerSearchTerm) ||
        item.sourceName?.toLowerCase().includes(lowerSearchTerm) ||
        item.requirementId
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.requirementCompany
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.finalStatus?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.interviewRound
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.interviewResponse
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.nextInterviewDate
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.nextInterviewTiming
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.employeeId?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.employeeName?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.officialMail?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.jobRole?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.resumeUploadDate?.toLowerCase().includes(lowerSearchTerm)
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

    setFilteredCallingList(filteredResults);
    setSearchCount(filteredResults.length);
  };
  const handleSearchClick = (e)=>{
    e.preventDefault();
    fetchUpdateResponseList(currentPage, pageSize);
  }
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();

        if (fileType === "pdf" || fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type:
              fileType === "pdf"
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

  console.log(filteredCallingList);

  const handleUpdateClick = (
    candidateId,
    employeeId,
    requirementId,
    candidateName,
    employeeName,
    jobRole
  ) => {
    console.log(candidateId + "candidateId ");
    console.log(employeeId + " Employee Id");
    console.log(requirementId + "Requirement Id");
    console.log(candidateName + "Candidate Name");
    console.log(employeeName + "Employee Name");
    console.log(jobRole + "jobRole ");

    setShowUpdateResponseID(candidateId);
    setShowEmployeeId(employeeId);
    setShowRequirementId(requirementId);
    setShowCandidateName(candidateName);
    setShowEmployeeName(employeeName);
    setShowJobRole(jobRole);
    setShowUpdateResponseForm(true);
  };

  const closeUpdateForm = () => {
    setShowUpdateResponseID(null);
    setShowEmployeeId(null);
    setShowRequirementId(null);
    setShowUpdateResponseForm(false);
    setFormClosed(true);
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
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0;
  };
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

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + filterValue.length * increment, maxWidth);
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
    <>
      <div className="calling-list-container">
        <div className="TeamLead-main">
          {loading ? (
            <div className="register">
              <Loader></Loader>
            </div>
          ) : (
            <>
              {!showUpdateResponseForm ? (
                <>
                  <div className="TeamLead-main-filter-section">
                    <div className="TeamLead-main-filter-section-header">
                      <div style={{ display: "flex" }}>
                        <div className="search"  style={{
                            paddingTop:"0"
                          }}>
                          <i className="fa-solid fa-magnifying-glass"></i>
                        </div>

                        <div
                          className="TeamLead-main-filter-section-container"
                          style={{ width: "80%" }}
                        >
                          <form onSubmit={(e) => handleSearchClick(e)}
                            style={{
                              display:"flex"
                            }}
                            > 
                          <div
                            className="search-input-div"
                            style={{ width: `${calculateWidth()}px` }}
                          >
                            <div className="forxmarkdiv">
                              <input
                                type="text"
                                className="search-input removeBorderForSearchInput"
                                placeholder="Search here..."
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                              />
                              {filterValue && (
                                <div className="svgimagesetinInput">
                                  <svg
                                     onClick={() => {setFilterValue("")
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
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "90%",
                          paddingLeft: "180px",
                        }}
                      >
                        <h1 className="newclassnameforpageheader">Update Response</h1>
                      </div>
                      <div>
                        <button
                          className="lineUp-share-btn"
                          onClick={() => {
                            setShowFilterOptions(!showFilterOptions);
                            setShowSearch(false);
                          }}
                        >
                          Filter
                        </button>
                      </div>
                    </div>

                    <div className="filter-dropdowns">

{showFilterOptions && (
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
                    </div>
                  </div>

                  <div className="attendanceTableData"
                  onScroll={handleScroll}
                  ref={tableContainerRef}
                  >
                    <table className="attendance-table">
                      <thead>
                        <tr className="attendancerows-head">
                          <th className="attendanceheading" style={{ position: "sticky",left:0, zIndex: 10 }}>Sr No</th>
                          <th className="attendanceheading" style={{ position: "sticky", left:"35px", zIndex: 10}}>Candidate ID</th>
                          <th className="attendanceheading">Candidate Name</th>
                          <th className="attendanceheading">Candidate Email</th>
                          <th className="attendanceheading">Contact Number</th>
                          <th className="attendanceheading">Source Name</th>
                          <th className="attendanceheading">Job Id</th>
                          <th className="attendanceheading">
                            Applying Company
                          </th>
                          <th className="attendanceheading">Job Designation</th>
                          <th className="attendanceheading">Resume</th>
                          <th className="attendanceheading">Comment for TL</th>
                          <th className="attendanceheading">Last Status</th>
                          <th className="attendanceheading">Interview Round</th>
                          <th className="attendanceheading">
                            Interview Response
                          </th>
                          <th className="attendanceheading">
                            Response Updated Date
                          </th>
                          <th className="attendanceheading">
                            Interview Date
                          </th>
                          <th className="attendanceheading">
                            Interview Timing
                          </th>
                          <th className="attendanceheading">Employee ID</th>
                          <th className="attendanceheading">Employee Name</th>
                          <th className="attendanceheading">
                            Employee Mail Id
                          </th>
                          <th className="attendanceheading">Employee Role</th>
                          <th className="attendanceheading">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredCallingList.map((data, index) => (
                          <tr key={index} className="attendancerows">
                            <td
                              className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                              style={{ position: "sticky",left:0, zIndex: 1 }}
                            >
                              {calculateRowIndex(index)}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {calculateRowIndex(index)}
                                </span>
                              </div>
                            </td>
                            <td className={`tabledata sticky-cell ${isHorizontallyScrolling ? "sticky-cell-scrolled" : ""}`}
                             style={{ position: "sticky", left: "35px", zIndex: 1 }}
                            >
                              {highlightText(
                                data.candidateId.toString().toLowerCase() || "",
                                filterValue
                              )}
                            </td>
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                data.candidateName || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.candidateName || "",
                                    filterValue
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
                                data.candidateEmail || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.candidateEmail || "",
                                    filterValue
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
                                data.contactNumber || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.contactNumber || "",
                                    filterValue
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
                                data.sourceName || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.sourceName || "",
                                    filterValue
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="tabledata">
                              {highlightText(
                                data.requirementId.toString().toLowerCase() ||
                                  "",
                                filterValue
                              )}
                            </td>
                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                data.requirementCompany || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.requirementCompany || "",
                                    filterValue
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
                                data.jobDesignation || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.jobDesignation || "",
                                    filterValue
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="tabledata">
                              <button
                                onClick={() => openResumeModal(data.resume)}
                                style={{ background: "none", border: "none" }}
                              >
                                <i
                                  className="fas fa-eye"
                                  style={{
                                    color: data.resume ? "green" : "inherit",
                                  }}
                                ></i>
                              </button>
                            </td>

                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                data.commentForTL || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.commentForTL || "",
                                    filterValue
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
                                data.finalStatus || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.finalStatus || "",
                                    filterValue
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
                                data.interviewRound || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.interviewRound || "",
                                    filterValue
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
                                data.interviewResponse || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.interviewResponse || "",
                                    filterValue
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
                                data.responseUpdatedDate || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.responseUpdatedDate || "",
                                    filterValue
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="tabledata">
                              {highlightText(
                                data.nextInterviewDate
                                  .toString()
                                  .toLowerCase() || "",
                                filterValue
                              )}
                            </td>
                            <td className="tabledata">
                              {highlightText(
                                data.nextInterviewTiming
                                  .toString()
                                  .toLowerCase() || "",
                                filterValue
                              )}
                            </td>
                            <td className="tabledata">
                              {highlightText(
                                data.employeeId.toString().toLowerCase() || "",
                                filterValue
                              )}
                            </td>

                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(
                                data.employeeName || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.employeeName || "",
                                    filterValue
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
                                data.officialMail || "",
                                filterValue
                              )}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.officialMail || "",
                                    filterValue
                                  )}
                                </span>
                              </div>
                            </td>

                            <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {highlightText(data.jobRole || "", filterValue)}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {highlightText(
                                    data.jobRole || "",
                                    filterValue
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="TeamLead-main-table-td">
                              <button
                                className="response-update-btn"
                                onClick={() =>
                                  handleUpdateClick(
                                    data.candidateId,
                                    data.employeeId,
                                    data.requirementId,
                                    data.candidateName,
                                    data.employeeName,
                                    data.jobRole
                                  )
                                }
                              >
                                Update
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
                </>
              ) : (
                <>
                  <div className="update-response-table">
                    <AntdModal
                      open={showUpdateResponseForm}
                      onCancel={closeUpdateForm}
                      width="90%"
  centered
  footer={null}
                    >
                      {/* <Modal.Body> */}
                        <div className="TeamLead-main-table-container">
                          <UpdateResponseFrom
                            candidateId={showUpdateResponseID}
                            passedEmployeeId={showEmployeeId}
                            requirementId={showRequirementId}
                            candidateName={showCandidateName}
                            employeeName={showEmployeeName}
                            passedJobRole={showJobRole}
                            onClose={closeUpdateForm}
                            onSuccessAdd={onSuccessAdd}
                          />
                        </div>
                      {/* </Modal.Body> */}
                    </AntdModal>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateResponse;
