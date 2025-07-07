import React, { useState, useEffect, useRef } from "react";
import "../EmployeeDashboard/JobList.css";
import { bottom } from "@popperjs/core";
import ShareDescription from "./shareDescription";
import JobDescriptionEdm from "../JobDiscription/jobDescriptionEdm";
import { values } from "pdf-lib";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import ShareEDM from "../JobDiscription/shareEDM";
import UpdateJobDescription from "../JobDiscription/UpdateJobDescription";
import { toast } from "react-toastify";
import axios from "../api/api";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
import { Badge } from "antd";
import Loader from "../EmployeeSection/loader";


// SwapnilRokade_JobListing_filter_option__18/07

const JobListing = ({ loginEmployeeName }) => {
  const { employeeId, userType } = useParams();
  const [socket, setSocket] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [updateJD, setUpdateJd] = useState([]);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(-1); // Track which job description is selected
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewMore, setShowViewMore] = useState(false);
  const [showJobDescriptionShare, setShowJobDescriptionShare] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showJobDescriptionEdm, setShowJobDescriptionEdm] = useState(false);
  const [filteredJobDescriptions, setFilteredJobDescriptions] = useState([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [requirementData, setRequirementData] = useState();
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showEDM, setShowEDM] = useState(false);
  const [showAddJobDescription, setShowAddJobDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const filterRef=useRef(null);
  const [showAddJobDiscriptionNew, setShowAddJobDescriptionNew] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState({
    designation: "",
    location: "",
    experience: "",
  });
  const [heldJobId, setHeldJobId] = useState(null);
  const [openDropdownId, setOpenDropdownId] =
    useState(null); /*Arshad Attar Added This Line :- 28-10-2024*/
  const [message, setMessage] =
    useState(""); /*Arshad Attar Added This Line :- 28-10-2024*/

  const limitedOption = [
    "jobRole",
    "jobType",
    "designation",
    "location",
    "salary",
    "stream",
    "requirementId",
    "experience",
    "companyName",
    "field",
    "companyName",
    "incentive",
    "jdStatus",
    "jdAddedDate",
    "holdStatus",
  ];

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  // useEffect(() => {
  //   // replaced base url with actual url just for testing by sahil karnekar please replace it with base url at the time of deployment
  //   fetch(`${API_BASE_URL}/fetch-all-job-descriptions/${employeeId}/${userType}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const sortedData = data.sort(
  //         (a, b) => b.requirementId - a.requirementId
  //       );
  //       setJobDescriptions(sortedData);
  //       setFilteredJobDescriptions(sortedData); // Show all jobs initially
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  //   // sahil karnekar line 65 date : 10-10-2024
  // }, [showAddJobDiscriptionNew, triggerFetch]);


    useEffect(() => {
    const fetchJobDescriptions = async () => {
      setLoading(true); // Start loading
      try {
        // replaced base url with actual url just for testing by sahil karnekar please replace it with base url at the time of deployment
        const response = await fetch(`${API_BASE_URL}/fetch-all-job-descriptions/${employeeId}/${userType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => b.requirementId - a.requirementId);
        setJobDescriptions(sortedData);
        setFilteredJobDescriptions(sortedData); // Show all jobs initially
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
      // sahil karnekar line 65 date : 10-10-2024
    };

    fetchJobDescriptions();
  }, [showAddJobDiscriptionNew, triggerFetch]);


  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedFilters, jobDescriptions]);
  useEffect(() => {
    filterData();
  }, [selectedFilters, jobDescriptions, searchQuery]);

  const filterData = () => {
    let filtereddata = [...jobDescriptions]

    Object.entries(searchQuery).forEach(([key, value]) => {
      if (value) {
        if (key === "experience") {
          const expValue = value.trim().toLowerCase()

          if (expValue.includes("-")) {
            const [min, max] = expValue.split("-").map((num) => Number.parseFloat(num))
            filtereddata = filtereddata.filter((item) => {
              const itemExp = item[key]?.toString().toLowerCase()
              if (!itemExp) return false

              const expNumber = Number.parseFloat(itemExp.match(/\d+(\.\d+)?/)?.[0] || "0")
              return expNumber >= min && expNumber <= max
            })
          }
          else if (expValue.endsWith("+")) {
            const minExp = Number.parseFloat(expValue.replace("+", ""))
            filtereddata = filtereddata.filter((item) => {
              const itemExp = item[key]?.toString().toLowerCase()
              if (!itemExp) return false

              const expNumber = Number.parseFloat(itemExp.match(/\d+(\.\d+)?/)?.[0] || "0")
              return expNumber >= minExp
            })
          }
          else {
            const exactExp = Number.parseFloat(expValue)
            if (!isNaN(exactExp)) {
              filtereddata = filtereddata.filter((item) => {
                const itemExp = item[key]?.toString().toLowerCase()
                if (!itemExp) return false

                const expNumber = Number.parseFloat(itemExp.match(/\d+(\.\d+)?/)?.[0] || "0")
                return Math.abs(expNumber - exactExp) < 0.1 // Allow small difference for floating point comparison
              })
            } else {
              filtereddata = filtereddata.filter((item) => item[key]?.toString().toLowerCase().includes(expValue))
            }
          }
        } else {
          filtereddata = filtereddata.filter((item) =>
            item[key]?.toString().toLowerCase().includes(value.toLowerCase()),
          )
        }
      }
    })

    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "jdStatus") {
          if (values.includes("Active")) {
            filtereddata = filtereddata.filter((item) => item[option] === "Active")
          } else {
            filtereddata = filtereddata.filter((item) =>
              values.some((value) => item[option]?.toString().toLowerCase() === value.toLowerCase()),
            )
          }
        } else if (option === "holdStatus") {
          if (values.includes("Hold")) {
            filtereddata = filtereddata.filter((item) => item[option] === "Hold")
          } else {
            filtereddata = filtereddata.filter((item) =>
              values.some((value) => item[option]?.toString().toLowerCase() === value.toLowerCase()),
            )
          }
        } else if (option === "requirementId") {
          filtereddata = filtereddata.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value)),
          )
        } else {
          filtereddata = filtereddata.filter((item) =>
            values.some((value) => item[option]?.toString().toLowerCase().includes(value.toLowerCase())),
          )
        }
      }
    })

    setFilteredJobDescriptions(filtereddata)
  }
  
console.log(jobDescriptions);

  const handleFilterSelect = (option, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
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

  const handleUpdateSuccess = () => {
    setShowUpdateCallingTracker(false);
    fetchShortListedData(); // Corrected from fetchRejectedData to fetchShortListedData
  };

  const handleInputSearch = (event) => {
    const { name, value } = event.target;
    setSearchQuery((prevQuery) => ({ ...prevQuery, [name]: value }));
  };

  useEffect(() => {
    const options = Object.keys(jobDescriptions[0] || {}).filter((key) =>
      limitedOption.includes(key)
    );
    setFilterOptions(options);
  }, [jobDescriptions]);

  const handleFilter = () => {
    const filtered = jobDescriptions.filter((job) => {
      return (
        (job.designation &&
          job.designation
            .toLowerCase()
            .includes(searchQuery.designation.toLowerCase())) ||
        (job.location &&
          job.location
            .toLowerCase()
            .includes(searchQuery.location.toLowerCase())) ||
        (job.experience &&
          job.experience
            .toLowerCase()
            .includes(searchQuery.experience.toLowerCase()))
      );
    });
    setFilteredJobDescriptions(filtered);
  };

  const handleFilterOptionClick = (option) => {
    if (activeFilterOption === option) {
      setActiveFilterOption(null);
    } else {
      setActiveFilterOption(option);
    }
  };
  const handleUpdate = (requirementId) => {
    setShowAddJobDescription(requirementId);
  };

  const toggleJobDescription = (requirementId) => {
    fetch(
      // replaced base url with actual url just for testing by sahil karnekar please replace it with base url at the time of deployment
      `${API_BASE_URL}/requirement-info/${requirementId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRequirementData(data);
        // setJobDescription(data)
        setShowViewMore(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const toggleEdm2 = () => {
    setShowEDM(!showEDM);
  };

  const handleclose = () => {
    setShowViewMore(false);
  };

  const handleEditBtn = (item) => {
    setUpdateJd(item);
    setShowAddJobDescriptionNew(true);
  };

  const sharejobdescription = (e) => {
    e.preventDefault();
    setShowJobDescriptionShare(!showJobDescriptionShare);
  };

  const toggleEdm = () => {
    setShowJobDescriptionEdm(!showJobDescriptionEdm);
  };

  const handleShareEdm = (res) => {
    setShowEDM(res);
  };
  const handleAddJD = (res) => {
    setShowAddJobDescription;
  };
  const handleJobDescriptionEdm = (res) => {
    setShowJobDescriptionEdm(res);
  };
  const handleShareJobDescription = (res) => {
    setShowJobDescriptionShare(res);
  };
  const handleHoldClick = (requirementId) => {
    if (heldJobId === requirementId) {
      setHeldJobId(null);
    } else {
      setHeldJobId(requirementId);
    }
  };

  //   This is added by sahil karnekar date : 30 sep 2024 the function for formatting the word is it is in PascalCase line 250 to 254
  function formatOption(option) {
    return option.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  // sahil karnekar line 256 to 259 date : 10-10-2024
  const handleUpdateCompProp = (data) => {
    setShowAddJobDescriptionNew(data);
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

  // Arshad Attar Added Code From Here 28-10-2024
  const handleToggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleToggleStatus = async (jdId, currentStatus, type) => {
    let newStatus;
    let confirmChange;

    // Determine new status and confirmation message based on currentStatus and type
    if (type === "jdStatus") {
      newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      confirmChange = window.confirm(
        `Are you sure you want to change the JD status to ${newStatus}?`
      );
    } else if (type === "holdStatus") {
      newStatus = currentStatus === "Hold" ? "Unhold" : "Hold";
      confirmChange = window.confirm(
        `Are you sure you want to change the Hold status to ${newStatus}?`
      );
    }

    if (!confirmChange) return;

    try {
      await axios.put(`${API_BASE_URL}/update-jd-status/${jdId}/${newStatus}`);
      toast.success("Status Updated Successfully.");
      setOpenDropdownId((prevId) => (prevId === jdId ? null : jdId));

      // Update local state for jdStatus or holdStatus
      setJobDescriptions((prevDescriptions) =>
        prevDescriptions.map((job) =>
          job.requirementId === jdId ? { ...job, [type]: newStatus } : job
        )
      );

      setFilteredJobDescriptions((prevFiltered) =>
        prevFiltered.map((job) =>
          job.requirementId === jdId ? { ...job, [type]: newStatus } : job
        )
      );
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  // Function to delete JD by ID
  const handleDeleteJD = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete JD with ID ${item.requirementId}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/delete-job-description/${item.requirementId}/${employeeId}/${userType}`
      );
      toast.success("JD Deleted Successfully..");

      setJobDescriptions((prevDescriptions) =>
        prevDescriptions.filter(
          (job) => job.requirementId !== item.requirementId
        )
      );
      setFilteredJobDescriptions((prevFiltered) =>
        prevFiltered.filter((job) => job.requirementId !== item.requirementId)
      );

      (item.employeeName = loginEmployeeName),
        (item.jdAddedDate = getFormattedDateTime());
      const emitItem = {
        ...item,
        employeeId: employeeId,
        userType: userType,
      };

      console.log(emitItem);

      socket.emit("delete_job_description", emitItem);
    } catch (error) {
      toast.error(`Failed to delete JD: ${error.message}`);
    }
  };

  const formatTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();

    const differenceInMs = currentDate - date;
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInDays / 365);

    let timeValue, timeUnit;
    if (differenceInYears >= 1) {
      timeValue = differenceInYears;
      timeUnit = "Year";
      const remainingMonths = differenceInMonths % 12;
      if (remainingMonths > 0) {
        return `Posted on ${timeValue} ${timeUnit}${
          timeValue > 1 ? "s" : ""
        } ${remainingMonths} ${remainingMonths > 1 ? "Months" : "Month"} ago`;
      }
    } else if (differenceInMonths >= 1) {
      timeValue = differenceInMonths;
      timeUnit = "Month";
    } else if (differenceInWeeks >= 1) {
      timeValue = differenceInWeeks;
      timeUnit = "Week";
    } else if (differenceInDays >= 1) {
      timeValue = differenceInDays;
      timeUnit = "Day";
    } else if (differenceInHours >= 1) {
      timeValue = differenceInHours;
      timeUnit = "Hour";
    } else {
      timeValue = differenceInMinutes;
      timeUnit = "Minute";
    }

    const formattedTimeUnit = timeValue > 1 ? `${timeUnit}s` : timeUnit;
    return `Posted on ${timeValue} ${formattedTimeUnit} ago`;
  };

  const [expandedSkills, setExpandedSkills] = useState({});

  const toggleSkillExpansion = (requirementId) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [requirementId]: !prev[requirementId], // Toggle the state
    }));
  };


  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => !prev); // Toggle state to trigger the effect
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0;
  };
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText("https://rg.157careers.in/jdTempGen")
      .then(() => toast.success("Link copied to clipboard!"))
      .catch((err) => toast.error("Clipboard error:", err));
  };
  
  return (
    <>
   {
    loading 
    && (
      
        <Loader/>
    )
   }
      {!showAddJobDiscriptionNew ? (
        <>
          <div className="jd-header-search">
            <div className="search-container">
              <div className="search-bar"
              style={{
                display:"block"
              }}
              >
             <form
  onSubmit={(event) => { event.preventDefault(); filterData(); }}
  style={{
    display: "flex",
    justifyContent: "space-between"
  }}
> 
  <input
    className="search-input newstyleforjdinputsinjoblists"
    placeholder="Designation"
    type="text"
    name="designation"
    value={searchQuery.designation}
    onChange={handleInputSearch}
  />
  <input
    className="search-input newstyleforjdinputsinjoblists"
    list="experienceOptions"
    placeholder="Select Experience e.g.(2, 2-6, 5+)"
    type="text"
    name="experience"
    value={searchQuery.experience}
    onChange={handleInputSearch}
  />
  <input
    className="search-input newstyleforjdinputsinjoblists"
    placeholder="Enter Location"
    type="text"
    name="location"
    value={searchQuery.location}
    onChange={handleInputSearch}
  />

{(searchQuery.designation || searchQuery.location || searchQuery.experience) && (
                          <div className="svgimagesetinInput">
                            <svg
                              onClick={() => {
                                setSearchQuery({
                                  designation: "",
                                  location: "",
                                  experience: "",
                                })
                                handleTriggerFetch();
                              }
                              }
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

<div className="lineUp-Filter-btn" onClick={copyLinkToClipboard} style={{
  fontSize: "10px",
  alignContent: "center",
}}>
  JD Template Generator
</div>

  {/* <button className="daily-tr-btn" type="submit">
    Search
  </button> */}
</form>

              </div>
            </div>

            <div className="jd-filter-section">
              <div className="jd-filter-options-container">
                {filterOptions.map((option) => {
                  const uniqueValues = Array.from(
                    // line 321 updated by sahil karnekar date 23-10-2024
                    new Set(
                      jobDescriptions.map((item) =>
                        item[option]?.toString().toLowerCase().trim()
                      )
                    )
                  );
                  return (
                    <div key={option} className="filter-option">
                      <button
                        className={`white-Btn ${
                          (selectedFilters[option] && selectedFilters[option].length > 0) || activeFilterOption === option
                            ? "selected glow"
                            : ""
                        }`}
                        onClick={() => handleFilterOptionClick(option)}
                      >
                        {/* this line numeber 319 is added by sahil karnekar for saparating the word if it is in PascalCase naming convention */}
                        {formatOption(option)}{" "}

                        {selectedFilters[option]?.length > 0 && (
      <span className="selected-count">
        ({countSelectedValues(option)})
      </span>
    )}
                        {/* Call the formatting function here */}
                        <span className="filter-icon">&#x25bc;</span>
                      </button>
                      {activeFilterOption === option && (
                        <div className="city-filter">
                          <div className="optionDiv" ref={filterRef}>
                            {uniqueValues.map(
                              (value) =>
                                // line 338 added by sahil karnekar date 23-10-2024
                                value !== "" &&
                                value !== undefined &&
                                value !== null && (
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
                                  // line 350 added by sahil karnekar date : 23-10-2024
                                )
                            )}
                            
                          </div>
                          
                        </div>
                        
                      )}
                     
                    </div>
                  );
                })}
                  <button className="clr-button lineUp-Filter-btn" onClick={handleClearAll}>Clear Filters</button>
              </div>
            </div>
          </div>

          {!showViewMore && (
            <div className="jdCards">
              {filteredJobDescriptions.map((item) => (
                <div className="job-listing" key={item.requirementId}>
                  <div className="job-header">
                    {/* Arshad Attar , Added Job Id In Jd Card As per requirement on 27-11-2024 */}
                    <div className="job-title">
                      {item.requirementId}
                      {" - "}
                      {item.designation}{" "}
                    </div>
                    <div className="job-company">{item.companyName} </div>
                  </div>

                  <div className="card-content-div">
                    <div className="job-details">
                      <div className="job-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {item.location}
                      </div>
                      <div className="job-experience">
                        <i className="fas fa-calendar-alt"></i>
                        {item.experience}
                      </div>
                     <div className="job-skills newjobskillsclassbysahil">
  <i className="fas fa-tags"></i>
  {expandedSkills[item.requirementId] ? (
    <>
      {/* Show full list of skills with match count */}
      {item.skillsMatchHandlerList?.map((skillObj, index) => (
        <div key={index}>
          {skillObj.skill} — 
            <Badge
            showZero
        className="site-badge-count-109"
        count={skillObj.skillMatchedCandidates > 0 ? skillObj.skillMatchedCandidates : 0}
        style={{ backgroundColor: '#52c41a' }}
      />

        </div>
      ))}

      <span
        style={{
          color: "blue",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => toggleSkillExpansion(item.requirementId)}
      >
        Close
      </span>
    </>
  ) : (
    <>
      {/* Truncated view for collapsed state */}
      {item.skillsMatchHandlerList?.length > 0 && (
        <>
          <span>
            {item.skillsMatchHandlerList[0].skill.length > 50
              ? item.skillsMatchHandlerList[0].skill.substring(0, 50) + "..."
              : item.skillsMatchHandlerList[0].skill}
          </span>
          <span
            style={{
              color: "black",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: 5,
            }}
            onClick={() => toggleSkillExpansion(item.requirementId)}
          >
            ....
          </span>
        </>
      )}
    </>
  )}

  {/* Always show total matched count */}
  <div>
    Candidates Matched:{" "}
     <Badge
     showZero
        className="site-badge-count-109"
        count={item.matchedCandidateCount}
        style={{ backgroundColor: item.matchedCandidateCount === 0 ? 'red' : '#52c41a' }}
      />
  </div>
</div>

                    </div>

                    <div className="jd-card-right-div">
                      <div className="job-active-status">
                        {item.jdStatus === "Active" &&
                        item.holdStatus === "Hold" ? (
                          <div
                            className="job-skills"
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            <i className="fa-solid fa-chart-line"></i> On{" "}
                            {item.holdStatus}
                          </div>
                        ) : item.jdStatus === "Active" ? (
                          <div
                            className="job-skills"
                            style={{
                              color: "green",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            <i className="fa-solid fa-chart-line"></i>{" "}
                            {item.jdStatus}
                          </div>
                        ) : item.jdStatus === "Inactive" ? (
                          <div
                            className="job-skills"
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            <i className="fa-solid fa-chart-line"></i>{" "}
                            {item.jdStatus}
                          </div>
                        ) : null}
                      </div>

                      <div className="job-incentive">
                        <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                        {item.incentive}
                      </div>
                    </div>
                  </div>

                  <div className="job-actions">
                    <div className="jd-date-main-div">
                      <div className="jd-added-date">
                        <TimeDifference date={item.jdAddedDate} />
                      </div>
                    </div>

                    <div className="jd-action-main-div">
                      {userType === "Manager" || userType === "TeamLeader" ? (
                        <div className="jd-edit-hold-div">
                          <button
                            className="daily-tr-btn"
                            onClick={() =>
                              handleToggleDropdown(item.requirementId)
                            }
                          >
                            {openDropdownId === item.requirementId ? (
                              <i className="fa-solid fa-xmark"></i>
                            ) : (
                              <i className="fa-solid fa-pencil"></i>
                            )}
                          </button>

                          {openDropdownId === item.requirementId && (
                            <div className="action-joblist-options">
                              <a href="#">
                                <div onClick={() => handleEditBtn(item)}>
                                  Edit
                                </div>
                              </a>
                              <a href="#">
                                <div
                                  onClick={() =>
                                    handleToggleStatus(
                                      item.requirementId,
                                      item.jdStatus,
                                      "jdStatus"
                                    )
                                  }
                                >
                                  {item.jdStatus === "Active"
                                    ? "Inactivate"
                                    : "Activate"}
                                </div>
                              </a>
                              <a href="#">
                                <div
                                  onClick={() =>
                                    handleToggleStatus(
                                      item.requirementId,
                                      item.holdStatus,
                                      "holdStatus"
                                    )
                                  }
                                >
                                  {item.holdStatus === "Hold"
                                    ? "Unhold"
                                    : "Hold"}
                                </div>
                              </a>
                              <a href="#">
                                <div onClick={() => handleDeleteJD(item)}>
                                  Delete
                                </div>
                              </a>
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="action-btn-jd-div">
                        {userType === "Recruiters" && (
                          <button
                            className="daily-tr-btn"
                            onClick={() =>
                              toggleJobDescription(item.requirementId)
                            }
                          >
                            View
                          </button>
                        )}
                        {(userType === "Manager" ||
                          userType === "TeamLeader") && (
                          <button
                            className="daily-tr-btn"
                            onClick={() =>
                              toggleJobDescription(item.requirementId)
                            }
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showViewMore && (
            <>
              <h1>{selectedRequirementId}</h1>
              <main className="name">
                <section className="overview">
                  <div className="scroll-container">
                    <div className="info">
                      <div className="info-title">Position Overview</div>
                      <div className="info-value">
                        {requirementData.positionOverview?.overview || "-"}
                      </div>
                    </div>
                    <div className="info">
                      <div className="info-title">Responsibilities</div>
                      <div className="info-value">
                        <ul>
                          {requirementData.responsibilities.map(
                            (responsibility, idx) => (
                              <li key={idx}>
                                {responsibility.responsibilitiesMsg}
                              </li>
                            )
                          ) || "-"}
                        </ul>
                      </div>
                    </div>
                    <div className="info">
                      <div className="info-title">Requirements</div>
                      <div className="info-value">
                        <ul>
                          {requirementData.jobRequirements.map((item) => (
                            <li key={item.jobRequirementsId}>
                              {item.jobRequirementMsg}
                            </li>
                          )) || "-"}
                        </ul>
                      </div>
                    </div>
                    <div className="info">
                      <div className="info-title">Preferred Qualifications</div>
                      <div className="info-value">
                        <ul>
                          {requirementData.preferredQualifications.map(
                            (item) => (
                              <li key={item.preferredQualificationsId}>
                                {item.preferredQualificationMsg}
                              </li>
                            )
                          ) || "-"}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="job-performance1">
                  <div>
                    <div className="info">
                      <span>
                        <div className="jd-share-div">
                          <button
                            className="saved daily-tr-btn"
                            onClick={toggleEdm}
                          >
                            Share Video
                          </button>
                          <button className="daily-tr-btn" onClick={toggleEdm2}>
                            Share EDM
                          </button>
                          <button
                            className="share daily-tr-btn"
                            onClick={sharejobdescription}
                          >
                            Share
                          </button>
                          <button onClick={handleclose}>
                            <i
                              id="jd-cancle-btn"
                              className="fa-solid fa-xmark"
                              title="Cancel"
                            ></i>
                          </button>
                        </div>
                      </span>
                      <p style={{gap:"30px",display:"flex"}}>
                       <div>
                       <b>Job Id : </b>
                       {requirementData.requirementId || "-"}
                       </div>
                        <div>
                        <b>JD Added By : </b>
                        {requirementData.employeeName || "-"}
                        </div>
                      </p>
                      <hr />
                      <p>
                        <b>Company Name  : </b>
                        {requirementData.companyName || "-"}
                      </p>
                      <p>
                        <b>Designation : </b>
                        {requirementData.designation || "-"}
                      </p>
                      <p>
                        <b>Job Role : </b>
                        {requirementData.jobRole || "-"}
                      </p>
                      <p>
                        <b>Key Skills : </b>
                        {requirementData.skills || "-"}
                      </p>
                      <p>
                        <b>Salary : </b> {requirementData.salary || "-"}
                      </p>
                      <p>
                        <b>Field : </b>
                        {requirementData.field}
                      </p>
                      <p>
                        <b>Location : </b>
                        {requirementData.location || "-"}
                      </p>
                     
                    </div>
                    <div className="info">
                      <p>
                        <b>Qualifications : </b>
                        {requirementData.qualification || "-"}
                      </p>

                      <p>
                        <b>Experience : </b>
                        {requirementData.experience || "-"}
                      </p>

                      <p>
                        <b>Year Of Passing : </b>
                        {requirementData.yearOfPassing || "-"}
                      </p>
                      <p>
                        <b>Gender : </b>
                        {requirementData.gender || "-"}
                      </p>
                      <p>
                        <b>Incentives For Recruiters : </b>
                        {requirementData.incentive && (
                          <span>&#8377; </span>
                        )}{" "}
                        {requirementData.incentive || "-"}
                      </p>
                    </div>
                    <div className="info">
                      {requirementData.companyLink && (
                        <p>
                          <b>Company Link :</b>
                          <a
                            className="companyLinkTextDecorationClass"
                            href={requirementData.companyLink || "#"}
                            target="_blank"
                          >
                            {requirementData.companyLink}
                          </a>
                        </p>
                      )}
                      <p>
                        <b>Shifts : </b>
                        {requirementData.shift || "-"}
                      </p>
                      <p>
                        <b>Week Off's : </b>
                        {requirementData.weekOff || "-"}
                      </p>
                      <p>
                        <b>Notice Period :</b>{" "}
                        {requirementData.noticePeriod || "-"}
                      </p>

                      <p>
                        <b>Job Type : </b>
                        {requirementData.jobType || "-"}
                      </p>
                      <p>
                        <b>Perks : </b>
                        {requirementData.perks || "-"}
                      </p>

                      <p>
                        <b>Reporting Hierarchy : </b>
                        {requirementData.reportingHierarchy || "-"}
                      </p>
                      <p>
                        <b>Number of Positions : </b>
                        {requirementData.position || "-"}
                      </p>
                      <p>
                        <b> Required Documentation : </b>
                        {requirementData.documentation || "-"}
                      </p>
                    </div>
                  </div>
                </section>
              </main>
            </>
          )}
          {showJobDescriptionShare && (
            <div>
              <ShareDescription
                onShareDescription={handleShareJobDescription}
                Descriptions={requirementData}
              />
            </div>
          )}
          {showJobDescriptionEdm && (
            <div>
              <JobDescriptionEdm
                onJobDescriptionEdm={handleJobDescriptionEdm}
                Descriptions={requirementData.requirementId}
              />
            </div>
          )}
          {showEDM && (
            <div>
              <ShareEDM
                onShareEdm={handleShareEdm}
                Descriptions={requirementData.requirementId}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <UpdateJobDescription
            onAddJD={updateJD}
            toggleUpdateCompProp={handleUpdateCompProp}
            loginEmployeeName={loginEmployeeName}
          />
        </>
      )}
    </>
  );
};

//Arshad Attar Commented This : 11-10-2024
const JobList = ({ loginEmployeeName }) => {
  return (
    <div className="job-list">
      <JobListing loginEmployeeName={loginEmployeeName} />
    </div>
  );
};

// Arshad Attar Added :- 29-10-2024
// Posted date On Jd Time Calculator
const TimeDifference = ({ date }) => {
  const [timeDifference, setTimeDifference] = useState("");

  const formatTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();

    const differenceInMs = currentDate - date;
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInDays / 365);

    if (differenceInYears >= 1) {
      const remainingMonths = differenceInMonths % 12;
      return `Posted on ${differenceInYears} Year${
        differenceInYears > 1 ? "s" : ""
      } ${
        remainingMonths > 0
          ? remainingMonths + " Month" + (remainingMonths > 1 ? "s" : "")
          : ""
      } ago`;
    } else if (differenceInMonths >= 1) {
      return `Posted on ${differenceInMonths} Month${
        differenceInMonths > 1 ? "s" : ""
      } ago`;
    } else if (differenceInWeeks >= 1) {
      return `Posted on ${differenceInWeeks} Week${
        differenceInWeeks > 1 ? "s" : ""
      } ago`;
    } else if (differenceInDays >= 1) {
      return `Posted on ${differenceInDays} Day${
        differenceInDays > 1 ? "s" : ""
      } ago`;
    } else if (differenceInHours >= 1) {
      return `Posted on ${differenceInHours} Hour${
        differenceInHours > 1 ? "s" : ""
      } ago`;
    } else {
      return `Posted on ${differenceInMinutes} Minute${
        differenceInMinutes > 1 ? "s" : ""
      } ago`;
    }
  };

  useEffect(() => {
    setTimeDifference(formatTimeDifference(date));
    const interval = setInterval(() => {
      setTimeDifference(formatTimeDifference(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <p
      style={{ fontSize: "14px", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
    >
      {timeDifference}
    </p>
  );
};

export default JobList;
