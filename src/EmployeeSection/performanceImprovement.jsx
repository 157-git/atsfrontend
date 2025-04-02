import { useState, useEffect, useCallback, useRef } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import { Avatar, Button } from "antd";
import { getUserImageFromApiForReport } from "../Reports/getUserImageFromApiForReport";

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
// import PerformanceMeter from "./performanceMeter";
import { convertNewDateToFormattedDateTime } from "../TeamLeader/convertNewDateToFormattedDateTime";
import { calculateTotalTimeDifferenceAndAdditionForTimeDifferences } from "./calculateTotalTimeDifferenceAndAdditionForTimeDifferences";
import { subtractTimeDurations } from "./subtractTimeDurations";
import { convertMinutesToTimeFormat } from "./convertMinutesToTimeFormat";
import {
  cleanTimeStringPlusMinus,
  cleanTimeStringSpaces,
  removeLeadingZeros,
} from "./removeLeadingZeros";
import { Card, List, Modal, Skeleton } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { convertTimeStringToMinutes } from "./convertTimeStringToMinutes";
import { convertTimeStringsToMinutesForChart } from "./convertTimeStringsToMinutesForChart";
import { Pagination } from "antd";
import { API_BASE_URL } from "../api/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [displayBigSkeletonForManagers, setDisplayBigSkeletonForManagers] =
    useState(false);
  const [
    displayBigSkeletonForTeamLeaders,
    setDisplayBigSkeletonForTeamLeaders,
  ] = useState(false);
  const [displayBigSkeletonForRecruiters, setDisplayBigSkeletonForRecruiters] =
    useState(false);
  const [activeManager, setActiveManager] = useState(null);
  const [activeTeamLeader, setActiveTeamLeader] = useState(null);
  const [managerToTeamLeaders, setManagerToTeamLeaders] = useState({});
  const [teamLeaderToRecruiters, setTeamLeaderToRecruiters] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [allImagesForManagers, setAllImagesForManagers] = useState([]);
  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([]);
  const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([]); // Initialize as an array
  const [selectedRole, setSelectedRole] = useState("");
  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [displayMoreButton, setDisplayMoreButton] = useState(false);
  const [startDate1, setStartDate1] = useState("");
  const [endDate1, setEndDate1] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalStartDatePropState, setFinalStartDatePropState] = useState("");
  const [finalEndDatePropState, setFinalEndDatePropState] = useState("");
  const [reportDataDatewise, setReportDataDatewise] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

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
        const duration = Number.parseFloat(item.candidateFormFillingDuration);
        if (!isNaN(duration)) {
          totalMinutes += duration;
        }
      } else if (item.mailToClient) {
        const duration = Number.parseFloat(item.mailToClient);
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
      const duration = intervalToDuration({
        start: 0,
        end: totalSeconds * 1000,
      });
      return formatDuration(duration, {
        format: ["days", "hours", "minutes", "seconds"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [displayModalContainer, setDisplayModalContainer] = useState(false);
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
    // setDisplayModalContainer(true);
  };
  // Rajlaxmi jagadale line 284/309
  const handleOkey = () => {
    setDisplayModalContainer(false);
  };
  const handleCancels = () => {
    setDisplayModalContainer(false);
  };
  const handleOptionChange = async (event) => {
    const value = event.target.value;

    setSelectedOption(value);

    if (value === "custom") {
      setDisplayModalContainer(false);
      setShowCustomDiv(true);
      return;
    }

    if (selectedRole === "" && selectedIds.length === 0) {
      setDisplayModalContainer(true);
      setShowCustomDiv(false);
      handleDisplayManagers();
      setDisplayMoreButton(true);
    } else {
      setDisplayModalContainer(false);
    }

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
          startDate = new Date(
            today.getFullYear() - 1,
            today.getMonth() + 1,
            1
          );
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
        default:
          break;
      }
      return { startDate, endDate };
    };

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
        setLoading(false); // Ensures loading is disabled even if API fails
      }
    }
  };
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
    if (!ids || !startDate || !endDate || !role) {
      return;
    } else {
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
  const toggleManager = (managerId) => {
    if (activeManager === managerId) {
      // If the same manager is clicked again, reverse the rotation
      setActiveManager(null);
    } else {
      // Rotate the new manager's icon and reverse the previous one
      setActiveManager(managerId);
    }
  };
  // Rajlaxmi Jagadale added that code of modal line 466/559
  const handleOpenDownArrowContent = async (managerid) => {
    setDisplayTeamLeaders(false);
    // setSelectedIds([]);
    setAllImagesForTeamLeaders([]);
    try {
      setDisplayBigSkeletonForTeamLeaders(true);
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${managerid}`
      );
      setTeamLeadersList(response.data);
      setManagerToTeamLeaders((prev) => ({
        ...prev,
        [managerid]: response.data.map((tl) => tl.teamLeaderId), // Map manager to team leaders
      }));
      setDisplayBigSkeletonForTeamLeaders(false);
      setDisplayTeamLeaders(true);
      setDisplayRecruiters(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId) => {
    setDisplayRecruiters(false);
    // setSelectedIds([]);
    setAllImagesForRecruiters([]);
    setDisplayBigSkeletonForRecruiters(true);
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
    );
    setRecruitersList(response.data);
    setTeamLeaderToRecruiters((prev) => ({
      ...prev,
      [teamLeaderId]: response.data.map((recruiter) => recruiter.employeeId), // Map team leader to recruiters
    }));
    setDisplayBigSkeletonForRecruiters(false);
    setDisplayRecruiters(true);
  };

  // Function to handle image loading errors
  const handleImageError = (id, type) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [`${type}-${id}`]: true,
    }));
  };

  // Function to get fallback image URL with seed
  const getFallbackImageUrl = (index) => {
    return `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;
  };

  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      if (recruitersList && recruitersList.length > 0) {
        try {
          const images = await Promise.all(
            recruitersList.map(async (recruiter) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(
                  recruiter.employeeId,
                  recruiter.jobRole
                );
                if (imageUrl) {
                  const img = new Image();
                  img.src = imageUrl;
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl);
                    img.onerror = () => resolve(null);
                    setTimeout(() => resolve(null), 5000);
                  });
                }
                return null;
              } catch (error) {
                console.error(
                  `Error fetching image for recruiter ${recruiter.employeeId}:`,
                  error
                );
                return null;
              }
            })
          );
          setAllImagesForRecruiters(images);
        } catch (error) {
          console.error("Error in fetchAllImagesForRecruiters:", error);
          setAllImagesForRecruiters(Array(recruitersList.length).fill(null));
        }
      }
    };

    fetchAllImagesForRecruiters();
  }, [recruitersList]);
  // Rajlaxmi Jagadale Added  that code
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
    if (!dropdownOpen) {
      handleDisplayManagers();
    }
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

  const toggleTeamLeader = (teamLeaderId) => {
    if (activeTeamLeader === teamLeaderId) {
      setActiveTeamLeader(null);
    } else {
      setActiveTeamLeader(teamLeaderId);
    }
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


  const handleSelectAllNew = (role) => {
    console.log(role);
    console.log(selectedRole);
    
    
    let newIds = [];
  
    if (role === "Manager") {
      newIds = managersList.map(manager => manager.managerId);
    } else if (role === "TeamLeader") {
      newIds = teamLeadersList.map(leader => leader.teamLeaderId);
    } else if (role === "Recruiters") {
      newIds = recruitersList.map(recruiter => recruiter.employeeId);
    }
  
    setSelectedIds(prevIds => {
      // Keep previous selections if the role was already selected
      return selectedRole === role ? [...prevIds, ...newIds] : newIds;
    });
  
    setSelectedRole(role);
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
      let hours = 0,
        minutes = 0;

      const hourMatch = timeString.match(/(\d+)\s*hour/);
      const minuteMatch = timeString.match(/(\d+)\s*minute/);

      if (hourMatch) hours = Number.parseInt(hourMatch[1]);
      if (minuteMatch) minutes = Number.parseInt(minuteMatch[1]);

      return hours * 60 + minutes;
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeDifference = (data) => {
    const totalMinutes1 = getTotalMinutes(sumTimeDurations(data)); // Convert sumTimeDurations result into minutes
    const totalMinutes2 = getTotalMinutes(
      convertMinutesToHours(data.length * 5)
    ); // Convert convertMinutesToHours result into minutes
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
        let hours = 0,
          minutes = 0,
          seconds = 0;

        const hourMatch =
          timeStr.candidateFormFillingDuration !== null &&
          timeStr.candidateFormFillingDuration.match(/(\d+)\s*hour/);
        const minuteMatch =
          timeStr.candidateFormFillingDuration !== null &&
          timeStr.candidateFormFillingDuration.match(/(\d+)\s*minute/);
        const secondMatch =
          timeStr.candidateFormFillingDuration !== null &&
          timeStr.candidateFormFillingDuration.match(/(\d+)\s*second/);

        if (hourMatch) hours = Number.parseInt(hourMatch[1]);
        if (minuteMatch) minutes = Number.parseInt(minuteMatch[1]);
        if (secondMatch) seconds = Number.parseInt(secondMatch[1]);

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
    return hours > 0
      ? `${hours} hours and ${remainingMinutes} minutes`
      : `${remainingMinutes} minutes`;
  };
  const handleClearSelection = (type) => {
    if (type === "Managers") {
      setSelectedRole("");
      setSelectedIds([]);
      setSelectedManagers([]);
    } else if (type === "Team Leaders") {
      setSelectedRole("");
      setSelectedIds([]);
      setSelectedTeamLeaders([]);
    } else if (type === "Recruiters") {
      setSelectedRole("");
      setSelectedIds([]);
      setSelectedRecruiters([]);
    }
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

    if (selectedJobId === "") {
      toast.error("Please Select Job Id");
      return;
    }

    // this line is added by sahil karnekar date 24-10-2024
    setIsLoading(true); // Start the loader

    // Prepare parameters for the API call
    let ids;
    let role;

    const jobId =
      selectedJobId.length > 0
        ? selectedJobId.map((job) => job.requirementId).join(",")
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
      console.error(error);
      toast.error("Something Went Wrong");
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    const fetchAllImagesForManagers = async () => {
      if (managersList && managersList.length > 0) {
        try {
          const images = await Promise.all(
            managersList.map(async (manager) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(
                  manager.managerId,
                  manager.jobRole
                );
                if (imageUrl) {
                  const img = new Image();
                  img.src = imageUrl;
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl);
                    img.onerror = () => resolve(null);
                    // Set a timeout in case the image takes too long to load
                    setTimeout(() => resolve(null), 5000);
                  });
                }
                return null;
              } catch (error) {
                console.error(
                  `Error fetching image for manager ${manager.managerId}:`,
                  error
                );
                return null;
              }
            })
          );
          setAllImagesForManagers(images);
        } catch (error) {
          console.error("Error in fetchAllImagesForManagers:", error);
          setAllImagesForManagers(Array(managersList.length).fill(null));
        }
      }
    };

    fetchAllImagesForManagers();
  }, [managersList]);

  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      if (teamLeadersList && teamLeadersList.length > 0) {
        try {
          const images = await Promise.all(
            teamLeadersList.map(async (teamLeader) => {
              try {
                const imageUrl = await getUserImageFromApiForReport(
                  teamLeader.teamLeaderId,
                  teamLeader.jobRole
                );
                // Validate image URL by preloading
                if (imageUrl) {
                  const img = new Image();
                  img.src = imageUrl;
                  return new Promise((resolve) => {
                    img.onload = () => resolve(imageUrl);
                    img.onerror = () => resolve(null);
                    // Set a timeout in case the image takes too long to load
                    setTimeout(() => resolve(null), 5000);
                  });
                }
                return null;
              } catch (error) {
                console.error(
                  `Error fetching image for team leader ${teamLeader.teamLeaderId}:`,
                  error
                );
                return null;
              }
            })
          );
          setAllImagesForTeamLeaders(images);
        } catch (error) {
          console.error("Error in fetchAllImagesForTeamLeaders:", error);
          setAllImagesForTeamLeaders(Array(teamLeadersList.length).fill(null));
        }
      }
    };

    fetchAllImagesForTeamLeaders();
  }, [teamLeadersList]);

  const renderManagers = () => {
    return managers.map((manager) => (
      <div
        key={manager.managerId}
        className="PIE-dropdown-sectionteamperformance"
      >
        <div className="PIE-dropdown-rowteamperformance">
          <input
            type="checkbox"
            checked={selectedManagers.some(
              (item) => item.managerId === manager.managerId
            )}
            onChange={() => handleManagerCheckboxChange(manager)}
          />
          <label
            className="PIE-clickable-labelteamperformance"
            onClick={() => toggleManagerExpand(manager.managerId)}
          >
            {manager.managerName}
            <span className="PIE-dropdown-arrowteamperformance">
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
          <div className="PIE-dropdown-columnteamperformance">
            {renderTeamLeaders(manager.managerId)}
          </div>
        )}
      </div>
    ));
  };
  const toggleTeamLeaderExpand = (teamLeaderId) => {
    setExpandedTeamLeaderId(
      expandedTeamLeaderId === teamLeaderId ? null : teamLeaderId
    );
  };
  const renderTeamLeaders = (managerId) => {
    return teamLeaders.map((teamLeader) => (
      <div
        key={teamLeader.teamLeaderId}
        className="PIE-dropdown-sectionteamperformance"
      >
        <div className="PIE-dropdown-rowteamperformance">
          <input
            type="checkbox"
            checked={selectedTeamLeaders.some(
              (item) => item.teamLeaderId === teamLeader.teamLeaderId
            )}
            onChange={() => handleTeamLeaderCheckboxChange(teamLeader)}
          />
          <label
            className="PIE-clickable-labelteamperformance"
            onClick={() => toggleTeamLeaderExpand(teamLeader.teamLeaderId)}
          >
            {teamLeader.teamLeaderName}
            <span className="PIE-dropdown-arrowteamperformance">
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
          <div className="PIE-dropdown-columnteamperformance">
            {renderRecruiters()}
          </div>
        )}
      </div>
    ));
  };

  const renderRecruiters = () => {
    return recruiters.map((recruiter) => (
      <div
        key={recruiter.employeeId}
        className="PIE-dropdown-rowteamperformance"
      >
        <input
          type="checkbox"
          id={`${recruiter.employeeName}-${recruiter.employeeId}teamperformance`}
          checked={selectedRecruiters.some(
            (item) => item.recruiterId === recruiter.employeeId
          )}
          onChange={() => handleRecruiterCheckboxChange(recruiter)}
        />
        <label
          htmlFor={`${recruiter.employeeName}-${recruiter.employeeId}teamperformance`}
          className="PIE-clickable-labelteamperformance"
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
    if (index === 0) return sumTimeDurations(data) / 43200;
    if (index === 1)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionAddedToMail"
          )
        ) / 43200
      );
    if (index === 2)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionMailToMailRes"
          )
        ) / 43200
      );
    if (index === 3)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionMailResToInterviewProcess"
          )
        ) / 43200
      );
    if (index === 4)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionInterviewProcessToDocumentSent"
          )
        ) / 43200
      );
    if (index === 5)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionDocumentSentToOfferLetterSendToCandidate"
          )
        ) / 43200
      );
    if (index === 6)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"
          )
        ) / 43200
      );
    if (index === 7)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"
          )
        ) / 43200
      );
    if (index === 8)
      return (
        convertTimeStringToMinutes(
          calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
            data,
            "additionJoiningResponseFromCandidateToJoinDate"
          )
        ) / 43200
      );
    return 0;
  });
  const performanceChart = processes.map((_, index) => {
    if (index === 0) return getTimeDifference(data) / 43200;
    if (index === 1)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 60),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionAddedToMail"
              )
            )
          )
        ) / 43200
      );
    if (index === 2)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionMailToMailRes"
              )
            )
          )
        ) / 43200
      );
    if (index === 3)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 10080),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionMailResToInterviewProcess"
              )
            )
          )
        ) / 43200
      );
    if (index === 4)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionInterviewProcessToDocumentSent"
              )
            )
          )
        ) / 43200
      );
    if (index === 5)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionDocumentSentToOfferLetterSendToCandidate"
              )
            )
          )
        ) / 43200
      );
    if (index === 6)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"
              )
            )
          )
        ) / 43200
      );
    if (index === 7)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"
              )
            )
          )
        ) / 43200
      );
    if (index === 8)
      return (
        convertTimeStringsToMinutesForChart(
          cleanTimeStringPlusMinus(
            subtractTimeDurations(
              convertMinutesToTimeFormat(data.length * 1440),
              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                data,
                "additionJoiningResponseFromCandidateToJoinDate"
              )
            )
          )
        ) / 43200
      );
    return 0;
  });

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
        backgroundColor: performanceChart.map((value) =>
          value < 0 ? "rgba(255, 0, 0, 0.6)" : "rgba(30, 202, 111, 0.6)"
        ),
        borderColor: performanceChart.map((value) =>
          value < 0 ? "rgb(255, 99, 99)" : "rgb(99, 255, 130)"
        ),
        borderWidth: 1,
      },
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
  // Rajlaxmi JAgadale added that code some changes
  const showModal1 = () => {
    if (
      selectedManagers.length === 0 &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0
    ) {
      toast.error("Please Select At Least One Manager/TeamLeader/Recruiter");
      return; // Prevent the modal from opening
    }

    if (
      userType === "Manager" &&
      selectedTeamLeaders.length === 0 &&
      selectedRecruiters.length === 0
    ) {
      toast.error("Please Select At Least One TeamLeader/Recruiter");
      return; // Prevent the modal from opening
    }

    if (userType === "TeamLeader" && selectedRecruiters.length === 0) {
      toast.error("Please Select At Least 1 Recruiter");
      return; // Prevent the modal from opening
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

    setIsModalOpen1(true); // Open modal only if conditions are met
  };

  const [displayAllThingsOfPerformance, setDisplayAllThingsOfPerformance] =
    useState(false);
  // Rajlaxmi JAgadale Updated that code
  const handleOk = () => {
    if (selectedJobId.length === 0) {
      toast.error("Please select at least one Job ID");
      return;
    }

    handleGetFilteredData();
    setIsModalOpen1(false);
    setDisplayAllThingsOfPerformance(true);
  };
  // Rajlaxmi Jagadale Updated That code
  const handleCancel = (e) => {
    if (e.target.classList.contains("ant-modal-wrap")) {
      toast.error("Please select at least one Job ID and Click On Ok Button");
      return;
    }

    setIsModalOpen1(false);
  };

  const handleCheckboxChange = (role, id, completeValueObject) => {
    // Determine updated IDs manually
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

    setSelectedIds(updatedIds);

    // Update the appropriate selection state based on role
    if (role === "Manager") {
      const manager = completeValueObject;
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
    } else if (role === "TeamLeader") {
      const teamLeader = completeValueObject;
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
    } else if (role === "Recruiters") {
      const recruiter = completeValueObject;
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
    }
  };
  const handleCheckboxChangeForJobIdsForPerformance = (event, item) => {
    if (event.target.checked) {
      setSelectedJobId([...selectedJobId, item]);
    } else {
      setSelectedJobId(
        selectedJobId.filter((i) => i.requirementId !== item.requirementId)
      );
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
  const [pageSize, setPageSize] = useState(10); // Number of rows per page

  // Calculate the range of data to show
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleSizeChange = (current, size) => {
    setPageSize(size); // Update the page size
    setCurrentPage(1); // Reset to the first page after page size changes
  };
  // rajlaxmi Jagadale change all className and id
  return (
    <div className="PIE-Appteamperformance">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="PIE-Header-Sectionteamperformance">
        <div className="PIE-grid-dropdownteamperformance">
          <div className="PIE-dropdown-containerteamperformance">
            {userType === "Recruiters" && <span>Recruiter</span>}
            {userType === "TeamLeader" && <span>Team Leader</span>}
            {userType === "Manager" && (
              <span style={{ fontWeight: "700" }}>Manager</span>
            )}
            {userType === "SuperUser" && <span>Super User</span>}

            <div
              className="PIE-Dropdownteamperformance"
              onClick={toggleDropdown}
            >
              {userType === "SuperUser" && <span>Select Manage OR TL</span>}
              {/* Rajlaxmi jagadale Added that code */}
              {userType === "Manager" && (
                <span className="attendanceform">
                  {selectedRole === "TeamLeader" && selectedIds.length > 0
                    ? `Selected ${selectedIds.length} Team Leader`
                    : selectedRole === "Recruiters" && selectedIds.length > 0
                    ? `Selected ${selectedIds.length} Recruiter`
                    : "Select TL / Recruiters"}
                </span>
              )}
              {/* {userType === "TeamLeader" && <span>Select </span>} */}
              {userType === "TeamLeader" && <span>Select Recruiter</span>}
              {userType === "Recruiters" && <span>{loginEmployeeName}</span>}
              <span className={`PIE-dropdown-iconteamperformance`} />
              <i
                className={`fa-solid  ${
                  dropdownOpen ? "fa-angle-up" : "fa-angle-down"
                }`}
              ></i>
            </div>
            {/* Rajlaxmi Jagadale Added that modal  */}
            {displayModalContainer && (
              <>
                <Modal
                  width={1000}
                  open={displayModalContainer}
                  onOk={handleOkey}
                  onCancel={handleCancels}
                >
                  <div className="mainForListsteamperformance">
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
                         
                            <div className="newclearbuttonaddclassteamperformance">
                              <span>Managers</span>
                              {!managersList.every(manager => selectedIds.includes(manager.managerId)) && (
  <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("Manager")}>
    Select All
  </Button>
)}
{
   selectedRole === "Manager" &&
   selectedIds.length > 0 && ( 
                              <button
                                className="clearbuttonReportteamperformance"
                                onClick={() => handleClearSelection("Managers")}
                              >
                                <ClearOutlined className="newcolorforcleariconteamperformance" />
                              </button>
   )
  }
                            </div>
                          
                        }
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={managersList}
                          renderItem={(item, index) => (
                            <List.Item
                              className={
                                hasSelectedChildren(item.managerId, "Manager")
                                  ? "highlight-itemteamperformance"
                                  : ""
                              }
                              key={item.managerId}
                            >
                              <input
                                className="managersTeamRecruitersInputMarginteamperformance"
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
                                          ? allImagesForManagers[index] !== null
                                            ? allImagesForManagers[index]
                                            : getFallbackImageUrl(index)
                                          : getFallbackImageUrl(index)
                                      }
                                      onError={() =>
                                        handleImageError(
                                          item.managerId,
                                          "Manager"
                                        )
                                      }
                                    />
                                  )
                                }
                                title={item.managerName}
                              />
                              <svg
                                onClick={(e) => {
                                  handleOpenDownArrowContent(item.managerId); // Your existing logic
                                  toggleManager(item.managerId); // Toggle rotation
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                                className={
                                  activeManager === item.managerId
                                    ? "rotate-iconteamperformance"
                                    : ""
                                } // Apply rotation class
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
                          
                                <div className="newclearbuttonaddclassteamperformance">
                                  <span>Team Leaders</span>
                                  {!teamLeadersList.every(teamLeader => selectedIds.includes(teamLeader.teamLeaderId)) && (
                                    <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("TeamLeader")}>
                                      Select All
                                    </Button>
                                  )}
                                  {    selectedRole === "TeamLeader" &&
                              selectedIds.length > 0 && ( // Conditional rendering
                                  <button
                                    className="clearbuttonReportteamperformance"
                                    onClick={() =>
                                      handleClearSelection("Team Leaders")
                                    }
                                  >
                                    <ClearOutlined className="newcolorforcleariconteamperformance" />
                                  </button>
                                   ) 
                                  }
                                </div>
                                }
                          >
                            <List
                              itemLayout="horizontal"
                              dataSource={teamLeadersList}
                              renderItem={(teamLeader, index) => (
                                <List.Item
                                  className={
                                    hasSelectedChildren(
                                      teamLeader.teamLeaderId,
                                      "TeamLeader"
                                    )
                                      ? "highlight-itemteamperformance"
                                      : ""
                                  }
                                  key={teamLeader.teamLeaderId}
                                >
                                  <input
                                    className="managersTeamRecruitersInputMarginteamperformance"
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
                                                ? allImagesForTeamLeaders[index]
                                                : getFallbackImageUrl(index)
                                              : getFallbackImageUrl(index)
                                          }
                                          onError={() =>
                                            handleImageError(
                                              teamLeader.teamLeaderId,
                                              "TeamLeader"
                                            )
                                          }
                                        />
                                      )
                                    }
                                    title={teamLeader.teamLeaderName}
                                  />
                                  <svg
                                    onClick={(e) => {
                                      handleOpenDownArrowContentForRecruiters(
                                        teamLeader.teamLeaderId
                                      ); // Your existing logic
                                      toggleTeamLeader(teamLeader.teamLeaderId); // Toggle rotation
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#000000"
                                    className={
                                      activeTeamLeader ===
                                      teamLeader.teamLeaderId
                                        ? "rotate-iconteamperformance"
                                        : ""
                                    } // Apply rotation class
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
                            
                                <div className="newclearbuttonaddclassteamperformance">
                                  <span>Recruiters</span>
                                   {!recruitersList.every(recruiter => selectedIds.includes(recruiter.employeeId)) && (
                                    <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("Recruiters")}>
                                      Select All
                                    </Button>
                                  )}
                                  {  selectedRole === "Recruiters" &&
                              selectedIds.length > 0 && ( // Conditional rendering
                                  <button
                                    className="clearbuttonReportteamperformance"
                                    onClick={() =>
                                      handleClearSelection("Recruiters")
                                    }
                                  >
                                    <ClearOutlined className="newcolorforcleariconteamperformance" />
                                  </button>
                                   )
                                  }
                                </div>
                                }
                          >
                            <List
                              itemLayout="horizontal"
                              dataSource={recruitersList}
                              renderItem={(recruiter, index) => (
                                <List.Item key={recruiter.employeeId}>
                                  <input
                                    className="managersTeamRecruitersInputMarginteamperformance"
                                    type="checkbox"
                                    checked={
                                      selectedRole === "Recruiters" &&
                                      selectedIds.includes(recruiter.employeeId)
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
                                                ? allImagesForRecruiters[index]
                                                : getFallbackImageUrl(index)
                                              : getFallbackImageUrl(index)
                                          }
                                          onError={() =>
                                            handleImageError(
                                              recruiter.employeeId,
                                              "Recruiters"
                                            )
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
          {/* Rajlaxmi Jagadale updated  that code */}
          <div className="PIE-employee-countteamperformance">
            {userType === "SuperUser" && (
              <div className="PI-superuser-divattendanceform">
                <p className="attendanceform">
                  Manager Count:{" "}
                  {selectedManagers.length || employeeCount.managerCount || 0}
                </p>
                <p className="attendanceform">
                  Team Leader Count:{" "}
                  {selectedRole === "TeamLeader"
                    ? selectedIds.length
                    : selectedRecruiters.length > 0
                    ? 0
                    : selectedTeamLeaders.length ||
                      employeeCount.teamLeaderCount ||
                      0}
                </p>
                <p className="attendanceform">
                  Recruiter Count:{" "}
                  {selectedRole === "Recruiters"
                    ? selectedIds.length
                    : employeeCount.employeeCount ||
                      selectedRecruiters.length ||
                      0}
                </p>
              </div>
            )}
            {userType === "Manager" && (
              <div className="leftsidecontentattendanceform">
                <p className="attendanceform">
                  Team Leader Count:{" "}
                  {selectedRole === "TeamLeader"
                    ? selectedIds.length
                    : selectedRecruiters.length > 0
                    ? 0
                    : selectedTeamLeaders.length ||
                      employeeCount.teamLeaderCount ||
                      0}
                </p>
                <p className="attendanceform">
                  Recruiter Count:{" "}
                  {selectedRole === "Recruiters"
                    ? selectedIds.length
                    : employeeCount.employeeCount ||
                      selectedRecruiters.length ||
                      0}
                </p>
              </div>
            )}
            {userType === "TeamLeader" && (
              <>
                <p className="attendanceform">
                  Recruiter Count:{" "}
                  {selectedRole === "Recruiters"
                    ? selectedIds.length
                    : employeeCount.employeeCount ||
                      selectedRecruiters.length ||
                      0}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="PIE-grid-dateteamperformance">
          <div className="PIE-date-containerteamperformance">
            <div>
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="currentMonthteamperformance"
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
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="lastMonthteamperformance"
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
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="last3Monthsteamperformance"
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
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="last6Monthsteamperformance"
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
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="lastYearteamperformance"
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
              <label className="PI-radio-labelteamperformance">
                <input
                  type="radio"
                  id="customteamperformance"
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
              <div className="PIE-custom-dateteamperformance">
               <div className="PIE-start-date-1st-div">
               <label className="date-labelteamperformance">Start Date:</label>
                <input
                  className="PIE-custom-date-inputteamperformance"
                  type="date"
                  value={customStartDate}
                  onChange={handleCustomStartDateChange}
                />
               </div>
               <div className="PIE-start-date-1st-div">
               <label className="date-labelteamperformance">End Date:</label>
                <input
                  className="PIE-custom-date-inputteamperformance"
                  type="date"
                  value={customEndDate}
                  onChange={handleCustomEndDateChange}
                />
               </div>
              </div>
            )}
          </div>
          <div className="PIE-job-filterteamperformance">
            <button
              className="PIE-filter-Btnteamperformance"
              onClick={showModal1}
            >
              Select Job Ids
            </button>

            <div className="PIE-Apply-Filter-Btnsteamperformance">
             
              <button
                className="PIE-filter-Btnteamperformance"
                onClick={onCloseIncentive}
              >
                {" "}
                Back
              </button>
            </div>

            <Modal
              title="Select Job Ids"
              open={isModalOpen1}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className="selectJobIdsForPerformanceteamperformance">
                {sortedUniqueClientDetails.map((item) => (
                  <label key={item.requirementId} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      value={JSON.stringify(item)}
                      checked={selectedJobId.some(
                        (i) => i.requirementId === item.requirementId
                      )}
                      onChange={(e) =>
                        handleCheckboxChangeForJobIdsForPerformance(e, item)
                      }
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    {item.requirementId} :- {item.companyName}
                  </label>
                ))}
              </div>
            </Modal>

            {/* <select
              className="PIE-job-filter-optionsteamperformance"
              onChange={handleJobIdChange}
            >
              <option value="">Select Job ID</option>
              {sortedUniqueClientDetails.map((item) => (
                <option key={item.requirementId} value={JSON.stringify(item)}>
                  {item.requirementId} : {item.companyName}
                </option>
              ))}
            </select> */}
          </div>
          {/* this code is updated by sahil karnekar date 24-10-2024 */}
        </div>
        <div className="PIE-client-desg-roleteamperformance fixperformanceclientsectionteamperformance">
          {selectedJobId.length > 0 &&
            selectedJobId.map((compItem, index) => (
              <div key={index}>
                <div className="containergridteamperformance">
                  <div className="grid-containerteamperformance">
                    <div className="grid-itemteamperformance">
                      <p>
                        <strong>{index + 1}. Client Name:</strong>{" "}
                        {compItem.companyName}
                      </p>
                      <p>
                        <strong>Designation:</strong> {compItem.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div></div>

      {displayAllThingsOfPerformance && (
        <>
          <div className="PIT-headingteamperformance">
            <h5 className="text-secondary">Performance Table</h5>
          </div>
          <div className="PIE-maintableteamperformance tablefixheigtteamperformance">
            <table className="PIE-timetrackertableteamperformance">
              <thead>
                <th className="PIE-timetrackertableheadteamperformance">
                  Sr No
                </th>

                {userType !== "Recruiters" && (
                  <>
                    <th className="PIE-timetrackertableheadteamperformance">
                      Employee Id
                    </th>
                    <th className="PIE-timetrackertableheadteamperformance">
                      Job Role
                    </th>
                  </>
                )}

                <th className="PIE-timetrackertableheadteamperformance">
                  Candidate Id
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Candidate Name
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Job Id
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Form Filling Duration
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Added To Line Up
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff Between Added and Mail To Client
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Mail Sent to Client
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff Between Mail Send and Mail Response
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Mail Response From Client
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between Mail response from Client To 1st Interview
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Interview Process
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Over All Time For Interview
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between interview complete to document sent
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Candidate Document Send Time
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between document send to offer letter sent
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Offer Letter Sent
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between offer letter sent and response from candidate
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Offer Letter Response
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between offer letter response and joining response
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Joining Response From Candidates
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Diff between join status to join date
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Join Date
                </th>
                <th className="PIE-timetrackertableheadteamperformance">
                  Over All Process Time
                </th>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.candidateId}
                    className="PIE-timetrackertabledatateamperformance"
                  >
                    <td className="PIE-timetrackertabledatateamperformance">
                      {index + 1}
                    </td>

                    {userType !== "Recruiters" && (
                      <>
                        <td className="PIE-timetrackertabledatateamperformance">
                          {item.employeeId}
                        </td>
                        <td className="PIE-timetrackertabledatateamperformance">
                          {item.jobRole}
                        </td>
                      </>
                    )}

                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.candidateId}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.candidateName}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.jobId}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.candidateFormFillingDuration}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.callingTacker)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {calculateTimeDifference(
                        item?.callingTacker,
                        item?.mailToClient
                      )}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.mailToClient)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {calculateTimeDifference(
                        item?.mailToClient,
                        item?.mailResponse
                      )}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.mailResponse)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenMailResponseAndFirstInterview}
                      {calculateTimeDifference(
                        item?.mailResponse,
                        item &&
                          item.interviewRoundsList.length > 0 &&
                          item.interviewRoundsList[1] &&
                          item.interviewRoundsList[1].time &&
                          item.interviewRoundsList[1].time
                      )}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      <button
                        style={{
                          border: "1px solid black",
                          width: "120px",
                          borderRadius: "10px",
                        }}
                        onClick={() =>
                          handleViewClick(item.interviewRoundsList)
                        }
                      >
                        View
                      </button>
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {/* {item.totalInterviewTime} */}
                      {calculateTotalInterviewTime(item.interviewRoundsList)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenInterviewAndDocument}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.sendingDocument)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenDocumentAndLetter}
                    </td>
                    <td className="timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.issuingLetter)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenLetterAndResponse}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(
                        item.letterResponseUpdating
                      )}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenResponseAndJoining}
                    </td>
                    <td className="timetrackertabledatateamperformance">
                      {convertNewDateToFormattedDateTime(item.joiningProcess)}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.diffBetweenJoiningAndJoinDate}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
                      {item.joinDate}
                    </td>
                    <td className="PIE-timetrackertabledatateamperformance">
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
              marginBottom: "10px",
            }}
          />

          <div className="procees-time-tableteamperformance">
            <div className="fixPerformanceprocesstable100teamperformance">
              <h5 className="text-secondary">Process Time Table</h5>
              <table className="PIE-timetrackertableteamperformance">
                <thead>
                  <th className="PIE-timetrackertableheadteamperformance">
                    Sr No
                  </th>
                  <th className="PIE-timetrackertableheadteamperformance">
                    Process Name
                  </th>
                  <th className="PIE-timetrackertableheadteamperformance">
                    Required Time
                  </th>
                  <th className="PIE-timetrackertableheadteamperformance">
                    Spent Time
                  </th>
                  <th className="PIE-timetrackertableheadteamperformance">
                    Time Difference
                  </th>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <tr
                      key={index}
                      className="PIE-timetrackertabledatateamperformance"
                    >
                      <td className="PIE-timetrackertabledatateamperformance">
                        {index + 1}
                      </td>
                      <td className="PIE-timetrackertabledatateamperformance">
                        {process}
                      </td>
                      <td className="PIE-timetrackertabledatateamperformance">
                        {index === 0 &&
                          cleanTimeStringSpaces(
                            convertMinutesToTimeFormat(data.length * 5)
                          )}
                        {index === 1 &&
                          cleanTimeStringSpaces(
                            convertMinutesToTimeFormat(data.length * 60)
                          )}
                        {(index === 2 ||
                          index === 4 ||
                          index === 5 ||
                          index === 6 ||
                          index === 7 ||
                          index === 8) &&
                          cleanTimeStringSpaces(
                            convertMinutesToTimeFormat(data.length * 1440)
                          )}
                        {index === 3 &&
                          cleanTimeStringSpaces(
                            convertMinutesToTimeFormat(data.length * 10080)
                          )}
                      </td>
                      <td className="PIE-timetrackertabledatateamperformance">
                        {index === 0 &&
                          cleanTimeStringSpaces(sumTimeDurations(data))}
                        {index === 1 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionAddedToMail"
                            )
                          )}
                        {index === 2 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionMailToMailRes"
                            )
                          )}
                        {index === 3 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionMailResToInterviewProcess"
                            )
                          )}
                        {index === 4 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionInterviewProcessToDocumentSent"
                            )
                          )}
                        {index === 5 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionDocumentSentToOfferLetterSendToCandidate"
                            )
                          )}
                        {index === 6 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"
                            )
                          )}
                        {index === 7 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"
                            )
                          )}
                        {index === 8 &&
                          removeLeadingZeros(
                            calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                              data,
                              "additionJoiningResponseFromCandidateToJoinDate"
                            )
                          )}
                      </td>
                      <td
                        className="PIE-timetrackertabledatateamperformance"
                        style={{
                          color:
                            (index === 1 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 60),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionAddedToMail"
                                )
                              ).startsWith("-")) ||
                            (index === 2 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionMailToMailRes"
                                )
                              ).startsWith("-")) ||
                            (index === 3 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 10080),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionMailResToInterviewProcess"
                                )
                              ).startsWith("-")) ||
                            (index === 4 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionInterviewProcessToDocumentSent"
                                )
                              ).startsWith("-")) ||
                            (index === 5 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionDocumentSentToOfferLetterSendToCandidate"
                                )
                              ).startsWith("-")) ||
                            (index === 6 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"
                                )
                              ).startsWith("-")) ||
                            (index === 7 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"
                                )
                              ).startsWith("-")) ||
                            (index === 8 &&
                              subtractTimeDurations(
                                convertMinutesToTimeFormat(data.length * 1440),
                                calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                  data,
                                  "additionJoiningResponseFromCandidateToJoinDate"
                                )
                              ).startsWith("-"))
                              ? "red"
                              : "green",
                        }}
                      >
                        {index === 0 && getTimeDifference(data)}
                        {index === 1 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 60),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionAddedToMail"
                              )
                            )
                          )}
                        {index === 2 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionMailToMailRes"
                              )
                            )
                          )}
                        {index === 3 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 10080),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionMailResToInterviewProcess"
                              )
                            )
                          )}
                        {index === 4 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionInterviewProcessToDocumentSent"
                              )
                            )
                          )}
                        {index === 5 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionDocumentSentToOfferLetterSendToCandidate"
                              )
                            )
                          )}
                        {index === 6 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionOfferLetterSendToCandidateToOfferLetterResponseFromCandidate"
                              )
                            )
                          )}
                        {index === 7 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionOfferLetterResponseFromCandidateToJoiningResponseFromCandidate"
                              )
                            )
                          )}
                        {index === 8 &&
                          cleanTimeStringPlusMinus(
                            subtractTimeDurations(
                              convertMinutesToTimeFormat(data.length * 1440),
                              calculateTotalTimeDifferenceAndAdditionForTimeDifferences(
                                data,
                                "additionJoiningResponseFromCandidateToJoinDate"
                              )
                            )
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="chartDownloaddivteamperformance">
              <div className="buttondivforchartteamperformance">
                <button
                  onClick={downloadChart}
                  className="downloadbuttonforchartperformanceteamperformance PIE-filter-Btnteamperformance"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                  </svg>
                </button>
              </div>

              <Bar ref={chartRef} data={chartData} options={options} />
            </div>

            {/* <div>
          <PerformanceMeter></PerformanceMeter>
        </div> */}
          </div>
        </>
      )}

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
