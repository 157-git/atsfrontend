import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import {
  parseISO,
  formatDuration,
  intervalToDuration,
  differenceInSeconds,
} from "date-fns";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";
import axios from "axios";
import "../EmployeeSection/performanceImprovement.css";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";

const PerformanceImprovement = ({ loginEmployeeName }) => {
  const { employeeId, userType } = useParams();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRounds, setSelectedRounds] = useState([]);
  const [formFillingTotal, setFormFillingTotal] = useState("");
  const [totalInterviewTime, setTotalInterviewTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [expandedManagerId, setExpandedManagerId] = useState(null);
  const [expandedTeamLeaderId, setExpandedTeamLeaderId] = useState(null);
  const [employeeCount, setEmployeeCount] = useState([]);
  const transformedDataRef = useRef(false);

  useEffect(() => {
    if (data.length > 0 && !transformedDataRef.current) {
      const updatedData = data.map((item) => {
        const interviewRoundsList = item?.interviewRoundsList || [];
        const totalTime = calculateTotalInterviewTime(interviewRoundsList);
        return {
          ...item,
          totalInterviewTime: totalTime,
          diffBetweenMailAndInterview: calculateTimeDifference(
            item?.mailResponse,
            totalTime
          ),
          diffBetweenInterviewAndDocument:
            interviewRoundsList.length > 0
              ? calculateTimeDifference(
                  interviewRoundsList[interviewRoundsList.length - 1]?.time,
                  item?.sendingDocument
                )
              : "N/A",
          diffBetweenDocumentAndLetter: calculateTimeDifference(
            item?.sendingDocument,
            item?.issuingLetter
          ),
          diffBetweenLetterAndResponse: calculateTimeDifference(
            item?.issuingLetter,
            item?.letterResponseUpdating
          ),
          diffBetweenResponseAndJoining: calculateTimeDifference(
            item?.letterResponseUpdating,
            item?.joiningProcess
          ),
          diffBetweenJoiningAndJoinDate: calculateTimeDifference(
            item?.joiningProcess,
            item?.joinDate
          ),
          OverAllCandidateTime: calculateOverallProcessTime(
            item?.lineup,
            item?.joinDate
          ),
          diffBetweenMailResponseAndAllInterviews:
            interviewRoundsList.length > 0
              ? calculateTimeDifference(
                  item?.mailResponse,
                  interviewRoundsList[interviewRoundsList.length - 1]?.time
                )
              : "N/A",
          diffBetweenMailResponseAndFirstInterview:
            interviewRoundsList.length > 0
              ? calculateTimeDifference(
                  item?.mailResponse,
                  interviewRoundsList[0]?.time
                )
              : "N/A",
        };
      });
      setData(updatedData);
      transformedDataRef.current = true;
    }
  }, [data]);

  const calculateFormFillingTotal = (data) => {
    let totalMinutes = 0;
    data.forEach((item) => {
      if (item.candidateFormFillingDuration) {
        const duration = parseFloat(item.candidateFormFillingDuration);
        if (!isNaN(duration)) {
          totalMinutes += duration;
        }
      } else if (item.mailToClient) {
        const duration = parseFloat(item.mailToClient);
        if (!isNaN(duration)) {
          totalMinutes += duration;
        }
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours} hours ${minutes} minutes`;
    setFormFillingTotal(formattedTime);
  };

  const calculateOverallProcessTime = (lineup, joinDate) => {
    if (!lineup || !joinDate) return "N/A";
    try {
      const lineupDate = parseISO(lineup);
      const joinDateDate = parseISO(joinDate);

      const totalSeconds = differenceInSeconds(joinDateDate, lineupDate);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      return `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    } catch (error) {
      console.error("Error calculating overall process time:", error);
      return "Invalid date";
    }
  };

  const calculateTimeDifference = (start, end) => {
    if (!start || !end) return "N/A";
    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);
      const duration = intervalToDuration({ start: startDate, end: endDate });
      return formatDuration(duration, {
        format: ["days", "hours", "minutes", "seconds"],
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleViewClick = (roundsList) => {
    setSelectedRounds(roundsList);
    const totalTime = calculateTotalInterviewTime(roundsList);
    setTotalInterviewTime(totalTime);
    setShowModal(true);
  };

  const calculateTotalInterviewTime = (roundsList) => {
    let totalSeconds = 0;
    for (let i = 1; i < roundsList.length; i++) {
      const start = parseISO(roundsList[i - 1].time);
      const end = parseISO(roundsList[i].time);
      const diff = differenceInSeconds(end, start);
      totalSeconds += diff;
    }
    const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });
    return formatDuration(duration, {
      format: ["days", "hours", "minutes", "seconds"],
    });
  };

  const processes = [
    "Candidate Form Filling Duration",
    "Added to Line Up",
    "Candidate Information Mail Sent To Client",
    "Mail Response From Client",
    "Candidate Interview Process",
    "Sending Candidate Document To Client",
    "Offere Letter Sending To Candidate",
    "Offere Letter Response From Candidate",
    "Joining Response From Candidates",
    "Joining Date",
  ];

  useEffect(() => {
    const fetchManagerNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching manager names:", error);
      }
    };

    if (userType === "SuperUser") {
      fetchManagerNames();
    } else if (userType === "Manager") {
      fetchTeamLeaderNames(employeeId);
    } else if (userType === "TeamLeader") {
      fetchRecruiterUnderTeamLeaderData(employeeId);
    }
  }, [userType, employeeId]);

  useEffect(() => {
    if (expandedManagerId != null) {
      fetchTeamLeaderNames(expandedManagerId);
    }
  }, [expandedManagerId]);

  useEffect(() => {
    if (expandedTeamLeaderId != null) {
      fetchRecruiterUnderTeamLeaderData(expandedTeamLeaderId);
    }
  }, [expandedTeamLeaderId]);

  const fetchTeamLeaderNames = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tl-namesIds/${id}`);
      setTeamLeaders(response.data);
    } catch (error) {
      console.error("Error fetching team leader names:", error);
    }
  };

  const fetchRecruiterUnderTeamLeaderData = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${id}`
      );
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  }, []);

  const fetchEmployeeCount = async (ids, role) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/head-count/${role}/${ids}`
      );
      setEmployeeCount(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedManagers.length > 0) {
      const ids = selectedManagers
        .map((manager) => manager.managerId)
        .join(","); // Join IDs with commas
      const role = selectedManagers[0].managerJobRole;

      fetchEmployeeCount(ids, role);
    } else if (selectedTeamLeaders.length > 0) {
      const ids = selectedTeamLeaders
        .map((teamLeader) => teamLeader.teamLeaderId)
        .join(","); // Join IDs with commas
      const role = selectedTeamLeaders[0].teamLeaderJobRole;

      fetchEmployeeCount(ids, role);
    }
  }, [selectedManagers, selectedTeamLeaders]);

  const fetchJobIds = async (ids, startDate, endDate, role) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/performance-jobIds?empIds=${ids}&startDate=${startDate}&endDate=${endDate}&jobRole=${role}`
      );
      setClientDetails(response.data);
    } catch (error) {
      console.error("Error fetching job IDs:", error);
    }
  };

  useEffect(() => {
    let ids;
    let role;
    if (selectedManagers.length > 0 && startDate && endDate) {
      ids = selectedManagers.map((manager) => manager.managerId).join(","); 
      role = selectedManagers[0].managerJobRole;
      fetchJobIds(ids, startDate, endDate, role);
    } else if (selectedTeamLeaders.length > 0 && startDate && endDate) {
      ids = selectedTeamLeaders
        .map((teamLeader) => teamLeader.teamLeaderId)
        .join(","); 
      role = selectedTeamLeaders[0].teamLeaderJobRole;
      fetchJobIds(ids, startDate, endDate, role);
    } else if (selectedRecruiters.length > 0 && startDate && endDate) {
      ids = selectedRecruiters
        .map((recruiter) => recruiter.recruiterId)
        .join(","); 
      role = selectedRecruiters[0].recruiterJobRole;
    } else if (userType === "Recruiters") {
      ids = employeeId;
      role = userType;
    }
    fetchJobIds(ids, startDate, endDate, role);
  }, [
    selectedManagers,
    selectedTeamLeaders,
    selectedRecruiters,
    startDate,
    endDate,
  ]);

  const handleJobIdChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const selectedItem = JSON.parse(selectedValue);
      setSelectedJobId(selectedItem);
      console.log(selectedItem);
    } else {
      setSelectedJobId(null);
    }
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleManagerCheckboxChange = (manager) => {
    setSelectedManagers((prev) =>
      prev.some((item) => item.managerId === manager.managerId)
        ? prev.filter((item) => item.managerId !== manager.managerId)
        : [
            ...prev,
            {
              managerId: manager.managerId,
              managerJobRole: manager.jobRole,
            },
          ]
    );
  };

  const handleTeamLeaderCheckboxChange = (teamLeader) => {
    setSelectedTeamLeaders((prev) =>
      prev.some((item) => item.teamLeaderId === teamLeader.teamLeaderId)
        ? prev.filter((item) => item.teamLeaderId !== teamLeader.teamLeaderId)
        : [
            ...prev,
            {
              teamLeaderId: teamLeader.teamLeaderId,
              teamLeaderJobRole: teamLeader.jobRole,
            },
          ]
    );
  };

  const handleRecruiterCheckboxChange = (recruiter) => {
    setSelectedRecruiters((prev) =>
      prev.some((item) => item.recruiterId === recruiter.employeeId)
        ? prev.filter((item) => item.recruiterId !== recruiter.employeeId)
        : [
            ...prev,
            {
              recruiterId: recruiter.employeeId,
              recruiterJobRole: recruiter.jobRole,
            },
          ]
    );
  };

  const toggleManagerExpand = (managerId) => {
    setExpandedManagerId(expandedManagerId === managerId ? null : managerId);
    setExpandedTeamLeaderId(null);
  };

  const toggleTeamLeaderExpand = (teamLeaderId) => {
    setExpandedTeamLeaderId(
      expandedTeamLeaderId === teamLeaderId ? null : teamLeaderId
    );
  };
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const handleDateRangeChange = (event) => {
    const selectedRange = event.target.value;
    setDateRange(selectedRange);

    const today = new Date();
    let start, end;

    switch (selectedRange) {
      case "currentMonth":
        start = startOfMonth(today);
        end = today;
        break;
      case "lastMonth":
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      case "last3Months":
        start = startOfMonth(subMonths(today, 2));
        end = endOfMonth(today);
        break;
      case "last6Months":
        start = startOfMonth(subMonths(today, 5));
        end = endOfMonth(today);
        break;
      case "lastYear":
        start = startOfMonth(subYears(today, 1));
        end = today;
        break;
      case "custom":
        // Don't set dates for custom option
        return;
      default:
        return;
    }

    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };

  const handleCustomStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomStartDate(event.target.value);
    setStartDate(format(startOfDay(date), "yyyy-MM-dd"));
  };

  const handleCustomEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setCustomEndDate(event.target.value);
    setEndDate(format(endOfDay(date), "yyyy-MM-dd"));
  };

  const handleGetFilteredData = async () => {
    if (
      selectedManagers.length === 0 &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0 &&
      userType === "SuperUser"
    ) {
      toast.error("Please Select At Least One Manager/TeamLeader/Recruiter");
    }
    if (
      userType === "Manager" &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0
    ) {
      toast.error("Please Select At Least One TeamLeader/Recruiter");
      return;
    }
    if (userType === "TeamLeader" && selectedRecruiters.length === 0) {
      toast.error("Please Select At Least 1 Recruiter");
      return;
    }
    if (dateRange === "") {
      toast.error("Please Select Date");
      return;
    }

    if (selectedJobId === "") {
      toast.error("Please Select Job Id");
      return;
    }

    // Prepare parameters for the API call
    let ids;
    let role;
    const jobId = selectedJobId?.requirementId; // Use optional chaining for safety

    if (selectedManagers.length > 0) {
      ids = selectedManagers.map((manager) => manager.managerId).join(",");
      role = selectedManagers[0].managerJobRole;
    } else if (selectedTeamLeaders.length > 0) {
      ids = selectedTeamLeaders
        .map((teamLeader) => teamLeader.teamLeaderId)
        .join(",");
      role = selectedTeamLeaders[0].teamLeaderJobRole;
    } else if (selectedRecruiters.length > 0) {
      ids = selectedRecruiters
        .map((recruiter) => recruiter.recruiterId)
        .join(",");
      role = selectedRecruiters[0].recruiterJobRole;
    } else if (userType === "Recruiters") {
      ids = employeeId;
      role = userType;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-process-timings`,
        {
          params: {
            employeeIds: ids,
            jobRole: role,
            startDate: startDate,
            endDate: endDate,
            jobId: jobId,
          },
        }
      );

      const jsonData = response.data;
      setData(jsonData);
      calculateFormFillingTotal(jsonData);
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Something Went Wrong");
    }
  };

  const uniqueClientDetails = clientDetails.reduce((acc, current) => {
    const x = acc.find((item) => item.requirementId === current.requirementId);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  const sortedUniqueClientDetails = uniqueClientDetails.sort((a, b) => {
    if (a.requirementId < b.requirementId) {
      return -1;
    }
    if (a.requirementId > b.requirementId) {
      return 1;
    }
    return 0;
  });

  const renderManagers = () => {
    return managers.map((manager) => (
      <div key={manager.managerId} className="PIE-dropdown-section">
        <div className="PIE-dropdown-row">
          <input
            type="checkbox"
            checked={selectedManagers.some(
              (item) => item.managerId === manager.managerId
            )}
            onChange={() => handleManagerCheckboxChange(manager)}
          />
          <label
            className="PIE-clickable-label"
            onClick={() => toggleManagerExpand(manager.managerId)}
          >
            {manager.managerName}
            <span className="PIE-dropdown-arrow">
              <i
                className={`fa-solid ${
                  expandedManagerId === manager.managerId
                    ? "fa-angle-up"
                    : "fa-angle-down"
                }`}
              ></i>
            </span>
          </label>
        </div>
        {expandedManagerId === manager.managerId && (
          <div className="PIE-dropdown-column">
            {renderTeamLeaders(manager.managerId)}
          </div>
        )}
      </div>
    ));
  };

  const renderTeamLeaders = (managerId) => {
    return teamLeaders.map((teamLeader) => (
      <div key={teamLeader.teamLeaderId} className="PIE-dropdown-section">
        <div className="PIE-dropdown-row">
          <input
            type="checkbox"
            checked={selectedTeamLeaders.some(
              (item) => item.teamLeaderId === teamLeader.teamLeaderId
            )}
            onChange={() => handleTeamLeaderCheckboxChange(teamLeader)}
          />
          <label
            className="PIE-clickable-label"
            onClick={() => toggleTeamLeaderExpand(teamLeader.teamLeaderId)}
          >
            {teamLeader.teamLeaderName}
            <span className="PIE-dropdown-arrow">
              <i
                className={`fa-solid ${
                  expandedTeamLeaderId === teamLeader.teamLeaderId
                    ? "fa-angle-up"
                    : "fa-angle-down"
                }`}
              ></i>
            </span>
          </label>
        </div>
        {expandedTeamLeaderId === teamLeader.teamLeaderId && (
          <div className="PIE-dropdown-column">{renderRecruiters()}</div>
        )}
      </div>
    ));
  };

  const renderRecruiters = () => {
    return recruiters.map((recruiter) => (
      <div key={recruiter.employeeId} className="PIE-dropdown-row">
        <input
          type="checkbox"
          id={`${recruiter.employeeName}-${recruiter.employeeId}`}
          checked={selectedRecruiters.some(
            (item) => item.recruiterId === recruiter.employeeId
          )}
          onChange={() => handleRecruiterCheckboxChange(recruiter)}
        />
        <label
          htmlFor={`${recruiter.employeeName}-${recruiter.employeeId}`}
          className="PIE-clickable-label"
        >
          {recruiter.employeeName}
        </label>
      </div>
    ));
  };

  return (
    <div className="PIE-App">
      <div className="PIE-Header-Section">
        <div className="PIE-grid-dropdown">
          <div className="PIE-dropdown-container">

          {userType === "Recruiters" && <span>Recruiter</span>}
          {userType === "TeamLeader" && <span>Team Leader</span>}
          {userType === "Manager" && <span>Manager</span>}
          {userType === "SuperUser" && <span>Super User</span>}

            <div className="PIE-Dropdown" onClick={toggleDropdown}>
              {userType === "SuperUser" && <span>Select  Manage OR Team Leader</span>}
              {userType === "Manager" && <span>Select TeamLeader OR Recruiter </span>}
              {userType === "TeamLeader" && <span>Select Recruiter</span>}
              {userType === "Recruiters" && <span>{loginEmployeeName}</span>}
              <span className={`PIE-dropdown-icon`} />
              <i
                className={`fa-solid  ${
                  dropdownOpen ? "fa-angle-up" : "fa-angle-down"
                }`}
              ></i>
            </div>
            {dropdownOpen && (
              <div
                className="PIE-process-dropdown-content"
                style={{ border: "1px solid black" }}
              >
                {userType === "SuperUser" && renderManagers()}
                {userType === "Manager" && renderTeamLeaders(employeeId)}
                {userType === "TeamLeader" && renderRecruiters(employeeId)}

                <button
                  onClick={() => setDropdownOpen(false)}
                  className="PIE-process-dropdown-content-Okbtn"
                >
                  Ok
                </button>
                <button
                  onClick={() => {
                    setSelectedManagers([]);
                    setSelectedRecruiters([]);
                    setSelectedTeamLeaders([]);
                  }}
                  className="PIE-process-dropdown-content-Resetbtn"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
          <div className="PIE-employee-count">
            {userType === "SuperUser" && (
              <>
                <p>
                  Manager Count :{" "}
                  {selectedManagers.length || employeeCount.managerCount || 0}
                </p>
                <p>
                  Team Leader Count :{" "}
                  {employeeCount.teamLeaderCount || selectedTeamLeaders.length}
                </p>
                <p>
                  Recruiter Count :{" "}
                  {employeeCount.employeeCount ||
                    selectedRecruiters.length ||
                    0}
                </p>
              </>
            )}
            {userType === "Manager" && (
              <>
                <p>
                  Team Leader Count :{" "}
                  {selectedTeamLeaders.length ||
                    employeeCount.teamLeaderCount ||
                    0}
                </p>
                <p>
                  Recruiter Count :{" "}
                  {employeeCount.employeeCount ||
                    selectedRecruiters.length ||
                    0}
                </p>
              </>
            )}
            {userType === "TeamLeader" && (
              <>
                <p>
                  Recruiter Count :{" "}
                  {employeeCount.employeeCount ||
                    selectedRecruiters.length ||
                    0}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="PIE-grid-date">
          <div className="PIE-date-container">
            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="currentMonth"
                  name="dateRange"
                  value="currentMonth"
                  checked={dateRange === "currentMonth"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span>Current Month</span>
              </label>
            </div>

            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="lastMonth"
                  name="dateRange"
                  value="lastMonth"
                  checked={dateRange === "lastMonth"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span>Last Month</span>
              </label>
            </div>

            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="last3Months"
                  name="dateRange"
                  value="last3Months"
                  checked={dateRange === "last3Months"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span>Last 3 Months</span>
              </label>
            </div>

            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="last6Months"
                  name="dateRange"
                  value="last6Months"
                  checked={dateRange === "last6Months"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span> Last 6 Months</span>
              </label>
            </div>

            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="lastYear"
                  name="dateRange"
                  value="lastYear"
                  checked={dateRange === "lastYear"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span> Last 1 Year</span>
              </label>
            </div>

            <div>
              <label className="PI-radio-label">
                <input
                  type="radio"
                  id="custom"
                  name="dateRange"
                  value="custom"
                  checked={dateRange === "custom"}
                  onChange={handleDateRangeChange}
                  className="form-radio"
                />
                <span>Custom Date</span>
              </label>
            </div>

            {dateRange === "custom" && (
              <div className="PIE-custom-date">
                <input
                  className="PIE-custom-date-input"
                  type="date"
                  value={customStartDate}
                  onChange={handleCustomStartDateChange}
                />
                <input
                  className="PIE-custom-date-input"
                  type="date"
                  value={customEndDate}
                  onChange={handleCustomEndDateChange}
                />
              </div>
            )}
          </div>
          <div className="PIE-job-filter">
            <select
              className="PIE-job-filter-options"
              onChange={handleJobIdChange}
            >
              <option value="">Select Job ID</option>
              {sortedUniqueClientDetails.map((item) => (
                <option key={item.requirementId} value={JSON.stringify(item)}>
                  {item.requirementId} : {item.companyName}
                </option>
              ))}
            </select>

            {selectedJobId && (
              <div className="PIE-client-desg-role">
                <p>
                  <strong>Client Name:</strong> {selectedJobId.companyName}
                </p>
                {/* <br /> */}
                <p>
                  <strong>Designation:</strong> {selectedJobId.designation}
                </p>
              </div>
            )}
          </div>
          <div className="PIE-Apply-Filter-Btn">
            <button onClick={handleGetFilteredData} className="PIE-filter-Btn">
              Get Data
            </button>
          </div>
        </div>
      </div>

      <div className="PIT-heading">
        <h5 className="text-secondary">Performance Table</h5>
      </div>
      <div className="PIE-maintable">
        <table className="PIE-timetrackertable">
          <thead>
            <th className="PIE-timetrackertablehead">Sr No</th>

            {userType !== "Recruiters" && (
              <>
                <th className="PIE-timetrackertablehead">Employee Id</th>
                <th className="PIE-timetrackertablehead">Job Role</th>
              </>
            )}

            <th className="PIE-timetrackertablehead">Candidate Id</th>
            <th className="PIE-timetrackertablehead">Candidate Name</th>
            <th className="PIE-timetrackertablehead">Job Id</th>
            <th className="PIE-timetrackertablehead">Form Filling Duration</th>
            <th className="PIE-timetrackertablehead">Added To Line Up</th>
            <th className="PIE-timetrackertablehead">
              Diff Between Added and Mail To Client
            </th>
            <th className="PIE-timetrackertablehead">Mail Sent to Client</th>
            <th className="PIE-timetrackertablehead">
              Diff Between Mail Send and Mail Response
            </th>
            <th className="PIE-timetrackertablehead">
              Mail Response From Client
            </th>
            <th className="PIE-timetrackertablehead">
              Diff between Mail response from Client To 1st Interview
            </th>
            <th className="PIE-timetrackertablehead">Interview Process</th>
            <th className="PIE-timetrackertablehead">
              Over All Time For Interview
            </th>
            <th className="PIE-timetrackertablehead">
              Diff between interview complete to document sent
            </th>
            <th className="PIE-timetrackertablehead">
              Candidate Document Send Time
            </th>
            <th className="PIE-timetrackertablehead">
              Diff between document send to offer letter sent
            </th>
            <th className="PIE-timetrackertablehead">Offer Letter Sent</th>
            <th className="PIE-timetrackertablehead">
              Diff between offer letter sent and response from candidate
            </th>
            <th className="PIE-timetrackertablehead">Offer Letter Response</th>
            <th className="PIE-timetrackertablehead">
              Diff between offer letter response and joining response
            </th>
            <th className="PIE-timetrackertablehead">
              Joining Response From Candidates
            </th>
            <th className="PIE-timetrackertablehead">
              Diff between join status to join date
            </th>
            <th className="PIE-timetrackertablehead">Join Date</th>
            <th className="PIE-timetrackertablehead">Over All Process Time</th>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.candidateId} className="PIE-timetrackertabledata">
                <td className="PIE-timetrackertabledata">{index + 1}</td>

                {userType !== "Recruiters" && (
                  <>
                    <td className="PIE-timetrackertabledata">
                      {item.employeeId}
                    </td>
                    <td className="PIE-timetrackertabledata">{item.jobRole}</td>
                  </>
                )}

                <td className="PIE-timetrackertabledata">{item.candidateId}</td>
                <td className="PIE-timetrackertabledata">
                  {item.candidateName}
                </td>
                <td className="PIE-timetrackertabledata">{item.jobId}</td>
                <td className="PIE-timetrackertabledata">
                  {item.candidateFormFillingDuration}
                </td>
                <td className="PIE-timetrackertabledata">{item.lineup}</td>
                <td className="PIE-timetrackertabledata">
                  {calculateTimeDifference(item?.lineup, item?.mailToClient)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.mailToClient}
                </td>
                <td className="PIE-timetrackertabledata">
                  {calculateTimeDifference(
                    item?.mailToClient,
                    item?.mailResponse
                  )}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.mailResponse}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenMailResponseAndFirstInterview}
                </td>
                <td className="PIE-timetrackertabledata">
                  <button
                    style={{
                      border: "1px solid black",
                      width: "120px",
                      borderRadius: "10px",
                    }}
                    onClick={() => handleViewClick(item.interviewRoundsList)}
                  >
                    View
                  </button>
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.totalInterviewTime}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenInterviewAndDocument}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.sendingDocument}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenDocumentAndLetter}
                </td>
                <td className="timetrackertabledata">{item.issuingLetter}</td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenLetterAndResponse}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.letterResponseUpdating}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenResponseAndJoining}
                </td>
                <td className="timetrackertabledata">{item.joiningProcess}</td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenJoiningAndJoinDate}
                </td>
                <td className="PIE-timetrackertabledata">{item.joinDate}</td>
                <td className="PIE-timetrackertabledata">
                  {item.OverAllCandidateTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <h5 className="text-secondary">Process Time Table</h5>
            <table className="PIE-timetrackertable">
                <thead>
                    <th className="PIE-timetrackertablehead">Sr No</th>
                    <th className="PIE-timetrackertablehead">Process Name</th>
                    <th className="PIE-timetrackertablehead">Required Time (Hours)</th>
                    <th className="PIE-timetrackertablehead">Spent Time</th>
                    <th className="PIE-timetrackertablehead">Time Difference</th>
                </thead>
                <tbody>
                    {processes.map((process, index) => (
                        <tr key={index}>
                            <td className="PIE-timetrackertabledata">{index + 1}</td>
                            <td className="PIE-timetrackertabledata">{process}</td>
                            <td className="PIE-timetrackertabledata">8 Hours</td>
                            <td className="PIE-timetrackertabledata">{formFillingTotal}</td>
                            <td className="PIE-timetrackertabledata">{formFillingTotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Interview Rounds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Round</th>
                <th>Interview Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedRounds.map((round, index) => (
                <tr key={index}>
                  <td>{round.round}</td>
                  <td>{round.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total Interview Time: {totalInterviewTime}</h4>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-dark" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PerformanceImprovement;
