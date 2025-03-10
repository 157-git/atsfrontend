// Akash_Pawar_CallingTracker_Validation_&_Distance_&_Salary_Calculation_23/07
// SwapnilRokade_CallingTrackerForm_addedProcessImprovmentEvaluatorFunctionalityStoringInterviweResponse_03_to_1802_29/07/2024
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Form, json, useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "bootstrap/dist/css/bootstrap.css";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../EmployeeSection/CallingTrackerForm.css";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import Confetti from "react-confetti";
// import ClipLoader from "react-spinners/ClipLoader";
import CandidateHistoryTracker from "../CandidateSection/candidateHistoryTracker";
import InterviewPreviousQuestion from "./interviewPreviousQuestion";
import { API_BASE_URL } from "../api/api";
import Loader from "./loader";
// this libraries added by sahil karnekar date 21-10-2024
import {
  Button,
  Checkbox,
  Flex,
  message,
  notification,
  Progress,
  Radio,
  Rate,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSocket } from "../EmployeeDashboard/socket";
import { UploadOutlined } from "@ant-design/icons";
import CandidatePresentComponent from "./CandidatePresentComponent";
import uploadingResumeGif from "../assets/uploadingResumeMotion.gif";
import uploadingResumeStatic from "../assets/uploadStaticPngFile.png";
import startPointImg from "../photos/start-line.png";
import endpointImg from "../photos/finish.png";
import { convertNumberToWords } from "./convertNumberToWords";
import {
  getDailyworkData,
  putDailyworkData,
} from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable";
import { getFormattedDateISOYMDformat } from "./getFormattedDateTime";

const CallingTrackerForm = ({
  onsuccessfulDataAdditions,
  initialData = {},
  loginEmployeeName,
  onsuccessfulDataUpdation,
  setRefresPropForDailyWork,
}) => {
  const { employeeId, userType } = useParams();
  const [submited, setSubmited] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadingResumeNewState, setUploadingResumeNewState] = useState(false);
  const [displaySourceOthersInput, setDisplaySourceOthersInput] =
    useState(false);
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

  // sahil karnekar line 33 to 38 date 15-10-2024
  const today = new Date();
  const maxDate = new Date(today.setFullYear(today.getFullYear() - 18))
    .toISOString()
    .split("T")[0]; // Format as YYYY-MM-DD
  const initialCallingTrackerState = {
    date: new Date().toISOString().slice(0, 10),
    candidateAddedTime: "",
    recruiterName: loginEmployeeName,
    candidateName: "",
    candidateEmail: "",
    jobDesignation: "",
    requirementId: "",
    requirementCompany: "",
    sourceName: "",
    contactNumber: "",
    incentive: "",
    alternateNumber: "",
    currentLocation: "",
    fullAddress: "",
    communicationRating: "",
    selectYesOrNo: "Yet To Confirm",
    callingFeedback: "",
    employeeId: employeeId,
    userType: userType,
  };

  const initialLineUpState = {
    companyName: "",
    experienceYear: "",
    experienceMonth: "",
    relevantExperience: "",
    currentCTCLakh: "",
    currentCTCThousand: "",
    emailStatus:"No",
    expectedCTCLakh: "",
    expectedCTCThousand: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    yearOfPassing: "",
    extraCertification: "No",
    holdingAnyOffer: "",
    offerLetterMsg: "",
    noticePeriod: "",
    msgForTeamLeader: "",
    availabilityForInterview: "",
    interviewTime: "",
    finalStatus: "",
    feedBack: "",
    resume: [],
  };

  const [callingTracker, setCallingTracker] = useState(
    initialCallingTrackerState
  );
  const [lineUpData, setLineUpData] = useState(initialLineUpState);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [successfulDataAdditions, setSuccessfulDataAdditions] = useState(0);
  const [requirementOptions, setRequirementOptions] = useState([]);
  const [candidateAddedTime, setCandidateAddedTime] = useState("");
  const [isOtherLocationSelected, setIsOtherLocationSelected] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [convertedExpectedCTC, setConvertedExpectedCTC] = useState("");
  const [convertedCurrentCTC, setConvertedCurrentCTC] = useState("");
  const [startpoint, setStartPoint] = useState("");
  const [endpoint, setendPoint] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // sahil karnekar line 110 to 112 Date : 15-10-2024
  const [errorForYOP, setErrorForYOP] = useState("");
  const [errorForDOB, setErrorForDOB] = useState("");
  const [errorInterviewSlot, seterrorInterviewSlot] = useState("");
  const [resumeSelected, setResumeSelected] = useState(false);
  const [errorForResumeUrl, setErrorForResumeUrl] = useState("");
  // creating state for socket
  const [socket, setSocket] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmationPending, setIsConfirmationPending] = useState(false);
  const [displayCallingRemarkOthersInput, setDisplayCallingRemarkOthersInput] =
    useState(false);
  const currentDateNewGlobal = getFormattedDateISOYMDformat();
  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  useEffect(() => {
    fetchRequirementOptions();
  }, [employeeId]);

  useEffect(() => {
    if (initialData) {
      const updatedCallingTracker = { ...initialCallingTrackerState };
      const updatedLineUpData = { ...initialLineUpState };

      Object.keys(initialData).forEach((key) => {
        if (key === "date") {
          updatedCallingTracker[key] = new Date().toISOString().slice(0, 10);
          updatedLineUpData[key] = new Date().toISOString().slice(0, 10);
        } else if (["candidateId", "candidateAddedTime"].includes(key)) {
          updatedCallingTracker[key] = "";
          updatedLineUpData[key] = "";
        } else if (updatedCallingTracker.hasOwnProperty(key)) {
          updatedCallingTracker[key] = ensureStringValue(initialData[key]);
        } else if (updatedLineUpData.hasOwnProperty(key)) {
          updatedLineUpData[key] = ensureStringValue(initialData[key]);
        }
        if (initialData.fileName !== "") {
          setResumeFileName(initialData.fileName);
          setDisplayProgress(true);
          setUploadProgress(100);
          setResumeUploaded(true);
        }
      });

      // Explicitly set recruiterName to loginEmployeeName
      updatedCallingTracker.recruiterName = loginEmployeeName;

      setCallingTracker(updatedCallingTracker);
      setLineUpData(updatedLineUpData);
    }
  }, [initialData]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;

      setCandidateAddedTime(time);
      setCallingTracker((prevState) => ({
        ...prevState,
        candidateAddedTime: time,
      }));
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const [dailyWorkDataNew, setDailyWorkDataNew] = useState(null); // State to store getData
  const getDailyworkDataFunc = async () => {
    try {
      const getData = await getDailyworkData(
        employeeId,
        userType,
        currentDateNewGlobal
      );
      console.log(getData);

      setDailyWorkDataNew(getData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDailyworkDataFunc();
  }, []);

  const ensureStringValue = (value) =>
    value !== undefined && value !== null ? String(value) : "";

  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      const { data } = response;
      setRequirementOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  const validateCallingTracker = () => {
    let errors = {};
    if (!callingTracker.requirementId) {
      errors.requirementId = "Please Select Job Id";
    }
    if (
      !callingTracker.candidateName ||
      callingTracker.candidateName.trim() === ""
    ) {
      errors.candidateName = "Candidate Name is required";
    }
    if (!callingTracker.contactNumber) {
      errors.contactNumber = "Contact Number is required";
    }
    if (!callingTracker.sourceName || callingTracker.sourceName === "others") {
      errors.sourceName = "Source Name is required";
    }
    // this validation added by sahil karnekar date 21-10-2024 line 187 to 195
    const emailPattern =
      /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    if (!callingTracker.candidateEmail) {
      errors.candidateEmail = "Email is required";
    } else if (!emailPattern.test(callingTracker.candidateEmail)) {
      errors.candidateEmail =
        "Invalid email format. Ensure proper structure (no spaces, valid characters, single @, valid domain).";
    } else {
      delete errors.candidateEmail;
    }
    if (
      !callingTracker.callingFeedback ||
      callingTracker.callingFeedback === "others"
    ) {
      errors.callingFeedback = "Calling Feedback is required";
    }
    return errors;
  };

  const validateLineUpData = () => {
    let errors = {};
    if (callingTracker.selectYesOrNo === "Interested") {
      if (!callingTracker.requirementId) {
        errors.requirementId = "Job Id is required";
      }
      // sahil karnekar line 197 to 202
      if (!lineUpData.experienceYear) {
        errors.experienceYear = "Experience Year is required";
      }
      if (!lineUpData.experienceMonth) {
        errors.experienceMonth = "Experience Month is required";
      }
      if (!lineUpData.relevantExperience) {
        errors.relevantExperience = "Relevent Experience is required";
      }
      if (!callingTracker.currentLocation) {
        errors.currentLocation = "Location is required";
      }
      if (!lineUpData.qualification) {
        errors.qualification = "Education is required";
      }
      if (!callingTracker.communicationRating) {
        errors.communicationRating = "Communication Rating is required";
      }
      if (!lineUpData.expectedCTCLakh && !lineUpData.expectedCTCThousand) {
        errors.expectedCTCLakh = "Expected CTC is required";
      }
      if (!lineUpData.currentCTCLakh && !lineUpData.currentCTCThousand) {
        errors.currentCTCLakh = "Current CTC is required";
      }
      if (!lineUpData.holdingAnyOffer) {
        errors.holdingAnyOffer = "Holding Any Offer is required";
      }
      if (!lineUpData.finalStatus) {
        errors.finalStatus = "Please Select Option";
      }
      if (!lineUpData.noticePeriod) {
        errors.noticePeriod = "Notice Period is required";
      }
    }
    return errors;
  };
  const handleBlurEmailChange = async () => {
    if (callingTracker.candidateEmail) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/duplicate-candidates/${callingTracker.candidateEmail}`
        );
        const data = response.data;
        setCandidateData(data);
        setIsFormVisible(true);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  const handleSourceNameOthers = (e) => {
    const { name, value } = e.target;
    callingTracker.sourceName = value;
    setErrors((prevErrors) => ({ ...prevErrors, ["sourceName"]: "" }));
  };
  const handleCallingFeedBackOthers = (e) => {
    const { name, value } = e.target;
    callingTracker.callingFeedback = value;
    setErrors((prevErrors) => ({ ...prevErrors, ["callingFeedback"]: "" }));
  };
  const handleRatingsChange = (value) => {
    setCallingTracker((prev) => ({
      ...prev,
      communicationRating: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, ["communicationRating"]: "" }));
  };
  const handleRatingsChange1 = (event) => {
    const { name, value } = event.target;

    setCallingTracker((prevState) => ({
      ...prevState,
      communicationRating: value, // Updates the selected rating
    }));
    setErrors((prevErrors) => ({ ...prevErrors, ["communicationRating"]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target || e;

    if (name === "selectYesOrNo" && value !== "Interested") {
      setLineUpData((prevData) => ({
        ...prevData,
        finalStatus: "",
        availabilityForInterview: "",
        interviewTime: "",
      }));
    }

    // Rajlaxmi Jagadale Added Email Validation Date-24-01-25 line263 to 312
    if (name === "sourceName" && value === "others") {
      setDisplaySourceOthersInput(true);
    } else if (name === "sourceName" && value !== "others") {
      setDisplaySourceOthersInput(false);
    }

    if (name === "callingFeedback" && value === "others") {
      setDisplayCallingRemarkOthersInput(true);
    } else if (name === "callingFeedback" && value !== "others") {
      setDisplayCallingRemarkOthersInput(false);
    }

    if (name === "candidateEmail") {
      const trimmedEmail = value.replace(/\s/g, "");
      setCallingTracker({ ...callingTracker, [name]: trimmedEmail });
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (trimmedEmail !== "" && !emailPattern.test(trimmedEmail)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]:
            "Invalid email format. Ensure proper structure (no spaces, valid characters, single @, valid domain).",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
      return;
    }
    if (
      (name === "contactNumber" ||
        name === "alternateNumber" ||
        name === "experienceYear" ||
        name === "experienceMonth") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }
    if (
      (name === "candidateName" ||
        name === "sourceName" ||
        name === "currentLocation" ||
        name === "qualification") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return;
    }
    setCallingTracker({ ...callingTracker, [name]: value });
    if (!startTime) {
      setStartTime(Date.now());
    }
    if (name === "fullAddress") {
      setStartPoint(value);
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleIncentiveChange = (e) => {
    const value = e.target.value;

    // Remove any non-numeric characters (except for "." for decimal point) using regex
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    // Update incentive only if sanitized value is a valid number or an empty string
    setCallingTracker((prevState) => ({
      ...prevState,
      incentive:
        sanitizedValue === "" || isNaN(parseFloat(sanitizedValue))
          ? "0.0"
          : sanitizedValue,
    }));
  };

  const handlePhoneNumberChange = (value, name) => {
    const sanitizedValue =
      typeof value === "string" ? value.replace(/\s+/g, "") : value;
    setCallingTracker((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleLineUpChange = (e) => {
    const { name, value } = e.target;

    // line number 314 to 324 added by sahil karnekar date : 15-10-2024
    if (name === "dateOfBirth") {
      if (value > maxDate) {
        setErrorForDOB("MaxDate" + maxDate);
      } else {
        setErrorForDOB("");
      }
    }

    // Restrict non-numeric input for specific fields
    if (
      (name === "contactNumber" ||
        name === "alternateNumber" ||
        name === "experienceYear" ||
        name === "experienceMonth" ||
        name === "currentCTCLakh" ||
        name === "currentCTCThousand" ||
        name === "expectedCTCLakh" ||
        name === "expectedCTCThousand") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }
    if (
      (name === "candidateName" ||
        name === "sourceName" ||
        name === "qualification") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return;
    }

    const updatedLineUpData = { ...lineUpData, [name]: value };

    // sahil karnekar line 354 to 372
    // Validate experienceMonth and set error message if necessary
    if (name === "experienceMonth") {
      const experienceMonthValue = parseInt(value, 10);
      if (experienceMonthValue > 11) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          experienceMonth: "Experience in months cannot exceed 11.",
        }));

        // Clear error after 4 seconds
        setTimeout(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            experienceMonth: "",
          }));
        }, 2000);

        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          experienceMonth: "",
        }));
      }
    }

    if (name === "currentCTCLakh" || name === "currentCTCThousand") {
      const lakhValue = parseFloat(updatedLineUpData.currentCTCLakh) || 0;
      const thousandValue =
        parseFloat(updatedLineUpData.currentCTCThousand) || 0;
      const combinedCTC = lakhValue * 100000 + thousandValue * 1000;
      setConvertedCurrentCTC(combinedCTC.toFixed(2));
    }

    if (name === "expectedCTCLakh" || name === "expectedCTCThousand") {
      const lakhValue = parseFloat(updatedLineUpData.expectedCTCLakh) || 0;
      const thousandValue =
        parseFloat(updatedLineUpData.expectedCTCThousand) || 0;
      const combinedCTC = lakhValue * 100000 + thousandValue * 1000;
      setConvertedExpectedCTC(combinedCTC.toFixed(2));
    }
    setLineUpData(updatedLineUpData);

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);
  console.log(lineUpData);
  
  const handleEmailCheckbox = (e) => {
    const checkornot = e.target.checked
   if (checkornot === true) {
    lineUpData.emailStatus = "Yes";
   }else {
    lineUpData.emailStatus = "No";
   }
  };
  const handleSubmit = async (e) => {
    setShowConfirmation(false);
    e.preventDefault();
    if (isConfirmationPending) {
      message.error("Please confirm overwrite before proceeding.");
      return;
    }

    if (errorForYOP !== "") {
      setErrorForYOP("Please select a valid year of passing.");
      return;
    }
    if (errorForDOB !== "") {
      setErrorForDOB("Please select a valid date of birth.");
      return;
    }
    // Validate fields
    let callingTrackerErrors = validateCallingTracker() || {};
    let lineUpDataErrors = validateLineUpData() || {};

    if (
      Object.keys(callingTrackerErrors).length > 0 ||
      Object.keys(lineUpDataErrors).length > 0
    ) {
      setErrors({ ...callingTrackerErrors, ...lineUpDataErrors });
      return;
    }

    // Ensure 'incentive' is a valid number (if it's invalid, default to 0.0)
    const incentiveValue = parseFloat(callingTracker.incentive);
    const validIncentive = isNaN(incentiveValue) ? 0.0 : incentiveValue;

    // Update the incentive field in the state to ensure it's valid
    setCallingTracker((prevState) => ({
      ...prevState,
      incentive: validIncentive.toFixed(1), // Ensure it's a number with one decimal point
    }));

    let formFillingTime = null;
    if (startTime) {
      const endTime = new Date().getTime(); // Get the current time in milliseconds
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
      const minutes = Math.floor(timeTaken / 60);
      const seconds = Math.floor(timeTaken % 60);

      formFillingTime = `${minutes} minutes and ${seconds} seconds`;
    }

    setSubmited(true);
    setLoading(true);

    try {
      // lines updated sahil karnekar
      let dataToUpdate = {
        callingTracker: {
          ...callingTracker,
          candidateName: callingTracker.candidateName.trim(), // Trim candidateName here
        },
        performanceIndicator: {
          employeeId: employeeId,
          employeeName: loginEmployeeName,
          jobRole: userType,
          candidateName: callingTracker.candidateName.trim(),
          jobId: callingTracker.requirementId,
          salary: convertedCurrentCTC,
          experience: `${lineUpData.experienceYear} years ${lineUpData.experienceMonth} months`,
          companyName: callingTracker.requirementCompany,
          designation: callingTracker.jobDesignation,
          candidateFormFillingDuration: formFillingTime,
          callingTacker: new Date(),
          lineup: new Date(),
          mailToClient: null,
          mailResponse: null,
          sendingDocument: null,
          issueOfferLetter: null,
          letterResponse: null,
          joiningProcess: null,
          joinDate: null,
          interviewRoundList: [],
        },
      };

      dataToUpdate.lineUp = {
        ...lineUpData,
        resume: lineUpData.resume,
      };

      if (userType === "Recruiters") {
        dataToUpdate.callingTracker.employee = { employeeId: employeeId };
      } else if (userType === "TeamLeader") {
        dataToUpdate.callingTracker.teamLeader = { teamLeaderId: employeeId };
      }

      const response = await axios.post(
        `${API_BASE_URL}/calling-tracker/${employeeId}/${userType}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // this code is implemented just for testing of socket transmission
      const getFormattedDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // Months are 0-based in JavaScript
        const day = now.getDate();

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours =
          hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        const formattedDate = `${year}-${month}-${day}`;
        return `Date: ${formattedDate}, Time: ${formattedHours}:${formattedMinutes} ${period}`;
      };
      const updatedCallingTracker = {
        ...dataToUpdate.callingTracker,
        candidateAddedTime: getFormattedDateTime(),
      };
      if (callingTracker.selectYesOrNo === "Interested") {
        socket.emit("add_candidate", updatedCallingTracker);
        try {
          if (!dailyWorkDataNew) {
            throw new Error("dailyWorkDataNew is null or undefined");
          }

          const getDataForUpdate = {
            attendanceRole: {
              ...(userType === "Recruiters" && { employee: { employeeId } }),
              ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
              ...(userType === "Manager" && { manager: { employeeId } }),
            },
            dailyArchived: (dailyWorkDataNew?.dailyArchived || 0) + 1, // Prevents NaN if value is null
            dailyPending: (dailyWorkDataNew?.dailyPending || 0) - 1,
            dayPresentStatus:
              (dailyWorkDataNew?.dailyArchived ?? 0) + 1 >= 5 ? "Yes" : "No",
          };

          console.log(getDataForUpdate);

          const putData = await putDailyworkData(
            employeeId,
            userType,
            currentDateNewGlobal,
            getDataForUpdate
          );
          let triggerState = false;
          triggerState = !triggerState;
          setRefresPropForDailyWork(triggerState);
          getDailyworkDataFunc();
        } catch (error) {
          console.error("Error in updating daily work data:", error);
        }
      }

      if (response.status === 200 || response.status === 201) {
        //Arshad Attar Added this function to add data from excel and Resume data base and
        // after added in data based delete from excel & resume data base
        //added On Date : 22-11-2024
        if (initialData && initialData.candidateId) {
          if (initialData.sourceComponent === "ResumeList") {
            await deleteResumeDataById(initialData.candidateId);
          } else if (initialData.sourceComponent === "CallingExcelList") {
            await deleteExcelDataById(initialData.candidateId);
          }
        }

        if (callingTracker.selectYesOrNo === "Interested") {
          onsuccessfulDataAdditions(true);
        } else {
          onsuccessfulDataAdditions(false);
        }
        setSubmited(false);
        setLoading(true);
        setShowConfetti(true);
        setResumeSelected(false);
        setTimeout(() => setShowConfetti(false), 4000);
        toast.success("Candidate Added Successfully..");
        setCallingTracker(initialCallingTrackerState);
        setLineUpData(initialLineUpState);
      }
      setIsFormVisible(false);
    } catch (error) {
      setSubmited(false);
      setLoading(false);
      if (error.response) {
        toast.error(
          "Error: " + error.response.data.message || "An error occurred"
        );
      } else if (error.request) {
        toast.error("No response received from the server");
      } else {
        toast.error("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(dailyWorkDataNew);

  //Arshad Attar Added this function to add data from excel and after added in data based delete from excel
  //added On Date : 22-11-2024
  const deleteExcelDataById = async (candidateId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete-excel-data/${candidateId}`
      );

      if (response.status === 200 || response.status === 204) {
        // toast.success("Candidate Data Transfered Succefully...");
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
        toast.warning("Unable to Transfered Candidate Data");
      }
    } catch (error) {
      console.error("Error while deleting data:", error);
      if (error.response) {
        toast.error(
          `Delete Error: ${error.response.data.message || "An error occurred"}`
        );
      } else if (error.request) {
        toast.error("Delete Error: No response received from the server");
      } else {
        toast.error(`Delete Error: ${error.message}`);
      }
    }
  };

  //Arshad Attar Added this function to add data from Resume Data Base and after added in data based delete from Resume Data Base
  //added On Date : 22-11-2024Res
  const deleteResumeDataById = async (candidateId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete-resume-data/${candidateId}`
      );

      if (response.status === 200 || response.status === 204) {
        // toast.success("Candidate Data Transfered Succefully...");
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
        toast.warning("Unable to Transfered Candidate Data");
      }
    } catch (error) {
      console.error("Error while deleting data:", error);
      if (error.response) {
        toast.error(
          `Delete Error: ${error.response.data.message || "An error occurred"}`
        );
      } else if (error.request) {
        toast.error("Delete Error: No response received from the server");
      } else {
        toast.error(`Delete Error: ${error.message}`);
      }
    }
  };
  //Arshad Attar Added This , Now Resume will added Proper in data base.  18-10-2024
  //Start Line 451
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setResumeUploaded(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const chunkSize = 0x8000;
        let base64String = "";

        for (let i = 0; i < byteArray.length; i += chunkSize) {
          base64String += String.fromCharCode.apply(
            null,
            byteArray.subarray(i, i + chunkSize)
          );
        }
        base64String = btoa(base64String);
        setLineUpData((prevState) => {
          if (prevState.resume !== base64String) {
            return {
              ...prevState,
              resume: base64String,
            };
          }
          return prevState;
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };
  //Arshad Attar Added This , Now Resume will added Proper in data base.  18-10-2024
  //Start end Line 480

  // sahil karnekar line 489 to 503 date 15-10-2024
  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setIsOtherLocationSelected(true);
    } else {
      setIsOtherLocationSelected(false);
    }
    setCallingTracker((prevState) => ({
      ...prevState,
      currentLocation: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, currentLocation: "" }));
  };

  // sahil karnekar line 507 to 519 complete method date 21-10-2024
  const handleEducationChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setLineUpData({ ...lineUpData, qualification: "" });
    } else {
      setLineUpData({ ...lineUpData, qualification: value });
    }
    setErrors((prevErrors) => ({ ...prevErrors, qualification: "" }));
  };
  const handleRequirementChange = (e) => {
    const { value } = e.target;
    const selectedRequirement = requirementOptions.find(
      (requirement) => requirement.requirementId === parseInt(value)
    );
    if (selectedRequirement) {
      setCallingTracker((prevState) => ({
        ...prevState,
        requirementId: selectedRequirement.requirementId,
        jobDesignation: selectedRequirement.designation,
        requirementCompany: selectedRequirement.companyName,
        incentive: selectedRequirement.incentive,
      }));
    } else {
      setCallingTracker((prevState) => ({
        ...prevState,
        requirementId: value,
        jobDesignation: "",
        requirementCompany: "",
        incentive: "",
      }));
    }
    setendPoint(selectedRequirement.detailAddress);
    setErrors((prevErrors) => ({ ...prevErrors, requirementId: "" }));
  };

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const updateCurrentCTC = (lakh, thousand) => {
    const lakhValue = parseFloat(lakh) || 0;
    const thousandValue = parseFloat(thousand) || 0;
    const combinedCTC = lakhValue * 100000 + thousandValue * 1000;
    setconvertedCurrentCTC(combinedCTC.toFixed(2));
  };

  const updateExpectedCTC = (lakh, thousand) => {
    const lakhValue = parseFloat(lakh) || 0;
    const thousandValue = parseFloat(thousand) || 0;
    const combinedCTC = lakhValue * 100000 + thousandValue * 1000;
    setconvertedExpectedCTC(combinedCTC.toFixed(2));
  };
  const handleUpdateExpectedCTCLakh = (value) => {
    setLineUpData({ ...lineUpData, expectedCTCLakh: value });
  };

  const handleUpdateExpectedCTCThousand = (value) => {
    setLineUpData({ ...lineUpData, expectedCTCThousand: value });
  };

  // line 612 to 727 added by sahil karnekar upload resume and autofill date 30-10-2024
  let tempData;
  const handleUploadAndSetData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create form data
    const formData = new FormData();
    formData.append("files", file);

    try {
      // Send a POST request to the API
      const response = await fetch(
        `${API_BASE_URL}/fetch-only-date/${employeeId}/${userType}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      tempData = data;
      setResumeResponse(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploadingResumeNewState(false);
    }
  };

  const predefinedLocations = ["Pune City", "PCMC"]; // Add any other options here
  // Utility function to parse and format dateOfBirth
  const formatDateString = (dateString) => {
    if (!dateString || dateString === "DOB not found") return ""; // Handle missing or "DOB not found" cases

    const parsedDate = new Date(dateString);

    // Check if date is valid
    if (isNaN(parsedDate)) {
      console.warn("Invalid date format:", dateString);
      return "";
    }

    // Calculate age based on parsedDate
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    const monthDiff = today.getMonth() - parsedDate.getMonth();
    const dayDiff = today.getDate() - parsedDate.getDate();

    // Adjust age if the birthdate hasn't occurred yet this year
    const adjustedAge =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0) ? age : age - 1;

    // Return empty string if the candidate is under 18
    if (adjustedAge < 18) {
      console.warn("Candidate must be at least 18 years old:", dateString);
      return "";
    }

    // Convert to YYYY-MM-DD format for input type="date"
    return parsedDate.toISOString().split("T")[0];
  };

  const validateGender = (gender) => {
    // Validate gender to be either "Male" or "Female"
    return gender === "Male" || gender === "Female" ? gender : "";
  };
  const setResumeResponse = (data) => {
    // Fields to check in existing state
    const hasExistingData =
      callingTracker.candidateName !== "" ||
      callingTracker.candidateEmail !== "" ||
      callingTracker.currentLocation !== "" ||
      callingTracker.contactNumber !== "" ||
      // lineUpData.extraCertification !== "" ||
      lineUpData.relevantExperience !== "" ||
      lineUpData.companyName !== "" ||
      lineUpData.dateOfBirth !== "" ||
      lineUpData.gender !== "" ||
      lineUpData.qualification !== "";
    // lineUpData.resume;

    const updateFields = () => {
      setCallingTracker((prevState) => ({
        ...prevState,
        candidateName: data.candidateName,
        candidateEmail: data.candidateEmail,
        currentLocation: data.currentLocation,
        contactNumber: `${data.contactNumber}`,
      }));
      setLineUpData((prevState) => ({
        ...prevState,
        // extraCertification: data.extraCertification,
        relevantExperience: data.relevantExperience,
        companyName: data.companyName,
        dateOfBirth: formatDateString(data.dateOfBirth),
        gender: validateGender(data.gender),
        qualification: data.qualification,
        // resume: data.resume,
      }));

      // Check if currentLocation matches a predefined option
      if (!predefinedLocations.includes(data.currentLocation)) {
        setIsOtherLocationSelected(true);
      } else {
        setIsOtherLocationSelected(false);
      }
      setIsConfirmationPending(false);
    };

    if (hasExistingData) {
      // Show confirmation notification
      setIsConfirmationPending(true);
      notification.open({
        message: "Confirm Overwrite",
        description: "Existing data will be replaced. Do you want to proceed?",
        duration: 0, // Keep open until user decides
        btn: (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => {
                setIsConfirmationPending(false);
                updateFields();
                notification.destroy();
              }}
            >
              Yes
            </Button>
            <Button onClick={() => notification.destroy()}>No</Button>
          </div>
        ),
      });
    } else {
      // Directly update fields if no existing data
      updateFields();
    }
  };
  const [displaySameAsContactField, setDisplaySameAsContactField] =
    useState(false);
  const handleDisplaySameAsContactText = () => {
    if (callingTracker.contactNumber !== "") {
      setDisplaySameAsContactField(true);
    }

    if (callingTracker.contactNumber === undefined) {
      setDisplaySameAsContactField(false);
    }
  };
  const copyContactNumber = () => {
    callingTracker.alternateNumber = callingTracker.contactNumber;
  };

  // this fucntion is made by sahil karnekar on date 25-11-2024
  const handleResumeUploadBoth = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(0); // Start progress

    if (file) {
      for (let i = 20; i <= 80; i += 20) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated delay
      }
      await handleUploadAndSetData(e);
      setUploadProgress(100); // Mark upload as complete
      setResumeUploaded(true);
      setUploadingResumeNewState(false);
      setErrorForResumeUrl("");

      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const chunkSize = 0x8000;
        let base64String = "";

        for (let i = 0; i < byteArray.length; i += chunkSize) {
          base64String += String.fromCharCode.apply(
            null,
            byteArray.subarray(i, i + chunkSize)
          );
        }
        base64String = btoa(base64String);
        const base64Resume = `data:application/pdf;base64,${base64String}`;
        setResumeUrl(base64Resume); // Set the base64 URL for the resume
        setLineUpData((prevState) => {
          if (prevState.resume !== base64String) {
            return {
              ...prevState,
              resume: base64String,
            };
          }
          return prevState;
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);

  return (
    <div className="calling-tracker-main">
      {isModalOpen && (
        <div className="view-resume-modal-overlay">
          <div className="view-resume-modal-content">
            {resumeUrl ? (
              <iframe
                src={resumeUrl}
                title="Resume"
                style={{ width: "100%", height: "500px" }}
              ></iframe>
            ) : (
              <p>No resume to display</p>
            )}
            <br></br>
            <center>
              <button
                onClick={() => setIsModalOpen(false)}
                className="calling-tracker-popup-open-btn"
              >
                Close
              </button>
            </center>
          </div>
        </div>
      )}

      <section className="calling-tracker-submain">
        {loading && <Loader />}
        {isFormVisible && (
          <CandidatePresentComponent
            candidateData={candidateData}
            onClose={handleCloseForm}
          />
        )}
        <form onSubmit={handleSubmit}>
          {showConfetti && (
            <Confetti
              width={window.innerWidth * (100 / 100)}
              height={window.innerHeight * (100 / 100)}
              colors={["#f44336", "#f44336", "#f44336", "#f44336"]}
              numberOfPieces={400}
              gravity={0.3}
              wind={0.01}
            />
          )}
          <div className="calling-tracker-form">
            {/* this code line 744 to 766 added by sahil karnekar 30-10-2024 */}
            <div className="calling-tracker-row-white">
              <div
                className="calling-tracker-field"
                style={{
                  justifyContent: "center",
                }}
              >
                <div
                  className="calling-tracker-field-sub-div"
                  style={{
                    width: "auto",
                    fontSize: "14px",
                    justifyContent: "center",
                  }}
                >
                  Great talent won't wait - add them now, hire the best 👉
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Upload Resume</label>
                <div
                  className="calling-tracker-field-sub-div"
                  style={{ display: "block", flexDirection: "row" }}
                >
                  {/* <input
                   style={{ width: "-webkit-fill-available" }}
                   type="file"
                   name="resumeSet"
                   onChange={handleResumeUploadBoth}
                   className="plain-input"
                   placeholder="Upload Resume"
                 /> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <input
                      type="file"
                      name="resume"
                      onChange={handleResumeUploadBoth}
                      accept=".pdf,.doc,.docx"
                      className="plain-input"
                    /> */}
                    <div
                      className="uploadantdc"
                      style={{
                        width: "60%",
                      }}
                    >
                      <Upload
                        accept=".pdf,.doc,.docx"
                        showUploadList={false} // Hide file preview list
                        beforeUpload={async (file) => {
                          setUploadingResumeNewState(true);
                          setDisplayProgress(false);
                          setResumeFileName(file.name);
                          setDisplayProgress(true);
                          setUploadProgress(0);
                          console.log(file);
                          // Create a synthetic event to match input file event structure
                          const syntheticEvent = { target: { files: [file] } };
                          // Call handleResumeUploadBoth function
                          await handleResumeUploadBoth(syntheticEvent);
                          setUploadingResumeNewState(false);
                          return false; // Prevent automatic upload
                        }}
                      >
                        <Button
                          icon={
                            uploadingResumeNewState ? (
                              <img
                                src={uploadingResumeGif}
                                alt="Uploading"
                                style={{ width: 20, height: 20 }}
                              />
                            ) : (
                              <img
                                src={uploadingResumeStatic}
                                alt="Static"
                                style={{ width: 20, height: 20 }}
                              />
                            )
                          }
                        >
                          {resumeFileName.length > 10
                            ? `${resumeFileName.substring(0, 15)}...`
                            : resumeFileName || "Upload Resume"}
                        </Button>
                      </Upload>
                      {displayProgress && (
                        <Progress
                          percent={uploadProgress}
                          strokeWidth={4}
                          size="small"
                          className="customprogressForCallingTracker"
                        />
                      )}
                    </div>

                    {errors.resume && (
                      <div className="error-message">{errors.resume}</div>
                    )}

                    <p
                      className="calling-tracker-popup-open-btn"
                      style={{
                        maxHeight: "30px",
                        width: "76px",
                        textAlign: "center",
                      }}
                    >
                      <i
                        className="fas fa-eye"
                        onClick={() => {
                          if (!resumeUploaded) {
                            setErrorForResumeUrl(
                              "Please upload a resume first."
                            );
                          }
                          if (resumeUrl) {
                            setIsModalOpen(true);
                          } else if (!resumeUrl && initialData.resume) {
                            const base64Resume = `data:application/pdf;base64,${initialData.resume}`;
                            setResumeUrl(base64Resume); // Set the Base64 URL for the resume
                            setIsModalOpen(true); // Open the modal immediately after setting the URL
                          } else {
                            alert("Please upload a resume first.");
                          }
                        }}
                      ></i>
                    </p>
                  </div>
                  {errorForResumeUrl && (
                    <div
                      style={{
                        color: "green",
                      }}
                      className="error-message"
                    >
                      {errorForResumeUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Date & Time:</label>
                <div className="calling-tracker-two-input-container">
                  <div className="calling-tracker-two-input">
                    <input
                      type="text"
                      name="date"
                      value={callingTracker.date}
                      readOnly
                    />
                  </div>
                  <div className="calling-tracker-two-input">
                    <input
                      type="text"
                      id="candidateAddedTime"
                      name="candidateAddedTime"
                      value={candidateAddedTime}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Recruiter Name</label>
                <div
                  className="calling-tracker-two-input-container"
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <div className="calling-tracker-two-input">
                    <input
                      type="text"
                      name="recruiterName"
                      value={loginEmployeeName}
                      readOnly
                      onChange={handleChange}
                      className="plain-input"
                    />
                  </div>

                  <div
                    className="calling-tracker-two-input newpaddingrightinputforhelp"
                    style={{
                      width: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleShow}
                      className="calling-tracker-popup-open-btn"
                    >
                      Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Candidate's Full Name</label>
                <div className="calling-tracker-field-sub-div">
                  {/* line number 684 to 696 added by sahil karnekar date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    <input
                      type="text"
                      name="candidateName"
                      // validation added by sahil karnekar date 19-11-2024
                      value={callingTracker.candidateName}
                      className={`plain-input`}
                      onChange={handleChange}
                      placeholder="Enter Candidate Name"
                      // line 668 added by sahil karnekar date 21-10-2024
                      maxLength="50"
                    />
                    {!callingTracker.candidateName && (
                      <span className="requiredFieldStar">*</span>
                    )}
                  </div>
                  {errors.candidateName && (
                    <div className="error-message">{errors.candidateName}</div>
                  )}
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Candidate's Email</label>
                <div className="calling-tracker-field-sub-div">
                  {/* this line added by sahil date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    {/* <input
                      type="email"
                      name="candidateEmail"
                      value={callingTracker.candidateEmail}
                      onChange={handleChange}
                      className={`plain-input`}
                      placeholder="Enter Candidate Email"
                    /> */}

                    <input
                      type="email"
                      name="candidateEmail"
                      value={callingTracker.candidateEmail}
                      onChange={handleChange}
                      onBlur={handleBlurEmailChange} // Calls API when the user leaves the field
                      className="plain-input"
                      placeholder="Enter Candidate Email"
                    />

                    {/* this line added by sahil date 22-10-2024 */}
                    {!callingTracker.candidateEmail && (
                      <span className="requiredFieldStar">*</span>
                    )}
                  </div>
                  {errors.candidateEmail && (
                    <div className="error-message">{errors.candidateEmail}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Contact Number</label>
                <div className="calling-tracker-field-sub-div">
                  {/* this line added by sahil date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    <PhoneInput
                      placeholder="Enter phone number"
                      name="contactNumber"
                      className="plain-input"
                      value={callingTracker.contactNumber}
                      onChange={(value) =>
                        handlePhoneNumberChange(value, "contactNumber")
                      }
                      defaultCountry="IN"
                      // sahil karnekar line 712
                      maxLength={20}
                    />
                    {/* this line added by sahil date 22-10-2024 */}
                    {!callingTracker.contactNumber && (
                      <span className="requiredFieldStar">*</span>
                    )}
                  </div>
                  {errors.contactNumber && (
                    <div className="error-message">{errors.contactNumber}</div>
                  )}
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Whatsapp Number</label>

                <div
                  className="calling-tracker-field-sub-div"
                  onClick={handleDisplaySameAsContactText}
                >
                  <PhoneInput
                    placeholder="Enter phone number"
                    name="alternateNumber"
                    className="plain-input"
                    value={callingTracker.alternateNumber}
                    onChange={(value) => {
                      setDisplaySameAsContactField(false);
                      handlePhoneNumberChange(value, "alternateNumber");
                    }}
                    defaultCountry="IN"
                    // sahil karnekar line 732
                    maxLength={20}
                  />
                  {displaySameAsContactField && (
                    <div className="inputsameascontact">
                      <input
                        type="checkbox"
                        name="copyContactNumber"
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (callingTracker.contactNumber) {
                              callingTracker.alternateNumber =
                                callingTracker.contactNumber;
                            }
                          } else {
                            callingTracker.alternateNumber = "";
                          }
                        }}
                      />
                      <span className="sameascontactnumbersize">
                        Same As Contact Number
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Source Name</label>
                <div className="calling-tracker-field-sub-div">
                  {/* this line added by sahil date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    <select
                      className={`plain-input`}
                      name="sourceName"
                      value={
                        callingTracker.sourceName === "" ||
                        callingTracker.sourceName === "LinkedIn" ||
                        callingTracker.sourceName === "Naukri" ||
                        callingTracker.sourceName === "Indeed" ||
                        callingTracker.sourceName === "Times" ||
                        callingTracker.sourceName === "Social Media" ||
                        callingTracker.sourceName === "Company Page" ||
                        callingTracker.sourceName === "Excel" ||
                        callingTracker.sourceName === "Friends" ||
                        callingTracker.sourceName === "others"
                          ? callingTracker.sourceName
                          : "others"
                      }
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Source Name
                      </option>
                      <option value="LinkedIn">linkedIn</option>
                      <option value="Naukri">Naukri</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Times">Times</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Company Page">Company Page</option>
                      <option value="Excel">Excel</option>
                      <option value="Friends">Friends</option>
                      <option value="others">Others</option>
                    </select>

                    {displaySourceOthersInput && (
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="sourceNameOthers"
                        id=""
                        placeholder="Enter Source Name"
                        onChange={handleSourceNameOthers}
                        maxLength={50}
                      />
                    )}

                    {/* this line added by sahil date 22-10-2024 */}
                    {(!callingTracker.sourceName ||
                      callingTracker.sourceName === "others") && (
                      <span className="requiredFieldStar">*</span>
                    )}
                  </div>
                  {errors.sourceName && (
                    <div className="error-message">{errors.sourceName}</div>
                  )}
                </div>
              </div>

              <div className="calling-tracker-field">
                <label>Job Id</label>
                <div className="calling-tracker-two-input-container newalignstyleforincentivesandjdid">
                  <div className="calling-tracker-two-input">
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <select
                        id="requirementId"
                        name="requirementId"
                        value={callingTracker.requirementId}
                        onChange={handleRequirementChange}
                        style={{ width: "inherit" }}
                      >
                        <option value="" disabled>
                          Select Job Id
                        </option>
                        {requirementOptions.map((option) => (
                          <option
                            key={option.requirementId}
                            value={option.requirementId}
                          >
                            {option.requirementId} - {option.designation}
                          </option>
                        ))}
                      </select>

                      {/* this line added by sahil date 22-10-2024 */}
                      {!callingTracker.requirementId && (
                        <span className="requiredFieldStar">*</span>
                      )}
                    </div>

                    {errors.requirementId && (
                      <div className="error-message">
                        {errors.requirementId}
                      </div>
                    )}
                  </div>
                  <div className="calling-tracker-two-input newhightforincentivesdiv">
                    <input
                      className="nighlightincentivesinputnew"
                      placeholder="Your Incentive"
                      value={callingTracker.incentive}
                      type="text"
                      onChange={handleIncentiveChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Applying For Position</label>
                <div className="calling-tracker-two-input-container">
                  <input
                    type="text"
                    id="jobDesignation"
                    name="jobDesignation"
                    className="calling-tracker-two-input"
                    value={callingTracker.jobDesignation}
                    placeholder="Enter Position"
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    id="requirementCompany"
                    name="requirementCompany"
                    className="calling-tracker-two-input"
                    value={callingTracker.requirementCompany}
                    readOnly
                  />
                </div>
              </div>

              <div className="calling-tracker-field">
                <label style={{ color: "gray" }}>Current Location</label>
                <div className="calling-tracker-two-input-container">
                  {/* sahil karnekar line 831 to 865 */}
                  <div className="calling-tracker-two-input">
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <select
                        name="currentLocation"
                        value={
                          callingTracker.currentLocation === "Pune City"
                            ? callingTracker.currentLocation
                            : callingTracker.currentLocation === "PCMC"
                            ? callingTracker.currentLocation
                            : ""
                        }
                        onChange={handleLocationChange}
                        style={{ width: "200px" }}
                      >
                        <option value="" style={{ color: "gray" }} disabled>
                          Select Location
                        </option>
                        <option value="Pune City">Pune City</option>
                        <option value="PCMC">PCMC</option>
                        {/* line number 841 added by sahil date : 15-10-2024 */}
                        <option value="">Other</option>
                      </select>
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !callingTracker.currentLocation && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {isOtherLocationSelected && (
                      <input
                        type="text"
                        name="currentLocation"
                        value={callingTracker.currentLocation}
                        onChange={(e) => {
                          setCallingTracker({
                            ...callingTracker,
                            currentLocation: e.target.value,
                          });
                          setErrors((prev) => {
                            const { currentLocation, ...rest } = prev;
                            return rest;
                          });
                        }}
                        placeholder="Enter your location"
                      />
                    )}

                    {/* Display error message if any */}
                    {errors.currentLocation && (
                      <div className="error-message">
                        {errors.currentLocation}
                      </div>
                    )}
                  </div>
                  <div className="calling-tracker-two-input">
                    <input
                      className="applyborderforinputs"
                      type="text"
                      name="fullAddress"
                      placeholder="Full Address"
                      value={callingTracker.fullAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* From Here */}

            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Calling Remark</label>
                <div className="calling-tracker-field-sub-div">
                  {/* this line added by sahil date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    <select
                      className="plain-input"
                      name="callingFeedback"
                      // value={callingTracker.callingFeedback}
                      value={
                        callingTracker.callingFeedback === "" ||
                        callingTracker.callingFeedback === "Call Done" ||
                        callingTracker.callingFeedback ===
                          "Asked for Call Back" ||
                        callingTracker.callingFeedback === "No Answer" ||
                        callingTracker.callingFeedback === "Network Issue" ||
                        callingTracker.callingFeedback === "Invalid Number" ||
                        callingTracker.callingFeedback ===
                          "Need to call back" ||
                        callingTracker.callingFeedback ===
                          "Do not call again" ||
                        callingTracker.callingFeedback === "others"
                          ? callingTracker.callingFeedback
                          : "others"
                      }
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Feedback
                      </option>
                      <option value="Call Done">Call Done</option>
                      <option value="Asked for Call Back">
                        Asked for Call Back
                      </option>
                      <option value="No Answer">No Answer</option>
                      {/* <option value="Call Disconnected by Candidate">
                     Call Disconnected by Candidate
                   </option> */}
                      <option value="Network Issue">Network Issue</option>
                      <option value="Invalid Number">Invalid Number</option>
                      <option value="Need to call back">
                        Need to call back
                      </option>
                      <option value="Do not call again">
                        Do not call again
                      </option>
                      <option value="others">Others</option>
                      {/* <option value="Other">Other</option> */}
                    </select>
                    {displayCallingRemarkOthersInput && (
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="callingFeedbackOthers"
                        id=""
                        placeholder="Enter Calling Feedback"
                        onChange={handleCallingFeedBackOthers}
                        maxLength={50}
                      />
                    )}
                    {/* this line added by sahil date 22-10-2024 */}

                    {(!callingTracker.callingFeedback ||
                      callingTracker.callingFeedback === "others") && (
                      <span className="requiredFieldStar">*</span>
                    )}
                  </div>
                  {errors.callingFeedback && (
                    <div className="error-message">
                      {errors.callingFeedback}
                    </div>
                  )}
                </div>
              </div>

              <div className="calling-tracker-field">
                <label>Date Of Birth</label>
                <div className="calling-check-box-main-container">
                  <div className="calling-tracker-two-input">
                    {/* line number 916 to 930 added by sahil karnekar date : 15-10-2024 */}

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        lineUpData.dateOfBirth === "DOB not found"
                          ? "" // Provide default value if "DOB not found"
                          : lineUpData.dateOfBirth // Use the actual date if it's present
                      }
                      onChange={handleLineUpChange}
                      max={maxDate}
                    />

                    {errorForDOB && (
                      <div className="error-message">{errorForDOB}</div>
                    )}
                  </div>

                  <div className="calling-check-box-container">
                    <div className="callingTracker-male-div">
                      <div className="calling-check-box">
                        <input
                          type="checkbox"
                          name="Male"
                          // added line number 940 by sahil karnekar date : 15-10-2024
                          value="Male"
                          className="gender"
                          checked={lineUpData.gender === "Male"}
                          onChange={(e) =>
                            setLineUpData({
                              ...lineUpData,
                              gender: e.target.value,
                            })
                          }
                        />
                        <span style={{ paddingLeft: "5px" }}>Male</span>
                      </div>
                    </div>

                    <div className="callingTracker-male-div">
                      <div className="calling-check-box">
                        <input
                          type="checkbox"
                          name="Female"
                          value="Female"
                          className="gender"
                          style={{ paddingLeft: "auto" }}
                          checked={lineUpData.gender === "Female"}
                          onChange={(e) =>
                            setLineUpData({
                              ...lineUpData,
                              gender: e.target.value,
                            })
                          }
                        />
                        <span style={{ paddingLeft: "5px" }}>Female</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Call Summary</label>
                <div className="calling-tracker-field-sub-div">
                  <input
                    type="text"
                    name="feedBack"
                    value={lineUpData.feedBack}
                    onChange={handleLineUpChange}
                    className="plain-input"
                    placeholder="Enter Call Summary"
                  />
                </div>
              </div>

              {/* Rajlaxmi Jagadale Some Changes of that field (YOP) Date 24-01-2225 */}
              <div className="calling-tracker-field">
                <label>Education</label>
                <div className="calling-tracker-two-input-container">
                  {/* sahil karnekar line 966 to 1442 */}
                  <div className="calling-tracker-two-input">
                    <div className="setRequiredStarDiv">
                      <input
                        className="applyborderforinputs"
                        list="educationListDropDown"
                        name="qualification"
                        type="text"
                        value={lineUpData.qualification}
                        onChange={handleEducationChange}
                        placeholder="Search...."
                        //  {/* this line added by sahil date 22-10-2024 */}
                        style={{ width: "inherit" }}
                      />
                      <datalist id="educationListDropDown">
                        <option value="">Select</option>
                        <option value="Other">Other</option>
                        <option value="10th">10th</option>
                        <option value="12th">12 th</option>
                        <option value="ITI">ITI</option>
                        <option value="diploma in CS">
                          Diploma in Computer science
                        </option>
                        <option value="Degree In CS">
                          BTech in Computer Science
                        </option>
                        <option value="M-Tech In CS">
                          MTech in Computer Science
                        </option>
                        <option value="PhD ">PhD</option>
                        <option value="BSC">BSC in chemestry</option>
                        <option value="MSC">MSC </option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="Associate of Arts (AA)">
                          Associate of Arts (AA)
                        </option>
                        <option value="Associate of Science (AS)">
                          Associate of Science (AS)
                        </option>
                        <option value="Associate of Applied Science (AAS)">
                          Associate of Applied Science (AAS)
                        </option>
                        <option value="Associate of Fine Arts (AFA)">
                          Associate of Fine Arts (AFA)
                        </option>
                        <option value="Associate of Business Administration (ABA)">
                          Associate of Business Administration (ABA)
                        </option>
                        <option value="Associate of Engineering (AE)">
                          Associate of Engineering (AE)
                        </option>
                        <option value="Associate of Nursing (AN)">
                          Associate of Nursing (AN)
                        </option>
                        <option value="Associate of General Studies (AGS)">
                          Associate of General Studies (AGS)
                        </option>
                        <option value="Associate of Occupational Studies (AOS)">
                          Associate of Occupational Studies (AOS)
                        </option>
                        <option value="Associate of Information Technology (AIT)">
                          Associate of Information Technology (AIT)
                        </option>
                        <option value="Bachelor's Degrees">
                          Bachelor's Degrees
                        </option>
                        <option value="Bachelor of Arts (BA)">
                          Bachelor of Arts (BA)
                        </option>
                        <option value="Bachelor of Science (BS)">
                          Bachelor of Science (BS)
                        </option>
                        <option value="Bachelor of Fine Arts (BFA)">
                          Bachelor of Fine Arts (BFA)
                        </option>
                        <option value="Bachelor of Business Administration (BBA)">
                          Bachelor of Business Administration (BBA)
                        </option>
                        <option value="Bachelor of Engineering (BEng)">
                          Bachelor of Engineering (BEng)
                        </option>
                        <option value="Bachelor of Technology (BTech)">
                          Bachelor of Technology (BTech)
                        </option>
                        <option value="Bachelor of Education (BEd)">
                          Bachelor of Education (BEd)
                        </option>
                        <option value="Bachelor of Nursing (BN)">
                          Bachelor of Nursing (BN)
                        </option>
                        <option value="Bachelor of Social Work (BSW)">
                          Bachelor of Social Work (BSW)
                        </option>
                        <option value="Bachelor of Music (BM)">
                          Bachelor of Music (BM)
                        </option>
                        <option value="Bachelor of Architecture (BArch)">
                          Bachelor of Architecture (BArch)
                        </option>
                        <option value="Bachelor of Science in Nursing (BSN)">
                          Bachelor of Science in Nursing (BSN)
                        </option>
                        <option value="Bachelor of Computer Science (BCS)">
                          Bachelor of Computer Science (BCS)
                        </option>
                        <option value="Bachelor of Laws (LLB)">
                          Bachelor of Laws (LLB)
                        </option>
                        <option value="Bachelor of Medicine, Bachelor of Surgery (MBBS)">
                          Bachelor of Medicine, Bachelor of Surgery (MBBS)
                        </option>
                        <option value="Bachelor of Dental Surgery (BDS)">
                          Bachelor of Dental Surgery (BDS)
                        </option>
                        <option value="Bachelor of Pharmacy (BPharm)">
                          Bachelor of Pharmacy (BPharm)
                        </option>
                        <option value="Bachelor of Public Health (BPH)">
                          Bachelor of Public Health (BPH)
                        </option>
                        <option value="Bachelor of Environmental Science (BES)">
                          Bachelor of Environmental Science (BES)
                        </option>
                        <option value="Bachelor of Communication (BComm)">
                          Bachelor of Communication (BComm)
                        </option>
                        <option value="Bachelor of Information Technology (BIT)">
                          Bachelor of Information Technology (BIT)
                        </option>
                        <option value="Bachelor of Science in Engineering (BSE)">
                          Bachelor of Science in Engineering (BSE)
                        </option>
                        <option value="Bachelor of Business (BBus)">
                          Bachelor of Business (BBus)
                        </option>
                        <option value="Bachelor of Design (BDes)">
                          Bachelor of Design (BDes)
                        </option>
                        <option value="Bachelor of Journalism (BJ)">
                          Bachelor of Journalism (BJ)
                        </option>
                        <option value="Bachelor of Applied Science (BAS)">
                          Bachelor of Applied Science (BAS)
                        </option>
                        <option value="Bachelor of Agriculture (BAgri)">
                          Bachelor of Agriculture (BAgri)
                        </option>
                        <option value="Bachelor of Veterinary Science (BVSc)">
                          Bachelor of Veterinary Science (BVSc)
                        </option>
                        <option value="Bachelor of Physiotherapy (BPT)">
                          Bachelor of Physiotherapy (BPT)
                        </option>
                        <option value="Master's Degrees">
                          Master's Degrees
                        </option>
                        <option value="Master of Arts (MA)">
                          Master of Arts (MA)
                        </option>
                        <option value="Master of Science (MS or MSc)">
                          Master of Science (MS or MSc)
                        </option>
                        <option value="Master of Business Administration (MBA)">
                          Master of Business Administration (MBA)
                        </option>
                        <option value="Master of Fine Arts (MFA)">
                          Master of Fine Arts (MFA)
                        </option>
                        <option value="Master of Education (MEd)">
                          Master of Education (MEd)
                        </option>
                        <option value="Master of Engineering (MEng)">
                          Master of Engineering (MEng)
                        </option>
                        <option value="Master of Technology (MTech)">
                          Master of Technology (MTech)
                        </option>
                        <option value="Master of Social Work (MSW)">
                          Master of Social Work (MSW)
                        </option>
                        <option value="Master of Music (MM)">
                          Master of Music (MM)
                        </option>
                        <option value="Master of Architecture (MArch)">
                          Master of Architecture (MArch)
                        </option>
                        <option value="Master of Public Health (MPH)">
                          Master of Public Health (MPH)
                        </option>
                        <option value="Master of Laws (LLM)">
                          Master of Laws (LLM)
                        </option>
                        <option value="Master of Computer Applications (MCA)">
                          Master of Computer Applications (MCA)
                        </option>
                        <option value="Master of Science in Nursing (MSN)">
                          Master of Science in Nursing (MSN)
                        </option>
                        <option value="Master of Library Science (MLS)">
                          Master of Library Science (MLS)
                        </option>
                        <option value="Master of Public Administration (MPA)">
                          Master of Public Administration (MPA)
                        </option>
                        <option value="Master of Philosophy (MPhil)">
                          Master of Philosophy (MPhil)
                        </option>
                        <option value="Master of Professional Studies (MPS)">
                          Master of Professional Studies (MPS)
                        </option>
                        <option value="Master of Design (MDes)">
                          Master of Design (MDes)
                        </option>
                        <option value="Master of Journalism (MJ)">
                          Master of Journalism (MJ)
                        </option>
                        <option value="Master of Environmental Science (MES)">
                          Master of Environmental Science (MES)
                        </option>
                        <option value="Master of Communication (MComm)">
                          Master of Communication (MComm)
                        </option>
                        <option value="Master of International Business (MIB)">
                          Master of International Business (MIB)
                        </option>
                        <option value="Master of Finance (MFin)">
                          Master of Finance (MFin)
                        </option>
                        <option value="Master of Management (MMgt)">
                          Master of Management (MMgt)
                        </option>
                        <option value="Master of Science in Engineering (MSE)">
                          Master of Science in Engineering (MSE)
                        </option>
                        <option value="Master of Health Administration (MHA)">
                          Master of Health Administration (MHA)
                        </option>
                        <option value="Master of Urban Planning (MUP)">
                          Master of Urban Planning (MUP)
                        </option>
                        <option value="Master of Data Science (MDS)">
                          Master of Data Science (MDS)
                        </option>
                        <option value="Doctoral Degrees">
                          Doctoral Degrees
                        </option>
                        <option value="Doctor of Philosophy (PhD)">
                          Doctor of Philosophy (PhD)
                        </option>
                        <option value="Doctor of Medicine (MD)">
                          Doctor of Medicine (MD)
                        </option>
                        <option value="Doctor of Education (EdD)">
                          Doctor of Education (EdD)
                        </option>
                        <option value="Doctor of Business Administration (DBA)">
                          Doctor of Business Administration (DBA)
                        </option>
                        <option value="Doctor of Dental Surgery (DDS)">
                          Doctor of Dental Surgery (DDS)
                        </option>
                        <option value="Doctor of Dental Medicine (DMD)">
                          Doctor of Dental Medicine (DMD)
                        </option>
                        <option value="Doctor of Veterinary Medicine (DVM)">
                          Doctor of Veterinary Medicine (DVM)
                        </option>
                        <option value="Doctor of Nursing Practice (DNP)">
                          Doctor of Nursing Practice (DNP)
                        </option>
                        <option value="Doctor of Psychology (PsyD)">
                          Doctor of Psychology (PsyD)
                        </option>
                        <option value="Juris Doctor (JD)">
                          Juris Doctor (JD)
                        </option>
                        <option value="Doctor of Public Health (DrPH)">
                          Doctor of Public Health (DrPH)
                        </option>
                        <option value="Doctor of Pharmacy (PharmD)">
                          Doctor of Pharmacy (PharmD)
                        </option>
                        <option value="Doctor of Physical Therapy (DPT)">
                          Doctor of Physical Therapy (DPT)
                        </option>
                        <option value="Doctor of Engineering (DEng or DScEng)">
                          Doctor of Engineering (DEng or DScEng)
                        </option>
                        <option value="Doctor of Science (DSc)">
                          Doctor of Science (DSc)
                        </option>
                        <option value="Doctor of Musical Arts (DMA)">
                          Doctor of Musical Arts (DMA)
                        </option>
                        <option value="Doctor of Social Work (DSW)">
                          Doctor of Social Work (DSW)
                        </option>
                        <option value="Doctor of Information Technology (DIT)">
                          Doctor of Information Technology (DIT)
                        </option>
                        <option value="Doctor of Health Science (DHSc)">
                          Doctor of Health Science (DHSc)
                        </option>
                        <option value="Doctor of Public Administration (DPA)">
                          Doctor of Public Administration (DPA)
                        </option>
                        <option value="Diplomas and Certificates">
                          Diplomas and Certificates
                        </option>
                        <option value="Diploma in Engineering">
                          Diploma in Engineering
                        </option>
                        <option value="Diploma in Nursing">
                          Diploma in Nursing
                        </option>
                        <option value="Diploma in Education">
                          Diploma in Education
                        </option>
                        <option value="Diploma in Business Studies">
                          Diploma in Business Studies
                        </option>
                        <option value="Diploma in Computer Applications">
                          Diploma in Computer Applications
                        </option>
                        <option value="Diploma in Culinary Arts">
                          Diploma in Culinary Arts
                        </option>
                        <option value="Diploma in Graphic Design">
                          Diploma in Graphic Design
                        </option>
                        <option value="Diploma in Information Technology">
                          Diploma in Information Technology
                        </option>
                        <option value="Diploma in Pharmacy">
                          Diploma in Pharmacy
                        </option>
                        <option value="Diploma in Accounting">
                          Diploma in Accounting
                        </option>
                        <option value="Diploma in Marketing">
                          Diploma in Marketing
                        </option>
                        <option value="Diploma in Hospitality Management">
                          Diploma in Hospitality Management
                        </option>
                        <option value="Diploma in Fashion Design">
                          Diploma in Fashion Design
                        </option>
                        <option value="Diploma in Project Management">
                          Diploma in Project Management
                        </option>
                        <option value="Diploma in Electrical Engineering">
                          Diploma in Electrical Engineering
                        </option>
                        <option value="Diploma in Mechanical Engineering">
                          Diploma in Mechanical Engineering
                        </option>
                        <option value="Diploma in Civil Engineering">
                          Diploma in Civil Engineering
                        </option>
                        <option value="Diploma in Health Sciences">
                          Diploma in Health Sciences
                        </option>
                        <option value="Diploma in Environmental Science">
                          Diploma in Environmental Science
                        </option>
                        <option value="Diploma in Journalism">
                          Diploma in Journalism
                        </option>
                        <option value="Diploma in Social Work">
                          Diploma in Social Work
                        </option>
                        <option value="Diploma in Early Childhood Education">
                          Diploma in Early Childhood Education
                        </option>
                        <option value="Diploma in Interior Design">
                          Diploma in Interior Design
                        </option>
                        <option value="Diploma in Event Management">
                          Diploma in Event Management
                        </option>
                        <option value="Diploma in Human Resource Management">
                          Diploma in Human Resource Management
                        </option>
                        <option value="Diploma in Digital Marketing">
                          Diploma in Digital Marketing
                        </option>
                        <option value="Diploma in Financial Management">
                          Diploma in Financial Management
                        </option>
                        <option value="Diploma in Logistics and Supply Chain Management">
                          Diploma in Logistics and Supply Chain Management
                        </option>
                        <option value="Diploma in Biotechnology">
                          Diploma in Biotechnology
                        </option>
                        <option value="Diploma in Tourism Management">
                          Diploma in Tourism Management
                        </option>
                        <option value="Diploma in Public Relations">
                          Diploma in Public Relations
                        </option>
                        <option value="Diploma in Web Development">
                          Diploma in Web Development
                        </option>
                        <option value="Diploma in Film and Television Production">
                          Diploma in Film and Television Production
                        </option>
                        <option value="Diploma in Software Engineering">
                          Diploma in Software Engineering
                        </option>
                        <option value="Diploma in Agriculture">
                          Diploma in Agriculture
                        </option>
                        <option value="Diploma in Cybersecurity">
                          Diploma in Cybersecurity
                        </option>
                        <option value="Diploma in Data Science">
                          Diploma in Data Science
                        </option>
                        <option value="Diploma in Artificial Intelligence">
                          Diploma in Artificial Intelligence
                        </option>
                      </datalist>

                      {/* sahil karnekar */}
                      {/* this line added by sahil date 22-10-2024 */}

                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.qualification && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errors.qualification && (
                      <div className="error-message error-two-input-box">
                        {errors.qualification}
                      </div>
                    )}
                  </div>
                  {/* Rajlaxmi Jagadle Added New div YOP */}

                  <div className="calling-tracker-two-input">
                    <div className="setRequiredStarDiv">
                      {/* sahil karnekar line 1376 to 1420 */}
                      <input
                        className="applyborderforinputs"
                        type="text"
                        min="1947"
                        name="yearOfPassing"
                        placeholder="YOP"
                        value={lineUpData.yearOfPassing}
                        onChange={(e) => {
                          const value = e.target.value;
                          const currentYear = new Date().getFullYear();
                          const maxYear = currentYear + 2;

                          if (value === "") {
                            setErrorForYOP("");
                          } else if (value < 1947 || value > maxYear) {
                            setErrorForYOP(
                              `YOP should be between 1947 and ${maxYear}`
                            );
                          } else {
                            setErrorForYOP("");
                          }

                          if (/^\d{0,4}$/.test(value)) {
                            setLineUpData({
                              ...lineUpData,
                              yearOfPassing: value,
                            });
                          }
                        }}
                        style={{ width: "inherit" }}
                      />
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.yearOfPassing && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errorForYOP && (
                      <div className="error-message error-two-input-box">
                        {errorForYOP}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Notice Period</label>
                <div
                  style={{ display: "flex", flexDirection: "row" }}
                  className="calling-tracker-field-sub-div"
                >
                  {/* this lines commented by sahil karnekar on date 25-11-2024 */}
                  {/* <input
                   type="file"
                   name="resume"
                   onChange={handleResumeUploadBoth}
                   accept=".pdf,.doc,.docx"
                   className="plain-input"
                 />
                 {resumeUploaded && (
                   <FontAwesomeIcon
                     icon={faCheckCircle}
                     style={{
                       color: "green",
                       marginLeft: "3px",
                       marginTop: "5px",
                       fontSize: "22px",
                     }}
                   />
                 )}
                 {errors.resume && (
                   <div className="error-message">{errors.resume}</div>
                 )} */}
                  {/* line 1812 to 1846 added by sahil karnekar on date 25-11-2024 */}
                  <div
                    className="calling-tracker-two-input"
                    style={{
                      width: "-webkit-fill-available",
                      marginRight: "40px",
                    }}
                  >
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <input
                        type="text"
                        name="noticePeriod"
                        placeholder="Enter Notice Period"
                        value={lineUpData.noticePeriod}
                        onChange={handleLineUpChange}
                        min="0"
                        max="90"
                        //  {/* this line added by sahil date 22-10-2024 */}
                        style={{ width: "inherit" }}
                      />
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.noticePeriod && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {/* sahil karnekar line 1581 to 1585  */}
                    {errors.noticePeriod && (
                      <div className="error-message">
                        {errors.noticePeriod || errors.noticePeriod}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Currently Working</label>
                <div className="calling-tracker-field-sub-div">
                  <Radio.Group
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                    name="extraCertification"
                    value={lineUpData.extraCertification}
                    onChange={(e) =>
                      setLineUpData({
                        ...lineUpData,
                        extraCertification: e.target.value,
                      })
                    }
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className=" calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Current Company</label>
                <div className="calling-tracker-field-sub-div">
                  <input
                    type="text"
                    name="companyName  "
                    placeholder="Current company"
                    value={lineUpData.companyName}
                    onChange={(e) =>
                      setLineUpData({
                        ...lineUpData,
                        companyName: e.target.value,
                      })
                    }
                    className="plain-input"
                  />
                </div>
              </div>

              <div className="calling-tracker-field">
                <label>Total Experience</label>
                <div className="calling-tracker-two-input-container">
                  <div className="calling-tracker-two-input">
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="experienceYear"
                        value={lineUpData.experienceYear}
                        onChange={handleLineUpChange}
                        placeholder="Years"
                        maxLength="2"
                        //  {/* this line added by sahil date 22-10-2024 */}
                        style={{ width: "inherit" }}
                      />
                      {lineUpData.experienceYear && (
                        <span className="addtrnaslateproptospan">Years</span>
                      )}

                      {/* sahil karnekar line 1523 to 1527 */}
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.experienceYear && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errors.experienceYear && (
                      <div className="error-message error-two-input-box">
                        {errors.experienceYear}
                      </div>
                    )}
                  </div>
                  <div className="calling-tracker-two-input">
                    {/* sahil karnekar line 1531 to 1540 */}
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="experienceMonth"
                        value={lineUpData.experienceMonth}
                        onChange={handleLineUpChange}
                        placeholder="Months"
                        style={{ width: "inherit" }}
                        maxLength="2"
                        // line number 1563 added by sahil karnekar date : 15-10-2024
                        min="0"
                        max="11"
                        //  {/* this line added by sahil date 22-10-2024 */}
                      />
                      {lineUpData.experienceMonth && (
                        <span className="addtrnaslateproptospanForMonths">
                          Months
                        </span>
                      )}
                      {/* sahil karnekar line 1542 to 1546 */}
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.experienceMonth && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errors.experienceMonth && (
                      <div className="error-message error-two-input-box">
                        {errors.experienceMonth}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Relevant Experience</label>
                <div className="calling-tracker-two-input-container">
                  <div
                    className="calling-tracker-two-input"
                    style={{
                      width: "-webkit-fill-available",
                      marginRight: "43px",
                      marginLeft: "4px",
                    }}
                  >
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <input
                        type="text"
                        name="relevantExperience"
                        value={lineUpData.relevantExperience}
                        onChange={handleLineUpChange}
                        placeholder="Enter Relevant Experience"
                        //  {/* this line added by sahil date 22-10-2024 */}
                        style={{ width: "inherit" }}
                      />
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.relevantExperience && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errors.relevantExperience && (
                      <div className="error-message">
                        {errors.relevantExperience || errors.relevantExperience}
                      </div>
                    )}
                  </div>

                  {/* this lines commened by sahil karnekar date 25-11-2024 */}

                  {/* this lines commented by sahil karnekar on date 25-11-2024 to move the notice period input */}
                  {/* <div className="calling-tracker-two-input"> */}
                  {/* this line added by sahil date 22-10-2024 */}
                  {/* <div className="setRequiredStarDiv"> */}
                  {/* <input
                       type="text"
                       name="noticePeriod"
                       placeholder="Notice Period"
                       value={lineUpData.noticePeriod}
                       onChange={handleLineUpChange}
                       min="0"
                       max="90" */}
                  {/* //  this line added by sahil date 22-10-2024 */}
                  {/* // style={{ width: "inherit" }} */}
                  {/* // /> */}
                  {/* this line added by sahil date 22-10-2024 */}
                  {/* {callingTracker.selectYesOrNo === "Interested" &&
                       !lineUpData.noticePeriod && (
                         <span className="requiredFieldStar">*</span>
                       )} */}
                  {/* </div> */}
                  {/* sahil karnekar line 1581 to 1585 
                   {errors.noticePeriod && (
                     <div className="error-message">
                       {errors.noticePeriod || errors.noticePeriod}
                     </div>
                   )} */}
                  {/* </div> */}
                </div>
              </div>

              <div className="calling-tracker-field">
                <label>Communication Rating </label>
                <div className="calling-tracker-field-sub-div">
                  {/* this line added by sahil date 22-10-2024 */}
                  <div className="setRequiredStarDiv">
                    {/* <input
                      type="text"
                      name="communicationRating"
                      value={callingTracker.communicationRating}
                      onChange={handleChange}
                      className="plain-input"
                      placeholder="Communication Rating"
                    /> */}

                    {/* <Rate
tooltips={desc} value={callingTracker.communicationRating} 
 onChange={handleRatingsChange} 
 allowHalf
/> */}

                    <select
                      className="plain-input setwidthandmarginforratings"
                      name="communicationRating"
                      value={callingTracker.communicationRating}
                      onChange={handleRatingsChange1}
                    >
                      <option value="">Select Rating</option>
                      {[...Array(10)].map((_, index) => {
                        const rating = (index + 1) * 0.5;

                        // Assign unique tags to each rating
                        const tags = [
                          "Very Poor", // 0.5
                          "Poor", // 1.0
                          "Below Average", // 1.5
                          "Average", // 2.0
                          "Fair", // 2.5
                          "Good", // 3.0
                          "Very Good", // 3.5
                          "Excellent", // 4.0
                          "Outstanding", // 4.5
                          "Perfect", // 5.0
                        ];

                        return (
                          <option key={rating} value={`${rating}`}>
                            {rating.toFixed(1)} - {tags[index]}
                          </option>
                        );
                      })}
                    </select>

                    <span className="ml-5">Out Of 5</span>

                    {/* this line added by sahil date 22-10-2024 */}
                    {callingTracker.selectYesOrNo === "Interested" &&
                      !callingTracker.communicationRating && (
                        <span className="requiredFieldStar">*</span>
                      )}
                  </div>
                  {errors.communicationRating && (
                    <div className="error-message error-two-input-box">
                      {errors.communicationRating}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Current CTC (LPA)</label>
                <div className="calling-tracker-two-input-container setDisplayBlockForctcs">
                  <div className="wrapdivforctcs">
                    <div className="calling-tracker-two-input">
                      {/* this line added by sahil date 22-10-2024 */}
                      <div className="setRequiredStarDiv">
                        <input
                          className="applyborderforinputs"
                          type="text"
                          name="currentCTCLakh"
                          value={lineUpData.currentCTCLakh}
                          onChange={handleLineUpChange}
                          placeholder="Lakh"
                          maxLength="2"
                          pattern="\d*"
                          //  {/* this line added by sahil date 22-10-2024 */}
                          style={{ width: "inherit" }}
                        />
                        {/* this line added by sahil date 22-10-2024 */}
                        {callingTracker.selectYesOrNo === "Interested" &&
                          !lineUpData.currentCTCLakh && (
                            <span className="requiredFieldStar">*</span>
                          )}
                      </div>
                      {errors.currentCTCLakh && (
                        <div className="error-message error-two-input-box">
                          {errors.currentCTCLakh}
                        </div>
                      )}
                    </div>
                    <div className="calling-tracker-two-input">
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="currentCTCThousand"
                        value={lineUpData.currentCTCThousand}
                        onChange={handleLineUpChange}
                        placeholder="Thousand"
                        maxLength="2"
                        pattern="\d*"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  {(lineUpData.currentCTCLakh ||
                    lineUpData.currentCTCThousand) && (
                    <span>
                      {convertNumberToWords(
                        lineUpData.currentCTCLakh,
                        lineUpData.currentCTCThousand
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Expected CTC (LPA)</label>
                <div className="calling-tracker-two-input-container setDisplayBlockForctcs">
                  <div className="wrapdivforctcs">
                    <div className="calling-tracker-two-input">
                      {/* this line added by sahil date 22-10-2024 */}
                      <div className="setRequiredStarDiv">
                        <input
                          className="applyborderforinputs"
                          type="text"
                          name="expectedCTCLakh"
                          value={lineUpData.expectedCTCLakh}
                          onChange={handleLineUpChange}
                          placeholder="Lakh"
                          maxLength="2"
                          pattern="\d*"
                          //  {/* this line added by sahil date 22-10-2024 */}
                          style={{ width: "inherit" }}
                        />
                        {/* this line added by sahil date 22-10-2024 */}
                        {callingTracker.selectYesOrNo === "Interested" &&
                          !lineUpData.expectedCTCLakh && (
                            <span className="requiredFieldStar">*</span>
                          )}
                      </div>
                      {errors.expectedCTCLakh && (
                        <div className="error-message error-two-input-box">
                          {errors.expectedCTCLakh}
                        </div>
                      )}
                    </div>
                    <div className="calling-tracker-two-input">
                      <input
                        className="applyborderforinputs"
                        type="text"
                        name="expectedCTCThousand"
                        value={lineUpData.expectedCTCThousand}
                        onChange={handleLineUpChange}
                        placeholder="Thousand"
                        maxLength="2"
                        pattern="\d*"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  {(lineUpData.expectedCTCLakh ||
                    lineUpData.expectedCTCThousand) && (
                    <span>
                      {convertNumberToWords(
                        lineUpData.expectedCTCLakh,
                        lineUpData.expectedCTCThousand
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="calling-tracker-row-white">
              <div className="calling-tracker-field">
                <label>Holding Offer Letter</label>
                <div className="calling-tracker-two-input-container">
                  <div className="calling-tracker-two-input">
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <select
                        type="text"
                        name="holdingAnyOffer"
                        value={lineUpData.holdingAnyOffer}
                        onChange={handleLineUpChange}
                        style={{ width: "200px" }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.holdingAnyOffer && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {errors.holdingAnyOffer && (
                      <div className="error-message error-two-input-box">
                        {errors.holdingAnyOffer}
                      </div>
                    )}
                  </div>
                  <div className="calling-tracker-two-input">
                    <input
                      type="text"
                      name="offerLetterMsg"
                      placeholder="Offer Letter Mes.."
                      value={lineUpData.offerLetterMsg}
                      // onChange={handleLineUpChange}
                      onChange={(e) =>
                        setLineUpData({
                          ...lineUpData,
                          offerLetterMsg: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="calling-tracker-field">
                <label>Comment For TL</label>
                <div className="calling-tracker-field-sub-div">
                  <input
                    type="text"
                    name="msgForTeamLeader"
                    placeholder="Comment For TL"
                    value={lineUpData.msgForTeamLeader}
                    //onChange={handleLineUpChange}
                    onChange={(e) =>
                      setLineUpData({
                        ...lineUpData,
                        msgForTeamLeader: e.target.value,
                      })
                    }
                    className="plain-input"
                  />
                </div>
              </div>
            </div>
            <div className="calling-tracker-row-gray">
              <div className="calling-tracker-field">
                <label>Status Type</label>

                <div className="calling-tracker-two-input-container">
                  <div className="calling-tracker-two-input">
                    <select
                      name="selectYesOrNo"
                      value={callingTracker.selectYesOrNo}
                      onChange={handleChange}
                    >
                      <option value="Yet To Confirm">Yet To Confirm</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Interested, will confirm later">
                        Interested, will confirm later
                      </option>
                      <option value="Interested But Not Eligible">
                        Interested But Not Eligible
                      </option>
                      <option value="Not Eligible But Interested">
                        Eligible But Not Interested
                      </option>
                      <option value="Not Eligible">Not Eligible</option>
                      <option value="Not Eligible Not Interested">
                        Not Eligible Not Interested
                      </option>
                    </select>
                  </div>

                  <div className="calling-tracker-two-input">
                    {/* this line added by sahil date 22-10-2024 */}
                    <div className="setRequiredStarDiv">
                      <select
                        //  {/* this line added by sahil date 22-10-2024 */}
                        style={{ width: "inherit" }}
                        disabled={callingTracker.selectYesOrNo !== "Interested"}
                        name="finalStatus"
                        value={lineUpData.finalStatus}
                        //sahil karnekar line 1761 to 1776
                        onChange={(e) => {
                          const value = e.target.value;
                          setLineUpData({
                            ...lineUpData,
                            finalStatus: value,
                          });
                          // Clear the error if a valid option is selected
                          if (value !== "") {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              finalStatus: "", // Clear the finalStatus error
                            }));
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Yet To Confirm">Yet To Confirm</option>
                        {/* <option value="Interview Schedule">
                          Available For Interview
                        </option> */}
                        <option value="Available For Interview">
                          Available For Interview
                        </option>
                        <option value="Confirmed, but will be available later">
                          Confirmed, but will be available later.
                        </option>
                      </select>
                      {/* this line added by sahil date 22-10-2024 */}
                      {callingTracker.selectYesOrNo === "Interested" &&
                        !lineUpData.finalStatus && (
                          <span className="requiredFieldStar">*</span>
                        )}
                    </div>
                    {/* sahil karnekar line 1784 to 1789 */}
                    {errors.finalStatus && (
                      <div className="error-message error-two-input-box">
                        {errors.finalStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="calling-tracker-field">
                <label>Available Slots</label>
                <div className="calling-tracker-two-input-container">
                  <div className="calling-tracker-two-input">
                    {/* line number 1825 to 1851 added by sahil karnekar date : 15-10-2024 */}
                    <input
                      disabled={callingTracker.selectYesOrNo !== "Interested"}
                      type="date"
                      name="availabilityForInterview"
                      value={lineUpData.availabilityForInterview}
                      onChange={(e) => {
                        //Arshad Comment This On 21-10-2025
                        // const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
                        // if (e.target.value < today) {
                        //   seterrorInterviewSlot(
                        //     "Interview Slot Should be Next Date From Today"
                        //   );
                        // } else {
                        //   seterrorInterviewSlot(""); // Clear error message if the date is valid
                        // }

                        setLineUpData({
                          ...lineUpData,
                          availabilityForInterview: e.target.value,
                        });
                      }}
                      //Arshad Comment This On 21-10-2025
                      // min={new Date().toISOString().split("T")[0]} // Allow today and future dates
                    />
                    {errorInterviewSlot && (
                      <div className="error-message">{errorInterviewSlot}</div>
                    )}
                  </div>
                  <div className="calling-tracker-two-input">
                    {/* line number 1856 to 1878 added by sahil karnekar date : 15-10-2024 */}
                    <TimePicker
                      style={{ border: "1px solid black" }}
                      placeholder="Set Interview Time"
                      disabled={callingTracker.selectYesOrNo !== "Interested"}
                      value={
                        lineUpData.interviewTime
                          ? dayjs(lineUpData.interviewTime, "h:mm a")
                          : null
                      } // ensure this is a valid dayjs object
                      onChange={(time) =>
                        setLineUpData({
                          ...lineUpData,
                          interviewTime: time ? time.format("h:mm a") : "", // 'time' is the selected time as a dayjs object
                        })
                      }
                      format="h:mm a" // this hides the seconds selection
                      renderExtraFooter={() => (
                        <div style={{ textAlign: "center", color: "gray" }}>
                          Set Interview Time
                        </div>
                      )}
                    />
                  </div>

                  {/* <input
                    type="text"
                    name="interviewTime"
                    placeholder="⏰(e.g 12:00 AM)"
                    value={lineUpData.interviewTime}
                    onChange={(e) =>
                      setLineUpData({
                        ...lineUpData,
                        interviewTime: e.target.value,
                      })
                    }
                    onFocus={(e) => (e.target.type = 'time')} // Change to time input on focus
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text'; // Revert to text input if no time is selected
                    }}

                    /> */}
                </div>
              </div>
            </div>
          </div>
          <center>
            <div className="buttonDiv">
              {callingTracker.selectYesOrNo !== "Interested" && (
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  className="daily-tr-btn"
                >
                  Add To Calling
                </button>
              )}
              {callingTracker.selectYesOrNo === "Interested" && (
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  className="daily-tr-btn"
                  id="uploadbtn2"
                >
                  Add To LineUp
                </button>
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
                        Are you sure you want to save this candidate's
                        information ?
                      </p>
                      <p>{callingTracker.errors}</p>
                      {
callingTracker.selectYesOrNo === "Interested" && (
  <Checkbox onChange={handleEmailCheckbox} checked={lineUpData.emailStatus === "Yes"}>
  Do You Want Send Email To Candidate ?
</Checkbox>
)
                      }
                    
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          type="submit"
                          disabled={loading}
                          className="buttoncss"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="buttoncss"
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal.Body>
                  </Modal.Dialog>
                </div>
              )}
            </div>
          </center>
        </form>
      </section>
      <ModalComponent
        show={showModal}
        handleClose={handleClose}
        startingPoint={startpoint}
        endingPoint={endpoint}
        currentCTCInLakh={lineUpData.currentCTCLakh}
        currentCTCInThousand={lineUpData.currentCTCThousand}
        expectedCTCInLakh={lineUpData.expectedCTCLakh}
        expectedCTCInThousand={lineUpData.expectedCTCThousand}
        convertedCurrentCTC={convertedCurrentCTC}
        convertedExpectedCTC={convertedExpectedCTC}
        onUpdateExpectedCTCLakh={handleUpdateExpectedCTCLakh}
        onUpdateExpectedCTCThousand={handleUpdateExpectedCTCThousand}
      />
      {/* {submited && (
       <div className="SCE_Loading_Animation">
         <ClipLoader size={50} color="#ffb281" />
       </div>
     )} */}
    </div>
  );
};

const ModalComponent = ({
  show,
  handleClose,
  startingPoint,
  endingPoint,
  // props added by sahil karnekar date 25-10-2024
  currentCTCInLakh,
  currentCTCInThousand,
  expectedCTCInLakh = "",
  expectedCTCInThousand = "",
  convertedCurrentCTC,
  onUpdateExpectedCTCLakh,
  onUpdateExpectedCTCThousand,
}) => {
  const [activeField, setActiveField] = useState("distance");
  const [origin, setOrigin] = useState(startingPoint);
  const [destination, setDestination] = useState(endingPoint);
  const [expectedHike, setExpectedHike] = useState("");
  const [calculatedHike, setCalculatedHike] = useState("");
  const [expectedCTC, setExpectedCTC] = useState("");
  const [expectedCTCLakh, setExpectedCTCLakh] = useState(expectedCTCInLakh);
  // updated by sahil karnekar date 25-10-2024
  const [expectedCTCThousand, setExpectedCTCThousand] = useState(
    expectedCTCInThousand
  );
  const [showHikeInput, setShowHikeInput] = useState(false);
  // this 2 states are added by sahil karnekar date 25-10-2024
  const [currentCTCInLakhState, setCurrentCTCInLakhState] =
    useState(currentCTCInLakh);
  const [currentCTCInThousandState, setCurrentCTCInThousandState] =
    useState(currentCTCInThousand);

  const [currentCTCInLakhState1, setCurrentCTCInLakhState1] =
    useState(currentCTCInLakh);
  const [currentCTCInThousandState1, setCurrentCTCInThousandState1] =
    useState(currentCTCInThousand);

  // Use useEffect to update state when props change
  useEffect(() => {
    setCurrentCTCInLakhState(currentCTCInLakh);
    setCurrentCTCInThousandState(currentCTCInThousand);
    setCurrentCTCInLakhState1(currentCTCInLakh);
    setCurrentCTCInThousandState1(currentCTCInThousand);
  }, [currentCTCInLakh, currentCTCInThousand]);

  useEffect(() => {
    setOrigin(startingPoint);
    setDestination(endingPoint);
    setExpectedCTCLakh(expectedCTCInLakh);
    setExpectedCTCThousand(expectedCTCInThousand);

    // this line updated by sahil karnekar date 25-10-2024
    setShowHikeInput(true);
  }, [startingPoint, endingPoint, expectedCTCInLakh, expectedCTCInThousand]);

  const formatNumberToWords = (num) => {
    const lakh = Math.floor(num / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const tensAndOnes = num % 100;

    let result = "";
    if (lakh) result += `${lakh} lakh `;
    if (thousand) result += `${thousand} thousand `;
    if (hundred) result += `${hundred} hundred `;

    // Handle tens and ones, keeping "and" for readability when needed
    if (tensAndOnes) {
      if (result) result += "and ";
      result += `${tensAndOnes} Indian Rupees `;
    }

    return result.trim();
  };

  useEffect(() => {
    if (expectedHike) {
      const currentCTCNum =
        (parseFloat(currentCTCInLakhState) || 0) * 100000 +
        (parseFloat(currentCTCInThousandState) || 0) * 1000;

      const expectedHikeNum = parseFloat(expectedHike) || 0;
      const hikeAmount = (currentCTCNum * expectedHikeNum) / 100;
      const expectedCTCNum = currentCTCNum + hikeAmount;

      setExpectedCTC(formatNumberToWords(expectedCTCNum));

      setCalculationSteps(`
        Salary Calculation 
        1. Current CTC: - ${currentCTCInLakhState} Lakh   ${currentCTCInThousandState} Thousand 
        2. Hike Percentage : -  ${expectedHikeNum}%
        3. Hike Amount: - (Current CTC * Hike %) / 100
              = (${currentCTCNum} * ${expectedHikeNum}) / 100 = ₹ ${hikeAmount.toLocaleString()}
        4. Expected CTC:  Current CTC + Hike Amount
              = ₹ ${currentCTCNum.toLocaleString()} + ₹ ${hikeAmount.toLocaleString()} =  ₹ ${expectedCTCNum.toLocaleString()}
       
              Total Expected CTC  ${formatNumberToWords(expectedCTCNum)}
      `);
    }
  }, [expectedHike, currentCTCInLakhState, currentCTCInThousandState]);

  useEffect(() => {
    if (
      expectedCTCLakh ||
      expectedCTCThousand ||
      currentCTCInLakhState1 ||
      currentCTCInThousandState1
    ) {
      const lakhValue = parseFloat(expectedCTCLakh) || 0;
      const thousandValue = parseFloat(expectedCTCThousand) || 0;
      const combinedCTC = lakhValue * 100000 + thousandValue * 1000;

      const currentLakhValue = parseFloat(currentCTCInLakhState1) || 0;
      const currentThousandValue = parseFloat(currentCTCInThousandState1) || 0;
      const currentCTCNum =
        currentLakhValue * 100000 + currentThousandValue * 1000;

      let hikePercentage = 0;
      if (currentCTCNum > 0) {
        hikePercentage = ((combinedCTC - currentCTCNum) / currentCTCNum) * 100;
      }

      setCalculatedHike(hikePercentage.toFixed(2));

      setCalculationSteps(`
         Salary Calculation 

        1. Current CTC: ${currentCTCInLakhState1} Lakh  ${currentCTCInThousandState1} Thousand
        2. Expected CTC:  ${expectedCTCLakh} Lakh  ${expectedCTCThousand} Thousand
        3. Hike Calculation: Hike %  ((Expected CTC - Current CTC) / Current CTC) * 100
           = (${combinedCTC} - ${currentCTCNum}) / ${currentCTCNum} * 100

        Total Hike Percentage: ${hikePercentage.toFixed(2)} %
      `);
    }
  }, [
    expectedCTCLakh,
    expectedCTCThousand,
    currentCTCInLakhState1,
    currentCTCInThousandState1,
  ]);

  const handleNumericChange = (setter) => (event) => {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      return; // Prevent update if value is not numeric
    }
    setter(value); // Update state if value is numeric
  };

  const [isLakhFocused, setIsLakhFocused] = useState(false);
  const [isThousandFocused, setIsThousandFocused] = useState(false);
  const [isExpectedLakhFocused, setIsExpectedLakhFocused] = useState(false);
  const [isExpectedThousandFocused, setIsExpectedThousandFocused] =
    useState(false);
  const [isLakhFocused1, setIsLakhFocused1] = useState(false);
  const [isThousandFocused1, setIsThousandFocused1] = useState(false);

  const handleLakhChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCurrentCTCInLakhState(value);
  };
  const handleLakhFocus = () => {
    setIsLakhFocused(true);
  };
  const handleLakhBlur = () => {
    setIsLakhFocused(false);
  };

  const handleThousandChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCurrentCTCInThousandState(value);
  };
  const handleThousandFocus = () => {
    setIsThousandFocused(true);
  };
  const handleThousandBlur = () => {
    setIsThousandFocused(false);
  };

  const handleLakhChange1 = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCurrentCTCInLakhState1(value);
  };
  const handleLakhFocus1 = () => {
    setIsLakhFocused1(true);
  };
  const handleLakhBlur1 = () => {
    setIsLakhFocused1(false);
  };
  const handleThousandChange1 = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setCurrentCTCInThousandState1(value);
  };
  const handleThousandFocus1 = () => {
    setIsThousandFocused1(true);
  };
  const handleThousandBlur1 = () => {
    setIsThousandFocused1(false);
  };
  const handleExpectedLakhChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setExpectedCTCLakh(value);
    onUpdateExpectedCTCLakh(value);
  };
  const handleExpectedLakhFocus = () => {
    setIsExpectedLakhFocused(true);
  };
  const handleExpectedLakhBlur = () => {
    setIsExpectedLakhFocused(false);
  };

  const handleExpectedThousandChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setExpectedCTCThousand(value);
    onUpdateExpectedCTCThousand(value);
  };
  const handleExpectedThousandFocus = () => {
    setIsExpectedThousandFocused(true);
  };
  const handleExpectedThousandBlur = () => {
    setIsExpectedThousandFocused(false);
  };

  const [isHikeFocused, setIsHikeFocused] = useState(false);

  const handleHikeFocus = () => {
    setIsHikeFocused(true);
  };

  const handleHikeBlur = () => {
    setIsHikeFocused(false);
  };

  const [calculationSteps, setCalculationSteps] = useState("");

  return (
    <Modal size="xl" centered show={show} onHide={handleClose}>
      <Modal.Body className="calling-tracker-modal">
        <div className="calling-tracker-popup">
          <div className="calling-tracker-popup-sidebar">
            <p
              className={`sidebar-item ${
                activeField === "distance" ? "active" : ""
              }`}
              onClick={() => setActiveField("distance")}
            >
              Distance Calculation
            </p>
            <p
              className={`sidebar-item ${
                activeField === "salary" ? "active" : ""
              }`}
              onClick={() => setActiveField("salary")}
            >
              Salary Calculation
            </p>

            <p
              className={`sidebar-item ${
                activeField === "previousQuestion" ? "active" : ""
              }`}
              onClick={() => setActiveField("previousQuestion")}
            >
              Previous Question
            </p>
          </div>
          <div className="calling-tracker-popup-dashboard">
            {activeField === "distance" && (
              <div className="distance-calculation">
                <div className="distance-calculation-top-div">
                  <div className="help-form-group">
                    <label htmlFor="origin">Origin</label>
                    <img src={startPointImg} className="start-Point-Img" />
                    <input
                      type="text"
                      id="origin"
                      className="help-form-control"
                      placeholder="Enter origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                  <div className="help-form-group">
                    <label htmlFor="destination">Destination</label>
                    <img src={endpointImg} className="start-Point-Img" />
                    <input
                      type="text"
                      id="destination"
                      className="help-form-control"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="distance-calculation-bottom-div">
                  <iframe
                    id="idfortesteriframe"
                    title="Google Maps"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={
                      origin && destination
                        ? `https://maps.google.com/maps?q=${origin}+to+${destination}&output=embed`
                        : "https://maps.google.com/maps?q=India&output=embed"
                    }
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            {activeField === "salary" && (
              <div className="salary-calculation">
                <table className="table table-bordered text-secondary">
                  <thead>
                    <tr>
                      <th className="sal-cal-th">Current Salary</th>
                      <th className="sal-cal-th">Hike (%)</th>
                      <th className="sal-cal-th">Calculated Expected CTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-secondary">
                        <div className="help-salary-top-div">
                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="currentCTCLakh"
                              className="help-form-control"
                              placeholder="Enter current CTC in Lakh"
                              value={
                                isLakhFocused
                                  ? currentCTCInLakhState
                                  : currentCTCInLakhState
                                  ? `${currentCTCInLakhState} Lakh`
                                  : ""
                              }
                              onChange={handleLakhChange}
                              onFocus={handleLakhFocus}
                              onBlur={handleLakhBlur}
                            />
                          </div>

                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="currentCTCThousand"
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              className="help-form-control"
                              placeholder="Enter current CTC in Thousand"
                              value={
                                isThousandFocused
                                  ? currentCTCInThousandState
                                  : currentCTCInThousandState
                                  ? `${currentCTCInThousandState} Thousand`
                                  : ""
                              }
                              onChange={handleThousandChange}
                              onFocus={handleThousandFocus}
                              onBlur={handleThousandBlur}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <div className="help-salary-top-div">
                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="expectedHike"
                              maxLength="3"
                              pattern="\d*"
                              inputMode="numeric"
                              className="help-form-control"
                              placeholder="Enter expected hike percentage"
                              value={
                                isHikeFocused
                                  ? expectedHike
                                  : expectedHike
                                  ? `${expectedHike}%`
                                  : ""
                              }
                              onChange={handleNumericChange(setExpectedHike)}
                              onFocus={handleHikeFocus}
                              onBlur={handleHikeBlur}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <input
                          placeholder="Result..."
                          type="text"
                          className="help-form-control"
                          readOnly
                          value={expectedCTC}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="sal-cal-th">Current Salary</th>
                      <th className="sal-cal-th">Expected Salary</th>
                      <th className="sal-cal-th">Calculated Hike (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-secondary">
                        <div className="help-salary-top-div">
                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="currentCTCLakh"
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              className="help-form-control"
                              placeholder="Enter current CTC in Lakh"
                              value={
                                isLakhFocused1
                                  ? currentCTCInLakhState1
                                  : currentCTCInLakhState1
                                  ? `${currentCTCInLakhState1} Lakh`
                                  : ""
                              }
                              onChange={handleLakhChange1}
                              onFocus={handleLakhFocus1}
                              onBlur={handleLakhBlur1}
                            />
                          </div>

                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="currentCTCThousand"
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              className="help-form-control"
                              placeholder="Enter current CTC in Thousand"
                              value={
                                isThousandFocused1
                                  ? currentCTCInThousandState1
                                  : currentCTCInThousandState1
                                  ? `${currentCTCInThousandState1} Thousand`
                                  : ""
                              }
                              onChange={handleThousandChange1}
                              onFocus={handleThousandFocus1}
                              onBlur={handleThousandBlur1}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <div className="help-salary-top-div">
                          <div className="help-salary-input-div">
                            <input
                              type="text"
                              id="expectedCTCLakh"
                              className="help-form-control"
                              placeholder="Enter expected CTC in Lakh"
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              value={
                                isExpectedLakhFocused
                                  ? expectedCTCLakh
                                  : expectedCTCLakh
                                  ? `${expectedCTCLakh} Lakh`
                                  : ""
                              }
                              onChange={handleExpectedLakhChange}
                              onFocus={handleExpectedLakhFocus}
                              onBlur={handleExpectedLakhBlur}
                            />
                          </div>
                          <div className="help-salary-top-div">
                            <div className="help-salary-input-div">
                              <input
                                type="text"
                                id="expectedCTCThousand"
                                className="help-form-control"
                                placeholder="Enter expected CTC in Thousand"
                                maxLength="2"
                                pattern="\d*"
                                inputMode="numeric"
                                value={
                                  isExpectedThousandFocused
                                    ? expectedCTCThousand
                                    : expectedCTCThousand
                                    ? `${expectedCTCThousand} Thousand`
                                    : ""
                                }
                                onChange={handleExpectedThousandChange}
                                onFocus={handleExpectedThousandFocus}
                                onBlur={handleExpectedThousandBlur}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <input
                          type="text"
                          className="help-form-control"
                          readOnly
                          value={
                            calculatedHike && !isNaN(calculatedHike)
                              ? `${calculatedHike} %`
                              : ""
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="salary-calculation-bottom-div">
                  {calculationSteps.split("\n").map((step, index) => (
                    <p
                      key={index}
                      style={{ fontWeight: "600", paddingLeft: "20px" }}
                    >
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {activeField === "historyTracker" && (
              <div className="history-Tracker">
                <div className="help-form-group">
                  <CandidateHistoryTracker />
                </div>
              </div>
            )}
            {activeField === "previousQuestion" && (
              <>
                <div>
                  <InterviewPreviousQuestion />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="callingTracker-popup-close-btn"
          onClick={handleClose}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

CallingTrackerForm.propTypes = {
  initialData: PropTypes.object,
  handleDataAdditionSuccess: PropTypes.func.isRequired,
  updateCount: PropTypes.func.isRequired,
  candidateData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

CallingTrackerForm.defaultProps = {
  initialData: null,
};

export default CallingTrackerForm;
