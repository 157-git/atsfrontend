import React, { useEffect, useState } from "react";
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

  const limitedOptions = [
    ["candidateId", "Candidate Id"],
    ["candidateName", "Candidate Name"],
    ["jobDesignation", "Job Designation"],
    ["requirementId", "Requirement Id"],
    ["employeeId", "Employee Id"],
    ["candidateEmail", "Candidate Email"],
    ["commentForTL", "Comment For TL"],
    ["contactNumber", "Contact Number"],
    ["finalStatus", "Final Status"],
    ["interviewResponse", "Interview Response"],
    ["interviewRound", "Interview Round"],
    ["jobRole", "Job Role"],
    ["nextInterviewDate", "Next Interview Date"],
    ["nextInterviewTiming", "Next Interview Timing"],
    ["officialMail", "Official Mail"],
    ["requirementCompany", "Requirement Company"],
    ["responseUpdatedDate", "Response Updated Date"],
    ["sourceName", "Source Name"],

    ["employeeName", "Employee Name"],
  ];
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
  }, [formClosed, currentPage, pageSize, filterValue]);

  useEffect(() => {
    applyFilters();
  }, [filterType, filterValue, callingList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  const fetchUpdateResponseList = async (page, size) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/update-candidate-data/${employeeId}/${userType}?searchTerm=${filterValue}&page=${page}&size=${size}`
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

  const handleUpdateClick = (candidateId, employeeId, requirementId,candidateName,employeeName,jobRole) => {
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

  const handleMouseOut = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
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

  return (
    // SwapnilRokade_UpdateResponse_FilterAdded_7_to_504_10/07"
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
                    <div className="search">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div
                      className="TeamLead-main-filter-section-container"
                      style={{ width: "100%" }}
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
                                onClick={() => setFilterValue("")}
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
                  </div>
                  <div>
                    <h1 style={{ color: "gray" }}>Update Response</h1>
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
                              .map((item) => {
                                const value = item[optionKey];
                                // Ensure the value is a string before converting to lowercase
                                return typeof value === "string"
                                  ? value.toLowerCase()
                                  : value;
                              })
                              .filter(
                                (value) => value !== undefined && value !== null
                              ) // Remove null or undefined values
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
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="attendanceTableData">
                <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      <th className="attendanceheading">Sr No</th>
                      <th className="attendanceheading">Candidate ID</th>
                      <th className="attendanceheading">Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Source Name</th>
                      <th className="attendanceheading">Job Id</th>
                      <th className="attendanceheading">Applying Company</th>
                      <th className="attendanceheading">Job Designation</th>
                      <th className="attendanceheading">Resume</th>
                      <th className="attendanceheading">Comment for TL</th>
                      <th className="attendanceheading">Last Status</th>
                      <th className="attendanceheading">Interview Round</th>
                      <th className="attendanceheading">Interview Response</th>
                      <th className="attendanceheading">
                        Response Updated Date
                      </th>
                      <th className="attendanceheading">Next Interview Date</th>
                      <th className="attendanceheading">
                        Next Interview Timing
                      </th>
                      <th className="attendanceheading">Employee ID</th>
                      <th className="attendanceheading">Employee Name</th>
                      <th className="attendanceheading">Employee Mail Id</th>
                      <th className="attendanceheading">Employee Role</th>
                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((data, index) => (
                      <tr key={index} className="attendancerows">
                        <td className="tabledata">{index + 1}</td>
                        <td className="tabledata">
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
                          {highlightText(data.candidateName || "", filterValue)}
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
                          {highlightText(data.contactNumber || "", filterValue)}
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
                          {highlightText(data.sourceName || "", filterValue)}
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
                            data.requirementId.toString().toLowerCase() || "",
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
                          {highlightText(data.commentForTL || "", filterValue)}
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
                          {highlightText(data.finalStatus || "", filterValue)}
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
                            data.nextInterviewDate.toString().toLowerCase() ||
                              "",
                            filterValue
                          )}
                        </td>
                        <td className="tabledata">
                          {highlightText(
                            data.nextInterviewTiming.toString().toLowerCase() ||
                              "",
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
                          {highlightText(data.employeeName || "", filterValue)}
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
                          {highlightText(data.officialMail || "", filterValue)}
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
                              {highlightText(data.jobRole || "", filterValue)}
                            </span>
                          </div>
                        </td>

                        <td className=" TeamLead-main-table-td">
                          <button
                            className="lineUp-Filter-btn"
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
                onChange={handlePageChange}
                showSizeChanger={false} // Hides the page size changer
                showQuickJumper={false} // Hides the quick jump input
                itemRender={(page, type) => {
                  if (type === "prev") {
                    return (
                      <button
                        style={{
                          color: currentPage === 1 ? "gray" : "black", // Gray when disabled
                          cursor: currentPage === 1 ? "not-allowed" : "pointer", // Cursor for disabled state
                        }}
                        disabled={currentPage === 1}
                        onClick={() => {
                          if (currentPage !== 1)
                            handlePageChange(currentPage - 1);
                        }}
                      >
                        Previous
                      </button>
                    );
                  }
                  if (type === "next") {
                    return (
                      <button
                        style={{
                          color:
                            filteredCallingList.length === 0 ? "gray" : "black", // Gray when no records
                          cursor:
                            filteredCallingList.length === 0
                              ? "not-allowed"
                              : "pointer", // Cursor for disabled state
                        }}
                        disabled={totalRecords === 0}
                        onClick={() => {
                          if (filteredCallingList.length > 0) {
                            handlePageChange(currentPage + 1);
                          } else {
                            return;
                          }
                        }}
                      >
                        Next
                      </button>
                    );
                  }
                  return null; // Hides page numbers and other elements
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              />

              <Modal show={showResumeModal} onHide={closeResumeModal} size="md">
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
              <Modal
                show={showUpdateResponseForm}
                onHide={closeUpdateForm}
                size="xl"
                centered
              >
                <Modal.Body>
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
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateResponse;
