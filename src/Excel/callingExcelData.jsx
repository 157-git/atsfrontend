import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Excel/callingExcelData.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";

const CallingExcelList = ({
  updateState,
  funForGettingCandidateId,
  onCloseTable,
  loginEmployeeName,
  toggleSection,
  onsuccessfulDataAdditions
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

  const { employeeId, userType } = useParams();
  const employeeIdw = parseInt(employeeId);

  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/calling-excel-data/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data);
        setFilteredCallingList(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [employeeId]);

  useEffect(() => {
    const options = Object.keys(filteredCallingList[0] || {}).filter(
      (key) => key !== "candidateId"
    );
    setFilterOptions(options);
  }, [filteredCallingList]);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    console.log("Filtered Calling List:", filteredCallingList);
  }, [filteredCallingList]);

  // prachi parab callingExcelData data_filter_section 12/9
  const limitedOptions = [
    ["callingFeedback", "Calling Feedback"],
    ["candidateEmail", "Candidate Email"],
    ["candidateName", "Candidate Name"],
    ["contactNumber", "Contact Number"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["fullAddress", "Full Address"],
    ["jobDesignation", "Job Designation"],
    ["requirementCompany", "Requirement Company"],
    ["empId", "Employee Id"],
    ["companyName", "Company Name"],
    ["currentCTCLakh", "Current CTC (Lakh)"],
    ["currentCTCThousand", "Current CTC (Thousand)"],
    ["dateOfBirth", "Date Of Birth"],
    ["expectedCTCLakh", "Expected CTC (Lakh)"],
    ["expectedCTCThousand", "Expected CTC (Thousand)"],
    ["experienceMonth", "Experience (Months)"],
    ["experienceYear", "Experience (Years)"],
    ["finalStatus", "Final Status"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["noticePeriod", "Notice Period"],
  ];

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
  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const handleUpdateSuccess = () => {
    fetch(`${API_BASE_URL}/calling-excel-data/${employeeId}/${userType}`)
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
    setShowFilterSection(!showFilterSection);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allRowIds = filteredCallingList.map((item) => item.candidateId);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
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

  const openCallingExcelList = (candidateData) => {
    setSelectedCandidate(candidateData);
    toggleSection(false);
  };


  return (
    <div className="App-after1">
      {!selectedCandidate && (
        <div className="table-container">
          <div className="search">
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => setShowSearchBar(!showSearchBar)}
              style={{ margin: "10px", width: "auto", fontSize: "15px" }}
            ></i>
            <h1 className="excel-calling-data-heading">Calling Tracker Data</h1>
            <button onClick={toggleFilterSection} className="daily-tr-btn">
              Filter <i className="fa-solid fa-filter"></i>
            </button>
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
              <div className="filter-dropdowns">
                {showFilterSection && (
                  <div className="filter-section">
                    {/* updated by sahil karnekar date 22-10-2024 */}
                    {limitedOptions.map(([optionKey, optionLabel]) => {
      const uniqueValues = Array.from(
        new Set(
          callingList
            .map((item) => {
              const value = item[optionKey];
              // Ensure the value is a string before converting to lowercase
              return typeof value === 'string' ? value.toLowerCase() : value;
            })
            .filter((value) => value !== undefined && value !== null) // Remove null or undefined values
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
                                {/* line number 492 to 513 added by sahil karnekar date : 14-10-2024 */}
                                {uniqueValues.filter(value =>
                                  value !== '' && value !== null && value !== '-' && value !== undefined && !(optionKey === 'alternateNumber' && value === 0)
                                ).length > 0 ? (
                                  uniqueValues.map((value) => (
                                    value !== '' && value !== null && value !== '-' && value !== undefined && !(optionKey === 'alternateNumber' && value === 0) && (
                                      <label
                                        key={value}
                                        className="selfcalling-filter-value"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            selectedFilters[optionKey]?.includes(value) || false
                                          }
                                          onChange={() =>
                                            handleFilterSelect(optionKey, value)
                                          }
                                          style={{ marginRight: "5px" }}
                                        />
                                        {value}
                                      </label>
                                    )
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
            </div>
          )}

          <div className="attendanceTableData">
            <table className="selfcalling-table attendance-table">
              <thead>
                <tr className="attendancerows-head">
                  {/* <th className="attendanceheading"> */}
                  {/* <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === filteredLineUpList.length
                      }
                    /> */}
                  {/* </th> */}
                  <th className="attendanceheading">Sr No.</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("date")}
                  >
                    {" "}
                    Added Date {getSortIcon("date")}
                  </th>
                  <th className="attendanceheading">Candidate Name</th>
                  <th className="attendanceheading">Candidate Email</th>
                  <th className="attendanceheading">Contact Number</th>
                  {/* <th className="attendanceheading">Date Of Birth</th> */}
                  <th className="attendanceheading">Job Designation</th>
                  <th className="attendanceheading">Applying Company</th>
                  <th className="attendanceheading">Current Location</th>
                  {/* <th className="attendanceheading">Full Address</th> */}
                  <th className="attendanceheading">Calling Feedback</th>
                  <th className="attendanceheading">Current Company</th>
                  <th className="attendanceheading">Total Experience</th>
                  <th className="attendanceheading">Current CTC</th>
                  <th className="attendanceheading">Expected CTC</th>
                  <th className="attendanceheading">Holding Any Offer</th>
                  <th className="attendanceheading">Notice Period</th>
                  <th className="attendanceheading">Interview Status</th>
                  <th className="attendanceheading">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCallingList.map((item, index) => (
                  <tr key={item.candidateId} className="attendancerows">
                    {/* <td className="tabledata ">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.candidateId)}
                        onChange={() => handleSelectRow(item.candidateId)}
                      />
                    </td> */}

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
                      {item.requirementCompany}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.requirementCompany}{" "}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
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
                      {item.companyName}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.companyName} </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {" "}
                      {item.experienceYear} Year - {item.experienceMonth} Months
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.experienceYear} Year - {item.experienceMonth}{" "}
                          Months
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {" "}
                      {item.currentCTCLakh} Lakh - {item.currentCTCThousand}{" "}
                      Thousand
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.currentCTCLakh} Lakh - {item.currentCTCThousand}{" "}
                          Thousand
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {" "}
                      {item.expectedCTCLakh} Lakh -{item.expectedCTCThousand}{" "}
                      Thousand
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.expectedCTCLakh} Lakh -
                          {item.expectedCTCThousand} Thousand
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.holdingAnyOffer}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.holdingAnyOffer}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.noticePeriod}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.noticePeriod}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.finalStatus}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.finalStatus} </span>
                      </div>
                    </td>

                    <td className="tabledata" style={{ textAlign: "center" }}>
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
        </div>
      )}
      {selectedCandidate && (
        <CallingTrackerForm
          initialData={selectedCandidate}
          loginEmployeeName={loginEmployeeName}
          onClose={() => setSelectedCandidate(null)}
          onSuccess={handleUpdateSuccess}
          onsuccessfulDataAdditions={onsuccessfulDataAdditions}
    
        /> 
      )}
    </div>
  );
};

export default CallingExcelList;
