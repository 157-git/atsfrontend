// This is done by vaibhavi kawarkhe Date: 10-12-2024
// Task: Applicant Form
import React, { useRef, useState, useEffect } from "react";
import "./applicantFrom2.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import bannerImage from '../assets/newImage-removebg-preview.png';
import newLogoHead from '../assets/ApplicantFormLogo.png';
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
import Loader from "../EmployeeSection/loader";
import { message, Modal } from "antd";
import { Radio as AntdRadio } from 'antd';
import CvTemplate from "../ResumeData/cv";


function ApplicantForm2({ loginEmployeeName }) {
  const [messageApi, contextHolder] = message.useMessage();

  const { encodedParams } = useParams();
  const extractedParam = encodedParams?.split("+")[1];
  const [socket, setSocket] = useState(null);
  const [salaryInWords, setSalaryInWords] = useState("");
  // const { employeeId, userType } = getEmployeeDetails();
  const [employeeId, setEmployeeId] = useState();
  const [userType, setUserType] = useState();

  const getEmployeeDetails = async () => {
    const response = await axios.post(`${API_BASE_URL}/get-shorten-details`, {
      shortenUrl: `${extractedParam}`,
    });
    setEmployeeId(response.data.employeeId);
    setUserType(response.data.userType);
  };

  useEffect(() => {
    messageApi.success('Mobile View Recommended !');
    getEmployeeDetails();
  }, []);

  const [loading, setLoading] = useState(false);
  const [resumeSelected, setResumeSelected] = useState(false);
  const [fileSelected, setSelected] = useState("");
  const [photoSelected, setPhotoSelected] = useState(false);
  const dateInputRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappSelected, setWhatsappSelected] = useState(false);
  const [doneAnyCertification, SetDoneAnyCertification] = useState(false);
  const [showCreateResumeModule, setShowCreateResumeModule] = useState(false);
  const [cvFromApplicantsForm, setCvFromApplicantsForm] = useState(true);

  const initialFormData = {
    date: "",
    candidateName: "",
    contactNumber: "",
    candidateEmail: "",
    jobDesignation: "",
    currentLocation: "",
    recruiterName: "",
    alternateNumber: 0,
    sourceName: "",
    requirementId: "",
    requirementCompany: "",
    communicationRating: "",
    fullAddress: "",
    callingFeedback: "",
    selectYesOrNo: "Yet To Confirm",
    incentive: "",
    oldEmployeeId: "",
    distance: "",
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
      disability: "",
      disabilityDetails: "",
      candidateUanNumber : "",
      candidateReference : ""
      // certificates: [{ certificateName: "", certificateFile: null }],
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const inputRefs = useRef([]);
  const [type, settype] = useState("");
  const navigator = useNavigate();

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (loginEmployeeName) {
      setFormData((prevData) => ({
        ...prevData,
        recruiterName: loginEmployeeName,
      }));
    }
  }, [loginEmployeeName]);

  const handleKeyDown = (e) => {
    if (e.target.name === "candidateEmail") {
      if (e.key === " ") {
        e.preventDefault(); // Prevents spaces from being entered
      }
    }
    if (e.target.name === "lineUp.experienceYear" ||
       e.target.name === "lineUp.experienceMonth" ||
       e.target.name === "lineUp.currentCTCLakh" ||
       e.target.name === "lineUp.currentCTCThousand" ||
       e.target.name === "lineUp.expectedCTCLakh" ||
       e.target.name === "lineUp.expectedCTCThousand"
    ) {
      if (e.key === "." || e.key === "-" || e.key === "e") {
        e.preventDefault(); // Prevent decimal points, negative numbers, and exponent notation
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();

      const currentField = e.target;
      const currentClassName = currentField.className;

      if (currentClassName.includes("contact-number")) {
        return;
      }

      const inputs = Array.from(
        document.querySelectorAll("input, select, textarea")
      );

      const currentIndex = inputs.indexOf(currentField);

      if (currentIndex > -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  // const handleChange = (e) => {
  //   const { name, type, files, value } = e.target;

  //   const inputValue =
  //     type === "file" ? (files && files.length > 0 ? files[0] : null) : value;

  //   if (name === "lineUp.offersalary") {
  //     if (!/^\d{0,2}$/.test(value)) {
  //       return; // Prevent updating if the value is not numeric or exceeds 2 digits
  //     }
  //   }
  //   if (name === "candidateEmail") {
  //     if (!/^\S*$/.test(value)) {
  //       return; // Prevent updating if there is a space
  //     }
  //   }

  //   // Update the formData for nested objects like certificates
  //   setFormData((prevData) => {
  //     let updatedData = { ...prevData };

  //     if (name === "lineUp.holdingAnyOffer") {
  //       const isHoldingOffer = value === "true" || value === true;

  //       updatedData.lineUp = {
  //         ...prevData.lineUp,
  //         holdingAnyOffer: isHoldingOffer,
  //         ...(isHoldingOffer
  //           ? {} // Keep existing values if "Yes" is selected
  //           : {
  //               companyName: "",
  //               offersalary: "",
  //               negotiation: "",
  //               offerdetails: "",
  //             }), // Clear values if "No" is selected
  //       };
  //     } else if (name.startsWith("lineUp.")) {
  //       const nameParts = name.split(".");
  //       if (name.startsWith("lineUp.certificates")) {
  //         const nameParts = name.split(".");
  //         const index = parseInt(nameParts[1].match(/\d+/)[0], 10);
  //         const field = nameParts[2];
  //         const updatedCertificates = [...prevData.lineUp.certificates];
  //         updatedCertificates[index][field] = inputValue;

  //         updatedData.lineUp = {
  //           ...prevData.lineUp,
  //           certificates: updatedCertificates,
  //         };
  //       } else {
  //         const nestedField = nameParts[1];
  //         updatedData.lineUp = {
  //           ...prevData.lineUp,
  //           [nestedField]: inputValue,
  //         };
  //       }
  //     } else {
  //       updatedData[name] = inputValue;
  //     }
  //     return updatedData;
  //   });

  //   // Reset the error for the field that was changed
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: undefined,
  //   }));

  //   // Optionally validate the input
  //   const error = validateField(name, inputValue);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: error,
  //   }));

  //   if (name === "lineUp.resume" && files.length > 0) {
  //     const maxFileSize = 5 * 1024 * 1024;

  //     if (files[0].size > maxFileSize) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         [name]: "File size should not exceed 5MB",
  //       }));
  //       return;
  //     }

  //     setResumeSelected(true);
  //   }

  //   if (name === "lineUp.photo" && files.length > 0) {
  //     setPhotoSelected(true);
  //   }

  //   if (files && files.length > 0) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const arrayBuffer = reader.result;
  //       const byteArray = new Uint8Array(arrayBuffer);
  //       const chunkSize = 0x8000;
  //       let base64String = "";

  //       for (let i = 0; i < byteArray.length; i += chunkSize) {
  //         base64String += String.fromCharCode.apply(
  //           null,
  //           byteArray.subarray(i, i + chunkSize)
  //         );
  //       }
  //       base64String = btoa(base64String);
  //     };
  //     reader.readAsArrayBuffer(files[0]);
  //   }
  // };

  // const handleCertificateChange = (e, index, field) => {
  //   const value =
  //     field === "certificateFile" ? e.target.files[0] : e.target.value;

  //   setFormData((prev) => {
  //     const certificates = [...prev.lineUp.certificates];
  //     certificates[index][field] = value;
  //     return { ...prev, lineUp: { ...prev.lineUp, certificates } };
  //   });
  // };

  // Attach the event listener for keydown event

  // Function to get the next input element
  
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
  
    let inputValue =
      type === "file" ? (files && files.length > 0 ? files[0] : null) : value;
  
    if (name === "candidateName" ||
      name === "jobDesignation" || 
      name === "lineUp.noticePeriod" ||
      name === "currentLocation" ||
      name === "lineUp.preferredLocation"
    ) {
      // Replace multiple spaces with a single space
      inputValue = inputValue.replace(/\s{2,}/g, " ");
    }
  
    if (name === "lineUp.offersalary") {
      if (!/^\d{0,2}$/.test(value)) {
        return; // Prevent updating if the value is not numeric or exceeds 2 digits
      }
    }
    if (name === "candidateEmail") {
      if (!/^\S*$/.test(value)) {
        return; // Prevent updating if there is a space
      }
    }
  
    // Update the formData for nested objects like certificates
    setFormData((prevData) => {
      let updatedData = { ...prevData };
  
      if (name === "lineUp.holdingAnyOffer") {
        const isHoldingOffer = value === "true" || value === true;
  
        updatedData.lineUp = {
          ...prevData.lineUp,
          holdingAnyOffer: isHoldingOffer,
          ...(isHoldingOffer
            ? {} // Keep existing values if "Yes" is selected
            : {
                companyName: "",
                offersalary: "",
                negotiation: "",
                offerdetails: "",
              }), // Clear values if "No" is selected
        };
      } else if (name.startsWith("lineUp.")) {
        const nameParts = name.split(".");
        if (name.startsWith("lineUp.certificates")) {
          const index = parseInt(nameParts[1].match(/\d+/)[0], 10);
          const field = nameParts[2];
          const updatedCertificates = [...prevData.lineUp.certificates];
          updatedCertificates[index][field] = inputValue;
  
          updatedData.lineUp = {
            ...prevData.lineUp,
            certificates: updatedCertificates,
          };
        } else {
          const nestedField = nameParts[1];
          updatedData.lineUp = {
            ...prevData.lineUp,
            [nestedField]: inputValue,
          };
        }
      } else {
        updatedData[name] = inputValue;
      }
      return updatedData;
    });
  
    // Reset the error for the field that was changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  
    // Optionally validate the input
    const error = validateField(name, inputValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  

  const getNextInput = (currentElement) => {
    let nextElement = currentElement;
    while (nextElement) {
      nextElement = nextElement.nextElementSibling;
      if (
        (nextElement && nextElement.tagName === "INPUT") ||
        nextElement.tagName === "TEXTAREA" ||
        nextElement.tagName === "SELECT"
      ) {
        return nextElement;
      }
    }
    return null;
  };

  // const handleAddCertificate = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     lineUp: {
  //       ...prev.lineUp,
  //       certificates: [
  //         ...prev.lineUp.certificates,
  //         { certificateName: "", certificateFile: null },
  //       ],
  //     },
  //   }));
  // };

  // const handleRemoveCertificate = (index) => {
  //   setFormData((prev) => {
  //     const certificates = [...prev.lineUp.certificates];
  //     certificates.splice(index, 1);
  //     return { ...prev, lineUp: { ...prev.lineUp, certificates } };
  //   });
  // };

  // const handleCloseCertificate = (index) => {
  //   const updatedCertificates = formData.lineUp.certificates.filter(
  //     (_, i) => i !== index
  //   );
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     lineUp: {
  //       ...prevData.lineUp,
  //       certificates: updatedCertificates,
  //     },
  //   }));
  // };

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

  const handleInputInterview = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > 2) {
      e.target.value = inputValue.slice(0, 5);
    }
  };

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );

    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
    );
  };

  const convertNumberToWords = (currentCTCLakh, currentCTCThousand) => {
    let lakhPart = parseInt(currentCTCLakh, 10);
    let thousandPart = parseInt(currentCTCThousand, 10);
    let words = "";

    if (lakhPart > 0) {
      words += numberToWords(lakhPart) + (lakhPart === 1 ? " Lakh" : " Lakhs");
    }

    if (thousandPart > 0) {
      if (words) words += " ";
      words +=
        numberToWords(thousandPart) +
        (thousandPart === 1 ? " Thousand" : " Thousand");
    }

    return words || "Zero";
  };

  const convertNumberToWordsYesr = (experienceYear, experienceMonth) => {
    let year = parseInt(experienceYear, 10);
    let month = parseInt(experienceMonth, 10);
    let words = "";

    if (year > 0) {
      words += numberToWords(year) + (year === 1 ? " Year" : " Years");
    }

    if (month > 0) {
      if (words) words += " ";
      words += numberToWords(month) + (month === 1 ? " Month" : " Months");
    }
    return words || "Zero";
  };

  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 18);
  const minDateString = minDate.toISOString().split("T")[0];

  const startYear = 1947;
  const calendarStartDate = new Date(startYear, 0, 1);
  const calendarStartDateString = calendarStartDate.toISOString().split("T")[0];

  // const handleFileChange = async (e, index) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const updatedFormData = { ...formData };
  //       updatedFormData.lineUp.certificates[index].certificateFile =
  //         reader.result.split(",")[1];

  //       setFormData(updatedFormData);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "candidateName",
      "candidateEmail",
      "contactNumber",
      "lineUp.gender",
      "lineUp.qualification",
      "jobDesignation",
      "lineUp.yearOfPassing",
      "lineUp.experienceYear",
      "lineUp.currentCTCLakh",
      "lineUp.expectedCTCLakh",
      "lineUp.noticePeriod",
      "currentLocation",
      "lineUp.preferredLocation",
      "lineUp.resume",

      // "lineUp.availabilityForInterview",
      // "lineUp.expectedJoiningDate",
      // "lineUp.relevantExperience",
      // "lineUp.dateOfBirth",
      // "lineUp.photo",
      // "currentLocation",
      // "lineUp.companyName",
      // "lineUp.offersalary",
      // "lineUp.offerdetails",
    ];

    let isFormValid = true;
    let newErrors = {};

    requiredFields.forEach((field) => {
      let value = field.includes(".")
        ? getNestedValue(formData, field)
        : formData[field];

      let error = validateField(field, value || "");
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });
console.log(newErrors);

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
      toast.error("Please Fill All Required Fields.");
      return;
    }

    setLoading(true);

    const currentDate = new Date();
    if (formData.alternateNumber === "No") {
      formData.alternateNumber = 0;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    const updatedFormData = {
      ...formData,
      date: currentDate.toISOString().split("T")[0],
      candidateAddedTime: time,
      candidateName: formData.candidateName.trim(),
      jobDesignation: formData.jobDesignation.trim(),
      currentLocation: formData.currentLocation.trim(),

    };

    // const certificates = updatedFormData.lineUp.certificates || [];

    const dataToSend = {
      ...updatedFormData,
      lineUp: {
        ...updatedFormData.lineUp,
        // certificates: certificates.map((cert) => ({
        //   certificateName: cert.certificateName || "",
        //   certificateFile: cert.certificateFile || null,
        // })),
        resume:
          formData.lineUp.resume instanceof File
            ? await convertToBase64(formData.lineUp.resume)
            : formData.lineUp.resume,
        photo:
          formData.lineUp.photo instanceof File
            ? await convertToBase64(formData.lineUp.photo)
            : formData.lineUp.photo,
            
            noticePeriod: formData.lineUp.noticePeriod.trim(),
            preferredLocation : formData.lineUp.preferredLocation.trim(),

      },
      ...(userType === "Recruiters"
        ? { employee: { employeeId, teamLeaderId: employeeId } }
        : userType === "TeamLeader"
        ? { teamLeader: { teamLeaderId: employeeId } }
        : userType === "Manager"
        ? { manager: { managerId: employeeId } }
        : {}),
    };
console.log(dataToSend);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/save-applicant/${userType}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Form submitted successfully!");
        setIsSubmitted(true);
        navigator("/thank-you");
        setTimeout(() => {
          setFormData(initialFormData);
          setResumeSelected(false);
          setPhotoSelected(false);
          setIsSubmitted(false);
        }, 3000);
      } else {
        toast.error("Error submitting form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
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

  //Validation Rajlaxmi Jagadale 10-01-2025/13-01-2025
  const validateField = (name, value) => {
    let error = "";
    const stringValue = value ? String(value).trim() : "";

    switch (name) {
      case "candidateName":
        if (!stringValue) {
          error = "Enter your name.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Only alphabets and spaces are allowed.";
        } else if (stringValue.length > 100) {
          error = "Name cannot exceed 100 characters.";
        }
        break;
      case "currentLocation":
        if (!stringValue) {
          error = "Enter your current location.";
        } else if (stringValue.length > 100) {
          error = "Name cannot exceed 100 characters.";
        }
        break;

      case "contactNumber":
        if (!stringValue) {
          error = "Enter your contact number";
        } else if (!/^\d{6,16}$/.test(value)) {
          error = "Contact Number must be between 6 and 16 digits.";
        }
        break;

      case "lineUp.dateOfBirth":
        if (!stringValue) {
          error = "Enter your date of birth";
        } else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const month = today.getMonth() - dob.getMonth();

          if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          if (age < 18) {
            error = "You must be at least 18 years old to apply.";
          } else if (isNaN(dob.getTime())) {
            error = "Enter a valid Birth Date";
          }
        }
        break;

      case "candidateEmail":
        if (!stringValue) {
          error = "Enter your email address";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = "Enter a valid Email Address";
        } else if (value.length > 100) {
          error = "Email cannot exceed 100 characters.";
        }
        break;

      case "jobDesignation":
        if (!stringValue) {
          error = "Enter your job designation";
        }
        // else if (!/^[a-zA-Z\s]+$/.test(value)) {
        //   error = "Job designation must contain only letters and spaces.";
        // }
        // else if (value.length >= 100) {
        //   error = "Job designation cannot exceed 100 characters.";
        // }
        break;

        case "lineUp.yearOfPassing":
        if (!stringValue) {
          error = "Enter your Year Of Passing";
        }
        break;

      case "lineUp.experienceYear":
        if (!stringValue) {
          error = "Experience year is required.";
        }
        // else if (value < 0 || value > 12) {
        //   error = "Experience must be between 0 and 12 years.";
        // }
        break;

      case "lineUp.photo":
        if (!value || value.length === 0) {
          error = "Upload the photo";
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

      case "lineUp.currentCTCLakh":
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error =
            "Please enter a valid salary amount.";
        }
        break;

      case "lineUp.expectedCTCLakh":
        if (value === "" || isNaN(value) || value < 0) {
          error = "Please enter a valid expected salary";
        }
        break;

      case "lineUp.preferredLocation":
        if (!stringValue) {
          error = "Enter your preferred location";
        } else if (!/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
          error = "Only Alphabets and Spaces are allowed";
        }
        break;

      case "lineUp.noticePeriod":
        if (!stringValue) {
          error = "Enter Your Notice Period";
        } else if (!/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
          error = "Invalid Notice Period";
        }
        break;

      case "lineUp.availabilityForInterview":
        const today = new Date().toISOString().split("T")[0];
        if (!stringValue) {
          error = "Enter your available date for Interview ";
        } else if (new Date(value) < new Date(today)) {
          error = "Please select today's date or a future date.";
        }
        break;

      case "lineUp.relevantExperience":
        if (!stringValue) {
          error = "Enter relevant experience";
        } else if (!/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
          error = "Enter Relevant Experience";
        }
        break;

      case "lineUp.gender":
        if (!stringValue) {
          error = "Select Gender";
        }
        break;

      case "lineUp.disability":
        if (!stringValue) {
          error = "Select Disability";
        }
        break;

      default:
        break;
    }
    return error;
  };

  //Error msg Rajlaxmi jagadale 13-01-2025
  return (
    <div>
      {contextHolder}
      <div className="form-container-December">
        <div className="maindivheadapplicant">
        <div className="form-heading-December-main-div">
          {/* <h1 id="applicant-form-heading">Applicant Form</h1> */}
          <img className="classnameforsetwidthforlogpimage" src={newLogoHead} alt=''/>
          <div><p>157 Careers</p><p>Applicant Form</p><br/></div>
          {/* <div className="headingDivForApplicantNewHeading">
          <h3 className="newclassnamefor157header">157 Careers</h3>
          <h3 className="newclassheadapplicantfor">Applicant Form</h3>
          </div> */}
         
        </div>
        </div>
       

        {/* <div className="maincontforimagediv">
          <div className="banner-container-December">
            <img src={bannerImage} alt="Banner Image" />

            <div className="banner-description">
              <h1>157 Industries Private Limited</h1>
              <h2>Recruitments</h2>
              <h3>157 Carrers</h3>
            </div>
          </div>

        </div> */}

        <form onSubmit={handleSubmit} className="applicant-form-December">
          <div className="form-grid-December">
            <div className="form-column-December">
              <div className="form-group-December">
                <label>
                  Full name
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    name="candidateName"
                    id="candidateName"
                    value={formData.candidateName}
                    onChange={handleChange}
                    maxLength={100}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {errors.candidateName && (
                  <span className="error">{errors.candidateName}</span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Email address{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faMailBulk}
                    className="input-icon-December"
                  />
                  <input
                    type="email"
                    name="candidateEmail"
                    placeholder="Enter email Id"
                    id="candidateEmail"
                    value={formData.candidateEmail}
                    onChange={handleChange}
                    maxLength={100}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {errors.candidateEmail && (
                  <span className="error">{errors.candidateEmail}</span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Contact number{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="input-icon-December"
                  />
                  <input
                    type="number"
                    placeholder="Enter contact number"
                    name="contactNumber"
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength={16}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {errors.contactNumber && (
                  <span className="error">{errors.contactNumber}</span>
                )}
              </div>

              <div className="form-group-December">
                <div className="gender newclasstosetthisasdisplayflex">
                  <label>
                    Gender <span className="setRequiredAstricColorRed">*</span>
                  </label>
                  <div className="radio-group newclassforradiogrouantd" id="genderid">
                    <FormControlLabel
                      control={
                        <AntdRadio
                          name="lineUp.gender"
                          checked={formData.lineUp.gender === "Male"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.gender",
                                value: "Male",
                              },
                            })
                          }
                        />
                      }
                      label="Male"
                    />

                    <FormControlLabel
                      control={
                        <AntdRadio
                          name="lineUp.gender"
                          checked={formData.lineUp.gender === "Female"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.gender",
                                value: "Female",
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
                <label>Educational Qualification</label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faFile}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    name="lineUp.qualification"
                    Highest
                    id="lineUp.qualification"
                    placeholder="Enter highest qualification"
                    value={formData.lineUp.qualification}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors["lineUp.qualification"] && (
                  <span className="error">
                    {errors["lineUp.qualification"]}
                  </span>
                )}
              </div>
            </div>
            <div className="form-column-December">
              <div className="makeDisplayFlexForYopApplicantForm setWidth100formakesubdives50">
              <div className="form-group-December setwidth50onlyforthis2">
                <label>
                  Job designation{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    placeholder="Enter designation"
                    name="jobDesignation"
                    id="jobDesignation"
                    value={formData.jobDesignation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={150}
                  />
                </div>
                {errors.jobDesignation && (
                  <span className="error">{errors.jobDesignation}</span>
                )}
              </div>
              <div className="form-group-December newmargintop10pxformobile setwidth50onlyforthis2">
                <label>
                  Year Of Passout{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="input-icon-December"
                  />
                   <input
                    type="text"
                    name="lineUp.yearOfPassing"
                    Highest
                    id="lineUp.yearOfPassing"
                    placeholder="Enter Year Of Passout"
                    value={formData.lineUp.yearOfPassing}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors["lineUp.yearOfPassing"] && (
                  <span className="error">
                    {errors["lineUp.yearOfPassing"]}
                  </span>
                )}
              </div>
              </div>
             
              <div className="form-group-December">
                <label>
                  Total experience{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faKeyboard}
                    className="input-icon-December"
                  />
                  <input
                    type="number"
                    placeholder="Years"
                    name="lineUp.experienceYear"
                    id="lineUp.experienceYear"
                    value={formData.lineUp.experienceYear}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />

                  <span></span>
                  <input
                    type="number"
                    placeholder="Month"
                    name="lineUp.experienceMonth"
                    id="lineUp.experienceMonth"
                    value={formData.lineUp.experienceMonth}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      let monthValue = e.target.value;
                      if (monthValue > 11) {
                        e.target.value = 11;
                      } else if (monthValue < 0) {
                        e.target.value = 0;
                      }
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />
                </div>
                {errors["lineUp.experienceYear"] && (
                  <span className="error">
                    {errors["lineUp.experienceYear"]}
                  </span>
                )}

                {(formData.lineUp.experienceYear ||
                  formData.lineUp.experienceMonth) && (
                  <span className="experience-words">
                    {convertNumberToWordsYesr(
                      formData.lineUp.experienceYear,
                      formData.lineUp.experienceMonth
                    )}
                  </span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Current salary (LPA){" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faSackDollar}
                    className="input-icon-December"
                  />
                  <input
                    type="number"
                    placeholder="Lakhs"
                    name="lineUp.currentCTCLakh"
                    id="lineUp.currentCTCLakh"
                    value={formData.lineUp.currentCTCLakh}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />
                  <input
                    type="number"
                    name="lineUp.currentCTCThousand"
                    id="lineUp.currentCTCThousand"
                    placeholder="Thousands"
                    value={formData.lineUp.currentCTCThousand}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />
                </div>
                {(errors["lineUp.currentCTCLakh"] ||
                  errors["lineUp.currentCTCThousand"]) && (
                  <span className="error">
                    {errors["lineUp.currentCTCLakh"] ||
                      errors["lineUp.currentCTCThousand"]}
                  </span>
                )}

                {(formData.lineUp.currentCTCLakh ||
                  formData.lineUp.currentCTCThousand) && (
                    <span className="experience-words">
                    {convertNumberToWords(
                      formData.lineUp.currentCTCLakh,
                      formData.lineUp.currentCTCThousand
                    )}
                  </span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Expected salary (LPA){" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
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
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />
                  <span></span>
                  <input
                    type="number"
                    name="lineUp.expectedCTCThousand"
                    placeholder="Thousands"
                    value={formData.lineUp.expectedCTCThousand}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                    }}
                  />
                </div>
                {(errors["lineUp.expectedCTCLakh"] ||
                  errors["lineUp.expectedCTCThousand"]) && (
                  <span className="error">
                    {errors["lineUp.expectedCTCLakh"] ||
                      errors["lineUp.expectedCTCThousand"]}
                  </span>
                )}
                {(formData.lineUp.expectedCTCLakh ||
                  formData.lineUp.expectedCTCThousand) && (
                    <span className="experience-words">
                    {convertNumberToWords(
                      formData.lineUp.expectedCTCLakh,
                      formData.lineUp.expectedCTCThousand
                    )}
                  </span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Notice period{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
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
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors["lineUp.noticePeriod"] && (
                  <div className="error">{errors["lineUp.noticePeriod"]}</div>
                )}
              </div>
            </div>

            {/* <div className="form-group-December">
                <label>
                  Availability for interview{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="input-icon-December"
                  />
                  <input
                    type="date"
                    name="lineUp.availabilityForInterview"
                    placeholder="Availability For Interview"
                    id="lineUp.availabilityForInterview"
                    value={formData.lineUp.availabilityForInterview}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    max="9999-12-31"
                  />
                </div>
                {errors["lineUp.availabilityForInterview"] && (
                  <div className="error">
                    {errors["lineUp.availabilityForInterview"]}
                  </div>
                )}
              </div> */}
            {/* 
              <div className="form-group-December">
                <label>Expected joining date</label> */}
            {/* <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="input-icon-December"
                  />
                  <input
                    type="date"
                    placeholder="Expected Joining Date"
                    name="lineUp.expectedJoinDate"
                    id="lineUp.expectedJoinDate"
                    value={formData.lineUp.expectedJoinDate}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    max="9999-12-31"
                  />
                </div> */}
            {/* {errors["lineUp.expectedJoiningDate"] && (
              <div className="error">
                {errors["lineUp.expectedJoiningDate"]}
              </div>
            )} */}
            {/* </div> */}

            {/* <div className="form-group-December">
                <label>
                  Relevant experience (Years){" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    placeholder="Relevant experience"
                    name="lineUp.relevantExperience"
                    id="lineUp.relevantExperience"
                    value={formData.lineUp.relevantExperience}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength="10"
                  />
                </div>
                {errors["lineUp.relevantExperience"] && (
                  <span className="error">
                    {errors["lineUp.relevantExperience"]}
                  </span>
                )}
              </div> */}

            {/* <div className="form-group-December">
                <div className="disability">
                  <label>Disability</label>
                  <div className="radio-group" id="disabilityId">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={formData.lineUp.disability === "Yes"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.disability",
                                value: "Yes",
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
                          checked={formData.lineUp.disability === "No"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.disability",
                                value: "No",
                              },
                            })
                          }
                        />
                      }
                      label="No"
                    />
                  </div>
                  {errors["lineUp.disability"] && (
                    <span className="error">{errors["lineUp.disability"]}</span>
                  )}

                  {formData.lineUp.disability === "Yes" && (
                    <div className="disability-dropdown">
                      <label className="form-group-December">
                        Please select disability type:
                      </label>
                      <select
                        name="lineUp.disabilityDetails"
                        value={formData.lineUp.disabilityDetails || ""}
                        onChange={handleChange}
                      >
                        <option value={""} selected disabled>
                          Select Condition
                        </option>
                        <option value="heart">Heart Disease</option>
                        <option value="vision">Vision Impairment</option>
                        <option value="mobility">Mobility Impairment</option>
                        <option value="phobia">Phobia</option>
                        <option value="mental">Mental Health Issues</option>
                        <option value="handicapped">Handicapped</option>
                        <option value="leg">Leg Impairment</option>
                      </select>
                      {errors["lineUp.disabilityDetails"] && (
                        <span className="error">
                          {errors["lineUp.disabilityDetails"]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div> */}

            {/* <div className="form-group-December">
                <label>
                  Date of birth{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    className="input-icon-December"
                  />
                  <input
                    type="date"
                    name="lineUp.dateOfBirth"
                    id="lineUp.dateOfBirth"
                    placeholder="BirthDate"
                    value={formData.lineUp.dateOfBirth}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    // min={calendarStartDateString}
                    max={minDateString}
                  />
                </div>
                {errors["lineUp.dateOfBirth"] && (
                  <span className="error">{errors["lineUp.dateOfBirth"]}</span>
                )}
              </div> */}

            <div className="form-column-December">
              <div className="form-group-December">
                <label>
                  Current location
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faLocation}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    placeholder="Current location"
                    name="currentLocation"
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors.currentLocation && (
                  <span className="error">{errors.currentLocation}</span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Preferred location{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faLocationPin}
                    className="input-icon-December"
                  />
                  <input
                    type="text"
                    name="lineUp.preferredLocation"
                    id="lineUp.preferredLocation"
                    placeholder="Preferred location"
                    value={formData.lineUp.preferredLocation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
                <label>
                  {" "}
                  Upload resume{" "}
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="input-icon-December"
                  />
                  <input
                  className="paddingtopbottomforinputfilesonly"
                    style={{
                      color: "var(--text-color)",
                      padding: "7px 10px 7px 35px",
                      border: "1px solid #1d3a5d",
                      borderRadius: "10px",
                    }}
                    type="file"
                    name="lineUp.resume"
                    id="resumeUpload"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    accept=".pdf,.doc,.docx"
                  />
                  {resumeSelected && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="success-December"
                    />
                  )}
{/* <div className="createresumebutton">
<div onClick={()=>setShowCreateResumeModule(true)} >Create Resume</div>
</div> */}
                </div>
                {errors["lineUp.resume"] && (
                  <span className="error">{errors["lineUp.resume"]}</span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Upload profile photo{" "}
                  {/* <span className="setRequiredAstricColorRed">*</span> */}
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon
                    icon={faPhotoFilm}
                    className="input-icon-December"
                  />
                  <input
                    style={{
                      color: "var(--text-color)",
                      padding: "7px 10px 7px 35px",
                    }}
                    type="file"
                    name="lineUp.photo"
                    id="lineUp.photo"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    accept="image/*"
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

<div className="forNewUanandRefFlex">


              <div className="form-group-December forNewUanandRefFlexwidth50">
                <label>
                  UAN Number 
                </label>
                <div className="input-with-icon-December">

                  <input
                    type="text"
                    name="lineUp.candidateUanNumber"
                    id="uanNumber"
                    placeholder="Enter UAN Number"
                    value={formData.lineUp.candidateUanNumber}
                    onChange={handleChange}

                    maxLength={12} // Assuming UAN has 12 digits
                  />
                </div>
                {errors.candidateUanNumber && <span className="error">{errors.candidateUanNumber}</span>}
              </div>

              <div className="form-group-December forNewUanandRefFlexwidth50 setMargintop10pxforref">
              <label>
                Reference
              </label>
              <div className="input-with-icon-December">

                <input
                  type="text"
                  name="lineUp.candidateReference"
                  id="reference"
                  placeholder="Enter reference name"
                  value={formData.lineUp.candidateReference}
                  onChange={handleChange}

                  maxLength={100}
                />
              </div>

            </div>

            </div>

</div>
           

          </div>

          {/* <div className="form-group-December">
                <div className="form-December-certificate">
                  <label>Have you done any courses and certificates ? </label>

                  <div className="radio-group" id="certificationRadio">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={doneAnyCertification === true}
                          onChange={() => {
                            SetDoneAnyCertification(true);
                          }}
                        />
                      }
                      label="Yes"
                    />

                    <FormControlLabel
                      control={
                        <Radio
                          checked={doneAnyCertification === false}
                          onChange={() => {
                            SetDoneAnyCertification(false);
                            formData.lineUp.certificates = [
                              { certificateName: "", certificateFile: null },
                            ];
                          }}
                        />
                      }
                      label="No"
                    />
                  </div>

                  {doneAnyCertification && (
                    <>
                      {formData.lineUp.certificates.map((cert, index) => (
                        <div key={index} className="certificate-item-December">
                          <div className="certificate-inputs-December-sub-div">
                            <div className="input-with-icon-December">
                              <FontAwesomeIcon
                                icon={faCertificate}
                                className="input-icon-December"
                              />
                              <input
                                type="text"
                                name={`lineUp.certificates[${index}].certificateName`}
                                placeholder="Certificate name"
                                value={cert.certificateName}
                                onChange={handleChange}
                                ref={(el) =>
                                  (inputRefs.current[index * 2] = el)
                                }
                                maxLength={100}
                              />
                            </div>
                            <div
                              className="input-with-icon-December"
                              id="input-with-icon-December-certificates"
                            >
                              <FontAwesomeIcon
                                icon={faUpload}
                                className="input-icon-December"
                              />
                              <input
                                type="file"
                                id="certificateFile"
                                name={`lineUp.certificates[${index}].certificateFile`}
                                onChange={(e) => handleFileChange(e, index)}
                                ref={(el) =>
                                  (inputRefs.current[index * 2 + 1] = el)
                                }
                              />
                            </div>
                          </div>

                          <div className="certificate-buttons-December-button-div">
                            <button
                              type="button"
                              onClick={() => handleCloseCertificate(index)}
                              className="remove-btn"
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-btn-icon"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={handleAddCertificate}
                              className="remove-btn"
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="remove-btn-icon"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="form-group-December">
                <label>Are you holding any offer ? </label>
                <div className="radio-group" id="holdinganyoffer">
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
                    <label>Company name</label>
                    <div className="input-with-icon-December">
                      <FontAwesomeIcon
                        icon={faIndustry}
                        className="input-icon-December"
                      />
                      <input
                        type="text"
                        name="lineUp.companyName"
                        id="lineUp.companyName"
                        placeholder="company Name"
                        value={formData.lineUp.companyName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        maxLength={100}
                        className="form-textfield"
                      />
                    </div>
                    {errors["lineUp.companyName"] && (
                      <div className="error">
                        {errors["lineUp.companyName"]}
                      </div>
                    )}
                  </div>
                  <br></br>

                  <div className="form-group-December">
                    <label>Offer salary (LPA)</label>
                    <div className="input-with-icon-December">
                      <FontAwesomeIcon
                        icon={faWallet}
                        className="input-icon-December"
                      />
                      <input
                        type="text"
                        name="lineUp.offersalary"
                        id="lineUp.offersalary"
                        placeholder="Salary (Lakh)"
                        value={formData.lineUp.offersalary}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="form-textfield"
                        maxLength={2}
                      />
                    </div>
                    {errors["lineUp.offersalary"] && (
                      <div className="error">
                        {errors["lineUp.offersalary"]}
                      </div>
                    )}
                  </div>
                  <br></br>

                  <div className="form-group-December">
                    <label>Offer details</label>
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
                      <div className="error">
                        {errors["lineUp.offerdetails"]}
                      </div>
                    )}
                  </div>
                </div>
              )} */}

          {/* <div className="input-with-icon-December">
                <div className="form-group-December" style={{ width: "400px" }}>
                  <label>Do you have a WhatsApp number ? </label>
                  <div className="radio-group" id="whatsappnumberid">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={whatsappSelected === true}
                          onChange={() => {
                            setWhatsappSelected(true);
                            setFormData({
                              ...formData,
                              alternateNumber: "",
                            });
                          }}
                        />
                      }
                      label="Yes"
                    />

                    <FormControlLabel
                      control={
                        <Radio
                          checked={whatsappSelected === false}
                          onChange={() => {
                            setWhatsappSelected(false);
                            setFormData({
                              ...formData,
                              alternateNumber: 0, 
                            });
                          }}
                        />
                      }
                      label="No"
                    />
                  </div>

                  {whatsappSelected && (
                    <div className="form-group-December">
                      <label>WhatsApp number:</label>
                      <div className="input-with-icon-December">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="input-icon-December"
                        />
                        <input
                          type="number"
                          name="alternateNumber"
                          id="alternateNumber"
                          value={formData.alternateNumber}
                          placeholder="Enter WhatsApp Number"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 13) {
                              handleChange({
                                target: {
                                  name: "alternateNumber",
                                  value,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div> */}

          {/* <div className="form-group-December">
                <div className="negotiation">
                  <label>Are you ready to negotiation ? </label>
                  <div className="radio-group">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={formData.lineUp.negotiation === "Yes"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.negotiation",
                                value: "Yes",
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
                          checked={formData.lineUp.negotiation === "No"}
                          onChange={() =>
                            handleChange({
                              target: {
                                name: "lineUp.negotiation",
                                value: "No",
                              },
                            })
                          }
                        />
                      }
                      label="No"
                    />
                  </div>
                  {errors["lineUp.negotiation"] && (
                    <span className="error">
                      {errors["lineUp.negotiation"]}
                    </span>
                  )}
                </div>
              </div> */}

          <div className="click-December">
            <button
              type="submit"
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ffffff" : "#1d3a5d",
                color: loading ? "#1d3a5d" : "#ffffff",
              }}
            >
              {" "}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>


          <div className="reference-links">
          <p>
    {/* <b className="newclassforfontsizechnges">Visit: {" "} </b>
    <a href="https://157careers.in/" target="_blank" rel="noopener noreferrer" className="newclassnameforlinkblue newclassforfontsizechnges">
      www.157careers.in
    </a> */}
  
 
    <b className="newclassforfontsizechnges"
    >Follow LinkedIn Page:  {" "} </b>
    <a href="https://www.linkedin.com/company/157careers/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="newclassnameforlinkblue newclassforfontsizechnges">
    157 Careers Profile
    </a>
  </p>
  {/* <p>© 2025 157 Industries PVT. LTD. All rights reserved.</p> */}
</div>


        </form>
        {loading && (
          <div className="SCE_Loading_Animation">
            <Loader size={50} color="#ffb281" />
          </div>
        )}
        <br />
      </div>

      <Modal title="Create Resume" open={showCreateResumeModule} 
      // onOk={handleOk} 
      onCancel={()=>setShowCreateResumeModule(false)}
   width={"auto"}
      >
      <>
      <div className="cvtemplatemaindivinapplicantfor">
        <CvTemplate cvFromApplicantForm ={cvFromApplicantsForm} />
      </div>
      </>
      </Modal>
    </div>
  );
}

export default ApplicantForm2;
