import React, { useEffect, useState } from "react";
import Sidebar from "../EmployeeDashboard/sideBar";
import CallingList from "../EmployeeSection/selfCallingTracker";
import LineUpList from "../EmployeeSection/LineUpList";
import "./empDashboard.css";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import Help from "../Help/help";
import { Outlet, useLocation, useParams } from "react-router-dom";
import DataComponent from "../EmployeeSection/DataComponent";
import Incentive from "../EmployeeSection/Incentive";
import Attendancesheet from "../EmployeeSection/Attendence_sheet";
import InterviewDates from "../EmployeeSection/interviewDate";
import SelectedCandidate from "../CandidateSection/SelectedCandidate";
import RejectedCandidate from "../CandidateSection/rejectedCandidate";
import HoldCandidate from "../CandidateSection/holdCandidate";
import UpdateCallingTracker from "../EmployeeSection/UpdateSelfCalling";
import CallingExcel from "../Excel/callingExcel";
import ResumeList from "../Excel/resumeList";
import Home from "./JobList";
import DailyWork from "./dailyWork";
import { useNavigate } from "react-router-dom";
import Profile from "../LogoImages/ProfilePic.png";
import EmployeeMasterSheet from "../EmployeeSection/employeeMasterSheet";
import ShortListedCandidates from "../CandidateSection/ShortListedCandidate";
import ShortlistedNavbar from "./shortlistedNavbar";
import AddJobDescription from "../JobDiscription/addJobDescription";
import AddEmployee from "../EmployeeSection/addEmployee";
import NotePad from "../notPad/notePad";
import MainReportDatapage from "../Reports/MainReportDatapage";
import EmployeeProfileData from "../EmployeeProfileData.jsx"
import AddResumes from "../ResumeData/addMultipleResumes";
import ChatRoom from "../ChatRoom/chatRoom";
import Team_Leader from "../AdminSection/Team_Leader";
import ShareLink from "../ResumeData/shareLink";
import UserDataUse from "../Excel/userDataUse";
import CandidateResumeLink from "../ResumeData/candidateResumeLink";
import CallingExcelList from "../Excel/callingExcelData";
import LineupExcelData from "../Excel/lineupExcelData";

import { motion } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import UpdateResponse from "../TeamLeader/UpdateResponse";
import PayRollMain from "../PayRoll/payRollMain"; /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_198-202 */
import SendClientEmail from "../AdminSection/SendClientEmail";
import LineGraph from "../SuperUser/profitLoseChart"; /* ArshadAttar_EmpDashboard_Added_LineGraph_11/07/2024_LineNo_43 */
import InvoiceTable from "./invoice";
import InvoiceReport from "./invoiceReport";
import InvoicePdf from "./invoicePdf";
import AddCompanyDetails from "../AdminSection/AddCompanyDetails"; /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_43*/
import QuestionPaper from "./questionPaper";
import Capex from "../AdminSection/capex"; /*Ajhar_EmpDashboard_AddedAddCapex_15/07_LineNo_47*/
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import SubscriptionPlans from "../Subscription/subscription";
import PaymentForm from "../Subscription/subscriptionPayment";
import Billing from "../EmployeeSection/billing";
import ScheduleInterview from "../TeamLeader/scheduleInterview"; /* neha_scheduleinterview_18/07_lineno_50*/
import IssueSolving from "../AboutUs/issueSolving";
import WorkplacePolicy from "../AboutUs/companyPolicy";
import PainAreaSolving from "../AboutUs/painAreaSolving";
import RightsAndInstructions from "../AboutUs/rightsAndInstructions";
// import TeamDetails from "../TeamDetails/teamDetails";
import InterviewForm from "../Help/InterviewForm";
import InterviewDataTables from "../Help/InterviewTable";
// import TeamDetails from "../TeamDetails/teamDetails";
import CandidateHistoryTracker from "../CandidateSection/candidateHistoryTracker";
import PerformanceImprovement from "../EmployeeSection/performanceImprovement";
import { faL } from "@fortawesome/free-solid-svg-icons";
import AddTeamLeader from "../EmployeeSection/addTeamLeader";
import AddManager from "../EmployeeSection/addManager";
import ApplicantForm from "../Applicant/applicantFrom";
import ShareProfileData from "../TeamLeader/shareProfileData";
import { tr } from "date-fns/locale";
import InterviewForm1 from "../Help/InterviewForm1";
import IssueOfferLetter from "../TeamLeader/IssueOfferLetter";
import AttendanceLoginLogout from "../EmployeeSection/AttendanceLoginLogout";
import CompanyOfferForm from "../EmployeeSection/CompanyOfferForm";
// import { Button, Popover } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import AttendanceLoginLogout from "../EmployeeSection/AttendanceLoginLogout";

const EmpDashboard = ({ userGroup, loginEmployeeName, setLoginEmployeeName}) => {
  const { userType } = useParams();
  const [showInterviewDate, setShowInterviewDate] = useState(
    userType === "SuperUser" ? false : true
  );
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  // const bindDrag = useDrag(({ offset: [x, y] }) => {
  //   const maxX = window.innerWidth - 40; // Prevent overflow on right
  //   const maxY = window.innerHeight - 30; // Prevent overflow on bottom

  //   setPosition({
  //     x: Math.max(0, Math.min(x, maxX)), // Clamp X between 0 and maxX
  //     y: Math.max(0, Math.min(y, maxY)), // Clamp Y between 0 and maxY
  //   });
  // });
  const [addCandidate, setAddCandidate] = useState(false);
  const [candidateIdForUpdate, setCandidateIdForUpdate] = useState(0);
  const [selfCalling, setSelfCalling] = useState(false);
  const [successShare, setSuccessShare] = useState(false); //neha_add_this_state_bcz_came_error_to_console
  const [attendancesheet, setAttendanceSheet] = useState(false);
  const [incentive, setIncentive] = useState(false);
  const [lineUp, setLineUp] = useState(false);
  const [selectCandidate, setSelectedCandidate] = useState(false);
  const [rejectedCandidate, setRejectedCandidate] = useState(false);
  const [holdCandidate, setHoldCandidate] = useState(false);
  const [updateSelfCalling, setUpdateSelfCalling] = useState(false);
  const [showCallingExcel, setShowCallingExcel] = useState(false);
  const [showResumeData, setShowResumeData] = useState(false);
  const [showJobDiscriptions, setShowJobDiscriptions] = useState(false);
  const [showAccessedSentProfile, setShowAccessedSentProfile] = useState(false);
  const [showCallingTrackerForm, setShowCallingTrackerForm] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const [showShortlistedCandidateData, setShortlistedCandidateData] =
    useState(false);
  const [addJobDescription, setAddJobDescription] = useState(false);
  const [showEmployeeMasterSheet, setShowEmployeeMasterSheet] = useState(false);
  const [showShortListedCandidates, setShowShortListedCandidates] =
    useState(false);
  const [showUpdateCallingTracker, setShowUpdateCallingTracker] =
    useState(false);
  const [showShortListedNav, setShowShortListdNav] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showNotePad, setShowNotePad] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showMainReportDatapage, setshowMainReportDatapage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddedResumes, setShowAddedResumes] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [assignColumns, setAssignColumns] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showDataUse, setShowDataUse] = useState(false);
  const [resumeLink, setResumeLink] = useState(false);
  const [showCallingExcelList, setShowCallingExcelList] = useState(false);
  const [showLineupExcelList, setShowLineupExcelList] = useState(false);
  const [showUpdateResponse, setShowUpdateResponse] = useState(false);
  const [officialMail, setOfficialMail] = useState("");
  const [showPayRoll, setShowPayRoll] =
    useState(
      false
    ); /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_198-202 */
  const [showSendClientMail, setshowSendClientMail] = useState(false);
  const [showProfitLoss, setShowProfitLoss] =
    useState(
      false
    ); /* ArshadAttar_EmpDashboard_Added_showProfitLoss_11/07/2024_LineNo_89 */
  const [showInvoice, setShowInvoice] = useState(false);
  const [showInvoiceReport, setShowInvoiceReport] = useState(false);
  const [showInvoicePdf, setShowInvoicePdf] =
    useState(
      false
    ); /*ArbazPathan_EmpDashboard_AddedInvoiceToggeleFunction_11/07/2024_LineNo_87-207 */
  const [showAddCompany, setShowAddCompany] =
    useState(
      false
    ); /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_91*/
  const [showQuestionpaper, setShowQuestionpaper] = useState(false);
  const [showCapex, setShowCapex] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const { employeeId } = useParams();
  const [successCount, setSuccessCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [archived, setArchived] = useState(0);
  const [showscheduleinterview, setscheduleinterview] =
    useState(false); /*neha_scheduleinterview_18/07/24_line_no_104*/
  const [successAddUpdateResponse, setSuccessUpdateResponse] = useState(false);

  //Name:-Akash Pawar Component:-empDashboard Subcategory:-AddedLogoutTimeStamp and successfulDataAdditions Start LineNo:-80 Date:-01/07
  const [successfulDataAdditions, setSuccessfulDataAdditions] = useState(false);
  const [successfulDataUpdation, setSuccessfulDataUpdation] = useState(false);
  const [logoutTimestamp, setLogoutTimestamp] = useState(null);
  const [showSubscription, setShowSubscription] = useState(true);
  const [showBilling, setShowBilling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCandidateHistory, setShowCandidateHistory] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showPerformanceImprovement, setShowPerformanceImprovement] =
    useState(false);
  const [showAddManager, setShowAddManager] = useState(false);
  const [showAddTeamLeader, setShowAddTeamLeader] = useState(false);
  const [callFunction, setCallFunction] = useState(false);
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [showSharedProfile,setShowSharedProfile] = useState(false);
  const [showIssueLetter,setShowIssueLetter] = useState(false);
  const [showCompanyOfferForm,setShowCompanyOfferForm] = useState(false);
  const [showActiveTeamMemebers,setShowActiveTeamMEmbers] = useState(false);


  // Arshad Attar Added this 30-10-2024
  const handleOpenEmployeeProfile = () => {
    setShowProfile(true);
    setIncentive(false);
    setShowPerformanceImprovement(false);
    setAttendanceSheet(false);
  };

  const handleLogoutTime = (timestamp) => {
    console.log("Logout clicked 03 in EmpDashboard");
    setLogoutTimestamp(timestamp);
  };

  const handleSuccessfulDataAdditions = (check) => {
    setSuccessfulDataAdditions(check);
  };

  useEffect(() => {
    setSuccessfulDataAdditions(false);
  }, [successfulDataAdditions]);

  const handleSuccessfulDataUpdation = (check) => {
    console.log("------From Update.....001");
    setSuccessfulDataUpdation(check);
  };

  useEffect(() => {
    // console.log("------From Update.....003");
    setSuccessfulDataUpdation(false);
  }, [successfulDataUpdation]);

  useEffect(() => {
    setSuccessUpdateResponse(false);
  }, [successAddUpdateResponse]);
  //Name:-Akash Pawar Component:-empDashboard Subcategory:-AddedLogoutTimeStamp and successfulDataAdditions End LineNo:-93 Date:-01/07

  const [jobRoles, setJobRoles] = useState("");
  const handleJobRoles = (role) => {
    setJobRoles(role);
  };

  const handleSuccessAdd = (res) => {
    setSuccessUpdateResponse(res);
  };
  //Akash_Pawar_EmpDashboard_senderinformation_09/07_113

  // const [loginEmployeeName, setLoginEmployeeName] = useState("");
  const [clientEmailSender, setClientEmailSender] = useState();
  const [showAllInterviewResponses, setShowAllInterviewResponses] =
    useState(false);
  const handleEmailSenderInformation = (data) => {
    setLoginEmployeeName(data.senderName); //akash_pawar_SelectedCandidate_ShareFunctionality_16/07_151
    setClientEmailSender(data);
  };

  const [showCompanyPolicy, setShowCompanyPolicy] = useState(false);
  const [showIssueSolving, setShowIssueSolving] = useState(false);
  const [showPainArea, setShowPainArea] = useState(false);
  const [showRightsInstruction, setShowRightsInstruction] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  const [id, setId] = useState(0);
  const navigator = useNavigate();

  const gettingCandidateIdForUpdate = (id) => {
    setCandidateIdForUpdate(id);
    setUpdateSelfCalling(true);
    setSelfCalling(false);
    setIncentive(false);
  };

  const togglescheduleinterview = () => {
    resetAllToggles();
    setscheduleinterview(true);
  };
  const toggelAddRecruiter = () => {
    resetAllToggles();
    setShowAddEmployee(true);
    setIncentive(false);
  };

  const toggelDisplayNotPad = () => {
    resetAllToggles();
    setShowNotePad(true);
    setIncentive(false);
  };
  const toggleReports = () => {
    resetAllToggles();
    setShowReports(true);
    setIncentive(false);
  };
  const toggleMainReportDatapage = () => {
    resetAllToggles();
    setshowMainReportDatapage(true);
    setIncentive(false);
  };

  const toggleAddJobDescription = () => {
    resetAllToggles();
    setAddJobDescription(true);
    setIncentive(false);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
    setIncentive(false);
  };

  /*Akash_Pawar_EmpDashboard_toggleShowShortListedCandidateData_23/07_LineNo_213*/
  const toggleShowShortListedCandidateData = () => {
    resetAllToggles();
    setShortlistedCandidateData(true);
    setShowInterviewDate(false);
    setIncentive(false);
  };
  /*Akash_Pawar_EmpDashboard_toggleShowShortListedCandidateData_23/07_LineNo_220*/

  const viewUpdatedPage = () => {
    setShortlistedCandidateData(false);
    setShowUpdateCallingTracker(true);
    setIncentive(false);
  };

  const resetAllToggles = () => {
    setUpdateSelfCalling(false);
    setAddCandidate(false);
    setShowInterviewDate(false);
    setSelectedCandidate(false);
    setHoldCandidate(false);
    setRejectedCandidate(false);
    setShowJobDiscriptions(false);
    setSelfCalling(false);
    setLineUp(false);
    setShowCallingTrackerForm(false);
    setShowHome(false);
    setShowCallingExcel(false);
    setAttendanceSheet(false);
    setShowEmployeeMasterSheet(false);
    setShortlistedCandidateData(false);
    setAddJobDescription(false);
    setShowAddEmployee(false);
    setShowNotePad(false);
    setShowReports(false);
    setshowMainReportDatapage(false);
    setShowProfile(false);
    setShowAddedResumes(false);
    setIncentive(false);
    setAssignColumns(false);
    setShowChatRoom(false);
    setShowShareLink(false);
    setShowDataUse(false);
    setShowUpdateResponse(false);
    setResumeLink(false);
    setShowResumeData(false);
    setShowCallingExcelList(false);
    setShowLineupExcelList(false);
    setshowSendClientMail(false);
    setShowInvoice(false);
    setShowInvoicePdf(false);
    setShowInvoiceReport(
      false
    ); /*ArbazPathan_EmpDashboard_AddedInvoiceToggeleFunction_11/07/2024_LineNo_198-208 */
    setShowPayRoll(
      false
    ); /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_198-202 */
    setshowSendClientMail(false);
    setShowPayRoll(
      false
    ); /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_198-202 */
    setShowAddCompany(
      false
    ); /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_221*/
    setShowProfitLoss(false);
    setShowQuestionpaper(false);
    setShowCapex(false);
    setShowEmployeeDetails(false); /*Swapnil_AddedEmployeeDetails_16/07*/
    setShowSubscription(false); /*Arbaz_AddSubscriptions_19/07*/
    setShowBilling(false);
    setShowPayment(false);
    setscheduleinterview(false); /*neha_addScheduleinterview_18/07_lineno_245*/
    setShowRightsInstruction(false);
    setShowTeamDetails(false);
    setShowCompanyPolicy(false);
    setShowPainArea(false);
    setShowIssueSolving(false);
    setShowCandidateHistory(false);
    setShowInterviewForm(false);
    setShowAllInterviewResponses(false);
    setShowPerformanceImprovement(false);
    setShowAddManager(false);
    setShowAddTeamLeader(false);
    setShowUpdateCallingTracker(false);
    setShowSharedProfile(false);
    setShowIssueLetter(false);
    setShowCompanyOfferForm(false);
    setShowActiveTeamMEmbers(false);
    setShowAccessedSentProfile(false);
  };

  /* ArshadAttar_EmpDashboa_Added_showProfitLoss_11/07/2024_LineNo_221-225 */
  const toggeleProfitChart = () => {
    resetAllToggles();
    setShowProfitLoss(!showProfitLoss);
  };

  /* ArshadAttar_EmpDashboard_AddedPayrollToggeleFunction_10/07/2024_LineNo_198-202 */
  const togglePayRoll = () => {
    resetAllToggles();
    setShowPayRoll(true);
  };

  // Swapnil_AddedEmployeeDetails_16/07
  const toggleEmployeeDetails = () => {
    resetAllToggles();
    setShowEmployeeDetails(true);
  };

  /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_233-235*/
  const toggleAddCompany = () => {
    resetAllToggles();
    setShowAddCompany(true);
  };

  const funForUpdateSelfCalling = () => {
    resetAllToggles();
    setUpdateSelfCalling(true);
  };

  const funForUpdateLineUp = () => {
    resetAllToggles();
    setUpdateSelfCalling(true);
  };

  const toggleUpdateResponse = () => {
    resetAllToggles();
    setShowUpdateResponse(true);
  };
  const toggleEmployeeMasterSheet = () => {
    resetAllToggles();
    setShowEmployeeMasterSheet(true);
  };

  const toggleCallingTrackerForm = () => {
    resetAllToggles();
    setAddCandidate(true);
  };

  /*Akash_Pawar_EmpDashboard_toggleShortListed(show interview candidate)_23/07_LineNo_345*/
  const toggleShortListed = () => {
    resetAllToggles();
    setShortlistedCandidateData(false);
    setShowInterviewDate(true);
    setIncentive(false);
  };
  /*Akash_Pawar_EmpDashboard_toggleShortListed(show interview candidate)_23/07_LineNo_352*/

  const toggleSelectCandidate = () => {
    resetAllToggles();
    setSelectedCandidate(true);
  };

  const toggleHoldCandidate = () => {
    resetAllToggles();
    setHoldCandidate(true);
  };

  const toggleRejectedCandidate = () => {
    resetAllToggles();
    setRejectedCandidate(true);
  };

  const toggleJobDescription = () => {
    resetAllToggles();
    setShowJobDiscriptions(true);
  };

  const toggleSentProfileAccess = () => {
    resetAllToggles();
    setShowAccessedSentProfile(true);
  };

  const toggleSelfCalling = () => {
    resetAllToggles();
    setSelfCalling(true);
    setSuccessShare(true);
  };

  const toggelLineUp = () => {
    resetAllToggles();
    setLineUp(true);
  };

  const toggelResumeData = () => {
    resetAllToggles();
    setShowResumeData(true);
  };

  const toggleAttendance = () => {
    resetAllToggles();
    setShowProfile(false);
    setAttendanceSheet(!attendancesheet);
  };

  const toggleIncentive = () => {
    resetAllToggles();
    setShowProfile(false);
    setIncentive(!incentive);
  };

  const toggleAssigncolumns = () => {
    resetAllToggles();
    setAssignColumns(true);
  };

  const toggleResumeLink = () => {
    resetAllToggles();
    setResumeLink(!resumeLink);
  };

  const toggleShortListedCandidates = () => {
    resetAllToggles();
    setShowShortListedCandidates(!showShortListedCandidates);
  };
  const toggleChatRoom = () => {
    resetAllToggles();
    setShowChatRoom(!showChatRoom);
  };
  const toggleShareLink = () => {
    resetAllToggles();
    setShowShareLink(true);
  };
  const toggleDataUse = () => {
    resetAllToggles();
    setShowDataUse(true);
  };
  const toggleUpdateCallingTracker = () => {
    resetAllToggles();
    setShowUpdateCallingTracker(!showUpdateCallingTracker);
  };

  const handleUpdateComplete = () => {
    setShowUpdateCallingTracker(false);
    setSelfCalling(true);
  };

  const profilePageLink = () => {
    resetAllToggles();
    setShowProfile(!showProfile);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setShowInterviewDate(true);

    // setShortlistedCandidateData(true)
  };

  const toggelAddResumes = () => {
    resetAllToggles();
    setShowAddedResumes(!showAddedResumes);
  };

  const toggleExcelCalling = () => {
    resetAllToggles();
    setShowCallingExcel(true);
  };

  const toggeExcelCallingData = () => {
    resetAllToggles();
    setShowCallingExcelList(true);
  };

  const toggelExcelLineup = () => {
    resetAllToggles();
    setShowLineupExcelList(true);
  };
  const toggleSendCandidate = () => {
    resetAllToggles();
    setshowSendClientMail(true);
  };
  const toggleInvoice = () => {
    resetAllToggles();
    setShowInvoice(true);
  };
  const toggleInvoiceReport = () => {
    resetAllToggles();
    setShowInvoiceReport(true);
  };
  const handleInvoicePdf = () => {
    resetAllToggles();
    setShowInvoicePdf(true);
  };
  const toggleQuestionPaper = () => {
    resetAllToggles();
    setShowQuestionpaper(true);
  };

  const toggleCapex = () => {
    resetAllToggles();
    setShowCapex(true);
  };
  const toggeleRightsInstructions = () => {
    resetAllToggles();
    setShowRightsInstruction(true);
  };
  const toggleTeamDetails = () => {
    resetAllToggles();
    setShowTeamDetails(true);
  };
  const toggeleCompanyPolicy = () => {
    resetAllToggles();
    setShowCompanyPolicy(true);
  };
  const toggeleIssueSolving = () => {
    resetAllToggles();
    setShowIssueSolving(true);
  };
  const toggelePainArea = () => {
    resetAllToggles();
    setShowPainArea(true);
  };
  const toggelSubscriptions = () => {
    resetAllToggles();
    setShowSubscription(true);
  };
  const toggleBilling = () => {
    resetAllToggles();
    setShowBilling(true);
  };
  const togglePayment = () => {
    resetAllToggles();
    setShowPayment(!showPayment);
  };
  const toggeleInterviewForm = () => {
    resetAllToggles();
    setShowInterviewForm(true);
  };
  const toggleAllInterviewResponse = () => {
    resetAllToggles();
    setShowAllInterviewResponses(true);
  };

  const toggelCandidateHistory = () => {
    resetAllToggles();
    setShowCandidateHistory(true);
  };

  const togglePerformanceImprovement = () => {
    resetAllToggles();
    setShowPerformanceImprovement(!showPerformanceImprovement);
  };

  const displayCandidateForm = () => {
    resetAllToggles();
    setShowCallingExcel(false);
    setShowCallingTrackerForm(!showCallingTrackerForm);
  };

  const toggeleAddManager = () => {
    resetAllToggles();
    setShowAddManager(true);
  };

  const toggeleAddTeamLeader = () => {
    resetAllToggles();
    setShowAddTeamLeader(true);
  };

  const toggleSharedProfiles = ()=>{
    resetAllToggles();
    setShowSharedProfile(true)
  };
  const toggleIssueLetter = ()=>{
    resetAllToggles();
    setShowIssueLetter(true);
  };
  const toggleCompanyOfferForm = ()=>{
    resetAllToggles();
    setShowCompanyOfferForm(true)
  }
  const toggleactiveTeamMembers = () =>{
    resetAllToggles();
    setShowActiveTeamMEmbers(true)
  }
  const [triggerForChildTwo, setTriggerForChildTwo] = useState(false);
  const handleSetRefresPropForDailyWork = ()=>{
    setTriggerForChildTwo((prev) => !prev);
  }
  
  const handleSendOfficailMailToQr = (mail)=>{
    setOfficialMail(mail);
  }

  return (
    <div
      className={`grid-container ${
        openSidebarToggle ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{ backgroundColor: "white", minHeight: "100vh" }}
    >
        
      <Sidebar
       loginEmployeeName={loginEmployeeName}
        userGroup={userGroup}
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
        toggleSelfCalling={toggleSelfCalling}
        toggelLineUp={toggelLineUp}
        toggleCallingTrackerForm={toggleCallingTrackerForm}
        toggleShortListed={toggleShortListed}
        toggleSelectCandidate={toggleSelectCandidate}
        toggleRejectedCandidate={toggleRejectedCandidate}
        toggleHoldCandidate={toggleHoldCandidate}
        toggleExcelCalling={toggleExcelCalling}
        toggleResumeData={toggelResumeData}
        toggleJobDescription={toggleJobDescription} 
        toggleSentProfileAccess={toggleSentProfileAccess}
        toggleEmployeeMasterSheet={toggleEmployeeMasterSheet}
        toggleShortListedCandidates={toggleShortListedCandidates}
        toggleAddJobDescription={toggleAddJobDescription}
        toggelAddRecruiter={toggelAddRecruiter}
        toggelDisplayNotPad={toggelDisplayNotPad}
        toggleReports={toggleReports}
        toggleMainReportDatapage={toggleMainReportDatapage}
        toggelResumeData={toggelResumeData}
        toggelAddResumes={toggelAddResumes}
        toggleChatRoom={toggleChatRoom}
        toggleIncentive={toggleIncentive}
        toggleAssigncolumns={toggleAssigncolumns}
        toggleShareLink={toggleShareLink}
        toggleDataUse={toggleDataUse}
        onLogout={handleLogoutTime}
        toggeExcelCallingData={toggeExcelCallingData}
        toggelExcelLineup={toggelExcelLineup}
        toggleUpdateResponse={toggleUpdateResponse}
        jobRoles={jobRoles}
        successAddUpdateResponse={successAddUpdateResponse}
        togglePayRoll={
          togglePayRoll
        } /* ArshadAttar_EmpDashboard_AddedPayrollToggele_10/07/2024_LineNo_402 */
        toggleSendCandidate={toggleSendCandidate}
        toggeleProfitChart={
          toggeleProfitChart
        } /* ArshadAttar_EmpDashboard_Added_toggeleProfitChart_11/07/2024_LineNo_428 */
        /* ArbazPathan_EmpDashboard_AddedInvoice_InvoiceRepsortToggele_11/07/2024_LineNo_426-426 */
        toggleInvoice={toggleInvoice}
        toggleInvoiceReport={toggleInvoiceReport}
        toggleAddCompany={
          toggleAddCompany
        } /*Akash_Pawar_EmpDashboard_AddedAddCompanyToggle_11/07_LineNo_444*/
        toggleQuestionPaper={toggleQuestionPaper}
        toggleCapex={toggleCapex}
        toggleEmployeeDetails={toggleEmployeeDetails}
        toggleShowShortListedCandidateData={
          toggleShowShortListedCandidateData
        } /*Akash_Pawar_EmpDashboard_toggleShowShortListedCandidateData_23/07_LineNo_55*/
        /*ArbazPathan_EmpDashboard_AddedSubscription_&_InoviceReportToggeleFunction_19/07/2024_LineNo_525-526*/
        toggelSubscriptions={toggelSubscriptions}
        toggleBilling={toggleBilling}
        togglescheduleinterview={togglescheduleinterview}
        toggeleRightsInstructions={toggeleRightsInstructions}
        toggleTeamDetails={toggleTeamDetails}
        toggeleCompanyPolicy={toggeleCompanyPolicy}
        toggeleIssueSolving={toggeleIssueSolving}
        toggelePainArea={toggelePainArea}
        toggelCandidateHistory={toggelCandidateHistory}
        toggeleInterviewForm={toggeleInterviewForm}
        toggeleAddTeamLeader={toggeleAddTeamLeader}
        toggeleAddManager={toggeleAddManager}
        toggleSharedProfiles={toggleSharedProfiles}
        toggleIssueLetter={toggleIssueLetter}
        toggleCompanyOfferForm={toggleCompanyOfferForm}
        toggleactiveTeamMembers={toggleactiveTeamMembers}
        sendOfficailMailForQr={officialMail}
      />

      <div className="empDash-main-content">
        <div className="time-and-data">
          <DailyWork
            employeeId={employeeId}
            profilePageLink={profilePageLink}
            successCount={successCount}
            successfulDataAdditions={successfulDataAdditions}
            logoutTimestamp={logoutTimestamp}
            onCurrentEmployeeJobRoleSet={handleJobRoles}
            jobRole={jobRoles}
            emailSenderInformation={handleEmailSenderInformation}
            successfulDataUpdation={successfulDataUpdation}
            loginEmployeeName={loginEmployeeName}
            trigger={triggerForChildTwo}
            sendOfficailMailToQr={handleSendOfficailMailToQr}
          />
        </div>

        <div>
          {showProfile && (
            <EmployeeProfileData
              onClose={handleCloseProfile}
              // onCloseIncentive={handleCloseEmployeeProfile}
              toggleIncentive={toggleIncentive}
              toggleAttendance={toggleAttendance}
              // toggleTeamDetails={toggleTeamDetails}
              toggleTeamDetails={toggleTeamDetails}
              togglePerformanceImprovement={togglePerformanceImprovement}
              fromIncentive={true}
            ></EmployeeProfileData>
          )}
        </div>
        <div style={{ paddingTop: "50px" }}>
          {selfCalling && (
            <CallingList
              updateState={handleUpdateComplete}
              funForGettingCandidateId={gettingCandidateIdForUpdate}
              onSuccessAdd={handleSuccessAdd}
              loginEmployeeName={loginEmployeeName} //akash_pawar_SelectedCandidate_ShareFunctionality_16/07_545
              onsuccessfulDataUpdation={handleSuccessfulDataUpdation}
              fromCallingList={true}
            />
          )}
        </div>

        <div>
          {showShortlistedCandidateData && (
            <ShortListedCandidates
              viewUpdatedPage={viewUpdatedPage}
              loginEmployeeName={loginEmployeeName}
              toggleShortListed={toggleShortListed}
              onsuccessfulDataUpdation={handleSuccessfulDataUpdation}
              /*Akash_Pawar_EmpDashboard_toggleShortListed(show interview candidate)_23/07_LineNo_636*/
            />
          )}
        </div>
        <div>
          {lineUp && (
            <LineUpList
              updateState={funForUpdateLineUp}
              funForGettingCandidateId={gettingCandidateIdForUpdate}
              loginEmployeeName={loginEmployeeName} //akash_pawar_SelectedCandidate_ShareFunctionality_16/07_560
            />
          )}
        </div>

        {/* ArshadAttar_EmpDashboard_AddedPayroll_10/07/2024_OnlyPayRoll_Div_LineNo_450-453 */}
        <div>{showPayRoll && <PayRollMain></PayRollMain>}</div>

        {/* ArshadAttar_EmpDashboard_Added_LineGraph_11/07/2024_OnlyLineGraph_Div_LineNo_488-489 */}
        <div>{showProfitLoss && <LineGraph></LineGraph>}</div>
        <div>{showQuestionpaper && <QuestionPaper />}</div>

        <div>
          {showEmployeeMasterSheet && (
            <EmployeeMasterSheet loginEmployeeName={loginEmployeeName} /> //akash_pawar_SelectedCandidate_ShareFunctionality_16/07_574
          )}
        </div>
        <div>
          {incentive && (
            <Incentive onCloseIncentive={handleOpenEmployeeProfile} />
          )}
        </div>
        <div>
          {attendancesheet && (
            <Attendancesheet
              loginEmployeeName={loginEmployeeName}
              onCloseIncentive={handleOpenEmployeeProfile}
            />
          )}
        </div>

        <div>{showInterviewDate && <InterviewDates loginEmployeeName={loginEmployeeName} />}</div>
        <div>{showAddEmployee && <AddEmployee loginEmployeeName={loginEmployeeName} />}</div>
        <div>
          {selectCandidate && (
            <SelectedCandidate loginEmployeeName={loginEmployeeName} />
          )}
        </div>
        <div>
          {rejectedCandidate && (
            <RejectedCandidate loginEmployeeName={loginEmployeeName} />
          )}
        </div>
        <div>
          {holdCandidate && (
            <HoldCandidate loginEmployeeName={loginEmployeeName} />
          )}
        </div>
        <div className="calling-excel-div">
          {showCallingExcel && (
            <CallingExcel loginEmployeeName={loginEmployeeName} 
            onsuccessfulDataAdditions={handleSuccessfulDataAdditions}
            />
          )}
        </div>

        <div>
          {showCallingExcelList && (
            <CallingExcelList
              loginEmployeeName={loginEmployeeName}
              onsuccessfulDataAdditions={handleSuccessfulDataAdditions}
            ></CallingExcelList>
          )}
        </div>

        <div>
          {showLineupExcelList && (
            <LineupExcelData
              loginEmployeeName={loginEmployeeName}
              onsuccessfulDataAdditions={handleSuccessfulDataAdditions}
            ></LineupExcelData>
          )}
        </div>
        <div>
          {showResumeData && (
            <ResumeList
              onsuccessfulDataAdditions={handleSuccessfulDataAdditions}
              loginEmployeeName={loginEmployeeName}
            ></ResumeList>
          )}
        </div>
        <div>{showNotePad && <NotePad />}</div>
        <div>{showMainReportDatapage && <MainReportDatapage loginEmployeeName={loginEmployeeName} />}</div>
        <div>{showChatRoom && <ChatRoom />}</div>
        <div>
          {showShareLink && <ShareLink toggleResumeLink={toggleResumeLink} loginEmployeeName={loginEmployeeName} sendOfficailMailForQr={officialMail}/>}
        </div>
        <div>
          {showDataUse && <UserDataUse loginEmployeeName={loginEmployeeName} />}
        </div>
        {resumeLink && <CandidateResumeLink />}
        <div>
          {addCandidate && (
            <CallingTrackerForm
              loginEmployeeName={loginEmployeeName}
              onsuccessfulDataAdditions={handleSuccessfulDataAdditions}
              setRefresPropForDailyWork={handleSetRefresPropForDailyWork}
            />
          )}
        </div>

        <div>{addJobDescription && <AddJobDescription  loginEmployeeName={loginEmployeeName}  />}</div>
        <div>{showJobDiscriptions && <Home loginEmployeeName={loginEmployeeName}  />}</div>
        <div>
          {showAccessedSentProfile && (
            <SendClientEmail clientEmailSender={clientEmailSender} />
          )}
        </div>
        <div>{showHome && <Home loginEmployeeName={loginEmployeeName}  />}</div>
        <div>{showAddedResumes && <AddResumes></AddResumes>}</div>
        <div>{showInvoice && <InvoiceTable />}</div>
        <div>
          {showInvoiceReport && (
            <InvoiceReport handleInvoicePdf={handleInvoicePdf} />
          )}
        </div>
        <div>{showInvoicePdf && <InvoicePdf />}</div>
        <div>
          {showUpdateCallingTracker && (
            <UpdateCallingTracker
              loginEmployeeName={loginEmployeeName}
              candidateId={candidateIdForUpdate}
            />
          )}
        </div>
        <div>{assignColumns && <Team_Leader />}</div>
        <div>
          {showSubscription && userType === 'SuperUser' && (
            <SubscriptionPlans togglePayment={togglePayment} />
          )}
        </div>
        <div>{showPayment && <PaymentForm />}</div>
        <div>{showBilling && <Billing />}</div>
        <div>
          {showUpdateResponse && (
            <UpdateResponse onSuccessAdd={handleSuccessAdd} />
          )}
        </div>
        <div>{showscheduleinterview && <ScheduleInterview />}</div>
        <div>
          {showSendClientMail && (
            <SendClientEmail clientEmailSender={clientEmailSender} />
          )}
        </div>
        <div>{showAddCompany && <AddCompanyDetails />}</div>
        <div>{showCapex && <Capex />}</div>
        <div>{showEmployeeDetails && <EmployeeDetails />}</div>

        <div>{showCompanyPolicy && <WorkplacePolicy></WorkplacePolicy>}</div>
        <div>{showIssueSolving && <IssueSolving></IssueSolving>}</div>
        <div>{showPainArea && <PainAreaSolving></PainAreaSolving>}</div>
        <div>
          {showRightsInstruction && (
            <RightsAndInstructions></RightsAndInstructions>
          )}
        </div>

        <div>
          {showCandidateHistory && (
            <CandidateHistoryTracker></CandidateHistoryTracker>
          )}
        </div>
        <div>
          {showApplicantForm && (
            <ApplicantForm loginEmployeeName={loginEmployeeName} />
          )}
        </div>
        <div>
          {showInterviewForm && (
            <InterviewForm1
              toggleAllInterviewResponse={toggleAllInterviewResponse}
            />
          )}
        </div>
        <div>{showAllInterviewResponses && <InterviewDataTables />}</div>
        <div>
          {showPerformanceImprovement && (
            <PerformanceImprovement
              loginEmployeeName={loginEmployeeName}
              onCloseIncentive={handleOpenEmployeeProfile}
            />
          )}
        </div>

        <div>{showAddTeamLeader && <AddTeamLeader loginEmployeeName={loginEmployeeName}></AddTeamLeader>}</div>
        <div>{showAddManager && <AddManager loginEmployeeName={loginEmployeeName}></AddManager>}</div>
        <div>
          {showSharedProfile && <ShareProfileData></ShareProfileData>}
        </div>
        <div>
        {showIssueLetter && <IssueOfferLetter></IssueOfferLetter>}
        {showCompanyOfferForm && <CompanyOfferForm></CompanyOfferForm>}
        </div>
        <div>
          {showActiveTeamMemebers && <AttendanceLoginLogout></AttendanceLoginLogout> }
        </div>
      </div>

      {/* <motion.div drag style={{
        width:"50px",
        height:"50px",
        background:"red",
        position:"absolute",
        zIndex:9999
      }} /> */}

{/* <Popover content={<AttendanceLoginLogout/>} title="Title" trigger="click">
<motion.div
      {...bindDrag()}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grab",
        zIndex: 9999,
      }}
    >
      <Button style={{
        width:"40px",
        height:"40px"
      }} type="primary" shape="circle" icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>} />
    </motion.div>
    </Popover> */}

    </div>
  );
};

export default EmpDashboard;
