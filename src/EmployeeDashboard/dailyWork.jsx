import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../EmployeeDashboard/dailyWork.css";
import Profile from "../photos/profileImg.webp";
import logoutImg from "../photos/download.jpeg";
import { Modal, Button } from "react-bootstrap";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import { API_BASE_URL} from "../api/api";
import watingImg from "../photos/fire-relax.gif";

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

      {
        userType != "Applicant" && userType != "Vendor" ? (
          <>
            <div
              className={`all-daily-btns ${!showAllDailyBtns ? "hidden" : ""}`}
            >
              <div className="daily-t-btn">
                <button
                  className="daily-tr-btn"
                  style={{ whiteSpace: "nowrap" }}
                >
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
              <div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{ marginRight: "10px" }}
                        onClick={toggleNotificationBox}
                      >
                        <Badge count={messages.length}>
                          <Avatar shape="square" icon={<BellOutlined />} />
                        </Badge>
                      </div>
                    </div>
                  </div>

              <div
                className={`notificationMainCont1 ${
                  isOpen ? "open" : "closed"
                }`}
              >
                <div className="mainNotDiv">
                <div className="motificationSubCont1">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <>
                        <s></s>{" "}
                        {/* data displays as per requirments */}
                      

{
  message.eventName === "add_candidate" && (
    <p>
    {index + 1} - A Candidate {message.candidate.candidateName} 
<span> Added </span>
         By : {message.candidate.recruiterName} {" "}
        On : {message.candidate.candidateAddedTime}
    </p>
  )
}

{
  message.eventName === "update_candidate" && (
    <p>
    {index + 1} - A Candidate {message.candidate.candidateName} 
<span> Updated </span>
         By : {message.candidate.recruiterName} On : {" "} {message.candidate.candidateAddedTime}
    </p>
  )
}
{
  // condition changed
  message.eventName === "interview_schedule" && (
  `${message.candidate.employee.employeeId}` === `${employeeId}` ? (
    message.candidate.interviewResponse === "Selected" ? (
      <p>
       {index + 1} - Congratulations! Your candidate {message.candidate.candidateName} has been Selected after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. Further details will be shared soon.
      </p>
    ) : message.candidate.interviewResponse === "Hold" ? (
      <p>
       {index + 1} - Your candidate {message.candidate.candidateName} is on Hold after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. The next steps will be communicated soon.
      </p>
    ) : message.candidate.interviewResponse === "Rejected" ? (
      <p>
       {index + 1} - Your candidate {message.candidate.candidateName} has been Rejected after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. Please review and plan accordingly.
      </p>
    ) : !["Rejected", "Hold", "Selected"].includes(message.candidate.interviewResponse) && (
      <p>
       {index + 1} - Your candidate {message.candidate.candidateName} has been {message.candidate.interviewResponse} for Job ID {message.candidate.requirementInfo.requirementId} on {message.candidate.nextInterviewDate} at {message.candidate.nextInterviewTiming}.
      </p>
    )
  ) : (
    message.candidate.interviewResponse === "Selected" ? (
      <p>
         {index + 1} - Congratulations! Candidate {message.candidate.candidateName} has been Selected after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. Further details will be shared soon.
      </p>
    ) : message.candidate.interviewResponse === "Hold" ? (
      <p>
       {index + 1} - Candidate {message.candidate.candidateName} is on Hold after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. The next steps will be communicated soon.
      </p>
    ) : message.candidate.interviewResponse === "Rejected" ? (
      <p>
       {index + 1} - Candidate {message.candidate.candidateName} has been Rejected after the {message.candidate.interviewRound} for Job ID {message.candidate.requirementInfo.requirementId}. Please review and plan accordingly.
      </p>
    ) : !["Rejected", "Hold", "Selected"].includes(message.candidate.interviewResponse) && (
      <p>
       {index + 1} - Candidate {message.candidate.candidateName} has been {message.candidate.interviewResponse} for Job ID {message.candidate.requirementInfo.requirementId} on {message.candidate.nextInterviewDate} at {message.candidate.nextInterviewTiming}.
      </p>
    )
  )
)
}
{
  message.eventName === "add_job_description" && (
    <p>
    {index + 1} - New Job Dscription Company Name : {message.candidate.companyName} {message.candidate.designation} Was
<span> Added </span>
         By : {message.candidate.employeeName} On : {" "} {message.candidate.jdAddedDate}
    </p>
  )
}
{
  message.eventName === "update_job_description" && (
    <p>
    {index + 1} - Company Name : {message.candidate.companyName} {message.candidate.designation} Was
<span> Updated </span>
         By : {message.candidate.employeeName} On : {" "} {message.candidate.statusUpdateDate}
    </p>
  )
}
{
  message.eventName === "delete_job_description" && (
    <p>
    {index + 1} - Company Name : {message.candidate.companyName} JD
<span> Dleted </span>
         By : {message.candidate.employeeName} On : {" "} {message.candidate.jdAddedDate}
    </p>
  )
}
{
  message.eventName === "share_excel_data" && (
    <p>
    {index + 1} -  {message.candidate.employeeName} Shared
<span> Excel Data To You </span>
       On {" "} {message.candidate.sharedDate} Please Check Database Section
    </p>
  )
}
{
  message.eventName === "share_resume_data" && (
    <p>
    {index + 1} -  {message.candidate.employeeName} Shared
<span> Resume Data To You </span>
       On {" "} {message.candidate.sharedDate} Please Check Database Section
    </p>
  )
}
{
  message.eventName === "user_login_event" && (
    <p>
    {index + 1} -  {message.candidate.employeeName} 
<span> Logged In </span>
       On {" "} {message.candidate.loginTime}
    </p>
  )
}
{
  message.eventName === "user_logout_event" && (
    <p>
    {index + 1} -  {message.candidate.employeeName} 
<span> Logged Out </span>
       On {" "} {message.candidate.logoutDateAndTime}
    </p>
  )
}

{
  message.eventName === "save_applicant_data" && (
    <p>
    {index + 1} -  {message.candidate.candidateName} 
<span> Added In Calling Tracker From {message.candidate.sourceName} Please Check Calling Tracker Section</span>
      {" "} On {" "} {message.candidate.date}
    </p>
  )
}
{
  message.eventName === "receive_add_recruiter_event" && (
    <p>
    {index + 1} -  {message.candidate.candidateName} 
<span> Added In Calling Tracker From {message.candidate.sourceName} Please Check Calling Tracker Section</span>
      {" "} On {" "} {message.candidate.date}
    </p>
  )
}
{
  message.eventName === "add_recruiter_event" && (
    <p>
    {index + 1} -  {message.candidate.employeeName} New {message.candidate.jobRole}
<span> Joined </span>
      {" "} On {" "} {message.candidate.dateOfJoining}
    </p>
  )
}
{
  message.eventName === "add_teamLeader_event" && (
    <p>
    {index + 1} -  {message.candidate.teamLeaderName} New {message.candidate.jobLevel}
<span> Joined </span>
      {" "} On {" "} {message.candidate.tlDateOfJoining}
    </p>
  )
}
{
  message.eventName === "add_manager_event" && (
    <p>
    {index + 1} -  {message.candidate.managerName} New {message.candidate.jobRole}
<span> Joined </span>
      {" "} On {" "} {message.candidate.dateOfJoiningM}
    </p>
  )
}
                        <hr />
                        {/* <p>{message.number}</p> */}
                      </>
                    ))
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
                    Break Runing...
                  </Modal.Title>
                </Modal.Header>
                <div>
                  <img
                    src={watingImg}
                    alt="Waiting"
                    className="dw-waiting-img"
                  />
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
        ) : null
      }

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