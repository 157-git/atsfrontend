import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AttendanceForm.css";

function AttendanceForm({
  setAttendanceData,
  dailyTarget,
  setDailyTarget,
  archiveCondition,
  setArchiveCondition,
  setArchiveConditions,
}) {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const checkInModalRef = useRef(null);

  const [showDailyTargetModal, setShowDailyTargetModal] = useState(false);
  const [showCompanyTimeModal, setShowCompanyTimeModal] = useState(false);
const [modalMode, setModalMode] = useState("companyTime");

  const [userType, setUserType] = useState("");
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(null);

  const [companyCheckIn, setCompanyCheckIn] = useState("");
  const [companyCheckOut, setCompanyCheckOut] = useState("");

  const roleMap = { Recruiter: 1, TeamLeader: 2, Manager: 3, SuperUser: 4 };

  const isUserSelected = selectedUser || selectedTeamLeader || selectedManager;

  useEffect(() => {
    resetHierarchy();
    if (userType === "Manager") {
      axios.get("http://localhost:8080/api/manager").then((res) => setManagers(res.data));
    } else if (userType === "TeamLeader") {
      axios.get("http://localhost:8080/api/teamleader").then((res) => setTeamLeaders(res.data));
    } else if (userType === "Recruiter") {
      axios.get("http://localhost:8080/api/employee").then((res) => setRecruiters(res.data));
    }
  }, [userType]);

  useEffect(() => {
    if (showDailyTargetModal || showCompanyTimeModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showDailyTargetModal, showCompanyTimeModal]);

  const resetHierarchy = () => {
    setSelectedManager(null);
    setSelectedTeamLeader(null);
    setSelectedUser(null);
    setFormData(null);
    setManagers([]);
    setTeamLeaders([]);
    setRecruiters([]);
  };

  const handleSelect = (user, type) => {
    if (type === "Manager") setSelectedManager(user);
    else if (type === "TeamLeader") setSelectedTeamLeader(user);
    else if (type === "Recruiter") setSelectedUser(user);
  };

  const handleOK = () => {
    if (selectedManager && !selectedTeamLeader) {
      setTeamLeaders(selectedManager.teamLeaders || []);
      setManagers([]);
      setSelectedTeamLeader(null);
    } else if (selectedTeamLeader && !selectedUser) {
      setRecruiters(selectedTeamLeader.employees || []);
      setTeamLeaders([]);
      setSelectedUser(null);
    }
  };

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const handleUpdate = async () => {
    let user = selectedUser || selectedTeamLeader || selectedManager;
    if (!user) {
      alert("Please select a user to update.");
      return;
    }

    let id = "";
    let role = "";

    if (selectedUser) {
      id = selectedUser.employeeId;
      role = "Recruiter";
    } else if (selectedTeamLeader) {
      id = selectedTeamLeader.teamLeaderId;
      role = "TeamLeader";
    } else if (selectedManager) {
      id = selectedManager.managerId;
      role = "Manager";
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/daily-work/fetch/${role}/${id}`
      );

      const data = res.data;
      if (!data || data.length === 0) {
        setFormData(null);
        alert("No attendance data found for this user.");
        return;
      }

      const latest = data[data.length - 1];
      setFormData({
        workId: latest.workId || null,
        employeeId: id,
        employeeName: user.employeeName || user.teamLeaderName || user.managerName,
        date: latest.date || "",
        jobRole: role,
        loginTime: formatTimeForInput(latest.loginTime),
        logoutTime: formatTimeForInput(latest.logoutTime),
        halfDay: latest.halfDay === "Yes",
        holidayLeave: latest.holidayLeave === "Yes",
        leaveType: latest.leaveType || "",
        lateMark: latest.lateMark || "No",
        totalHoursWork: latest.totalHoursWork || "",
        dayPresentStatus: latest.dayPresentStatus || "Inactive",
        remoteWork: latest.remoteWork || "",
        callingCount: latest.callingCount || 0,
        dailyArchived: latest.dailyArchived || 0,
        dailyPending: latest.dailyPending || 0,
        attendanceRoleId: latest.attendanceRoleId || null,
        managerId: latest.managerId,
        superUserId: latest.superUserId,
        teamLeaderId: latest.teamLeaderId,
        checkInTime: companyCheckIn,
        checkOutTime: companyCheckOut,
        dailyTarget: dailyTarget || "",
      });
    } catch (err) {
      console.error("Error fetching attendance:", err);
      alert("Failed to fetch attendance data.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedForm = { ...formData, [name]: type === "checkbox" ? checked : value };

    if (name === "checkInTime") setCompanyCheckIn(value);
    if (name === "checkOutTime") setCompanyCheckOut(value);

    if (updatedForm.loginTime && updatedForm.logoutTime) {
      const [loginHours, loginMinutes] = updatedForm.loginTime.split(":").map(Number);
      const [logoutHours, logoutMinutes] = updatedForm.logoutTime.split(":").map(Number);
      let diffMinutes = (logoutHours * 60 + logoutMinutes) - (loginHours * 60 + loginMinutes);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      updatedForm.totalHoursWork = `${hours}h ${minutes}m`;
      updatedForm.dayPresentStatus = "Present";
    } else if (updatedForm.loginTime && !updatedForm.logoutTime) {
      updatedForm.dayPresentStatus = "Active";
    } else {
      updatedForm.dayPresentStatus = "Inactive";
    }

    setFormData(updatedForm);
  };

  const calculateLateMark = (loginTime, checkInTime) => {
    if (!loginTime || !checkInTime) return "No";
    const [loginHours, loginMinutes] = loginTime.split(":").map(Number);
    const [checkHours, checkMinutes] = checkInTime.split(":").map(Number);
    const diffMinutes = (loginHours * 60 + loginMinutes) - (checkHours * 60 + checkMinutes);
    return diffMinutes >= 30 ? "Yes" : "No";
  };

  useEffect(() => {
    if (formData?.loginTime && (formData?.checkInTime || companyCheckIn)) {
      const checkIn = formData.checkInTime || companyCheckIn;
      const lateMark = calculateLateMark(formData.loginTime, checkIn);
      setFormData((prev) => ({ ...prev, lateMark }));
    }
  }, [formData?.loginTime, formData?.checkInTime, companyCheckIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dailyTarget || dailyTarget <= 0) {
      alert("Please set a valid daily target.");
      return;
    }

    try {
      if (!selectedUser && !selectedTeamLeader && !selectedManager) {
        const payload = {
          date: formData?.date || new Date().toISOString().split("T")[0],
          dailyTarget: dailyTarget,
          archivedTarget: archiveCondition || 3,
        };

        await axios.post(
          "http://localhost:8080/api/daily-work/apply-to-all",
          payload
        );

        alert("Daily target + archived target applied to ALL users!");
        navigate("/attendance-sheet");
        return;
      }

      const payload = { ...formData, dailyTarget };
      if (!payload.workId) delete payload.workId;

      const dailyWorkRes = await axios.post(
        `http://localhost:8080/api/daily-work/save-daily-work/${formData.employeeId}/${formData.jobRole}`,
        payload
      );

      const workId = dailyWorkRes.data;
      if (!workId) {
        alert("Error: Failed to save DailyWork");
        return;
      }

      const manageAttendancePayload = {
        checkInTime: formData.checkInTime || formData.loginTime,
        checkOutTime: formData.checkOutTime || formData.logoutTime,
        date: formData.date,
        duration: formData.totalHoursWork,
        latemark: formData.lateMark || "No",
        startDate: formData.holidayStartDate || formData.date,
        endDate: formData.holidayEndDate || formData.date,
        reason: formData.holidayReason || "",
        dailyTarget: dailyTarget,
        archivedTarget: archiveCondition || 3,
      };

      await axios.post(
        `http://localhost:8080/api/manage-attendance/add/${workId}`,
        manageAttendancePayload
      );

      alert("Attendance successfully saved!");
      setAttendanceData(payload);
      navigate("/attendance-sheet");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  const handleCloseModal = () => {
    setShowDailyTargetModal(false);
    setShowCompanyTimeModal(false);
  };

  const handleOverlayClick = (e, type) => {
    if (
      (type === "target" && modalRef.current && !modalRef.current.contains(e.target)) ||
      (type === "checkin" && checkInModalRef.current && !checkInModalRef.current.contains(e.target))
    ) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="form-container">
        <h2 className="main-heading">Attendance Data</h2>

        {/* Buttons */}
        <div className="company-time-section">
<div className="company-time-buttons">
  {!userType && (
    <button type="button" onClick={() => setShowCompanyTimeModal(true)}>
      Set Company Time
    </button>
  )}

  {userType && (
    <button type="button" onClick={() => setShowDailyTargetModal(true)}>
      Set Daily Target
    </button>
  )}
</div>


        </div>

        {/* User Selection */}
        {!formData && (
          <>
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="">Select User Type</option>
              <option value="Manager">Manager</option>
              <option value="TeamLeader">TeamLeader</option>
              <option value="Recruiter">Recruiter</option>
            </select>

            {managers.length > 0 && (
              <div>
                <h3>Select Manager</h3>
                <table>
                  <thead>
                    <tr><th>Select</th><th>ID</th><th>Name</th></tr>
                  </thead>
                  <tbody>
                    {managers.map((m) => (
                      <tr key={m.managerId}>
                        <td>
                          <input type="radio" checked={selectedManager?.managerId === m.managerId} onChange={() => handleSelect(m, "Manager")} />
                        </td>
                        <td>{m.managerId}</td>
                        <td>{m.managerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {teamLeaders.length > 0 && (
              <div>
                <h3>Select TeamLeader</h3>
                <table>
                  <thead>
                    <tr><th>Select</th><th>ID</th><th>Name</th></tr>
                  </thead>
                  <tbody>
                    {teamLeaders.map((tl) => (
                      <tr key={tl.teamLeaderId}>
                        <td>
                          <input type="radio" checked={selectedTeamLeader?.teamLeaderId === tl.teamLeaderId} onChange={() => handleSelect(tl, "TeamLeader")} />
                        </td>
                        <td>{tl.teamLeaderId}</td>
                        <td>{tl.teamLeaderName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {recruiters.length > 0 && (
              <div>
                <h3>Select Recruiter</h3>
                <table>
                  <thead>
                    <tr><th>Select</th><th>ID</th><th>Name</th></tr>
                  </thead>
                  <tbody>
                    {recruiters.map((r) => (
                      <tr key={r.employeeId}>
                        <td>
                          <input type="radio" checked={selectedUser?.employeeId === r.employeeId} onChange={() => handleSelect(r, "Recruiter")} />
                        </td>
                        <td>{r.employeeId}</td>
                        <td>{r.employeeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(selectedManager || selectedTeamLeader || selectedUser) && (
              <>
                <button onClick={handleOK}>OK</button>
                <button onClick={handleUpdate}>Update</button>
              </>
            )}
          </>
        )}

     {/* Attendance Form */}
        {formData && (
          <div className="user-info-container">
            <h3>Attendance Form for {formData.employeeName}</h3>
            <form onSubmit={handleSubmit} className="attendance-form">
              {/* Non-editable section */}
              <div className="non-editable-section">
                <div className="form-row">
                  <label>Employee Name:</label>
                  <input type="text" value={formData.employeeName} readOnly />
                  <label>Work ID:</label>
                  <input type="text" value={formData.workId || ""} readOnly />
                </div>
                <div className="form-row">
                  <label>Date:</label>
                  <input type="date" value={formData.date} readOnly />
                  <label>Job Role:</label>
                  <input type="text" value={formData.jobRole} readOnly />
                </div>
                <div className="form-row">
                  <label>Total Hours Work:</label>
                  <input type="text" value={formData.totalHoursWork} readOnly />
                </div>
              </div>

              {/* Editable section */}
              <div className="form-row">
                <label>Login Time:</label>
                <input type="time" name="loginTime" value={formData.loginTime} readOnly required />
                <label>Logout Time:</label>
                <input type="time" name="logoutTime" value={formData.logoutTime} readOnly />
                <label>LateMark:</label>
                <input type="text" name="lateMark" value={formData.lateMark || "No"} readOnly />
              </div>

              <div className="form-row">
                <label>Half Day:</label>
                <input type="checkbox" name="halfDay" checked={formData.halfDay} onChange={handleChange} />
                <label>Holiday Leave:</label>
                <input type="checkbox" name="holidayLeave" checked={formData.holidayLeave} onChange={handleChange} />
              </div>

              {formData.holidayLeave && (
                <div className="holiday-section">
                  <label>Holiday Type:</label>
                  <select name="holidayType" value={formData.holidayType} onChange={handleChange}>
                    <option value="">Select Holiday Type</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Government">Government Holiday</option>
                  </select>

                  <label>Leave Type:</label>
                  <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>

                  <label>Start Date:</label>
                  <input type="date" name="holidayStartDate" value={formData.holidayStartDate || ""} onChange={handleChange} />
                  <label>End Date:</label>
                  <input type="date" name="holidayEndDate" value={formData.holidayEndDate || ""} onChange={handleChange} />

                  <div className="holiday-reason-group">
                    <label>Reason:</label>
                    <input type="text" name="holidayReason" value={formData.holidayReason} onChange={handleChange} />
                  </div>
                </div>
              )}

              <div className="form-row">
                <label>Remote Work:</label>
                <select name="remoteWork" value={formData.remoteWork} onChange={handleChange}>
                  <option value="">Select Remote Work</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Work From Home">Work From Home</option>
                  <option value="Work From Office">Work From Office</option>
                  <option value="Other">Other</option>
                </select>
                <label>Day Status:</label>
                <input type="text" value={formData.dayPresentStatus} readOnly />
              </div>

              <button type="submit">Save Attendance</button>
            </form>
          </div>
        )}
      

{/* Company Time Modal */}
{showCompanyTimeModal && (
  <div className="modal-overlay-left" onClick={(e) => handleOverlayClick(e, "checkin")}>
    <div className="company-time-modal" ref={checkInModalRef} onClick={(e) => e.stopPropagation()}>
      <h3>Set Company Settings</h3>

      {/* Buttons to toggle sections */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button type="button" onClick={() => setModalMode("companyTime")}>
          Set Company Time
        </button>
        <button type="button" onClick={() => setModalMode("dailyTarget")}>
          Set Daily Target
        </button>
      </div>

      {/* Company Time Section */}
      {modalMode === "companyTime" && (
        <>
          <label>Company Check-in:</label>
          <input
            type="time"
            value={companyCheckIn}
            onChange={(e) => setCompanyCheckIn(e.target.value)}
          />

          <label>Company Check-out:</label>
          <input
            type="time"
            value={companyCheckOut}
            onChange={(e) => setCompanyCheckOut(e.target.value)}
          />

          <button
            onClick={async () => {
              if (!companyCheckIn || !companyCheckOut) {
                alert("Please set check-in and check-out times.");
                return;
              }

              const payload = {
                checkInTime: companyCheckIn,
                checkOutTime: companyCheckOut,
              };

              try {
                await axios.post(
  "http://localhost:8080/api/manage-attendance/apply-to-all",
  payload
);

                alert("Company time updated successfully!");
                setShowCompanyTimeModal(false);
              } catch (err) {
                console.error(err);
                alert("Error applying company time.");
              }
            }}
          >
            Save Company Time
          </button>
        </>
      )}

      {/* Daily Target Section */}
      {modalMode === "dailyTarget" && (
        <>
          <label>Daily Target:</label>
          <input
            type="number"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(e.target.value)}
          />

          <label>Archived Target:</label>
          <input
            type="number"
            value={archiveCondition}
            onChange={(e) => setArchiveCondition(e.target.value)}
          />

          <button
            onClick={async () => {
              if (!dailyTarget) {
                alert("Please enter a daily target");
                return;
              }

              const payload = {
                date: new Date().toISOString().split("T")[0],
                dailyTarget: Number(dailyTarget),
                archivedTarget: Number(archiveCondition) || 3,
              };

              try {
              await axios.post(
  "http://localhost:8080/api/manage-attendance/apply-to-all",
  payload
);

                alert(
                  `Daily Target ${dailyTarget} & Archived Target ${archiveCondition || 3} applied to ALL users!`
                );
                setShowCompanyTimeModal(false);
              } catch (err) {
                console.error(err);
                alert("Error applying daily target.");
              }
            }}
          >
            Save Daily Target
          </button>
        </>
      )}

      <button className="daily-target-close" onClick={handleCloseModal}>
        Close
      </button>
    </div>
  </div>
)}


{showDailyTargetModal && (
  <div className="modal-overlay-right" onClick={(e) => handleOverlayClick(e, "target")}>
    <div className="daily-target-box" ref={modalRef} onClick={(e) => e.stopPropagation()}>
      <h3>Set Daily Target</h3>

      <label>Daily Target:</label>
      <input
        type="number"
        value={dailyTarget}
        onChange={(e) => setDailyTarget(e.target.value)}
      />

      <label>Archived Target:</label>
      <input
        type="number"
        value={archiveCondition}
        onChange={(e) => setArchiveCondition(e.target.value)}
      />

      <button
        onClick={async () => {
          if (!dailyTarget) {
            alert("Please enter a daily target");
            return;
          }

          if (!userType) {
            alert("Please select a user type");
            return;
          }

          const payload = {
            dailyTarget: Number(dailyTarget),
            archivedTarget: Number(archiveCondition) || 3,
          };

          try {
            // CASE: No specific user selected → Apply to role
            if (!selectedUser && !selectedTeamLeader && !selectedManager) {
              await axios.post(
                `http://localhost:8080/api/manage-attendance/apply-to-role/${userType}`,
                payload
              );
              alert(`Daily Target ${dailyTarget} & Archived Target ${archiveCondition || 3} applied to all ${userType}s!`);
            } 
            // CASE: Specific user selected → Apply to that user
            else {
              let selected = selectedUser || selectedTeamLeader || selectedManager;
              const role = selectedUser ? "Recruiter" : selectedTeamLeader ? "TeamLeader" : "Manager";
              const userId = selectedUser?.employeeId || selectedTeamLeader?.teamLeaderId || selectedManager?.managerId;

              // First, fetch dailyWorkId for that user
              const res = await axios.get(
                `http://localhost:8080/api/daily-work/fetch/${role}/${userId}`
              );

              const data = res.data;
              if (!data || data.length === 0) {
                alert("No attendance record found for this user.");
                return;
              }

              const latest = data[data.length - 1];
              const dailyWorkId = latest.workId;

              await axios.post(
                `http://localhost:8080/api/manage-attendance/update-user-target/${dailyWorkId}`,
                payload
              );

              alert(`Daily Target ${dailyTarget} & Archived Target ${archiveCondition || 3} updated for selected ${role}!`);
            }

            setShowDailyTargetModal(false);
          } catch (err) {
            console.error(err);
            alert("Error saving daily target.");
          }
        }}
      >
        Save
      </button>
    </div>
  </div>
)}



      </div>
    </>
  );
}

export default AttendanceForm;
