import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Chart } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import {
  parseISO,
  formatDuration,
  intervalToDuration,
  differenceInSeconds,
  addDays,
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
// this loader is imported by sahil karnekar date 24-10-2024
import Loader from "./loader";
import PerformanceMeter from "./performanceMeter";
import { convertNewDateToFormattedDateTime } from "../TeamLeader/convertNewDateToFormattedDateTime";
import { calculateTotalTimeDifferenceAndAdditionForTimeDifferences } from "./calculateTotalTimeDifferenceAndAdditionForTimeDifferences";
import { subtractTimeDurations } from "./subtractTimeDurations";
import { convertMinutesToTimeFormat } from "./convertMinutesToTimeFormat";
import { cleanTimeStringPlusMinus, cleanTimeStringSpaces, removeLeadingZeros } from "./removeLeadingZeros";
import { convertTimeStringToMinutes } from "./convertTimeStringToMinutes";
import { convertTimeStringsToMinutesForChart } from "./convertTimeStringsToMinutesForChart";
import { Button, Modal, Pagination } from "antd";


const PerformanceImprovement = ({ loginEmployeeName, onCloseIncentive }) => {
  const { employeeId, userType } = useParams();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRounds, setSelectedRounds] = useState([]);
  const [formFillingTotal, setFormFillingTotal] = useState("");
  const [totalInterviewTime, setTotalInterviewTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState([]);
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
  // this state is added by sahil karnekar date 24-10-2024
  const [isLoading, setIsLoading] = useState(false);
console.log(selectedJobId);
const chartRef = useRef(null);

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
  
      // Check if parsed dates are valid
      if (isNaN(startDate) || isNaN(endDate)) {
        return "Invalid date";
      }
  
      const duration = intervalToDuration({ start: startDate, end: endDate });
      return formatDuration(duration, {
        format: ["days", "hours", "minutes", "seconds"],
      });
    } catch (error) {
      console.log(error);
      
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

    try {
      
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
    } catch (error) {
      console.log(error);
      
    }

  };


  // const calculateTotalInterviewTime = (roundsList) => {
  //   roundsList = 0;
  //   try {
  //     if (!roundsList || roundsList.length < 2) return "0 seconds";
  
  //     let totalSeconds = 0;
  
  //     for (let i = 1; i < roundsList.length; i++) {
  //       if (!roundsList[i - 1].time || !roundsList[i].time) continue; // Skip invalid times
  
  //       const start = parseISO(roundsList[i - 1].time);
  //       const end = parseISO(roundsList[i].time);
  
  //       if (isNaN(start) || isNaN(end)) continue; // Skip if dates are invalid
  
  //       const diff = differenceInSeconds(end, start);
  //       totalSeconds += diff;
  //     }
  
  //     if (totalSeconds === 0) return "0 seconds";
  
  //     const duration = intervalToDuration({
  //       start: new Date(0),
  //       end: new Date(totalSeconds * 1000),
  //     });
  
  //     return formatDuration(duration, {
  //       format: ["days", "hours", "minutes", "seconds"],
  //     });
  
  //   } catch (error) {
  //     console.error("Error in calculateTotalInterviewTime:", error);
  //     return "0 seconds";
  //   }
  // };

  const processes = [
    "Candidate Form Filling Duration (5 Minutes/Form)",
    // "Added to Line Up",
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
    console.log(ids);
    console.log(role);
    
    
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
    console.log(ids, startDate, endDate, role);
    if (!ids || !startDate ||  !endDate || !role) {
      return;
    }else{
      try {
        const response = await axios.get(
          `${API_BASE_URL}/performance-jobIds?empIds=${ids}&startDate=${startDate}&endDate=${endDate}&jobRole=${role}`
        );
        setClientDetails(response.data);
      } catch (error) {
        console.error("Error fetching job IDs:", error);
      }
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
console.log(processes);

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
        end = addDays(today, 1);
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

  const getTotalMinutes = (timeString) => {
    try {
      let hours = 0, minutes = 0;
  
      const hourMatch = timeString.match(/(\d+)\s*hour/);
      const minuteMatch = timeString.match(/(\d+)\s*minute/);
    
      if (hourMatch) hours = parseInt(hourMatch[1]);
      if (minuteMatch) minutes = parseInt(minuteMatch[1]);
    
      return hours * 60 + minutes;
    } catch (error) {
      console.log(error);
      
    }
  
  };
  
  const getTimeDifference = (data) => {
    const totalMinutes1 = getTotalMinutes(sumTimeDurations(data)); // Convert sumTimeDurations result into minutes
    const totalMinutes2 = getTotalMinutes(convertMinutesToHours(data.length * 5)); // Convert convertMinutesToHours result into minutes
  console.log(totalMinutes1, totalMinutes2);
  
    const difference = totalMinutes2 - totalMinutes1; // Keep the difference with its sign
  
    const formattedDifference = convertMinutesToHours(Math.abs(difference)); // Convert to readable format
    return difference < 0 ? `-${formattedDifference}` : formattedDifference; // Add '-' if negative
  };
  
  
  const sumTimeDurations = (timeStrings) => {
    try {
      let totalMinutes = 0;
      let totalSeconds = 0;
    
      timeStrings.forEach((timeStr) => {
        let hours = 0, minutes = 0, seconds = 0;
    
        const hourMatch = timeStr.candidateFormFillingDuration !== null && timeStr.candidateFormFillingDuration.match(/(\d+)\s*hour/);
        const minuteMatch =timeStr.candidateFormFillingDuration !== null && timeStr.candidateFormFillingDuration.match(/(\d+)\s*minute/);
        const secondMatch =timeStr.candidateFormFillingDuration !== null && timeStr.candidateFormFillingDuration.match(/(\d+)\s*second/);
    
        if (hourMatch) hours = parseInt(hourMatch[1]);
        if (minuteMatch) minutes = parseInt(minuteMatch[1]);
        if (secondMatch) seconds = parseInt(secondMatch[1]);
    
        totalMinutes += hours * 60 + minutes;
        totalSeconds += seconds;
      });
    
      // Convert extra seconds into minutes
      totalMinutes += Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;
    
      const finalHours = Math.floor(totalMinutes / 60);
      const finalMinutes = totalMinutes % 60;
    
      return `${finalHours} hours ${finalMinutes} minutes`;
    } catch (error) {
      console.log(error);
      
    }
  
  };

  const convertMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours} hours and ${remainingMinutes} minutes` : `${remainingMinutes} minutes`;
  };

  const handleGetFilteredData = async () => {
    if (
      selectedManagers.length === 0 &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0 &&
      userType === "SuperUser"
    ) {
      toast.error("Please Select At Least One Manager/TeamLeader/Recruiter");
      // this line is added by sahil karnekar date 24-10-2024
      return;
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
    // this line is added by sahil karnekar date 24-10-2024
    setIsLoading(true); // Start the loader

    // Prepare parameters for the API call
    let ids;
    let role;
  
    
    const jobId = selectedJobId.length > 0 
    ? selectedJobId.map(job => job.requirementId).join(",") 
    : "";
 console.log(jobId);
 
    if (selectedManagers.length > 0) {
      ids = selectedManagers.map((manager) => manager.managerId).join(",");
      role = selectedManagers[0].managerJobRole;
    } else if (selectedTeamLeaders.length > 0) {
      // here multiple line updated by sahil karnekar date 24-10-2024
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
    console.log(ids, role, startDate, endDate, jobId);
    try {
     
      console.log("Executing 1");
      console.log(jobId);
      
      
      const response = await axios.get(
        `${API_BASE_URL}/fetch-process-timings`,
        {
          params: {
            employeeIds: ids,
            jobRole: role,
            startDate: startDate,
            endDate: endDate,
            jobIds: jobId,
          },
        }
      );
console.log("Executing 2");

      const jsonData = response.data;
      console.log("Executing 2");
      setData(jsonData);
      console.log("Executing 2");
      calculateFormFillingTotal(jsonData);
      console.log("Executing 2");
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Something Went Wrong");
    } finally {
      setIsLoading(false); // Stop the loader after the process is done
    }
  };
console.log(data);

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


  const labels = processes;
  // Required Time Data
  // const requiredTime = processes.map((_, index) => {
  //   if (index === 0) return data.length * 5;
  //   if (index === 1) return data.length * 60;
  //   if ([2, 4, 5, 6, 7, 8].includes(index)) return data.length * 1440;
  //   if (index === 3) return data.length * 10080;
  //   return 0;
  // });

  const requiredTime = processes.map((_, index) => {
    if (index === 0) return (data.length * 5) / 43200;
    if (index === 1) return (data.length * 60) / 43200;
    if ([2, 4, 5, 6, 7, 8].includes(index)) return (data.length * 1440) / 43200;
    if (index === 3) return (data.length * 10080) / 43200;
    return 0;
  });
  

  // Spent Time Data
  const spentTime = processes.map((_, index) => {
    if (index === 0) return sumTimeDurations(data)/ 43200;
    if (index === 1) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionAddedToMail"))/ 43200;
    if (index === 2) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailToMailRes"))/ 43200;
    if (index === 3) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailResToInterviewProcess"))/ 43200;
    if (index === 4) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionInterviewProcessToDocumentSent"))/ 43200;
    if (index === 5) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionDocumentSentToOfferLetterSendToCandidate"))/ 43200;
    if (index === 6) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"))/ 43200;
    if (index === 7) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"))/ 43200;
    if (index === 8) return convertTimeStringToMinutes(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionJoiningResponseFromCandidateToJoinDate"))/ 43200;
    return 0;
  });
  const performanceChart = processes.map((_, index)=>{

    if (index === 0) return getTimeDifference(data)/ 43200;
    if (index === 1) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 60),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionAddedToMail")
    )))/ 43200;
    if (index === 2) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailToMailRes")
    )))/ 43200;
    if (index === 3) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 10080),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailResToInterviewProcess")
    )))/ 43200;
    if (index === 4) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionInterviewProcessToDocumentSent")
    )))/ 43200;
    if (index === 5) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionDocumentSentToOfferLetterSendToCandidate")
    )))/ 43200;
    if (index === 6) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate")
    )))/ 43200;
    if (index === 7) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate")
    )))/ 43200;
    if (index === 8) return convertTimeStringsToMinutesForChart(cleanTimeStringPlusMinus(subtractTimeDurations(
      convertMinutesToTimeFormat(data.length * 1440),
      calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionJoiningResponseFromCandidateToJoinDate")
    )))/ 43200;
    return 0;
  })

console.log(performanceChart);


console.log(spentTime);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Required Time (Months)",
        data: requiredTime,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Spent Time (Months)",
        data: spentTime,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: `Performance (Months)`,
        data: performanceChart,
        backgroundColor: performanceChart.map(value => 
          value < 0 ? "rgba(255, 0, 0, 0.6)" : "rgba(30, 202, 111, 0.6)"
        ),
        borderColor: performanceChart.map(value => 
          value < 0 ? "rgb(255, 99, 99)" : "rgb(99, 255, 130)"
        ),
        borderWidth: 1,
      }      
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Time Tracker - Required vs Spent Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //       labels: {
  //         generateLabels: (chart) => {
  //           const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
  
  //           return labels.map((label, index) => ({
  //             ...label,
  //             fillStyle: index === 2 ? "linear-gradient(90deg, rgba(44,218,35,1) 29%, rgba(231,10,25,1) 69%);" : label.fillStyle, // Change color of legend 3
  //           }));
  //         },
  //       },
  //     },
  //     title: {
  //       display: true,
  //       text: "Time Tracker - Required vs Spent Time",
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  // };
  


  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk = () => {
    handleGetFilteredData();
    setIsModalOpen1(false);
  };
  const handleCancel = () => {
    setIsModalOpen1(false);
  };

  const handleCheckboxChangeForJobIdsForPerformance = (event, item) => {
    if (event.target.checked) {
      setSelectedJobId([...selectedJobId, item]); // Add item if checked
    } else {
      setSelectedJobId(selectedJobId.filter((i) => i.requirementId !== item.requirementId)); // Remove item if unchecked
    }
  };
  const downloadChart = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const imageUrl = chartInstance.toBase64Image(); // Convert chart to image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "bar_chart.png"; // File name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Number of rows per page

  // Calculate the range of data to show
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleSizeChange = (current, size) => {
    setPageSize(size); // Update the page size
    setCurrentPage(1); // Reset to the first page after page size changes
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
              {userType === "SuperUser" && <span>Select Manage OR TL</span>}
              {userType === "Manager" && <span>Select TL OR Recruiter </span>}
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
            

            <button className="PIE-filter-Btn" onClick={showModal1}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M222-200 80-342l56-56 85 85 170-170 56 57-225 226Zm0-320L80-662l56-56 85 85 170-170 56 57-225 226Zm298 240v-80h360v80H520Zm0-320v-80h360v80H520Z"/></svg>
            Select Job Ids
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-360 280-560h400L480-360Z"/></svg>
            </button>

         
      <Modal title="Select Job Ids" open={isModalOpen1} onOk={handleOk} onCancel={handleCancel}>
    <div className="selectJobIdsForPerformance">
    {sortedUniqueClientDetails.map((item) => (
        <label key={item.requirementId} style={{ display: "block" }}>
          <input
            type="checkbox"
            value={JSON.stringify(item)}
            checked={selectedJobId.some((i) => i.requirementId === item.requirementId)}
            onChange={(e) => handleCheckboxChangeForJobIdsForPerformance(e, item)}
          />
          {item.requirementId} : {item.companyName}
        </label>
      ))}

    </div>
      </Modal>

            {/* <select
              className="PIE-job-filter-options"
              onChange={handleJobIdChange}
            >
              <option value="">Select Job ID</option>
              {sortedUniqueClientDetails.map((item) => (
                <option key={item.requirementId} value={JSON.stringify(item)}>
                  {item.requirementId} : {item.companyName}
                </option>
              ))}
            </select> */}
 <div className="PIE-client-desg-role">
            { selectedJobId.length > 0 && selectedJobId.map((compItem, index)=>(
 <>
 <div className="divlength100forperformancejoblist">
  <p>
    <strong>{index+1}.  Client Name:</strong> {compItem.companyName}
  </p>
  {/* <br /> */}
  <p>
    <strong>Designation:</strong> {compItem.designation}
  </p>
  </div>
</>
            ))}
            </div>
          </div>
          {/* this code is updated by sahil karnekar date 24-10-2024 */}
          <div className="PIE-Apply-Filter-Btn">
            {/* <button
              onClick={handleGetFilteredData}
              className="PIE-filter-Btn"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Get Data"}
            </button> */}
            <button className="PIE-filter-Btn" onClick={onCloseIncentive}>
              {" "}
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="PIT-heading">
        <h5 className="text-secondary">Performance Table</h5>
      </div>
      <div className="PIE-maintable tablefixheigt">
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
            {paginatedData.map((item, index) => (
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
                <td className="PIE-timetrackertabledata">{convertNewDateToFormattedDateTime(item.callingTacker)}</td>
                <td className="PIE-timetrackertabledata">
                  {calculateTimeDifference(item?.callingTacker, item?.mailToClient)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {convertNewDateToFormattedDateTime(item.mailToClient)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {calculateTimeDifference(
                    item?.mailToClient,
                    item?.mailResponse
                  )}
                </td>
                <td className="PIE-timetrackertabledata">
                  {convertNewDateToFormattedDateTime(item.mailResponse)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenMailResponseAndFirstInterview}
                  {calculateTimeDifference(
                    item?.mailResponse,
                    item && item.interviewRoundsList.length > 0 && item.interviewRoundsList[1] && item.interviewRoundsList[1].time && (item.interviewRoundsList[1].time)
                  )}
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
                  {/* {calculateTotalInterviewTime(item.interviewRoundsList)} */}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenInterviewAndDocument}
                </td>
                <td className="PIE-timetrackertabledata">
                  {convertNewDateToFormattedDateTime(item.sendingDocument)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenDocumentAndLetter}
                </td>
                <td className="timetrackertabledata">{convertNewDateToFormattedDateTime(item.issuingLetter)}</td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenLetterAndResponse}
                </td>
                <td className="PIE-timetrackertabledata">
                  {convertNewDateToFormattedDateTime(item.letterResponseUpdating)}
                </td>
                <td className="PIE-timetrackertabledata">
                  {item.diffBetweenResponseAndJoining}
                </td>
                <td className="timetrackertabledata">{convertNewDateToFormattedDateTime(item.joiningProcess)}</td>
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
      <Pagination
                      current={currentPage}
                      total={data.length}
                      pageSize={pageSize}
                      showSizeChanger
                      showQuickJumper
                      onShowSizeChange={handleSizeChange}
                      onChange={(page) => setCurrentPage(page)}
                      style={{
                        justifyContent: "center",
                        marginBottom:"10px"
                      }}
                    />

      <div className="procees-time-table">
        <div className="fixPerformanceprocesstable100">
          <h5 className="text-secondary">Process Time Table</h5>
          <table className="PIE-timetrackertable">
            <thead>
              <th className="PIE-timetrackertablehead">Sr No</th>
              <th className="PIE-timetrackertablehead">Process Name</th>
              <th className="PIE-timetrackertablehead">Required Time</th>
              <th className="PIE-timetrackertablehead">Spent Time</th>
              <th className="PIE-timetrackertablehead">Time Difference</th>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td className="PIE-timetrackertabledata">{index + 1}</td>
                  <td className="PIE-timetrackertabledata">{process}</td>
                  <td className="PIE-timetrackertabledata">
                    {(index === 0 )  && cleanTimeStringSpaces(convertMinutesToTimeFormat(data.length * 5))}
                    {(index === 1 ) && cleanTimeStringSpaces(convertMinutesToTimeFormat(data.length * 60))}
                    {(index === 2 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8) && cleanTimeStringSpaces(convertMinutesToTimeFormat(data.length * 1440))}
                    {(index === 3 ) && cleanTimeStringSpaces(convertMinutesToTimeFormat(data.length * 10080))}
                  </td>
                  <td className="PIE-timetrackertabledata">
                    {(index === 0 ) && cleanTimeStringSpaces(sumTimeDurations(data))}
                   {index === 1 && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionAddedToMail"))}
                   {(index === 2) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailToMailRes"))}
                   {(index === 3) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailResToInterviewProcess"))}
                   {(index === 4) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionInterviewProcessToDocumentSent"))}
                   {(index === 5) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionDocumentSentToOfferLetterSendToCandidate"))}
                   {(index === 6) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"))}
                   {(index === 7) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"))}
                   {(index === 8) && removeLeadingZeros(calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionJoiningResponseFromCandidateToJoinDate"))}
                  </td>
                <td
  className="PIE-timetrackertabledata"
  style={{
    color:
      (index === 1 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 60),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionAddedToMail")
      ).startsWith("-")) ||
      (index === 2 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailToMailRes")
      ).startsWith("-")) ||
      (index === 3 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 10080),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailResToInterviewProcess")
      ).startsWith("-")) ||
      (index === 4 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionInterviewProcessToDocumentSent")
      ).startsWith("-")) ||
      (index === 5 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionDocumentSentToOfferLetterSendToCandidate")
      ).startsWith("-")) ||
      (index === 6 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate")
      ).startsWith("-")) ||
      (index === 7 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate")
      ).startsWith("-")) ||
      (index === 8 && subtractTimeDurations(
        convertMinutesToTimeFormat(data.length * 1440),
        calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionJoiningResponseFromCandidateToJoinDate")
      ).startsWith("-"))
        ? "red"
        : "green",
  }}
>
  {(index === 0) && getTimeDifference(data)}
  {(index === 1) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 60),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionAddedToMail")
  ))}
  {(index === 2) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailToMailRes")
  ))}
  {(index === 3) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 10080),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionMailResToInterviewProcess")
  ))}
  {(index === 4) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionInterviewProcessToDocumentSent")
  ))}
  {(index === 5) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionDocumentSentToOfferLetterSendToCandidate")
  ))}
  {(index === 6) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate")
  ))}
  {(index === 7) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate")
  ))}
  {(index === 8) && cleanTimeStringPlusMinus(subtractTimeDurations(
    convertMinutesToTimeFormat(data.length * 1440),
    calculateTotalTimeDifferenceAndAdditionForTimeDifferences(data, "additionJoiningResponseFromCandidateToJoinDate")
  ))}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


<div className="chartDownloaddiv">
  <div className="buttondivforchart">
  <button onClick={downloadChart} className="downloadbuttonforchartperformance PIE-filter-Btn">
       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
      </button>
  </div>

<Bar ref={chartRef} data={chartData} options={options}/>

   
</div>
      
        {/* <div>
          <PerformanceMeter></PerformanceMeter>
        </div> */}
      </div>

      <BootstrapModal show={showModal} onHide={() => setShowModal(false)}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Interview Rounds</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
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
                  <td>{round.response}</td>
                  <td>{convertNewDateToFormattedDateTime(round.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total Interview Time: {totalInterviewTime}</h4>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <button className="btn btn-dark" onClick={() => setShowModal(false)}>
            Close
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </div>
  );
};

export default PerformanceImprovement;
