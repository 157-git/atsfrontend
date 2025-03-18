import React, { useEffect, useRef, useState } from "react";
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
import { highlightText } from "../CandidateSection/HighlightTextHandlerFunc";
{
  /* this line added by sahil date 22-10-2024 */
}
const ShareProfileData = ({ loginEmployeeName, onsuccessfulDataAdditions }) => {
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
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
   const [triggerFetch, setTriggerFetch] = useState(false);
    const filterRef=useRef(null);


  const fetchData = async (page, size) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/share-profile-count-data?page=${page}&size=${size}`
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
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
 
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, triggerFetch]);

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
  const handleSearchClick = ()=>{
    fetchData(currentPage, pageSize);
  }
  const handleClearAll = () => {
    setSelectedFilters({});
  };
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0;
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const limitedOptions = [
    ["companyName", "Company Name"],
    ["requirementId", "Job Id"],
    ["designation", "Designation"],
    ["receiverCompanyMail", "Receiver E-Mail"],
    ["senderEmailId", "Sender E-Mail"],
    ["mailSendDate", "E-Mail Send Date"],
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
    let filteredResults = data.filter((item) => {
      // Apply search term filtering first
      return (
        item.companyName?.toLowerCase().includes(lowerSearchTerm) ||
        item.designation?.toLowerCase().includes(lowerSearchTerm) ||
        item.receiverCompanyMail?.toLowerCase().includes(lowerSearchTerm) ||
        item.senderEmailId?.toLowerCase().includes(lowerSearchTerm) ||
        item.mailSendDate?.toLowerCase().includes(lowerSearchTerm) ||
        item.profileSentCount
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.selectedCount
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.holdCount?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.inProcessCount
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.rejectedCount
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.profileSelected
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.noResponse?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.profileOnHold
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.requirementId?.toString().toLowerCase().includes(lowerSearchTerm)
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

  useEffect(() => {
    applyFilters(); // Reapply filters whenever the data or selected filters change
  }, [ data, selectedFilters]);

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
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
        onClick={() => handleSearchClick()} 
      >
        Search 
      </button>
                  </div>
                  <h1 className="resume-data-heading newclassnameforpageheader">Shared Profile Data</h1>
                  <div className="rl-btn-div">
                    <button
                      style={{ marginRight: "20px" }}
                      onClick={toggleFilterSection}
                      className="daily-tr-btn"
                    >
                      Filter <i className="fa-solid fa-filter"></i>
                    </button>
                    {/* {(userType === "Manager" || userType === "TeamLeader") && (
                      <button className="lineUp-share-btn" >
                        Create Excel
                      </button>
                    )} */}

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
                  {/* {showFilterSection && (
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
                  )} */}

{showFilterSection && (
                  <div ref={filterRef} className="filter-section">
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
                  {/* this modal added by sahil date 22-10-2024 */}
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
                      <th className="attendanceheading">No</th>
                      <th className="attendanceheading">Company Name</th>
                      <th className="attendanceheading">Job Id</th>
                      <th className="attendanceheading">Designation</th>
                      <th className="attendanceheading">Receiver E-Mail</th>
                      <th className="attendanceheading">Sender E-Mail</th>
                      <th className="attendanceheading">Mail Send Date</th>

                      <th className="attendanceheading">Total Sent Profiles</th>
                      <th className="attendanceheading">Selected Profiles</th>
                      <th className="attendanceheading">Rejected Profiles</th>
                      <th className="attendanceheading">Pending Profiles</th>
                      <th className="attendanceheading">Hold Profile</th>
                      <th className="attendanceheading">No Response</th>

                      <th className="attendanceheading">Profiles In Process</th>
                      <th className="attendanceheading">Selected Candidate</th>
                      <th className="attendanceheading">Rejected Candidate</th>
                      <th className="attendanceheading">Hold Candidate</th>

                      {/* <th className="attendanceheading">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr className="attendancerows">
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {index + 1}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">{index + 1}</span>
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
                          {highlightText(item.designation || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.designation || "",
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
                            item.receiverCompanyMail || "",
                            searchTerm
                          )}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.receiverCompanyMail || "",
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
                          {highlightText(item.senderEmailId || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.senderEmailId || "",
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
                          {highlightText(item.mailSendDate || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.mailSendDate || "",
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
                          {highlightText(item.profilePending || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.profilePending || "",
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
                            item.profileSelected || "",
                            searchTerm
                          )}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.profileSelected || "",
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
                            item.profileRejected || "",
                            searchTerm
                          )}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.profileRejected || "",
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
                            item.profileSentCount || "",
                            searchTerm
                          )}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.profileSentCount || "",
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
                          {highlightText(item.profileOnHold || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.profileOnHold || "",
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
                          {highlightText(item.noResponse || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(item.noResponse || "", searchTerm)}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {highlightText(item.inProcessCount || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.inProcessCount || "",
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
                          {highlightText(item.selectedCount || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.selectedCount || "",
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
                          {highlightText(item.rejectedCount || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(
                                item.rejectedCount || "",
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
                          {highlightText(item.holdCount || "", searchTerm)}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {highlightText(item.holdCount || "", searchTerm)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="search-count-last-div">
                Total Results : {searchCount}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ShareProfileData;
