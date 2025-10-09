
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Calendar from "react-calendar";
import autoTable from "jspdf-autotable";


import axios from "axios";
import {
  eachDayOfInterval,
  isSaturday,
  isSunday,
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
  format,
  startOfDay,
  endOfDay,
  isWeekend,
  parseISO,
  isValid
} from "date-fns";

import "../EmployeeSection/Attendence_sheet.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Avatar, Button, Checkbox, Divider } from "antd";
import { getUserImageFromApiForReport } from "../Reports/getUserImageFromApiForReport";
import { Card, List, Modal, Skeleton } from "antd";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../api/api";
import jsPDF from "jspdf";


const Attendance = ({ loginEmployeeName, onCloseIncentive }) => {

  //Nikita Shirsath - 08-07-2025
  const tableRef = useRef();

  const [attendanceData, setAttendanceData] = useState([]);

  const handleDownloadPdf = () => {
    if (!attendanceData || attendanceData.length === 0) {
      toast.error("No attendance data available to export.");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4");

    const headers = [
      [
        "Sr No",
        "Working Date",
        "Employee Name",
        "Job Role",
        "Login Time",
        "Late Mark",
        "Calling Count",
        "Target",
        "Archived",
        "Pending",
        "Leave Type",
        "Half Days",
        "Holiday Leave",
        "Work Type",
        "Day Status",
        "Working Hours",
        "Logout Time",
        "Employee Id",
        "Team Leader Id",
      ],
    ];

    const rows = attendanceData.map((data, index) => [
      index + 1,
      data.date || "",
      data.employeeName || "",
      data.jobRole || "",
      data.loginTime || "",
      data.lateMark || "",
      data.callingCount || "",
      data.dailyTarget || "",
      data.dailyArchived || "",
      data.dailyPending || "",
      data.leaveType || "",
      data.halfDay || "",
      data.holidayLeave || "",
      data.remoteWork || "",
      data.dayPresentStatus || "",
      data.totalHoursWork || "",
      data.logoutTime || "",
      data.employeeId || "",
      data.teamLeader || "",
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 10,
      styles: { fontSize: 6 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("attendance-sheet.pdf");


  };

  const { employeeId, userType } = useParams();
  // const employeeId = 432;
  // const userType = "TeamLeader";
  //const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceDataNew, setAttendanceDataNew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [expandedManagerId, setExpandedManagerId] = useState(null);
  const [expandedTeamLeaderId, setExpandedTeamLeaderId] = useState(null);
  const [weekendCount, setWeekendCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState([]);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredData, setFilteredData] = useState(attendanceData);

  const filterRef = useRef();
  //const dropdownRef = useRef();
  const [governmentHolidays, setGovernmentHolidays] = useState([]);

  const [summary, setSummary] = useState({
    workingDays: 0,
    totalTarget: 0,
    totalWorkingHours: 0,
    archived: 0,
    pending: 0,
    present: 0,
    absent: 0,
    weekends: 0,
    achievementRate: "",
    performanceStatus: "",
  });

  // rajlaxmi jagadale added that code
  const [startDate1, setStartDate1] = useState("");
  const [finalEndDatePropState, setFinalEndDatePropState] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // Arshad Attar Work On Fillter 09-10-2024
  const [showFilterSection, setShowFilterSection] = useState(false);

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
        return;
      default:
        return;
    }

    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    calculateWeekends(start, end);
  };

  const [displayBigSkeletonForRecruiters, setDisplayBigSkeletonForRecruiters] =
    useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [displayModalContainer, setDisplayModalContainer] = useState(false);
  const [displayBigSkeletonForManagers, setDisplayBigSkeletonForManagers] =
    useState(false);
  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [activeManager, setActiveManager] = useState(null);
  const [activeTeamLeader, setActiveTeamLeader] = useState(null);
  const [managerToTeamLeaders, setManagerToTeamLeaders] = useState({});
  const [teamLeaderToRecruiters, setTeamLeaderToRecruiters] = useState({});
  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [displayMoreButton, setDisplayMoreButton] = useState(false);
  const [
    displayBigSkeletonForTeamLeaders,
    setDisplayBigSkeletonForTeamLeaders,
  ] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [openReport, setOpenReport] = useState(false);
  const [reportDataDatewise, setReportDataDatewise] = useState(null);
  const [finalStartDatePropState, setFinalStartDatePropState] = useState("");
  const [endDate1, setEndDate1] = useState("");
  const [allImagesForManagers, setAllImagesForManagers] = useState([]);
  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([]);
  const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([]);
  // Add a state to track the selected team leader name
  const [selectedTeamLeaderName, setSelectedTeamLeaderName] = useState("");

  // Fixed function to handle the display of managers
  // rajlaxmi jagadale update that code
  const handleDisplayManagers = async () => {
    setDisplayModalContainer(true);
    if (userType === "SuperUser") {
      setDisplayBigSkeletonForManagers(true);
      const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
      setManagersList(response.data);
      setDisplayBigSkeletonForManagers(false);
      setDisplayManagers(true);
    } else if (userType === "Manager") {
      setDisplayBigSkeletonForTeamLeaders(true);
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${employeeId}`
      );
      setTeamLeadersList(response.data);
      setDisplayBigSkeletonForTeamLeaders(false);
      setDisplayTeamLeaders(true);
    } else if (userType === "TeamLeader") {
      setDisplayBigSkeletonForRecruiters(true);
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${employeeId}`
      );
      setRecruitersList(response.data);
      setDisplayBigSkeletonForRecruiters(false);
      setDisplayRecruiters(true);
    }
  };

  // Fixed function to handle opening recruiters for a team leader
  const handleOpenDownArrowContentForRecruiters = async (
    teamLeaderId,
    teamLeaderName
  ) => {
    setDisplayRecruiters(false);
    setAllImagesForRecruiters([]);
    setDisplayBigSkeletonForRecruiters(true);
    // Store the team leader name when opening recruiters
    setSelectedTeamLeaderName(teamLeaderName);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
      );
      setRecruitersList(response.data);

      // Immediately fetch images for recruiters after getting the list
      const images = await Promise.all(
        response.data.map(async (recruiter) => {
          return await getUserImageFromApiForReport(
            recruiter.employeeId,
            recruiter.jobRole
          );
        })
      );
      setAllImagesForRecruiters(images);

      setTeamLeaderToRecruiters((prev) => ({
        ...prev,
        [teamLeaderId]: response.data.map((recruiter) => recruiter.employeeId),
      }));
      setDisplayBigSkeletonForRecruiters(false);
      setDisplayRecruiters(true);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      setDisplayBigSkeletonForRecruiters(false);
    }
  };
  const isFilterSelected = (option) => {
    return selectedFilters[option] && selectedFilters[option].length > 0;
  };
  const countSelectedValues = (option) => {
    return selectedFilters[option] ? selectedFilters[option].length : 0;
  };
  const handleClearAll = () => {
    setSelectedFilters({});
    setShowCloseButton(false); // Hide Clear Filters button when all selections are removed
  };

  // Fixed function to handle checkbox changes
  // rajlaxmi jagadale updated that code
  const handleCheckboxChange = async (role, id, completeValueObject) => {
    setLoading(true);

    // Determine updated IDs
    let updatedIds;
    if (selectedRole && selectedRole !== role) {
      setSelectedRole(role);
      updatedIds = [id]; // Reset selection for a new role
    } else {
      updatedIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id) // Remove unselected ID
        : [...selectedIds, id]; // Add new selected ID
      setSelectedRole(role);
    }

    // Update state
    setSelectedIds(updatedIds);

    // Handle dependent display logic
    if (role === "Manager") {
      setDisplayTeamLeaders(false);
      setDisplayRecruiters(false);

      // Update employee count for managers
      if (updatedIds.length > 0) {
        const userIdForApi = updatedIds.join(",");
        try {
          const response = await axios.get(
            `${API_BASE_URL}/head-count/${role}/${userIdForApi}`
          );
          setEmployeeCount({
            ...response.data,
            teamLeaderCount: response.data.teamLeaderCount || 0,
            employeeCount: response.data.employeeCount || 0,
          });
        } catch (error) {
          console.error("Error fetching employee count:", error);
        }
      } else {
        // Reset counts when no managers are selected
        setEmployeeCount((prev) => ({
          ...prev,
          teamLeaderCount: 0,
          employeeCount: 0,
        }));
      }
    } else if (role === "TeamLeader") {
      setDisplayRecruiters(false);
      // Store the team leader name when selecting a team leader
      if (completeValueObject && completeValueObject.teamLeaderName) {
        setSelectedTeamLeaderName(completeValueObject.teamLeaderName);
      }

      // Update employee count for team leaders
      if (updatedIds.length > 0) {
        const userIdForApi = updatedIds.join(",");
        try {
          const response = await axios.get(
            `${API_BASE_URL}/head-count/${role}/${userIdForApi}`
          );
          setEmployeeCount({
            ...response.data,
            employeeCount: response.data.employeeCount || 0,
          });
        } catch (error) {
          console.error("Error fetching employee count:", error);
        }
      } else {
        // Reset recruiter count when no team leaders are selected
        setEmployeeCount((prev) => ({
          ...prev,
          employeeCount: 0,
        }));
      }
    } else if (role === "Recruiters") {
      // Ensure images are loaded for recruiters
      if (!allImagesForRecruiters.length && recruitersList.length > 0) {
        try {
          const images = await Promise.all(
            recruitersList.map(async (recruiter) => {
              return await getUserImageFromApiForReport(
                recruiter.employeeId,
                recruiter.jobRole
              );
            })
          );
          setAllImagesForRecruiters(images);
        } catch (error) {
          console.error("Error fetching recruiter images:", error);
        }
      }

      // No need to update employee count for recruiters as they don't have subordinates
    }

    // Date handling
    const startDate = showCustomDiv ? customStartDate : startDate1;
    const endDate = showCustomDiv ? customEndDate : endDate1;
    setFinalStartDatePropState(startDate);
    setFinalEndDatePropState(endDate);

    // Only make API call if we have both dates and IDs
    if (startDate && endDate && updatedIds.length > 0) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/report-count/${updatedIds.join(
            ","
          )}/${role}/${startDate}/${endDate}`
        );
        setReportDataDatewise(response.data);
        setOpenReport(true);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    setLoading(false);
  };
  // rajlaxmi jagadale added that code line 324 to 341
  const hasSelectedChildren = (parentId, parentType) => {
    if (parentType === "Manager") {
      const teamLeaderIds = managerToTeamLeaders[parentId] || [];
      return teamLeaderIds.some((tlId) => selectedIds.includes(tlId));
    } else if (parentType === "TeamLeader") {
      const recruiterIds = teamLeaderToRecruiters[parentId] || [];
      return recruiterIds.some((recruiterId) =>
        selectedIds.includes(recruiterId)
      );
    }
    return false;
  };

  const handleOk = () => {
    setDisplayModalContainer(false);
  };

  const handleCancel = () => {
    setDisplayModalContainer(false);
  };

  // Fixed function to handle option changes
  const handleOptionChange = async (event) => {
    const value = event.target.value;

    setSelectedOption(value);

    if (value === "custom") {
      setDisplayModalContainer(false);
      setShowCustomDiv(true);
      return;
    }

    // Handle selection of predefined date option
    if (selectedRole === "" && selectedIds.length === 0) {
      setDisplayModalContainer(true);
      setShowCustomDiv(false);
      handleDisplayManagers();
      setDisplayMoreButton(true);
    } else {
      setDisplayModalContainer(false);
    }

    // Calculate date range for predefined options
    const { startDate, endDate } = calculateDateRange(value);
    if (!startDate || !endDate) {
      console.error("Invalid date range calculated.");
      return;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    setStartDate1(formattedStartDate);
    setEndDate1(formattedEndDate);

    // API Call when role and IDs are selected
    if (selectedRole !== "" && selectedIds.length !== 0) {
      setLoading(true);

      const finalStartDate = showCustomDiv
        ? customStartDate
        : formattedStartDate;
      const finalEndDate = showCustomDiv ? customEndDate : formattedEndDate;

      setFinalStartDatePropState(finalStartDate);
      setFinalEndDatePropState(finalEndDate);

      const userIdForApi = selectedIds.join(",");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/report-count/${userIdForApi}/${selectedRole}/${finalStartDate}/${finalEndDate}`
        );
        setReportDataDatewise(response.data);
        setOpenReport(true);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const applyCustomDateRange = (start, end) => {
    setDisplayModalContainer(true);
  };

  // Function to handle opening team leaders for a manager
  const handleOpenDownArrowContent = async (managerId) => {
    setDisplayTeamLeaders(false);
    setAllImagesForTeamLeaders([]);
    try {
      setDisplayBigSkeletonForTeamLeaders(true);
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${managerId}`
      );
      setTeamLeadersList(response.data);
      setManagerToTeamLeaders((prev) => ({
        ...prev,
        [managerId]: response.data.map((tl) => tl.teamLeaderId),
      }));
      setDisplayBigSkeletonForTeamLeaders(false);
      setDisplayTeamLeaders(true);
      setDisplayRecruiters(false);
    } catch (error) {
      console.log(error);
      setDisplayBigSkeletonForTeamLeaders(false);
    }
  };

  const handleClearSelection = (userType) => {
    if (userType) {
      setSelectedRole("");
      setSelectedIds([]);
      // Clear the team leader name when clearing selection
      setSelectedTeamLeaderName("");

      // Reset counts based on user type
      if (userType === "Managers") {
        setEmployeeCount((prev) => ({
          ...prev,
          teamLeaderCount: 0,
          employeeCount: 0,
        }));
      } else if (userType === "Team Leaders") {
        setEmployeeCount((prev) => ({
          ...prev,
          employeeCount: 0,
        }));
      }
    }
  };

  const toggleTeamLeader = (teamLeaderId) => {
    setActiveTeamLeader(
      activeTeamLeader === teamLeaderId ? null : teamLeaderId
    );
  };

  const toggleManager = (managerId) => {
    setActiveManager(activeManager === managerId ? null : managerId);
  };

  // Fixed calculateDateRange function
  const calculateDateRange = (option) => {
    const today = new Date();
    let startDate, endDate;

    switch (option) {
      case "Current Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last 3 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last 6 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last 1 Year":
        startDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        return { startDate: null, endDate: null };
    }
    return { startDate, endDate };
  };
  // rajlaxmi jagadale added that line
  const filterRefs = useRef({});

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (filterRef.current && !filterRef.current.contains(event.target)) {
  //       setActiveFilterOption(null); // Close filter dropdown when clicking outside
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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

  useEffect(() => {
    if (attendanceData.length > 0) {
      calculateSummary();
    }
  }, [attendanceData]);

  const calculateWeekendsAndHolidays = (startDate, endDate) => {
    const interval = eachDayOfInterval({ start: startDate, end: endDate });
    let weekendCount = 0;
    let holidayCount = 0;

    interval.forEach((date) => {
      if (isSaturday(date) || isSunday(date)) {
        weekendCount++;
      }
      if (governmentHolidays.includes(format(date, "yyyy-MM-dd"))) {
        holidayCount++;
      }
    });
    return { weekendCount, holidayCount };
  };

  const fetchData = async (id, roles, startDate, endDate) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance-data/${id}/${roles}/${startDate}/${endDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAttendanceData(data);
      setAttendanceDataNew(data);
      console.log("attendance data:", data);
      setShowCalculation(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data :", error);
      setError(error);
      setLoading(false);
    }
  };
  // rajlaxmi jagadale added that code line 611 to 617
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const calculateWeekends = (start, end) => {
    const interval = eachDayOfInterval({ start, end });
    const weekendCount = interval.filter(
      (date) => isSaturday(date) || isSunday(date)
    ).length;
    setWeekendCount(weekendCount);
  };
  //samruddhi Patole 03/09 
const calculateSummary = () => {
  let workingDays = 0;
  let weekends = 0;
  let present = 0;
  let absent = 0;
  let totalWorkingHours = 0;

  const getHoursWorked = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return 0;

    const toMinutes = (timeStr) => {
      try {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes, seconds] = time.split(":").map(Number);

        if (modifier && modifier.toLowerCase() === "pm" && hours < 12) {
          hours += 12;
        }
        if (modifier && modifier.toLowerCase() === "am" && hours === 12) {
          hours = 0;
        }

        return hours * 60 + minutes;
      } catch (e) {
        return 0;
      }
    };

    const loginMinutes = toMinutes(loginTime);
    const logoutMinutes = toMinutes(logoutTime);

    if (logoutMinutes <= loginMinutes) return 0;

    const diffMinutes = logoutMinutes - loginMinutes;

    let hours = Math.floor(diffMinutes / 60);
    let mins = diffMinutes % 60;

    if (mins >= 30) hours += 1;

    return hours;
  };

  if (startDate && endDate) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    //  safe guard for invalid or reversed dates
    if (isValid(start) && isValid(end) && end >= start) {
      const interval = eachDayOfInterval({ start, end });

      workingDays = interval.filter((date) => !isWeekend(date)).length;
      weekends = interval.filter((date) => isWeekend(date)).length;

      const selectedAttendance = attendanceData.filter((data) => {
        const dataDate = parseISO(data.date);
        return dataDate >= start && dataDate <= end;
      });

      const totalArchived = selectedAttendance.reduce(
        (sum, data) => sum + (Number(data.dailyArchived) || 0),
        0
      );

      if (totalArchived > 3) {
        present = selectedAttendance.length;
        absent = 0;
      } else {
        present = 0;
        absent = selectedAttendance.length;
      }

      selectedAttendance.forEach((data) => {
        const loginTime = (data.loginTime || "").trim();
        const logoutTime = (data.logoutTime || "").trim();

        const hasLogin =
          loginTime &&
          loginTime !== "00:00" &&
          loginTime !== "0" &&
          loginTime !== "0:00" &&
          loginTime !== "00:00:00";

        if (hasLogin) {
          totalWorkingHours += getHoursWorked(loginTime, logoutTime);
        }
      });
    } else {
      alert("⚠️ Invalid or reversed date interval:", startDate, endDate);
      return; //  stop execution
    }
  } else {
    alert("⚠️ Missing startDate or endDate:", startDate, endDate);
    return; //  stop execution
  }

  const archived = attendanceData.reduce(
    (sum, data) => sum + (Number(data.dailyArchived) || 0),
    0
  );
  const pending = attendanceData.reduce(
    (sum, data) => sum + (Number(data.dailyPending) || 0),
    0
  );
  const totalTarget = archived + pending;

  const { status, achievementRate } = categorizePerformance(
    totalTarget,
    archived
  );

  setSummary({
    workingDays,
    totalTarget,
    totalWorkingHours,
    archived,
    pending,
    present,
    absent,
    weekends,
    achievementRate,
    performanceStatus: status,
  });
};




  // rajlaxmi jagadale updated that code line 669 to 761
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const showDataReport = async () => {
    if (
      selectedManagers.length === 0 &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0 &&
      selectedIds.length === 0 &&
      userType === "SuperUser"
    ) {
      toast.error("Please Select At Least One TeamLeader/Recruiter");
      return;
    }

    if (
      userType === "Manager" &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0 &&
      selectedIds.length === 0
    ) {
      toast.error("Please Select At Least One TeamLeader/Recruiter");
      return;
    }

    if (
      userType === "TeamLeader" &&
      selectedRecruiters.length === 0 &&
      selectedIds.length === 0
    ) {
      toast.error("Please Select At Least 1 Recruiter");
      return;
    }

    if (dateRange === "") {
      toast.error("Please Select Date");
      return;
    }

    if (dateRange === "custom") {
      const today = new Date().toISOString().split("T")[0];

      if (!customStartDate && !customEndDate) {
        toast.error("Please select the  Date ");
        return;
      }
      if (!customStartDate) {
        toast.error("Please Select  Start Date");
        return;
      }
      if (!customEndDate) {
        toast.error("Please Select End Date");
        return;
      }

      if (customStartDate > today) {
        toast.error("Start Date Cannot Be a Future Date");
        return;
      }

      if (customStartDate === today && customEndDate < today) {
        toast.error("End Date Should Be Today Or a Future Date");
        return;
      }
    }

    let ids;
    let role;

    if (selectedRole && selectedIds.length > 0) {
      ids = selectedIds.join(",");
      role = selectedRole;
    } else if (selectedManagers.length > 0) {
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

    fetchData(ids, role, startDate, endDate);
    setShowFilterButton(true);
    setShowCloseButton(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest(".filter-option button")
      ) {
        setActiveFilterOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      handleDisplayManagers();
    }
  };

  const fetchEmployeeCount = async (ids, role) => {
    if (userType !== "Recruiters") {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/head-count/${role}/${ids}`
        );
        setEmployeeCount(response.data);
      } catch (error) {
        console.error("Error fetching employee count:", error);
      }
    }
  };

  useEffect(() => {
    if (userType) {
      fetchEmployeeCount(employeeId, userType);
    }
    if (selectedManagers.length > 0) {
      const ids = selectedManagers
        .map((manager) => manager.managerId)
        .join(",");
      const role = selectedManagers[0].managerJobRole;
      fetchEmployeeCount(ids, role);
    } else if (selectedTeamLeaders.length > 0) {
      const ids = selectedTeamLeaders
        .map((teamLeader) => teamLeader.teamLeaderId)
        .join(",");
      const role = selectedTeamLeaders[0].teamLeaderJobRole;
      fetchEmployeeCount(ids, role);
    }
  }, [selectedManagers, selectedTeamLeaders, employeeId, userType]);

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
  const getStatusClassName = (status) => {
    switch (status) {
      case "Poor":
        return "status-poorattendanceform";
      case "Average":
        return "status-averageattendanceform";
      case "Yellow":
        return "status-averageattendanceform";
      case "Green":
        return "status-greenattendanceform";
      default:
        return "";
    }
  };

  const handleMouseOver = (event) => {
    const tableData = event.currentTarget;
    const tooltip = tableData.querySelector(".tooltipattendanceform");
    const tooltiptext = tableData.querySelector(".tooltiptextattendanceform");

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
    const tooltip = event.currentTarget.querySelector(".tooltipattendanceform");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
    }
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
    // Update the selected team leader name when checking/unchecking
    if (
      !selectedTeamLeaders.some(
        (item) => item.teamLeaderId === teamLeader.teamLeaderId
      )
    ) {
      setSelectedTeamLeaderName(teamLeader.teamLeaderName);
    } else {
      setSelectedTeamLeaderName("");
    }
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

  const formatOption = (option) => {
    switch (option) {
      case "employeeName":
        return "Employee Name";
      case "jobRole":
        return "Job Role";
      default:
        return option;
    }
  };

  const toggleManagerExpand = (managerId) => {
    setExpandedManagerId(expandedManagerId === managerId ? null : managerId);
    setExpandedTeamLeaderId(null); // Close any open team leaders when a new manager is expanded
  };

  const toggleTeamLeaderExpand = (teamLeaderId) => {
    setExpandedTeamLeaderId(
      expandedTeamLeaderId === teamLeaderId ? null : teamLeaderId
    );
  };

  // Arshad Attar Work On Fillter 09-10-2024
  const limitedOptions = [
    ["date", "Date"],
    ["employeeId", "Employee Id"],
    ["employeeName", "Employee Name"],
    ["jobRole", "Job Role"],
    // ["teamLeader", "Team Leader Id"],
    ["loginTime", "Login Time"],
    ["logoutTime", "Log Out Time"],
    ["lateMark", "Late Marks"],
    ["remoteWork", "Work Type"],
  ];

  const filterData = () => {
    let filteredData = [...attendanceDataNew];

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
    setAttendanceData(filteredData);
  };

  // Arshad Added This 09-10-2024

  // useEffect(() => {
  //   if (Object.keys(selectedFilters).length > 0) {
  //     filterData(); // Apply filters if any are selected
  //   } else {
  //     setAttendanceData(attendanceData); // Show full data if no filters are selected
  //   }
  // }, [selectedFilters]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, attendanceData]);

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
    setActiveFilterOption(null); // Ensure no filter dropdown is active by default
  };

  // const handleFilterSelect = (key, value) => {
  //   setSelectedFilters((prev) => {
  //     const currentSelections = prev[key] || [];

  //     // Toggle selection
  //     const newSelections = currentSelections.includes(value)
  //       ? currentSelections.filter((item) => item !== value) // Remove if already selected
  //       : [...currentSelections, value]; // Add if not selected

  //     const updatedFilters = { ...prev, [key]: newSelections };

  //     // If all selections for this key are removed, remove the key from filters
  //     if (newSelections.length === 0) {
  //       delete updatedFilters[key];
  //     }

  //     return updatedFilters;
  //   });
  // };

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value.toLowerCase())
        : [...prev[key], value.toLowerCase()], // store filter values in lowercase
    }));
  };

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

  // Fetch images for managers, team leaders, and recruiters
  useEffect(() => {
    const fetchAllImagesForManagers = async () => {
      const images = await Promise.all(
        managers.map(async (manager) => {
          return await getUserImageFromApiForReport(
            manager.managerId,
            manager.jobRole
          );
        })
      );
      setAllImagesForManagers(images);
    };

    fetchAllImagesForManagers();
  }, [managers]);

  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      const images = await Promise.all(
        teamLeaders.map(async (teamLeader) => {
          return await getUserImageFromApiForReport(
            teamLeader.teamLeaderId,
            teamLeader.jobRole
          );
        })
      );
      setAllImagesForTeamLeaders(images);
    };

    fetchAllImagesForTeamLeaders();
  }, [teamLeaders]);
  const handleSelectAllNew = (role) => {
    console.log(role);
    console.log(selectedRole);

    let newIds = [];

    if (role === "Manager") {
      newIds = managersList.map((manager) => manager.managerId);
    } else if (role === "TeamLeader") {
      newIds = teamLeadersList.map((leader) => leader.teamLeaderId);
    } else if (role === "Recruiters") {
      newIds = recruitersList.map((recruiter) => recruiter.employeeId);
    }

    setSelectedIds((prevIds) => {
      // Keep previous selections if the role was already selected
      return selectedRole === role ? [...prevIds, ...newIds] : newIds;
    });

    setSelectedRole(role);
  };
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      const images = await Promise.all(
        recruiters.map(async (recruiter) => {
          // return await getUserImageFromApiForReport(
          //   recruiter.employeeId,
          //   recruiter.jobRole
          // );
        })
      );
      setAllImagesForRecruiters(images);
    };

    fetchAllImagesForRecruiters();
  }, [recruiters]);

  // Render managers list
  const renderManagers = () => {
    return managers.map((manager, index) => (
      <div key={manager.managerId} className="dropdown-sectionattendanceform">
        <div className="PI-dropdown-rowattendanceform">
          <Checkbox
            checked={selectedManagers.some(
              (item) => item.managerId === manager.managerId
            )}
            onChange={() => handleManagerCheckboxChange(manager)}
          />
          <Avatar
            src={
              allImagesForManagers.length > 0
                ? allImagesForManagers[index] !== null
                  ? allImagesForManagers[index]
                  : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
            }
          />
          <label
            className="clickable-labelattendanceform"
            onClick={() => toggleManagerExpand(manager.managerId)}
          >
            {manager.managerName}
            <i
              className={`fa-solid ${expandedManagerId === manager.managerId
                ? "fa-angle-up"
                : "fa-angle-down"
                }`}
            ></i>
          </label>
        </div>
        <Divider />
        {expandedManagerId === manager.managerId && (
          <div className="PI-dropdown-columnattendanceform">
            {renderTeamLeaders(manager.managerId)}
          </div>
        )}
      </div>
    ));
  };

  // Render team leaders list
  const renderTeamLeaders = (managerId) => {
    return teamLeaders.map((teamLeader, index) => (
      <div
        key={teamLeader.teamLeaderId}
        className="PI-dropdown-sectionattendanceform"
      >
        <div className="PI-dropdown-rowattendanceform">
          <Checkbox
            checked={selectedTeamLeaders.some(
              (item) => item.teamLeaderId === teamLeader.teamLeaderId
            )}
            onChange={() => handleTeamLeaderCheckboxChange(teamLeader)}
          />
          <Avatar
            src={
              allImagesForTeamLeaders.length > 0
                ? allImagesForTeamLeaders[index] !== null
                  ? allImagesForTeamLeaders[index]
                  : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
            }
          />
          <label
            className="clickable-labelattendanceform"
            onClick={() => toggleTeamLeaderExpand(teamLeader.teamLeaderId)}
          >
            {teamLeader.teamLeaderName}
            <i
              className={`fa-solid ${expandedTeamLeaderId === teamLeader.teamLeaderId
                ? "fa-angle-up"
                : "fa-angle-down"
                }`}
            ></i>
          </label>
        </div>
        <Divider />
        {expandedTeamLeaderId === teamLeader.teamLeaderId && (
          <div className="PI-dropdown-columnattendanceform">
            {renderRecruiters()}
          </div>
        )}
      </div>
    ));
  };

  // Render recruiters list
  const renderRecruiters = () => {
    return recruiters.map((recruiter, index) => (
      <div key={recruiter.employeeId} className="PI-dropdown-rowattendanceform">
        <Checkbox
          checked={selectedRecruiters.some(
            (item) => item.recruiterId === recruiter.employeeId
          )}
          onChange={() => handleRecruiterCheckboxChange(recruiter)}
        />
        <Avatar
          src={
            allImagesForRecruiters.length > 0
              ? allImagesForRecruiters[index] !== null
                ? allImagesForRecruiters[index]
                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
              : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
          }
        />
        <label className="attendanceform">{recruiter.employeeName}</label>

        <Divider />
      </div>
    ));
  };

  // Function to categorize performance
  const categorizePerformance = (target, achieved) => {
    const achievementRate = (achieved / target) * 100;

    let status;
    if (achievementRate > 75) {
      status = "Green";
    } else if (achievementRate >= 61) {
      status = "Yellow";
    } else if (achievementRate >= 26) {
      status = "Average";
    } else {
      status = "Poor";
    }

    return {
      status,
      achievementRate: achievementRate.toFixed(2) + "%",
    };
  };
  //rajlaxmi jagadale change all classNmae
  // Rajlaxmi jagadale chnage that code
  return (
    <div className="attendanceform">
      {/* rajlaxmi jagadale addthat line toastify */}
      {/*<ToastContainer position="top-right" autoClose={5000} />*/}
      <div className="attendance-headingattendanceform">
        <h1>Attendance Data</h1>
      </div>
      <div className="PI-full-width-PI-half-heightattendanceform">
        <div className="PI-containerattendanceform">
          <div
            className="PI-dropdown-container-mainattendanceform"
            ref={filterRef}
          >
            {userType === "Recruiters" && (
              <span className="attendanceform">Recruiter</span>
            )}
            {userType === "TeamLeader" && (
              <span className="attendanceform">Team Leader</span>
            )}
            {userType === "Manager" && (
              <span style={{ fontWeight: "700" }} className="attendanceform">
                Manager
              </span>
            )}
            {userType === "SuperUser" && (
              <span className="attendanceform">Super User</span>
            )}
            <div className="PI-dropdown-containerattendanceform">
              <div
                className="PI-Dropdownattendanceform"
                onClick={toggleDropdown}
              >
                {userType === "SuperUser" && (
                  <span className="attendanceform">
                    Select Manager OR Team Leader
                  </span>
                )}
                {userType === "Manager" && (
                  <span className="attendanceform">
                    {selectedRole === "TeamLeader" && selectedIds.length > 0
                      ? `Selected ${selectedIds.length} Team Leader`
                      : selectedRole === "Recruiters" && selectedIds.length > 0
                        ? `Selected ${selectedIds.length} Recruiter`
                        : "Select TL / Recruiters"}
                  </span>
                )}
                {userType === "TeamLeader" && (
                  <span className="attendanceform">Select Recruiters</span>
                )}
                {userType === "Recruiters" && (
                  <span className="attendanceform">{loginEmployeeName}</span>
                )}
                <span className={`dropdown-iconattendanceform`} />
                <i
                  className={`fa-solid ${dropdownOpen ? "fa-angle-up" : "fa-angle-down"
                    }`}
                ></i>
              </div>
              {/* rajlaxmi jagadale added that model */}
              {displayModalContainer && (
                <>
                  <Modal
                    className="modaldfattendanceform"
                    width={1000}
                    open={displayModalContainer && userType !== "Recruiters"}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    style={{
                      top: 20,
                      right: 20,
                      position: "absolute",
                    }}
                  >
                    <div className="mainForListsattendanceform">
                      {displayManagers ? (
                        <Card
                          hoverable
                          style={{
                            width: 300,
                            marginRight: 10,
                            height: "65vh",
                            overflowY: "scroll",
                          }}
                          title={
                            <div className="newclearbuttonaddclassattendanceform">
                              <span className="attendanceform">Managers</span>
                              {!managersList.every((manager) =>
                                selectedIds.includes(manager.managerId)
                              ) && (
                                  <Button
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => handleSelectAllNew("Manager")}
                                  >
                                    Select All
                                  </Button>
                                )}
                              {selectedRole === "Manager" &&
                                selectedIds.length > 0 && (
                                  <button
                                    className="clearbuttonReportattendanceform"
                                    onClick={() =>
                                      handleClearSelection("Managers")
                                    }
                                  >
                                    <ClearOutlined className="newcolorforcleariconattendanceform" />
                                  </button>
                                )}
                            </div>
                          }
                        >
                          <List
                            itemLayout="horizontal"
                            dataSource={managersList}
                            renderItem={(item, index) => (
                              <List.Item
                                key={item.managerId}
                                className={
                                  hasSelectedChildren(item.managerId, "Manager")
                                    ? "highlight-itemattendanceform"
                                    : ""
                                }
                              >
                                <input
                                  className="managersTeamRecruitersInputMarginattendanceform"
                                  type="checkbox"
                                  checked={
                                    selectedRole === "Manager" &&
                                    selectedIds.includes(item.managerId)
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(
                                      "Manager",
                                      item.managerId,
                                      item
                                    )
                                  }
                                />
                                <List.Item.Meta
                                  avatar={
                                    allImagesForManagers.length === 0 ? (
                                      <Skeleton.Avatar active />
                                    ) : (
                                      <Avatar
                                        src={
                                          allImagesForManagers.length > 0
                                            ? allImagesForManagers[index] !==
                                              null
                                              ? allImagesForManagers[index]
                                              : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                            : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                        }
                                      />
                                    )
                                  }
                                  title={item.managerName}
                                />
                                <svg
                                  onClick={(e) => {
                                    handleOpenDownArrowContent(item.managerId);
                                    toggleManager(item.managerId);
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="#000000"
                                  className={
                                    activeManager === item.managerId
                                      ? "rotate-iconattendanceform"
                                      : ""
                                  }
                                >
                                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                </svg>
                              </List.Item>
                            )}
                          />
                        </Card>
                      ) : (
                        displayBigSkeletonForManagers && (
                          <Skeleton.Node
                            active={true}
                            style={{
                              width: 300,
                              height: "65vh",
                            }}
                          />
                        )
                      )}
                      {displayTeamLeaders ? (
                        <>
                          {
                            <Card
                              hoverable
                              style={{
                                width: 300,
                                marginRight: 10,
                                height: "65vh",
                                overflowY: "scroll",
                              }}
                              title={
                                <div className="newclearbuttonaddclassattendanceform">
                                  <span className="attendanceform">
                                    Team Leaders
                                  </span>
                                  {!teamLeadersList.every((teamLeader) =>
                                    selectedIds.includes(
                                      teamLeader.teamLeaderId
                                    )
                                  ) && (
                                      <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={() =>
                                          handleSelectAllNew("TeamLeader")
                                        }
                                      >
                                        Select All
                                      </Button>
                                    )}
                                  {selectedRole === "TeamLeader" &&
                                    selectedIds.length > 0 && (
                                      <button
                                        className="clearbuttonReportattendanceform"
                                        onClick={() =>
                                          handleClearSelection("Team Leaders")
                                        }
                                      >
                                        <ClearOutlined className="newcolorforcleariconattendanceform" />
                                      </button>
                                    )}
                                </div>
                              }
                            >
                              <List
                                itemLayout="horizontal"
                                dataSource={teamLeadersList}
                                renderItem={(teamLeader, index) => (
                                  <List.Item
                                    key={teamLeader.teamLeaderId}
                                    className={
                                      hasSelectedChildren(
                                        teamLeader.teamLeaderId,
                                        "TeamLeader"
                                      )
                                        ? "highlight-itemattendanceform"
                                        : ""
                                    }
                                  >
                                    <input
                                      className="managersTeamRecruitersInputMarginattendanceform"
                                      type="checkbox"
                                      checked={
                                        selectedRole === "TeamLeader" &&
                                        selectedIds.includes(
                                          teamLeader.teamLeaderId
                                        )
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          "TeamLeader",
                                          teamLeader.teamLeaderId,
                                          teamLeader
                                        )
                                      }
                                    />
                                    <List.Item.Meta
                                      avatar={
                                        allImagesForTeamLeaders.length === 0 ? (
                                          <Skeleton.Avatar active />
                                        ) : (
                                          <Avatar
                                            src={
                                              allImagesForTeamLeaders.length > 0
                                                ? allImagesForTeamLeaders[
                                                  index
                                                ] !== null
                                                  ? allImagesForTeamLeaders[
                                                  index
                                                  ]
                                                  : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                            }
                                          />
                                        )
                                      }
                                      title={teamLeader.teamLeaderName}
                                    />
                                    <svg
                                      onClick={(e) => {
                                        handleOpenDownArrowContentForRecruiters(
                                          teamLeader.teamLeaderId,
                                          teamLeader.teamLeaderName
                                        );
                                        toggleTeamLeader(
                                          teamLeader.teamLeaderId
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24px"
                                      viewBox="0 -960 960 960"
                                      width="24px"
                                      fill="#000000"
                                      className={
                                        activeTeamLeader ===
                                          teamLeader.teamLeaderId
                                          ? "rotate-iconattendanceform"
                                          : ""
                                      }
                                    >
                                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                    </svg>
                                  </List.Item>
                                )}
                              />
                            </Card>
                          }
                        </>
                      ) : (
                        displayBigSkeletonForTeamLeaders && (
                          <Skeleton.Node
                            active={true}
                            style={{
                              width: 300,
                              height: "65vh",
                            }}
                          />
                        )
                      )}
                      {displayRecruiters ? (
                        <>
                          {
                            <Card
                              hoverable
                              style={{
                                width: 300,
                                height: "65vh",
                                overflowY: "scroll",
                              }}
                              title={
                                <div className="newclearbuttonaddclassattendanceform">
                                  <span className="attendanceform">
                                    Recruiters
                                  </span>
                                  {!recruitersList.every((recruiter) =>
                                    selectedIds.includes(recruiter.employeeId)
                                  ) && (
                                      <Button
                                        color="primary"
                                        variant="outlined"
                                        onClick={() =>
                                          handleSelectAllNew("Recruiters")
                                        }
                                      >
                                        Select All
                                      </Button>
                                    )}
                                  {selectedRole === "Recruiters" &&
                                    selectedIds.length > 0 && (
                                      <button
                                        className="clearbuttonReportattendanceform"
                                        onClick={() =>
                                          handleClearSelection("Recruiters")
                                        }
                                      >
                                        <ClearOutlined className="newcolorforcleariconattendanceform" />
                                      </button>
                                    )}
                                </div>
                              }
                            >
                              <List
                                itemLayout="horizontal"
                                dataSource={recruitersList}
                                renderItem={(recruiter, index) => (
                                  <List.Item key={recruiter.employeeId}>
                                    <input
                                      className="managersTeamRecruitersInputMarginattendanceform"
                                      type="checkbox"
                                      checked={
                                        selectedRole === "Recruiters" &&
                                        selectedIds.includes(
                                          recruiter.employeeId
                                        )
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          "Recruiters",
                                          recruiter.employeeId,
                                          recruiter
                                        )
                                      }
                                    />
                                    <List.Item.Meta
                                      avatar={
                                        allImagesForRecruiters.length === 0 ? (
                                          <Skeleton.Avatar active />
                                        ) : (
                                          <Avatar
                                            src={
                                              allImagesForRecruiters.length > 0
                                                ? allImagesForRecruiters[
                                                  index
                                                ] !== null
                                                  ? allImagesForRecruiters[
                                                  index
                                                  ]
                                                  : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                            }
                                          />
                                        )
                                      }
                                      title={recruiter.employeeName}
                                    />
                                  </List.Item>
                                )}
                              />
                            </Card>
                          }
                        </>
                      ) : (
                        displayBigSkeletonForRecruiters && (
                          <Skeleton.Node
                            active={true}
                            style={{
                              width: 300,
                              height: "65vh",
                            }}
                          />
                        )
                      )}
                    </div>
                  </Modal>
                </>
              )}
            </div>

            <div className="PI-Countattendanceform">
              {userType === "SuperUser" && (
                <div className="PI-superuser-divattendanceform">
                  <p className="attendanceform">
                    Manager :{" "}
                    {selectedRole === "Manager" ? selectedIds.length : 0}
                  </p>
                  <p className="attendanceform">
                    Team Leader :{" "}
                    {selectedRole === "TeamLeader"
                      ? selectedIds.length
                      : employeeCount.teamLeaderCount ||
                      selectedTeamLeaders.length}
                  </p>
                  <p className="attendanceform">
                    Recruiter :{" "}
                    {selectedRole === "Recruiters"
                      ? selectedIds.length
                      : employeeCount.employeeCount}
                  </p>
                </div>
              )}
              {userType === "Manager" && (
                <div className="leftsidecontentattendanceform">
                  <p className="attendanceform">
                    Team Leader :{" "}
                    {selectedRole === "TeamLeader"
                      ? selectedIds.length
                      : selectedTeamLeaders.length ||
                      employeeCount.teamLeaderCount}
                  </p>
                  <p className="attendanceform">
                    Recruiter :{" "}
                    {selectedRole === "Recruiters"
                      ? selectedIds.length
                      : employeeCount.employeeCount}
                  </p>
                </div>
              )}
              {userType === "TeamLeader" && (
                <>
                  <p className="attendanceform">
                    Recruiter :{" "}
                    {selectedRole === "Recruiters"
                      ? selectedIds.length
                      : employeeCount.employeeCount}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* rajlaxmi jagadale some change that div */}
          <div className="PI-attendance-formattendanceform">

            <div className="PI-radio-buttonsattendanceform">
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="currentMonthattendanceform"
                    name="dateRange"
                    value="currentMonth"
                    checked={dateRange === "currentMonth"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Current Month</span>
                </label>
              </div>
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="lastMonthattendanceform"
                    name="dateRange"
                    value="lastMonth"
                    checked={dateRange === "lastMonth"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Last Month</span>
                </label>
              </div>
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="last3Monthsattendanceform"
                    name="dateRange"
                    value="last3Months"
                    checked={dateRange === "last3Months"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Last 3 Months</span>
                </label>
              </div>
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="last6Monthsattendanceform"
                    name="dateRange"
                    value="last6Months"
                    checked={dateRange === "last6Months"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Last 6 Months</span>
                </label>
              </div>
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="lastYearattendanceform"
                    name="dateRange"
                    value="lastYear"
                    checked={dateRange === "lastYear"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Last 1 Year</span>
                </label>
              </div>
              <div className="attendanceform">
                <label className="PI-radio-labelattendanceform">
                  <input
                    type="radio"
                    id="customattendanceform"
                    name="dateRange"
                    value="custom"
                    checked={dateRange === "custom"}
                    onChange={handleDateRangeChange}
                    className="form-radioattendanceform"
                  />
                  <span className="attendanceform">Custom Date</span>
                </label>
              </div>
            </div>
            <div className="attendanceform">
              {dateRange === "custom" && (
                <div className="date-inputsattendanceform">
                  <div className="date-containerattendanceform">
                    <label className="date-labelattendanceform">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={handleCustomStartDateChange}
                      className="date-pickerattendanceform"
                    />
                  </div>

                  <div className="date-containerattendanceform">
                    <label className="date-labelattendanceform">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={handleCustomEndDateChange}
                      className="date-pickerattendanceform"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="PI-filtersattendanceform">
              <button
                className="PIE-filter-Btnattendanceform"
                onClick={showDataReport}
              >
                Get Attendance
              </button>
            </div>

            <div
              className={`${getStatusClassName(summary.performanceStatus)}`}
              id="total-Performance-percentageattendanceform"
            >
              <p className="attendanceform">Achievement Rate</p>-
              <p className="attendanceform">
                {" "}
                <strong>{summary.achievementRate}</strong>
              </p>
              <p className="attendanceform">Performance Status</p> -
              <p className="attendanceform">
                {" "}
                <strong>{summary.performanceStatus}</strong>
              </p>
            </div>
          </div>
          {/* rajlaxmi jagadale added that code line 1620 to 1661 */}
          <div className="attendance-containerattendanceform">
            <div className="headerattendanceform">
              {/* <h2 className="attendanceform-heading">Attendance data</h2> */}
              {/*<FontAwesomeIcon
                icon={faXmark}
                className="close-iconattendanceform"
                onClick={onCloseIncentive}
              />*/}
            </div>

            {/*<ToastContainer position="top-right" autoClose={5000} />*/}

            {/* Samruddhi Patole 08/09/25 */}
            <div className="grid-containerattendanceform">
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Working <br /> Days</p>
                <p className="attendanceform">{summary.workingDays}</p>
              </div>
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Total<br /> Hours</p>
                <p className="attendanceform">{summary.totalWorkingHours}</p>
              </div>
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Total <br />Target</p>
                <p className="attendanceform">{summary.totalTarget}</p>
              </div>
              {(() => {
                // Determine which IDs to display
                const filteredIds =
                  selectedFilters.employeeId && selectedFilters.employeeId.length > 0
                    ? selectedFilters.employeeId
                    : selectedIds && selectedIds.length > 0
                      ? selectedIds
                      : [];
                if (filteredIds.length === 0) {
                  let totalPresent = 0;
                  let totalAbsent = 0;
                  attendanceDataNew.forEach((data) => {
                    const loginTime = (data.loginTime || "").trim();

                    const hasLogin =
                      loginTime &&
                      loginTime !== "00:00" &&
                      loginTime !== "0" &&
                      loginTime !== "0:00" &&
                      loginTime !== "00:00:00";

                    if (hasLogin) totalPresent++;
                    else totalAbsent++;
                  });
                  return (
                    <>
                      <div className="grid-itemattendanceform compact-block">
                        <p className="item-titleattendanceform">Present</p>
                        <p className="attendanceform">{totalPresent}</p>
                      </div>
                      <div className="grid-itemattendanceform compact-block">
                        <p className="item-titleattendanceform">Absent</p>
                        <p className="attendanceform">{totalAbsent}</p>
                      </div>
                    </>
                  );
                }
                // Single user → show blocks
                if (filteredIds.length === 1) {
                  const userId = filteredIds[0];
                  const userRecords = attendanceDataNew.filter(
                    (item) => item.employeeId.toString() === userId.toString()
                  );
                  // const dailyArchived = userRecords.reduce(
                  //     (sum, data) => sum + (Number(data.dailyArchived) || 0),
                  //     0
                  //   );
                  let present = 0;
                  let absent = 0;

                  // userRecords.forEach((data) => {
                  //   const loginTime = (data.loginTime || "").trim();
                  //   const hasLogin =
                  //     loginTime &&
                  //     loginTime !== "00:00" &&
                  //     loginTime !== "0" &&
                  //     loginTime !== "0:00" &&
                  //     loginTime !== "00:00:00";

                  //   if (hasLogin) present++;
                  //   else absent++;

                  // });
                  userRecords.forEach((data) => {
                    if (Number(data.dailyArchived) >= 3) {
                      present++;
                    } else {
                      absent++;
                    }
                  });

                  const notLogin = summary.workingDays - present - absent;

                  return (
                    <>
                      <div className="grid-itemattendanceform compact-block">
                        <p className="item-titleattendanceform">Present</p>
                        <p className="attendanceform">{present}</p>
                      </div>
                      <div className="grid-itemattendanceform compact-block">
                        <p className="item-titleattendanceform">Absent</p>
                        <p className="attendanceform">{absent}</p>
                      </div>
                      <div className="grid-itemattendanceform compact-block">
                        <p className="item-titleattendanceform">Not Login Days</p>
                        <p className="attendanceform">{notLogin}</p>
                      </div>

                    </>
                  );
                }
                // Multiple users or filtered IDs → show table
                return (
                  <div className="grid-itemattendanceform merged-box">
                    <div className="attendance-table-container">
                      <table className="attendance-summary-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Not Login Days</th>

                          </tr>
                        </thead>
                        <tbody>
                          {filteredIds
                            .map(id => id)
                            .sort((a, b) => Number(a) - Number(b))
                            .map((id) => {
                              const userRecords = attendanceDataNew.filter(
                                (item) => item.employeeId.toString() === id.toString()
                              );
                              //       const dailyArchived = userRecords.reduce(
                              //   (sum, data) => sum + (Number(data.dailyArchived) || 0),
                              //   0
                              // );
                              let present = 0;
                              let absent = 0;

                              userRecords.forEach((data) => {
                                if (Number(data.dailyArchived) >= 3) {
                                  present++;
                                } else {
                                  absent++;
                                }
                              });

                              const notLogin = summary.workingDays - present - absent;

                              return (
                                <tr key={id}>
                                  <td>{id}</td>
                                  <td>{present}</td>
                                  <td>{absent}</td>
                                  <td>{notLogin}</td>

                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Weekends</p>
                <p className="attendanceform">{summary.weekends}</p>
              </div>
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Archived</p>
                <p className="attendanceform">{summary.archived}</p>
              </div>
              <div className="grid-itemattendanceform compact-block">
                <p className="item-titleattendanceform">Pending</p>
                <p className="attendanceform">{summary.pending}</p>
              </div>
            </div>
          </div>
        </div>
        {/* {showFilterButton && (
            <button
              className="lineUp-Filter-btnattendanceform"
              onClick={toggleFilterSection}
            >
              Filter <i className="fa-solid fa-filter"></i>
            </button>
          )} */}
        <div className="filter-dropdowns">
          {/* {showFilterSection && ( */}
          <div className="filter-section newclassnameforfiltercenter">
            {limitedOptions.map(([optionKey, optionLabel]) => {
              const uniqueValues = Array.from(
                new Set(
                  attendanceDataNew
                    .map((item) => item[optionKey]?.toString().toLowerCase())
                    .filter(
                      (value) =>
                        value &&
                        value !== "-" &&
                        !(optionKey === "alternateNumber" && value === "0")
                    )
                )
              );

              // Rajlaxmi jagadle  Added countSelectedValues that code date 20-02-2025 line 987/1003

              return (
                <div>
                  <div key={optionKey} className="filter-option">
                    <button
                      className={`white-Btn ${(selectedFilters[optionKey] &&
                        selectedFilters[optionKey].length > 0) ||
                        activeFilterOption === optionKey
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
                </div>
              );
            })}

            <button
              className="clr-button lineUp-Filter-btn"
              onClick={handleClearAll}
            >
              Clear Filters
            </button>
            {/* Nikita Shirsath - 08-07-2025 */}
            {/*<button
        onClick={handleDownloadPdf}
        className="clr-button lineUp-Filter-btn setMarginleftnewbysahilinaattendance"
      >
<DownloadOutlined />      </button>*/}
          </div>

          {/* )} */}
        </div>
      </div>
      {/* Nikita Shirsath - 08-07-2025 */}


      <div ref={tableRef} className="PI-attendance-containerattendanceform" >
        <table className="PI-attendance-tableattendanceform">
          <thead className="PI-attendancerows-headattendanceform">
            <tr className="attendanceform">
              <th className="PI-attendanceheadingattendanceform">Sr No</th>
              <th className="PI-attendanceheadingattendanceform">
                Working Date
              </th>
              <th className="PI-attendanceheadingattendanceform">
                Employee Name
              </th>
              <th className="PI-attendanceheadingattendanceform">Job Role</th>
              <th
                className="PI-attendanceheadingattendanceform"
                style={{ paddingRight: "15px" }}
              >
                Login Time
              </th>
              <th className="PI-attendanceheadingattendanceform">Late Mark</th>
              <th className="PI-attendanceheadingattendanceform">
                Calling Count
              </th>
              <th className="PI-attendanceheadingattendanceform">Target</th>
              <th className="PI-attendanceheadingattendanceform">Archived</th>
              <th className="PI-attendanceheadingattendanceform">Pending</th>
              <th className="PI-attendanceheadingattendanceform">Leave Type</th>
              <th className="PI-attendanceheadingattendanceform">Half Days</th>
              <th className="PI-attendanceheadingattendanceform">
                Holiday Leave
              </th>
              <th className="PI-attendanceheadingattendanceform">Work Type</th>
              <th className="PI-attendanceheadingattendanceform">Day Status</th>
              <th className="PI-attendanceheadingattendanceform">
                Working Hours
              </th>
              <th
                className="PI-attendanceheadingattendanceform"
                style={{ paddingRight: "15px" }}
              >
                Logout Time
              </th>
              <th className="PI-attendanceheadingattendanceform">
                Employee Id
              </th>
              <th className="PI-attendanceheadingattendanceform">
                Team Leader Id
              </th>
            </tr>
          </thead>
          <tbody className="attendanceform">
            {attendanceData.map((data, index) => (
              <tr key={index} className="PI-attendancerowsattendanceform">
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {index + 1}
                  {/* <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {index + 1}
                    </span>
                  </div> */}
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.date}
                  {/* <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.date}
                    </span>
                  </div> */}
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.employeeName}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.employeeName}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.jobRole}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.jobRole}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.loginTime}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.loginTime}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.lateMark}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.lateMark}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.callingCount}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.callingCount}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.dailyTarget}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.dailyTarget}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.dailyArchived}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.dailyArchived}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.dailyPending}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.dailyPending}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.leaveType}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.leaveType}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.halfDay}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.halfDay}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.holidayLeave}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.holidayLeave}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.remoteWork}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.remoteWork}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.dayPresentStatus}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.dayPresentStatus}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.totalHoursWork}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.totalHoursWork}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.logoutTime}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.logoutTime}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.employeeId}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.employeeId}
                    </span>
                  </div>
                </td>
                <td
                  className="tabledataattendanceform"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {data.teamLeader}
                  <div className="tooltipattendanceform">
                    <span className="tooltiptextattendanceform">
                      {data.teamLeader}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};


export default Attendance;
