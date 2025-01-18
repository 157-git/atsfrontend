// This is done by vaibhavi kawarkhe Date: 10-12-2024
// Task: Applicant Form
import React, { useRef, useState, useEffect } from "react";
import "./applicantFrom2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faMailBulk,
  faSackDollar,
  faCheckCircle,
  faHourglassHalf,
  faUserTie,
  faBirthdayCake,
  faMoneyCheck,
  faFile,
  faIndustry,
  faWallet,
  faLocation,
  faLocationPin,
  faCalendar,
  faBriefcase,
  faKeyboard,
  faCertificate,
  faUpload,
  faPhotoFilm,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FormControlLabel, Radio } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import CryptoJS from "crypto-js";
import { getSocket } from "../EmployeeDashboard/socket";

function ApplicantForm2({ loginEmployeeName }) {
  //Arshad Attar Added This Code On 12-12-2024
  //This Code to hide Employee Id and UserType In Every Time
  const { encodedParams } = useParams();
  // here i have performed decryption
  // exposing directly in file just for testing and normal use purpose, please set this secreat key in env file while deploying on server
  const secretKey = "157industries_pvt_ltd"; // Ensure this matches ShareLink

  // Decryption logic
  const decodeParams = (encrypted) => {
    try {
      const base64 = encrypted.replace(/[^a-zA-Z0-9]/g, "");
      const decodedBase64 = atob(base64);
      const bytes = CryptoJS.AES.decrypt(decodedBase64, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const [id, type] = decrypted.split(":");
      if (!id || !type) throw new Error("Invalid decrypted data");
      return { employeeId: id, userType: type };
    } catch (error) {
      console.error("Decryption failed:", error);
      return { employeeId: null, userType: null }; // Fallback if decryption fails
    }
  };

  const [socket, setSocket] = useState(null);
  const { employeeId, userType } = decodeParams(encodedParams);
  const [loading, setLoading] = useState(false);
  const [resumeSelected, setResumeSelected] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);
  const dateInputRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePlaceholderClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.click();
    }
  };

  const initialFormData = {
    date: "",
    candidateName: "",
    contactNumber: "",
    candidateEmail: "",
    jobDesignation: "",
    currentLocation: "",
    recruiterName: "",
    alternateNumber: "",
    sourceName: "Applicant Form",
    requirementId: "",
    requirementCompany: "",
    communicationRating: "",
    fullAddress: "",
    callingFeedback: "",
    selectYesOrNo: "Yet To Confirm",
    incentive: "",
    oldEmployeeId: "",
    distance: "",
    task: "",
    position: "",
    lineUp: {
      experienceYear: "",
      experienceMonth: "",
      relevantExperience: "",
      currentCTCLakh: "",
      expectedCTCLakh: "",
      qualification: "",
      preferredLocation: "",
      noticePeriod: "",
      gender: "",
      availabilityForInterview: "",
      relocateStatus: "",
      holdingAnyOffer: "",
      expectedJoinDate: "",
      resume: [],
      photo: [],
      offerdetails: "",
      companyName: "",
      offersalary: "",
      dateOfBirth: "",
      extraCertification: "",
      feedBack: "",
      maritalStatus: "",
      pickUpAndDrop: "",
      interviewTime: "",
      finalStatus: "",
      candidateStatus: "",
      token: "",
      verificationLink: "",
      yearOfPassing: "",
    },
    questions: [{ question1: "", question2: "", question3: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigator = useNavigate();

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  // Set recruiterName when loginEmployeeName is available
  useEffect(() => {
    console.log("Checking loginEmployeeName:", loginEmployeeName); // Log to verify value
    if (loginEmployeeName) {
      setFormData((prevData) => ({
        ...prevData,
        recruiterName: loginEmployeeName,
      }));
    }
  }, [loginEmployeeName]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    // Clear the error for the specific field when typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    if (name === "lineUp.resume" && files.length > 0) {
      const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

      // File size validation
      if (files[0].size > maxFileSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "File size should not exceed 5MB",
        }));
        return; // Stop further processing
      }

      setResumeSelected(true);
    }

    if (name === "lineUp.photo" && files.length > 0) {
      setPhotoSelected(true);
    }

    // File handling logic
    if (files && files.length > 0) {
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
      };
      reader.readAsArrayBuffer(files[0]);
    }

    if (name.startsWith("questions[")) {
      const questionIndex = parseInt(name.split("[")[1].split("]")[0], 10);
      const questionKey = name.split(".")[1];

      setFormData((prevData) => {
        const updatedQuestions = [...prevData.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [questionKey]: e.target.type === "file" ? files[0] : value,
        };

        return {
          ...prevData,
          questions: updatedQuestions,
        };
      });
    } else if (name.startsWith("lineUp.")) {
      const nestedField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        lineUp: {
          ...prevData.lineUp,
          [nestedField]: e.target.type === "file" ? files[0] : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.type === "file" ? files[0] : value,
      }));
    }
  };

  //rajalxmi JAgadale 10-01-2025
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract base64 content only
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  };
  //Field Added RAjlaxmi Jagadale 13-01-2025

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "candidateName",
      "contactNumber",
      "task",
      "position",
      "candidateEmail",
      "lineUp.currentCTCLakh",
      "lineUp.expectedCTCLakh",
      "lineUp.qualification",
      "jobDesignation",
      "currentLocation",
      "lineUp.experienceYear",
      "questions[0].question1",
      "questions[0].question3",
      "lineUp.resume",
      "lineUp.photo",
      "lineUp.extraCertification",
      "lineUp.dateOfBirth",
      "lineUp.preferredLocation",
      "lineUp.noticePeriod",
      "lineUp.availabilityForInterview",
      "lineUp.expectedJoiningDate",
      "lineUp.relevantExperience",
      "lineUp.gender",
      "lineUp.companyName",
      "lineUp.offersalary",
      "lineUp.offerdetails",
    ];

    let isFormValid = true;
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = field.includes(".")
        ? getNestedValue(formData, field)
        : formData[field];

      const error = validateField(field, value || "");
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);

    if (!isFormValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    const currentDate = new Date();
    const updatedFormData = {
      ...formData,
      date: currentDate.toISOString().split("T")[0],
      candidateAddedTime: currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lineUp: {
        ...formData.lineUp,
        resume:
          formData.lineUp.resume instanceof File
            ? await convertToBase64(formData.lineUp.resume)
            : formData.lineUp.resume,
        photo:
          formData.lineUp.photo instanceof File
            ? await convertToBase64(formData.lineUp.photo)
            : formData.lineUp.photo,
      },
      ...(userType === "Recruiters"
        ? { employee: { employeeId, teamLeaderId: employeeId } }
        : userType === "TeamLeader"
        ? { teamLeader: { teamLeaderId: employeeId } }
        : userType === "Manager"
        ? { manager: { managerId: employeeId } }
        : {}),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/save-applicant/${userType}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      // socket.emit("save_applicant_data", updatedFormData);
      setIsSubmitted(true);
      navigator("/thank-you");
      setTimeout(() => {
        setFormData(initialFormData);
        setResumeSelected(false);
        setPhotoSelected(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit details");
    } finally {
      setLoading(false);
    }
  };

  //Validation Rajlaxmi Jagadale 10-01-2025/13-01-2025
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "candidateName":
        if (!value.trim()) {
          error = "Enter Your Name.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Only alphabets and spaces are allowed.";
        } else if (value.length > 100) {
          error = "Name cannot exceed 100 characters.";
        }
        break;

      case "lineUp.extraCertification":
        if (!value.trim()) {
          error = "Enter Your Certification Deatils";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Only Alphabets Allow";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }

        break;
      case "contactNumber":
        if (!value.trim()) {
          error = "Enter Your Contact Number";
        } else if (!/^\d{6,16}$/.test(value)) {
          // Allow 6 to 11 digits
          error = "Contact Number must be between 6 and 11 digits.";
        }
        break;

      case "lineUp.dateOfBirth":
        if (!value.trim()) {
          error = "Enter Your Birth Date";
        } else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear(); // Changed from const to let
          const month = today.getMonth() - dob.getMonth();

          if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
            age--; // Now valid because 'age' is a let
          }

          if (age < 18) {
            error = "You must be at least 18 years old to apply.";
          } else if (isNaN(dob.getTime())) {
            // Improved validation for invalid date
            error = "Enter a valid Birth Date";
          }
        }
        break;

      case "candidateEmail":
        if (!value.trim()) {
          error = "Enter Your Email Address";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = "Enter a valid Email Address";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }
        break;

      case "jobDesignation":
        if (!value.trim()) {
          error = "Enter Your Job Designation";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Job designation must contain only letters and spaces.";
        } else if (value.length > 100) {
          error = "Job designation cannot exceed 100 characters.";
        }
        break;

      case "currentLocation":
        if (!value.trim()) {
          error = "Enter Your Job Designation";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Job designation must contain only letters and spaces.";
        } else if (value.length > 100) {
          error = "Job designation cannot exceed 100 characters.";
        }
        break;

      case "LineUp.experienceYear":
        if (!value.trim()) {
          error = "Enter the Experience Year";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = "Enter a valid Email Address";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }
        break;

      case "lineUp.expectedJoiningDate":
        const todays = new Date().toISOString().split("T")[0];
        if (!value.trim()) {
          error = "Enter Expected Date Of Joining";
        } else if (new Date(value) < new Date(todays)) {
          error = "Please select today or a future date.";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }
        break;

      case "LineUp.currentCTCLakh":
        if (!value.trim()) {
          error = "Enter the CurrentCTCLakh";
        } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = "Enter a valid number with up to two decimal places";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }
        break;

      case "lineUp.qualification":
        if (!value.trim()) {
          error = "Enter Your Qualification";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Only Alphabets and Spaces are allowed";
        } else if (value.length > 100) {
          error = "Company name cannot exceed 100 characters.";
        }
        break;

      case "lineUp.photo":
        if (!value) {
          error = "Upload the photo";
        } else if (!["image/jpeg", "image/png"].includes(value.type)) {
          error = "Only JPEG and PNG formats are allowed";
        } else if (value.size > 2 * 1024 * 1024) {
          error = "File size must not exceed 2 MB";
        }
        break;

      case "lineUp.resume":
        if (!value || value.length === 0) {
          error = "Please upload your resume";
        } else if (!(value instanceof File)) {
          error = "Invalid file format";
        } else if (value.size > 5 * 1024 * 1024) {
          error = "File size must not exceed 5 MB";
        }
        break;

      case "position":
        if (!value.trim()) {
          error = "You can only provide up to 200 words.";
        } else if (value.trim().split(/\s+/).length > 200) {
          error = "Only 100 Numbers are accept";
        }
        break;

      case "lineUp.holdingAnyOffer":
        if (value === undefined) {
          error = "Please select whether you are holding any offer.";
        }
        break;

      case "task":
        if (!value.trim()) {
          error = "You can only provide up to 200 words";
        } else if (value.trim().split(/\s+/).length > 200) {
          error = "Only 100 Numbers are accept";
        }
        break;

      case "lineUp.experienceYear":
        if (!value.trim()) {
          error = "Experience Month is required.";
        } else if (value < 0 || value > 11) {
          error = "Month must be between 0 and 11.";
        }
        break;

      case "lineUp.currentCTCLakh":
        if (
          name === "lineUp.currentCTCLakh" ||
          name === "lineUp.currentCTCThousand"
        ) {
          if (value === "" || isNaN(value) || value <= 0) {
            error = "Please enter a valid salary amount greater than zero.";
          } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            error =
              "Please enter a valid salary amount with up to two decimal places.";
          }
        }
        break;

      case "lineUp.expectedCTCLakh":
        if (
          name === "lineUp.expectedCTCLakh" ||
          name === "lineUp.expectedCTCThousand"
        ) {
          if (value === "" || isNaN(value) || value <= 0) {
            error = "Please enter a valid salary";
          } else if (value.length > 2) {
            error = "Salary must be a two-digit number.";
          }
        }
        break;

      case "lineUp.preferredLocation":
        if (!value.trim()) {
          error = "Enter Your Location";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Only Alphabets and Spaces are allowed";
        }
        break;

      case "lineUp.noticePeriod":
        if (!value.trim()) {
          error = "Enter Your Contact Number";
        } else if (!/^\d{2,5}$/.test(value)) {
          // Allow 6 to 11 digits
          error = "Notice Period must  be 2 or 5 digits.";
        }
        break;
      case "lineUp.availabilityForInterview":
        const today = new Date().toISOString().split("T")[0];
        if (!value.trim()) {
          error = "Enter your available date.";
        } else if (new Date(value) < new Date(today)) {
          error = " Please select today's date or a future date.";
        }
        break;

      case "lineUp.relevantExperience":
        if (!value.trim()) {
          error = "Enter Your Notice Period";
        } else if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          error = "Only Alphabets and Spaces are allowed";
        }
        break;

      case "lineUp.gender":
        if (!value.trim()) {
          error = "Select Gender";
        }
        break;
      // case "lineUp.companyName":
      //   if (!value.trim()) {
      //     error = "Enter The Company Name";
      //   } else if (/[^a-zA-Z\s]/.test(value)) {
      //     error = "Only Alphabets and Spaces are allowed";
      //   }
      //   break;
      // case "lineUp.offersalary":
      //   if (!value.trim()) {
      //     error = "Only Accepted Numbers.";
      //   }a
      //   break;
      // case "lineUp.offerdetails":
      //   if (!value.trim()) {
      //     error = "Enter The Offer details.";
      //   } else if (/[^a-zA-Z\s]/.test(value)) {
      //     error = "Only Alphabets and Spaces are allowed.";
      //   } else if (value.split(/\s+/).length > 200) {
      //     error = "Offer details cannot exceed 200 words.";
      //   }
      //   break;

      default:
        break;
    }
    return error;
  };

  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
        setScrollingUp(lastScrollY > currentScrollY);
      } else {
        setIsScrolled(false);
        setScrollingUp(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //Error msg Rajlaxmi jagadale 13-01-2025
  return (
    <div className="form-container-December">
      <h1 id="applicant-form-heading">Applicant Form</h1>
      <center>
        <hr className="applicant-form-hr" />
      </center>{" "}
      <form
        action=""
        onSubmit={handleSubmit}
        className="applicant-form-December"
      >
        <div className="form-grid-December">
          <div className="form-column-December">
            <div className="form-group-December">
              <label> Applicant's Full Name</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faUser}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="candidateName"
                  placeholder="Candidate's Full Name"
                  value={formData.candidateName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>
              {errors.candidateName && (
                <span className="error">{errors.candidateName}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Contact Number</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="input-icon-December"
                />
                <input
                  type="number"
                  placeholder="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={16}
                  required
                />
              </div>
              {errors.contactNumber && (
                <span className="error">{errors.contactNumber}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Email Address</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faMailBulk}
                  className="input-icon-December"
                />
                <input
                  type="email"
                  name="candidateEmail"
                  placeholder="Candidate Email"
                  value={formData.candidateEmail}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>
              {errors.candidateEmail && (
                <span className="error">{errors.candidateEmail}</span>
              )}
            </div>
            <div className="form-group-December">
              <label>Applicant's Current Salary</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faSackDollar}
                  className="input-icon-December"
                />
                <input
                  type="number"
                  name="lineUp.currentCTCLakh"
                  placeholder="Lakhs"
                  value={formData.lineUp.currentCTCLakh}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />
                <span></span> {/* Optional separator */}
                <input
                  type="number"
                  name="lineUp.currentCTCThousand"
                  placeholder="Thousands"
                  value={formData.lineUp.currentCTCThousand}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />
              </div>
              {(errors["lineUp.currentCTCLakh"] ||
                errors["lineUp.currentCTCThousand"]) && (
                <span className="error">
                  {errors["lineUp.currentCTCLakh"] ||
                    errors["lineUp.currentCTCThousand"]}
                </span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Expected Salary</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faMoneyCheck}
                  className="input-icon-December"
                />
                <input
                  type="number"
                  name="lineUp.expectedCTCLakh"
                  placeholder="Lakhs"
                  value={formData.lineUp.expectedCTCLakh}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />
                <span></span> {/* Optional separator */}
                <input
                  type="number"
                  name="lineUp.expectedCTCThousand"
                  placeholder="Thousands"
                  value={formData.lineUp.expectedCTCThousand}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />
              </div>
              {(errors["lineUp.expectedCTCLakh"] ||
                errors["lineUp.expectedCTCThousand"]) && (
                <span className="error">
                  {errors["lineUp.expectedCTCLakh"] ||
                    errors["lineUp.expectedCTCThousand"]}
                </span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Education</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faFile}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="lineUp.qualification"
                  placeholder="Education"
                  value={formData.lineUp.qualification}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>
              {errors["lineUp.qualification"] && (
                <span className="error">{errors["lineUp.qualification"]}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Job Designation</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="jobDesignation"
                  placeholder="Designation"
                  value={formData.jobDesignation}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>
              {errors.jobDesignation && (
                <span className="error">{errors.jobDesignation}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Current Location</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faLocation}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="currentLocation"
                  placeholder="Current Location"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.currentLocation && (
                <span className="error">{errors.currentLocation}</span>
              )}
            </div>
          </div>

          <div className="form-column-December">
            <div className="form-group-December">
              <label>Applicant's Preferred Location</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faLocationPin}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="lineUp.preferredLocation"
                  placeholder="Preferred Location"
                  value={formData.lineUp.preferredLocation}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
              {errors["lineUp.preferredLocation"] && (
                <span className="error">
                  {errors["lineUp.preferredLocation"]}
                </span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's Notice Period</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="lineUp.noticePeriod"
                  placeholder="Notice Period In Days"
                  value={formData.lineUp.noticePeriod}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
              {errors["lineUp.noticePeriod"] && (
                <div className="error">{errors["lineUp.noticePeriod"]}</div>
              )}
            </div>

            <div className="form-group-December">
              <label>Availability For Interview</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="input-icon-December"
                />
                <input
                  type="date"
                  name="lineUp.availabilityForInterview"
                  placeholder="Availability For Interview"
                  value={formData.availabilityForInterview}
                  onChange={handleChange}
                />
              </div>
              {errors["lineUp.availabilityForInterview"] && (
                <div className="error">
                  {errors["lineUp.availabilityForInterview"]}
                </div>
              )}
            </div>

            <div className="form-group-December">
              <label>Expected Joining Date</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faClock}
                  className="input-icon-December"
                />
                <input
                  type="date"
                  placeholder="Expected Joining Date"
                  name="lineUp.expectedJoiningDate"
                  value={formData.expectedJoinDate}
                  onChange={handleChange}
                />
              </div>
              {errors["lineUp.expectedJoiningDate"] && (
                <div className="error">
                  {errors["lineUp.expectedJoiningDate"]}
                </div>
              )}
            </div>
            <div className="form-group-December">
              <label>Total Experience (Years)</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faKeyboard}
                  className="input-icon-December"
                />
                <input
                  type="number"
                  name="lineUp.experienceYear"
                  placeholder="Total Experience (Years)"
                  value={formData.lineUp.experienceYear}
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />

                <span></span>
                <input
                  type="number"
                  name="lineUp.experienceMonth"
                  placeholder="Month"
                  value={formData.lineUp.experienceMonth}
                  onChange={handleChange}
                  onInput={(e) => {
                    // Ensure the input value is between 0 and 12
                    let monthValue = e.target.value;
                    if (monthValue > 12) {
                      e.target.value = 12;
                    } else if (monthValue < 0) {
                      e.target.value = 0;
                    }
                    if (e.target.value.length > 2) {
                      e.target.value = e.target.value.slice(0, 2);
                    }
                  }}
                  required
                />
              </div>
              {errors["lineUp.experienceYear"] && (
                <span className="error">{errors["lineUp.experienceYear"]}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Relevant Experience</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="lineUp.relevantExperience"
                  placeholder="Relevant Experience"
                  value={formData.lineUp.relevantExperience}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
              {errors["lineUp.relevantExperience"] && (
                <span className="error">
                  {errors["lineUp.relevantExperience"]}
                </span>
              )}
            </div>

            <div className="form-group-December">
              <div className="gender">
                <label>Gender</label>
                <div className="radio-group">
                  <FormControlLabel
                    control={
                      <Radio
                        checked={formData.lineUp.gender === "male"}
                        onChange={() =>
                          handleChange({
                            target: {
                              name: "lineUp.gender",
                              value: "male",
                            },
                          })
                        }
                      />
                    }
                    label="Male"
                  />

                  <FormControlLabel
                    control={
                      <Radio
                        checked={formData.lineUp.gender === "female"}
                        onChange={() =>
                          handleChange({
                            target: {
                              name: "lineUp.gender",
                              value: "female",
                            },
                          })
                        }
                      />
                    }
                    label="Female"
                  />
                </div>
                {errors["lineUp.gender"] && (
                  <span className="error">{errors["lineUp.gender"]}</span>
                )}
              </div>
            </div>

            <div className="form-group-December">
              <label>Are You Holding Any Offer?</label>
              <div className="radio-group">
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.lineUp.holdingAnyOffer}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "lineUp.holdingAnyOffer",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={!formData.lineUp.holdingAnyOffer}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "lineUp.holdingAnyOffer",
                            value: false,
                          },
                        })
                      }
                    />
                  }
                  label="No"
                />
              </div>
            </div>
            {formData.lineUp.holdingAnyOffer && (
              <div className="offer-details">
                <div className="form-group-December">
                  <label>Offer Company Name</label>
                  <div className="input-with-icon-December">
                    <FontAwesomeIcon
                      icon={faIndustry}
                      className="input-icon-December"
                    />
                    <input
                      type="text"
                      name="lineUp.companyName"
                      placeholder="company Name"
                      value={formData.lineUp.companyName}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      className="form-textfield"
                    />
                  </div>
                  {errors["lineUp.companyName"] && (
                    <div className="error">{errors["lineUp.companyName"]}</div>
                  )}
                </div>
                <br></br>

                <div className="form-group-December">
                  <label>Offer Salary (Lakh)</label>
                  <div className="input-with-icon-December">
                    <FontAwesomeIcon
                      icon={faWallet}
                      className="input-icon-December"
                    />
                    <input
                      type="number"
                      name="lineUp.offersalary"
                      placeholder="Salary (Lakh)"
                      value={formData.lineUp.offersalary}
                      onChange={handleChange}
                      maxLength={2}
                      required
                      className="form-textfield"
                    />
                  </div>
                  {errors["lineUp.offersalary"] && (
                    <div className="error">{errors["lineUp.offersalary"]}</div>
                  )}
                </div>
                <br></br>

                <div className="form-group-December">
                  <label>Offer Details</label>
                  <textarea
                    name="lineUp.offerdetails"
                    placeholder="Details about the offer"
                    value={formData.lineUp.offerdetails}
                    onChange={handleChange}
                    maxLength={200}
                    rows="6"
                    className="form-textfield"
                  />
                  {errors["lineUp.offerdetails"] && (
                    <div className="error">{errors["lineUp.offerdetails"]}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="form-column-December">
            <div className="form-group-December">
              <label>Have You Done Any Courses And Certificates ?</label>

              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="input-icon-December"
                />
                <input
                  type="text"
                  name="lineUp.extraCertification"
                  placeholder="Enter Certificate Details"
                  value={formData.lineUp.extraCertification}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
              {errors["lineUp.extraCertification"] && (
                <span className="error">
                  {errors["lineUp.extraCertification"]}
                </span>
              )}
            </div>

            <div className="form-group-December">
              <label>Applicant's BirthDate </label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  className="input-icon-December"
                />
                <input
                  type="date"
                  name="lineUp.dateOfBirth"
                  placeholder="BirthDate"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              {errors["lineUp.dateOfBirth"] && (
                <span className="error">{errors["lineUp.dateOfBirth"]}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>
                How you Prioritize Your Task When Working On Multiple Projects
              </label>
              <textarea
                name="task"
                placeholder="Details about the offer"
                value={formData.task}
                onChange={handleChange}
                rows="6"
                className="form-textfield"
              />
              {errors["task"] && <div className="error">{errors["task"]}</div>}
            </div>

            <div className="form-group-December">
              <label>What Motivated You To Apply For This Position</label>
              <textarea
                name="position"
                placeholder="Details about the offer"
                value={formData.position}
                onChange={handleChange}
                rows="6"
                className="form-textfield"
              />
              {errors["position"] && (
                <div className="error">{errors["position"]}</div>
              )}
            </div>

            <div className="form-group-December">
              <label> Upload Resume</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="input-icon-December"
                />
                <input
                  type="file"
                  id="resumeUpload"
                  name="lineUp.resume"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                />
                {resumeSelected && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="success-December"
                  />
                )}
              </div>
              {errors["lineUp.resume"] && (
                <span className="error">{errors["lineUp.resume"]}</span>
              )}
            </div>

            <div className="form-group-December">
              <label>Upload Photo</label>
              <div className="input-with-icon-December">
                <FontAwesomeIcon
                  icon={faPhotoFilm}
                  className="input-icon-December"
                />
                <input
                  type="file"
                  id="photoUpload"
                  name="lineUp.photo"
                  onChange={handleChange}
                  accept=".jpng,.png,.jpg"
                />
                {photoSelected && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="success-December"
                  />
                )}
                <br></br>
              </div>
              {errors["lineUp.photo"] && (
                <span className="error">{errors["lineUp.photo"]}</span>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="click-December">
        <button
          type="submit"
          className="daily-tr-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {" "}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
      <br />
    </div>
  );
}

export default ApplicantForm2;
