import React, { useState, useEffect } from "react";
// import "../EmployeeSection/CallingTrackerForm.css";
import { useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "../EmployeeSection/UpdateSelfCalling.css";
import { API_BASE_URL } from "../api/api";
import { Button, Modal } from "react-bootstrap";
import CandidateHistoryTracker from "../CandidateSection/candidateHistoryTracker";
// line 14 to 15 added by sahil karnekar date 17-10-2024
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

const UpdateSelfCalling = ({
  initialData,
  candidateId,
  onCancel,
  onsuccessfulDataUpdation,
  onSuccess,
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

  // line 111 to 186 added by sahil karnekar date 17-10-2024

  const [errors, setErrors] = useState({});
  const [errorForDOB, setErrorForDOB] = useState("");
  const [errorInterviewSlot, seterrorInterviewSlot] = useState("");
  const today = new Date();
const maxDate = new Date(today.setFullYear(today.getFullYear() - 18))
  .toISOString()
  .split("T")[0]; // Format as YYYY-MM-DD
  
  

  const validateCallingTracker = () => {
    let newErrors = {};
    if (!callingTracker.candidateName) {
      newErrors.candidateName = "Candidate Name is required";
    }
    if (!callingTracker.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
    }
    if (!callingTracker.sourceName) {
      newErrors.sourceName = "Source Name is required";
    }
    if (!callingTracker.candidateEmail) {
      newErrors.candidateEmail = "Email is required";
    }
    if (!callingTracker.callingFeedback) {
      newErrors.callingFeedback = "Calling Feedback is required";
    }
    return newErrors;
  };
  
  const validateLineUpData = () => {
    let newErrors = {};
    if (callingTracker.selectYesOrNo === "Interested") {
      if (!callingTracker.requirementId) {
        newErrors.requirementId = "Job Id is required";
      }
      if (!callingTracker.lineUp.experienceYear) {
        newErrors.experienceYear = "Experience Year is required";
      }
      if (!callingTracker.lineUp.experienceMonth) {
        newErrors.experienceMonth = "Experience Month is required";
      }
      if (!callingTracker.lineUp.relevantExperience) {
        newErrors.relevantExperience = "Relevant Experience is required";
      }
      if (!callingTracker.currentLocation) {
        newErrors.currentLocation = "Location is required";
      }
      if (!callingTracker.lineUp.qualification) {
        newErrors.qualification = "Education is required";
      }
      if (!callingTracker.communicationRating) {
        newErrors.communicationRating = "Communication Rating is required";
      }
      if (!callingTracker.lineUp.expectedCTCLakh && !callingTracker.lineUp.expectedCTCThousand) {
        newErrors.expectedCTCLakh = "Expected CTC is required";
      }
      if (!callingTracker.lineUp.currentCTCLakh && !callingTracker.lineUp.currentCTCThousand) {
        newErrors.currentCTCLakh = "Current CTC is required";
      }
      if (!callingTracker.lineUp.holdingAnyOffer) {
        newErrors.holdingAnyOffer = "Holding Any Offer is required";
      }
      if (!callingTracker.lineUp.finalStatus) {
        newErrors.finalStatus = "Please Select Option";
      }
      if (!callingTracker.lineUp.noticePeriod) {
        newErrors.noticePeriod = "Notice Period is required";
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
    }
  }, [initialData]);


  const fetchCandidateData = async (candidateId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/specific-data/${candidateId}`
      );
      const data = await response.json();
      console.log(data);
      setCallingTracker(data);
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
    // line 229 to 459 added by sahil karnekar date 17-10-2024

    if (
      (name === "candidateName" || 
      name === "currentLocation"
      ) &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return;
    }
    if (
      (name === "contactNumber" ||
        name === "alternateNumber" ||
        name === "lineUp.experienceYear" ||
        name === "lineUp.experienceMonth"||
        name === "lineUp.relevantExperience"||
      name === "lineUp.expectedCTCLakh"||
      name === "lineUp.expectedCTCThousand"||
      name === "lineUp.currentCTCLakh" ||
      name === "lineUp.currentCTCThousand"
      ) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }



    if (name === "lineUp.dateOfBirth") {
      console.log(value);
      console.log(maxDate);
      
      if (value > maxDate) {
        setErrorForDOB("MaxDate"+maxDate);
        
      }else{
        setErrorForDOB("");
      }
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

// Perform real-time validation
validateRealTime(name, value);

  };

  const validateRealTime = (name, value) => {
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
  
      // Specific validations based on the input field
      if (name === "candidateName"){
        if (value=== "") {
          newErrors.candidateName = "Candidate Name is required";
        }else{
          delete newErrors.candidateName; 
        }
      }
      if (name === "candidateEmail"){
        const emailPattern = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
        if (value=== "") {
          newErrors.candidateEmail = "Candidate Email is required";
        }else if (!emailPattern.test(value)) {
          // If email format is invalid, show an error
          newErrors.candidateEmail = "Invalid email format. Ensure proper structure (no spaces, valid characters, single @, valid domain).";
        }else{
          delete newErrors.candidateEmail; 
        }
      }
      if (name === "contactNumber"){
        if (value=== "") {
          newErrors.contactNumber = "Contact Number is required";
        }else{
          delete newErrors.contactNumber; 
        }
      }
      if (name === "sourceName"){
        if (value=== "") {
          newErrors.sourceName = "source Name is required";
        }else{
          delete newErrors.sourceName; 
        }
      }
      if (name === "callingFeedback"){
        if (value=== "") {
          newErrors.callingFeedback = "calling Feedback is required";
        }else{
          delete newErrors.callingFeedback; 
        }
      }
      if (callingTracker.selectYesOrNo === "Interested") {
        setErrors((prevErrors) => {
          let newErrors = { ...prevErrors }; // Copy the previous errors
      
          if (name === "currentLocation") {
            if (value === "") {
              newErrors.currentLocation = "Location is required";
            } else {
              delete newErrors.currentLocation; // Clear the error if value is valid
            }
          }
          if (name === "communicationRating") {
            if (value === "") {
              newErrors.communicationRating = "Current Location is required";
            } else {
              delete newErrors.communicationRating; // Clear the error if value is valid
            }
          }
   
          if (name.startsWith("lineUp.")) {
            const fieldName = name.split(".")[1]; // Get the specific field name
      
            if (fieldName === "experienceYear") {
              if (value === "") {
                newErrors.experienceYear = "Experience Year is required";
              } else {
                delete newErrors.experienceYear;
              }
            }
            if (fieldName === "experienceMonth") {
              if (value === "") {
                newErrors.experienceMonth = "Experience Month is required";
              } else {
                const experienceMonthValue = parseInt(value, 10);
            
                if (experienceMonthValue > 11) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    experienceMonth: "Experience in months cannot exceed 11.",
                  }));
                } else {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    experienceMonth: "",
                  }));
                }
              }
            }
            
            if (fieldName === "relevantExperience") {
              if (value === "") {
                newErrors.relevantExperience = "relevant Experience is required";
              } else {
                delete newErrors.relevantExperience;
              }
            }
            if (fieldName === "noticePeriod") {
              if (value === "") {
                newErrors.noticePeriod = "Notice Period is required";
              } else {
                delete newErrors.noticePeriod;
              }
            }
            if (fieldName === "currentCTCLakh") {
              if (value === "") {
                newErrors.currentCTCLakh = "currentCTCLakh is required";
              } else {
                delete newErrors.currentCTCLakh;
              }
            }
            if (fieldName === "expectedCTCLakh") {
              if (value === "") {
                newErrors.expectedCTCLakh = "expectedCTCLakh is required";
              } else {
                delete newErrors.expectedCTCLakh;
              }
            }
            if (fieldName === "holdingAnyOffer") {
              if (value === "") {
                newErrors.holdingAnyOffer = "holdingAnyOffer is required";
              } else {
                delete newErrors.holdingAnyOffer;
              }
            }

            
            // Add more validations for lineUp fields here if needed
          }
      
          return newErrors; // Return the updated errors
        });
      }
      
      
  
      return newErrors;  // Return the updated error state
    });
  };



  const handleEducationChange = (e) => {
    const value = e.target.value;

    if (callingTracker.selectYesOrNo === "Interested") {
      setErrors((prevErrors) => {
        let newErrors = { ...prevErrors }; // Copy the previous errors
       
          if (value === "") {
            newErrors.qualification = "Education is required";
          } else {
            delete newErrors.qualification; // Clear the error if value is valid
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
 // Validate the form data before submitting
 console.log(callingTracker);
 const validationErrors = validateCallingTracker();
 const validationErrorsForLineup = validateLineUpData();
 
 if (Object.keys(validationErrors).length > 0 || Object.keys(validationErrorsForLineup).length > 0) {
   setErrors({
     ...validationErrors,
     ...validationErrorsForLineup,
   });

   console.log(errors);
   return; // Prevent submission if errors exist
 }
 
  



 
    try {
      const dataToUpdate = {
        ...callingTracker,
        candidateAddedTime: callingTracker.candidateAddedTime,
        lineUp: {
          ...callingTracker.lineUp,
          resume: "",
        },
      };

      const response = await fetch(
        `${API_BASE_URL}/update-calling-data/${candidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      if (response.ok) {
        if (callingTracker.selectYesOrNo === "Interested") {
          onsuccessfulDataUpdation(true);
          toast.success("Data updated successfully Please Cheack Line Up Tracker");
        } else {
          onsuccessfulDataUpdation(false);
          toast.success("Data updated successfully");
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
          } else {
              // If there's a value, clear the error for requirementId
              delete newErrors.requirementId;
          }
      } else {
          // If not interested, clear the error for requirementId
          delete newErrors.requirementId;
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

  return (
    <div className="update-main-div">
      <form onSubmit={handleSubmit}>
        <div className="update-calling-tracker-form">
          <div className="update-calling-tracker-row-gray">
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
              <label>Recruiter </label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="recruiterName"
                  value={callingTracker?.recruiterName}
                  readOnly
                  onChange={handleChange}
                  className="plain-input"
                />
                <div className="calling-tracker-two-input">
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

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Candidate's Full Name</label>
               {/* line 687 to 740 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-tracker-field-sub-div">
                <div className="input-block" style={{display:"block"}}>
                <input
                  type="text"
                  name="candidateName"
                  className={`plain-input`}
                  value={callingTracker.candidateName || ""}
                  onChange={handleChange}
                  maxlength="50"
                />
                {errors.candidateName && (
                    <div className="error-message">{errors.candidateName}</div>
                  )}
              </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Candidate's Email</label>
              <div className="update-calling-tracker-field-sub-div">
              <div className="input-block" style={{display:"block"}}>
                <input
                  type="email"
                  name="candidateEmail"
                  value={callingTracker?.candidateEmail || ""}
                  onChange={handleChange}
                  className={`plain-input`}
                />
                {errors.candidateEmail && (
                    <div className="error-message">{errors.candidateEmail}</div>
                  )}
              </div>
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Contact Number</label>
              <div className="update-calling-tracker-field-sub-div">
              <div className="input-block" style={{display:"block"}}>
                <input
                  name="contactNumber"
                  value={callingTracker?.contactNumber || ""}
                  onChange={handleChange}
                  // required={callingTracker.selectYesOrNo !== "Interested"}
                  defaultCountry="IN"
                  maxLength={11}
                />
                 {errors.contactNumber && (
                    <div className="error-message">{errors.contactNumber}</div>
                  )}
              </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Whatsapp Number</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  placeholder="Enter phone number"
                  name="alternateNumber"
                  value={callingTracker?.alternateNumber || ""}
                  onChange={handleChange}
                  // required={callingTracker.selectYesOrNo !== "Interested"}
                  defaultCountry="IN"
                  maxLength={11}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Source Name</label>
               {/* line 761 to 770 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-tracker-field-sub-div">
              <div className="input-block" style={{display:"block"}}>
                <select
                  name="sourceName"
                  className={`plain-input`}
                  value={callingTracker?.sourceName || ""}
                  onChange={handleChange}
                 // required={callingTracker.selectYesOrNo !== "Interested"}
                >
                  <option value="">Select Source Name</option>
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
                 {/* line 782 to 825 added by sahil karnekar date 17-10-2024 */}
                {errors.sourceName && (
                    <div className="error-message">{errors.sourceName}</div>
                  )}
                  </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Job Id</label>
              <div className="update-calling-tracker-two-input-container">
              <div className="input-block" style={{display:"block"}}>
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
                {errors.requirementId && (
  <div className="error-message">{errors.requirementId}</div>
)}
</div>
<div>
                <input
                  placeholder=" Your Incentive"
                  value={callingTracker?.incentive || ""}
                  readOnly
                  className="update-calling-tracker-two-input"
                  type="text"
                  style={{ width: "100%" }}
                />
                </div>
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Applying For Position</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  id="jobDesignation"
                  name="jobDesignation"
                  className="calling-tracker-two-input"
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
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Current Location</label>
               {/* line 856 to 926 added by sahil karnekar date 17-10-2024 */}
              <div className="update-calling-check-box-main-container">
              <div className="input-block" style={{display:"block"}}>
                <input
                  type="text"
                  name="currentLocation"
                  value={callingTracker?.currentLocation || ""}
                  onChange={handleChange}
                  placeholder="Enter your location"
                  className="update-calling-check-box-main-container-input"
                />
                 {errors.currentLocation && (
  <div className="error-message">{errors.currentLocation}</div>
)}
</div>
                <input
                   className="update-calling-check-box-main-container-input"
                  type="text"
                  name="fullAddress"
                  placeholder="Full Address"
                  value={callingTracker?.fullAddress || ""}
                  onChange={handleChange}
                  style={{height:"fit-content"}}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Calling Remark</label>
              <div className="update-calling-tracker-field-sub-div">
              <div className="input-block" style={{display:"block"}}>
                <select
                 //  required={callingTracker.selectYesOrNo === "Interested"}
                  className="plain-input"
                  name="callingFeedback"
                  value={callingTracker?.callingFeedback || ""}
                  onChange={handleChange}
                >
                  <option value="">Feedback</option>
                  <option value="Call Done">Call Done</option>
                  <option value="Asked for Call Back">
                    Asked for Call Back
                  </option>
                  <option value="No Answer">No Answer</option>
                  <option value="Network Issue">Network Issue</option>
                  <option value="Invalid Number">Invalid Number</option>
                  <option value="Need to call back">Need to call back</option>
                  <option value="Do not call again">Do not call again</option>
                  <option value="Other">Other</option>
                </select>
                {errors.callingFeedback && (
                    <div className="error-message">{errors.callingFeedback}</div>
                  )}
              </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Date Of Birth</label>
              <div className="update-calling-check-box-main-container">
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

          <div className="update-calling-tracker-row-gray">
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
              <div className="input-block" style={{display:"block"}}>
              <input list="educationListDropDown" 
                  name="qualification"
                  value={callingTracker?.lineUp.qualification || ""}
                    onChange={handleEducationChange}
                  placeholder="Search...."
                  
                  />
                  
                      <datalist id="educationListDropDown"
                        
                      >
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
                    
                    {errors.qualification && (
                      <div className="error-message error-two-input-box">
                        {errors.qualification}
                      </div>
                    )}
                    </div>
                <input
                  type="text"
                  name="lineUp.yearOfPassing"
                  placeholder="Year Of PassOut"
                  value={callingTracker?.lineUp.yearOfPassing || ""}
                  // required={callingTracker.selectYesOrNo === "Interested"}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>
                Upload Resume
                {resumeUploaded && (
                  <FaCheckCircle className="upload-success-icon" />
                )}
              </label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="file"
                  name="resume"
                  // onChange={handleResumeFileChange}
                  accept=".pdf,.doc,.docx"
                  className="plain-input"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Any Extra Certification</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="lineUp.extraCertification"
                  value={callingTracker?.lineUp.extraCertification || ""}
                  onChange={handleChange}
                  className="plain-input"
                  placeholder="Enter Extra Certification"
                />
              </div>
            </div>
          </div>

          <div className=" update-calling-tracker-row-gray">
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
              <div className="input-block" style={{display:"block"}}>
                <input
                  type="text"
                  name="lineUp.experienceYear"
                  value={callingTracker?.lineUp.experienceYear || ""}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  // required={callingTracker.selectYesOrNo === "Interested"}
                  placeholder="Years"
                  maxLength="2"
                />
                {errors.experienceYear && (
  <div className="error-message">{errors.experienceYear}</div>
)}
</div>

                <div className="calling-tracker-two-input">
                  
                  <input
                    type="text"
                    name="lineUp.experienceMonth"
                    onChange={handleChange}
                    value={callingTracker?.lineUp.experienceMonth || ""}
                    placeholder="Months"
                  maxLength="2"
                  min="0"
                  max="11"
                  />
                       {errors.experienceMonth && (
  <div className="error-message">{errors.experienceMonth}</div>
)}
                </div>
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Relevant Experience</label>
              <div className="update-calling-tracker-two-input-container">
                <div className="update-calling-tracker-two-input">
                  <input
                    type="text"
                    name="lineUp.relevantExperience"
                    value={callingTracker?.lineUp.relevantExperience || ""}
                    onChange={handleChange}
                    placeholder="Enter Relevant Experience"
                    // required={callingTracker.selectYesOrNo === "Interested"}
                    maxLength="2"
                  />
                  {errors.relevantExperience && (
  <div className="error-message">{errors.relevantExperience}</div>
)}
                </div>
                <div className="update-calling-tracker-two-input">
                  <input
                    type="text"
                    name="lineUp.noticePeriod"
                    placeholder="Notice Period"
                    value={callingTracker?.lineUp.noticePeriod || ""}
                    onChange={handleChange}
                    min="0"
                    max="90"
                   //  required={callingTracker.selectYesOrNo === "Interested"}
                  />
                  {errors.noticePeriod && (
  <div className="error-message">{errors.noticePeriod}</div>
)}
                </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Communication Rating </label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="communicationRating"
                  value={callingTracker?.communicationRating || ""}
                  onChange={handleChange}
                  className="plain-input"
                  placeholder="Enter Communication Rating"
                // required={callingTracker.selectYesOrNo === "Interested"}
                />
                {errors.communicationRating && (
  <div className="error-message">{errors.communicationRating}</div>
)}
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Current CTC(LPA)</label>
              <div className="update-calling-tracker-two-input-container">
                <input
                  type="text"
                  name="lineUp.currentCTCLakh"
                  value={callingTracker?.lineUp.currentCTCLakh || ""}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Lakh"
                  maxLength="2"
                 // required={callingTracker.selectYesOrNo === "Interested"}
                  pattern="\d*"
                />
                  {errors.currentCTCLakh && (
  <div className="error-message">{errors.currentCTCLakh}</div>
)}
                <input
                  type="text"
                  name="lineUp.currentCTCThousand"
                  value={callingTracker?.lineUp.currentCTCThousand || ""}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Thousand"
                  maxLength="2"
                  pattern="\d*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Expected CTC (LPA)</label>
              <div className="update-calling-tracker-two-input-container">
                <input
                  type="text"
                  name="lineUp.expectedCTCLakh"
                  value={callingTracker?.lineUp.expectedCTCLakh || ""}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Lakh"
                 // required={callingTracker.selectYesOrNo === "Interested"}
                  maxLength="2"
                  pattern="\d*"
                />
                 {errors.expectedCTCLakh && (
  <div className="error-message">{errors.expectedCTCLakh}</div>
)}
                <input
                  type="text"
                  name="lineUp.expectedCTCThousand"
                  value={callingTracker?.lineUp.expectedCTCThousand || ""}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Thousand"
                  maxLength="2"
                  pattern="\d*"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Holding Offer Letter</label>
              <div className="update-calling-tracker-two-input-container">
                <select
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
                {errors.holdingAnyOffer && (
  <div className="error-message">{errors.holdingAnyOffer}</div>
)}
                <input
                  type="text"
                  name="lineUp.offerLetterMsg"
                  placeholder="Letter Message"
                  value={callingTracker?.lineUp.offerLetterMsg || ""}
                  // onChange={handleLineUpChange}
                  onChange={handleChange}
                />
                
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

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Status Type</label>
              <div className="update-calling-tracker-two-input-container">
                <select
                  
                  className="update-calling-tracker-two-input"
                  name="selectYesOrNo"
                  placeholder="Candidate Interested"
                  value={callingTracker?.selectYesOrNo}
                  onChange={handleChange}
                >
                  
                  <option value="Yet To Confirm">Yet To Confirm</option>
                      <option value="Interested">Interested</option>
                      <option value="Interested, will confirm later">Interested, will confirm later</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value=" Interested But Not Eligible">Interested But Not Eligible</option>
                      <option value="Eligible">Eligible</option>
                      <option value="Not Eligible">Not Eligible</option>
                      <option value="Not Eligible But Interested">Not Eligible But Interested</option>
                </select>
                <select
                  type="text"
                  name="lineUp.finalStatus"
                  value={callingTracker?.lineUp.finalStatus}
                  onChange={handleChange}
                 // required={callingTracker.selectYesOrNo === "Interested"}
                >
                  <option value="">Select</option>
                      <option value="Yet To Confirm">Yet To Confirm</option>
                      <option value="Interview Schedule">Interview Schedule</option>
                      <option value="Attending After Some time">Attending After Some time</option>
                </select>
                {errors.finalStatus && (
  <div className="error-message">{errors.finalStatus}</div>
)}
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Interview Slots</label>
              <div className="update-calling-tracker-two-input-container">
              <input
  type="date"
  name="lineUp.availabilityForInterview"
  value={callingTracker?.lineUp.availabilityForInterview || ""}
  onChange={(e) => {
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    if (e.target.value < today) {
      seterrorInterviewSlot("Interview Slot Should be Next Date From Today");
    } else {
      seterrorInterviewSlot(""); // Clear error message if the date is valid
    }

    setCallingTracker((prevState) => ({
      ...prevState,
      lineUp: {
        ...prevState.lineUp,
        availabilityForInterview: e.target.value,
      },
    }));
  }}
  min={new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0]} // Restrict to future dates starting from tomorrow
  className="update-calling-tracker-two-input"
/>

{errorInterviewSlot && (
  <div className="error-message">{errorInterviewSlot}</div>
)}


<TimePicker
  value={callingTracker.lineUp.interviewTime ? dayjs(callingTracker.lineUp.interviewTime, 'h:mm a') : null} 
  onChange={(time) => {
    setCallingTracker((prevState) => ({
      ...prevState,
      lineUp: {
        ...prevState.lineUp,
        interviewTime: time ? time.format('h:mm a') : "",  // Format the time as a string in h:mm a (AM/PM)
      },
    }));
  }}
  format="h:mm a"  // Display format in the picker
  className="update-calling-tracker-two-input"
/>

                
              </div>
            </div>
          </div>
        </div>
        <div className="buttonDiv" style={{ marginTop: "20px", gap: "10px" }}>
          <button type="submit" className="ctf-btn">
            Update Data
          </button>
          <button className="ctf-btn" onClick={onCancel} id="uploadbtn2">
            Cancel
          </button>
        </div>
      </form>
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
              className={`sidebar-item ${activeField === "distance" ? "active" : ""
                }`}
              onClick={() => setActiveField("distance")}
            >
              Distance Calculation
            </p>
            <p
              className={`sidebar-item ${activeField === "salary" ? "active" : ""
                }`}
              onClick={() => setActiveField("salary")}
            >
              Salary Calculation
            </p>
            <p
              className={`sidebar-item ${activeField === "historyTracker" ? "active" : ""
                }`}
              onClick={() => setActiveField("historyTracker")}
            >
              History Tracker
            </p>
            <p
              className={`sidebar-item ${activeField === "previousQuestion" ? "active" : ""
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
