import React, { useState, useEffect } from "react";
import "../EmployeeDashboard/sideBar.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Circle from "../LogoImages/circle.png";
import logoutImg from "../photos/download.jpeg";
import { RiTeamFill } from "react-icons/ri";
import axios from "axios";
import { Modal } from "react-bootstrap";
import ColorPicker from "../HomePage/ColorPicker";

// Swapnil_Sidebar_AddingEmployeeDetailsinto_ManagerSection_17/07

function Sidebar({
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
}) {
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Track the active submenu
  const [activeButton, setActiveButton] = useState(null); // Track the active button
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const navigator = useNavigate();
  const { employeeId, userType } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
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

  // const handleLogoutLocal = () => {
  //   const logoutTime = new Date().toLocaleTimeString("en-IN");
  //   onLogout(logoutTime);
  // };

  const temproryLogout = () => {
    localStorage.removeItem(`loginTimeSaved_${employeeId}`);
    localStorage.removeItem(`loginDetailsSaved_${employeeId}`);
    localStorage.removeItem(`stopwatchTime_${employeeId}`);
    localStorage.removeItem(`dailyWorkData_${employeeId}`);
    localStorage.removeItem(`breaks_${employeeId}`);
    localStorage.removeItem("employeeId");
    console.log("Temp Logout Successfully");
    navigate(`/login/${userType}`, { replace: true });
  };

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
    setShowColor(false); // Close the color picker modal when color is applied
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

  //Dhanshree Code
  const handleButtonClick = (buttonKey, callback) => (e) => {
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
    "Jobdiscription",
    "addJobDescription",
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

  return (
    <>
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        {/* Swapnil_SideBar_responsiveAccordingToScreen_161to162_02/07 */}
        <div className="head-sidebar">
          <div className="sidebar-menu-btn" onClick={toggleSidebar}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <div className="nav">
            <div className="sidebar-menu">
              <ul>
                <>
                  {userType === "SuperUser" ? (
                    <li
                      onClick={handleButtonClick(
                        "subscription",
                        toggelSubscriptions
                      )}
                      className={
                        activeButton === "subscription" ? "active" : ""
                      }
                    >
                      <a href="#">
                        <i
                          className="fa-solid fa-user-plus"
                          style={{ color: "gray" }}
                        ></i>
                        <span className="sidebar-text">Subscription</span>
                      </a>
                    </li>
                  ) : null}

                  <>
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
                        <span className="sidebar-text">Find Candidate</span>
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
                              onClick={toggleEmployeeMasterSheet}
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
                <li
                  className={`${
                    activeSubMenu === "Jobdiscription" || isJobDescriptionActive
                      ? "active"
                      : ""
                  }`}
                  onClick={toggleSubMenu("Jobdiscription")}
                >
                  <a href="#">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span className="sidebar-text">Job Description</span>
                    <i className="arrow ph-bold ph-caret-down"></i>
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
                        className={
                          activeButton === "TeamLeader-section" ? "active" : ""
                        }
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
                                Update Response
                              </span>
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
                              "sendCandidate",
                              toggleSendCandidate
                            )}
                            style={{ marginLeft: "10px" }}
                            className={
                              activeButton === "sendCandidate" ? "active" : ""
                            }
                          >
                            <a href="#">
                              <span className="sidebar-text">
                                Mail To Client
                              </span>
                            </a>
                          </li>
                          <li
                            onClick={toggleEmployeeDetails}
                            style={{ marginLeft: "10px" }}
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
                    className={activeButton === "admin-section" ? "active" : ""}
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
                          onClick={handleButtonClick("payRoll", togglePayRoll)}
                          style={{ marginLeft: "10px" }}
                          className={activeButton === "payRoll" ? "active" : ""}
                        >
                          <a href="#">
                            <span className="sidebar-text">Pay Roll</span>
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
                              Update Response
                            </span>
                          </a>
                        </li>
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
                          onClick={handleButtonClick(
                            "assignColumns",
                            toggleAssigncolumns
                          )}
                          style={{ marginLeft: "10px" }}
                          className={
                            activeButton === "assignColumns" ? "active" : ""
                          }
                        >
                          <a href="#">
                            {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                            <span className="sidebar-text">Assign Columns</span>
                          </a>
                        </li>
                      </>
                      <li
                        onClick={toggleEmployeeDetails}
                        style={{ marginLeft: "10px" }}
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">Team Details</span>
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
                          "sendCandidate",
                          toggleSendCandidate
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "sendCandidate" ? "active" : ""
                        }
                      >
                        <a href="#">
                          <span className="sidebar-text">Mail To Client</span>
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

                {userType === "SuperUser" ? (
                  <li
                    onClick={handleButtonClick(
                      "SuperUser",
                      toggleSubMenu("SuperUser")
                    )}
                  >
                    <a href="#">
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
                          <span className="sidebar-text">Mail To Client</span>
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
                        onClick={toggleEmployeeDetails}
                        style={{ marginLeft: "10px" }}
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">Team Details</span>
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
                {/* toggeleProfitChart */}
                {/* ArshadAttar_EmpDashboard_Added_SuperUser_11/07/2024_LineNo_660 */}

                {userType != "Vendor" && userType != "SuperUser" ? (
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
                            Excel Calling Data
                          </span>
                        </a>
                      </li>

                      <li
                        onClick={handleButtonClick(
                          "excelLineup",
                          toggelExcelLineup
                        )}
                        style={{ marginLeft: "10px" }}
                        className={
                          activeButton === "excelLineup" ? "active" : ""
                        }
                      >
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span className="sidebar-text">
                            Excel Lineup Data
                          </span>
                        </a>
                      </li>

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
                    </ul>
                  </li>
                ) : null}
                {userType != "Vendor" && userType != "SuperUser" ? (
                  <li
                    onClick={handleButtonClick("chatroom", toggleChatRoom)}
                    className={activeButton === "chatroom" ? "active" : ""}
                  >
                    <a href="#">
                      {/* <i className="icon ph-bold ph-gear"></i> */}
                      <i className="fa-brands fa-rocketchat"></i>

                      <span className="sidebar-text">Chat Section</span>
                    </a>
                  </li>
                ) : null}

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
                          // toggleReports
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
                      {/* <i className="icon ph-bold ph-chart-bar"></i> */}
                      <i className="fa-brands fa-linkedin"></i>
                      <span className="sidebar-text">Portal</span>
                      <i className="arrow ph-bold ph-caret-down"></i>
                    </a>
                    <ul
                      className={`sub-menu sub-menu1 sub-menu2 ${
                        activeSubMenu === "portal" ? "active" : ""
                      }`}
                    >
                      <li style={{ marginLeft: "10px" }}>
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={openNaukriPlatform}
                          >
                            Naukri
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={openLinkedinPlatform}
                          >
                            LinkedIn
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={openTimesPlatform}
                          >
                            Times Jobs
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="#">
                          {/* <img src={Circle} style={{ width: "10px" }} alt="" /> */}
                          <span
                            className="sidebar-text"
                            onClick={openIndeedPlatform}
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
                      <li style={{ marginLeft: "10px" }}>
                        <a href="">
                          <span
                            className="sidebar-text"
                            onClick={toggeleRightsInstructions}
                          >
                            Rights & Instructions
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="">
                          <span
                            className="sidebar-text"
                            onClick={toggeleCompanyPolicy}
                          >
                            Company Policy
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="">
                          <span
                            className="sidebar-text"
                            onClick={toggeleIssueSolving}
                          >
                            Issues Solving
                          </span>
                        </a>
                      </li>
                      <li style={{ marginLeft: "10px" }}>
                        <a href="">
                          <span
                            className="sidebar-text"
                            onClick={toggelePainArea}
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
                      <li style={{ marginLeft: "10px" }}>
                        <a href="">
                          <span
                            className="sidebar-text"
                            onClick={toggeleInterviewForm}
                          >
                            Interview Questions
                          </span>
                        </a>
                      </li>
                      <li
                        style={{ marginLeft: "10px" }}
                        onClick={toggelCandidateHistory}
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
                  <a href="#">
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
                <ColorPicker onColorApplied={handleColorApplied} />
                {/* {pastelColors.map((color, index) => (
                        <button
                          key={index}
                          style={{
                            backgroundColor: color,
                            border: "none",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                          onClick={() => handleColorClick(color)}
                        />
                      ))} */}
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
                <button onClick={temproryLogout} className="buttoncss">
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
    </>
  );
}

export default Sidebar;
