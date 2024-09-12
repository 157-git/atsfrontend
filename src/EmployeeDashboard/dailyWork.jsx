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
// SwapnilRokade_DailyWork_LogoutFunctionalityWorking_31/07

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
    return localStorage.getItem("buttonColor") || "#ffb281";
  });

  const handleColorChange = (color, btnColor) => {
    setBackgroundColor(color);
    setButtonColor(btnColor);
    localStorage.setItem("sidebarBackgroundColor", color);
    localStorage.setItem("buttonColor", btnColor);
  };

  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem("sidebarBackgroundColor") || "#ffe5b5";
  });

  useEffect(() => {
    setButtonColor("#ffb281");
    setBackgroundColor("#ffe5b5");
    localStorage.setItem("buttonColor", "#ffb281");
    localStorage.setItem("sidebarBackgroundColor", "#ffe5b5");
  }, []);

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

    if (
      (data.pending > 0 && successfulDataAdditions) ||
      successfulDataUpdation
    ) {
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

  return (
    <div className="daily-timeanddate">
      <div className="head">
        <div className="user-img">
          <img src={profileImage} alt="Profile" onClick={profilePageLink} />
        </div>
        <div className="user-details">
          <p>
            {employeeData.name} - {userType}
            <br />
            157{employeeId}
          </p>
        </div>
      </div>
      <button
        className="toggle-all-daily-btns"
        onClick={toggleAllDailyBtns}
        style={{ backgroundColor: buttonColor }}
      >
        {!showAllDailyBtns ? "Show" : "Hide"} All Buttons
      </button>

      {userType != "SuperUser" &&
      userType != "Applicant" &&
      userType != "Vendor" ? (
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
                  // backgroundColor: buttonColor,
                }}
              >
                Archived : {data.archived}
              </button>
              <button
                className="daily-tr-btn"
                style={{
                  color: data.pending < 7 ? "green" : "red",
                  // backgroundColor: buttonColor,
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
              <Modal.Header closeButton>
                <Modal.Title className="dw-modal-title">
                  Break Runing...
                </Modal.Title>
              </Modal.Header>
              <div>
                <img src={watingImg} alt="Waiting" className="dw-waiting-img" />
              </div>
              <Modal.Footer className="dw-modal-footer">
                <div className="dw-resume-div">
                  <h3>Timer is paused. Click Resume to continue.</h3>
                  <div className="profile-back-button">
                    <button
                      className="profile-back-button"
                      onClick={handleResume}
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </Modal.Footer>
            </div>
          </Modal>
        </>
      ) : null}
    </div>
  );
}

export default DailyWork;
