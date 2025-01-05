import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../EmployeeDashboard/dailyWork.css";
import Profile from "../photos/profileImg.webp";
import logoutImg from "../photos/download.jpeg";
import { Modal, Button } from "react-bootstrap";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL } from "../api/api";
import watingImg from "../photos/fire-relax.gif";
import socketIOClient from "socket.io-client";

//added by sahil karnekar and commented because it was implemented just for testing purpose but dont remove this
import { Avatar, Badge } from "antd";
import { BellOutlined, CloseOutlined, ClearOutlined } from "@ant-design/icons";
import { initializeSocket } from "./socket.jsx";

//SwapnilRokade_DailyWork_LogoutFunctionalityWorking_31/07

function DailyWork({
  onCurrentEmployeeJobRoleSet,
  successCount,
  successfulDataAdditions,
  // handleDataAdditionSuccess,
  profilePageLink,
  logoutTimestamp,
  jobRole,
  emailSenderInformation,
  successfulDataUpdation,
}) {
  const { employeeId } = useParams();
  const [fetchWorkId, setFetchWorkId] = useState(null);
  const [employeeData, setEmployeeData] = useState({});
  const [employeeName, setEmployeeName] = useState();
  const [modalEmployeeData, setModalEmployeeData] = useState(null);
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showAllDailyBtns, setShowAllDailyBtns] = useState(true);
  const [loginDetailsSaved, setLoginDetailsSaved] = useState(false);
  const [showAlreadyLoggedInMessage, setShowAlreadyLoggedInMessage] =
    useState(false);

  const [buttonColor, setButtonColor] = useState(() => {
    return localStorage.getItem("buttonColor");
  });

  const getStoredTime = () => {
    const storedTime = localStorage.getItem(`stopwatchTime_${employeeId}`);
    return storedTime
      ? JSON.parse(storedTime)
      : { hours: 0, minutes: 0, seconds: 0 };
  };

  const getStoredData = () => {
    const storedData = localStorage.getItem(`dailyWorkData_${employeeId}`);
    return storedData ? JSON.parse(storedData) : { archived: 0, pending: 10 };
  };

  const [time, setTime] = useState(getStoredTime());
  const [running, setRunning] = useState(true);
  const [data, setData] = useState(getStoredData());
  const [breaks, setBreaks] = useState([]);
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [lateMark, setLateMark] = useState("No");
  const [leaveType, setLeaveType] = useState("");
  const [paidLeave, setPaidLeave] = useState(0);
  const [unpaidLeave, setUnpaidLeave] = useState(0);
  const [dayPresentPaid, setDayPresentPaid] = useState("No");
  const [dayPresentUnpaid, setDayPresentUnpaid] = useState("Yes");
  const [remoteWork, setRemoteWork] = useState("Select");
  const [profileImage, setProfileImage] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [allowCloseModal, setAllowCloseModal] = useState(false);
  const [subScriptionReminder, setSubScriptionReminder] = useState();
  const [expiryMessage, setExpiryMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);

  const TIMER_DURATION = 15 * 60 * 1000;
  let timerId;

  const navigate = useNavigate();
  const { userType } = useParams();

  useEffect(() => {
    fetchEmployeeData();
  }, [lateMark, leaveType, paidLeave, unpaidLeave, loginTime, data]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
      );
      setEmployeeData(response.data);
      if (response.data) {
        saveUserDetails(response.data.name);
      }
      onCurrentEmployeeJobRoleSet(response.data.jobRole);
      const emailSender = {
        senderName: response.data.name,
        senderMail: response.data.officialMail,
      };
      emailSenderInformation(emailSender);
      //Akash_Pawar_DailyWork_senderinformation_09/07_81
      if (response.data.profileImage) {
        const byteCharacters = atob(response.data.profileImage);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setProfileImage(url);
        return () => URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-IN");
    console.log("Current Time:", new Date().toLocaleTimeString());
    const dateString = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    const dayOfWeek = now.getDay();
    setCurrentTime(timeString);
    setCurrentDate(dateString);
    setLoginTime(timeString);

    const loginHour = now.getHours();
    if (loginHour >= 7) {
      setLateMark("Yes");
    }

    if (dayOfWeek === 0) {
      setLeaveType("Unpaid Leave");
      setPaidLeave(0);
      setUnpaidLeave(1);
    } else {
      setLeaveType("");
      setPaidLeave(1);
      setUnpaidLeave(0);
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-SaveLoginFunctionality Start  LineNo:-128  Date:-01/07
  const saveUserDetails = (name) => {
    const storedLoginDetailsSaved = localStorage.getItem(
      `loginDetailsSaved_${employeeId}`
    );
    if (storedLoginDetailsSaved == "true") {
      setLoginDetailsSaved(true);
    }

    let executed = false;
    const saveLoginDetails = async () => {
      if (loginDetailsSaved) {
        fetchCurrentEmployerWorkId();
        console.log("Login details already saved.");
      } else {
        try {
          console.log(name);
          const now = new Date();
          const day = now.getDate().toString().padStart(2, "0");
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const year = now.getFullYear();
          const formData = {
            employeeId,
            jobRole: userType,
            employeeName: name,
            date: `${day}/${month}/${year}`,
            loginTime: now.toLocaleTimeString("en-IN"),
            lateMark,
            leaveType,
            paidLeave,
            unpaidLeave,
            dailyTarget: data.pending + data.archived,
            dailyArchived: data.archived,
            dailyPending: data.pending,
          };
          localStorage.setItem(
            `dailyWorkData_${employeeId}`,
            JSON.stringify({ archived: data.archived, pending: data.pending })
          );
          const response = await axios.post(
            `${API_BASE_URL}/save-daily-work/${employeeId}/${userType}`,
            formData
          );

          if (response.data) {
            fetchCurrentEmployerWorkId();
          }
          console.log("Login details saved successfully.");
          localStorage.setItem(
            `loginDetailsSaved_${employeeId}`,
            JSON.stringify(true)
          );
          localStorage.setItem(
            `loginTimeSaved_${employeeId}`,
            JSON.stringify(loginTime)
          );
          setLoginDetailsSaved(true);
          setShowAlreadyLoggedInMessage(true); // Show the message after saving
        } catch (error) {
          console.error("Error saving login details:", error);
        }
      }
    };

    if (!executed && loginTime && lateMark !== null && leaveType !== null) {
      saveLoginDetails();
      executed = true;
    }
  };
  //Name:-Akash Pawar Component:-DailyWork Subcategory:-SaveLoginFunctionality End LineNo:-191  Date:-01/07

  const fetchCurrentEmployerWorkId = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-work-id/${employeeId}/${userType}`
      );
      setFetchWorkId(response.data);
      console.log(response.data + "----->");
    } catch (error) {
      console.error("Error fetching work ID:", error);
    }
  };

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-CalculateTotalHoursWork(changed) Start LineNo:-193  Date:-01/07
  const calculateTotalHoursWork = (
    loginTime,
    logoutTime = null,
    breaks = []
  ) => {
    try {
      console.log(`Login Time: ${loginTime}`);
      console.log(`Logout Time: ${logoutTime}`);
      console.log(`Breaks: ${JSON.stringify(breaks)}`);

      // Create Date objects for today with the given times
      const today = new Date();
      const login = new Date(today.toDateString() + " " + loginTime);
      const logout = logoutTime
        ? new Date(today.toDateString() + " " + logoutTime)
        : new Date();

      console.log(`Login Date: ${login}`);
      console.log(`Logout Date: ${logout}`);

      let totalWorkTime = (logout - login) / 1000;

      console.log(`Initial Total Work Time (seconds): ${totalWorkTime}`);

      let totalBreakDuration = 0;
      if (breaks && breaks.length > 0) {
        breaks.forEach((b) => {
          if (b.breakEndTime) {
            const breakStart = new Date(
              today.toDateString() + " " + b.breakStartTime
            );
            const breakEnd = new Date(
              today.toDateString() + " " + b.breakEndTime
            );
            const breakDuration = (breakEnd - breakStart) / 1000;
            totalBreakDuration += breakDuration;

            console.log(`Break Start: ${breakStart}`);
            console.log(`Break End: ${breakEnd}`);
            console.log(`Break Duration (seconds): ${breakDuration}`);
          }
        });
      }

      console.log(`Total Break Duration (seconds): ${totalBreakDuration}`);

      totalWorkTime -= totalBreakDuration;

      console.log(`Adjusted Total Work Time (seconds): ${totalWorkTime}`);

      if (totalWorkTime < 0) {
        totalWorkTime = 0;
      }

      const hours = Math.floor(totalWorkTime / 3600);
      const minutes = Math.floor((totalWorkTime % 3600) / 60);
      const seconds = Math.floor(totalWorkTime % 60);

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      console.log(`Total work time: ${formattedTime}`);
      return formattedTime;
    } catch (error) {
      console.error("Error in calculateTotalHoursWork:", error);
      return "00:00:00";
    }
  };
  //Name:-Akash Pawar Component:-DailyWork Subcategory:-CalculateTotalHoursWork(changed) Start LineNo:-269  Date:-01/07

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds + 1;
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
          const newHours = prevTime.hours + Math.floor(newMinutes / 60);
          const updatedTime = {
            hours: newHours % 24,
            minutes: newMinutes % 60,
            seconds: newSeconds % 60,
          };
          localStorage.setItem(
            `stopwatchTime_${employeeId}`,
            JSON.stringify(updatedTime)
          );
          return updatedTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running, employeeId]);

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-updateArchievedPendingCount(changed) Start LineNo:-441 Date:-01/07
  const updateArchievedPendingCount = (archivedIncrement, pendingDecrement) => {
    let updatedData;
    if (data.pending > 0) {
      updatedData = {
        archived: archivedIncrement + 1,
        pending: pendingDecrement - 1,
      };
    } else {
      updatedData = {
        archived: archivedIncrement + 1,
        pending: 0,
      };
    }
    setData(updatedData);

    console.log("Archived Increment:", archivedIncrement);
    console.log("Pending Decrement:", pendingDecrement);
    console.log("Updated Data:", updatedData);

    if (updatedData.archived >= 3) {
      setDayPresentPaid("Yes");
      setDayPresentUnpaid("No");
    } else {
      setDayPresentPaid("No");
      setDayPresentUnpaid("Yes");
    }

    localStorage.setItem(
      `dailyWorkData_${employeeId}`,
      JSON.stringify(updatedData)
    );
    return updatedData;
  };
  //Name:-Akash Pawar Component:-DailyWork Subcategory:-updateArchievedPendingCount(changed) End LineNo:-470 Date:-01/07

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-updateArchieved(changed) Start LineNo:-334 Date:-01/07
  const updateArchieved = () => {
    console.log(successfulDataUpdation);

    if (successfulDataAdditions || successfulDataUpdation) {
      // Assuming updateCount is a function that updates states like archived and pending
      const updatedData = JSON.parse(
        localStorage.getItem(`dailyWorkData_${employeeId}`)
      );
      if (updatedData) {
        updateArchievedPendingCount(updatedData.archived, updatedData.pending);
      }
    }
  };
  useEffect(() => {
    updateArchieved();
  }, [successfulDataAdditions, successfulDataUpdation]);

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-updateArchieved(changed) End LineNo:-351 Date:-01/07
  const handlePause = () => {
    setRunning(false);
    const now = new Date().toLocaleTimeString("en-IN");
    const updatedBreaks = [...breaks, { breakStartTime: now }];
    setBreaks(updatedBreaks);
    localStorage.setItem(`breaks_${employeeId}`, JSON.stringify(updatedBreaks));
    setShowPauseModal(true);
  };

  useEffect(() => {
    // Reset allowCloseModal whenever showPauseModal changes
    if (!showPauseModal) {
      setAllowCloseModal(false); // Ensure modal cannot close until Resume is clicked again
    }
  }, [showPauseModal]);

  const handleResume = () => {
    setRunning(true);
    const now = new Date().toLocaleTimeString("en-IN");
    const updatedBreaks = breaks.map((b) =>
      !b.breakEndTime ? { ...b, breakEndTime: now } : b
    );
    setBreaks(updatedBreaks);
    localStorage.setItem(`breaks_${employeeId}`, JSON.stringify(updatedBreaks));
    setAllowCloseModal(true); // Allow modal to close
    setShowPauseModal(false); // Close the modal
  };

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-handleLogoutLocal(changed) Start LineNo:-530 Date:-01/07
  useEffect(() => {
    logoutTimestamp != null ? handleLogoutLocal() : null;
  }, [logoutTimestamp]);

  const handleLogoutLocal = async () => {
    try {
      console.log(fetchWorkId);
      const breaksData = localStorage.getItem(`breaks_${employeeId}`);
      const breaks = breaksData ? JSON.parse(breaksData) : [];
      const totalHoursWork = calculateTotalHoursWork(
        JSON.parse(localStorage.getItem(`loginTimeSaved_${employeeId}`)),
        logoutTimestamp,
        breaks
      );
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();
      let present = "absent";
      if (data.pending >= 5 && data.archived >= 5) {
        present = "present";
      }
      let checkHalfDay = "No";
      console.log(typeof totalHoursWork);
      const formData = {
        employeeId,
        date: `${day}/${month}/${year}`,
        dailyTarget: data.pending + data.archived,
        dailyArchived: data.archived,
        dailyPending: data.pending,
        loginTime: JSON.parse(
          localStorage.getItem(`loginTimeSaved_${employeeId}`)
        ),
        logoutTime: logoutTimestamp,
        totalHoursWork,
        dailyHours: breaks,
        dayPresentStatus: present,
        lateMark,
        leaveType,
        paidLeave,
        unpaidLeave,
        dayPresentPaid,
        dayPresentUnpaid,
        remoteWork,
      };

      await axios.put(
        `${API_BASE_URL}/update-daily-work/${fetchWorkId} `,
        formData
      );

      localStorage.removeItem(`loginTimeSaved_${employeeId}`);
      localStorage.removeItem(`loginDetailsSaved_${employeeId}`);
      localStorage.removeItem(`stopwatchTime_${employeeId}`);
      localStorage.removeItem(`dailyWorkData_${employeeId}`);
      localStorage.removeItem(`breaks_${employeeId}`);
      localStorage.removeItem("employeeId");

      setTime({ hours: 0, minutes: 0, seconds: 0 });
      setData({ archived: 0, pending: 10 });
      console.log("Logged out successfully.");
      navigate(`/login/${userType}`);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-handleLogoutLocal(changed) End LineNo:-593 Date:-01/07

  const handleImageClick = () => {
    setPopupVisible(true);
    setModalEmployeeData(employeeData);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setModalEmployeeData(null);
  };
  const toggleAllDailyBtns = () => {
    setShowAllDailyBtns(!showAllDailyBtns);
  };

  const handleToggleAllDailyBtns = () => {
    setShowAllDailyBtns(!showAllDailyBtns);
  };

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fetch-subscriptions-details/${employeeId}/${userType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subscription details");
      }
      const data = await response.json();

      // Find the subscription that matches the employeeId
      const subscription = data.find(
        (item) => item.superUserId === parseInt(employeeId, 10)
      );

      if (subscription) {
        console.log(subscription.paymentStatus + " Status 00999");

        if (subscription.paymentStatus === "Payment Completed") {
          setPaymentMade(true);
          localStorage.setItem("paymentMade", JSON.stringify(true));
        } else {
          setPaymentMade(false);
          localStorage.setItem("paymentMade", JSON.stringify(false));
        }

        if (subscription.remainingDays < 3) {
          setExpiryMessage(
            `Your subscription expires in ${subscription.remainingDays} days; please renew to maintain access.`
          );
          setShowModal(true); // Show modal if subscription is about to expire
        } else {
          setExpiryMessage("");
          setShowModal(false); // Hide modal if subscription is valid
        }
      } else {
        console.error("No subscription found for this employeeId");
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  const handleSkip = () => {
    setShowModal(false); // Close the modal
    resetTimer(); // Restart the timer
  };

  const resetTimer = () => {
    clearInterval(timerId); // Clear existing timer
    timerId = setInterval(() => {
      fetchSubscriptionDetails(); // Fetch details and show modal if necessary
    }, TIMER_DURATION); // Set a new timer for 2 minutes
  };

  useEffect(() => {
    fetchSubscriptionDetails(); // Fetch details when the component mounts

    // Start the timer
    timerId = setInterval(() => {
      fetchSubscriptionDetails();
    }, TIMER_DURATION);

    return () => {
      clearInterval(timerId); // Cleanup timer on component unmount
    };
  }, [employeeId, userType]);

  // this is commented by sahil karnekar dont remove this comment
  const [isOpen, setIsOpen] = useState(false); // To toggle the notification box visibility
  const [notificationCount, setNotificationCount] = useState(0); // To store notification count
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const toggleNotificationBox = () => {
    setIsOpen(!isOpen);
  };

  const handleClearNotifications = () => {
    localStorage.removeItem(`${userType}${employeeId}messages`);
    setMessages([]);
    setNotificationCount(0);
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem(
      `${userType}${employeeId}messages`
    );
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // updated by sahil karnekar
  useEffect(() => {
    const newSocket = initializeSocket(employeeId, userType);
    setSocket(newSocket);
  }, []);

  // updated by sahil karnekar date 30-12-2024
  useEffect(() => {
    if (socket) {
      socket.on("receive_saved_candidate", (message) => {
        console.log("Notification received: ", message);

        const recruiterName = `${userType}_${employeeId}`;
        // if (message.candidate.senderId !== recruiterName) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            localStorage.setItem(
              `${userType}${employeeId}messages`,
              JSON.stringify(updatedMessages)
            );
            return updatedMessages;
          });
        // }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, employeeId]);

  const formatNotificationMessage = (message) => {
    const candidateName = message?.candidate?.callingTracker?.candidateName || "Unknown Candidate";
    const recruiterName = message?.candidate?.performanceIndicator?.employeeName || "Unknown Recruiter";
    const date = message?.candidate?.callingTracker?.date || "Unknown Date";
    const time = message?.candidate?.callingTracker?.candidateAddedTime || "Unknown Time";
  
    const formatTimeTo12Hour = (time24) => {
      if (!time24) return "Unknown Time";
      const [hour, minute] = time24.split(":").map(Number);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12-hour clock
      return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };
  
    const formattedTime = formatTimeTo12Hour(time);
  
    // Format date as '2 January 2025'
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown Date";
      const dateObj = new Date(dateString);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return dateObj.toLocaleDateString("en-IN", options);
    };
  
    const formattedDate = formatDate(date);
  
    return `${candidateName} was lined up by ${recruiterName} at ${formattedTime} on ${formattedDate}.`;
  };
  
  useEffect(() => {
    const socket = socketIOClient("http://localhost:9092"); 
    socket.on("receive_saved_candidate", (data) => {
      console.log("Received Candidate Data:", data); 
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        setNotificationCount(updatedMessages.length); 
        return updatedMessages;
      });
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  

  return (
    <div className="daily-timeanddate">
      <a href="#">
        <div className="head" onClick={profilePageLink}>
          <div className="user-img">
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="user-details">
            <p>
              {employeeData.name} -{" "}
              {(userType == "Recruiters" ? "Recruiter" : "") ||
                (userType == "TeamLeader" ? "Team Leader" : "") ||
                (userType == "Manager" ? "Manager" : "") ||
                (userType == "SuperUser" ? "Super User" : "")}
              <br />
              157{employeeId}
            </p>
          </div>
        </div>
      </a>

      <button
        className="toggle-all-daily-btns"
        onClick={toggleAllDailyBtns}
        style={{ backgroundColor: buttonColor }}
      >
        {!showAllDailyBtns ? "Show" : "Hide"} All Buttons
      </button>

      {userType != "Applicant" && userType != "Vendor" ? (
        <>
          <div
            className={`all-daily-btns ${!showAllDailyBtns ? "hidden" : ""}`}
          >
            <div className="daily-t-btn">
              <button className="daily-tr-btn" style={{ whiteSpace: "nowrap" }}>
                Target : 10
              </button>
              <button
                className="daily-tr-btn"
                style={{
                  color: data.archived <= 3 ? "red" : "green",
                }}
              >
                Achieved : {data.archived}
              </button>
              <button
                className="daily-tr-btn"
                style={{
                  color: data.pending < 7 ? "green" : "red",
                }}
              >
                Pending : {data.pending}
              </button>
            </div>
            <button className="loging-hr">
              <h6 hidden>Time: {currentTime}</h6>
              <h6 hidden>Date: {currentDate}</h6>
              Login Hours : {time.hours.toString().padStart(2, "0")}:
              {time.minutes.toString().padStart(2, "0")}:
              {time.seconds.toString().padStart(2, "0")}
            </button>
            <div hidden>
              <h6>Late Mark : {lateMark}</h6>
              <h6>Leave Type : {leaveType}</h6>
              <h6>Paid Leave : {paidLeave}</h6>
              <h6>Unpaid Leave : {unpaidLeave}</h6>
              <h6>Day Present Paid : {dayPresentPaid}</h6>
              <h6>Day Present Unpaid: {dayPresentUnpaid}</h6>
            </div>

            <div hidden style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="remoteWork">Remote Work:</label>
              <select
                className="select"
                id="remoteWork"
                value={remoteWork}
                onChange={(e) => setRemoteWork(e.target.value)}
              >
                <option>Select</option>
                <option value="work from Office">WFO</option>
                <option value="Work from Home">WFH</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <button
              className={running ? "timer-break-btn" : "timer-break-btn"}
              onClick={running ? handlePause : handleResume}
              style={{ height: "30px" }}
            >
              {running ? "Pause" : "Resume"}
            </button>

            {/* commented by sahil karnekar */}
            <>
              {(employeeId == 5 ||
                employeeId == 977 ||
                employeeId == 1342 ||
                employeeId == 391 ||
                employeeId == 444 ||
                employeeId == 1 ||
                employeeId == 432 ||
                employeeId == 871 ||
                employeeId == 390 ||
                employeeId == 1340 ||
                employeeId == 2 ||
                employeeId == 4 ||
                employeeId == 430 ||
                employeeId == 869 ||
                employeeId == 1341 ||
                employeeId == 3 ||
                employeeId == 430 ||
                employeeId == 434 ||
                employeeId == 870 ||
                employeeId == 636 ||
                employeeId == 434 ||
                employeeId == 7) && (
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{ marginRight: "10px" }}
                      onClick={toggleNotificationBox}
                    >
                      <Badge count={notificationCount}>
                        <Avatar shape="square" icon={<BellOutlined />} />
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </>

            <div
              className={`notificationMainCont1 ${isOpen ? "open" : "closed"}`}
            >
              <div className="motificationSubCont1">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className="notification-item">
                      {formatNotificationMessage(message)}
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No Notifications</p>
                )}
              </div>
              <div className="buttonsDivForNotifications">
                <CloseOutlined
                  style={{
                    color: "red",
                  }}
                  onClick={toggleNotificationBox}
                />
                <button
                  className="clearButtonOfNotifications daily-tr-btn"
                  onClick={handleClearNotifications}
                >
                  Clear <ClearOutlined />
                </button>
              </div>
            </div>
          </div>
          <button
            className="toggle-all-daily-btns"
            onClick={handleToggleAllDailyBtns}
          >
            {showAllDailyBtns ? "Hide All Buttons" : "Show All Buttons"}
          </button>

          <Modal
            show={showPauseModal}
            onHide={() => {
              if (allowCloseModal) {
                setShowPauseModal(false);
              }
            }}
            className="dw-modal"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="dw-modal-content"
            >
              {/* none working close button removed date : 23-10-2024 */}
              <Modal.Header>
                <Modal.Title className="dw-modal-title">
                  Break Runing...
                </Modal.Title>
              </Modal.Header>
              <div>
                <img src={watingImg} alt="Waiting" className="dw-waiting-img" />
              </div>
              <Modal.Footer className="dw-modal-footer">
                <div className="dw-resume-div">
                  <h3>Timer is paused. Click Resume to continue...</h3>
                  <button
                    className="profile-back-button"
                    onClick={handleResume}
                  >
                    Resume
                  </button>
                </div>
              </Modal.Footer>
            </div>
          </Modal>
        </>
      ) : null}

      <Modal show={showModal} onHide={handleSkip}>
        <div className="dw-reminder-content">
          <Modal.Header>
            <Modal.Title className="dw-modal-title">
              Reminder About Subscription !!!
            </Modal.Title>
          </Modal.Header>
          {/* <div>{expiryMessage}</div> */}
          <div className="dw-reminder-div">
            <p>
              <b>Polite Reminder :- </b> Your subscription will expire in few
              days, restricting access to the login. Please contact your Super
              User to make the payment and renew your subscription to regain
              full access.
            </p>
            <br />
            <div>
              <div className="dw-reminder-button-div">
                <b>Thank you for your attention to this matter!</b>

                <div
                  style={{ display: "flex", gap: "20px", paddingTop: "10px" }}
                >
                  <button onClick={handleSkip} className="daily-tr-btn">
                    Ok
                  </button>
                  <button className="daily-tr-btn" onClick={handleSkip}>
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DailyWork;
