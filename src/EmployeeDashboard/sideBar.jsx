import React, { useState, useEffect } from "react";
import "../EmployeeDashboard/sideBar.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Circle from "../LogoImages/circle.png";
import logoutImg from "../photos/download.jpeg";
import { RiTeamFill } from "react-icons/ri";
import axios from "axios";
import { Modal } from "react-bootstrap";
import ColorPicker from "../HomePage/ColorPicker";
import LogoutOnEvent from "./logoutOnEvent";
import { getSocket } from "../EmployeeDashboard/socket";
import { API_BASE_URL } from "../api/api";
import {
  checkTimeThreshold,
  getCurrentLogTime,
  getFormattedDateTime,
} from "../EmployeeSection/getFormattedDateTime";
import {
  Avatar,
  Badge,
  notification,
  List,
  Card,
  Form,
  Select,
  Input,
  Radio,
  DatePicker,
  TimePicker,
} from "antd";
import {
  BellOutlined,
  CloseOutlined,
  ClearOutlined,
  FormOutlined,
  CommentOutlined,
  PhoneOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Modal as AntdModal } from "antd";
import dayjs from "dayjs";
import { getFormattedDateISOYMDformat } from "../EmployeeSection/getFormattedDateTime.jsx";
import { toast } from "react-toastify";
import {
  getDailyworkData,
  putDailyworkData,
} from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable.jsx";
import { useSelector } from "react-redux";

// Swapnil_Sidebar_AddingEmployeeDetailsinto_ManagerSection_17/07

function Sidebar({
  loginEmployeeName,
  onLogout,
  openSidebarToggle,
  OpenSidebar,
  toggleSelfCalling,
  toggelLineUp,
  toggleCallingTrackerForm,
  toggeladminsection,
  toggleShortListed,
  toggleSelectCandidate,
  toggleRejectedCandidate,
  toggleHoldCandidate,
  toggleExcelCalling,
  toggleResumeData,
  toggleJobDescription,
  toggleSentProfileAccess,
  toggleIncentive,
  toggleAttendance,
  toggleAllMasterSheet,
  toggleAddJobDescription,
  toggleEmployeeMasterSheet,
  toggleReports,
  toggleMainReportDatapage,
  handleLogout,
  toggelAddRecruiter,
  toggelDisplayNotPad,
  toggelAddResumes,
  toggleChatRoom,
  toggleAssigncolumns,
  toggeExcelCallingData,
  toggelExcelLineup,
  toggleShareLink,
  toggleDataUse,
  toggleUpdateResponse,
  togglescheduleinterview,
  successAddUpdateResponse,
  togglePayRoll /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_42 */,
  toggleSendCandidate,
  toggeleProfitChart /* ArshadAttar_EmpDashboard_Added_toggeleProfitChart_11/07/2024_LineNo_46 */,
  toggleInvoice,
  toggleInvoiceReport,
  /*ArbazPathan_EmpDashboard_AddedInvoice_&_InoviceReportToggeleFunction_11/07/2024_LineNo_45-46 */
  toggleAddCompany /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_46*/,
  toggleCapex,
  toggleEmployeeDetails,
  toggelResumeData,
  toggleQuestionPaper,
  toggleShowShortListedCandidateData /*Akash_Pawar_SideBar_toggleShowShortListedCandidateData_23/07_LineNo_55*/,
  toggeleRightsInstructions,
  toggeleCompanyPolicy,
  toggeleIssueSolving,
  toggelePainArea,
  /*ArbazPathan_EmpDashboard_AddedSubscription_&_InoviceReportToggeleFunction_19/07/2024_LineNo_59-60 */
  toggelSubscriptions,
  toggleBilling, // toggleTeamDetails,
  toggelCandidateHistory,
  toggleTeamDetails,
  /*ArbazPathan_EmpDashboard_AddedInterviewForm_29/07/2024_LineNo_65-66 */
  toggeleInterviewForm,
  togglePerformanceImprovement,
  toggeleAddTeamLeader,
  toggeleAddManager,
  toggleSharedProfiles,
  toggleIssueLetter,
  toggleCompanyOfferForm,
  toggleactiveTeamMembers,
  sendOfficailMailForQr
}) {
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Track the active submenu
  const [activeButton, setActiveButton] = useState(null); // Track the active button
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [socket, setSocket] = useState(null);
  const currentDateNewGlobal = getFormattedDateISOYMDformat();
  const timeString = useSelector((state) => state.stopwatch.timeString);

  const navigator = useNavigate();
  const { employeeId, userType } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMade, setPaymentMade] = useState(false);

  const savedColor = localStorage.getItem("bgColor");
  const buttonColor = localStorage.getItem("buttonColor");
  const HoverColor = localStorage.getItem("hover-effect");

  useEffect(() => {
    if (savedColor != null && buttonColor != null && HoverColor != null) {
      applyColor(savedColor, buttonColor, HoverColor);
    }
  }, [savedColor, buttonColor, HoverColor]);

  const applyColor = (savedColor, buttonColor, HoverColor) => {
    document.documentElement.style.setProperty("--Bg-color", savedColor);
    document.documentElement.style.setProperty("--button-color", buttonColor);
    document.documentElement.style.setProperty("--hover-effect", HoverColor);
    document.documentElement.style.setProperty("--dailyWork-btn", HoverColor);
    document.documentElement.style.setProperty(
      "--button-hover-color",
      HoverColor
    );

    localStorage.setItem("bgColor", savedColor);
    localStorage.setItem("buttonColor", buttonColor);
    localStorage.setItem("hoverColor", HoverColor);
    // document.documentElement.style.setProperty("--hover-effect", hoverColor);
    // document.documentElement.style.setProperty("--filter-color", color);
  };

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  //Arshad Commente this code, dont remove
  const handleLogoutLocal = () => {
    console.log("Logout clicked 01");
    const logoutTime = new Date().toLocaleTimeString("en-IN");
    console.log(logoutTime);
    temproryLogout();
    // onLogout(logoutTime);
  };

  const temproryLogout = async () => {
    console.log("Logout clicked in Logout clicked 02");
    try {
      let requestBody = {};
      switch (`${userType}`) {
        case "SuperUser":
          requestBody = {
            superUserId: employeeId,
            employeeId: employeeId,
            userType: "SuperUser",
            employeeName: loginEmployeeName,
            logoutDateAndTime: getFormattedDateTime(),
          };
          break;
        case "Manager":
          requestBody = {
            managerId: employeeId,
            employeeId: employeeId,
            userType: "Manager",
            employeeName: loginEmployeeName,
            logoutDateAndTime: getFormattedDateTime(),
          };
          break;
        case "TeamLeader":
          requestBody = {
            teamLeaderId: employeeId,
            employeeId: employeeId,
            userType: "TeamLeader",
            employeeName: loginEmployeeName,
            logoutDateAndTime: getFormattedDateTime(),
          };
          break;
        case "Recruiters":
          requestBody = {
            employeeId: employeeId,
            userType: "Recruiters",
            employeeName: loginEmployeeName,
            logoutDateAndTime: getFormattedDateTime(),
          };
          break;
        default:
          console.error("Invalid user type");
          return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/user-logout-157/${userType}`,
        requestBody
      );

      console.log(" user-logout-157 -- " + JSON.stringify(requestBody));
      console.log(response);

      try {
        const logoutTime = getCurrentLogTime();
        const dailyWorkData = {
          halfDay: `${checkTimeThreshold(timeString)}`,
          logoutTime: `${logoutTime}`,
          totalHoursWork: `${timeString}`,
          attendanceRole: {
            ...(userType === "Recruiters" && { employee: { employeeId } }),
            ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
            ...(userType === "Manager" && { manager: { employeeId } }),
          },
        };
        const logoutPutReq = await putDailyworkData(
          employeeId,
          userType,
          currentDateNewGlobal,
          dailyWorkData
        );
        console.log(logoutPutReq);
      } catch (error1) {
        console.log(error1);
      }
localStorage.removeItem(`user_${userType}${employeeId}`);
      if (socket && typeof socket.emit === "function") {
        socket.emit("user_logout_event", requestBody);
        console.log(
          "Logout Successfully And Status Updated Successfully.. In Successfully Emit "
        );
        navigate(`/login/${userType}`, { replace: true });
      } else {
        console.warn(
          "Socket is not defined or emit is not a function. Skipping emit  Without Emit"
        );
        navigate(`/login/${userType}`, { replace: true });
      }
      console.log(
        "Logout Successfully And Status Updated Successfully.. in Side "
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Arshad Attar ( Note :- Commented This we will work after some its taking to much time  )
  // const LogoutOnEvent = () => {
  //   useEffect(() => {
  //     let lastActivityTime = Date.now();

  //     // Trigger logout on tab/window close
  //     const handleBeforeUnload = (event) => {
  //       event.preventDefault();
  //       temproryLogout();
  //       event.returnValue = '';
  //     };

  //     // Trigger logout on page visibility change
  //     const handleVisibilityChange = () => {
  //       if (document.hidden) {
  //         temproryLogout();
  //       }
  //     };

  //     // Trigger logout on network offline
  //     const handleOffline = () => {
  //       console.log("Internet disconnected, logging out...");
  //       temproryLogout();
  //     };

  //     // Detect machine sleep or hibernation
  //     const detectSleep = () => {
  //       const currentTime = Date.now();
  //       if (currentTime - lastActivityTime > 10000) {
  //         // If more than 30 seconds have passed unexpectedly, assume sleep or hibernation
  //         console.log("Machine went to sleep or hibernation, logging out...");
  //         temproryLogout();
  //       }
  //       lastActivityTime = currentTime;
  //     };

  //     // Attach event listeners
  //     window.addEventListener("beforeunload", handleBeforeUnload);
  //     // document.addEventListener("visibilitychange", handleVisibilityChange);
  //     // window.addEventListener("offline", handleOffline);
  //     // Monitor for sleep with setInterval
  //     const sleepInterval = setInterval(detectSleep, 10000);

  //     // Cleanup event listeners and interval on component unmount
  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //       // document.removeEventListener("visibilitychange", handleVisibilityChange);
  //       window.removeEventListener("offline", handleOffline);
  //       clearInterval(sleepInterval);
  //     };
  //   }, []);
  //   return null;
  // };

  const handleColorClick = (color) => {
    applyColor(color);
    setShowColor(false);

    // Save the selected color in the session storage
    localStorage.setItem("selectedColor", color);

    // Use history.pushState to update the URL without showing the parameter
    const url = new URL(window.location);
    url.searchParams.delete("color"); // Ensure no color param in the URL
    window.history.pushState({}, "", url);
  };

  const handleColorApplied = (color) => {
    localStorage.setItem("selectedColor", color);
    setShowColor(false);
  };

  const getParentSubMenu = (buttonKey) => {
    const subMenuMap = {
      selfCalling: "candidate",
      lineUp: "candidate",
      shortListed: "candidate",
      selectCandidate: "candidate",
      holdCandidate: "candidate",
      rejectedCandidate: "candidate",
      jobDescription: "Jobdiscription",
      addJobDescription: "Jobdiscription",
      incentive: "employee",
      attendance: "employee",
      assignColumns: "adminSection",
      allMasterSheet: "adminSection",
      addRecruiters: "adminSection",
      addTeamLeaders: "adminSection",
      callingData: "database",
      lineUpData: "database",
      resumeData: "database",
      addResumes: "database",
    };
    return subMenuMap[buttonKey] || null;
  };

  const toggleSubMenu = (subMenuKey) => (e) => {
    e.preventDefault();
    setActiveSubMenu(activeSubMenu === subMenuKey ? null : subMenuKey);
    setActiveButton(subMenuKey);
  };

  const toggleSidebar = () => {
    setIsActive(!isActive);
    OpenSidebar();
  };

  const openNaukriPlatform = () => {
    window.open("https://www.naukri.com/mnjuser/homepage", "_blank");
  };

  const openLinkedinPlatform = () => {
    window.open("https://www.linkedin.com/feed/", "_blank");
  };

  const openTimesPlatform = () => {
    window.open("https://www.timesjobs.com/", "_blank");
  };

  const openIndeedPlatform = () => {
    window.open("https://in.indeed.com/?from=gnav-homepage", "_blank");
  };

  //Arshad Attar Added New Cement button Logic as per, Fetch Subscription Status
  //Subscription Status Logic Added - On 28-11-2024 Start Line- 255 to 271
  // Fetch `paymentMade` from local storage
  useEffect(() => {
    // Check if there is a saved value for paymentMade in localStorage
    // this line is updated by sahil karnekar date 2-12-2024
    const savedPaymentStatus = localStorage.getItem(
      `user_${userType}${employeeId}paymentMade`
    );

    if (savedPaymentStatus) {
      setPaymentMade(JSON.parse(savedPaymentStatus)); // Set the value from localStorage
    } else {
      setPaymentMade(JSON.parse(savedPaymentStatus));
    }
  }, []);

  // Handle button click
  const handleButtonClick = (buttonKey, callback) => (e) => {
    if (!paymentMade && buttonKey === "subscription") {
      e.preventDefault();
      return; // Disable subscription functionality if payment is not made
    }

    e.stopPropagation();
    setActiveButton(buttonKey);
    const parentSubMenu = getParentSubMenu(buttonKey);

    if (parentSubMenu) {
      setActiveSubMenu(parentSubMenu);
    }
    if (callback) callback(e);
  };

  const isCandidateSectionActive = [
    "selfCalling",
    "lineUp",
    "shortListed",
    "selectCandidate",
    "holdCandidate",
    "rejectedCandidate",
    "EmployeeMasterSheet",
  ].includes(activeButton);
  const isJobDescriptionActive = [
    "Jobdescription",
    "addJobDescription",
  ].includes(activeButton);
  const isTeamLeaderActive = [
    "TeamLeader-section",
    "sendCandidate",
    "updateResponse",
    "sharedProfiles",
    "issueLetter",
    "payRoll",
    "questionPaper",
    "scheduleinterview",
    "addRecruiter",
    "employeeDetails",
  ].includes(activeButton);
  const isManagerActive = [
    "admin-section",
    "sendCandidate",
    "updateResponse",
    "sharedProfiles",
    "issueLetter",
    "companyOfferForm",
    "payRoll",
    "scheduleinterview",
    "billing",
    "invoice",
    "assignC",
    "managerTeamD",
    "addTeamLeader",
    "addCompany",
    "capex",
  ].includes(activeButton);
  const isSuperUserActive = [
    "admin-section",
    "sendCandidate",
    "updateResponse",
    "sharedProfiles",
    "issueLetter",
    "payRoll",
    "scheduleinterview",
    "billing",
    "invoice",
    "assignC",
    "managerTeamD",
    "addTeamLeader",
    "addCompany",
    "capex",
  ].includes(activeButton);
  const isadminactive = ["teamleader", "addJobDescription"].includes(
    activeButton
  );
  useEffect(() => {
    if (window.innerWidth <= 980) {
      setIsActive(false);
    }
    const handleResize = () => {
      if (window.innerWidth >= 980) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Dhanshreee Code From Here

  const handleItemClick = (itemKey) => {
    setActiveItem(itemKey);
  };

  const renderMenuItem = (item, isSubMenu = false) => {
    const isActive =
      activeItem === item.key ||
      (item.subMenu &&
        item.subMenu.some((subItem) => activeItem === subItem.key));
    const style = isSubMenu ? { marginLeft: "10px" } : {};
    /* Dhanashree_Sidebar_Date(09/08) End 151*/
    console.log(" jjjjjjjjjjjjjj " + API_BASE_URL);

    return (
      /* Dhanashree_Sidebar_Date(09/08) Start 157*/

      <li
        key={item.key}
        onClick={(e) => {
          e.stopPropagation();
          handleItemClick(item.key);
          if (item.onClick) item.onClick(e);
          if (item.subMenu) {
            toggleSubMenu(item.key)(e);
          }
        }}
        className={`${isActive ? "active" : ""}`}
        style={style}
      >
        <a href="#">
          {item.icon && <i className={item.icon}></i>}

          <span className="sidebar-text">{item.text}</span>
          {isActive && <span className="active-dot"></span>}
          {item.arrow && (
            <i
              className={`arrow ph-bold ph-caret-${
                activeSubMenu === item.key ? "up" : "down"
              }`}
            ></i>
          )}
        </a>
        {item.subMenu && (
          <ul
            className={`sub-menu ${activeSubMenu === item.key ? "active" : ""}`}
          >
            {item.subMenu.map((subItem) => renderMenuItem(subItem, true))}
          </ul>
        )}
      </li>
    );
  };
  const [openInterviewModal, setOpenInterviewModal] = useState(false);
  const [openInterviewModalForAction, setOpenInterviewModalForAction] =
    useState(false);
  const openInterviewReminderModal = () => {
    setOpenInterviewModal(true);
    localStorage.setItem(
      "interviewReminderShown",
      getFormattedDateISOYMDformat()
    );
  };

  const handleOk1 = () => {
    setOpenInterviewModal(false);
  };
  const handleCancel1 = () => {
    setOpenInterviewModal(false);
    SETREMINDER_INTERVAL(10 * 60 * 1000);
  };

  const [interviewFormData, setInterviewFormData] = useState({
    callingRemark: "",
    attendingStatus: "",
    comment: "",
    nextDate: "",
    nextTime: "",
    candidateId: "",
    employeeId: "",
    jobRole: "",
    updatedBy: `${loginEmployeeName}`,
    reminderId: "",
  });
  const getInterviewReminderDataByCanId = async (candidateId) => {
    const response = await axios.get(
      `${API_BASE_URL}/get-reminder-data/${candidateId}`
    );
    console.log(response);

    setInterviewFormData((prev) => ({
      ...prev,
      callingRemark: response.data.callingRemark,
      attendingStatus: response.data.attendingStatus,
      comment: response.data.comment,
      reminderId: response.data.reminderId ? response.data.reminderId : "",
    }));
  };
  const openAnotherModalForPerformAction = (item) => {
    setInterviewFormData((prev) => ({
      ...prev,
      candidateId: item.candidateId,
      employeeId: item.empId,
      jobRole: item.jobRole !== null ? item.jobRole : "Recruiters",
    }));
    getInterviewReminderDataByCanId(item.candidateId);
    setOpenInterviewModalForAction(true);
  };
  const handleAntdFormChange = (value, fieldName) => {
    setInterviewFormData((prev) => {
      let updatedData = { ...prev, [fieldName]: value };

      // Special cases based on dependent fields
      if (fieldName === "callingRemark") {
        updatedData.attendingStatus =
          value === "Call Done" ? prev.attendingStatus : "";
        updatedData.nextDate = value !== "Call Done" ? "" : prev.nextDate;
        updatedData.nextTime = value !== "Call Done" ? "" : prev.nextTime;
      }

      if (fieldName === "attendingStatus") {
        updatedData.nextDate = value === "No" ? prev.nextDate : "";
        updatedData.nextTime = value === "No" ? prev.nextTime : "";
      }

      return updatedData;
    });
  };
  const [interviewsForToday, setInterviewsForToday] = useState({});
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const handleOk2 = () => {
    console.log(interviewFormData);

    console.log(interviewFormData.reminderId === "");

    if (interviewFormData.reminderId === "") {
      axios
        .post(`${API_BASE_URL}/save-reminder-data`, interviewFormData)
        .then((response) => {
          toast.success("Reminder saved successfully!");
          setInterviewFormData({
            callingRemark: "",
            attendingStatus: "",
            comment: "",
            nextDate: "",
            nextTime: "",
            candidateId: "",
            employeeId: "",
            jobRole: "",
            updatedBy: loginEmployeeName, // No need for template literals here
          });
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        });
    } else if (interviewFormData.reminderId !== "") {
      axios
        .put(
          `${API_BASE_URL}/update-reminder-data/${interviewFormData.candidateId}`,
          interviewFormData
        )
        .then((response) => {
          toast.success("Reminder Updated successfully!");
          setInterviewFormData({
            callingRemark: "",
            attendingStatus: "",
            comment: "",
            nextDate: "",
            nextTime: "",
            candidateId: "",
            employeeId: "",
            jobRole: "",
            updatedBy: loginEmployeeName, // No need for template literals here
          });
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        });
    }
    setOpenInterviewModalForAction(false);
  };

  const handleCancel2 = () => {
    setOpenInterviewModalForAction(false);
  };
  const getTodaysInterviews = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/today-interview/${getFormattedDateISOYMDformat()}/${employeeId}/${userType}`
      );
      console.log(response);

      setInterviewsForToday(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterUpcomingInterviews = (interviews) => {
    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();

    return interviews?.filter((item) => {
      const interviewTime = item.interviewTime || "12:00 am"; // Default if missing

      // Convert interview time to timestamp
      const interviewDateTime = new Date(
        currentTime.toDateString() + " " + interviewTime
      ).getTime();

      // Condition 1: Upcoming interviews (within the next 30 minutes)
      const isUpcoming =
        interviewDateTime > currentTimestamp &&
        interviewDateTime <= currentTimestamp + 30 * 60 * 1000;

      // Condition 2: Past interviews (before the current time) but `token` is NOT "yes"
      const isPastButValid =
        interviewDateTime <= currentTimestamp && item.token !== "Yes";

      return isUpcoming || isPastButValid;
    });
  };

  const [REMINDER_INTERVAL, SETREMINDER_INTERVAL] = useState(30 * 60 * 1000);
  const REMINDER_INTERVAL_ForContinous = 0.5 * 60 * 1000;

  useEffect(() => {
    getTodaysInterviews();
    const reminderInterval = setInterval(() => {
      getTodaysInterviews();
    }, REMINDER_INTERVAL_ForContinous);
    return () => clearInterval(reminderInterval);
  }, []);

  useEffect(() => {
    if (interviewsForToday.data) {
      const upcomingInterviews = filterUpcomingInterviews(
        interviewsForToday.data
      );
      setFilteredInterviews(upcomingInterviews);

      const todayDate = getFormattedDateISOYMDformat();
      const lastReminderDate = localStorage.getItem("interviewReminderShown");

      if (lastReminderDate !== todayDate && upcomingInterviews.length > 0) {
        openInterviewReminderModal();
        localStorage.setItem("interviewReminderShown", todayDate);
      }

      if (upcomingInterviews.length > 0) {
        const reminderInterval = setInterval(() => {
          openInterviewReminderModal();
        }, REMINDER_INTERVAL);

        return () => clearInterval(reminderInterval);
      }
    }
  }, [interviewsForToday]);

  return (
    <>
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        {/* <LogoutOnEvent /> */}

        {/* Swapnil_SideBar_responsiveAccordingToScreen_161to162_02/07 */}
        <div className="head-sidebar">
          <div className="sidebar-menu-btn" onClick={toggleSidebar}>
            <i
              className="fa-solid fa-chevron-left"
              style={{
                color: "black",
              }}
            ></i>
          </div>
          <div className="nav">
            <div className="sidebar-menu">
              <ul>
                <>
                  {userType === "SuperUser" ? (
                    <li
                      onClick={
                        paymentMade
                          ? handleButtonClick(
                              "subscription",
                              toggelSubscriptions
                            )
                          : (e) => e.preventDefault()
                      }
                      className={
                        activeButton === "subscription" ? "active" : ""
                      }
                      style={{
                        cursor: paymentMade ? "pointer" : "not-allowed",
                        opacity: paymentMade ? 1 : 0.6,
                      }}
                      title={
                        !paymentMade
                          ? "Complete payment to access this feature"
                          : ""
                      }
                    >
                      <a
                        href="#"
                        style={{
                          color: paymentMade ? "gray" : "darkgray",
                          textDecoration: paymentMade ? "none" : "line-through",
                        }}
                        onClick={(e) => {
                          if (!paymentMade) e.preventDefault();
                        }}
                      >
                        <i className="fa-solid fa-user-plus"></i>
                        <span className="sidebar-text">Subscription Plans</span>
                      </a>
                    </li>
                  ) : null}

                  <>
                  {userType != "Recruiters" && (
                  <li
                        onClick={handleButtonClick(
                          "activeTeamMembers",
                          toggleactiveTeamMembers 
                        )}
                        className={
                          activeButton === "activeTeamMembers" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <i className="icon ph-bold ph-house-simple"></i> */}

                          <i className="fa fa-user-circle" aria-hidden="true"></i>
                          <span className="sidebar-text">Active Team Members </span>
                        </a>
                      </li>
                  ) 
                }
                    {userType != "SuperUser" && userType != "Vendor" ? (
                      <li
                        onClick={handleButtonClick(
                          "interviewDate",
                          toggleShowShortListedCandidateData /*Akash_Pawar_SideBar_toggleShowShortListedCandidateData_23/07_LineNo_174*/
                        )}
                        className={
                          activeButton === "interviewDate" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <i className="icon ph-bold ph-house-simple"></i> */}

                          <i className="fa-solid fa-user-check"></i>
                          <span className="sidebar-text">Shortlisted </span>
                        </a>
                      </li>
                    ) : null}
                    {userType != "Manager" && userType != "SuperUser" ? (
                      <li
                        onClick={handleButtonClick(
                          "callingTrackerForm",
                          toggleCallingTrackerForm
                        )}
                        className={
                          activeButton === "callingTrackerForm" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <i className="fa-solid fa-user-plus"></i>
                          <span className="sidebar-text">Add Candidate</span>
                        </a>
                      </li>
                    ) : null}
                  </>

                  {userType != "SuperUser" ? (
                    <li
                      className={`${
                        activeSubMenu === "candidate" ||
                        isCandidateSectionActive
                          ? "active"
                          : ""
                      }`}
                      onClick={toggleSubMenu("candidate")}
                    >
                      <a href="#">
                        <i className="fa-solid fa-users"></i>
                        <span className="sidebar-text newoverlayontopcss">
                          Find Candidate
                        </span>
                        {successAddUpdateResponse ? (
                          <span className="text-xl font-bold text-red-600">
                            *
                          </span>
                        ) : null}
                        <i className="arrow ph-bold ph-caret-down"></i>
                      </a>

                      <ul
                        className={`sub-menu ${
                          activeSubMenu === "candidate" ? "active" : ""
                        }`}
                      >
                        <li
                          style={{ marginLeft: "10px" }}
                          onClick={handleButtonClick(
                            "selfCalling",
                            toggleSelfCalling
                          )}
                          className={
                            activeButton === "selfCalling" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            <span className="sidebar-text">
                              Calling Tracker
                            </span>
                          </a>
                        </li>

                        <li
                          style={{ marginLeft: "10px" }}
                          onClick={handleButtonClick("lineUp", toggelLineUp)}
                          className={activeButton === "lineUp" ? "active" : ""}
                        >
                          <a href="#">
                            <span className="sidebar-text">Lineup Tracker</span>
                            {successAddUpdateResponse ? (
                              <span className="text-xl font-bold text-red-600">
                                *
                              </span>
                            ) : null}
                          </a>
                        </li>
                        {userType != "Vendor" ? (
                          <>
                            <li
                              style={{ marginLeft: "10px" }}
                              hidden
                              onClick={handleButtonClick(
                                "shortListed",
                                toggleShortListed
                              )}
                              className={
                                activeButton === "shortListed" ? "active" : ""
                              }
                            >
                              <a href="#">
                                {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                                <span className="sidebar-text">
                                  Shortlisted Candidate
                                </span>
                                {/* ) : null} */}
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: "10px" }}
                              hidden
                              onClick={handleButtonClick(
                                "shortListed",
                                toggleShortListed
                              )}
                              className={
                                activeButton === "shortListed" ? "active" : ""
                              }
                            >
                              <a href="#">
                                {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                                <span className="sidebar-text">
                                  Shortlisted Candidate
                                </span>
                              </a>
                            </li>
                            <li
                              style={{ marginLeft: "10px" }}
                              onClick={handleButtonClick(
                                "selectCandidate",
                                toggleSelectCandidate
                              )}
                              className={
                                activeButton === "selectCandidate"
                                  ? "active"
                                  : ""
                              }
                            >
                              <a href="#">
                                <span className="sidebar-text">
                                  Selected Candidate
                                </span>
                              </a>
                            </li>

                            <li
                              style={{ marginLeft: "10px" }}
                              onClick={handleButtonClick(
                                "holdCandidate",
                                toggleHoldCandidate
                              )}
                              className={
                                activeButton === "holdCandidate" ? "active" : ""
                              }
                            >
                              <a href="#">
                                {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                                <span className="sidebar-text">
                                  Hold Candidate
                                </span>
                              </a>
                            </li>

                            <li
                              style={{ marginLeft: "10px" }}
                              onClick={handleButtonClick(
                                "rejectedCandidate",
                                toggleRejectedCandidate
                              )}
                              className={
                                activeButton === "rejectedCandidate"
                                  ? "active"
                                  : ""
                              }
                            >
                              <a href="#">
                                {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                                <span className="sidebar-text">
                                  Rejected Candidate
                                </span>
                              </a>
                            </li>

                            {/* ---------Arshad Comment this changes dont uncomment-------------- */}

                            <li
                              className={
                                activeButton === "employeeMasterSheet"
                                  ? "active"
                                  : ""
                              }
                              onClick={handleButtonClick(
                                "employeeMasterSheet",
                                toggleEmployeeMasterSheet
                              )}
                              style={{ marginLeft: "10px" }}
                            >
                              <a href="#">
                                {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                                <span className="sidebar-text">
                                  Master Tracker
                                </span>
                              </a>
                            </li>
                          </>
                        ) : null}
                      </ul>
                    </li>
                  ) : null}
                </>
                {/* Arshad Attar Added New Cement button Logic as per, Subscription Status- On 28-11-2024 Start Line- 630 to 600 */}

                <li
                  className={`${
                    activeSubMenu === "Jobdiscription" || isJobDescriptionActive
                      ? "active"
                      : ""
                  }`}
                  onClick={
                    paymentMade
                      ? toggleSubMenu("Jobdiscription")
                      : (e) => e.preventDefault()
                  }
                  style={{
                    cursor: paymentMade ? "pointer" : "not-allowed",
                    opacity: paymentMade ? 1 : 0.6,
                  }}
                  title={
                    !paymentMade
                      ? "Complete payment to access this feature"
                      : ""
                  }
                >
                  <a
                    href="#"
                    style={{
                      color: paymentMade ? "gray" : "darkgray",
                      textDecoration: paymentMade ? "none" : "line-through",
                    }}
                    onClick={(e) => {
                      if (!paymentMade) e.preventDefault();
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span className="sidebar-text">Job Description</span>
                    {/* <i className="arrow ph-bold ph-caret-down"></i> */}
                    <i className="arrow ph-bold ph-caret-down newArrowForJd"></i>
                  </a>

                  <ul
                    className={`sub-menu ${
                      activeSubMenu === "Jobdiscription" ? "active" : ""
                    }`}
                  >
                    <li
                      style={{ marginLeft: "10px" }}
                      onClick={handleButtonClick(
                        "jobDescription",
                        toggleJobDescription
                      )}
                      className={
                        activeButton === "jobDescription" ? "active" : ""
                      }
                    >
                      <a href="#">
                        {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                        <span className="sidebar-text">
                          {" "}
                          View Job Descriptions
                        </span>
                      </a>
                    </li>

                    {
                      userType === "Recruiters" && (
                        <li
                        style={{ marginLeft: "10px" }}
                        onClick={handleButtonClick(
                          "sentProfileAccess",
                          toggleSentProfileAccess
                        )}
                        className={
                          activeButton === "sentProfileAccess" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">
                            {" "}
                           Permited Sent Profiles
                          </span>
                        </a>
                      </li>
                      )
                    }

                    {(userType != "Recruiters" &&
                      userType != "SuperUser" &&
                      userType != "Vendor") ||
                    (userType === "TeamLeader" && userType === "Manager") ? (
                      <li
                        style={{ marginLeft: "10px" }}
                        onClick={handleButtonClick(
                          "addJobDescription",
                          toggleAddJobDescription
                        )}
                        className={
                          activeButton === "addJobDescription" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">
                            Add Job Description
                          </span>
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </li>
                {userType != "SuperUser" ? (
                  <>
                    <li
                      className={
                        activeButton === "incentive" || "attendance"
                          ? "active"
                          : ""
                      }
                      onClick={toggleSubMenu("employee")}
                    >
                      {/* <a href="#">
                        <i
                          className="fa-solid fa-user-gear"
                        ></i>
                        <span className="sidebar-text">Employee Section</span>
                        <i className="arrow ph-bold ph-caret-down"></i>
                      </a> */}

                      <ul
                        className={`sub-menu sub-menu1 ${
                          activeSubMenu === "employee" ? "active" : ""
                        }`}
                      >
                        <li
                          style={{ marginLeft: "10px" }}
                          onClick={handleButtonClick(
                            "incentive",
                            toggleIncentive
                          )}
                          className={
                            activeButton === "incentive" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            {/* <span className="sidebar-text">My Incentive </span> */}
                          </a>
                        </li>
                        <li
                          style={{ marginLeft: "10px" }}
                          onClick={handleButtonClick(
                            "attendance",
                            toggleAttendance
                          )}
                          className={
                            activeButton === "attendance" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            {/* <span className="sidebar-text">My Attendance </span> */}
                          </a>
                        </li>
                      </ul>
                    </li>
                    {/*SwapnilRokade_ Add TeamLeader section Added_05/07 */}
                  </>
                ) : null}

                {/*SwapnilRokade_ Add TeamLeader section Added_05/07 */}
                {userType === "TeamLeader" ? (
                  <>
                    {userType != "Recruiters" && userType != "Vendor" ? (
                      <li
                        className={`${
                          activeSubMenu === "TeamLeader-section" ||
                          isTeamLeaderActive
                            ? "active"
                            : ""
                        }`}
                        // {
                        //   activeButton === "TeamLeader-section" || isTeamLeaderActive ? "active" : ""
                        // }
                        onClick={toggleSubMenu("TeamLeader-section")}
                      >
                        <a href="#">
                          <i className="fa-solid fa-users"></i>
                          <span className="sidebar-text">
                            Team Leader Section
                          </span>
                          <i className="arrow ph-bold ph-caret-down"></i>
                        </a>
                        <ul
                          className={`sub-menu sub-menu1 ${
                            activeSubMenu === "TeamLeader-section"
                              ? "active"
                              : ""
                          }`}
                        >
                          <li
                            onClick={handleButtonClick(
                              "sendCandidate",
                              toggleSendCandidate
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "sendCandidate" ? "active" : ""
                            }
                          >
                            <a href="#">
                              <span className="sidebar-text">Sent Profile</span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "updateResponse",
                              toggleUpdateResponse
                            )}
                            className={
                              activeButton === "updateResponse" ? "active" : ""
                            }
                            style={{ marginLeft: "10px" }}
                          >
                            <a href="#">
                              <span className="sidebar-text">
                                Interview Feedback
                                {/* Update Response */}
                              </span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "sharedProfiles",
                              toggleSharedProfiles
                            )}
                            className={
                              activeButton === "sharedProfiles" ? "active" : ""
                            }
                            style={{ marginLeft: "10px" }}
                          >
                            <a href="#">
                              <span className="sidebar-text">
                                Shared Profiles
                              </span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "issueLetter",
                              toggleIssueLetter
                            )}
                            className={
                              activeButton === "issueLetter" ? "active" : ""
                            }
                            style={{ marginLeft: "10px" }}
                          >
                            <a href="#">
                              <span className="sidebar-text">
                                Issue Letter
                              </span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "payRoll",
                              togglePayRoll
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "payRoll" ? "active" : ""
                            }
                          >
                            <a href="#">
                              <span className="sidebar-text">Pay Roll</span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "questionPaper",
                              toggleQuestionPaper
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "questionPaper" ? "active" : ""
                            }
                          >
                            <a href="#">
                              <span className="sidebar-text">
                                Create Question paper
                              </span>
                            </a>
                          </li>
                          {/* neha_add_scheduleinterview_page_line_no511_523 */}
                          <li
                            onClick={handleButtonClick(
                              "scheduleinterview",
                              togglescheduleinterview
                            )}
                            className={
                              activeButton === "scheduleinterview"
                                ? "active"
                                : ""
                            }
                            style={{ marginLeft: "10px" }}
                          >
                            <a href="#">
                              {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                              <span className="sidebar-text">
                                Schedule Interview
                              </span>
                            </a>
                          </li>
                          <li
                            onClick={handleButtonClick(
                              "addRecruiter",
                              toggelAddRecruiter
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "addRecruiter" ? "active" : ""
                            }
                          >
                            <a href="#">
                              {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                              <span className="sidebar-text">
                                Add Recruiters
                              </span>
                            </a>
                          </li>

                          <li
                            onClick={handleButtonClick(
                              "employeeDetails",
                              toggleEmployeeDetails
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "employeeDetails" ? "active" : ""
                            }
                          >
                            <a href="#">
                              {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                              <span className="sidebar-text">Team Details</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    ) : null}
                  </>
                ) : null}

                {userType === "Manager" ? (
                  <li
                    className={`${
                      activeSubMenu === "admin-section" || isManagerActive
                        ? "active"
                        : ""
                    }`}
                    onClick={toggleSubMenu("admin-section")}
                  >
                    <a href="#">
                      <i className="fa-solid fa-computer"></i>
                      <span className="sidebar-text">Manager Section</span>{" "}
                      {/* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_428 */}
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 ${
                        activeSubMenu === "admin-section" ? "active" : ""
                      }`}
                    >
                      <>
                        <li
                          onClick={handleButtonClick(
                            "sendCandidate",
                            toggleSendCandidate
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "sendCandidate" ? "active" : ""
                          }
                        >
                          <a href="#">
                            <span className="sidebar-text">Sent Profile</span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "updateResponse",
                            toggleUpdateResponse
                          )}
                          className={
                            activeButton === "updateResponse" ? "active" : ""
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              Interview Feedback
                              {/* Update Response */}
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "sharedProfiles",
                            toggleSharedProfiles
                          )}
                          className={
                            activeButton === "sharedProfiles" ? "active" : ""
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              Shared Profiles
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "issueLetter",
                            toggleIssueLetter
                          )}
                          className={
                            activeButton === "issueLetter" ? "active" : ""
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              Issue Letter
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "companyOfferForm",
                            toggleCompanyOfferForm
                          )}
                          className={
                            activeButton === "companyOfferForm" ? "active" : ""
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          <a href="#">
                            <span className="sidebar-text">
                            Company Offer Form
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick("payRoll", togglePayRoll)}
                          style={{ marginLeft: "10px" }}
                          className={activeButton === "payRoll" ? "active" : ""}
                        >
                          <a href="#">
                            <span className="sidebar-text">Pay Roll</span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "scheduleinterview",
                            togglescheduleinterview
                          )}
                          className={
                            activeButton === "scheduleinterview" ? "active" : ""
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            <span className="sidebar-text">
                              Schedule Interview
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick("billing", toggleBilling)}
                          style={{ marginLeft: "10px" }}
                          className={activeButton === "billing" ? "active" : ""}
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              Billing Dashboard
                            </span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick("invoice", toggleInvoice)}
                          style={{ marginLeft: "10px" }}
                          className={activeButton === "invoice" ? "active" : ""}
                        >
                          <a href="#">
                            <span className="sidebar-text"> Make Invoice</span>
                          </a>
                        </li>

                        <li
                          onClick={handleButtonClick(
                            "invoiceReport",
                            toggleInvoiceReport
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "invoiceReport" ? "active" : ""
                          }
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              {" "}
                              Invoice Report
                            </span>
                          </a>
                        </li>
                        {/* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_438-445 */}

                        {/* <li
                          onClick={handleButtonClick(
                            "questionPaper",
                            toggleQuestionPaper
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "questionPaper" ? "active" : ""
                          }
                        >
                          <a href="#">
                            <span className="sidebar-text">
                              Create Question paper
                            </span>
                          </a>
                        </li>
                        {/* neha_add_scheduleinterview_page_line_no511_523 */}

                        {/* <li
                          onClick={handleButtonClick(
                            "invoiceReport",
                            toggleInvoiceReport
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "invoiceReport" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                        {/* <span className="sidebar-text">
                              Create Question paper
                            </span>
                          </a>
                        </li>  */}

                        <li
                          style={{ marginLeft: "10px" }}
                          className={activeButton === "assignC" ? "active" : ""}
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            <span
                              className="sidebar-text"
                              onClick={handleButtonClick(
                                "assignC",
                                toggleAssigncolumns
                              )}
                            >
                              Assign Columns
                            </span>
                          </a>
                        </li>
                      </>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "managerTeamD" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "managerTeamD",
                              toggleEmployeeDetails
                            )}
                          >
                            Team Details
                          </span>
                        </a>
                      </li>

                      <>
                        <li
                          onClick={handleButtonClick(
                            "addTeamLeader",
                            toggeleAddTeamLeader
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "addTeamLeader" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            <span className="sidebar-text">
                              Add Team Leader
                            </span>
                          </a>
                        </li>
                      </>

                      <li
                        onClick={handleButtonClick(
                          "addCompany",
                          toggleAddCompany
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "addCompany" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span className="sidebar-text">
                            Add Client Details
                          </span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick("capex", toggleCapex)}
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "capex" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text">Capex</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}
                {/* </>
                  ): null} */}

                {/* ArshadAttar_EmpDashboard_Added_SuperUser_11/07/2024_LineNo_633 */}
                {/* Arshad Attar Added New Cement button Logic as per, Subscription Status- On 28-11-2024 Start Line- 1166 to 12000 */}
                {userType === "SuperUser" ? (
                  <li
                    className={`${
                      activeSubMenu === "SuperUser" || isSuperUserActive
                        ? "active"
                        : ""
                    }`}
                    onClick={
                      paymentMade
                        ? handleButtonClick(
                            "SuperUser",
                            toggleSubMenu("SuperUser")
                          )
                        : (e) => e.preventDefault()
                    }
                    style={{
                      cursor: paymentMade ? "pointer" : "not-allowed",
                      opacity: paymentMade ? 1 : 0.6,
                    }}
                    title={
                      !paymentMade
                        ? "Complete payment to access this feature"
                        : ""
                    }
                  >
                    <a
                      href="#"
                      style={{
                        color: paymentMade ? "gray" : "darkgray",
                        textDecoration: paymentMade ? "none" : "line-through",
                      }}
                      onClick={(e) => {
                        if (!paymentMade) e.preventDefault();
                      }}
                    >
                      <i className="fa-solid fa-user-tie"></i>
                      <span className="sidebar-text">Super User</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "SuperUser" ? "active" : ""
                      }`}
                    >
                      {/* <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "SuperUser" ? "active" : ""}
                        onClick={toggeleProfitChart}
                      >
                        <a href="#">
                          <span className="sidebar-text">P & L Chart</span>
                        </a>
                      </li> */}
                      <li
                        onClick={handleButtonClick("billing", toggleBilling)}
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "billing" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text">
                            Billing Dashboard
                          </span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick("invoice", toggleInvoice)}
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "invoice" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text"> Make Invoice</span>
                        </a>
                      </li>

                      <li
                        onClick={handleButtonClick(
                          "invoiceReport",
                          toggleInvoiceReport
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "invoiceReport" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span className="sidebar-text"> Invoice Report</span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick(
                          "sendCandidate",
                          toggleSendCandidate
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "sendCandidate" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span className="sidebar-text">Sent Profile</span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick(
                          "addCompany",
                          toggleAddCompany
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "addCompany" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span className="sidebar-text">
                            Add Client Details
                          </span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick(
                          "addRecruiter",
                          toggeleAddManager
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "addRecruiter" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">Add Manager</span>
                        </a>
                      </li>
                      <li
                        className={
                          activeButton === "superTeamD" ? "active" : ""
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "superTeamD",
                              toggleEmployeeDetails
                            )}
                          >
                            Team Details
                          </span>
                        </a>
                      </li>
                      <li
                        onClick={handleButtonClick("capex", toggleCapex)}
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "capex" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text">Capex</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}
                {userType === "SuperUser" ? (
                  <li
                    className={activeButton === "report" ? "active" : ""}
                    onClick={handleButtonClick(
                      "report",
                      toggleMainReportDatapage
                    )}
                  >
                    <a href="#">
                      <i className="fa-regular fa-address-book"></i>
                      <span className="sidebar-text">Reports</span>
                    </a>
                  </li>
                ) : null}
                {/* toggeleProfitChart */}
                {/* ArshadAttar_EmpDashboard_Added_SuperUser_11/07/2024_LineNo_660 */}

                {userType != "Vendor" ? (
                  <li
                    className={activeSubMenu === "database" ? "active" : ""}
                    onClick={toggleSubMenu("database")}
                  >
                    <a href="#">
                      <i className="fa-solid fa-database"></i>
                      <span className="sidebar-text">Database</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "database" ? "active" : ""
                      }`}
                    >
                      <li
                        onClick={handleButtonClick(
                          "excelCalling",
                          toggleExcelCalling
                        )}
                        className={
                          activeButton === "excelCalling" ? "active" : ""
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">Upload Files</span>
                        </a>
                      </li>

                      <li
                        onClick={handleButtonClick(
                          "excelcallingdata",
                          toggeExcelCallingData
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "excelcallingdata" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">
                            Uploaded Excel Data
                          </span>
                        </a>
                      </li>

                      {/* <li
                        onClick={handleButtonClick(
                          "excelLineup",
                          toggelExcelLineup
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "excelLineup" ? "active" : ""
                        }
                      > */}
                      {/* <a href="#"> */}
                      {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                      {/* <span className="sidebar-text">
                            Excel Lineup Data
                          </span> */}
                      {/* </a> */}
                      {/* </li> */}

                      <li
                        style={{ marginLeft: "10px" }}
                        onClick={handleButtonClick(
                          "resumeData",
                          toggelResumeData
                        )}
                        className={
                          activeButton === "resumeData" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">Resume Data</span>
                        </a>
                      </li>

                      <li
                        style={{ marginLeft: "10px" }}
                        onClick={handleButtonClick("sendlink", toggleShareLink)}
                        className={activeButton === "sendlink" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text">Send Link</span>
                        </a>
                      </li>

                      <li
                        style={{ marginLeft: "10px" }}
                        onClick={handleButtonClick("dataUse", toggleDataUse)}
                        className={activeButton === "dataUse" ? "active" : ""}
                      >
                        <a href="#">
                          <span className="sidebar-text">Data Use</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}
                {/* {userType != "Vendor" && userType != "SuperUser" ? (
                  <li
                    onClick={handleButtonClick("chatroom", toggleChatRoom)}
                    className={activeButton === "chatroom" ? "active" : ""}
                  >
                    <a href="#"> */}
                {/* <i className="icon ph-bold ph-gear"></i> */}
                {/* <i className="fa-brands fa-rocketchat"></i>

                      <span className="sidebar-text">Chat Section</span>
                    </a> */}
                {/* </li> */}
                {/* // ) : null} */}

                {userType != "SuperUser" && userType != "Vendor" ? (
                  <>
                    <li
                      onClick={handleButtonClick(
                        "notepad",
                        toggelDisplayNotPad
                      )}
                      className={activeButton === "notepad" ? "active" : ""}
                    >
                      <a href="#">
                        <i className="fa-regular fa-clipboard"></i>
                        <span className="sidebar-text">Note Pad</span>
                      </a>
                    </li>
                    {userType != "Vendor" && userType != "Recruiters" ? (
                      <li
                        className={activeButton === "report" ? "active" : ""}
                        onClick={handleButtonClick(
                          "report",
                          toggleMainReportDatapage
                        )}
                      >
                        <a href="#">
                          <i className="fa-regular fa-address-book"></i>
                          <span className="sidebar-text">Reports</span>
                        </a>
                      </li>
                    ) : null}
                  </>
                ) : null}
                {userType != "SuperUser" && userType != "Manager" ? (
                  <li
                    className={activeSubMenu === "portal" ? "active" : ""}
                    onClick={toggleSubMenu("portal")}
                  >
                    <a href="#">
                      <i className="fa-brands fa-linkedin"></i>
                      <span className="sidebar-text">Portal</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "portal" ? "active" : ""
                      }`}
                    >
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "naukri" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "naukri",
                              openNaukriPlatform
                            )}
                          >
                            Naukri
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "linkedin" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "linkedin",
                              openLinkedinPlatform
                            )}
                          >
                            LinkedIn
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "timesJob" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "timesJob",
                              openTimesPlatform
                            )}
                          >
                            Times Jobs
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "indeed" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "indeed",
                              openIndeedPlatform
                            )}
                          >
                            Indeed
                          </span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}
                {userType != "TeamLeader" && userType != "SuperUser" ? (
                  <li
                    className={activeSubMenu === "aboutus" ? "active" : ""}
                    onClick={toggleSubMenu("aboutus")}
                  >
                    <a href="#">
                      <i className="fa-solid fa-circle-info"></i>
                      <span className="sidebar-text">About Us</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "aboutus" ? "active" : ""
                      }`}
                    >
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "rights" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "rights",
                              toggeleRightsInstructions
                            )}
                          >
                            Rights & Instructions
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "privacy" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "privacy",
                              toggeleCompanyPolicy
                            )}
                          >
                            Company Policy
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "issue" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "issue",
                              toggeleIssueSolving
                            )}
                          >
                            Issues Solving
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "rarea" ? "active" : ""}
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "rarea",
                              toggelePainArea
                            )}
                          >
                            Recruites Pain Area
                          </span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}

                {userType != "SuperUser" && userType != "Vendor" ? (
                  <li
                    className={activeSubMenu === "help" ? "active" : ""}
                    onClick={toggleSubMenu("help")}
                  >
                    <a href="#">
                      <i className="fa-regular fa-circle-question"></i>
                      <span className="sidebar-text">Help</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "help" ? "active" : ""
                      }`}
                    >
                      <li
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "interviewQ" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span
                            className="sidebar-text"
                            onClick={handleButtonClick(
                              "interviewQ",
                              toggeleInterviewForm
                            )}
                          >
                            Interview Questions
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        className={activeButton === "hostory" ? "active" : ""}
                        onClick={handleButtonClick(
                          "hostory",
                          toggelCandidateHistory
                        )}
                      >
                        <a href="#">
                          <span className="sidebar-text">History Tracker</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}

                <li
                  className={activeSubMenu === "color" ? "active" : ""}
                  onClick={toggleSubMenu("color")}
                >
                  <a href="#">
                    <i className="fa-solid fa-palette"></i>
                    <span
                      className="sidebar-text"
                      onClick={() => {
                        setShowColor(true);
                      }}
                    >
                      Choose Colour
                    </span>
                  </a>
                </li>

                <li onClick={() => setShowConfirmation(true)}>
                  {/* removed href from ancor tg */}
                  <a>
                    <i className="fa-solid fa-power-off"></i>
                    <span className="sidebar-text">Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showColor && (
        <div
          className="bg-black bg-opacity-50 modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            height: "100vh",
          }}
        >
          <Modal.Dialog
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Body>
              <div className="color-picker">
                <ColorPicker
                  onColorApplied={handleColorApplied}
                  setShowColor={setShowColor}
                />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}

      {showConfirmation && (
        <div
          className="bg-black bg-opacity-50 modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            height: "100vh",
          }}
        >
          <Modal.Dialog
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Body>
              <p className="confirmation-text">
                Are you sure you want to logout?
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button onClick={handleLogoutLocal} className="buttoncss">
                  Yes
                </button>

                <button
                  onClick={() => setShowConfirmation(false)}
                  className="buttoncss"
                >
                  No
                </button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}
      {openInterviewModal && (
        <>
          <AntdModal
            title="Candidate's Data"
            open={openInterviewModal}
            onOk={handleOk1}
            onCancel={handleCancel1}
            width={1000}
            cancelText="Skip"
          >
            <div className="newhightformodaltable">
              <table className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                    <th className="attendanceheading">Sr. No.</th>
                    <th className="attendanceheading">Candidate Id</th>
                    <th className="attendanceheading">Candidate's Name</th>
                    <th className="attendanceheading">Candidate's Email</th>
                    <th className="attendanceheading">Contact Number</th>
                    <th className="attendanceheading">Interview Date</th>
                    <th className="attendanceheading">Interview Time</th>
                    <th className="attendanceheading">Attending Status</th>
                    <th className="attendanceheading">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews?.map((item, index) => (
                    <tr key={index} className="attendancerows">
                      <td className="tabledata">{index + 1}</td>
                      <td className="tabledata">{item.candidateId}</td>
                      <td className="tabledata">{item.candidateName}</td>
                      <td className="tabledata">{item.candidateEmail}</td>
                      <td className="tabledata">{item.contactNumber}</td>
                      <td className="tabledata">
                        {item.availabilityForInterview}
                      </td>
                      <td className="tabledata">{item.interviewTime}</td>
                      <td className="tabledata">
                        {item.token ? item.token : "-"}
                      </td>
                      <td className="tabledata">
                        <FormOutlined
                          onClick={(e) =>
                            openAnotherModalForPerformAction(item)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AntdModal>

          {openInterviewModalForAction && (
            <>
              <AntdModal
                title="Perform Action"
                open={openInterviewModalForAction}
                onOk={handleOk2}
                onCancel={handleCancel2}
                width={650}
              >
                <div className="infoMainDivMo">
                  <Form
                    labelCol={{ span: 10 }}
                    labelAlign="left"
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                  >
                    {/* Calling Remark */}
                    <Form.Item label="Calling Remark">
                      <Select
                        name="callingRemark"
                        value={interviewFormData.callingRemark}
                        onChange={(value) =>
                          handleAntdFormChange(value, "callingRemark")
                        }
                        prefix={<PhoneOutlined />}
                      >
                        <Select.Option value="Call Done">
                          Call Done
                        </Select.Option>
                        <Select.Option value="Asked for Call Back">
                          Asked for Call Back
                        </Select.Option>
                        <Select.Option value="No Answer">
                          No Answer
                        </Select.Option>
                        <Select.Option value="Network Issue">
                          Network Issue
                        </Select.Option>
                        <Select.Option value="Invalid Number">
                          Invalid Number
                        </Select.Option>
                        <Select.Option value="Need to call back">
                          Need to call back
                        </Select.Option>
                        <Select.Option value="Do not call again">
                          Do not call again
                        </Select.Option>
                        <Select.Option value="others">others</Select.Option>
                      </Select>
                    </Form.Item>

                    {/* Interview Attending Status (Shown only if Calling Remark is 'Call Done') */}
                    {/* {interviewFormData.callingRemark === 'Call Done' && ( */}
                    <Form.Item label="Interview Attending Status">
                      <Radio.Group
                        name="attendingStatus"
                        value={interviewFormData.attendingStatus}
                        onChange={(e) =>
                          handleAntdFormChange(
                            e.target.value,
                            "attendingStatus"
                          )
                        }
                        className="newclassformakeflexandjustifyformodal"
                      >
                        <Radio value="Yes">
                          Yes{" "}
                          <CheckCircleOutlined
                            style={{ color: "green", marginRight: 5 }}
                          />
                        </Radio>
                        <Radio value="No">
                          No{" "}
                          <CloseCircleOutlined
                            style={{ color: "red", marginRight: 5 }}
                          />
                        </Radio>

                        <Radio value="Not Confirm">
                          Not Confirm{" "}
                          <ExclamationCircleOutlined
                            style={{ color: "red", marginRight: 5 }}
                          />
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    {/* )} */}

                    {/* Comment Field (Always visible) */}
                    <Form.Item label="Comment">
                      <Input
                        placeholder="Enter Comment..."
                        name="comment"
                        value={interviewFormData.comment}
                        onChange={(e) =>
                          handleAntdFormChange(e.target.value, "comment")
                        }
                        prefix={<CommentOutlined />}
                      />
                    </Form.Item>

                    {/* Interview Date & Time (Only shown when 'Interview Attending Status' is 'No') */}
                    {interviewFormData.attendingStatus === "No" && (
                      <Form.Item label="Next Interview Date">
                        <div className="wrappedForDisplayFle">
                          <DatePicker
                            name="nextDate"
                            style={{ marginRight: "10px" }}
                            format="YYYY-MM-DD"
                            value={
                              interviewFormData.nextDate
                                ? dayjs(interviewFormData.nextDate)
                                : null
                            }
                            onChange={(date) =>
                              handleAntdFormChange(
                                date ? dayjs(date).format("YYYY-MM-DD") : "",
                                "nextDate"
                              )
                            }
                          />
                          <TimePicker
                            name="nextTime"
                            format="hh:mm A"
                            value={
                              interviewFormData.nextTime
                                ? dayjs(interviewFormData.nextTime, "hh:mm A")
                                : null
                            }
                            onChange={(time) =>
                              handleAntdFormChange(
                                time ? dayjs(time).format("hh:mm A") : "",
                                "nextTime"
                              )
                            }
                          />
                        </div>
                      </Form.Item>
                    )}
                  </Form>
                </div>
              </AntdModal>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Sidebar;
