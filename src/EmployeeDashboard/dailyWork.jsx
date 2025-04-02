import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../EmployeeDashboard/dailyWork.css";
import dummyUserImg from "../photos/DummyUserImg.png";
import { Modal } from "react-bootstrap";
import { API_BASE_URL } from "../api/api";
// line 12 to 19 added by sahil karnekar on date 14-01-2025
//added by sahil karnekar and commented because it was implemented just for testing purpose but dont remove this
import { Avatar, Badge, notification, List, Card } from "antd";
import { BellOutlined, CloseOutlined, ClearOutlined } from "@ant-design/icons";
import { initializeSocket } from "./socket.jsx";
import Meta from "antd/es/card/Meta.js";
import {
  getCurrentLogTime,
  getCurrentTimeForUpdateData,
  getFormattedDateISOYMDformat,
  getLateMark,
} from "../EmployeeSection/getFormattedDateTime.jsx";
import { getDailyworkData,putDailyworkData } from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable.jsx";
import { useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import StopWatch from "./stopWatch.jsx";


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
  loginEmployeeName,
  trigger,
  sendOfficailMailToQr,
}) {
  const { employeeId, userType } = useParams();
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
  const triggerFetch = useSelector((state) => state.trigger.triggerFetch);

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
  const [remoteWork, setRemoteWork] = useState("work from Office");
  const [profileImage, setProfileImage] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [allowCloseModal, setAllowCloseModal] = useState(false);
  const [subScriptionReminder, setSubScriptionReminder] = useState();
  const [expiryMessage, setExpiryMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const currentDateNewGlobal = getFormattedDateISOYMDformat();
  const [messagesContext, contextHolder] = notification.useNotification({
    stack: true
      ? {
          threshold: 1,
        }
      : false,
  });

  const TIMER_DURATION = 15 * 60 * 1000;
  let timerId;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, [lateMark, leaveType, paidLeave, unpaidLeave, loginTime, data]);

  useEffect(() => {
    // Call the function to check if user data is present
    fetchCurrentEmployerWorkId();
  }, []); // Runs only once when the page loads

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
      );


      setEmployeeData(response.data);
      sendOfficailMailToQr(response.data.officialMail);
      if (response.data) {
        saveUserDetails(response.data.name);
      }

      onCurrentEmployeeJobRoleSet(response.data.jobRole);
      const emailSender = {
        senderName: response.data.name,
        senderMail: response.data.officialMail,
      };
      emailSenderInformation(emailSender);

      if (response.data.profileImage) {
        try {
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
        } catch (decodeError) {
          console.error("Error decoding profile image:", decodeError);
          setProfileImage(dummyUserImg); // Fallback to dummy image on decode error
        }
      } else {
        setProfileImage(dummyUserImg); // Fallback to dummy image if no profile image
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setProfileImage(dummyUserImg);
    }
  };

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

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
      const updatedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(updatedTime);
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
          // console.log(name);
          // const now = new Date();
          // const day = now.getDate().toString().padStart(2, "0");
          // const month = (now.getMonth() + 1).toString().padStart(2, "0");
          // const year = now.getFullYear();
          // const formData = {
          //   employeeId,
          //   jobRole: userType,
          //   employeeName: name,
          //   date: `${year}-${month}-${day}`,
          //   loginTime: now.toLocaleTimeString("en-IN"),
          //   lateMark,
          //   leaveType,
          //   paidLeave,
          //   unpaidLeave,
          //   dailyTarget: data.pending + data.archived,
          //   dailyArchived: data.archived,
          //   dailyPending: data.pending,
          //   remoteWork,
          // };
          // localStorage.setItem(
          //   `dailyWorkData_${employeeId}`,
          //   JSON.stringify({ archived: data.archived, pending: data.pending })
          // );

          // const response = await axios.post(
          //   `${API_BASE_URL}/save-daily-work/${employeeId}/${userType}`,
          //   formData
          // );

          // console.log(
          //   "Data going to API (formData):",
          //   JSON.stringify(formData, null, 2)
          // );

          if (response.data) {
            fetchCurrentEmployerWorkId();
          }
          console.log("Login details saved successfully -- save-daily-work .");
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
      // const response = await axios.get(
      //   `${API_BASE_URL}/fetch-work-id/${employeeId}/${userType}`
      // );
      // console.log(response);
      // setFetchWorkId(response.data);
      // console.log(response.data + "----->");
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
      totalWorkTime -= totalBreakDuration;
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
  const [startResumeNewTimer, setStartResumeNewTimer] = useState(false);
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

    setStartResumeNewTimer(true);
  };

  //Name:-Akash Pawar Component:-DailyWork Subcategory:-handleLogoutLocal(changed) Start LineNo:-530 Date:-01/07
  useEffect(() => {
    logoutTimestamp != null ? handleLogoutLocal() : null;
    console.log("Logout clicked 04 In dailyWork");
  }, [logoutTimestamp]);

  const handleLogoutLocal = async () => {
    console.log("Logout clicked 05 in Daily Work handleLogoutLocal");
    try {
      // console.log(" Fetched Work Id :- " + fetchWorkId);
      // const breaksData = localStorage.getItem(`breaks_${employeeId}`);
      // const breaks = breaksData ? JSON.parse(breaksData) : [];
      // const totalHoursWork = calculateTotalHoursWork(
      //   JSON.parse(localStorage.getItem(`loginTimeSaved_${employeeId}`)),
      //   logoutTimestamp,
      //   breaks
      // );
      // const now = new Date();
      // const day = now.getDate().toString().padStart(2, "0");
      // const month = (now.getMonth() + 1).toString().padStart(2, "0");
      // const year = now.getFullYear();
      // let present = "absent";
      // if (data.pending >= 5 && data.archived >= 5) {
      //   present = "present";
      // }
      // let checkHalfDay = "No";
      // console.log(typeof totalHoursWork);
      // const formData = {
      //   employeeId,
      //   date: `${year}-${month}-${day}`,
      //   dailyTarget: data.pending + data.archived,
      //   dailyArchived: data.archived,
      //   dailyPending: data.pending,
      //   logoutTime: logoutTimestamp,
      //   totalHoursWork:totalHoursWork,
      //   dailyHours: breaks,
      //   dayPresentStatus: present,
      //   lateMark,
      //   leaveType,
      //   paidLeave,
      //   unpaidLeave,
      //   dayPresentPaid,
      //   dayPresentUnpaid,
      // };
      // await axios.put(
      //   `${API_BASE_URL}/update-daily-work/${fetchWorkId} `,
      //   formData
      // );
      // console.log(" ----------------  update-daily-work");
      // localStorage.removeItem(`loginTimeSaved_${employeeId}`);
      // localStorage.removeItem(`loginDetailsSaved_${employeeId}`);
      // localStorage.removeItem(`stopwatchTime_${employeeId}`);
      // localStorage.removeItem(`dailyWorkData_${employeeId}`);
      // localStorage.removeItem(`breaks_${employeeId}`);
      // localStorage.removeItem(`user_${userType}${employeeId}`);
      // localStorage.removeItem("paymentMade");
      // setTime({ hours: 0, minutes: 0, seconds: 0 });
      // setData({ archived: 0, pending: 10 });
      // console.log("Logged out successfully. in daily work last");
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotificationBox = () => {
    console.log("clicked here..... 0111");
    setIsOpen((prev) => !prev);
  };

  const handleClearNotifications = () => {
    localStorage.removeItem(`${userType}${employeeId}messages`);
    setMessages([]);
  };
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

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
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });

        openNotification(message);
      });
      socket.on("receive_updated_candidate", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_interview_schedule_data", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_add_job_description_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_update_job_description_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_delete_job_description_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_share_excel_data_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });
      socket.on("receive_share_resume_data_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_user_login_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_user_logout_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_save_applicant_data", (message) => {
        console.log(message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_add_recruiter_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_add_teamLeader_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_add_manager_event", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("receive_share_profile", (message) => {
        console.log(message);

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log(updatedMessages);
          localStorage.setItem(
            `${userType}${employeeId}messages`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
        openNotification(message);
      });

      socket.on("connect_error", () => {
        console.log;
        ("Connection failed. Ensure your details are correct.");
      });
      return () => {
        socket.disconnect();
      };
    }
    console.log(messages);
  }, [socket, employeeId]);

  const getMessageDescription = (message) => {
    console.log(message);

    switch (message.eventName) {
      case "add_candidate":
        return {
          title: message.candidate.recruiterName,
          desc: `Added A Candidate ${message.candidate.candidateName}`,
        };

      case "update_candidate":
        return {
          title: message.candidate.recruiterName,
          desc: `Updated Candidate Data ${message.candidate.candidateName}`,
        };

      case "interview_schedule":
        const employeeCheck =
          `${message.candidate.employee.employeeId}` === `${employeeId}`;
        const interviewResponse = message.candidate.interviewResponse;
        const round = message.candidate.interviewRound;
        const jobId = message.candidate.requirementId;

        console.log("running this");

        console.log(" employeeCheck ---" + employeeCheck);
        console.log(" interviewResponse --- " + interviewResponse);
        console.log("Round --- " + round);
        console.log("Job Id " + jobId);

        if (employeeCheck) {
          console.log("running first");
          return {
            title: "Interview Notification",
            desc:
              interviewResponse === "Selected"
                ? `Your candidate ${message.candidate.candidateName} has been Selected after the ${round} for Job ID ${jobId}.`
                : interviewResponse === "Hold"
                ? `Your candidate ${message.candidate.candidateName} is on Hold after the ${round} for Job ID ${jobId}.`
                : interviewResponse === "Rejected"
                ? `Your candidate ${message.candidate.candidateName} has been Rejected after the ${round} for Job ID ${jobId}.`
                : `Your candidate ${message.candidate.candidateName} has been ${interviewResponse} for Job ID ${jobId}.`,
          };
        } else {
          return {
            title: "Interview Update",
            desc:
              interviewResponse === "Selected"
                ? `Candidate ${message.candidate.candidateName} has been Selected after the ${round} for Job ID ${jobId}.`
                : interviewResponse === "Hold"
                ? `Candidate ${message.candidate.candidateName} is on Hold after the ${round} for Job ID ${jobId}.`
                : interviewResponse === "Rejected"
                ? `Candidate ${message.candidate.candidateName} has been Rejected after the ${round} for Job ID ${jobId}.`
                : `Candidate ${message.candidate.candidateName} has been ${interviewResponse} for Job ID ${jobId}.`,
          };
        }

      case "add_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `Added Job Description for ${message.candidate.companyName} - ${message.candidate.designation}`,
        };

      case "update_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `Updated Job Description for ${message.candidate.companyName} - ${message.candidate.designation}`,
        };

      case "delete_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `Deleted Job Description for ${message.candidate.companyName}`,
        };

      case "share_excel_data":
        return {
          title: message.candidate.employeeName,
          desc: `Shared Excel Data`,
        };

      case "share_resume_data":
        return {
          title: message.candidate.employeeName,
          desc: `Shared Resume Data`,
        };

      case "user_login_event":
        return {
          title: message.candidate.employeeName,
          desc: `Logged In On ${message.candidate.loginTime}`,
        };

      case "user_logout_event":
        return {
          title: message.candidate.employeeName,
          desc: `Logged Out On ${message.candidate.logoutDateAndTime}`,
        };

      case "save_applicant_data":
        return {
          title: message.candidate.candidateName,
          desc: `Added In Calling Tracker, From ${message.candidate.sourceName} On ${message.candidate.date}`,
        };

      case "add_recruiter_event":
        return {
          title: message.candidate.employeeName,
          desc: `New ${message.candidate.jobRole} Joined`,
          dateOfJoining,
        };

      case "add_teamLeader_event":
        return {
          title: message.candidate.teamLeaderName,
          desc: `New ${message.candidate.jobLevel} Joined`,
        };

      case "add_manager_event":
        return {
          title: message.candidate.managerName,
          desc: `New ${message.candidate.jobRole} Joined `,
        };

      // Add more cases as needed for other eventName types

      default:
        return {
          title: "Unknown Event",
          desc: `No specific description available for event: ${message.eventName}`,
        };
    }
  };

  // line 998 to 1143 added by sahil karnekar on date 14-01-2025
  const extractTimeOnly = (timeString) => {
    const timeMatch = timeString.match(/Time: (\d{1,2}:\d{2} [APM]+)/);
    const time = timeMatch ? timeMatch[1] : null;
    return time;
  };

  const getTitleDescription = (message) => {
    switch (message.eventName) {
      case "add_candidate":
        return {
          title: message.candidate.recruiterName,
          desc: `Added A Candidate ${message.candidate.candidateName} On ${message.candidate.candidateAddedTime}`,
          time: `${message.candidate.candidateAddedTime}`,
        };

      case "update_candidate":
        return {
          title: message.candidate.recruiterName,
          desc: `Updated Candidate Data ${message.candidate.candidateName} On ${message.candidate.candidateAddedTime}`,
          time: `${message.candidate.candidateAddedTime}`,
        };

      case "interview_schedule":
        const employeeCheck =
          `${message.candidate.employee.employeeId}` === `${employeeId}`;
        const interviewResponse = message.candidate.interviewResponse;
        const round = message.candidate.interviewRound;
        const jobId = message.candidate.requirementId;

        if (employeeCheck) {
          return {
            title: "Interview Notification",
            desc:
              interviewResponse === "Selected"
                ? `Your candidate ${message.candidate.candidateName} has been Selected after the ${round} for Job ID ${jobId} Further details will be shared soon.`
                : interviewResponse === "Hold"
                ? `Your candidate ${message.candidate.candidateName} is on Hold after the ${round} for Job ID ${jobId} The next steps will be communicated soon.`
                : interviewResponse === "Rejected"
                ? `Your candidate ${message.candidate.candidateName} has been Rejected after the ${round} for Job ID ${jobId} Please review and plan accordingly.`
                : `Your candidate ${message.candidate.candidateName} has been ${interviewResponse} for Job ID ${jobId} on ${message.candidate.nextInterviewDate} at ${message.candidate.nextInterviewTiming}.`,
            // chaange this
            time: `${message.candidate.commentForTl}`,
          };
        } else {
          return {
            title: "Interview Update",
            desc:
              interviewResponse === "Selected"
                ? `Congratulations! Candidate ${message.candidate.candidateName} has been Selected after the ${round} for Job ID ${jobId} Further details will be shared soon.`
                : interviewResponse === "Hold"
                ? `Candidate ${message.candidate.candidateName} is on Hold after the ${round} for Job ID ${jobId} The next steps will be communicated soon.`
                : interviewResponse === "Rejected"
                ? `Candidate ${message.candidate.candidateName} has been Rejected after the ${round} for Job ID ${jobId} Please review and plan accordingly.`
                : `Candidate ${message.candidate.candidateName} has been ${interviewResponse} for Job ID ${jobId} on ${message.candidate.nextInterviewDate} at ${message.candidate.nextInterviewTiming}.`,
            // we will change this letter
            time: `${message.candidate.commentForTl}`,
          };
        }

      case "add_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `New Job Dscription Company Name : ${message.candidate.companyName} - ${message.candidate.designation}  Added On ${message.candidate.jdAddedDate}`,
          time: `${message.candidate.jdAddedDate}`,
        };

      case "update_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `Updated Job Description for ${message.candidate.companyName} - ${message.candidate.designation} On ${message.candidate.statusUpdateDate}`,
          time: `${message.candidate.statusUpdateDate}`,
        };

      case "delete_job_description":
        return {
          title: message.candidate.employeeName,
          desc: `Deleted Job Description for ${message.candidate.companyName} On ${message.candidate.jdAddedDate}`,
          time: `${message.candidate.jdAddedDate}`,
        };

      case "share_excel_data":
        return {
          title: message.candidate.employeeName,
          desc: `Shared Excel Data To You On ${message.candidate.sharedDate} Please Check Database Section`,
          time: `${message.candidate.sharedDate}`,
        };

      case "share_resume_data":
        return {
          title: message.candidate.employeeName,
          desc: `Shared Resume Data To You On ${message.candidate.sharedDate} Please Check Database Section`,
          time: `${message.candidate.sharedDate}`,
        };

      case "user_login_event":
        return {
          title: message.candidate.employeeName,
          desc: `Logged In On ${message.candidate.loginTime}`,
          time: `${message.candidate.loginTime}`,
        };

      case "user_logout_event":
        return {
          title: message.candidate.employeeName,
          desc: `Logged Out On ${message.candidate.logoutDateAndTime}`,
          time: `${message.candidate.logoutDateAndTime}`,
        };

      case "save_applicant_data":
        return {
          title: message.candidate.candidateName,
          desc: `Added In Calling Tracker, From ${message.candidate.sourceName} On ${message.candidate.date}`,
          time: `${message.candidate.date}`,
        };

      case "add_recruiter_event":
        return {
          title: message.candidate.employeeName,
          desc: `New ${message.candidate.jobRole} Joined On ${message.candidate.dateOfJoining}`,
          time: `${message.candidate.dateOfJoining}`,
        };

      case "add_teamLeader_event":
        return {
          title: message.candidate.teamLeaderName,
          desc: `New ${message.candidate.jobLevel} Joined On ${message.candidate.tlDateOfJoining}`,
          time: `${message.candidate.tlDateOfJoining}`,
        };

      case "add_manager_event":
        return {
          title: message.candidate.managerName,
          desc: `New ${message.candidate.jobRole} Joined On ${message.candidate.dateOfJoiningM}`,
          time: `${message.candidate.dateOfJoiningM}`,
        };

      // Add more cases as needed for other eventName types

      default:
        return {
          title: "Unknown Event",
          desc: `No specific description available for event: ${message.eventName}`,
        };
    }
  };

  const openNotification = (message) => {
    const description = getMessageDescription(message);
    messagesContext.info({
      message: description.title,
      description: description.desc,
      duration: 0,
      placement: "bottomRight",
    });
  };

  const notificationContainers = document.querySelectorAll(
    ".ant-notification-notice-wrapper"
  );
  if (notificationContainers.length > 0) {
    notificationContainers.forEach((container) => {
      container.style.right = "50px"; // Apply external margin to each notification container
    });
  }

  const [allImages, setAllImages] = useState([]); // Initialize as an object

  const getUserImageFromApi = async (employeeId, userType) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${employeeId}/${userType}`
      );
      const byteCharacters = atob(response.data.profileImage);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Error fetching user image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      const images = await Promise.all(
        messages.map(async (message) => {
          return await getUserImageFromApi(
            message.candidate.employeeId,
            message.candidate.userType
          );
        })
      );
      setAllImages(images); // Set the array of image URLs
    };

    fetchAllImages();
  }, [messages]);

  const [newWordId, setNewWorkId] = useState(null);
  const [loginHoursTimerStart, setLoginHoursTimerStart] = useState("00:00:00");
  const [dailyWorkDataNew, setDailyWorkDataNew] = useState(null); // State to store getData
  const [displayStopWatch, setDisplayStopWatch] = useState(false);

  const fetchNewWorkId = async () => {
    try {
      const currentDateNew = getFormattedDateISOYMDformat();
      const resp = await axios.get(
        `${API_BASE_URL}/fetch-work-id/${employeeId}/${userType}/${currentDateNew}`
      );
      const yesNo = resp.data;

      if (typeof yesNo === "string") {
        console.log("running post");

        try {
          const respPost = await axios.post(
            `${API_BASE_URL}/save-daily-work/${employeeId}/${userType}`,
            {
              // callingCount:20,
              dailyArchived: 0,
              dailyPending: 20,
              dailyTarget: 20,
              date: `${currentDateNew}`,
              // dayPresentStatus:"Present",
              employeeName: `${loginEmployeeName}`,
              // halfDay:"No",
              // holidayLeave:"NO",
              jobRole: `${userType}`,
              lateMark: `${getLateMark()}`,
              // leaveType:"Unpaid",
              loginTime: `${getCurrentLogTime()}`,
              // logoutTime:"00:00:00 am",
              // remoteWork:"WFO",
              totalHoursWork: "00:00:00",
            }
          );
          console.log(respPost);
          setLoginHoursTimerStart("00:00:00");
          setDisplayStopWatch(true);
        } catch (error1) {}
      } else if (typeof yesNo === "number") {
        console.log("running put");
        try {
          const getData = await getDailyworkData(
            employeeId,
            userType,
            currentDateNew
          );
          console.log(getData);
          setDailyWorkDataNew(getData);

          const loginHoursTimerString = getData.totalHoursWork;

          const getDataForUpdate = {
            totalHoursWork: loginHoursTimerString,
            attendanceRole: {
              ...(userType === "Recruiters" && { employee: { employeeId } }),
              ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
              ...(userType === "Manager" && { manager: { employeeId } }),
            },
          };
          console.log(getDataForUpdate);
          try {
            const putData = await putDailyworkData(
              employeeId,
              userType,
              currentDateNew,
              getDataForUpdate
            );
            console.log(putData);
          } catch (errorPut) {}
        } catch (errorget) {}
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewWorkId();
  }, []);

  useEffect(() => {
    if (dailyWorkDataNew && dailyWorkDataNew.totalHoursWork) {
      console.log(
        "Updating loginHoursTimerStart:",
        dailyWorkDataNew.totalHoursWork
      );
      setLoginHoursTimerStart(dailyWorkDataNew.totalHoursWork);
      setDisplayStopWatch(true);
    }
  }, [dailyWorkDataNew]);

  const [breakStartTime, setBreakStartTime] = useState("");
  const handleStopClick = async (value) => {
    if (value) {
      try {
        setBreakStartTime(getCurrentTimeForUpdateData());
        const getDataForUpdate = {
          totalHoursWork: value,
          attendanceRole: {
            ...(userType === "Recruiters" && { employee: { employeeId } }),
            ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
            ...(userType === "Manager" && { manager: { employeeId } }),
          },
        };
        console.log(getDataForUpdate);

        const stopPutReq = await putDailyworkData(
          employeeId,
          userType,
          currentDateNewGlobal,
          getDataForUpdate
        );
        console.log(stopPutReq);
        setShowPauseModal(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleStartClick = async (value) => {
    if (value === true) {
      const breakEndTime = getCurrentTimeForUpdateData();
      try {
        const getDataForUpdate = {
          attendanceRole: {
            ...(userType === "Recruiters" && { employee: { employeeId } }),
            ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
            ...(userType === "Manager" && { manager: { employeeId } }),
          },
          dailyHours: [
            {
              breakStartTime,
              breakEndTime,
            },
          ],
        };
        console.log(getDataForUpdate);

        const startPutReq = await putDailyworkData(
          employeeId,
          userType,
          currentDateNewGlobal,
          getDataForUpdate
        );
        console.log(startPutReq);
      } catch (error) {}
    }
  };
  const fetchDailyworkGetPendingAchivedData = async () => {
    try {
      const getData = await getDailyworkData(
        employeeId,
        userType,
        currentDateNewGlobal
      );

      if (!getData || typeof getData !== "object") {
        console.error(
          "fetchDailyworkGetPendingAchivedData: No valid data received",
          getData
        );
        return;
      }

      setDailyWorkDataNew((prev) => ({
        ...prev,
        dailyArchived: getData.dailyArchived ?? prev?.dailyArchived ?? 0, // Default to 0 if undefined
        dailyPending: getData.dailyPending ?? prev?.dailyPending ?? 0,
        dailyTarget: getData.dailyTarget ?? prev?.dailyTarget ?? 10, // Default target value
      }));
    } catch (error) {
      console.error("Error fetching daily work data:", error);
    }
  };

  useEffect(() => {
    fetchDailyworkGetPendingAchivedData();
  }, [trigger, triggerFetch]); // Runs when 'trigger' changes
  return (
    <div className="daily-timeanddate">
      <a href="#">
        <div className="head" onClick={profilePageLink}>
          <div className="user-img">
            <img src={profileImage || dummyUserImg} alt="Profile" />
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
            {contextHolder}
            <div className="daily-t-btn">
              <button className="daily-tr-btn" style={{ whiteSpace: "nowrap" }} id="dailyTarget">
                Target:{" "}
                {dailyWorkDataNew?.dailyTarget !== null &&
                dailyWorkDataNew?.dailyTarget !== undefined
                  ? dailyWorkDataNew.dailyTarget
                  : 20}
              </button>
              <button
                className="daily-tr-btn"
                 id="dailyAchieved"
                style={{
                  color: data.archived <= 3 ? "red" : "green",
                }}
              >
                Achieved :{" "}
                {dailyWorkDataNew?.dailyArchived !== null &&
                dailyWorkDataNew?.dailyArchived !== undefined
                  ? dailyWorkDataNew.dailyArchived
                  : 0}
              </button>
              <button
                className="daily-tr-btn"
                id="dailyPending"
                style={{
                  color: data.pending < 7 ? "green" : "red",
                }}
              >
                Pending :{" "}
                {dailyWorkDataNew?.dailyPending !== null &&
                dailyWorkDataNew?.dailyPending !== undefined
                  ? dailyWorkDataNew.dailyPending
                  : 20}
              </button>
            </div>
            {/* <button className="loging-hr">
              <h6 hidden>Time: {currentTime}</h6>
              <h6 hidden>Date: {currentDate}</h6>
              Login Hours : {time.hours.toString().padStart(2, "0")}:
              {time.minutes.toString().padStart(2, "0")}:
              {time.seconds.toString().padStart(2, "0")}
            </button> */}
            {displayStopWatch && (
              <StopWatch
                startTimer={loginHoursTimerStart}
                onStopClick={handleStopClick}
                onStartClick={handleStartClick}
                onResumeClick={startResumeNewTimer}
              />
            )}

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
                value={remoteWork || "work from Office"}
                onChange={(e) => setRemoteWork(e.target.value)}
              >
                <option>Select</option>
                <option value="Work from Office">WFO</option>
                <option value="Work from Home">WFH</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* <button
              className={running ? "timer-break-btn" : "timer-break-btn"}
              onClick={running ? handlePause : handleResume}
              style={{ height: "30px" }}
            >
              {running ? "Pause" : "Resume"}
            </button> */}
            <div style={{ display: "flex" }}>
              <div
                style={{ marginRight: "10px" }}
                onClick={toggleNotificationBox}
              >
                <Badge
                  color="var(--notification-badge-background)"
                  count={messages.length}
                >
                  <Avatar shape="square" icon={<BellOutlined />} />
                </Badge>
              </div>
            </div>
            <div
              className={`notificationMainCont1 ${isOpen ? "open" : "closed"}`}
            >
              <div className="mainNotDiv">
                <div className="motificationSubCont1">
                  {messages.length > 0 ? (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={[...messages].reverse()}
                        renderItem={(message, index) => {
                          const reversedIndex = messages.length - 1 - index;
                          return (
                            <Badge.Ribbon
                              text={
                                getTitleDescription(message).time
                                  ? extractTimeOnly(
                                      getTitleDescription(message).time
                                    )
                                  : ""
                              }
                              style={{
                                top: "auto", // Remove the default top position
                                bottom: 4, // Position at the bottom
                              }}
                              placement="end" // Optional: Keeps ribbon at the starting edge
                              color="var(--notification-ribben-color)"
                            >
                              <Card
                                style={{
                                  marginBottom: "10px",
                                  // borderColor:"var(--primary-border)"
                                  borderColor: "#cccccc",
                                }}
                              >
                                <Meta
                                  avatar={
                                    <Avatar
                                      src={
                                        allImages[reversedIndex]
                                          ? allImages[reversedIndex]
                                          : `https://api.dicebear.com/7.x/miniavs/svg?seed=${reversedIndex}`
                                      }
                                      size="large"
                                    />
                                  }
                                  title={getTitleDescription(message).title}
                                  description={
                                    getTitleDescription(message).desc
                                  }
                                />
                              </Card>
                            </Badge.Ribbon>
                          );
                        }}
                      />
                    </>
                  ) : (
                    <p>No Notifications</p>
                  )}
                </div>
              </div>
              <div className="buttonsDivForNotifications">
                <CloseOutlined
                  style={{
                    color: "red",
                  }}
                  onClick={toggleNotificationBox}
                />
                <button
                  className="cleaarButtonOfNotifications daily-tr-btn"
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
                  Break Time! ⏳
                </Modal.Title>
              </Modal.Header>
              <div>
                <img
                  src="https://t4.ftcdn.net/jpg/11/13/64/07/240_F_1113640772_HCjT1oIW0IN4DjKTP6FA33dsWrL1G0g4.jpg"
                  alt="Waiting"
                  className="dw-waiting-img"
                />
              </div>
              <Modal.Footer className="dw-modal-footer">
                <div className="dw-resume-div">
                  <h3>Enjoy your break! The timer is running. 🌿</h3>
                  <button
                    className="profile-resume-button"
                    onClick={handleResume}
                  >
                    <LogOut size={24} color="black" />
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
