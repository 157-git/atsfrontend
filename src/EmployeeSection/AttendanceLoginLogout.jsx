// Rajlaxmi Jagadale Create/fetch Data that jsx page code
import { useState, useEffect } from "react"
import "../EmployeeSection/AttendanceLoginLogout.css"
import axios from "axios"
import dummyImage from "../EmployeeSection/dummy.jpg"
import { useParams } from "react-router-dom"
import { API_BASE_URL } from "../api/api"

const AttendanceLoginLogout = () => {
  const [activeRecruiters, setActiveRecruiters] = useState([])
  const [inactiveRecruiters, setInactiveRecruiters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showRoles, setShowRoles] = useState(false)
  const [selectedRole, setSelectedRole] = useState("Recruiter") // Default to Recruiter
  const [imageLoadErrors, setImageLoadErrors] = useState({})

  const { userType} = useParams();
  // const userType = "superuser"
  const employeeId = 430
  // superuser 390, manager 636, teamleader 430

  const getRoleButtons = () => {
    switch (userType) {
      case "superuser":
        return ["Recruiter", "Team Leader", "Manager"]
      case "manager":
        return ["Recruiter", "Team Leader"]
      case "teamleader":
        return ["Recruiter"]
      default:
        return ["Recruiter"]
    }
  }

  const availableRoles = getRoleButtons()

  useEffect(() => {
    if (userType === "teamleader") {
      setSelectedRole("Recruiter")
    }
  }, [userType])

  const fetchInfo = async (role = "Recruiters") => {
    try {
      const url = `${API_BASE_URL}/get-active-details/${userType}?employeeId=${employeeId}&currentDate=2025-03-24&user=${role}`

      const response = await axios.get(url)
      console.log(`API Response for ${role}:`, response.data)

      if (response.data) {
        setActiveRecruiters(response.data.activeRecruiters || [])
        setInactiveRecruiters(response.data.inactiveRecruiters || [])
      } else {
        setActiveRecruiters([])
        setInactiveRecruiters([])
        console.warn("Unexpected API response format:", response.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setActiveRecruiters([])
      setInactiveRecruiters([])
    }
  }

  useEffect(() => {
    fetchInfo(mapRoleToApiParam(selectedRole))
  }, [])

  const mapRoleToApiParam = (role) => {
    switch (role) {
      case "Recruiter":
        return "Recruiters"
      case "Team Leader":
        return "TeamLeader"
      case "Manager":
        return "Manager"
      default:
        return "Recruiters"
    }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setFilterStatus("all")
    fetchInfo(mapRoleToApiParam(role))
  }

  const handleImageError = (empId) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [empId]: true,
    }))
  }

  const getImageSrc = (user) => {
    if (user.profileImage && user.profileImage.trim() !== "" && !imageLoadErrors[user.empId]) {
      return user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : user.profileImage
    }
    return dummyImage
  }

  const filteredRecruiters = () => {
    let recruiters = [...activeRecruiters, ...inactiveRecruiters]

    if (filterStatus === "login") {
      recruiters = recruiters.filter((user) => user.loginStatus === "LoggedIn")
    } else if (filterStatus === "logout") {
      recruiters = recruiters.filter((user) => user.loginStatus === "Logout")
    }

    return recruiters.filter(
      (user) =>
        (user.employeeName && user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.loginTime && user.loginTime.toString().includes(searchTerm)) ||
        (user.logoutTime && user.logoutTime.toString().includes(searchTerm)) ||
        (user.lastLogin && user.lastLogin.toString().includes(searchTerm)) ||
        (user.lastLogout && user.lastLogout.toString().includes(searchTerm)) ||
        (user.empId && user.empId.toString().includes(searchTerm)),
    )
    }

  const displayData = () => {
    return (
      <div className="scroll-containerAttendance">
        <div className="card-wrapper">
          {filteredRecruiters().length > 0 ? (
            filteredRecruiters().map((user, index) => (
              <div className="status-card" key={index}>
                <div className="status-indicator" style={{ color: user.loginStatus === "LoggedIn" ? "green" : "red" }}>
                  {user.loginStatus === "LoggedIn" ? "Login" : "Logout"}
                </div>

                <div className="info-section">
                  <img
                    className="status-image"
                    src={getImageSrc(user) || "/dummy.jpg"}
                    alt={`${user.employeeName}'s profile`}
                    onError={() => handleImageError(user.empId)}
                  />

                  <div className="user-details">
                    <p>
                      <strong>Employee Id:</strong> {user.empId}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.employeeName}
                    </p>
                  </div>
                </div>

                {user.loginStatus === "LoggedIn" ? (
                  <div className="user-stats">
                    <p className="time-info">
                      <span className="stat-item">
                        <strong>Login:</strong> {user.loginTime || "-"}
                      </span>
                      <span className="stat-item">
                        <strong>Logout:</strong> {user.logoutTime || "-"}
                      </span>
                    </p>
                    <p className="target-info">
                      <span className="stat-item">
                        <strong>Target:</strong> {user.dailyTarget}
                      </span>
                      <span className="stat-item">
                        <strong>Achieved:</strong> {user.dailyArchived}
                      </span>
                      <span className="stat-item">
                        <strong>Pending:</strong> {user.dailyPending}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="user-stats">
                    <p className="time-info">
                      <span className="stat-item">
                        <strong>Last Login:</strong> {user.lastLogin || "-"}
                      </span>
                      <span className="stat-item">
                        <strong>Last Logout:</strong> {user.lastLogout || "-"}
                      </span>
                    </p>
                    <p>
                      <strong className="stat-item">Last Login Date:</strong> {user.lastLoginDate || "-"}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data-message">No data found for {selectedRole}.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="main-wrapper">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-inputAttedance"
        />
        <button
          onClick={() => setFilterStatus("login")}
          className={`login-btn ${filterStatus === "login" ? "active" : ""}`}
        >
          LogIn
        </button>
        <button
          onClick={() => setFilterStatus("logout")}
          className={`logout-btnAttendance ${filterStatus === "logout" ? "active" : ""}`}
        >
          LogOut
        </button>
      </div>

      <div className="button-container">
        {/* <div className="user-type-indicator">
          Current User Type: <span className="user-type">{userType}</span>
        </div> */}

        {/* Role selection buttons based on user type */}
        <div className="role-buttons">
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`role-btn ${selectedRole === role ? "active" : ""}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {displayData()}
    </div>
  )
}

export default AttendanceLoginLogout

