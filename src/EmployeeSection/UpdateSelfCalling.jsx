import React, { useState, useEffect } from "react";
// import "../EmployeeSection/CallingTrackerForm.css";
import { useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import uploadingResumeGif from "../assets/uploadingResumeMotion.gif";
import "../EmployeeSection/UpdateSelfCalling.css";
import { API_BASE_URL } from "../api/api";
import { Button, Modal } from "react-bootstrap";
import CandidateHistoryTracker from "../CandidateSection/candidateHistoryTracker";
// line 14 to 15 added by sahil karnekar date 17-10-2024
import { Checkbox, Progress, Radio, TimePicker, Upload } from "antd";
import dayjs from "dayjs";
import { getSocket } from "../EmployeeDashboard/socket";
import uploadingResumeStatic from "../assets/uploadStaticPngFile.png";
import { Button as ButtonAntd } from "antd";
import { convertNumberToWords } from "./convertNumberToWords";
import { getDailyworkData, putDailyworkData } from "../HandlerFunctions/getDailyWorkDataByIdTypeDateReusable";
import { getFormattedDateISOYMDformat } from "./getFormattedDateTime";
import { useDispatch } from "react-redux";
import { setTriggerFetch } from "../sclices/triggerSlice";
// this line added by sahil karnekar on date 14-01-2024

const UpdateSelfCalling = ({
  initialData,
  candidateId,
  onCancel,
  onsuccessfulDataUpdation,
  onSuccess,
  fromCallingList,
  loginEmployeeName,
  triggerFetch,
}) => {
  const [isOtherEducationSelected, setIsOtherEducationSelected] =
    useState(false);
  const [callingTracker, setCallingTracker] = useState({
    date: new Date().toISOString().slice(0, 10),
    candidateId: candidateId,
    candidateAddedTime: "",
    recruiterName: "",
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
    selectYesOrNo: "No",
    callingFeedback: "",
    emailStatus:"No",
    lineUp: {
      companyName: "",
      experienceYear: "",
      experienceMonth: "",
      relevantExperience: "",
      currentCTCLakh: "",
      currentCTCThousand: "",
      expectedCTCLakh: "",
      expectedCTCThousand: "",
      
      dateOfBirth: "",
      gender: "",
      qualification: "",
      yearOfPassing: "",
      extraCertification: "",
      feedBack: "",
      holdingAnyOffer: "",
      offerLetterMsg: "",
      noticePeriod: "",
      msgForTeamLeader: "",
      availabilityForInterview: "",
      interviewTime: "",
      finalStatus: "",
    },
  });

  const initialLineUpState = {
    companyName: "",
    experienceYear: "",
    experienceMonth: "",
    emailStatus:"No",
    relevantExperience: "",
    currentCTCLakh: "",
    currentCTCThousand: "",
    expectedCTCLakh: "",
    expectedCTCThousand: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    yearOfPassing: "",
    extraCertification: "",
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

  const { employeeId } = useParams();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [candidateFetched, setCandidateFetched] = useState(initialData);
  const [showAlert, setShowAlert] = useState(false);
  const [requirementOptions, setRequirementOptions] = useState([]);
  const [isOtherLocationSelected, setIsOtherLocationSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [convertedExpectedCTC, setConvertedExpectedCTC] = useState("");
  const [convertedCurrentCTC, setConvertedCurrentCTC] = useState("");
  const [startpoint, setStartPoint] = useState("");
  const [endpoint, setendPoint] = useState("");
  const [lineUpData, setLineUpData] = useState(initialLineUpState);
  const { userType } = useParams();
  const [uploadingResumeNewState, setUploadingResumeNewState] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorForDOB, setErrorForDOB] = useState("");
  const [errorInterviewSlot, seterrorInterviewSlot] = useState("");
  const [socket, setSocket] = useState(null);
  const [displaySourceOthersInput, setDisplaySourceOthersInput] = useState(false);
  const dispatch = useDispatch();
  const [displayOtherInputForCallingRemark, setDisplayOtherInputForCallingRemark] = useState(false);
  const [displayEmailConfirm, setDisplayEmailConfirm] = useState(false);
  // updated by sahil karnekar date 18-10-2024
  const today = new Date();
  const maxDate = new Date(today.setFullYear(today.getFullYear() - 18))
    .toISOString()
    .split("T")[0]; // Format as YYYY-MM-DD

  // update validatecallingtrackermethod by sahil karnekar date 16-12-2024
  const validateCallingTracker = () => {
    let newErrors = {};
    if (!callingTracker.candidateName) {
      newErrors.candidateName = "Candidate Name is required";
      newErrors.candidateNameStar = "*";
    }
    if (!callingTracker.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
      newErrors.contactNumberStar = "*";
    }
    if (!callingTracker.sourceName || callingTracker.sourceName === "others") {
      newErrors.sourceName = "Source Name is required";
      newErrors.sourceNameStar = "*";
    }
    // line number 135 to 144 added validation by sahil karnekar date 21-10-2024
    const emailPattern =
      /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    if (!callingTracker.candidateEmail) {
      newErrors.candidateEmail = "Email is required";
      newErrors.candidateEmailStar = "*";
    } else if (!emailPattern.test(callingTracker.candidateEmail)) {
      // If email format is invalid, show an error
      newErrors.candidateEmail =
        "Invalid email format. Ensure proper structure (no spaces, valid characters, single @, valid domain).";
    } else {
      delete newErrors.candidateEmail;
      delete newErrors.candidateEmailStar;
    }
    if (!callingTracker.callingFeedback || callingTracker.callingFeedback === "others") {
      newErrors.callingFeedback = "Calling Feedback is required";
      newErrors.callingFeedbackStar = "*";
    }
    return newErrors;
  };

  // updated by sahil karnekar date 16-12-2024
  const validateLineUpData = () => {
    let newErrors = {};
    if (callingTracker.selectYesOrNo === "Interested") {
      if (!callingTracker.requirementId) {
        newErrors.requirementId = "Job Id is required";
        newErrors.requirementIdStar = "*";
      }
      if (!callingTracker.lineUp.experienceYear) {
        newErrors.experienceYear = "Experience Year is required";
        newErrors.experienceYearStar = "*";
      }
      if (!callingTracker.lineUp.experienceMonth) {
        newErrors.experienceMonth = "Experience Month is required";
        newErrors.experienceMonthStar = "*";
        // line 155 to 158 added by sahil karnekar date 18-10-2024
      } else if (parseInt(callingTracker.lineUp.experienceMonth, 10) > 11) {
        newErrors.experienceMonth = "Experience in months cannot exceed 11.";
      }
      if (!callingTracker.lineUp.relevantExperience) {
        newErrors.relevantExperience = "Relevant Experience is required";
        newErrors.relevantExperienceStar = "*";
      }
      if (!callingTracker.currentLocation) {
        newErrors.currentLocation = "Location is required";
        newErrors.currentLocationStar = "*";
      }
      if (!callingTracker.lineUp.qualification) {
        newErrors.qualification = "Education is required";
        newErrors.qualificationStar = "*";
      }
      if (!callingTracker.communicationRating) {
        newErrors.communicationRating = "Communication Rating is required";
        newErrors.communicationRatingStar = "*";
      }
      if (
        !callingTracker.lineUp.expectedCTCLakh &&
        !callingTracker.lineUp.expectedCTCThousand
      ) {1
        newErrors.expectedCTCLakh = "Expected CTC is required";
        newErrors.expectedCTCLakhStar = "*";
      }
      if (
        !callingTracker.lineUp.currentCTCLakh &&
        !callingTracker.lineUp.currentCTCThousand
      ) {
        newErrors.currentCTCLakh = "Current CTC is required";
        newErrors.currentCTCLakhStar = "*";
      }
      if (!callingTracker.lineUp.holdingAnyOffer) {
        newErrors.holdingAnyOffer = "Holding Any Offer is required";
        newErrors.holdingAnyOfferStar = "*";
      }
      if (!callingTracker.lineUp.finalStatus) {
        newErrors.finalStatus = "Please Select Option";
      }
      if (!callingTracker.lineUp.noticePeriod) {
        newErrors.noticePeriod = "Notice Period is required";
        newErrors.noticePeriodStar = "*";
      }
    }
    return newErrors;
  };
  useEffect(() => {
    fetchCandidateData(candidateId);
    fetchRequirementOptions();
  }, [candidateId]);

  useEffect(() => {
    if (initialData) {
      setCallingTracker(initialData);
      setRecruiterName(initialData.recruiterName);
      setCandidateFetched(true);
      const updatedCallingTracker = { ...initialCallingTrackerState };
      const updatedLineUpData = { ...initialLineUpState };
      console.log(initialData.sourceName);
   
      
    }
  }, [initialData]);
console.log(errors);

  const fetchCandidateData = async (candidateId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/specific-data/${candidateId}`
      );
      const data = await response.json();
      setCallingTracker(data);
      console.log(data);
      const validSources = ["LinkedIn", "Naukri", "Indeed", "Times", "Social Media", "Company Page", "Excel", "Friends"];
      const validCallRemarks = ["Call Done", "Asked for Call Back", "No Answer", "Network Issue", "Invalid Number", "Need to call back", "Do not call again"];
      if (data.sourceName !== "" && !validSources.includes(data.sourceName)) {
        setDisplaySourceOthersInput(true);
      }
      if (data.callingFeedback !== "" && !validCallRemarks.includes(data.callingFeedback)) {
        setDisplayOtherInputForCallingRemark(true);
      }
      
      if (data.lineUp.resume !== "") {
        setResumeUploaded(true);
        setUploadProgress(100);
        setResumeFileName(`${data.candidateName}_${data.designation}_Resume.pdf`);
      }
      if (data.lineUp.resume === undefined) {
        setResumeUploaded(false);
      }
      if (data.lineUp.resume === "") {
        setResumeUploaded(false);
      }
      setCandidateFetched(true);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      const { data } = response;
      setRequirementOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sourceName" && value === "others") {
      setDisplaySourceOthersInput(true);
    } else if (name === "sourceName" && value !== "others") {
      setDisplaySourceOthersInput(false);
    }

    if (name === "callingFeedback" && value === "others") {
      setDisplayOtherInputForCallingRemark(true);
    } else if (name === "callingFeedback" && value !== "others") {
      setDisplayOtherInputForCallingRemark(false);
    }
    
    // added by sahil karnekar date 16-12-2024
    const isNotInterested =
      name === "selectYesOrNo"
        ? value !== "Interested"
        : callingTracker.selectYesOrNo !== "Interested";
        

    if (
      (name === "candidateName" || name === "currentLocation") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return;
    }
    if (
      (name === "contactNumber" ||
        name === "alternateNumber" ||
        name === "lineUp.experienceYear" ||
        name === "lineUp.experienceMonth" ||
        name === "lineUp.expectedCTCLakh" ||
        name === "lineUp.expectedCTCThousand" ||
        name === "lineUp.currentCTCLakh" ||
        name === "lineUp.currentCTCThousand") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    if (name === "lineUp.dateOfBirth") {
      if (value > maxDate) {
        setErrorForDOB("MaxDate" + maxDate);
      } else {
        setErrorForDOB("");
      }
    }

    if (name === "lineUp.yearOfPassing") {
      // Allow only 4 digits
      if (!/^\d{0,4}$/.test(value)) {
        return; // Prevent updating state if the value doesn't match
      }

      // Check if the value is within the required range
      const year = parseInt(value, 10);
      if (value.length === 4 && (year < 1947 || year > 2025)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          yearOfPassing: "Year of Passing must be between 1947 and 2025.",
        }));
        return; // Prevent updating state if the year is out of range
      } else {
        // Clear error if valid
        setErrors((prevErrors) => {
          const { yearOfPassing, ...restErrors } = prevErrors; // Clear the yearOfPassing error if valid
          return restErrors;
        });
      }

      // Set the value in the state
      setCallingTracker((prevState) => {
        const lineUpField = name.split(".")[1];
        return {
          ...prevState,
          lineUp: {
            ...prevState.lineUp,
            [lineUpField]: value,
          },
        };
      });
    }
 

    setCallingTracker((prevState) => {
      if (name.includes("lineUp")) {
        const lineUpField = name.split(".")[1];
        return {
          ...prevState,
          lineUp: {
            ...prevState.lineUp,
            [lineUpField]: value,
          },
        };
      } else {
        return {
          ...prevState,
          [name]: value,
        };
      }
    });
    // line 290 to 15 added by sahil karnekar date 17-10-2024
    validateRealTime(name, value, isNotInterested);
  };
console.log(callingTracker.alternateNumber);
console.log(callingTracker.contactNumber);


  const validateRealTime = (name, value, isNotInterested) => {
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      // line 375 to 461 added by sahil karnekar date 16-12-2024
      if (isNotInterested) {
        const fieldsToClear = [
          "yearOfPassing",
          "yearOfPassingStar",
          "currentLocation",
          "currentLocationStar",
          "communicationRating",
          "communicationRatingStar",
          "experienceYear",
          "experienceYearStar",
          "experienceMonth",
          "experienceMonthStar",
          "requirementId",
          "requirementIdStar",
          "relevantExperience",
          "relevantExperienceStar",
          "noticePeriod",
          "noticePeriodStar",
          "currentCTCLakh",
          "currentCTCLakhStar",
          "expectedCTCLakh",
          "expectedCTCLakhStar",
          "holdingAnyOffer",
          "holdingAnyOfferStar",
          "qualification",
        ];
        fieldsToClear.forEach((field) => delete newErrors[field]);
      }

      if (isNotInterested === false) {
        if (!callingTracker.requirementId) {
          newErrors.requirementId = "Job Id is required";
          newErrors.requirementIdStar = "*";
        }
        if (!callingTracker.lineUp.experienceYear) {
          newErrors.experienceYear = "Experience Year is required";
          newErrors.experienceYearStar = "*";
        }
        if (!callingTracker.lineUp.experienceMonth) {
          newErrors.experienceMonth = "Experience Month is required";
          newErrors.experienceMonthStar = "*";
          // line 155 to 158 added by sahil karnekar date 18-10-2024
        } else if (parseInt(callingTracker.lineUp.experienceMonth, 10) > 11) {
          newErrors.experienceMonth = "Experience in months cannot exceed 11.";
        }
        if (!callingTracker.lineUp.relevantExperience) {
          newErrors.relevantExperience = "Relevant Experience is required";
          newErrors.relevantExperienceStar = "*";
        }
        if (!callingTracker.currentLocation) {
          newErrors.currentLocation = "Location is required";
          newErrors.currentLocationStar = "*";
        }
        if (!callingTracker.lineUp.qualification) {
          newErrors.qualification = "Education is required";
          newErrors.qualificationStar = "*";
        }
        if (!callingTracker.communicationRating) {
          newErrors.communicationRating = "Communication Rating is required";
          newErrors.communicationRatingStar = "*";
        }
        if (
          !callingTracker.lineUp.expectedCTCLakh &&
          !callingTracker.lineUp.expectedCTCThousand
        ) {
          newErrors.expectedCTCLakh = "Expected CTC is required";
          newErrors.expectedCTCLakhStar = "*";
        }
        if (
          !callingTracker.lineUp.currentCTCLakh &&
          !callingTracker.lineUp.currentCTCThousand
        ) {
          newErrors.currentCTCLakh = "Current CTC is required";
          newErrors.currentCTCLakhStar = "*";
        }
        if (!callingTracker.lineUp.holdingAnyOffer) {
          newErrors.holdingAnyOffer = "Holding Any Offer is required";
          newErrors.holdingAnyOfferStar = "*";
        }
        if (!callingTracker.lineUp.finalStatus) {
          newErrors.finalStatus = "Please Select Option";
        }
        if (!callingTracker.lineUp.noticePeriod) {
          newErrors.noticePeriod = "Notice Period is required";
          newErrors.noticePeriodStar = "*";
        }
      }
      //  this conditional code updated by sahil karnekar date 16-12-2024
      if (name === "candidateName") {
        if (value === "") {
          newErrors.candidateName = "Candidate Name is required";
          newErrors.candidateNameStar = "*";
        } else {
          delete newErrors.candidateName;
          delete newErrors.candidateNameStar;
        }
      }
      if (name === "candidateEmail") {
        // const emailPattern =
        //   /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
          // Rajlaxmi Jagadale Added Email Validation Date-24-01-25 line263 to 312
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === "") {
          newErrors.candidateEmail = "Candidate Email is required";
          newErrors.candidateEmailStar = "*";
        } else if (!emailPattern.test(value)) {
          // If email format is invalid, show an error
          newErrors.candidateEmail =
            "Invalid email format. Ensure proper structure (no spaces, valid characters, single @, valid domain).";
        } else {
          delete newErrors.candidateEmail;
          delete newErrors.candidateEmailStar;
        }
      }
      if (name === "contactNumber") {
        if (value === "") {
          newErrors.contactNumber = "Contact Number is required";
          newErrors.contactNumberStar = "*";
        } else {
          delete newErrors.contactNumber;
          delete newErrors.contactNumberStar;
        }
      }
      if (name === "sourceName") {
        if (value === "") {
          newErrors.sourceName = "source Name is required";
          newErrors.sourceNameStar = "*";
        } else {
          delete newErrors.sourceName;
          delete newErrors.sourceNameStar;
        }
      }
      if (name === "callingFeedback") {
        if (value === "") {
          newErrors.callingFeedback = "calling Feedback is required";
          newErrors.callingFeedbackStar = "*";
        } else {
          delete newErrors.callingFeedback;
          delete newErrors.callingFeedbackStar;
        }
      }
      if (callingTracker.selectYesOrNo === "Interested") {
        setErrors((prevErrors) => {
          let newErrors = { ...prevErrors }; // Copy the previous errors

          if (name === "currentLocation") {
            if (value === "") {
              newErrors.currentLocation = "Location is required";
              newErrors.currentLocationStar = "*";
            } else {
              delete newErrors.currentLocation; // Clear the error if value is valid
              delete newErrors.currentLocationStar;
            }
          }
          if (name === "communicationRating") {
            if (value === "") {
              newErrors.communicationRating =
                "Communicaation Rating is required";
              newErrors.communicationRatingStar = "*";
            } else {
              delete newErrors.communicationRating; // Clear the error if value is valid
              delete newErrors.communicationRatingStar;
            }
          }

          if (name.startsWith("lineUp.")) {
            const fieldName = name.split(".")[1]; // Get the specific field name

            if (fieldName === "experienceYear") {
              if (value === "") {
                newErrors.experienceYear = "Experience Year is required";
                newErrors.experienceYearStar = "*";
              } else {
                delete newErrors.experienceYear;
                delete newErrors.experienceYearStar;
              }
            }
            if (fieldName === "experienceMonth") {
              if (value === "") {
                newErrors.experienceMonth = "Experience Month is required";
                newErrors.experienceMonthStar = "*";
              } else {
                const experienceMonthValue = parseInt(value, 10);
                delete newErrors.experienceMonthStar;
                if (experienceMonthValue > 11) {
                  newErrors.experienceMonth =
                    "Experience in months cannot exceed 11.";
                } else {
                  delete newErrors.experienceMonth; // Clear the error if value is valid
                }
              }
            }

            if (fieldName === "relevantExperience") {
              if (value === "") {
                newErrors.relevantExperience =
                  "relevant Experience is required";
                newErrors.relevantExperienceStar = "*";
              } else {
                delete newErrors.relevantExperience;
                delete newErrors.relevantExperienceStar;
              }
            }
            if (fieldName === "noticePeriod") {
              if (value === "") {
                newErrors.noticePeriod = "Notice Period is required";
                newErrors.noticePeriodStar = "*";
              } else {
                delete newErrors.noticePeriod;
                delete newErrors.noticePeriodStar;
              }
            }
            if (fieldName === "currentCTCLakh") {
              if (value === "") {
                newErrors.currentCTCLakh = "currentCTCLakh is required";
                newErrors.currentCTCLakhStar = "*";
              } else {
                delete newErrors.currentCTCLakh;
                delete newErrors.currentCTCLakhStar;
              }
            }
            if (fieldName === "expectedCTCLakh") {
              if (value === "") {
                newErrors.expectedCTCLakh = "expectedCTCLakh is required";
                newErrors.expectedCTCLakhStar = "*";
              } else {
                delete newErrors.expectedCTCLakh;
                delete newErrors.expectedCTCLakhStar;
              }
            }
            if (fieldName === "holdingAnyOffer") {
              if (value === "") {
                newErrors.holdingAnyOffer = "holdingAnyOffer is required";
                newErrors.holdingAnyOfferStar = "*";
              } else {
                delete newErrors.holdingAnyOffer;
                delete newErrors.holdingAnyOfferStar;
              }
            }

            // Add more validations for lineUp fields here if needed
          }

          return newErrors; // Return the updated errors
        });
      }
      return newErrors;
    });
  };
  const [displaySameAsContactField, setDisplaySameAsContactField] =
  useState(false);
  const handleDisplaySameAsContactText = () => {
    if (callingTracker.contactNumber !== "") {
      setDisplaySameAsContactField(true);
    }
    if (callingTracker.contactNumber === undefined) {
      console.log("Please Select Contact number First");
      setDisplaySameAsContactField(false);
    }
  };
  const handleEducationChange = (e) => {
    const value = e.target.value;

    if (callingTracker.selectYesOrNo === "Interested") {
      setErrors((prevErrors) => {
        let newErrors = { ...prevErrors }; // Copy the previous errors

        if (value === "") {
          newErrors.qualification = "Education is required";
          newErrors.qualificationStar = "*";
        } else {
          delete newErrors.qualification; // Clear the error if value is valid
          delete newErrors.qualificationStar;
        }

        return newErrors; // Return the updated errors
      });
    }

    // line 462 to 504 added by sahil karnekar date 17-10-2024
    if (value === "Other") {
      setIsOtherEducationSelected(true);
      setCallingTracker((prevState) => ({
        ...prevState,
        lineUp: {
          ...prevState.lineUp,
          qualification: "", // Clear qualification if "Other" is selected
        },
      }));
    } else {
      setIsOtherEducationSelected(false);
      setCallingTracker((prevState) => ({
        ...prevState,
        lineUp: {
          ...prevState.lineUp,
          qualification: value, // Set qualification to the selected value
        },
      }));
    }
  };

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

const handleDisplayConfirmBox = ()=>{
  setDisplayEmailConfirm(true);
}

  const [dailyWorkDataNew, setDailyWorkDataNew] = useState(null); // State to store getData
  const currentDateNewGlobal = getFormattedDateISOYMDformat();
    const getDailyworkDataFunc = async()=>{
      try {
        const getData =await getDailyworkData(employeeId, userType, currentDateNewGlobal);
        console.log(getData);
        
        setDailyWorkDataNew(getData);
      } catch (error) {
        console.log(error); 
      }
    }
    useEffect(()=>{
      getDailyworkDataFunc();
    },[]);
  




  const handleSubmit = async (e) => {
    setDisplayEmailConfirm(false);
    e.preventDefault();
    setCallingTracker({
      ...callingTracker,
      // recruiterName: loginEmployeeName, 
    });

    console.log("Recruiter Name to be sent:", callingTracker.recruiterName); // Print recruiterName

    // Validate the form data before submitting
    const validationErrors = validateCallingTracker();
    const validationErrorsForLineup = validateLineUpData();
    // updated by sahil karnekar date 17-12-2024
    if (callingTracker.lineUp.yearOfPassing) {
      const year = parseInt(callingTracker.lineUp.yearOfPassing, 10);
      if (year < 1947 || year > 2025) {
        validationErrors.yearOfPassing =
          "Year of Passing must be between 1947 and 2025.";
      }
    }

    // Combine all errors
    const combinedErrors = {
      ...validationErrors,
      ...validationErrorsForLineup,
    };

    // Check if there are any errors before submission
    if (Object.keys(combinedErrors).length > 0) {
      setErrors(combinedErrors);
      return; // Prevent submission if errors exist
    }
    try {
      // Clear all existing errors at the start of submission added by sahil karnekar date 21-10-2024
      setErrors({});
      // this line added by sahil karnekar to trim the candidate name
      const forTrimCandidateName = callingTracker.candidateName.trim();

      const dataToUpdate = {
        ...callingTracker,
        candidateName: forTrimCandidateName,
        // recruiterName: loginEmployeeName,
        candidateAddedTime: callingTracker.candidateAddedTime,
        lineUp: {
          ...callingTracker.lineUp,
          emailStatus: callingTracker.lineUp.emailStatus ? callingTracker.lineUp.emailStatus  : callingTracker.lineUp.emailStatus === null ? "No" : "No",
        },
      };

      console.log(dataToUpdate);
      const response = await fetch(
        `${API_BASE_URL}/update-calling-data/${candidateId}/${employeeId}/${userType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

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

      console.log(getFormattedDateTime()); // Example output: Date: 2024-1-1, Time: 4:05 PM

      const callingTrackerObjectForEmit = {
        employeeId:employeeId,
        userType: userType,
        date: callingTracker.date,
        candidateId: callingTracker.candidateId,
        candidateAddedTime: getFormattedDateTime(),
        recruiterName: loginEmployeeName, 
        candidateName: callingTracker.candidateName.trim(),
        candidateEmail: callingTracker.candidateEmail,
        jobDesignation: callingTracker.jobDesignation,
        requirementId: callingTracker.requirementId,
        requirementCompany: callingTracker.requirementCompany,
        sourceName: callingTracker.sourceName,
        contactNumber: callingTracker.contactNumber,
        incentive: callingTracker.incentive,
        alternateNumber: callingTracker.alternateNumber,
        currentLocation: callingTracker.currentLocation,
        fullAddress: callingTracker.fullAddress,
        communicationRating: callingTracker.communicationRating,
        selectYesOrNo: callingTracker.selectYesOrNo,
        callingFeedback: callingTracker.callingFeedback,
        jobRole : callingTracker.jobRole,
        employee: {
          employeeId: callingTracker.employeeId,
        },
        lineUp: {
          companyName: callingTracker.lineUp.companyName,
          experienceYear: callingTracker.lineUp.experienceYear,
          experienceMonth: callingTracker.lineUp.experienceMonth,
          relevantExperience: callingTracker.lineUp.relevantExperience,
          currentCTCLakh: callingTracker.lineUp.currentCTCLakh,
          currentCTCThousand: callingTracker.lineUp.currentCTCThousand,
          expectedCTCLakh: callingTracker.lineUp.expectedCTCLakh,
          expectedCTCThousand: callingTracker.lineUp.expectedCTCThousand,
          dateOfBirth: callingTracker.lineUp.dateOfBirth,
          gender: callingTracker.lineUp.gender,
          qualification: callingTracker.lineUp.qualification,
          yearOfPassing: callingTracker.lineUp.yearOfPassing,
          extraCertification: callingTracker.lineUp.extraCertification,
          feedBack: callingTracker.lineUp.feedBack,
          holdingAnyOffer: callingTracker.lineUp.holdingAnyOffer,
          offerLetterMsg: callingTracker.lineUp.offerLetterMsg,
          noticePeriod: callingTracker.lineUp.noticePeriod,
          msgForTeamLeader: callingTracker.lineUp.msgForTeamLeader,
          availabilityForInterview:
            callingTracker.lineUp.availabilityForInterview,
          interviewTime: callingTracker.lineUp.interviewTime,
          finalStatus: callingTracker.lineUp.finalStatus,
        },
      };
      if (callingTracker.selectYesOrNo === "Interested") {
        console.log("emit called", callingTrackerObjectForEmit);
        socket.emit("update_candidate", callingTrackerObjectForEmit);
            try {
                  if (!dailyWorkDataNew) {
                    throw new Error("dailyWorkDataNew is null or undefined");
                  }
                
                  const getDataForUpdate = {
                    attendanceRole: {
                      ...(userType === "Recruiters" && { employee: { employeeId } }),
                      ...(userType === "TeamLeader" && { teamLeader: { employeeId } }),
                      ...(userType === "Manager" && { manager: { employeeId } })
                    },
                    dailyArchived: (dailyWorkDataNew?.dailyArchived || 0) + 1, // Prevents NaN if value is null
                    dailyPending: (dailyWorkDataNew?.dailyPending || 0) - 1,
                    dayPresentStatus: ((dailyWorkDataNew?.dailyArchived ?? 0) + 1) >= 5 ? "Yes" : "No"
                  };
                
                  console.log(getDataForUpdate);
                
                  const putData = await putDailyworkData(
                    employeeId,
                    userType,
                    currentDateNewGlobal,
                    getDataForUpdate
                  );
                  dispatch(setTriggerFetch());
                  getDailyworkDataFunc();
                } catch (error) {
                  console.error("Error in updating daily work data:", error);
                }
      }
      if (response.ok) {
        if (callingTracker.selectYesOrNo === "Interested") {
          if (fromCallingList) {
            onsuccessfulDataUpdation(true);
            toast.success(
              "Data updated successfully, please check Line Up Tracker"
            );
          } else {
            toast.success("Data updated successfully");
            const isUpdated = true; // Assume the update was successful

            if (isUpdated) {
              // Call the parent's triggerFetch function to refresh data
              triggerFetch();
            }
          }
        } else {
          toast.success("Data updated successfully");
          const isUpdated = true; // Assume the update was successful
          if (isUpdated) {
            // Call the parent's triggerFetch function to refresh data
            triggerFetch();
          }
        }
        setFormSubmitted(true);
        onSuccess();
        onCancel();
        setTimeout(() => {
          setFormSubmitted(false);
        }, 4000);
      } else {
        toast.error("Failed to update data");
      }
      setLineUpData(initialLineUpState);
    } catch (error) {
      toast.error(`Error updating data: ${error.message}`);
    }
  };
console.log(callingTracker);

  const handleRequirementChange = (e) => {
    const { value } = e.target;
    // line 552 to 577 added by sahil karnekar date 17-10-2024

    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };

      // Check if the user is interested
      if (callingTracker.selectYesOrNo === "Interested") {
        // If the value is empty, set the error
        if (value === "") {
          newErrors.requirementId = "Job Id is required";
          newErrors.requirementIdStar = "*";
        } else {
          // If there's a value, clear the error for requirementId
          delete newErrors.requirementId;
          delete newErrors.requirementIdStar;
        }
      } else {
        // If not interested, clear the error for requirementId
        delete newErrors.requirementId;
        delete newErrors.requirementIdStar;
      }

      return newErrors; // Return the updated error state
    });

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
  };
  const handleSourceNameOthers = (e) => {
    const { name, value } = e.target;
    callingTracker.sourceName = value;
    console.log(errors);

    const isNotInterested =
    callingTracker.selectYesOrNo !== "Interested" ? true : false;

    validateRealTime(name, value, isNotInterested);
    
  };
  const handleCallingRemarkOthers = (e) => {
    const { name, value } = e.target;
    callingTracker.callingFeedback = value;
    console.log(errors);

    const isNotInterested =
    callingTracker.selectYesOrNo !== "Interested" ? true : false;

    validateRealTime(name, value, isNotInterested);
    
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
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // this fucntion is made by sahil karnekar on date 25-11-2024
  const handleResumeUploadBoth = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(0);
    if (file) {
      for (let i = 20; i <= 80; i += 20) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated delay
      }
      
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
        const base64Resume = `data:application/pdf;base64,${base64String}`;
        setResumeUrl(base64Resume); // Set the base64 URL for the resume
        callingTracker.lineUp.resume = base64String;
        toast.success("Resume uploaded successfully");
      };
      reader.readAsArrayBuffer(file);
    }
    setUploadProgress(100);
  };
  const handleEmailCheckbox = (e) => {
    const isChecked = e.target.checked;
    
    setCallingTracker((prevState) => ({
      ...prevState,
      lineUp: {
        ...prevState.lineUp,
        emailStatus: isChecked ? "Yes" : "No",
      },
    }));
  };
  return (
    <div className="update-main-div">
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

      <form onSubmit={handleSubmit} className="setFormAdjustmentTag">
        <div className="update-calling-tracker-form">
          <div className="update-calling-tracker-row-gray">
            <div
              className="update-calling-tracker-field"
              style={{ justifyContent: "center" }}
            >
              Great talent won't wait - add them now, hire the best 👉
            </div>
            <div className="update-calling-tracker-field">
              <label>
                Upload Resume
                {/* {resumeUploaded && (
                  <FaCheckCircle className="upload-success-icon" />
                )} */}
              </label>
              <div
                className="update-calling-tracker-field-sub-div"
                style={{
                  display: "block",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:"space-between"
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
                        <ButtonAntd
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
                          {resumeUploaded ? resumeFileName.length > 10
                            ? `${resumeFileName.substring(0, 15)}...`
                            : resumeFileName || `${callingTracker.candidateName.substring(0, 15)}...` : "upload Resume" } 
                        </ButtonAntd>
                      </Upload>
                      {(displayProgress || resumeUploaded) && (
                        <Progress
                          percent={uploadProgress}
                          strokeWidth={4}
                          size="small"
                          className="customprogressForCallingTracker"
                        />
                      )}
                    </div>



                  {resumeUploaded && (
                    <div className="calling-tracker-popup-open-btn newclassformakesameashelp ForEYEButtonInUpdate">
                      <i
                        className="fas fa-eye"
                        onClick={() => {
                          if (resumeUrl) {
                            setIsModalOpen(true);
                          } else if (
                            !resumeUrl &&
                            callingTracker.lineUp.resume
                          ) {
                            const base64Resume = `data:application/pdf;base64,${callingTracker.lineUp.resume}`;
                            setResumeUrl(base64Resume); // Set the Base64 URL for the resume
                            setIsModalOpen(true); // Open the modal immediately after setting the URL
                          } else {
                            alert("Please upload a resume first.");
                          }
                        }}
                      ></i>
                    </div>
                  )}
                </div>
                {/* {resumeUploaded && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "green",
                    }}
                  >
                    Please Click on the eye icon to view the resume
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Date & Time:</label>
              <div className="update-calling-tracker-two-input-container">
                <div className="update-calling-tracker-two-input">
                  <input
                    type="text"
                    name="date"
                    value={callingTracker?.date}
                    className="update-update-calling-tracker-two-input"
                    readOnly
                  />
                </div>

                <input
                  type="text"
                  id="candidateAddedTime"
                  name="candidateAddedTime"
                  value={callingTracker?.candidateAddedTime}
                  className="update-calling-tracker-two-input"
                  readOnly
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Recruiter Name</label>
              <div className="update-calling-tracker-field-sub-div newsetforrightdiv">
                <div className="helpsideinputdiv">
                <input
                  type="text"
                  name="recruiterName"
                  value={loginEmployeeName}
                  // readOnly
                  onChange={handleChange}
                  className="plain-input"
                />
                </div>
               
                <div className="calling-tracker-two-input newalignrightdivforhelp">
                  <button
                    type="button"
                    onClick={handleShow}
                    className="update-tracker-popup-open-btn"
                    style={{ width: "100px" }}
                  >
                    Help
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div hidden>
            <input type="text" name="employeeId" value={employeeId} readOnly />
          </div>
          {/* here come required star changes done by sahil karnekar on date 16-12-2024 */}
          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Candidate's Full Name</label>
              {/* line 738 to 1844 added and updated by sahil karnekar date 18-10-2024 */}
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <input
                    type="text"
                    name="candidateName"
                    className={`plain-input`}
                    // validation added by sahil karnekar date 19-11-2024
                    value={callingTracker.candidateName || ""}
                    onChange={handleChange}
                    maxlength="50"
                  />
                  {errors.candidateNameStar && (
                    <div className="error-message">
                      {errors.candidateNameStar}
                    </div>
                  )}
                </div>
                {errors.candidateName && (
                  <div className="error-message">{errors.candidateName}</div>
                )}
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Candidate's Email</label>
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <input
                    type="email"
                    name="candidateEmail"
                    value={callingTracker?.candidateEmail || ""}
                    onChange={handleChange}
                    className={`plain-input`}
                  />
                  {errors.candidateEmailStar && (
                    <div className="error-message">
                      {errors.candidateEmailStar}
                    </div>
                  )}
                </div>
                {errors.candidateEmail && (
                  <div className="error-message">{errors.candidateEmail}</div>
                )}
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Contact Number</label>
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <input
                    style={{ width: "89%" }}
                    name="contactNumber"
                    value={callingTracker?.contactNumber || ""}
                    onChange={handleChange}
                    // required={callingTracker.selectYesOrNo !== "Interested"}
                    defaultCountry="IN"
                    maxLength={11}
                    className="newBorderClass"
                  />
                  {errors.contactNumberStar && (
                    <div className="error-message">
                      {errors.contactNumberStar}
                    </div>
                  )}
                </div>
                {errors.contactNumber && (
                  <div className="error-message">{errors.contactNumber}</div>
                )}
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Whatsapp Number</label>
              <div className="update-calling-tracker-field-sub-div"
               onClick={handleDisplaySameAsContactText}>
                <div className="newwrapperdivforwhatsapp whatsappdiv100">
                <input
                  placeholder="Enter phone number"
                  name="alternateNumber"
                  value={callingTracker?.alternateNumber || ""}
                  onChange={handleChange}
                  // required={callingTracker.selectYesOrNo !== "Interested"}
                  defaultCountry="IN"
                  maxLength={11}
              className="newBorderClass whatsappwidthinput90"
                />
                 {displaySameAsContactField && (
                    <div className="inputsameascontact">
                      <input
                        type="checkbox"
                        name="copyContactNumber"
                        checked={callingTracker.alternateNumber === callingTracker.contactNumber}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (callingTracker?.contactNumber) {
                              setCallingTracker((prev) => ({
                                ...prev,
                                alternateNumber: prev.contactNumber,
                              }));
                            }
                          } else {
                            setCallingTracker((prev) => ({
                              ...prev,
                              alternateNumber: "",
                            }));
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
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Source Name</label>
              {/* line 761 to 770 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <div className="wrappedSourcenamediv">
                  <select
                    name="sourceName"
                    className={`plain-input`}
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
                    // required={callingTracker.selectYesOrNo !== "Interested"}
                  >
                    <option value="" disabled>Select Source Name</option>
                    <option value="LinkedIn">linkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Indeed">Indeed </option>
                    <option value="Times">Times</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Company Page">Company Page</option>
                    <option value="Excel">Excel</option>
                    <option value="Friends">Friends</option>
                    <option value="others">others</option>
                  </select>

                  {displaySourceOthersInput && (
                      <input
                      className="marginleftforothers"
                        type="text"
                        name="sourceName"
                        id=""
                        placeholder="Enter Source Name"
                        value={callingTracker.sourceName !== "others" ? callingTracker.sourceName : callingTracker.sourceName === "others" && ""}
                        onChange={handleSourceNameOthers}
                      />
                    )}
                  </div>

                  {/* line 782 to 825 added by sahil karnekar date 17-10-2024 */}

                  {errors.sourceNameStar && (
                    <div className="error-message">{errors.sourceNameStar}</div>
                  )}
                </div>
                {errors.sourceName && (
                  <div className="error-message">{errors.sourceName}</div>
                )}
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Job Id</label>
              <div className="update-calling-tracker-two-input-container">
                <div>
                  <div className="setDisplayFlexForUpdateForm">
                    <select
                      className="update-calling-tracker-two-input"
                      id="requirementId"
                      name="requirementId"
                      value={callingTracker?.requirementId || ""}
                      onChange={handleRequirementChange}
                      //  required={callingTracker.selectYesOrNo === "Interested"}
                      style={{ width: "80%" }}
                    >
                      <option value="">Select Job Id</option>
                      {requirementOptions.map((option) => (
                        <option
                          key={option.requirementId}
                          value={option.requirementId}
                        >
                          {option.requirementId} - {option.designation}
                        </option>
                      ))}
                    </select>
                    {errors.requirementIdStar && (
                      <div className="error-message">
                        {errors.requirementIdStar}
                      </div>
                    )}
                  </div>
                  {errors.requirementId && (
                    <div className="error-message">{errors.requirementId}</div>
                  )}
                </div>
                <div>
                  {/* <input
                    placeholder=" Your Incentive"
                    value={callingTracker?.incentive || ""}
                    readOnly
                    className="update-calling-tracker-two-input"
                    type="text"
                    style={{ width: "100%" }}
           
                  /> */}
                   <div className="calling-tracker-two-input newhightforincentivesdivUpdateForm">
                    <input
                      className="nighlightincentivesinputnew"
                      placeholder="Your Incentive"
                      value={callingTracker?.incentive || ""}
                      type="text"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Applying For Position</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  id="jobDesignation"
                  name="jobDesignation"
                  className="calling-tracker-two-input newBorderClass"
                  // className="form-control"
                  value={callingTracker?.jobDesignation || ""}
                  // readOnly
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Company"
                  id="requirementCompany"
                  name="requirementCompany"
                  value={callingTracker?.requirementCompany || ""}
                  // readOnly
                  onChange={handleChange}
                  className="newBorderClass"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Current Location</label>
              {/* line 856 to 926 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-check-box-main-container">
                <div>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      type="text"
                      name="currentLocation"
                      value={callingTracker?.currentLocation || ""}
                      onChange={handleChange}
                      placeholder="Enter your location"
                      className="update-calling-check-box-main-container-input newBorderClass"
                    />
                    {errors.currentLocationStar && (
                      <div className="error-message">
                        {errors.currentLocationStar}
                      </div>
                    )}
                  </div>
                  {errors.currentLocation && (
                    <div className="error-message">
                      {errors.currentLocation}
                    </div>
                  )}
                </div>
                <input
                  className="update-calling-check-box-main-container-input newBorderClass"
                  type="text"
                  name="fullAddress"
                  placeholder="Full Address"
                  value={callingTracker?.fullAddress || ""}
                  onChange={handleChange}
                  style={{ height: "fit-content" }}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Calling Remark</label>
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <select
                    //  required={callingTracker.selectYesOrNo === "Interested"}
                  
                    className="plain-input"
                    name="callingFeedback"
                    value={
                      callingTracker.callingFeedback === "" ||
                      callingTracker.callingFeedback === "Call Done" ||
                      callingTracker.callingFeedback === "Asked for Call Back" ||
                      callingTracker.callingFeedback === "No Answer" ||
                      callingTracker.callingFeedback === "Network Issue" ||
                      callingTracker.callingFeedback === "Invalid Number" ||
                      callingTracker.callingFeedback === "Need to call back" ||
                      callingTracker.callingFeedback === "Do not call again" ||
                      callingTracker.callingFeedback === "others"
                        ? callingTracker.callingFeedback
                        : "others"

                    }
                    onChange={handleChange}
                  >
                    <option value=""   disabled>Feedback</option>
                    <option value="Call Done">Call Done</option>
                    <option value="Asked for Call Back">
                      Asked for Call Back
                    </option>
                    <option value="No Answer">No Answer</option>
                    <option value="Network Issue">Network Issue</option>
                    <option value="Invalid Number">Invalid Number</option>
                    <option value="Need to call back">Need to call back</option>
                    <option value="Do not call again">Do not call again</option>
                    <option value="others">others</option>
                  </select>
                  {displayOtherInputForCallingRemark && (
                      <input
                      className="marginleftforothers"
                        type="text"
                        name="callingFeedback"
                        id=""
                        placeholder="Enter Calling Remark"
                        value={callingTracker.callingFeedback !== "others" ? callingTracker.callingFeedback : callingTracker.callingFeedback === "others" && ""}
                        onChange={handleCallingRemarkOthers}
                      />
                    )}
                  {errors.callingFeedbackStar && (
                    <div className="error-message">
                      {errors.callingFeedbackStar}
                    </div>
                  )}
                </div>
                {errors.callingFeedback && (
                  <div className="error-message">{errors.callingFeedback}</div>
                )}
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Date Of Birth</label>
              <div className="update-calling-check-box-main-container">
                <div>
                  <input
                    type="date"
                    name="lineUp.dateOfBirth"
                    value={callingTracker.lineUp.dateOfBirth}
                    onChange={handleChange}
                    max={maxDate}
                  />
                  {errorForDOB && (
                    <div className="error-message">{errorForDOB}</div>
                  )}
                </div>

                <div className="calling-check-box-container">
                  <div className="update-callingTracker-male-div">
                    <div className="calling-check-box">
                      <input
                        type="checkbox"
                        name="lineUp.gender"
                        className="gender"
                        // line number 538 added by sahil karnekar , suggestion from tester on date : 14-10-2024
                        value="Male"
                        checked={callingTracker?.lineUp.gender === "Male"}
                        onChange={handleChange}
                      />
                    </div>
                    <div>Male</div>
                  </div>
                  <div className="update-callingTracker-male-div">
                    <div className="calling-check-box">
                      <input
                        type="checkbox"
                        name="lineUp.gender"
                        value="Female"
                        className="gender"
                        checked={callingTracker?.lineUp.gender === "Female"}
                        onChange={handleChange}
                      />
                    </div>
                    <div>Female</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Call Summary</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="lineUp.feedBack"
                  placeholder="Enter Call Summary"
                  value={callingTracker?.lineUp.feedBack || ""}
                  onChange={handleChange}
                  className="plain-input"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Education</label>
              {/* line 979 to 1408 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-tracker-two-input-container">
                <div style={{ width: "50%", marginRight: "20px" }}>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      list="educationListDropDown"
                      name="qualification"
                      value={callingTracker?.lineUp.qualification || ""}
                      onChange={handleEducationChange}
                      placeholder="Search...."
                      style={{ width: "-webkit-fill-available" }}
                      className="newBorderClass"
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
                      <option value="Master's Degrees">Master's Degrees</option>
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
                      <option value="Doctoral Degrees">Doctoral Degrees</option>
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

                    {errors.qualificationStar && (
                      <div className="error-message">
                        {errors.qualificationStar}
                      </div>
                    )}
                  </div>
                  {errors.qualification && (
                    <div className="error-message error-two-input-box">
                      {errors.qualification}
                    </div>
                  )}
                </div>
                <div style={{ width: "50%", marginRight: "20px" }}>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      style={{ width: "100%" }}
                      type="number"
                      min="1947"
                      max="2025"
                      name="lineUp.yearOfPassing"
                      placeholder="Year Of PassOut"
                      value={callingTracker?.lineUp.yearOfPassing || ""}
                      // required={callingTracker.selectYesOrNo === "Interested"}
                      onChange={handleChange}
                      className="newBorderClass"
                    />
                    {errors.yearOfPassingStar && (
                      <div className="error-message error-two-input-box">
                        {errors.yearOfPassingStar}
                      </div>
                    )}
                  </div>
                  {errors.yearOfPassing && (
                    <div className="error-message error-two-input-box">
                      {errors.yearOfPassing}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label> Notice Period</label>
              {/* line 738 to 1844 added and updated by sahil karnekar date 18-10-2024 */}
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <input
                    type="text"
                    name="lineUp.noticePeriod"
                    placeholder="Notice Period"
                    value={callingTracker?.lineUp.noticePeriod || ""}
                    onChange={handleChange}
                    min="0"
                    max="90"
                    className="plain-input"
                    //  required={callingTracker.selectYesOrNo === "Interested"}
                  />
                  {errors.noticePeriodStar && (
                    <div className="error-message">
                      {errors.noticePeriodStar}
                    </div>
                  )}
                </div>
                {errors.noticePeriod && (
                  <div className="error-message">{errors.noticePeriod}</div>
                )}
              </div>
            </div>

            <div className="update-calling-tracker-field">
              <label>Working Status</label>
              <div className="update-calling-tracker-field-sub-div">
                {/* <input
                  type="text"
                  name="lineUp.extraCertification"
                  value={callingTracker?.lineUp.extraCertification || ""}
                  onChange={handleChange}
                  className="plain-input"
                  placeholder="Enter Extra Certification"
                /> */}

<Radio.Group
style={{
  display:"flex",
  width:"100%"
}}
  name="lineUp.extraCertification"
  value={callingTracker?.lineUp.extraCertification}
  onChange={handleChange}
  options={[
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]}
/>
              </div>
            </div>
          </div>

          <div className=" update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Current Company</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="lineUp.companyName"
                  placeholder="Current Company"
                  value={callingTracker?.lineUp.companyName || ""}
                  onChange={handleChange}
                  // required={callingTracker.selectYesOrNo === "Interested"}
                  className="plain-input"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Total Experience</label>
              {/* line 1471 to 1758 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-tracker-two-input-container">
                <div>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      style={{ width: "95%" }}
                      type="text"
                      name="lineUp.experienceYear"
                      value={callingTracker?.lineUp.experienceYear || ""}
                      onChange={handleChange}
                      className="update-calling-tracker-two-input newBorderClass"
                      // required={callingTracker.selectYesOrNo === "Interested"}
                      placeholder="Years"
                      maxLength="2"
                    />
                      {callingTracker.lineUp.experienceYear ? (
                        <span className="addtrnaslateproptospan">Years</span>
                      ) : null}
                    {errors.experienceYearStar && (
                      <div className="error-message">
                        {errors.experienceYearStar}
                      </div>
                    )}
                  </div>
                  {errors.experienceYear && (
                    <div className="error-message">{errors.experienceYear}</div>
                  )}
                </div>

                <div className="calling-tracker-two-input newwidthforthisdiv">
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      style={{ width: "95%" }}
                      type="text"
                      name="lineUp.experienceMonth"
                      onChange={handleChange}
                      value={callingTracker?.lineUp.experienceMonth || ""}
                      placeholder="Months"
                      maxLength="2"
                      min="0"
                      max="11"
                      className="newBorderClass"
                    />
                     {callingTracker.lineUp.experienceMonth ? (
                        <span className="addtrnaslateproptospanForMonths">Months</span>
                      ) : null}
                    {errors.experienceMonthStar && (
                      <div className="error-message">
                        {errors.experienceMonthStar}
                      </div>
                    )}
                  </div>
                  {errors.experienceMonth && (
                    <div className="error-message">
                      {errors.experienceMonth}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label> Relevant Experience</label>
              {/* line 738 to 1844 added and updated by sahil karnekar date 18-10-2024 */}
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  <input
                    type="text"
                    name="lineUp.relevantExperience"
                    value={callingTracker?.lineUp.relevantExperience || ""}
                    onChange={handleChange}
                    placeholder="Enter Relevant Experience"
                    className="plain-input"
                  />
                  {errors.relevantExperienceStar && (
                    <div className="error-message">
                      {errors.relevantExperienceStar}
                    </div>
                  )}
                </div>
                {errors.relevantExperience && (
                  <div className="error-message">
                    {errors.relevantExperience}
                  </div>
                )}
              </div>
            </div>

            <div className="update-calling-tracker-field">
              <label>Communication Rating </label>
              <div className="update-calling-tracker-field-sub-div setInputBlock">
                <div className="setDisplayFlexForUpdateForm">
                  {/* <input
                    type="text"
                    name="communicationRating"
                    value={callingTracker?.communicationRating || ""}
                    onChange={handleChange}
                    className="plain-input"
                    placeholder="Enter Communication Rating"
                    // required={callingTracker.selectYesOrNo === "Interested"}
                  /> */}

<select
  className="plain-input setwidthandmarginforratings"
  name="communicationRating"
  value={callingTracker?.communicationRating || ""}
  onChange={handleChange}
>
  <option value="">Select Rating</option>
  {[...Array(10)].map((_, index) => {
    const rating = (index + 1) * 0.5;

    // Assign unique tags to each rating
    const tags = [
      "Very Poor",  // 0.5
      "Poor",       // 1.0
      "Below Average", // 1.5
      "Average",    // 2.0
      "Fair",       // 2.5
      "Good",       // 3.0
      "Very Good",  // 3.5
      "Excellent",  // 4.0
      "Outstanding",// 4.5
      "Perfect"     // 5.0
    ];

    return (
      <option key={rating} value={`${rating}`}>
        {rating.toFixed(1)} - {tags[index]}
      </option>
    );
  })}
</select>

                    <span className="ml-5">Out Of 5</span>


                  {errors.communicationRatingStar && (
                    <div className="error-message">
                      {errors.communicationRatingStar}
                    </div>
                  )}
                </div>
                {errors.communicationRating && (
                  <div className="error-message">
                    {errors.communicationRating}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Current CTC (LPA)</label>
              <div className="update-calling-tracker-two-input-container setDisplayblockfornumtoword">
                <div className="displayflexfornumtoword">
                  
             
                <div>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      style={{ width: "75%" }}
                      type="text"
                      name="lineUp.currentCTCLakh"
                      value={callingTracker?.lineUp.currentCTCLakh || ""}
                      onChange={handleChange}
                      className="update-calling-tracker-two-input newBorderClass"
                      placeholder="Lakh"
                      maxLength="2"
                      // required={callingTracker.selectYesOrNo === "Interested"}
                      pattern="\d*"
                    />
                    {errors.currentCTCLakhStar && (
                      <div className="error-message">
                        {errors.currentCTCLakhStar}
                      </div>
                    )}
                  </div>
                  {errors.currentCTCLakh && (
                    <div className="error-message">{errors.currentCTCLakh}</div>
                  )}
                  
                </div>
                <div>
                  <input
                    style={{ width: "75%" }}
                    type="text"
                    name="lineUp.currentCTCThousand"
                    value={callingTracker?.lineUp.currentCTCThousand || ""}
                    onChange={handleChange}
                    className="update-calling-tracker-two-input newBorderClass"
                    placeholder="Thousand"
                    maxLength="2"
                    pattern="\d*"
                    inputMode="numeric"
                  />
                </div>

                </div>

                <div className="convertnumtowordstext">
  {(callingTracker.lineUp.currentCTCLakh > 0 || callingTracker.lineUp.currentCTCThousand > 0) && (
    <span>
      {convertNumberToWords(
        callingTracker.lineUp.currentCTCLakh,
        callingTracker.lineUp.currentCTCThousand
      )}
    </span>
  )}
</div>


              </div>
              
              
            </div>
            
            <div className="update-calling-tracker-field">
              <label>Expected CTC (LPA)</label>
              <div className="update-calling-tracker-two-input-container setDisplayblockfornumtoword">
              <div className="displayflexfornumtoword">
                <div>
                  <div className="setDisplayFlexForUpdateForm">
                    <input
                      style={{ width: "100%" }}
                      type="text"
                      name="lineUp.expectedCTCLakh"
                      value={callingTracker?.lineUp.expectedCTCLakh || ""}
                      onChange={handleChange}
                      className="update-calling-tracker-two-input newBorderClass currentExpectedWidth"
                      placeholder="Lakh"
                      // required={callingTracker.selectYesOrNo === "Interested"}
                      maxLength="2"
                      pattern="\d*"
                    />
                    {errors.expectedCTCLakhStar && (
                      <div className="error-message">
                        {errors.expectedCTCLakhStar}
                      </div>
                    )}
                  </div>
                  {errors.expectedCTCLakh && (
                    <div className="error-message">
                      {errors.expectedCTCLakh}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    style={{ width: "95%" }}
                    type="text"
                    name="lineUp.expectedCTCThousand"
                    value={callingTracker?.lineUp.expectedCTCThousand || ""}
                    onChange={handleChange}
                    className="update-calling-tracker-two-input newBorderClass currentExpectedWidth"
                    placeholder="Thousand"
                    maxLength="2"
                    pattern="\d*"
                    inputMode="numeric"
                  />
                </div>
</div>

<div className="convertnumtowordstext">
  {(callingTracker.lineUp.expectedCTCLakh > 0 || callingTracker.lineUp.expectedCTCThousand > 0) && (
    <span>
      {convertNumberToWords(
        callingTracker.lineUp.expectedCTCLakh,
        callingTracker.lineUp.expectedCTCThousand
      )}
    </span>
  )}
</div>

              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Holding Offer Letter</label>
              <div
                className="update-calling-tracker-two-input-container"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <select
                      style={{
                        width: "90%",
                      }}
                      className="update-calling-tracker-two-input"
                      type="text"
                      name="lineUp.holdingAnyOffer"
                      value={callingTracker?.lineUp.holdingAnyOffer || ""}
                      // required={callingTracker.selectYesOrNo === "Interested"}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.holdingAnyOfferStar && (
                      <div className="error-message">
                        {errors.holdingAnyOfferStar}
                      </div>
                    )}
                  </div>
                  {errors.holdingAnyOffer && (
                    <div className="error-message">
                      {errors.holdingAnyOffer}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <input
                    style={{ width: "85%" }}
                    type="text"
                    name="lineUp.offerLetterMsg"
                    placeholder="Letter Message"
                    value={callingTracker?.lineUp.offerLetterMsg || ""}
                    // onChange={handleLineUpChange}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Comment For TL</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="lineUp.msgForTeamLeader"
                  placeholder="Comment For TL"
                  value={callingTracker?.lineUp.msgForTeamLeader || ""}
                  //onChange={handleLineUpChange}
                  onChange={handleChange}
                  className="plain-input"
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Status Type</label>
              <div
                className="update-calling-tracker-two-input-container"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div className="intresteddiv">
                <select
                  className="update-calling-tracker-two-input newwidthforintrestedselecttag"
                  name="selectYesOrNo"
                  placeholder="Candidate Interested"
                  value={callingTracker?.selectYesOrNo}
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
                      <option value="Not Eligibel Not Interested">
                        Not Eligibel Not Interested
                      </option>
                </select>
                </div>
               

                <div
                  style={{
                    width:"100%"
                  }}
                >
                  {/* line 1784 added by sahil karnekar date 21-10-2024 */}
                  <select
                    disabled={callingTracker.selectYesOrNo !== "Interested"}
                    type="text"
                    name="lineUp.finalStatus"
                    value={callingTracker?.lineUp.finalStatus}
                    onChange={handleChange}
                    className="newwidthforselectfinalstatus"
                    // required={callingTracker.selectYesOrNo === "Interested"}
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
                  {errors.finalStatus && (
                    <div className="error-message">{errors.finalStatus}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Interview Slots</label>
              <div className="update-calling-tracker-two-input-container">
                <div>
                  {/* line 1808 added by sahil karnekar date 21-10-2024 */}
                  <input
                    disabled={callingTracker.selectYesOrNo !== "Interested"}
                    style={{ width: "auto" }}
                    type="date"
                    name="lineUp.availabilityForInterview"
                    value={
                      callingTracker?.lineUp.availabilityForInterview || ""
                    }
                    onChange={(e) => {
                      //Arshad Comment This On 21-10-2025
                      // const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

                      // if (e.target.value < today) {
                      //   seterrorInterviewSlot(
                      //     "Interview Slot Should be Next Date From Today"
                      //   );
                      // } else {
                      //   seterrorInterviewSlot(""); // Clear error message if the date is valid

                        setCallingTracker((prevState) => ({
                          ...prevState,
                          lineUp: {
                            ...prevState.lineUp,
                            availabilityForInterview: e.target.value,
                          },
                        }));
                      // }
                    }}
                    // line 1831 changed updated by sahil karnekar date 21-10-2024
                    //Arshad Comment This On 21-10-2025
                    // min={new Date().toISOString().split("T")[0]} // Allow today and future dates
                    className="update-calling-tracker-two-input"
                  />

                  {errorInterviewSlot && (
                    <div className="error-message">{errorInterviewSlot}</div>
                  )}
                </div>

                {/* complete componenet timepicker added by sahil karnekar date 21-10-2024 */}
                <TimePicker
                  style={{ width: "50%", padding: "5px" }}
                  placeholder="Interview Time"
                  disabled={callingTracker.selectYesOrNo !== "Interested"}
                  value={
                    callingTracker.lineUp.interviewTime
                      ? dayjs(callingTracker.lineUp.interviewTime, "h:mm a")
                      : null
                  }
                  onChange={(time) => {
                    setCallingTracker((prevState) => ({
                      ...prevState,
                      lineUp: {
                        ...prevState.lineUp,
                        interviewTime: time ? time.format("h:mm a") : "", // Format the time as a string in h:mm a (AM/PM)
                      },
                    }));
                  }}
                  format="h:mm a" // Display format in the picker
                  className="update-calling-tracker-two-input"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="buttonDiv" style={{ marginTop: "20px", gap: "10px" }}>
          <button type="submit" className="ctf-btn" onClick={handleDisplayConfirmBox}>
            Update Data
          </button>
          <button className="ctf-btn" onClick={onCancel} id="uploadbtn2">
            Cancel
          </button>
        </div>
        {displayEmailConfirm && (
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
                    <Modal.Body style={{
                      textAlign:"center"
                    }}>
                      <p className="confirmation-text">
                        Are you sure you want to save this candidate's
                        information ?
                      </p>
                      {
  callingTracker.selectYesOrNo === "Interested" && (
    <Checkbox onChange={handleEmailCheckbox} checked={callingTracker.lineUp.emailStatus === "Yes"}>
      Do You Want to Send Email to Candidate?
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
                        onClick={handleSubmit}
                          className="buttoncss"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setDisplayEmailConfirm(false)}
                          className="buttoncss"
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal.Body>
                  </Modal.Dialog>
                </div>
              )}
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
    </div>
  );
};

const ModalComponent = ({
  show,
  handleClose,
  startingPoint,
  endingPoint,
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
  const [expectedCTCThousand, setExpectedCTCThousand] = useState(
    expectedCTCInThousand
  );
  const [showHikeInput, setShowHikeInput] = useState(false);

  useEffect(() => {
    setOrigin(startingPoint);
    setDestination(endingPoint);
    setExpectedCTCLakh(expectedCTCInLakh);
    setExpectedCTCThousand(expectedCTCInThousand);
    setExpectedCTC("");
    setShowHikeInput(true); // Reset hike input visibility on prop change
  }, [startingPoint, endingPoint, expectedCTCInLakh, expectedCTCInThousand]);

  useEffect(() => {
    if (expectedHike) {
      const currentCTCNum = parseFloat(convertedCurrentCTC);
      const expectedHikeNum = parseFloat(expectedHike);
      const expectedCTCNum =
        currentCTCNum + (currentCTCNum * expectedHikeNum) / 100;
      setExpectedCTC(expectedCTCNum.toFixed(2));
      setCalculatedHike("");
    }
    setCalculatedHike("");
  }, [expectedHike, convertedCurrentCTC]);

  useEffect(() => {
    if (expectedCTCLakh || expectedCTCThousand) {
      const lakhValue = parseFloat(expectedCTCLakh) || 0;
      const thousandValue = parseFloat(expectedCTCThousand) || 0;
      const combinedCTC = lakhValue * 100000 + thousandValue * 1000;
      const currentCTCNum = parseFloat(convertedCurrentCTC);
      const expectedCTCNum = parseFloat(combinedCTC);
      const hikePercentage =
        ((expectedCTCNum - currentCTCNum) / currentCTCNum) * 100;
      setCalculatedHike(hikePercentage.toFixed(2));
    }
  }, [expectedCTCLakh, expectedCTCThousand, convertedCurrentCTC]);


  return (
    <Modal size="xl" centered show={show} onHide={handleClose}>
      <Modal.Body className="p-0">
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
            {/* Arshad Attar Commented this on 09-12-2024 */}
            {/* <p
             className={`sidebar-item ${
               activeField === "historyTracker" ? "active" : ""
             }`}
             onClick={() => setActiveField("historyTracker")}
           >
             History Tracker
           </p> */}
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
                <h5>Distance Calculation</h5>
                <div className="form-group">
                  <label htmlFor="origin">Origin</label>
                  <input
                    type="text"
                    id="origin"
                    className="form-control"
                    placeholder="Enter origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destination">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    className="form-control"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                {origin && destination && (
                  <iframe
                    title="Google Maps"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${origin}+to+${destination}&output=embed`}
                    allowFullScreen
                  ></iframe>
                )}
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
                        <div className="form-group">
                          {/* <label htmlFor="currentCTCLakh"></label> */}
                          <input
                            type="number"
                            id="currentCTCLakh"
                            name="currentCTCLack"
                            className="form-control"
                            placeholder="Enter current CTC in lakh"
                            value={convertedCurrentCTC}
                            // readOnly
                          />
                        </div>
                      </td>
                      <td className="text-secondary">
                        <div className="form-group">
                          {/* <label htmlFor="expectedHike">Hike (%)</label> */}
                          <input
                            type="number"
                            id="expectedHike"
                            className="form-control"
                            placeholder="Enter expected hike percentage"
                            value={expectedHike}
                            onChange={(e) => setExpectedHike(e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="text-secondary">
                        <input
                          type="text"
                          className="form-control"
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
                        <input
                          type="number"
                          id="currentCTCLakh"
                          name="currentCTCLakh"
                          className="form-control"
                          placeholder="Enter current CTC in lakh"
                          value={convertedCurrentCTC}
                          // readOnly
                        />
                      </td>
                      <td className="text-secondary">
                        <div>
                          <div className="form-group">
                            {/* <label htmlFor="expectedCTCLakh">Lakh</label> */}
                            <input
                              type="text"
                              id="expectedCTCLakh"
                              name="enterexpectedCTCLakh"
                              className="form-control"
                              placeholder="Enter expected CTC in lakh"
                              value={expectedCTCLakh}
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              onChange={(e) => {
                                const value = e.target.value;
                                setExpectedCTCLakh(value);
                                onUpdateExpectedCTCLakh(value); // Send to parent
                              }}
                            />
                          </div>
                          <div className="form-group">
                            {/* <label htmlFor="expectedCTCThousand">
                             Thousand
                           </label> */}
                            <input
                              type="text"
                              id="expectedCTCThousand"
                              name="expectedCTCLakh"
                              className="form-control"
                              placeholder="Enter expected CTC in thousand"
                              maxLength="2"
                              pattern="\d*"
                              inputMode="numeric"
                              value={expectedCTCThousand}
                              onChange={(e) => {
                                const value = e.target.value;
                                setExpectedCTCThousand(value);
                                onUpdateExpectedCTCThousand(value); // Send to parent
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <input
                          type="text"
                          name="hike"
                          className="form-control"
                          // readOnly
                          value={calculatedHike}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeField === "historyTracker" && (
              <div className="history-Tracker">
                <div className="form-group">
                  <CandidateHistoryTracker />
                  <div></div>
                </div>
              </div>
            )}
            {activeField === "previousQuestion" && (
              <div className="previousQuestion">
                <h5>Previous Question</h5>
                <div className="form-group">
                  <label htmlFor="jobId">Job Id</label>
                  <input
                    type="text"
                    id="jobId"
                    className="form-control"
                    placeholder="Enter Job Id"
                  />
                </div>

                <div className="card">
                  <h2 className="card-title">Previous Question</h2>
                  <p className="card-content">
                    Q.1. What is Java Full Stack Development?
                  </p>
                  <p className="card-content">
                    Q.2. Explain the difference between front-end and back-end
                    development.
                  </p>
                  <p className="card-content">
                    Q.3. What do you need to build a typical web application?
                  </p>
                  <p className="card-content">
                    Q.4. What is the Java Virtual Machine (JVM), and why is it
                    important?
                  </p>
                  <p className="card-content">
                    Q.5. What's a servlet, and why is it used in Java web
                    development?
                  </p>
                </div>
                <div className="card">
                  <h2 className="card-title">Previous Question</h2>
                  <p className="card-content">
                    Q.1. What's the Spring Framework, and why is it useful for
                    Java?
                  </p>
                  <p className="card-content">
                    Q.2. What are RESTful web services, and why are they
                    important in Java?
                  </p>
                  <p className="card-content">
                    Q.3. What's Hibernate, and how does it help with databases
                    in Java?
                  </p>
                  <p className="card-content">
                    Q.4. Can you explain what dependency injection means in
                    Spring?
                  </p>
                  <p className="card-content">
                    Q.5. What's a singleton pattern, and why does it matter in
                    Java?
                  </p>
                </div>
              </div>
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

export default UpdateSelfCalling;
// neha_updateselfcalling_designing_end_lineno_1214_date_16/07/24
