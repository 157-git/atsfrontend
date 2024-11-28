//Akash_Pawar_SendClientEmail_09/07
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SendClientEmail.css";
import { differenceInDays, differenceInSeconds } from "date-fns";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import HashLoader from "react-spinners/HashLoader";
// import ClipLoader from "react-spinners/ClipLoader";
import { Form, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

// SwapnilRokade_SendClientEmail_ModifyFilters_11/07
// SwapnilROkade_AddingErrorAndSuccessMessage_19/07
// SwapnilRokade_SendClientEmail_addedProcessImprovmentEvaluatorFunctionalityStoringInterviweResponse_18_to_1251_29/07/2024

const SendClientEmail = ({ clientEmailSender }) => {
  const [callingList, setCallingList] = useState([]);
  const { employeeId, userType } = useParams();

  // const employeeIdnew = parseInt(employeeId);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  let [color, setColor] = useState("#ffcb9b");

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [showShareButton, setShowShareButton] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [difference, setDifference] = useState();
  const [showUpdateModal, setShowUpdateModal] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigator = useNavigate();

  // prachi parab sendClientEmail_filter_section 11/9
  const limitedOptions = [
    ["alternateNumber", "Alternate Number"],
    ["availabilityForInterview", "Availability For Interview"],
    ["callingFeedback", "Calling Feedback"],
    ["candidateAddedTime", "Candidate Added Time"],
    ["candidateEmail", "Candidate Email"],
    ["candidateId", "Candidate Id"],
    ["candidateName", "Candidate Name"],
    ["communicationRating", "Communication Rating"],
    ["companyName", "Company Name"],
    ["contactNumber", "Contact Number"],
    ["currentCtcLakh", "Current CTC Lakh"],
    ["currentCtcThousand", "Current CTC Thousand"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["dateOfBirth", "Date Of Birth"],
    ["empId", "Emp Id"],
    ["expectedCtcLakh", "Expected CTC Lakh"],
    ["expectedCtcThousand", "Expected CTC Thousand"],
    ["experienceMonth", "Experience Month"],
    ["experienceYear", "Experience Year"],
    ["extraCertification", "Extra Certification"],
    ["feedBack", "Feedback"],
    ["finalStatus", "Final Status"],
    ["fullAddress", "Full Address"],
    ["gender", "Gender"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["incentive", "Incentive"],
    ["interviewTime", "Interview Time"],
    ["jobDesignation", "Job Designation"],
    ["msgForTeamLeader", "Message For Team Leader"],
    ["noticePeriod", "Notice Period"],
    ["offerLetterMsg", "Offer Letter Message"],
    ["oldEmployeeId", "Old Employee Id"],
    ["qualification", "Qualification"],
    ["recruiterName", "Recruiter Name"],
    ["relevantExperience", "Relevant Experience"],
    ["requirementCompany", "Applied Company"],
    ["requirementId", "Job Id"],
    ["selectYesOrNo", "Status"],
    ["sourceName", "Source Name"],
    ["yearOfPassing", "Year Of Passing"],
  ];

  const fetchCallingList = () => {
    fetch(`${API_BASE_URL}/calling-lineup/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredCallingList(data);
        setCallingList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCallingList();
  }, [employeeId]);

  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredCallingList[0] || {}).includes(key)
      )
      .map(([key]) => key);

    setFilterOptions(options);
  }, [filteredCallingList]);

  const handleFilterOptionClick = (key) => {
    setActiveFilterOption(activeFilterOption === key ? null : key);
    setSelectedFilters((prev) => ({ ...prev, [key]: [] }));
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
          (item.jobDesignation &&
            item.jobDesignation.toString().toLowerCase().includes(searchTermLower)) ||
            (item.requirementId &&
              item.requirementId.toString().toLowerCase().includes(searchTermLower)) ||
              (item.fullAddress &&
                item.fullAddress.toString().toLowerCase().includes(searchTermLower)) ||
                (item.experienceYear &&
                  item.experienceYear.toString().toLowerCase().includes(searchTermLower)) ||
                  (item.experienceMonth &&
                    item.experienceMonth.toString().toLowerCase().includes(searchTermLower)) ||
                    (item.relevantExperience &&
                      item.relevantExperience.toString().toLowerCase().includes(searchTermLower)) ||
                      (item.currentCTCLakh &&
                        item.currentCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
                        (item.currentCTCThousand &&
                          item.currentCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
                          (item.expectedCTCLakh &&
                            item.expectedCTCLakh.toString().toLowerCase().includes(searchTermLower)) ||
                            (item.expectedCTCThousand &&
                              item.expectedCTCThousand.toString().toLowerCase().includes(searchTermLower)) ||
                              (item.yearOfPassing &&
                                item.yearOfPassing.toString().toLowerCase().includes(searchTermLower)) ||
                                (item.extraCertification &&
                                  item.extraCertification.toString().toLowerCase().includes(searchTermLower)) ||
                                  (item.holdingAnyOffer &&
                                    item.holdingAnyOffer.toString().toLowerCase().includes(searchTermLower)) ||
                                    (item.offerLetterMsg &&
                                      item.offerLetterMsg.toString().toLowerCase().includes(searchTermLower)) ||
                                      (item.noticePeriod &&
                                        item.noticePeriod.toString().toLowerCase().includes(searchTermLower)) ||
                                        (item.msgForTeamLeader &&
                                          item.msgForTeamLeader.toString().toLowerCase().includes(searchTermLower)) ||
                                          (item.availabilityForInterview &&
                                            item.availabilityForInterview.toString().toLowerCase().includes(searchTermLower)) ||
                                            (item.interviewTime &&
                                              item.interviewTime.toString().toLowerCase().includes(searchTermLower)) ||
                                              (item.finalStatus &&
                                                item.finalStatus.toString().toLowerCase().includes(searchTermLower)) ||
                                                (item.dateOfBirth &&
                                                  item.dateOfBirth.toString().toLowerCase().includes(searchTermLower)) ||
                                                  (item.gender &&
                                                    item.gender.toString().toLowerCase().includes(searchTermLower)) ||
                                                    (item.qualification &&
                                                      item.qualification.toString().toLowerCase().includes(searchTermLower)) ||
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
        } else if (option === "currentCtcLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "currentCtcThousand") {
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
        } else if (option === "expectedCtcLakh") {
          filteredData = filteredData.filter((item) =>
            values.some((value) => {
              const numericValue = parseInt(value, 10); // Convert value to integer
              return (
                item[option] !== undefined && item[option] === numericValue
              ); // Compare as numbers
            })
          );
        } else if (option === "expectedCtcThousand") {
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
        } else if (option === "incentive") {
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

  const toggleFilterSection = () => {
    setShowSearchBar(false);
    setShowFilterSection(!showFilterSection);
  };

  const handleSelectRow = (can) => {
    setSelectedRows((prevSelectedRows) => {
      const candidateId = can.candidateId;
      if (
        prevSelectedRows.some(
          (candidate) => candidate.candidateId === candidateId
        )
      ) {
        return prevSelectedRows.filter(
          (candidate) => candidate.candidateId !== candidateId
        );
      } else {
        return [...prevSelectedRows, can];
      }
    });
  };

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();
        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }
        if (fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

  const updateProfileStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status!");
      return;
    }

    try {
      // Adjust the API endpoint to include `profileStatus` as a path variable
      const response = await fetch(
        `${API_BASE_URL}/update-profile-status/${selectedCandidate.candidateId}/${selectedStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Profile status updated successfully!");
        setShowUpdateModal(false);
        setSelectedStatus("");

        // Update the local filteredCallingList to reflect the new status
        const updatedList = filteredCallingList.map((candidate) =>
          candidate.candidateId === selectedCandidate.candidateId
            ? { ...candidate, profileStatus: selectedStatus }
            : candidate
        );

        setFilteredCallingList(updatedList);
        setSelectedCandidate(null);
      } else if (response.status === 404) {
        const errorMessage = await response.text();
        toast.error(errorMessage || "Candidate not found.");
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage || "Failed to update profile status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleUpdate = (item) => {
    setSelectedCandidate(item);
    setShowUpdateModal(true);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
    setShowUpdateModal(false);
    setSelectedCandidate(null);
    setSelectedStatus("");
  };

  const handleShow = () => {
    if (selectedRows.length > 0) {
      setShowModal(true);
    } else {
      toast.error("Select At Least 1 Candidate");
    }
  };
  const handleClose = () => setShowModal(false);

  const handleSuccessEmailSend = (res) => {
    if (res) {
      setSelectedRows([]);
      setShowShareButton(true);
    }
  };

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + searchTerm.length * increment, maxWidth);
  };

  return (
    <div className="SCE-list-container">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          <div className="search">
            <div
            style={{display:"flex"}}
            >
            <i
              className="fa-solid fa-magnifying-glass"
             

              style={{ margin: "10px", width: "auto", fontSize: "15px" }}
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
                    { searchTerm && (
                      <div className="svgimagesetinInput">
                    <svg onClick={(()=>setSearchTerm(""))} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                    )}
                    
                    </div>
                  </div>
            </div>
            <h5 style={{ color: "gray", fontSize: "18px" }}>Candidate Data </h5>

            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              {showShareButton ? (
                <button
                  className="SCE-share-btn"
                  onClick={() => setShowShareButton(false)}
                >
                  Share
                </button>
              ) : (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    className="SCE-share-close-btn"
                    onClick={() => {
                      setShowShareButton(true);
                      setSelectedRows([]);
                    }}
                  >
                    Close
                  </button>
                  <button className="SCE-forward-btn" onClick={handleShow}>
                    Send
                  </button>
                </div>
              )}
              <button className="SCE-Filter-btn" onClick={toggleFilterSection}>
                Filter <i className="fa-solid fa-filter"></i>
              </button>
            </div>
          </div>

          


          <div className="filter-dropdowns">
            {showFilterSection && (
              <div className="filter-section">
                {limitedOptions.map(([optionKey, optionLabel]) => {
                  const uniqueValues = Array.from(
                    new Set(callingList.map((item) => item[optionKey]))
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
                            {uniqueValues.map((value) => (
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
            )}
          </div>

          <div className="attendanceTableData">
            <table className="attendance-table">
              <thead>
                <tr className="attendancerows-head">
                  {!showShareButton ? (
                    <th className="attendanceheading">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === filteredCallingList.length
                        }
                        name="selectAll"
                      />
                    </th>
                  ) : null}
                  <th className="attendanceheading">No.</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("date")}
                  >
                    Added Date Time
                  </th>
                  {/* <th className="attendanceheading">Time</th> */}
                  <th className="attendanceheading">Candidate Id</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("recruiterName")}
                  >
                    Recruiter's Name
                  </th>
                  <th className="attendanceheading">Candidate's Name</th>
                  <th className="attendanceheading">Candidate's Email</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Whatsapp Number</th>
                  <th className="attendanceheading">Source Name</th>
                  <th className="attendanceheading">job Designation</th>
                  <th
                    className="attendanceheading"
                    onClick={() => handleSort("requirementId")}
                  >
                    Job Id
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
                  <th className="attendanceheading">Call Summary</th>
                  {/* <th className="attendanceheading">Feedback</th> */}
                  <th className="attendanceheading">Holding Any Offer</th>
                  <th className="attendanceheading">Offer Letter Msg</th>
                  <th className="attendanceheading">Resume</th>
                  <th className="attendanceheading">Notice Period</th>
                  <th className="attendanceheading">Message For Team Leader</th>
                  <th className="attendanceheading">
                    Availability For Interview
                  </th>
                  <th className="attendanceheading">Interview Time</th>

                  <th className="attendanceheading">Interview Status</th>
                  <th
                    className="attendanceheading"
                    style={{ paddingLeft: "22px", paddingRight: "22px" }}
                  >
                    Profile Status
                  </th>
                  <th className="attendanceheading">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCallingList.map((item, index) => (
                  <tr key={item.candidateId} className="attendancerows">
                    {!showShareButton ? (
                      <td className="tabledata">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item)}
                          onChange={() => handleSelectRow(item)}
                        />
                      </td>
                    ) : null}
                    <td className="tabledata">{index + 1}</td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.date} {item.candidateAddedTime || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.date} {item.candidateAddedTime}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateId}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.candidateId}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.recruiterName}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.recruiterName}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateName}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.candidateName}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateEmail || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.candidateEmail}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.contactNumber || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.contactNumber}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.alternateNumber || 0}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.alternateNumber}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.sourceName || 0}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.sourceName}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.jobDesignation || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.jobDesignation}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.requirementId || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.requirementId}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.requirementCompany || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.requirementCompany}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.communicationRating || "-"}
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
                      {item.currentLocation || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.currentLocation}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.fullAddress || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.fullAddress} </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.callingFeedback || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.callingFeedback}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.incentive || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.incentive}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.selectYesOrNo || "-"}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.selectYesOrNo}
                        </span>
                      </div>
                    </td>

                    <>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.companyName || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.companyName}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.experienceYear || "0"} Years{" "}
                        {item.experienceMonth} Months
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.experienceYear || "0"} Years{" "}
                            {item.experienceMonth} Months
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.relevantExperience || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.relevantExperience}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {`${item.currentCTCLakh || 0} Lakh ${
                          item.currentCTCThousand || 0
                        } Thousand`}
                        <div className="tooltip">
                          <span className="tooltiptext">{`${
                            item.expectedCTCLakh || 0
                          } Lakh ${
                            item.expectedCTCThousand || 0
                          } Thousand`}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {`${item.expectedCTCLakh || 0} Lakh ${
                          item.expectedCTCThousand || 0
                        } Thousand`}
                        <div className="tooltip">
                          <span className="tooltiptext">{`${
                            item.expectedCTCLakh || 0
                          } Lakh ${
                            item.expectedCTCThousand || 0
                          } Thousand`}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.dateOfBirth || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.dateOfBirth}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.gender || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">{item.gender}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.qualification || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.qualification}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.yearOfPassing || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.yearOfPassing}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.extraCertification || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.extraCertification}
                          </span>
                        </div>
                      </td>

                      {/* <td
                              className="tabledata"
                              onMouseOver={handleMouseOver}
                              onMouseOut={handleMouseOut}
                            >
                              {item.lineUp.feedBack || "-"}
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {item.lineUp.feedBack}
                                </span>
                              </div>
                            </td> */}

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.holdingAnyOffer || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.holdingAnyOffer}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.offerLetterMsg || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.offerLetterMsg}
                          </span>
                        </div>
                      </td>
                      {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) start LineNo:-993
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
                      {/* Name:-Akash Pawar Component:-LineUpList
                  Subcategory:-ResumeViewButton(added) End LineNo:-1005
                  Date:-02/07 */}

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.noticePeriod || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.noticePeriod}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.msgForTeamLeader || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.msgForTeamLeader}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.availabilityForInterview || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.availabilityForInterview}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.interviewTime || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.interviewTime}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.finalStatus || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.finalStatus}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        <button
                          className={`profile-btn ${
                            item.profileStatus === "Profile Pending"
                              ? "pending"
                              : item.profileStatus === "Profile Sent"
                              ? "sent"
                              : item.profileStatus === "Profile Rejected"
                              ? "rejected"
                              : item.profileStatus === "Profile Selected"
                              ? "selected"
                              : item.profileStatus === "No Response"
                              ? "no-response"
                              : item.profileStatus === "Profile On Hold"
                              ? "on-hold"
                              : ""
                          }`}
                        >
                          {item.profileStatus}
                        </button>
                      </td>

                      <td className="tabledata">
                        <i
                          onClick={() => handleUpdate(item)}
                          className="fa-regular fa-pen-to-square"
                        ></i>
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal ? (
              <SendEmailPopup
                show={showModal}
                handleClose={handleClose}
                selectedCandidate={selectedRows}
                onSuccessFullEmailSend={handleSuccessEmailSend}
                clientEmailSender={clientEmailSender}
                fetchCallingList={fetchCallingList}
              />
            ) : null}
            {/* Name:-Akash Pawar Component:-LineUpList
          Subcategory:-ResumeModel(added) End LineNo:-1153 Date:-02/07 */}
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
            {/* Name:-Akash Pawar Component:-LineUpList
          Subcategory:-ResumeModel(added) End LineNo:-1184 Date:-02/07 */}

            <Modal
              show={showUpdateModal}
              onHide={closeResumeModal}
              dialogClassName="centered-modal"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Profile Status</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedCandidate && (
                  <>
                    <div>
                      <p>
                        <strong>Candidate Name : </strong>{" "}
                        {selectedCandidate.candidateName}
                      </p>
                      <p>
                        <strong>Company Name : </strong>{" "}
                        {selectedCandidate.requirementCompany}
                      </p>
                      <p>
                        <strong>Job Designation :</strong>{" "}
                        {selectedCandidate.jobDesignation}
                      </p>
                      <p>
                        <strong>Profile Status :</strong>{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              selectedCandidate.profileStatus ===
                              "Profile Pending"
                                ? "#A9A9A9" // Gray
                                : selectedCandidate.profileStatus ===
                                  "Profile Sent"
                                ? "#4682B4" // Blue
                                : selectedCandidate.profileStatus ===
                                  "Profile Rejected"
                                ? "#FF6347" // Red
                                : selectedCandidate.profileStatus ===
                                  "Profile Selected"
                                ? "#32CD32" // Green
                                : selectedCandidate.profileStatus ===
                                  "No Response"
                                ? "#FFA500" // Orange
                                : selectedCandidate.profileStatus ===
                                  "Profile On Hold"
                                ? "#FFD700" // Yellow
                                : "black", // Default color if none match
                          }}
                        >
                          {selectedCandidate.profileStatus}
                        </span>
                      </p>
                    </div>
                    <hr style={{ marginTop: "10px" }} />
                    <div className="update-profile-modal">
                      <label htmlFor="">Select Status</label>
                      <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="update-profile-drop-down"
                      >
                        <option value="">Select Status</option>
                        {[
                          "Profile Pending",
                          "Profile Sent",
                          "Profile Rejected",
                          "Profile Selected",
                          "No Response",
                          "Profile On Hold",
                        ]
                          .filter(
                            (status) =>
                              status !== selectedCandidate.profileStatus
                          )
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}
                <center>
                  <button
                    className="daily-tr-btn"
                    onClick={updateProfileStatus}
                  >
                    Update
                  </button>
                </center>
              </Modal.Body>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
};

const SendEmailPopup = ({
  show,
  handleClose,
  selectedCandidate,
  onSuccessFullEmailSend,
  clientEmailSender,
  fetchCallingList,
}) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [emailFooter, setEmailFooter] = useState("Best Regards,\n157 Careers.");
  const [subject, setSubject] = useState("");
  const [signatureImage, setSignatureImage] = useState(
    "https://lh3.googleusercontent.com/fife/ALs6j_HDFuzYstiAW8Rt_7NmtAoegg6nGerpkvbiAITq-mNL70gNXONQuJwnZdbiAbsKMNAYMt9iBnvsFWx8EaOOWV43cjOjDvFOAiw1XacANQb0MDBtFO1ag1TuVwCbwbzrLDnOiniRQ5hD7kGCCVjTNGsNdx6RQLsrKyZlpJ6meA1NIT1vXloRcFwlfbTjDBG14YC809U_0FGn9pOII8lbH-I_ZZLBI6kfh0Q43j4evix8AbIxnvw0Soesevgycz4jRqrAA4Fjjd67Pb0vIVBkeEgSp_Sfz_v9joDcBiMe2sLP6_iEvB7N4il1qgBgTHBRM6qp6IuNFov7hMdcyx8Jp1oCfQX7753pO2x3FGg3tyW5RI0l-1h01JWKdybFECo19c7o3Z_01lJ-dF1TABxyPTdT9eztvkSfDXOvfoQIP_oEny3ORR-8wfjijnlUFylwT7MhsCwTcaeQR6tWaPYJ9rX7AQVGOmMyJbLS_0tFLn0_UzX7NuQx6-W2TeC9aXM0ajJYJ5cLPusvMlAhgFBB0WdZfbtuOat0-rd2qP_L0MqJPfTYBdTgYyO4LoTD0dV6QRo5UJhvyDW5Ru8IBz-bB4QWhPMjs2_PFnQ9K-GLvAPCOYIk4TQPhkCK4UgOyGL8bRE4bPBIYMddVxfWdePCOb6V5JhGmYfvsYzEhAwquNmsZkMv9lEJfQV-Frs0DrF63XWlD5ieprbz4CLMs3WHh42I06Kpw2aCXfQchCDoJawTYljfozJ_QHq58UIAdMniaLvrKKYRyYfZohAFVdekMzArxrobd4e3Pac9cHm1Orz2_lAob5diRJCZxapdTOPfiT_ro-1qhbtmKua4kXr5Z_TWgBV9CwaactlqLFMnnbN3TtDOqKNDEFBGhg1pKC2NUu2Jw6IyawDyCU6VCdrnhizrHhvhPY8u0uXOxspsqfvQaU_PT0e0v-f2RPDESxSwIz3H6DEzmk5hOrbOmXFCPG8Q9bUu_5I3kL11z_loIveKwfWD3YGIkOjOvXAUomdEqw7DIXIbjcfDQflq7L45gJ3-BWuTkRmicaQL3GAtwVpYbmNUi649NpUC5JvKN_iqIxeNzhKdn1jBXEGl2-rbmzYXbPolNUmrQWwaFYKBzVzgWIcCjaaKpgSR444mFTx3mFEuSJxfjMTJtumbYGZkGrFkEE1rNaXMvF6XFT6JO63BtAfQzd5nFl31OctaJ6nf7_UbshOlPFeUNoRFpc-gB9LWyZck_V9jIToDHY8mij11-IK-9DFLdZZfNxeOhbha8DYljvTj9R6spXM006lRZmBsP6WugvIvvG5Pv_kiXoORCBbrCFAIk3vpZIEx3zDoayqgUNwctyrf7cJvfSiyWokjM0NNHRTCy0eldMfb0LLX5X6BftzMt128n5f6-Q60zmQ_kyuHSnyLGJawrCATfhHu-_ABtuuTWopOBib9gG__Vsa06z5SKZs5LM8eD8TwgUMeIRfWGfZBAy2qobuMt9ZVDrQDlPejp1tBg3Dm8Ke85TK7HFFfDqA-dJ2jCwzOq2ipybePn2kxLg911_lfaHPIXpF0LJdNwNyzfH_6IuB3IGI0nelUgtPnQbxXFMYd8xLaiVhfx9f0GLlDLkalvTQ8UPk92nprBDiYn8GdmV3zoVuWZbXwqQ4nmLaB9LIxDieP2kLO7V2igrEsBxXZHT309KauEgReDc1p7ahNkSiDjAOt3cDoEnlXhXjLXiBy"
  );
  const [isMailSending, setIsMailSending] = useState(false);
  const [getResponse, setResponse] = useState("");
  const [emailBody, setEmailBody] = useState(
    "hi Deepak,\n\nSharing 2 more profiles: Dotnet+Azure Developer."
  );
  const [difference, setDifference] = useState([]);

  const handleStoreClientInformation = async () => {
    try {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let currentDate = `${day}-${month}-${year}`;

      const clientData = {
        mailReceiverName: emailBody.replace(/Hi\s*,?\s*/i, "").split(",")[0],
        receiverCompanyMail: to,
        mailSendDate: currentDate,
        mailSendTime: new Date().toLocaleTimeString(),
        noOfCandidates: selectedCandidate.length,
        mailSenderName: clientEmailSender.senderName,
        senderEmailId: clientEmailSender.senderMail,
        requirementIds: selectedCandidate.map((item) => item.requirementId),
        toCCNames: cc.split(","),
        toBCCNames: bcc.split(","),
      };

      const response = await axios.post(
        `${API_BASE_URL}/add-client-details`,
        clientData
      );
      if (response) {
        setIsMailSending(false);
        setResponse(response.data);
        handleClose();
      }
    } catch (error) {
      setIsMailSending(false);
      setResponse(error.message);
    }
  };

  const handleSendEmail = () => {
    setIsMailSending(true);
    console.log(selectedCandidate + " ---------- 00001");

    const filteredAttachments = selectedCandidate
      .filter((can) => can.resume) // Include only candidates with resumes
      .map((can) => ({
        fileName: `${can.candidateName}_${can.jobDesignation}.pdf`,
        fileContent: can.resume,
      }));

    const emailData = {
      to,
      cc,
      bcc,
      subject,
      footer: emailFooter,
      body: emailBody.replace(/\n/g, "<br>"),
      signatureImage,
      ...(filteredAttachments.length > 0 && {
        attachments: filteredAttachments,
      }),
      tableData: selectedCandidate.map((can) => ({
        date: new Date().toLocaleDateString(),
        jobDesignation: can.jobDesignation,
        candidateName: can.candidateName,
        contactNumber: can.contactNumber,
        candidateEmail: can.candidateEmail,
        experienceYear: can.experienceYear,
        experienceMonth: can.experienceMonth,
        companyName: can.companyName,
        noticePeriod: can.noticePeriod,
        holdingAnyOffer: can.holdingAnyOffer,
        currentLocation: can.currentLocation,
        perDayBillingSentToClient: "300",
      })),
      candidateIds: selectedCandidate.map((can) => can.candidateId),
    };
    axios
      .post(`${API_BASE_URL}/send-email`, emailData)
      .then((response) => {
        handleStoreClientInformation();
        onSuccessFullEmailSend(true);
        const message = response.data;
        if (message.includes("Already Shared")) {
          toast.info(message); // For cases where some profiles are already shared
        } else {
          toast.success(message); // For cases where profiles are shared successfully
        }

        selectedCandidate.forEach(async (can) => {
          try {
            const performanceId = await axios.get(
              `${API_BASE_URL}/fetch-performance-id/${can.candidateId}`
            );
            UpdatePerformace(performanceId.data);
          } catch (error) {
            console.log(error);
          }
        });
        fetchCallingList();
      })
      .catch((error) => {
        setIsMailSending(false);
        setResponse("Error Sending Email");
        console.error("Error sending email:", error);
        toast.error("Failed to send email");
      });
  };

  const UpdatePerformace = async (id) => {
    try {
      const additionalData = {
        mailToClient: new Date(),
      };
      // console.log("Sending additional data:", additionalData);
      const response1 = await axios.put(
        `${API_BASE_URL}/update-performance/${id}`,
        additionalData
      );
      console.log("Second API Response:", response1.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="text-secondary"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Candidate Data To Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>TO:</strong>
              </Form.Label>
              <Form.Control
                type="email"
                className="text-secondary"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>CC:</strong>
              </Form.Label>
              <Form.Control
                type="email"
                className="text-secondary"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>BCC</strong>
              </Form.Label>
              <Form.Control
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
            </div>
            <div style={{ width: "100%" }}>
              <Form.Label>
                <strong>Subject:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                className="text-secondary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Label className="mt-2">
            <strong>Email Body:</strong>
          </Form.Label>
          <div className="p-2 mb-2 border rounded">
            <Form.Group>
              <Form.Control
                as="textarea"
                className="text-secondary"
                rows={5}
                placeholder=""
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mt-4 text-secondary"
                >
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Date</th>
                      <th>Position</th>
                      <th>Candidate Name</th>
                      <th>Contact number</th>
                      <th>Email Id</th>
                      <th>Total Experience</th>
                      <th>Current Company</th>
                      <th>Notice Period(Days)</th>
                      <th>Holding Any Offer</th>
                      <th>Current Location</th>
                      <th>Per Day Billing Sent To Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCandidate.map((can, index) => (
                      <tr key={index}>
                        <td className="text-secondary">{index + 1}</td>
                        <td className="text-secondary">{can.date}</td>
                        <td className="text-secondary">{can.jobDesignation}</td>
                        <td className="text-secondary">{can.candidateName}</td>
                        <td className="text-secondary">{can.contactNumber}</td>
                        <td className="text-secondary">{can.candidateEmail}</td>
                        <td className="text-secondary">
                          {can.experienceYear} years {can.experienceMonth}{" "}
                          months
                        </td>
                        <td className="text-secondary">{can.companyName}</td>
                        <td className="text-secondary">{can.noticePeriod}</td>
                        <td className="text-secondary">
                          {can.holdingAnyOffer}
                        </td>
                        <td className="text-secondary">
                          {can.currentLocation}
                        </td>
                        <td className="text-secondary">10000</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Form.Group>
            <div className="flex-wrap gap-1 mt-3 d-flex">
              <Form.Label className="mr-1">
                <strong>Attachments:</strong>{" "}
              </Form.Label>
              {selectedCandidate.map((item, index) => (
                <a
                  style={{
                    border: "1px solid gray",
                    borderRadius: "15px",
                    padding: "0px 4px",
                  }}
                  className="items-center justify-center d-flex"
                  key={index}
                  href={`data:application/pdf;base64,${item.resume}`}
                  download={`${item.candidateName}_${item.jobDesignation}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${item.candidateName}_${item.jobDesignation}.pdf`}
                </a>
              ))}
            </div>
            <Form.Group controlId="formBasicFooter">
              <Form.Label>
                <strong>Email Footer</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                className="text-secondary"
                rows={3}
                style={{ minHeight: "70px" }}
                placeholder=""
                value={emailFooter}
                onChange={(e) => setEmailFooter(e.target.value)}
              />
            </Form.Group>
            {signatureImage && (
              <div className="mt-3">
                <strong>Signature:</strong>
                <br />
                <img
                  src={signatureImage}
                  alt="Signature"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
            {/* <Form.Group>
              <Form.Label>
                <strong>Upload Signature Image Url:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                className="text-secondary"
                value={signatureImage}
                onChange={(e) => setSignatureImage(e.target.value)}
              />
            </Form.Group> */}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <div className="gap-2 d-flex align-items-center">
            <button
              className="SCE-share-forward-popup-btn"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="SCE-close-forward-popup-btn"
              onClick={handleSendEmail}
            >
              Send Email
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {isMailSending && (
        <div className="SCE_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}
    </>
  );
};

export default SendClientEmail;
