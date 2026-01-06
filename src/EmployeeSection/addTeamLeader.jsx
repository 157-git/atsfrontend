import React, { useEffect, useState } from "react";
import "../EmployeeSection/addEmployee.css";
import { toast } from "react-toastify"
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "./getFormattedDateTime";
import { fetchCompleteProfileData } from "../HandlerFunctions/fetchCompleteProfileData";
import Loader from "./loader";

const AddTeamLeader = ({loginEmployeeName, updateEmployeeIdForForm}) => {
    // const API_BASE_URL="https://rg.157careers.in/api/ats/157industries"

  const { employeeId, userType } = useParams();
  // const employeeId=869
  // const userType="Manager"
  const [formData, setFormData] = useState({
    teamLeaderId:"0",
    teamLeaderName: "",
    userName: "",
    tlDateOfJoining: "",
    tlDesignation: "",
    tlDepartment: "",
    tlOfficialMail: "",
    tlPersonalEmailId: "",
    tlOfficialContactNo: "",
    tlAlternateContactNo: "",
    tlDateOfBirth: "",
    tlGender: "",
    tlCompanyMobileNo: "",
    tlWhatsAppNo: "",
    tlEmergencyContactPerson: "",
    tlEmergencyContactNo: "",
    tlEmergencyPersonRelation: "",
    tlPresentAddress: "",
    tlExperience: "",
    tlPerks: "",
    tlMaritalStatus: "",
    tlAnniversaryDate: "",
    tlTShirtSize: "",
    tlLastCompany: "",
    tlWorkLocation: "",
    tlEntrySource: "",
    teamLeaderStatus: "",
    lastWorkingDate: "",
    tlReasonForLeaving: "",
    tlInductionYesOrNo: "",
    tlInductionComment: "",
    tlTrainingSource: "",
    tlTrainingCompleted: "",
    tlTrainingTakenCount: "",
    tlRoundsOfInterview: "",
    tlInterviewTakenPerson: "",
    tlWarningComments: "",
    tlPerformanceIndicator: "",
    messageForAdmin: "",
    editDeleteAuthority: "",
    linkedInURL: "",
    faceBookURL: "",
    twitterURL: "",
    tlAddress: "",
    bloodGroup: "",
    tlAadhaarNo: "",
    tlPanNo: "",
    tlQualification: "",
    tlSalary: "",
    jobLevel: "",
    professionalPtNo: "",
    esIcNo: "",
    pfNo: "",
    tlPassword: "",
    tlConfirmPassword: "",
    tlInsuranceNumber: "",
    reportingAdminName: "",
    reportingAdminDesignation: "",
    profileImage: null,
    document: null,
    resumeFile: null,
    maritalStatus: ""

  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmpasswordVisible, settlConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
   const [socket, setSocket] = useState(null);
   const [loading, setLoading] = useState(false);



     useEffect(() => {
       const fetchData = async () => {
         if (updateEmployeeIdForForm) {
           setLoading(true);
           try {
             const resp = await fetchCompleteProfileData(updateEmployeeIdForForm, "TeamLeader");
             setFormData((prevFormData) => ({
               ...resp,
               tlAadhaarNo: resp.aadhaarNo,
               tlAddress : resp.address,
               tlAlternateContactNo: resp.alternateContactNo,
               tlAnniversaryDate : resp.anniversaryDate,
               tlCompanyMobileNo: resp.companyMobileNo,
               tlConfirmPassword: resp.confirmPassword,
               tlDateOfBirth : resp.dateOfBirth,
               tlDateOfJoining: resp.dateOfJoining,
               tlDepartment: resp.department,
               tlDesignation : resp.designation,
               editDeleteAuthority: resp.editDeleteAuthority,
               tlEmergencyContactNo: resp.emergencyContactNo,
               tlEmergencyContactPerson: resp.emergencyContactPerson,
               tlEmergencyPersonRelation: resp.emergencyPersonRelation,
               tlEntrySource: resp.entrySource,
               esIcNo: resp.esIcNo,
               tlExperience: resp.experience,
               faceBookURL: resp.faceBookURL,
               tlGender: resp.gender,
               tlInductionComment: resp.inductionComment,
               tlInductionYesOrNo: resp.inductionYesOrNo,
               tlInsuranceNumber: resp.insuranceNumber,
               tlInterviewTakenPerson: resp.interviewTakenPerson,
               jobLevel: resp.jobRole,
               tlLastCompany: resp.lastCompany,
               linkedInURL: resp.linkedInURL,
               tlMaritalStatus: resp.maritalStatus,
               messageForAdmin: resp.messageForAdmin,
               teamLeaderName: resp.name,
               tlOfficialContactNo: resp.officialContactNo,
               tlOfficialMail: resp.officialMail,
               tlPanNo: resp.panNo,
               tlPassword: resp.password,
               tlPerformanceIndicator: resp.performanceIndicator,
               tlPerks: resp.perks,
               tlPersonalEmailId: resp.personalEmailId,
               tlPresentAddress: resp.presentAddress,
               professionalPtNo: resp.professionalPtNo,
               tlQualification: resp.qualification,
               tlReasonForLeaving: resp.reasonForLeaving,
               reportingAdminDesignation: resp.reportingPersonDesignation,
               reportingAdminName: resp.reportingPersonName,
               tlRoundsOfInterview: resp.roundsOfInterview,
               tlSalary: resp.salary,
               teamLeaderStatus: resp.status,
               tlTrainingCompleted:resp.trainingCompletedYesOrNo,
               tlTrainingSource: resp.trainingSource,
               tlTrainingTakenCount: resp.trainingTakenCount,
               tlTShirtSize: resp.tshirtSize,
               twitterURL: resp.twitterURL,
               tlWarningComments: resp.warningComments,
               tlWhatsAppNo: resp.whatsAppNo,
               tlWorkLocation: resp.workLocation,
               lastWorkingDate: resp.workingDate

           }));
             console.log("Response from API:", resp);
           } catch (error) {
             console.error("Error fetching employee data:", error);
           }finally{
             setLoading(false);
           }
         }
       };
     
       fetchData();
     }, [updateEmployeeIdForForm, employeeId, userType]);
//-----------SAKSHI KASHID 09/07/2025------------------
     const validateField = (name, value, file = null) => {
  switch (name) {
    case "teamLeaderName":
      const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
      if (value.trim() !== value) return "No space at start or end.";
      if (!nameRegex.test(value)) return "Only alphabets allowed. No special chars. One space between words.";
      if (value.length > 30) return "Max 30 characters allowed.";
      break;

    case "tlOfficialMail":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format.";
      break;

    case "userName":
    const userRegex = /^(?![.])[a-zA-Z0-9._]+(?<![.])$/;
    if (value.trim() !== value) return "No space at start or end.";
    if (!userRegex.test(value)) return "Only letters, numbers and symbols( . and _ ) allowed, . not allowed at start and end.";
    if (value.length > 15) return "Max 15 characters allowed.";
    break;


    case "tlOfficialContactNo":
      if (!/^\d{10}$/.test(value)) return "Must be exactly 10 digits.";
      break;

    case "tlAadhaarNo":
      if (!/^\d{12}$/.test(value)) return "Must be exactly 12 digits.";
      break;

    case "tlPanNo":
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) return "PAN must be in format: ABCDE1234F";
      break;

    case "tlPresentAddress":
      if (value.length > 100) return "Max 100 characters allowed.";
      break;

    case "profileImage":
      const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (file && !allowedImageTypes.includes(file.type)) return "Only PNG, JPG, JPEG, GIF allowed.";
      break;

    case "resumeFile":
      const allowedDocTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (file && !allowedDocTypes.includes(file.type)) return "Only PDF or Word files allowed.";
      break;

    case "tlPassword":
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
      if (!passwordRegex.test(value)) return "Min 8 chars, 1 capital, 1 number, 1 special char.";
      break;

    case "tlConfirmPassword":
      if (value !== formData.tlPassword) return "Passwords do not match.";
      break;

    case "tlDesignation":
      if (value.length > 30) return "Max 30 characters allowed.";
      break;

    case "tlAlternateContactNo":
    case "tlCompanyMobileNo":
    case "tlWhatsAppNo":
    case "tlEmergencyContactNo":
      if (value && !/^\d{10}$/.test(value)) return "Must be exactly 10 digits.";
      break;

    case "tlInsuranceNumber":
    case "professionalPtNo":
    case "esIcNo":
    case "pfNo":
      if (value && !/^\d{6,20}$/.test(value)) return "Only digits allowed (6 to 20 digits).";
      break;

    case "tlTrainingTakenCount":
    case "tlRoundsOfInterview":
      if (value && !/^\d+$/.test(value)) return "Must be a valid number.";
      break;

    case "tlQualification":
    case "bloodGroup":
    case "reportingAdminName":
    case "reportingAdminDesignation":
      if (value && /\d/.test(value)) return "Numbers not allowed.";
      break;

    case "editDeleteAuthority":
    case "messageForAdmin":
      if (value && value.length > 100) return "Max 100 characters allowed.";
      break;


    default:
      return "";
  }
};

//-----------SAKSHI KASHID 09/07/2025------------
  const handleInputChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === "file") {
    const file = files[0];
    if (!file) return;
  
    // File size limits (in bytes)
    const maxSizes = {
      profileImage: 2 * 1024 * 1024,     // 2 MB
      resumeFile: 5 * 1024 * 1024,       // 5 MB
      document: 5 * 1024 * 1024    // 5 MB
    };
  
    // Check size limit if applicable
    if (maxSizes[name] && file.size > maxSizes[name]) {
      const readableSize = maxSizes[name] / (1024 * 1024);
      // toast.error(`${name} should not exceed ${readableSize} MB.`);
      setErrors((prev) => ({
        ...prev,
        [name]: `File size must be ≤ ${readableSize} MB.`,
      }));
      return;
    }
    const error = validateField(name, "", file);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
    return;
  }

  // Run custom validation for required fields
  const error = validateField(name, value);
  if (error) {
    setErrors((prev) => ({ ...prev, [name]: error }));
  } else {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // Existing text-only field checks
  if (
    [
      "teamLeaderName",
      "tlDesignation",
      "tlDepartment",
      "tlPerks",
      "tlLastCompany",
      "tlWorkLocation",
      "tlEntrySource",
      "tlReasonForLeaving",
      "tlInductionComment",
      "tlTrainingSource",
      "tlEmergencyContactPerson",
      "tlEmergencyPersonRelation",
      "tlInterviewTakenPerson",
      "tlWarningComments",
      "tlPerformanceIndicator",
      "messageForAdmin",
      "editDeleteAuthority",
      "bloodGroup",
      "tlQualification",
      "reportingAdminName",
      "reportingAdminDesignation"
    ].includes(name)
  ) {
    if (/\d/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Please enter character value only.",
      }));
    }
  }

  // Existing numeric-only field checks
  if (
    [
      "tlOfficialContactNo",
      "tlAlternateContactNo",
      "tlCompanyMobileNo",
      "tlWhatsAppNo",
      "tlEmergencyContactNo",
      "tlInsuranceNumber",
      "tlAadhaarNo",
      "tlSalary",
      "tlTrainingTakenCount",
      "professionalPtNo",
      "esIcNo",
      "pfNo",
      "tlRoundsOfInterview"
    ].includes(name)
  ) {
    if (/[^0-9]/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Please enter numeric value only.",
      }));
    }
  }

  // Always update formData
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleConfirmPasswordBlur = () => {
    if (formData.tlPassword !== formData.tlConfirmPassword) {
      setPasswordMatch(false);
      setPasswordError("Passwords do not match");
    } else {
      setPasswordMatch(true);
      setPasswordError("");
    }
  };
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const fieldMapping = {
  teamLeaderName: "teamLeaderName",
  userName: "userName",
  tlDateOfJoining: "tlDateOfJoining",
  tlDesignation: "tlDesignation",
  tlDepartment: "tlDepartment",
  tlOfficialMail: "tlOfficialMail",
  tlPersonalEmailId: "tlPersonalEmailId",
  tlOfficialContactNo: "tlOfficialContactNo",
  tlAlternateContactNo: "tlAlternateContactNo",
  tlDateOfBirth: "tlDateOfBirth",
  tlGender: "tlGender",
  jobLevel: "jobLevel",
  tlCompanyMobileNo: "tlCompanyMobileNo",
  tlWhatsAppNo: "tlWhatsAppNo",
  tlEmergencyContactPerson: "tlEmergencyContactPerson",
  tlEmergencyContactNo: "tlEmergencyContactNo",
  tlEmergencyPersonRelation: "tlEmergencyPersonRelation",
  tlPresentAddress: "tlPresentAddress",
  tlExperience: "tlExperience",
  tlPerks: "tlPerks",
  tlMaritalStatus: "tlMaritalStatus",
  tlAnniversaryDate: "tlAnniversaryDate",
  tlTShirtSize: "tlTShirtSize",
  tlLastCompany: "tlLastCompany",
  tlWorkLocation: "tlWorkLocation",
  tlEntrySource: "tlEntrySource",
  teamLeaderStatus: "teamLeaderStatus",
  lastWorkingDate: "lastWorkingDate",
  tlReasonForLeaving: "tlReasonForLeaving",
  tlInductionYesOrNo: "tlInductionYesOrNo",
  tlInductionComment: "tlInductionComment",
  tlTrainingSource: "tlTrainingSource",
  tlTrainingCompleted: "tlTrainingCompleted",
  tlTrainingTakenCount: "tlTrainingTakenCount",
  tlRoundsOfInterview: "tlRoundsOfInterview",
  tlInterviewTakenPerson: "tlInterviewTakenPerson",
  tlWarningComments: "tlWarningComments",
  tlPerformanceIndicator: "tlPerformanceIndicator",
  messageForAdmin: "messageForAdmin",
  editDeleteAuthority: "editDeleteAuthority",
  linkedInURL: "linkedInURL",
  faceBookURL: "faceBookURL",
  twitterURL: "twitterURL",
  tlAddress: "tlAddress",
  bloodGroup: "bloodGroup",
  tlAadhaarNo: "tlAadhaarNo",
  tlPanNo: "tlPanNo",
  tlQualification: "tlQualification",
  tlSalary: "tlSalary",
  professionalPtNo: "professionalPtNo",
  esIcNo: "esIcNo",
  pfNo: "pfNo",
  tlInsuranceNumber: "tlInsuranceNumber",
  reportingAdminName: "reportingAdminName",
  reportingAdminDesignation: "reportingAdminDesignation",
  tlPassword: "tlPassword",
  tlConfirmPassword: "tlConfirmPassword",
  profileImage: "profileImage",
  document: "document",
  resumeFile: "resumeFile"
};


  const requiredFields = [
    "teamLeaderName",
    "userName",
    "tlDateOfJoining",
    "tlOfficialMail",
    "tlOfficialContactNo",
    "tlPresentAddress",
    "tlAadhaarNo",
    "tlPanNo",
    "tlPassword",
    "tlConfirmPassword",
    "profileImage",
    "resumeFile"
  ];

  let missingFields = [];

  requiredFields.forEach((field) => {
    const value = formData[field];

    if (field === "profileImage" || field === "resumeFile") {
      if (!(value instanceof File)) {
        missingFields.push(field);
      }
    } else if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      missingFields.push(field);
    }
  });

  console.log("Missing fields:", missingFields);

  if (missingFields.length > 0) {
    let fieldErrors = {};
    missingFields.forEach((field) => {
      fieldErrors[field] = "This field is required.";
    });
    setErrors(fieldErrors);
    toast.error("Please fill all required fields.");
    return;
  }

  if (!passwordMatch) {
    setPasswordError("Passwords do not match");
    return;
  }
   const numericFields = [
  "tlOfficialContactNo",
  "tlAlternateContactNo",
  "tlCompanyMobileNo",
  "tlWhatsAppNo",
  "tlEmergencyContactNo",
  "tlAadhaarNo",
  "tlSalary",
  "tlTrainingTakenCount",
  "professionalPtNo",
  "esIcNo",
  "pfNo",
  "tlInsuranceNumber",
  "tlRoundsOfInterview",
  "teamLeaderId"
];

const formDataToSend = new FormData();

for (const key in formData) {
  let value = formData[key];

  if (numericFields.includes(key)) {
    // ✅ Always send numeric, fallback to "0"
    if (value === "" || value === null || value === undefined) {
      value = "0";
    }
  } else {
    // For non-numeric fields, skip if empty
    if (value === "" || value === null || value === undefined) {
      continue;
    }
  }

  const backendKey = fieldMapping[key] || key;
  formDataToSend.append(backendKey, value.toString()); // force string
}

if (!formDataToSend.has("teamLeaderId")) {
  formDataToSend.append("teamLeaderId", "0");
}

    try {
      const response = await fetch(
        `${API_BASE_URL}/save-teamLeader/${employeeId}/${userType}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

  const responseBody = await response.json();
  console.log("Response Body:", responseBody);
  let newId = responseBody.id;
  if (response.ok) {
    console.log(loginEmployeeName);

const emitData = {
  // teamLeaderId:"0",
  //userType: "TeamLeader",
  teamLeaderName: formData.teamLeaderName,
  userName: formData.userName,
  tlDateOfJoining: getFormattedDateTime(),
  tlDesignation: "",
  tlDepartment: "",
  tlOfficialMail: "",
  tlPersonalEmailId: "",
  tlOfficialContactNo: "",
  tlAlternateContactNo: "",
  tlDateOfBirth: "",
  tlGender: "",
  tlCompanyMobileNo: "",
  tlWhatsAppNo: "",
  tlEmergencyContactPerson: "",
  tlEmergencyContactNo: "",
  tlEmergencyPersonRelation: "",
  tlPresentAddress: "",
  tlExperience: "",
  tlPerks: "",
  tlMaritalStatus: "",
  tlAnniversaryDate: "",
  tlTShirtSize: "",
  tlLastCompany: "",
  tlWorkLocation: "",
  tlEntrySource: "",
  teamLeaderStatus: "",
  lastWorkingDate: "",
  tlReasonForLeaving: "",
  tlInductionYesOrNo: "",
  tlInductionComment: "",
  tlTrainingSource: "",
  tlTrainingCompleted: "",
  tlTrainingTakenCount: "",
  tlRoundsOfInterview: "",
  tlInterviewTakenPerson: "",
  tlWarningComments: "",
  tlPerformanceIndicator: "",
  messageForAdmin: "",
  editDeleteAuthority: "",
  linkedInURL: "",
  faceBookURL: "",
  twitterURL: "",
  tlAddress: "",
  bloodGroup: "",
  tlAadhaarNo: "",
  tlPanNo: "",
  tlQualification: "",
  tlSalary: "",
  jobLevel: formData.jobLevel,
  professionalPtNo: "",
  esIcNo: "",
  pfNo: "",
  tlPassword: "",
  tlConfirmPassword: "",
  tlInsuranceNumber: "",
  reportingAdminName: loginEmployeeName,
  reportingAdminDesignation: "",
  employeeId:newId,
  userType: "TeamLeader",
};

console.log(emitData);

toast.success("Employee Data Added Successfully.");
        // socket.emit("add_teamLeader_event", emitData);
        setFormData({
            teamLeaderId:"0",
            teamLeaderName: "",
            userName: "",
            tlDateOfJoining: "",
            tlDesignation: "",
            tlDepartment: "",
            tlOfficialMail: "",
            tlPersonalEmailId: "",
            tlOfficialContactNo: "",
            tlAlternateContactNo: "",
            tlDateOfBirth: "",
            tlGender: "",
            tlCompanyMobileNo: "",
            tlWhatsAppNo: "",
            tlEmergencyContactPerson: "",
            tlEmergencyContactNo: "",
            tlEmergencyPersonRelation: "",
            tlPresentAddress: "",
            tlExperience: "",
            tlPerks: "",
            tlMaritalStatus: "",
            tlAnniversaryDate: "",
            tlTShirtSize: "",
            tlLastCompany: "",
            tlWorkLocation: "",
            tlEntrySource: "",
            teamLeaderStatus: "",
            lastWorkingDate: "",
            tlReasonForLeaving: "",
            tlInductionYesOrNo: "",
            tlInductionComment: "",
            tlTrainingSource: "",
            tlTrainingCompleted: "",
            tlTrainingTakenCount: "",
            tlRoundsOfInterview: "",
            tlInterviewTakenPerson: "",
            tlWarningComments: "",
            tlPerformanceIndicator: "",
            messageForAdmin: "",
            editDeleteAuthority: "",
            linkedInURL: "",
            faceBookURL: "",
            twitterURL: "",
            tlAddress: "",
            bloodGroup: "",
            tlAadhaarNo: "",
            tlPanNo: "",
            tlQualification: "",
            tlSalary: "",
            jobLevel: "",
            professionalPtNo: "",
            esIcNo: "",
            pfNo: "",
            tlPassword: "",
            tlConfirmPassword: "",
            tlInsuranceNumber: "",
            reportingAdminName: "",
            reportingAdminDesignation: "",
            profileImage: null,
            document: null,
            resumeFile: null,
        })
      } else {
              toast.error("Please Fill All Inputs.");
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error("Error occurred while adding teamleader data.");
          }
        };


  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const toggletlConfirmPasswordVisibility = () => {
    settlConfirmPasswordVisible((prev) => !prev);
  };

  const showPassword = () => setPasswordVisible(true);
  const hidePassword = () => setPasswordVisible(false);
  const showtlConfirmPassword = () => settlConfirmPasswordVisible(true);
  const hidetlConfirmPassword = () => settlConfirmPasswordVisible(false);

  return (
    <div className="AddRec-form-container">
      <form
        className="AddRec-form-group"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input type="text" name="teamLeaderId" value={formData.teamLeaderId} hidden id="" />
    
        <div className="addRec-form-row">
<label>Team Leader Name: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="teamLeaderName"
            className="employee-inputs"
            placeholder="Enter Employee Full Name"
            value={formData.teamLeaderName}
            onChange={handleInputChange}
          />
          {errors.teamLeaderName && (
            <div className="error">{errors.teamLeaderName}</div>
          )}
        </div>

        <div className="addRec-form-row">
<label>Date of Joining: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="date"
            name="tlDateOfJoining"
            value={formData.tlDateOfJoining}
            onChange={handleInputChange}
          />
          {errors.tlDateOfJoining && (
            <div className="error">{errors.tlDateOfJoining}</div>
          )}
        </div>

        <div className="addRec-form-row">
<label>Designation: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="tlDesignation"
            placeholder="Eg: FrontEnd Developer"
            value={formData.tlDesignation}
            onChange={handleInputChange}
          />
          {errors.tlDesignation && (
            <div className="error">{errors.tlDesignation}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Department:</label>
          <input
            type="text"
            name="tlDepartment"
            placeholder="Enter Department"
            value={formData.tlDepartment}
            onChange={handleInputChange}
          />
          {errors.tlDepartment && (
            <div className="error">{errors.tlDepartment}</div>
          )}
        </div>

       
        <div className="addRec-form-row">
<label>Job Role: <span style={{ color: "red" }}>&nbsp;*</span></label>
  <select
  name="jobLevel"
  value={formData.jobLevel}
  onChange={handleInputChange}
  className={`readonly-input ${errors.jobLevel ? "input-error" : ""}`}
>
  <option value="">Select</option>
  <option value="TeamLeader">Team Leader</option>
</select>

{errors.jobLevel && (
  <span className="error-message">{errors.jobLevel}</span>
)}

</div>


        <div className="addRec-form-row">
<label>Official Email: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="email"
            name="tlOfficialMail"
            placeholder="Enter Official Email"
            value={formData.tlOfficialMail}
            onChange={handleInputChange}
          />
          {errors.tlOfficialMail && (
            <div className="error">{errors.tlOfficialMail}</div>
          )}

        </div>

        <div className="addRec-form-row">
          <label>Personal Email:</label>
          <input
            type="email"
            name="tlPersonalEmailId"
            placeholder="Enter Employee Email"
            value={formData.tlPersonalEmailId}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
<label>User Name: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="userName"
            placeholder="Enter User Name  "
            value={formData.userName}
            onChange={handleInputChange}
          />
          {errors.userName && (
            <div className="error">{errors.userName}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Alternate Mobile Number:</label>
          <input
            type="text"
            accept="0-9"
            name="tlAlternateContactNo"
            placeholder="Enter Alternate Mobile Number"
            value={formData.tlAlternateContactNo}
            onChange={handleInputChange}
          />
          {errors.tlAlternateContactNo && (
            <div className="error">{errors.tlAlternateContactNo}</div>
          )}
        </div>

        <div className="addRec-form-row">
<label>Official Contact Number: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            accept="0-9"
            name="tlOfficialContactNo"
            placeholder="Enter Company Mobile Number"
            value={formData.tlOfficialContactNo}
            onChange={handleInputChange}
          />
          {errors.tlOfficialContactNo && (
            <div className="error">{errors.tlOfficialContactNo}</div>
          )}
        </div>
        <div className="addRec-form-row">
          <label>Company Mobile Number:</label>
          <input
            type="text"
            accept="0-9"
            name="tlCompanyMobileNo"
            placeholder="Enter Company Mobile Number"
            value={formData.tlCompanyMobileNo}
            onChange={handleInputChange}
          />
          {errors.tlCompanyMobileNo && (
            <div className="error">{errors.tlCompanyMobileNo}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>WhatsApp Number:</label>
          <input
            type="text"
            accept="0-9"
            name="tlWhatsAppNo"
            placeholder="Enter WhatsApp Number"
            value={formData.tlWhatsAppNo}
            onChange={handleInputChange}
          />
          {errors.tlWhatsAppNo && (
            <div className="error">{errors.tlWhatsAppNo}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="tlDateOfBirth"
            value={formData.tlDateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Gender:</label>
          <select
            name="tlGender"
            value={formData.tlGender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="addRec-form-row">
          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>

          </select>

        </div>

        <div className="addRec-form-row">
          {formData.maritalStatus === "Married" && (
          <div className="form-group">
            <label>Anniversary Date:</label>
            <input
              type="date"
              name="anniversaryDate"
              value={formData.anniversaryDate}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        )}

        </div>

        <div className="addRec-form-row">
          <label>Emergency Contact Person:</label>
          <input
            type="text"
            name="tlEmergencyContactPerson"
            placeholder="Enter Emergency Contact Person Name"
            value={formData.tlEmergencyContactPerson}
            onChange={handleInputChange}
          />
          {errors.tlEmergencyContactPerson && (
            <div className="error">{errors.tlEmergencyContactPerson}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Emergency Contact Number:</label>
          <input
            type="text"
            name="tlEmergencyContactNo"
            placeholder="Enter Emergency Contact Number"
            value={formData.tlEmergencyContactNo}
            onChange={handleInputChange}
          />
          {errors.tlEmergencyContactNo && (
            <div className="error">{errors.tlEmergencyContactNo}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label> Relation With Person:</label>
          <input
            type="text"
            name="tlEmergencyPersonRelation"
            placeholder="Enter Emergency Person Relation"
            value={formData.tlEmergencyPersonRelation}
            onChange={handleInputChange}
          />
          {errors.tlEmergencyPersonRelation && (
            <div className="error">{errors.tlEmergencyPersonRelation}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>T-shirt Size:</label>
          <select
            name="tlTShirtSize"
            value={formData.tlTShirtSize}
            onChange={handleInputChange}
          >
            <option value={""}>Select T-Shirt Size</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="3XL">3XL</option>
            <option value="4XL">4XL</option>
            <option value="5XL">5XL</option>
            <option value="6XL">6XL</option>
            <option value="7XL">7XL</option>
          </select>
        </div>

        <div className="addRec-form-row">
          <label>Blood Group:</label>
          <input
            type="text"
            name="bloodGroup"
            placeholder="Enter Blood Group"
            value={formData.bloodGroup}
            onChange={handleInputChange}
          />
          {errors.bloodGroup && <div className="error">{errors.bloodGroup}</div>}

        </div>
        <div className="addRec-form-row">
<label>Aadhaar Number: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="tlAadhaarNo"
            placeholder="Enter Aadhaar Number"
            value={formData.tlAadhaarNo}
            onChange={handleInputChange}
          />
          {errors.tlAadhaarNo && <div className="error">{errors.tlAadhaarNo}</div>}
        </div>

        <div className="addRec-form-row">
<label>PAN Card Number: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="tlPanNo"
            placeholder="Enter PAN Card Number"
            value={formData.tlPanNo}
            onChange={handleInputChange}
          />
          {errors.tlPanNo && <div className="error">{errors.tlPanNo}</div>}
        </div>

        <div className="addRec-form-row">
          <label>Educational Qualification:</label>
          <input
            type="text"
            name="tlQualification"
            placeholder="Enter Educational Qualification"
            value={formData.tlQualification}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Gross Salary (lpa):</label>
          <input
            type="text"
            name="tlSalary"
            placeholder="Enter Gross Salary"
            value={formData.tlSalary}
            onChange={handleInputChange}
          />
          {errors.tlSalary && (
            <div className="error">{errors.tlSalary}</div>
          )}
        </div>

        <div className="addRec-form-row">
<label>Employee Present Address: <span style={{ color: "red" }}>&nbsp;*</span></label>
          <input
            type="text"
            name="tlPresentAddress"
            placeholder="Enter Present Address"
            value={formData.tlPresentAddress}
            onChange={handleInputChange}
          />
          {errors.tlPresentAddress && (
            <div className="error">{errors.tlPresentAddress}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Employee Experience:</label>
          <input
            type="text"
            name="tlExperience"
            placeholder="Enter Experience"
            value={formData.tlExperience}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Perks:</label>
          <input
            type="text"
            name="tlPerks"
            placeholder="Enter Perks"
            value={formData.tlPerks}
            onChange={handleInputChange}
          />
          {errors.tlPerks && <div className="error">{errors.tlPerks}</div>}
        </div>

        <div className="addRec-form-row">
          <label>Last Company:</label>
          <input
            type="text"
            name="tlLastCompany"
            placeholder="Enter Last Company"
            value={formData.tlLastCompany}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Work Location:</label>
          <input
            type="text"
            name="tlWorkLocation"
            placeholder="Enter Work Location"
            value={formData.tlWorkLocation}
            onChange={handleInputChange}
          />
          {errors.tlWorkLocation && (
            <div className="error">{errors.tlWorkLocation}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Entry Source:</label>
          <input
            type="text"
            name="tlEntrySource"
            placeholder="Enter Entry Source"
            value={formData.tlEntrySource}
            onChange={handleInputChange}
          />
          {errors.tlEntrySource && (
            <div className="error">{errors.tlEntrySource}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Employee Status:</label>
          <select
            name="teamLeaderStatus"
            value={formData.teamLeaderStatus}
            onChange={handleInputChange}
          >
            <option value={""}>Select Employee Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="addRec-form-row">
          <label>Last Working Date:</label>
          <input
            type="date"
            name="lastWorkingDate"
            value={formData.lastWorkingDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Reason for Leaving:</label>
          <input
            type="text"
            name="tlReasonForLeaving"
            placeholder="Enter Reason for Leaving"
            value={formData.tlReasonForLeaving}
            onChange={handleInputChange}
          />
          {errors.tlReasonForLeaving && (
            <div className="error">{errors.tlReasonForLeaving}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Induction (Yes/No):</label>
          <select
            name="tlInductionYesOrNo"
            value={formData.tlInductionYesOrNo}
            onChange={handleInputChange}
          >
            <option value={""}>Select Yes or No</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="addRec-form-row">
          <label>Induction Comment:</label>
          <input
            type="text"
            name="tlInductionComment"
            placeholder="Enter Induction Comment"
            value={formData.tlInductionComment}
            onChange={handleInputChange}
          />
          {errors.tlInductionComment && (
            <div className="error">{errors.tlInductionComment}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Training Source:</label>
          <input
            type="text"
            name="tlTrainingSource"
            placeholder="Enter Training Source"
            value={formData.tlTrainingSource}
            onChange={handleInputChange}
          />
          {errors.tlTrainingSource && (
            <div className="error">{errors.tlTrainingSource}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Training Completed (Yes/No):</label>
          <select
            name="tlTrainingCompleted"
            value={formData.tlTrainingCompleted}
            onChange={handleInputChange}
          >
            <option value={""}>Select Yes or No</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="addRec-form-row">
          <label>Training Taken Count:</label>
          <input
            type="number"
            name="tlTrainingTakenCount"
            placeholder="Enter Training Taken Count"
            value={formData.tlTrainingTakenCount}
            onChange={handleInputChange}
          />
          {errors.tlTrainingTakenCount && (
            <div className="error">{errors.tlTrainingTakenCount}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Rounds of Interview:</label>
          <input
            type="text"
            name="tlRoundsOfInterview"
            placeholder="Enter Rounds of Interview"
            value={formData.tlRoundsOfInterview}
            onChange={handleInputChange}
          />
          {errors.tlRoundsOfInterview && (
            <div className="error">{errors.tlRoundsOfInterview}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Interview Taken By:</label>
          <input
            type="text"
            name="tlInterviewTakenPerson"
            placeholder="Enter Interview Taken By"
            value={formData.tlInterviewTakenPerson}
            onChange={handleInputChange}
          />
          {errors.tlInterviewTakenPerson && (
            <div className="error">{errors.tlInterviewTakenPerson}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Warning Comments:</label>
          <input
            type="text"
            name="tlWarningComments"
            placeholder="Enter Warning Comments"
            value={formData.tlWarningComments}
            onChange={handleInputChange}
          />
          {errors.tlWarningComments && (
            <div className="error">{errors.tlWarningComments}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Performance Indicator:</label>
          <input
            type="text"
            name="tlPerformanceIndicator"
            placeholder="Enter Performance Indicator"
            value={formData.tlPerformanceIndicator}
            onChange={handleInputChange}
          />
          {errors.tlPerformanceIndicator && (
            <div className="error">{errors.tlPerformanceIndicator}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Team Leader Message:</label>
          <input
            type="text"
            name="messageForAdmin"
            placeholder="Enter Team Leader Message"
            value={formData.messageForAdmin}
            onChange={handleInputChange}
          />
          {errors.messageForAdmin && (
            <div className="error">{errors.messageForAdmin}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Edit/Delete Authority:</label>
          <input
            type="text"
            name="editDeleteAuthority"
            placeholder="Enter Edit/Delete Authority"
            value={formData.editDeleteAuthority}
            onChange={handleInputChange}
          />
          {errors.editDeleteAuthority && (
            <div className="error">{errors.editDeleteAuthority}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>LinkedIn URL:</label>
          <input
            type="text"
            name="linkedInURL"
            placeholder="Enter LinkedIn URL"
            value={formData.linkedInURL}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Facebook URL:</label>
          <input
            type="text"
            name="faceBookURL"
            placeholder="Enter Facebook URL"
            value={formData.faceBookURL}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Twitter URL:</label>
          <input
            type="text"
            name="twitterURL"
            placeholder="Enter Twitter URL"
            value={formData.twitterURL}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Employee Address:</label>
          <input
            type="text"
            name="tlAddress"
            placeholder="Enter Employee Address"
            value={formData.tlAddress}
            onChange={handleInputChange}
          />
        </div>

        <div className="addRec-form-row">
          <label>Professional PT Number:</label>
          <input
            type="text"
            name="professionalPtNo"
            placeholder="Enter Professional PT Number"
            value={formData.professionalPtNo}
            onChange={handleInputChange}
          />
          {errors.professionalPtNo && (
            <div className="error">{errors.professionalPtNo}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>ESIC Number:</label>
          <input
            type="text"
            name="esIcNo"
            placeholder="Enter ESIC Number"
            value={formData.esIcNo}
            onChange={handleInputChange}
          />
          {errors.esIcNo && <div className="error">{errors.esIcNo}</div>}
        </div>

        <div className="addRec-form-row">
          <label>PF Number:</label>
          <input
            type="text"
            name="pfNo"
            placeholder="Enter PF Number"
            value={formData.pfNo}
            onChange={handleInputChange}
          />
          {errors.pfNo && <div className="error">{errors.pfNo}</div>}
        </div>

        <div className="addRec-form-row">
          <label>Insurance Number:</label>
          <input
            type="text"
            name="tlInsuranceNumber"
            placeholder="Enter Insurance Number"
            value={formData.tlInsuranceNumber}
            onChange={handleInputChange}
          />
          {errors.tlInsuranceNumber && (
            <div className="error">{errors.tlInsuranceNumber}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Reporting Manager Name:</label>
          <input
            type="text"
            name="reportingAdminName"
            placeholder="Enter Reporting Manager Name"
            value={formData.reportingAdminName}
            onChange={handleInputChange}
          />
          {errors.reportingAdminName && (
            <div className="error">{errors.reportingAdminName}</div>
          )}
        </div>

        <div className="addRec-form-row">
          <label>Reporting Manager Designation:</label>
          <input
            type="text"
            name="reportingAdminDesignation"
            placeholder="Enter Reporting Manager Designation"
            value={formData.reportingAdminDesignation}
            onChange={handleInputChange}
          />
          {errors.reportingAdminDesignation && (
            <div className="error">{errors.reportingAdminDesignation}</div>
          )}
        </div>
        <div className="addRec-form-row">
  <label>
    Upload Resume: <span style={{ color: "red" }}>&nbsp;*</span>
  </label>
  <div className="wraptickindiv">
    <input
      type="file"
      name="resumeFile"
      accept=".pdf, .docx"
      onChange={handleInputChange}
    />

    {errors.resumeFile && (
      <div className="error">{errors.resumeFile}</div>
    )}

    {formData.resumeFile && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#78A75A"
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
      </svg>
    )}
  </div>
</div>

        <div className="addRec-form-row">
  <label>
    Upload Profile Image: <span style={{ color: "red" }}>&nbsp;*</span>
  </label>

  <div className="wraptickindiv">
    <input
      type="file"
      name="profileImage"
      accept=".png, .jpg, .jpeg, .gif" // ✅ Restrict to image formats
      onChange={handleInputChange}
    />

    {errors.profileImage && (
      <div className="error">{errors.profileImage}</div>
    )}

    {formData.profileImage && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#78A75A"
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
      </svg>
    )}
  </div>
</div>


        <div className="addRec-form-row">
  <label>Upload Document:</label>

  <div className="wraptickindiv">
    <input
      type="file"
      name="document"
      accept=".pdf, .docx"
      multiple
      onChange={handleInputChange}
    />

    {errors.document && (
      <div className="error">{errors.document}</div>
    )}

    {formData.document && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#78A75A"
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/>
      </svg>
    )}
  </div>
</div>


<div className="addRec-form-row">
  <label>Password: <span style={{ color: "red" }}>&nbsp;*</span></label>
  <div className="wrapper-eye">
    <div
      className="password-eye-icon"
      onMouseEnter={() => setPasswordVisible(true)}
      onMouseLeave={() => setPasswordVisible(false)}
    >
      <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
    </div>
    <input
      type={passwordVisible ? "text" : "password"}
      name="tlPassword"
      placeholder="Enter Password"
      value={formData.tlPassword}
      onChange={handleInputChange}
    />
    {errors.tlPassword && (
      <div className="error">{errors.tlPassword}</div>
    )}
  </div>
</div>

<div className="addRec-form-row">
  <label>Confirm Password: <span style={{ color: "red" }}>&nbsp;*</span></label>
  <div className="wrapper-eye">
    <div
      className="password-eye-icon"
      onMouseEnter={() => setPasswordVisible(true)}
      onMouseLeave={() => setPasswordVisible(false)}
    >
      <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
    </div>
    <input
      type={passwordVisible ? "text" : "password"}
      name="tlConfirmPassword"
      placeholder="Confirm Password"
      value={formData.tlConfirmPassword}
      onChange={handleInputChange}
      onBlur={handleConfirmPasswordBlur}
    />
    {errors.tlConfirmPassword && (
      <div className="error">{errors.tlConfirmPassword}</div>
    )}
  </div>

  {/* {!passwordMatch && <div className="error">{passwordError}</div>} */}
</div>



        <div className="add-employee-submit-div">
          <button type="submit" className="submit-button-add-emp">
            {
          updateEmployeeIdForForm ? "Update" : "Submit"
          }
          </button>
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </form>

       {
              loading && (
                <Loader/>
              )
            }
    </div>

    
  );
};

export default AddTeamLeader;
