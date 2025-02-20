/* Name:-Prachi Parab Component:-Create Report Table page 
         End LineNo:-4 to 319 Date:-06/07 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Reports/CreateReportTable.css";
import ShortListedCandidates from "./LineUpDataReport";

import PdfModal from "./pdfModal";
import { createPdf } from "./pdfUtils";
import PieChart from "./PieChartReport";
import PDFGenerator from "./PDFMain";
import SliderReport from "./SliderReports";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Loader from "../EmployeeSection/loader";

const LineUpDataDummy = [
  {
    no: 1,
    date: "1/2/2024",
    status: "selected",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 2,
    date: "1/2/2024",
    status: "rejected",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 3,
    date: "1/2/2024",
    status: "selected",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "React Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 4,
    date: "1/2/2024",
    status: "rejected",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: ".Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 5,
    date: "1/2/2024",
    status: "selected",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 6,
    date: "1/2/2024",
    status: "lineup",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 7,
    date: "1/2/2024",
    status: "hold",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Jawale",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "React Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 8,
    date: "1/2/2024",
    status: "dropout",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Amol Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: ".Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 9,
    date: "1/2/2024",
    status: "join",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Sachin Sakhare",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 10,
    date: "1/2/2024",
    status: "notjoin",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Amit Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "TCS",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 11,
    date: "1/2/2024",
    status: "active",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "React Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 12,
    date: "1/2/2024",
    status: "inactive",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sachin Tiwari",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: ".Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 13,
    date: "1/2/2024",
    status: "lineup",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Amar Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "TCS",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 14,
    date: "1/2/2024",
    status: "hold",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Java Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 15,
    date: "1/2/2024",
    status: "join",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Backend Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 16,
    date: "1/2/2024",
    status: "notjoin",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sanika Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Asp.Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 17,
    date: "1/2/2024",
    status: "l1",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sachin Tiwari",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: ".Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 18,
    date: "1/2/2024",
    status: "l2",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Amar Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "TCS",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 19,
    date: "1/2/2024",
    status: "l3",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Java Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 20,
    date: "1/2/2024",
    status: "l4",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Backend Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 21,
    date: "1/2/2024",
    status: "l5",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sanika Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Asp.Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 12,
    date: "1/2/2024",
    status: "l6",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sachin Tiwari",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: ".Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 13,
    date: "1/2/2024",
    status: "active",
    Time: "12:00",
    CandidateId: 101,
    RecruiterName: "Amar Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Python Developer",
    JobId: 22,
    ApplyingCompany: "TCS",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 14,
    date: "1/2/2024",
    status: "inactive",
    Time: "12:00",
    CandidateId: 102,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Java Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 15,
    date: "1/2/2024",
    status: "join",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Backend Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 16,
    date: "1/2/2024",
    status: "notjoin",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sanika Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Asp.Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 17,
    date: "1/2/2024",
    status: "yettoschedule",
    Time: "12:00",
    CandidateId: 103,
    RecruiterName: "Sachin Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Backend Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
  {
    no: 18,
    date: "1/2/2024",
    status: "noshow",
    Time: "12:00",
    CandidateId: 104,
    RecruiterName: "Sanika Tendulkar",
    CandidateName: "Sarika Shetye",
    CandidateEmail: "abc@gmail.com",
    ContactNo: "9823456781",
    WhatsappNo: "9823456781",
    SourceName: "ABC",
    JobDesignation: "Asp.Net Developer",
    JobId: 22,
    ApplyingCompany: "Infosys",
    CommunicationRating: 5,
    CurrentLocation: "Pune",
  },
];
// Data for pdf

const DateReportData = `Last 6 months report from 1/2/2004 to 1/7/2004`;
const SuperUserName = "SuperUser Name : Avni Deshpande";
const ManagerName = "Manager Name : Amit Deshpande";
const TeamLeaderName = "TeamLeader Name : Shreya Sawant";
const RecruiterName = "Recruiter Name :Saniya Mirza";

const LineUpselectedCount = LineUpDataDummy.filter(
  (item) => item.status === "selected"
).length;
const LineUprejectedCount = LineUpDataDummy.filter(
  (item) => item.status === "rejected"
).length;
const LineUplineupCount = LineUpDataDummy.filter(
  (item) => item.status === "lineup"
).length;
const LineUpholdCount = LineUpDataDummy.filter(
  (item) => item.status === "hold"
).length;
const LineUpdropoutCount = LineUpDataDummy.filter(
  (item) => item.status === "dropout"
).length;
const LineUpjoinCount = LineUpDataDummy.filter(
  (item) => item.status === "join"
).length;
const LineUpnotjoinCount = LineUpDataDummy.filter(
  (item) => item.status === "notjoin"
).length;
const LineUpactiveCount = LineUpDataDummy.filter(
  (item) => item.status === "active"
).length;
const LineUpinactiveCount = LineUpDataDummy.filter(
  (item) => item.status === "inactive"
).length;
const LineUpl1Count = LineUpDataDummy.filter(
  (item) => item.status === "l1"
).length;
const LineUpl2Count = LineUpDataDummy.filter(
  (item) => item.status === "l2"
).length;
const LineUpl3Count = LineUpDataDummy.filter(
  (item) => item.status === "l3"
).length;
const LineUpl4Count = LineUpDataDummy.filter(
  (item) => item.status === "l4"
).length;
const LineUpl5Count = LineUpDataDummy.filter(
  (item) => item.status === "l5"
).length;
const LineUpl6Count = LineUpDataDummy.filter(
  (item) => item.status === "l6"
).length;
const LineUpyettoScheduleCount = LineUpDataDummy.filter(
  (item) => item.status === "yettoschedule"
).length;
const LineUpnoshowCount = LineUpDataDummy.filter(
  (item) => item.status === "noshow"
).length;

const totalCandidateCount =
  LineUpselectedCount +
  LineUprejectedCount +
  LineUplineupCount +
  LineUpholdCount +
  LineUpdropoutCount +
  LineUpjoinCount +
  LineUpnotjoinCount +
  LineUpactiveCount +
  LineUpinactiveCount +
  LineUpl1Count +
  LineUpl2Count +
  LineUpl3Count +
  LineUpl4Count +
  LineUpl5Count +
  LineUpl6Count +
  LineUpyettoScheduleCount +
  LineUpnoshowCount;

const totalCandidatepdf = "Total Candidate :" + totalCandidateCount;
const datadistributed = [
  { status: "Selected Candidate", CandidateCount: LineUpselectedCount },
  { status: "Rejected Candidate", CandidateCount: LineUprejectedCount },
  { status: "LineUp Candidate", CandidateCount: LineUplineupCount },
  { status: "Hold Candidate", CandidateCount: LineUpholdCount },
  { status: "Dropout Candidate", CandidateCount: LineUpdropoutCount },
  { status: "Join Candidate", CandidateCount: LineUpjoinCount },
  { status: "Not Join Candidate", CandidateCount: LineUpnotjoinCount },
  { status: "Active Candidate", CandidateCount: LineUpactiveCount },
  { status: "InActive Candidate", CandidateCount: LineUpinactiveCount },
  { status: "Round 1 Candidate", CandidateCount: LineUpl1Count },
  { status: "Round 2 Candidate", CandidateCount: LineUpl2Count },
  { status: "Round 3 Candidate", CandidateCount: LineUpl3Count },
  { status: "Round 4 Candidate", CandidateCount: LineUpl4Count },
  { status: "Round 5 Candidate", CandidateCount: LineUpl5Count },
  { status: "Round 6 Candidate", CandidateCount: LineUpl6Count },
  {
    status: "Yet to Schedule Candidate",
    CandidateCount: LineUpyettoScheduleCount,
  },
  { status: "No show Candidate", CandidateCount: LineUpnoshowCount },
];

const Attendance = ({
  reportDataDatewise,
  selectedIdsProp,
  selectedJobRole,
  finalStartDatePropState,
  finalEndDatePropState,
  loginEmployeeName,
}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [LineUpDataReport, setLineUpDataReport] = useState(false);
  const [LineUpItems, setLineUpItems] = useState(reportDataDatewise);
  const [FilterLineUpItems, setFilterLineUpItems] = useState("selected");
  const [filterDataCategory, setfilterDataCategory] = useState();
  const { userType } = useParams();
  // Prachi
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const { workId } = useParams();
  const navigator = useNavigate();

  const handleFilterLineUpChange = (newFilter) => {
    setFilterLineUpItems(newFilter);
    // console.log(selectedManager.managerId);
    // console.log(selectedManager.managerJobRole);

    setLineUpDataReport(true);
  };

  const handleRadioChange = () => {
    // Calculate the date for last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    setSelectedDate(lastMonth.toISOString().split("T")[0]);
  };

  const filteredLineUpItems = LineUpItems.filter(
    (item) => item.status === FilterLineUpItems
  );

  const LineUpselectedCount = LineUpItems.filter(
    (item) => item.status === "selected"
  ).length;
  const LineUprejectedCount = LineUpItems.filter(
    (item) => item.status === "rejected"
  ).length;
  const LineUplineupCount = LineUpItems.filter(
    (item) => item.status === "lineup"
  ).length;
  const LineUpholdCount = LineUpItems.filter(
    (item) => item.status === "hold"
  ).length;
  const LineUpdropoutCount = LineUpItems.filter(
    (item) => item.status === "dropout"
  ).length;
  const LineUpjoinCount = LineUpItems.filter(
    (item) => item.status === "join"
  ).length;
  const LineUpnotjoinCount = LineUpItems.filter(
    (item) => item.status === "notjoin"
  ).length;
  const LineUpactiveCount = LineUpItems.filter(
    (item) => item.status === "active"
  ).length;
  const LineUpinactiveCount = LineUpItems.filter(
    (item) => item.status === "inactive"
  ).length;
  const LineUpl1Count = LineUpItems.filter(
    (item) => item.status === "l1"
  ).length;
  const LineUpl2Count = LineUpItems.filter(
    (item) => item.status === "l2"
  ).length;
  const LineUpl3Count = LineUpItems.filter(
    (item) => item.status === "l3"
  ).length;
  const LineUpl4Count = LineUpItems.filter(
    (item) => item.status === "l4"
  ).length;
  const LineUpl5Count = LineUpItems.filter(
    (item) => item.status === "l5"
  ).length;
  const LineUpl6Count = LineUpItems.filter(
    (item) => item.status === "l6"
  ).length;
  const LineUpyettoScheduleCount = LineUpItems.filter(
    (item) => item.status === "yettoschedule"
  ).length;
  const LineUpnoshowCount = LineUpItems.filter(
    (item) => item.status === "noshow"
  ).length;

  // sk pdf download

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userType === "Recruiters") {
      setUserName(`Recruiters : ${loginEmployeeName}`);
    } else if (userType === "TeamLeader") {
      setUserName(`TeamLeader : ${loginEmployeeName}`);
    } else if (userType === "Manager") {
      setUserName(`Manager : ${loginEmployeeName}`);
    } else if (userType === "SuperUser") {
      setUserName(`SuperUser : ${loginEmployeeName}`);
    }
  }, []);

  const handleDownloadPdf = async () => {
    setLoading(true);
    try {
      const forPieWidthContainer =
        document.getElementsByClassName("mainChartContainer");
      if (forPieWidthContainer.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer[0].style.width = "fit-content";
        forPieWidthContainer[0].style.border = "2px solid black";
        forPieWidthContainer[0].style.padding = "10px";
      }
      const forPieWidthContainer1 =
        document.getElementsByClassName("tabledivmain");
      if (forPieWidthContainer1.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer1[0].style.display = "block";
      }

      const input = document.getElementById("divToPrint");

      // Adjust the canvas dimensions for better resolution
      const options = { scale: 2 }; // Adjust the scale for higher resolution
      const canvas = await html2canvas(input, options);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait", // or "landscape"
        unit: "px", // Unit in which to measure dimensions
        format: [(canvas.width = 450), (canvas.height = 570)], // Match canvas size
      });

      // Add the image to the PDF
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        (canvas.width = 430),
        (canvas.height = 550)
      );

      // Save the PDF
      pdf.save("document.pdf");
      // Open the modal (if necessary)

      if (forPieWidthContainer.length > 0) {
        forPieWidthContainer[0].style.width = "100%";
        forPieWidthContainer[0].style.border = "none";
        forPieWidthContainer[0].style.padding = "none";
      }
      if (forPieWidthContainer1.length > 0) {
        // forPieWidthContainer[0].style.display = 'block';
        forPieWidthContainer1[0].style.display = "none";
      }
      setModalIsOpen(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating and merging PDF:", error);
      setLoading(false);
    }
  };

  const closeModal = () => {
    // Clear the PDF URL and close the modal
    setPdfUrl("");
    setModalIsOpen(false);
  };
  console.log(reportDataDatewise);
  const [newData, setNewData] = useState([]);
  console.log(selectedIdsProp);
  const newIdsString = selectedIdsProp.join(",");
  console.log(newIdsString);

  const handleFilterDataInterview = async (category) => {
    const response = await axios.get(
      `${API_BASE_URL}/candidate-category/${category}/${newIdsString}/${selectedJobRole}/${finalStartDatePropState}/${finalEndDatePropState}`
    );
    console.log(
      `${API_BASE_URL}/candidate-category/${category}/${newIdsString}/${selectedJobRole}/${finalStartDatePropState}/${finalEndDatePropState}`
    );

    console.log(response.data);
    setNewData(response.data);
    setLineUpDataReport(true);
  };

  return (
    <div className="report-App-after">
      {loading && <Loader />}

      <div className="container-after1">
        <div className="attendanceTableData">
          <div style={{ textAlign: "-webkit-center" }}></div>

          <div className="silderReport-align-div">
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "right",

                paddingBottom: "5px",
              }}
            >
              {/* <PdfModal isOpen={modalIsOpen} closeModal={closeModal} pdfContent={pdfUrl} /> */}
            </div>
          </div>

          <div className="btnShareAndDownload">
            {/* <button className="shareDownloadbtn" onClick={handleRadioChange}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z"/></svg>
                     </button> */}
            <button className="shareDownloadbtn" onClick={handleDownloadPdf}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
            </button>
          </div>

          <table className="report-attendance-table">
            <thead>
              <tr className="attendancerows-head">
                <th className="attendanceheading">Selected</th>
                <th className="attendanceheading">Rejected</th>
                <th className="attendanceheading">LineUP</th>
                <th className="attendanceheading">Hold</th>
                <th className="attendanceheading">Dropout</th>
                <th className="attendanceheading">Join</th>
                <th className="attendanceheading">Not Join</th>
                <th className="attendanceheading">No Show</th>
                <th className="attendanceheading">Yet to Show</th>
                <th className="attendanceheading">Active</th>
                <th className="attendanceheading">Inactive</th>
                <th className="attendanceheading">L1</th>

                <th className="attendanceheading">L2</th>
                <th className="attendanceheading">L3</th>
              </tr>
            </thead>

            {reportDataDatewise.map((reportData, index) => (
              <td
                className="tabledata"
                key={index}
                onClick={() => handleFilterDataInterview(reportData.category)}
              >
                {reportData.count}
                &nbsp;{" "}
                <i class="fa fa-caret-down" aria-hidden="true">
                  {" "}
                </i>
                {/* {reportData.category} */}
              </td>
            ))}
          </table>
          <div className="shortlisted-candidates-css">
            {LineUpDataReport && (
              <ShortListedCandidates filteredLineUpItems={newData} />
            )}
          </div>
          <div>
            <PieChart
              data={reportDataDatewise}
              userName={userName}
              finalStartDatePropState={finalStartDatePropState}
              finalEndDatePropState={finalEndDatePropState}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
