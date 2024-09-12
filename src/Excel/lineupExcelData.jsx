import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";
import "../Excel/lineUpData.css";

const LineupExcelData = ({
  updateState,
  funForGettingCandidateId,
  onCloseTable,
  loginEmployeeName
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [lineUpList, setLineUpList] = useState([]);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filteredLineUpList, setFilteredLineUpList] = useState([]);
  const [showLineUpForm, setShowLineUpForm] = useState(false);
  const [lineUpToUpdate, setLineUpToUpdate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [selectedCandidateId, setSelectedCandidateId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { employeeId, userType } = useParams();
  const employeeIdw = parseInt(employeeId);
  console.log(employeeIdw + "emp @@@@ id");
  console.log(employeeId + "emp 1111 id");

  const [showUpdateLineUpTracker, setShowUpdateLineUpTracker] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/lineup-excel-data/${employeeId}/${userType}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLineUpList(data);
        setFilteredLineUpList(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [employeeId]);

  useEffect(() => {
    const options = Object.keys(filteredLineUpList[0] || {}).filter(
      (key) => key !== "candidateId"
    );
    setFilterOptions(options);
  }, [filteredLineUpList]);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    console.log("Filtered LineUp List:", filteredLineUpList);
  }, [filteredLineUpList]);

  useEffect(() => {
    const limitedOptions = [
      "date",
      "recruiterName",
      "jobDesignation",
      "requirementId",
    ];
    setFilterOptions(limitedOptions);
  }, [lineUpList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, lineUpList]);

  useEffect(() => {
    const filtered = lineUpList.filter((item) => {
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
          item.selectYesOrNo.toLowerCase().includes(searchTermLower)) ||
        (item.totalExperience &&
          item.totalExperience.toLowerCase().includes(searchTermLower)) ||
        (item.dateOfBirth &&
          item.dateOfBirth.toLowerCase().includes(searchTermLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchTermLower)) ||
        (item.qualification &&
          item.qualification.toLowerCase().includes(searchTermLower)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchTermLower))
      );
    });
    setFilteredLineUpList(filtered);
  }, [searchTerm, lineUpList]);

  useEffect(() => {
    if (sortCriteria) {
      const sortedList = [...filteredLineUpList].sort((a, b) => {
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
      setFilteredLineUpList(sortedList);
    }
  }, [sortCriteria, sortOrder]);

  const filterData = () => {
    let filteredData = [...lineUpList];
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "requirementId") {
          filteredData = filteredData.filter((item) =>
            values.includes(item[option]?.toString())
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
    setFilteredLineUpList(filteredData);
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

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const handleUpdate = (candidateData) => {
    setSelectedCandidate(candidateData); 
  };

  const handleUpdateSuccess = () => {
    fetch(`http://93.127.199.85/api/ats/157industries/lineup-excel-data/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setLineUpList(data);
        setFilteredLineUpList(data);
        setShowUpdateLineUpTracker(false);
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
      const allRowIds = filteredLineUpList.map((item) => item.candidateId);
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

  return (
    <div className="App-after1">
      {!selectedCandidate && (
        <>
          <div className="search">
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => setShowSearchBar(!showSearchBar)}
              style={{ margin: "10px", width: "auto", fontSize: "15px" }}
            ></i>
            {/* <h5 style={{ color: "gray", paddingTop: "5px" }}>Excel Uploaded data</h5> */}
            <h1 style={{ color: "grey", fontSize: "18px" }}>LineUp Data</h1>{" "}
            {/* Prachi UploadLineUpData 3/7 */}
            <button
              onClick={toggleFilterSection}
              style={{
                fontSize: "16px",
                borderRadius: "15px",
                height: "30px",
                color: "#ffcb9b",
                paddingLeft: "15px",
                paddingRight: "15px",
                background: "white",
                border: "1px solid gray",
                position: "sticky",
              }}
            >
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
              <h5 style={{ color: "gray", paddingTop: "5px" }}>Filter</h5>

              <div className="filter-dropdowns">
                {/* <button onClick={onCloseTable} style={{ float: 'right' }}>Close</button> */}

                {filterOptions.map((option) => (
                  <div key={option} className="filter-dropdown">
                    {/* <label htmlFor={option}>{option}</label> */}
                    <div className="dropdown">
                      <button className="dropbtn">{option}</button>
                      <div className="dropdown-content">
                        <div key={`${option}-All`}>
                          <input
                            type="checkbox"
                            id={`${option}-All`}
                            value="All"
                            checked={
                              !selectedFilters[option] ||
                              selectedFilters[option].length === 0
                            }
                            onChange={() => handleFilterSelect(option, "All")}
                          />
                          <label htmlFor={`${option}-All`}>All</label>
                        </div>
                        {[
                          ...new Set(lineUpList.map((item) => item[option])),
                        ].map((value) => (
                          <div key={value}>
                            <input
                              type="checkbox"
                              id={`${option}-${value}`}
                              value={value}
                              checked={
                                selectedFilters[option]?.includes(value) ||
                                false
                              }
                              onChange={() => handleFilterSelect(option, value)}
                            />
                            <label htmlFor={`${option}-${value}`}>
                              {value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="attendanceTableData">
            <table className="selfcalling-table attendance-table">
              <thead>
                <tr className="attendancerows-head">
                  <th className="attendanceheading">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === filteredLineUpList.length
                      }
                    />
                  </th>
                  <th className="attendanceheading">Sr No.</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("date")}
                  >
                    Date & Time {getSortIcon("date")}
                  </th>
                  <th hidden className="attendanceheading">
                    Candidate Id
                  </th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("recruiterName")}
                  >
                    Recruiter Name {getSortIcon("recruiterName")}
                  </th>

                  <th className="attendanceheading">Candidate Name</th>
                  <th className="attendanceheading">Candidate Email</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Whatsapp Number</th>
                  <th className="attendanceheading">Source Name</th>
                  <th className="attendanceheading">Job Designation</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("requirementId")}
                  >
                    Job Id{getSortIcon("requirementId")}
                  </th>
                  <th className="attendanceheading">Applying Company</th>
                  <th className="attendanceheading">Communication Rating</th>
                  <th className="attendanceheading">Current Location</th>
                  <th className="attendanceheading">Full Address</th>
                  <th className="attendanceheading">Calling Feedback</th>
                  <th className="attendanceheading">Recruiter's Incentive</th>
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
                  <th className="attendanceheading">Extra Certification</th>
                  <th className="attendanceheading">Call Summary</th>
                  {/* <th className="attendanceheading">Feedback</th> */}
                  <th className="attendanceheading">Holding Any Offer</th>
                  <th className="attendanceheading">Offer Letter Msg</th>
                  <th className="attendanceheading">Notice Period</th>
                  <th className="attendanceheading">Message For Team Leader</th>
                  <th className="attendanceheading">
                    Availability For Interview
                  </th>
                  <th className="attendanceheading">Interview Time</th>
                  <th className="attendanceheading">Interview Status</th>
                  <th className="attendanceheading">EmpID</th>
                  <th className="attendanceheading">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLineUpList.map((item, index) => (
                  <tr key={item.candidateId} className="attendancerows">
                    <td className="tabledata ">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.candidateId)}
                        onChange={() => handleSelectRow(item.candidateId)}
                      />
                    </td>

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
                      hidden
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateId}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.candidateId} </span>
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
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.sourceName}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.sourceName}</span>
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
                      className="tabledata "
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
                      {item.fullAddress}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.fullAddress} </span>
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
                        <span className="tooltiptext">{item.incentive} </span>
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
                      {item.experienceYear}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.experienceYear}
                        </span>
                      </div>
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.experienceMonth}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.relevantExperience}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.relevantExperience}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {" "}
                      {item.currentCtcLakh}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.currentCtcLakh}
                        </span>
                      </div>
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.currentCtcThousand}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {" "}
                      {item.expectedCtcLakh}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.expectedCtcLakh}
                        </span>
                      </div>
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {" "}
                          {item.expectedCtcThousand}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.dateOfBirth}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.dateOfBirth} </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.gender}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.gender} </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.qualification}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.qualification}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.yearOfPassing}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.yearOfPassing}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.extraCertification}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.extraCertification}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.feedBack}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.feedBack} </span>
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
                      {item.offerLetterMsg}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.offerLetterMsg}{" "}
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
                      {item.msgForTeamLeader}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.msgForTeamLeader}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.availabilityForInterview}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.availabilityForInterview}{" "}
                        </span>
                      </div>
                    </td>
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.interviewTime}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.interviewTime}{" "}
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
                    <td
                      className="tabledata "
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.empId}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.empId} </span>
                      </div>
                    </td>
                    <td className="tabledata">
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
        </>
      )}
       <div className="callingExcelData-update-form">
      {selectedCandidate && (
        <CallingTrackerForm
          initialData={selectedCandidate}
          loginEmployeeName={loginEmployeeName}
          onClose={() => setSelectedCandidate(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
      </div>
    </div>
  );
};

export default LineupExcelData;
