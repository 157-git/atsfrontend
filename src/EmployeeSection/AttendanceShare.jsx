import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../EmployeeSection/AttendanceLoginLogout.css";
import dummyImage from "../assets/react.svg";
import newLogoHead from '../assets/rgLogo.png';
import CryptoJS from "crypto-js";
import { API_BASE_URL } from "../api/api.js";

const AttendanceShare = () => {
  // const API_BASE_URL = 'https://rg.157careers.in/api/ats/157industries';
  const [activeRecruiters, setActiveRecruiters] = useState([]);
  const [inactiveRecruiters, setInactiveRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("Recruiter");
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const { employeeId: encryptedId } = useParams();
  const secretKey = "your-secret-key";

  let employeeId = null;
  let userType = null;

  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    employeeId = decrypted.employeeId;
    userType = decrypted.userType;
  } catch (e) {
    console.error("Invalid link or decryption failed", e);
  }

  const getRoleButtons = (userType) => {
    switch (userType) {
      case "SuperUser": return ["Recruiter", "Team Leader", "Manager"];
      case "Manager": return ["Recruiter", "Team Leader"];
      case "TeamLeader": return ["Recruiter"];
      default: return ["Recruiter"];
    }
  };

  const availableRoles = getRoleButtons(userType);

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const mapRoleToApiParam = (role) => {
    switch (role) {
      case "Recruiter": return "Recruiters";
      case "Team Leader": return "TeamLeader";
      case "Manager": return "Manager";
      default: return "Recruiters";
    }
  };

  const fetchInfo = async (role = "Recruiters") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-active-details/${userType}?employeeId=${employeeId}&currentDate=${getCurrentDate()}&user=${role}`
      );
      setActiveRecruiters(response.data.activeRecruiters || []);
      setInactiveRecruiters(response.data.inactiveRecruiters || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setActiveRecruiters([]);
      setInactiveRecruiters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch immediately when page loads or role changes
    fetchInfo(mapRoleToApiParam(selectedRole));

    // set up auto-refresh every 30s
    const interval = setInterval(() => {
      fetchInfo(mapRoleToApiParam(selectedRole));
    }, 30000);

    // cleanup on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [selectedRole, employeeId]);


  const handleImageError = (empId) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [empId]: true,
    }));
  };

  const getImageSrc = (user) => {
    if (user.profileImage && user.profileImage.trim() !== "" && !imageLoadErrors[user.empId]) {
      return `data:image/jpeg;base64,${user.profileImage}`;
    }
    return dummyImage;
  };

  const filteredRecruiters = () => {
    let recruiters = [...activeRecruiters, ...inactiveRecruiters];

    if (filterStatus === "login") {
      recruiters = recruiters.filter((user) => user.loginStatus === "LoggedIn");
    } else if (filterStatus === "logout") {
      recruiters = recruiters.filter((user) => user.loginStatus === "Logout");
    }

    return recruiters.filter(
      (user) =>
        (user.employeeName && user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.loginTime && user.loginTime.toString().includes(searchTerm)) ||
        (user.logoutTime && user.logoutTime.toString().includes(searchTerm)) ||
        (user.lastLogin && user.lastLogin.toString().includes(searchTerm)) ||
        (user.lastLogout && user.lastLogout.toString().includes(searchTerm)) ||
        (user.empId && user.empId.toString().includes(searchTerm))
    );
  };

  return (
    <div className="main-wrapper">
      {/* 🔹 Safe header block with its own styling */}
      <div className="form-heading-December-main-div">
        <div className="logo-text-wrapper">
          <img
            className="classnameforsetwidthforlogpimagen"
            src={newLogoHead || "/assets/rgLogo.png"}
            alt="logo"
          />
        </div>
        <div className="heading-text">
          <p>Recruiter's Gear</p>
          {/* </div>
    <div className="heading-text2"> */}
          <p>Active Team Members</p>
        </div>

        {/* Right side: 3 dots menu */}
        <div className="menu-container">
          <button onClick={toggleMenu} className="menu-dots">
            ⋮
          </button>
          {isOpen && (
            <div className="menu-dropdown">
              <button onClick={() => navigate(`/login/${userType || "user"}`)}>
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="button-container">
        <div className="role-buttons">
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`role-btn ${selectedRole === role ? "active" : ""}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-containerAttendance">
        <div className="card-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : filteredRecruiters().length > 0 ? (
            filteredRecruiters().map((user, index) => (
              <div className="status-card" key={index}>
                <div
                  className="status-indicator"
                  style={{ color: user.loginStatus === "LoggedIn" ? "green" : "red" }}
                >
                  {user.loginStatus === "LoggedIn" ? "Logged In" : "Logged Out"}
                </div>

                <div className="info-section">
                  <img
                    className="status-image"
                    src={getImageSrc(user)}
                    alt={`${user.employeeName}'s profile`}
                    onError={() => handleImageError(user.empId)}
                  />
                  <div className="user-details">
                    <p style={{ color: "black" }}>
                      <strong>Employee Id:</strong> {user.empId}
                    </p>
                    <p style={{ color: "black" }}>
                      <strong>Name:</strong> {user.employeeName}
                    </p>
                  </div>
                </div>

                {user.loginStatus === "LoggedIn" ? (
                  <div className="user-stats" style={{ color: "black" }}>
                    <p className="time-info">
                      <span className="stat-item">
                        <strong>Login:</strong> {user.loginTime || "-"}
                      </span>
                      <span className="stat-item">
                        <strong>Logged Out:</strong> {user.logoutTime || "-"}
                      </span>
                    </p>
                    <p className="target-info">
                      <span className="stat-item"><strong>Target:</strong> {user.dailyTarget}</span>
                      <span className="stat-item"><strong>Achieved:</strong> {user.dailyArchived}</span>
                      <span className="stat-item"><strong>Pending:</strong> {user.dailyPending}</span>
                    </p>
                  </div>
                ) : (
                  <div className="user-stats" style={{ color: "black" }}>
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
    </div>
  );
};

export default AttendanceShare;
